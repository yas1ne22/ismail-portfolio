// Execute shipped component handlers with a hook scheduler. This is bounded
// source/event evidence; it does not replace native browser or AT review.
import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {parseAst} from 'rollup/parseAst';
import * as origin from '../../public/aeokiller/data-origin.js';
import {simulateLegacyAudit,draftLegacyContent} from '../../public/aeokiller/demo-fixtures.js';
import {useLegacyAuditContext,renderLegacyContextNotice} from '../../public/aeokiller/audit-context.js';

let archive;
async function readArchive() {
  if(archive)return archive;
  const source=await fs.readFile(new URL('../../public/aeokiller/assets/index-HPfAPLMS.js',import.meta.url),'utf8');
  const bindings=new Map(),icons=new Set();
  function walk(node){
    if(!node||typeof node!=='object')return;
    if(node.type==='VariableDeclarator'&&node.id?.type==='Identifier'&&node.init)bindings.set(node.id.name,node.init);
    if(node.type==='FunctionDeclaration'&&node.id)bindings.set(node.id.name,node);
    if(node.type==='CallExpression'&&node.callee.object?.name==='s'&&['jsx','jsxs'].includes(node.callee.property?.name)&&node.arguments[0]?.type==='Identifier')icons.add(node.arguments[0].name);
    for(const value of Object.values(node)){if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object'&&value.type)walk(value)}
  }
  walk(parseAst(source));
  const binding=name=>{const node=bindings.get(name);assert.ok(node,'Missing binding '+name);return source.slice(node.start,node.end)};
  const seeds={};
  for(const name of ['Jl','Cm','Em','zm','Am','Pm','Tm','Sm','Ht'])seeds[name]=JSON.parse(JSON.stringify(vm.runInNewContext('('+binding(name)+')')));
  archive={source,icons,binding,seeds};return archive;
}

export async function archivedSeeds(){return structuredClone((await readArchive()).seeds)}
export async function archivedBinding(name){return(await readArchive()).binding(name)}

export async function renderArchivedComponent(name,{pack,sourceKind='bundle',clipboard,props={},extraGlobals={}}={}) {
  const {binding,seeds,icons}=await readArchive();
  pack=pack || {workspace:seeds.Jl[0],promptVolumes:seeds.Cm,citationRecords:seeds.Em,
    competitors:seeds.zm,crawlerLogs:seeds.Am,brandRecords:seeds.Pm,opportunities:seeds.Tm};
  const tagged=origin.tagDemoPackage(pack,sourceKind),slots=[],effects=[],alerts=[];
  let cursor=0,dirty=false,tree;
  const React={
    useState(initial){const index=cursor++;if(!(index in slots))slots[index]=typeof initial==='function'?initial():initial;return[slots[index],value=>{const next=typeof value==='function'?value(slots[index]):value;if(!Object.is(next,slots[index])){slots[index]=next;dirty=true}}]},
    useRef(initial){const index=cursor++;if(!(index in slots))slots[index]={current:initial};return slots[index]},
    useEffect(callback,deps){const index=cursor++;if(!slots[index]||deps.some((value,i)=>!Object.is(value,slots[index][i]))){slots[index]=deps;effects.push(callback)}},
  };
  const runtime={Fragment:'fragment',jsx:(type,props,key)=>({type,props,key}),jsxs:(type,props,key)=>({type,props,key})};
  const globals={...seeds,...origin,E:React,sl:React,s:runtime,zt:()=>tagged,or:()=>[pack.workspace],Im:()=>pack.workspace.id,po:()=>{},
    fo:simulateLegacyAudit,Ru:draftLegacyContent,useLegacyAuditContext,renderLegacyContextNotice,
    navigator:{clipboard},setTimeout:()=>0,console,alert:message=>alerts.push(message),...extraGlobals};
  for(const icon of icons)if(!(icon in globals))globals[icon]=icon;
  const component=vm.runInNewContext('('+binding(name)+')',globals);
  const input={workspaceId:pack.workspace.id,onNavigate:()=>{},onRunSimulationWithPrompt:()=>{},onLogout:()=>{},...props};
  function render(){let count=0;do{if(++count>20)throw Error('Component did not settle');dirty=false;cursor=0;tree=component(input);while(effects.length)effects.shift()()}while(dirty);return tree}
  function nodes(node){return node&&typeof node==='object'?[node,...[node.props?.children].flat(Infinity).flatMap(nodes)]:[]}
  function text(node){return node&&typeof node==='object'?[node.props?.children].flat(Infinity).map(text).join(' '):String(node??'')}
  const all=()=>nodes(tree);
  const get=predicate=>{const node=all().find(predicate);assert.ok(node,'Missing component control');return node};
  const button=label=>get(node=>node.type==='button'&&text(node).replace(/\s+/g,' ').trim()===label);
  const clickNode=async node=>{assert.ok(!node.props.disabled,'Disabled component control');const result=node.props.onClick({stopPropagation(){},preventDefault(){}});render();await result;render()};
  render();
  return {pack:tagged,alerts,runtime,all,get,button,render,text:()=>text(tree),
    click:label=>clickNode(button(label)),clickNode,
    edit:(id,value)=>{get(node=>node.props?.id===id).props.onChange({target:{value}});render()},
    field:id=>get(node=>node.props?.id===id).props,
    setProps:values=>{Object.assign(input,values);render()},
  };
}
