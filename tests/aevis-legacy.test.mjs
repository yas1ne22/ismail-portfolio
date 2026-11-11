import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {parseAst} from 'rollup/parseAst';
import {parseHTML} from 'linkedom';
import {simulateLegacyAudit,draftLegacyContent} from '../public/aeokiller/demo-fixtures.js';

const input={brandName:'Sample Brand',prompt:'Which workspace fits a small team?',category:'Example tools',competitors:['Example One','Example Two','sample brand','example one']};
test('Archived audits make no service request and return the same authored observations before and after draft generation',async()=>{
 const previous=globalThis.fetch;let requests=0;
 globalThis.fetch=async()=>{requests++;throw new Error('A local portfolio fixture must not request a provider');};
 try{
  const before=await simulateLegacyAudit(input);
  await draftLegacyContent({...input,targetTopic:input.prompt});
  const after=await simulateLegacyAudit({...input,isOptimized:true});
  assert.deepEqual(after,before);
  assert.deepEqual(before.competitors,['Example One','Example Two']);
  const rows=before.aeoAnalysis.engineConsensus;
  assert.equal(before.aeoAnalysis.shareOfVoice,100*rows.filter(row=>row.cited).length/rows.length);
  assert.equal(before.aeoAnalysis.aeoScore,before.aeoAnalysis.shareOfVoice);
  assert.ok(rows.every(row=>/not queried/.test(row.verdict)));
  assert.deepEqual(before.aeoAnalysis.citedSources,[]);
  assert.equal(before.provenance.providerRequests,0);
  assert.equal(requests,0);
 }finally{globalThis.fetch=previous;}
});

test('Drafts preserve entered context while leaving unsupported comparison facts and crawler changes unfilled',async()=>{
 const draft=await draftLegacyContent({...input,targetTopic:input.prompt});
 assert.ok(draft.deliverables.invertedPyramidAnswer.includes(input.brandName));
 assert.ok(draft.deliverables.comparisonTable.includes('Not supplied'));
 const schema=JSON.parse(draft.deliverables.jsonLdSchema);
 assert.equal(schema.mainEntity[0].name,input.prompt);
 assert.equal(schema.mainEntity[0].acceptedAnswer.text,draft.deliverables.invertedPyramidAnswer);
 assert.doesNotMatch(draft.deliverables.crawlerDirectives,/^\s*(?:User-agent|Allow|Disallow)\s*:/mi);
 assert.doesNotMatch(JSON.stringify(draft),/instant #1|definitive solution|outperform|verified benchmark|100% extraction|zero hallucination/i);
});

test('The archived UI uses the reviewed fixture module and has no audit or scrape API call left',async()=>{
 const source=await fs.readFile(new URL('../public/aeokiller/assets/index-HPfAPLMS.js',import.meta.url),'utf8');
 const ast=parseAst(source),apiCalls=[],names=new Set();
 function walk(node){
  if(!node||typeof node!=='object')return;
  if(node.type==='CallExpression'&&node.callee.type==='Identifier'){
   if(['fo','Ru'].includes(node.callee.name))names.add(node.callee.name);
   if(node.callee.name==='fetch'&&node.arguments[0]?.type==='Literal'&&/^\/api\//.test(node.arguments[0].value))apiCalls.push(node.arguments[0].value);
  }
  for(const value of Object.values(node))if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object'&&value.type)walk(value);
 }
 walk(ast);
 const imported=ast.body.find(node=>node.type==='ImportDeclaration'&&node.source.value.startsWith('../demo-fixtures.js'));
 assert.ok(imported);
 assert.deepEqual(imported.specifiers.map(node=>[node.imported.name,node.local.name]),[['simulateLegacyAudit','fo'],['draftLegacyContent','Ru']]);
 assert.deepEqual([...names].sort(),['Ru','fo']);
 assert.deepEqual(apiCalls,[]);
 assert.doesNotMatch(source,/instant #1|verify your brand captures|Optimization Verified Across All AI Engines|84% \(\+62% Gain\)|is the definitive solution|zero hallucination|Sockets connected|42\/100|96\/100|Sample position 1|99\.4%|\+18% SOV|zero-ambiguity entity grounding/);
 assert.ok(source.includes('children:S.cited?"Illustrative position "+S.rank:"Illustrative omission"'));
});

test('The prototype context and case exits are readable before React loads',async()=>{
 const {document}=parseHTML(await fs.readFile(new URL('../public/aeokiller/index.html',import.meta.url),'utf8'));
 const context=document.querySelector('aside.aevis-demo-context');assert.ok(context);
 assert.match(context.textContent,/illustrative/);
 assert.match(context.textContent,/No live engine collection/);
 assert.ok(context.querySelector('a[href="/projects/aevis/index.html"]'));
 assert.ok(context.querySelector('a[href="/projects/aevis/study.html"]'));
 assert.equal(document.body.firstElementChild,context);
 assert.match(document.title,/demonstration/);
});
