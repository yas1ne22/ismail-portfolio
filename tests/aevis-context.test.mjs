import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {parseAst} from 'rollup/parseAst';
import {createLegacyAuditContext,transitionLegacyAuditContext,useLegacyAuditContext,renderLegacyContextNotice} from '../public/aeokiller/audit-context.js';
import {simulateLegacyAudit,draftLegacyContent} from '../public/aeokiller/demo-fixtures.js';

const presets=[
 {id:'travel',name:'Travel',defaultBrand:'Acme Travel',category:'Travel planning',defaultCompetitors:['Example Trips'],defaultQuery:'What does Acme Travel offer?',sampleQueries:['Compare Acme Travel with Example Trips']},
 {id:'studio',name:'Studio',defaultBrand:'Nova Studio',category:'Design services',defaultCompetitors:['Example Design'],defaultQuery:'What does Nova Studio offer?',sampleQueries:[]},
];
const workspace={primaryBrand:'Acme Travel',category:'Travel planning',competitors:['Example Trips']};
const create=options=>createLegacyAuditContext({workspaceId:'travel',workspace,presets,...options});
const step=(state,action)=>transitionLegacyAuditContext(state,action,presets);

test('Unknown or partially matching workspaces never inherit unrelated competitors or a selected preset',()=>{
 const custom=create({workspace:{primaryBrand:'Custom brand',category:'Custom industry'}});
 assert.equal(custom.presetId,null);assert.equal(custom.context.competitors,'');
 assert.match(custom.context.query,/Custom brand/);
 assert.equal(create({workspace:{...workspace,category:'Another industry'}}).presetId,null);
 assert.equal(create({initialPrompt:'A deliberate question'}).presetId,null);
 assert.equal(create().presetId,'travel');
});

test('An edited context survives a pending preset choice, and confirmed replacement updates all four fields',()=>{
 let state=step(create(),{type:'edit',field:'brand',value:'Custom brand'});
 state=step(state,{type:'edit',field:'query',value:'My deliberate question'});
 const edited=structuredClone(state.context),version=state.version;
 state=step(state,{type:'request-preset',id:'studio'});
 assert.deepEqual(state.context,edited);assert.equal(state.version,version);assert.equal(state.pendingPresetId,'studio');
 state=step(state,{type:'review'});assert.equal(state.review,null);
 state=step(state,{type:'keep-context'});assert.deepEqual(state.context,edited);assert.equal(state.pendingPresetId,null);
 state=step(step(state,{type:'request-preset',id:'studio'}),{type:'apply-preset'});
 assert.deepEqual(state.context,{brand:'Nova Studio',industry:'Design services',competitors:'Example Design',query:'What does Nova Studio offer?'});
 assert.equal(state.presetId,'studio');assert.equal(state.dirty,false);assert.equal(state.review,null);
});

test('Every meaningful field edit invalidates the reviewed snapshot and clears a pending replacement',()=>{
 for(const field of ['brand','industry','competitors','query']) {
  let state=step(create(),{type:'review'});assert.ok(state.review);
  const revision=state.version;
  state=step(state,{type:'edit',field,value:'Deliberate '+field});
  assert.equal(state.review,null);assert.equal(state.presetId,null);assert.equal(state.version,revision+1);
  state=step(state,{type:'request-preset',id:'studio'});
  state=step(state,{type:'edit',field,value:'Further '+field});assert.equal(state.pendingPresetId,null);
 }
});

test('Review validates required fields and shows the exact normalized competitor scope, including no competitors',()=>{
 let state=create({workspace:{primaryBrand:'  Custom brand  ',category:'  Software  ',competitors:['Custom brand','Peer A','peer a','  Peer B ' ]},initialPrompt:'  A precise question?  '});
 state=step(state,{type:'review'});
 assert.deepEqual(state.review.context,{brand:'Custom brand',industry:'Software',competitors:['Peer A','Peer B'],query:'A precise question?'});
 state=step(state,{type:'edit',field:'competitors',value:''});state=step(state,{type:'review'});
 assert.deepEqual(state.review.context.competitors,[]);
 state=step(state,{type:'edit',field:'brand',value:'   '});state=step(state,{type:'review'});
 assert.equal(state.review,null);assert.match(state.error,/Complete brand/);
});

// Run the actual shipped JSX component with a small hook scheduler. These are
// event/payload contracts, not a substitute for React/browser/AT observations.
async function shippedWorkflow({deferAudit=false}={}) {
 const source=await fs.readFile(new URL('../public/aeokiller/assets/index-HPfAPLMS.js',import.meta.url),'utf8');
 const ast=parseAst(source);let owner,presetNode;const icons=new Set();
 function walk(node,functions=[]) {
  if(!node||typeof node!=='object')return;
  if(node.type==='VariableDeclarator'&&node.id?.name==='Ht')presetNode=node.init;
  if(node.type==='Literal'&&node.value==='Step 1: Choose Your Industry Preset (or enter your custom brand)')owner=functions.at(-1);
  if(node.type==='CallExpression'&&node.callee.object?.name==='s'&&['jsx','jsxs'].includes(node.callee.property?.name)&&node.arguments[0]?.type==='Identifier')icons.add(node.arguments[0].name);
  const next=/Function/.test(node.type)?[...functions,node]:functions;
  for(const value of Object.values(node)){if(Array.isArray(value))value.forEach(node=>walk(node,next));else if(value&&typeof value==='object'&&value.type)walk(value,next)}
 }
 walk(ast);assert.ok(owner);assert.ok(presetNode);
 const actualPresets=vm.runInNewContext('('+source.slice(presetNode.start,presetNode.end)+')');
 const first=actualPresets[1];let activeWorkspace={primaryBrand:first.defaultBrand,category:first.category,competitors:[...first.defaultCompetitors]};
 const props={workspaceId:'workspace-one',initialPrompt:''};
 const slots=[],calls=[];let cursor=0,dirty=false,tree,pendingResolve;
 const effects=[];
 const React={
  useState(initial){const index=cursor++;if(!(index in slots))slots[index]=typeof initial==='function'?initial():initial;return[slots[index],value=>{const next=typeof value==='function'?value(slots[index]):value;if(!Object.is(next,slots[index])){slots[index]=next;dirty=true}}]},
  useRef(initial){const index=cursor++;if(!(index in slots))slots[index]={current:initial};return slots[index]},
  useEffect(callback,deps){const index=cursor++;if(!slots[index]||deps.some((value,i)=>!Object.is(value,slots[index][i]))){slots[index]=deps;effects.push(callback)}},
 };
 const runtime={Fragment:'fragment',jsx:(type,props,key)=>({type,props,key}),jsxs:(type,props,key)=>({type,props,key})};
 const globals={E:React,s:runtime,Ht:actualPresets,zt:()=>({workspace:activeWorkspace}),useLegacyAuditContext,renderLegacyContextNotice,
  fo:async input=>{calls.push(input);if(deferAudit)await new Promise(resolve=>pendingResolve=resolve);return simulateLegacyAudit(input)},Ru:draftLegacyContent,console};
 for(const name of icons)if(!(name in globals))globals[name]=name;
 const component=vm.runInNewContext('('+source.slice(owner.start,owner.end)+')',globals);
 function render(){let count=0;do{if(++count>12)throw Error('Render did not settle');dirty=false;cursor=0;tree=component(props);while(effects.length)effects.shift()()}while(dirty);return tree}
 function nodes(node){if(!node||typeof node!=='object')return[];return[node,...[node.props?.children].flat(Infinity).flatMap(child=>nodes(child))]}
 const text=node=>typeof node==='string'||typeof node==='number'?String(node):[node?.props?.children].flat(Infinity).map(child=>child&&typeof child==='object'?text(child):String(child??'')).join(' ');
 const get=predicate=>{const node=nodes(tree).find(predicate);assert.ok(node,'Missing shipped workflow control');return node};
 const button=label=>get(node=>node.type==='button'&&text(node).replace(/\s+/g,' ').trim()===label);
 render();
 return {presets:actualPresets,calls,render,text:()=>text(tree),button,
  click:async label=>{const node=button(label);assert.ok(!node.props.disabled,'Control is disabled');const result=node.props.onClick();render();await result;render()},
  start:label=>{const result=button(label).props.onClick();render();return result.then(()=>render())},
  edit:(id,value)=>{get(node=>node.props?.id===id).props.onChange({target:{value}});render()},
  field:id=>get(node=>node.props?.id===id).props.value,
  rerenderWorkspace:next=>{activeWorkspace=next;render()},
  changeWorkspace:(id,next)=>{props.workspaceId=id;activeWorkspace=next;render()},
  resolve:()=>pendingResolve(),
 };
}

test('The shipped workflow reviews every preset atomically, preserves custom edits, and sends only confirmed fields',async()=>{
 const ui=await shippedWorkflow();
 for(const preset of ui.presets) {
  await ui.click(`${preset.icon} ${preset.name} ${preset.defaultBrand}`);
  assert.equal(ui.field('aevis-audit-brand'),preset.defaultBrand);
  assert.equal(ui.field('aevis-audit-industry'),preset.category);
  assert.equal(ui.field('aevis-audit-competitors'),preset.defaultCompetitors.join(', '));
  assert.equal(ui.field('aevis-audit-query'),preset.defaultQuery);
 }
 ui.edit('aevis-audit-brand','Edited brand');ui.edit('aevis-audit-query','A deliberate edited question');
 assert.match(ui.text(),/Custom context/);
 const target=ui.presets[1];await ui.click(`${target.icon} ${target.name} ${target.defaultBrand}`);
 assert.equal(ui.field('aevis-audit-brand'),'Edited brand');
 await ui.click('Keep my edited context');assert.equal(ui.field('aevis-audit-query'),'A deliberate edited question');
 await ui.click('Review complete audit context');assert.equal(ui.calls.length,0);
 assert.match(ui.text(),/Confirm the complete audit context/);
 await ui.click('Run simulated audit with this context');assert.equal(ui.calls.length,1);
 assert.equal(ui.calls[0].brandName,'Edited brand');assert.equal(ui.calls[0].prompt,'A deliberate edited question');
 assert.match(ui.text(),/Authored fixture: two of four/);
 ui.edit('aevis-audit-industry','Edited industry');assert.doesNotMatch(ui.text(),/Authored fixture: two of four/);
 ui.rerenderWorkspace({...workspace});assert.equal(ui.field('aevis-audit-industry'),'Edited industry');
 await ui.click(`${target.icon} ${target.name} ${target.defaultBrand}`);await ui.click('Apply all four preset fields');
 assert.equal(ui.field('aevis-audit-query'),target.defaultQuery);
});

test('A late shipped audit cannot repopulate results after a field edit or workspace change',async()=>{
 const ui=await shippedWorkflow({deferAudit:true});await ui.click('Review complete audit context');
 const pending=ui.start('Run simulated audit with this context');assert.equal(ui.calls.length,1);
 ui.edit('aevis-audit-brand','New intentional brand');ui.resolve();await pending;
 assert.equal(ui.field('aevis-audit-brand'),'New intentional brand');assert.doesNotMatch(ui.text(),/Authored fixture: two of four/);
 ui.changeWorkspace('workspace-two',{primaryBrand:'Unlisted brand',category:'New category',competitors:[]});
 assert.equal(ui.field('aevis-audit-brand'),'Unlisted brand');assert.equal(ui.field('aevis-audit-competitors'),'');
 assert.match(ui.text(),/Custom context/);
 await ui.click('Review complete audit context');const second=ui.start('Run simulated audit with this context');
 ui.changeWorkspace('workspace-three',{primaryBrand:'Third brand',category:'Third category',competitors:[]});
 ui.resolve();await second;
 assert.equal(ui.field('aevis-audit-brand'),'Third brand');assert.doesNotMatch(ui.text(),/Authored fixture: two of four/);
});

test('Editing a field while a replacement choice is open retains typing focus',async()=>{
 const previous=globalThis.document,focus=[];
 globalThis.document={getElementById:id=>({focus:()=>focus.push(id),scrollIntoView(){}})};
 try {
  const ui=await shippedWorkflow();ui.edit('aevis-audit-brand','Intentional brand');
  const target=ui.presets[0];await ui.click(`${target.icon} ${target.name} ${target.defaultBrand}`);
  assert.equal(focus.at(-1),'aevis-audit-preset-choice');
  const count=focus.length;ui.edit('aevis-audit-industry','An industry being typed');
  assert.equal(focus.length,count);assert.equal(ui.field('aevis-audit-industry'),'An industry being typed');
  assert.match(ui.text(),/Context edited/);
 } finally {if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
});
