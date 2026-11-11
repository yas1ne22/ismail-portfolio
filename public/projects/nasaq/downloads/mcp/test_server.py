"""Protocol checks over a real subprocess pipe; no external packages."""
import json,subprocess,sys
from pathlib import Path
p=subprocess.Popen([sys.executable,str(Path(__file__).with_name('server.py'))],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
i=0
checks=0
def rpc(method,params=None):
 global i,checks
 i+=1;p.stdin.write(json.dumps({'jsonrpc':'2.0','id':i,'method':method,'params':params or {}})+'\n');p.stdin.flush()
 result=json.loads(p.stdout.readline());assert result['id']==i;checks+=1;return result
try:
 assert rpc('tools/list')['error']['code']==-32002
 init=rpc('initialize',{'protocolVersion':'2025-06-18','capabilities':{},'clientInfo':{'name':'nasaq-test','version':'1'}})['result']
 assert init['protocolVersion']=='2025-06-18' and set(init['capabilities'])=={'tools','resources','prompts'}
 p.stdin.write(json.dumps({'jsonrpc':'2.0','method':'notifications/initialized'})+'\n');p.stdin.flush()
 tools=rpc('tools/list')['result']['tools'];assert len(tools)==6
 def tool(tool_name,**args):return rpc('tools/call',{'name':tool_name,'arguments':args})['result']
 assert json.loads(tool('search_nasaq',query='switch')['content'][0]['text'])['total']>0
 comp=json.loads(tool('get_component',id='switch')['content'][0]['text']);assert len(comp['states'])==6 and 'role="switch"' in comp['html']
 assert len(json.loads(tool('get_tokens',prefix='component.switch')['content'][0]['text']))==9
 assert 'html' in json.loads(tool('get_pattern',id='sources')['content'][0]['text'])
 for section in ('skill','brand','tokens','ai','motion','typography','colors'):assert len(tool('get_guidelines',section=section)['content'][0]['text'])>100
 assert '<svg' in json.loads(tool('get_asset',name='misc-orbit.svg')['content'][0]['text'])['content']
 assert '<svg' in json.loads(tool('get_asset',name='lucide/search.svg')['content'][0]['text'])['content']
 assert '<svg' in json.loads(tool('get_asset',name='brand/lockup-horizontal.svg')['content'][0]['text'])['content']
 for name,args in [('get_asset',{'name':'../server.py'}),('get_component',{'id':'missing'}),('get_tokens',{'prefix':22}),('get_tokens',{'unknown':'value'})]:assert tool(name,**args)['isError']
 assert json.loads(tool('get_component',id='switch',language='en')['content'][0]['text'])['name']=='Switch'
 assert json.loads(tool('get_pattern',id='chat',language='en')['content'][0]['text'])['name']=='Chat'
 assert tool('get_component',id='switch',language='fr')['isError']
 assert json.loads(tool('search_nasaq',query='conversation',language='en')['content'][0]['text'])['total']>0
 resources=rpc('resources/list')['result']['resources'];assert len(resources)==6
 for r in resources:assert rpc('resources/read',{'uri':r['uri']})['result']['contents'][0]['text']
 assert rpc('resources/read',{'uri':'file:///etc/passwd'})['error']['code']==-32002
 assert rpc('prompts/list')['result']['prompts'][0]['name']=='apply_nasaq'
 assert 'chat screen' in rpc('prompts/get',{'name':'apply_nasaq','arguments':{'task':'chat screen'}})['result']['messages'][0]['content']['text']
 assert rpc('prompts/get',{'name':'apply_nasaq'})['error']['code']==-32602
 assert rpc('unknown/method')['error']['code']==-32601
 assert rpc('ping')['result']=={}
 p.stdin.write('broken json\n');p.stdin.flush();assert json.loads(p.stdout.readline())['error']['code']==-32700
 print(f'MCP passed: {checks+1} exchanges, all six tools, resources, prompt, errors, path isolation.')
finally:
 p.stdin.close();p.wait(timeout=5);assert not p.stderr.read()
