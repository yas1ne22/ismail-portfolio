import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {demoViewSources,tagDemoPackage,renderDemoViewSource,describeUnfetchedUrl,makeDemoBrandRecord,serializeDemoBrandNotes,copyDemoBrandNotes} from '../public/aeokiller/data-origin.js';
import {archivedSeeds,archivedBinding,renderArchivedComponent} from './helpers/aevis-render.mjs';

test('Every archived view has an explicit source, definitions and no-collection boundary',async()=>{
 const expected=['simulator','overview','insights','prompts','benchmark','optimizer','crawlers','records'];
 assert.deepEqual(Object.keys(demoViewSources),expected);
 for(const source of Object.values(demoViewSources)){assert.ok(source.summary);assert.ok(source.definitions.length>=2)}
 const packageValue={workspace:{primaryBrand:'Entered brand'}};
 assert.equal(tagDemoPackage(packageValue,'bundle').demoSource,'bundled_examples');
 assert.equal(tagDemoPackage(packageValue,'local').demoSource,'unverified_local_examples');
 assert.equal(packageValue.demoSource,undefined);
 const ui=await renderArchivedComponent('Gm',{sourceKind:'local'});
 for(const [label,view] of [['AI Simulator & Optimizer 4-Step Loop','simulator'],['Command Center','overview'],['Citation examples','insights'],['Prompt Volumes','prompts'],['Competitor SOV','benchmark'],['Agent Studio','optimizer'],['Crawler examples','crawlers'],['Brand Vault','records']]){
  await ui.click(label);
  const panel=ui.get(node=>node.props?.['data-demo-view']===view);
  assert.equal(panel.props.id,'aevis-view-origin');
  assert.match(ui.text(),/No provider collection, source retrieval or external publication/);
  assert.match(ui.text(),/No collection date or measured outcome/);
  if(!['simulator','optimizer'].includes(view))assert.match(ui.text(),/Unverified local example data/);
 }
});

test('The shipped package loader distinguishes bundled examples from unverified stored packages',async()=>{
 const seeds=await archivedSeeds();
 const globals={...seeds,tagDemoPackage,or:()=>seeds.Jl,Xe:{PACKAGE_PREFIX:'sample:'},localStorage:{getItem:()=>null},console};
 const loader=vm.runInNewContext('('+await archivedBinding('zt')+')',globals);
 assert.equal(loader('ramp').demoSource,'bundled_examples');
 globals.localStorage.getItem=()=>JSON.stringify({workspace:{primaryBrand:'Custom'},promptVolumes:[]});
 const saved=loader('custom');assert.equal(saved.demoSource,'unverified_local_examples');assert.equal(saved.workspace.primaryBrand,'Custom');
});

test('URL parsing discloses unknown access and never turns local syntax into a network success',async()=>{
 const previous=globalThis.fetch;let requests=0;globalThis.fetch=async()=>{requests++;throw Error('No URL collection is connected')};
 try {
  const message=describeUnfetchedUrl(' https://example.com/pricing?token=sample#details ');
  assert.match(message,/Parsed locally: example.com\/pricing/);assert.match(message,/Not fetched/);assert.match(message,/HTTP status.*unknown/);
  assert.doesNotMatch(message,/token=|200 OK|fully accessible|No Disallow/);
  for(const value of ['not a url','javascript:alert(1)','ftp://example.com','https://name:secret@example.com'])assert.match(describeUnfetchedUrl(value),/Nothing was fetched or checked/);
  const ui=await renderArchivedComponent('$m');
  ui.edit('aevis-local-url','https://example.com/testing');await ui.click('Parse URL locally');
  assert.match(ui.text(),/Parsed locally: example.com\/testing/);assert.match(ui.text(),/crawler access and indexability are unknown/);
  ui.edit('aevis-local-url','malformed');assert.doesNotMatch(ui.text(),/Parsed locally:/);
  await ui.click('Parse URL locally');assert.match(ui.text(),/Enter a valid http/);
  assert.equal(requests,0);
 } finally {globalThis.fetch=previous;}
});

test('Brand notes never acquire invented verification or citation frequency, including in copied text',()=>{
 const entry=makeDemoBrandRecord({title:'  Review note ',category:'Pricing',content:'  Entered sample claim '},new Date('2026-10-21T12:00:00Z'));
 assert.equal(entry.title,'Review note');assert.equal(entry.content,'Entered sample claim');assert.equal(entry.origin,'entered_context');
 assert.equal(entry.verifiedBy,null);assert.equal(entry.lastVerified,null);assert.equal(entry.citedFrequency,null);
 assert.throws(()=>makeDemoBrandRecord({title:'',content:'A note'}),/required/);
 assert.throws(()=>makeDemoBrandRecord({content:'A note'}),/required/);
 const output=serializeDemoBrandNotes('Sample brand',[entry,{title:'Legacy example',category:'Security',content:'Unverified text',lastVerified:'2025-01-01',verifiedBy:'Old administrator',citedFrequency:99}]);
 assert.match(output,/Unverified portfolio notes/);assert.match(output,/Citation frequency: not measured/);assert.match(output,/not a verification or provider collection date/);
 assert.doesNotMatch(output,/\nVerified:|Ground Truth|Canonical knowledge base|Old administrator|99 times/);
});

test('Copy feedback waits for clipboard completion and exposes exact text when clipboard access fails',async()=>{
 let finish,copied;const pending=copyDemoBrandNotes('Unverified notes',{writeText:text=>new Promise(resolve=>{copied=text;finish=resolve})});
 let settled=false;pending.then(()=>settled=true);await Promise.resolve();assert.equal(settled,false);
 assert.equal(copied,'Unverified notes');finish();assert.equal((await pending).state,'copied');
 const unavailable=await copyDemoBrandNotes('Exact unverified fallback',{writeText:async()=>{throw Error('Denied')}});
 assert.equal(unavailable.state,'unavailable');assert.equal(unavailable.text,'Exact unverified fallback');
});

test('The shipped Brand Vault labels local entries and supplies a readable copy fallback without claiming verification',async()=>{
 const ui=await renderArchivedComponent('Bm',{clipboard:{writeText:async()=>{throw Error('Denied')}}});
 assert.doesNotMatch(ui.text(),/Cited \d+ times|Brand Administrator/);
 await ui.click('Add page-local note');assert.ok(ui.button('Add page-local example').props.disabled);
 ui.edit('aevis-note-title','Explicit test note');ui.edit('aevis-note-content','A claim requiring independent evidence');
 await ui.click('Add page-local example');assert.match(ui.text(),/Explicit test note/);assert.match(ui.text(),/Entered context · unverified/);
 await ui.click('Copy unverified brand notes');assert.match(ui.text(),/Clipboard access is unavailable/);
 const text=ui.field('aevis-brand-notes-copy').value;
 assert.match(text,/Explicit test note/);assert.match(text,/Nothing was published/);assert.doesNotMatch(text,/\nVerified:/);
 assert.equal(ui.field('aevis-brand-notes-copy').readOnly,true);
});

test('Citation details and draft defaults retain explicit example boundaries in shipped views',async()=>{
 const citations=await renderArchivedComponent('Lm');
 const inspect=citations.all().find(node=>node.type==='button'&&JSON.stringify(node.props?.children).includes('Inspect unverified source examples'));
 assert.ok(inspect);await citations.clickNode(inspect);
 assert.match(citations.text(),/Authored source examples · no model analysis/);assert.match(citations.text(),/Example date:/);
 const studio=await renderArchivedComponent('Dm');
 assert.doesNotMatch(studio.text(),/win generative search citations/);
 await studio.click('Prepare unverified draft');assert.match(studio.text(),/DRAFT FOR REVIEW/);assert.match(studio.text(),/No engine, crawler or publisher ran/);
});
