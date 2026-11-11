#!/usr/bin/env python3
"""Nasaq read-only MCP server. Python 3.10+, newline-delimited stdio JSON-RPC."""
import json, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent
CATALOG = json.loads((ROOT / 'catalog.json').read_text(encoding='utf-8'))
CATALOG_EN = json.loads((ROOT / 'catalog.en.json').read_text(encoding='utf-8'))
TOKENS = json.loads((ROOT / 'tokens.json').read_text(encoding='utf-8'))
VERSIONS = ('2025-06-18', '2025-03-26', '2024-11-05')
FLAT = {}
def flatten(node, prefix=''):
    for key, value in node.items():
        if key.startswith('$'): continue
        name = f'{prefix}.{key}' if prefix else key
        if isinstance(value, dict) and '$value' in value: FLAT[name] = value
        elif isinstance(value, dict): flatten(value, name)
flatten(TOKENS)
def resolve(value, trail=()):
    if isinstance(value, str) and value.startswith('{') and value.endswith('}'):
        key = value[1:-1]
        if key in trail or key not in FLAT: raise ValueError('Invalid token reference')
        return resolve(FLAT[key]['$value'], trail + (key,))
    if isinstance(value, dict): return {k:resolve(v, trail) for k,v in value.items()}
    if isinstance(value, list): return [resolve(v, trail) for v in value]
    return value
DEFS = [
 ('search_nasaq','Search Nasaq components, patterns, tokens and asset names.','query',True),
 ('get_component','Get a component with HTML, state specimens, properties and implementation rules.','id',True),
 ('get_tokens','Get typed tokens and resolved values; optional exact prefix.','prefix',False),
 ('get_pattern','Get a composition and its implementation guidance.','id',True),
 ('get_guidelines','Read skill, brand, tokens, ai, motion, typography or colors guidance.','section',True),
 ('get_asset','Read an allowed SVG/CSS asset or get local font metadata.','name',True)]
TOOLS = [{'name':n,'description':d,'inputSchema':{'type':'object','properties':{a:{'type':'string','maxLength':200}},'required':[a] if required else [],'additionalProperties':False},'annotations':{'readOnlyHint':True,'destructiveHint':False,'idempotentHint':True,'openWorldHint':False}} for n,d,a,required in DEFS]
for tool in TOOLS:
    if tool['name'] in ('get_component','get_pattern','search_nasaq'):
        tool['inputSchema']['properties']['language']={'type':'string','enum':['ar','en']}
RESOURCES = [{'uri':'nasaq://'+name,'name':name,'mimeType':mime} for name,mime in [('tokens','application/json'),('catalog','application/json'),('skill','text/markdown'),('brand','text/markdown'),('motion','text/markdown'),('catalog-en','application/json')]]
def guide(section):
    names = {'skill':'SKILL.md','brand':'brand.md','tokens':'tokens.md','ai':'ai.md','motion':'motion.md','typography':'typography.md','colors':'colors.md'}
    if section not in names: raise ValueError('Unknown section. Use skill, brand, tokens, ai, motion, typography or colors.')
    return (ROOT / names[section]).read_text(encoding='utf-8')
def call_tool(name, args):
    definition = next((t for t in TOOLS if t['name']==name), None)
    if not definition: raise ValueError('Unknown tool')
    schema = definition['inputSchema']
    if not isinstance(args, dict) or set(args)-set(schema['properties']) or any(k not in args for k in schema['required']): raise ValueError('Invalid tool arguments')
    if any(not isinstance(v,str) or len(v)>200 for v in args.values()): raise ValueError('Arguments must be strings of at most 200 characters')
    language=args.get('language','ar')
    if language not in ('ar','en'): raise ValueError('Language must be ar or en')
    catalog=CATALOG_EN if language=='en' else CATALOG
    if name=='get_tokens':
        prefix=args.get('prefix','')
        return {k:{**v,'resolved':resolve(v['$value'])} for k,v in FLAT.items() if not prefix or k==prefix or k.startswith(prefix+'.')}
    if name=='get_component':
        if args['id'] not in catalog['components']: raise ValueError('Unknown component id; use search_nasaq')
        return catalog['components'][args['id']]
    if name=='get_pattern':
        if args['id'] not in catalog['patterns']: raise ValueError('Unknown pattern id; use search_nasaq')
        return catalog['patterns'][args['id']]
    if name=='get_guidelines': return guide(args['section'])
    if name=='get_asset':
        name=args['name']; meta=CATALOG['assets'].get(name)
        if not meta: raise ValueError('Unknown asset name; paths are not accepted')
        asset=ROOT/'assets'/name
        if asset.suffix in ('.svg','.css','.json'): return {'name':name,'content':asset.read_text(encoding='utf-8'),**meta}
        return {'name':name,'localPath':str(asset),'note':'Copy this bundled font with its SIL OFL license.',**meta}
    query=args['query'].casefold().strip()
    if not query: raise ValueError('Search query cannot be empty')
    results=[]
    for category in ('components','patterns','assets'):
        for key,item in (CATALOG['assets'] if category=='assets' else catalog[category]).items():
            if query in (key+' '+json.dumps(item,ensure_ascii=False)).casefold(): results.append({'kind':category,'id':key,'label':item.get('name',item.get('desc',key))})
    for key in FLAT:
        if query in key.casefold(): results.append({'kind':'token','id':key})
    return {'results':results[:100],'total':len(results),'truncated':len(results)>100}
def content(value): return [{'type':'text','text':value if isinstance(value,str) else json.dumps(value,ensure_ascii=False)}]
initialized=False
ready=False
def dispatch(method, params):
    global initialized, ready
    if method=='initialize':
        if not isinstance(params.get('protocolVersion'),str): raise RpcError(-32602,'protocolVersion is required')
        initialized=True; ready=False
        return {'protocolVersion':params['protocolVersion'] if params['protocolVersion'] in VERSIONS else VERSIONS[0],'capabilities':{'tools':{'listChanged':False},'resources':{'subscribe':False,'listChanged':False},'prompts':{'listChanged':False}},'serverInfo':{'name':'nasaq','version':'1.5.0'},'instructions':'Use the supplied Nasaq rules and tokens. Arabic RTL with Almarai; English LTR with Inter. Request language=en for English components/patterns. All tools are read-only.'}
    if method=='notifications/initialized':
        if initialized: ready=True
        return None
    if method=='ping': return {}
    if method.startswith('notifications/'): return None
    if not ready: raise RpcError(-32002,'Initialize and send notifications/initialized first')
    if method=='tools/list': return {'tools':TOOLS}
    if method=='tools/call':
        if not isinstance(params.get('name'),str): raise RpcError(-32602,'Tool name required')
        if not any(t['name']==params['name'] for t in TOOLS): raise RpcError(-32602,'Unknown tool')
        try: return {'content':content(call_tool(params['name'],params.get('arguments',{}))),'isError':False}
        except ValueError as e: return {'content':content(str(e)),'isError':True}
    if method=='resources/list': return {'resources':RESOURCES}
    if method=='resources/read':
        uri=params.get('uri'); resource=next((r for r in RESOURCES if r['uri']==uri),None)
        if not resource: raise RpcError(-32002,'Unknown resource URI')
        name=resource['name']; value=TOKENS if name=='tokens' else CATALOG if name=='catalog' else CATALOG_EN if name=='catalog-en' else guide(name)
        return {'contents':[{'uri':uri,'mimeType':resource['mimeType'],'text':content(value)[0]['text']}]}
    if method=='prompts/list': return {'prompts':[{'name':'apply_nasaq','description':'Apply Nasaq to a concrete project task.','arguments':[{'name':'task','description':'Screen, framework, and required behavior.','required':True}]}]}
    if method=='prompts/get':
        task=params.get('arguments',{}).get('task')
        if params.get('name')!='apply_nasaq' or not isinstance(task,str) or not task.strip(): raise RpcError(-32602,'Known prompt and nonempty task required')
        return {'description':'Nasaq implementation workflow','messages':[{'role':'user','content':{'type':'text','text':guide('skill')+'\n\nProject task supplied by user:\n'+task}}]}
    raise RpcError(-32601,'Method not found')
class RpcError(Exception):
    def __init__(self,code,message): self.code=code; self.message=message
def reply(message):
    req_id=None
    try:
        req=json.loads(message)
        if not isinstance(req,dict) or req.get('jsonrpc')!='2.0' or not isinstance(req.get('method'),str): raise RpcError(-32600,'Invalid Request')
        req_id=req.get('id')
        if 'id' in req and (isinstance(req_id,bool) or not isinstance(req_id,(str,int))): raise RpcError(-32600,'Invalid request id')
        params=req.get('params',{})
        if not isinstance(params,dict): raise RpcError(-32602,'Params must be an object')
        result=dispatch(req['method'],params)
        if 'id' not in req: return None
        return {'jsonrpc':'2.0','id':req_id,'result':result}
    except json.JSONDecodeError: return {'jsonrpc':'2.0','id':None,'error':{'code':-32700,'message':'Parse error'}}
    except RpcError as e:
        if 'req' in locals() and isinstance(req,dict) and 'id' not in req and e.code!=-32600: return None
        return {'jsonrpc':'2.0','id':req_id,'error':{'code':e.code,'message':e.message}}
    except Exception:
        print('Nasaq: request failed',file=sys.stderr)
        return {'jsonrpc':'2.0','id':req_id,'error':{'code':-32603,'message':'Internal error'}}
if __name__=='__main__':
    for line in sys.stdin:
        if not line.strip(): continue
        response=reply(line)
        if response is not None: print(json.dumps(response,ensure_ascii=False,separators=(',',':')),flush=True)
