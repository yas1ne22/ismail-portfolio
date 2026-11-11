import fs from 'node:fs/promises';
import {parseAst} from 'rollup/parseAst';
import {writeIfChanged} from '../lib/writeIfChanged.js';

const file = new URL('../public/aeokiller/assets/index-HPfAPLMS.js',import.meta.url);
let source = await fs.readFile(file,'utf8');
const imported = 'import {simulateLegacyAudit as fo,draftLegacyContent as Ru} from "../demo-fixtures.js?review=20261021";';
if (!source.startsWith(imported)) {
  const ast = parseAst(source), edits = [];
  for (const name of ['fo','Ru']) {
    const node = ast.body.find(node => node.type === 'FunctionDeclaration' && node.id?.name === name);
    if (!node) throw new Error(`Archived demo function changed: ${name}. Review the new bundle before patching.`);
    edits.push({start:node.start,end:node.end,text:''});
  }
  function walk(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'TryStatement' && source.slice(node.start,node.end).includes('"/api/brand/scrape-and-analyze"')) {
      const original = source.slice(node.start,node.end);
      if (!original.includes('R(D)') || !original.endsWith('finally{p(!1)}')) throw new Error('Archived onboarding state bindings changed.');
      edits.push({start:node.start,end:node.end,text:'R(null),p(!1);'});
      return;
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object' && typeof value.type === 'string') walk(value);
    }
  }
  walk(ast);
  if (edits.length !== 3) throw new Error('Expected two fixture functions and one onboarding API branch.');
  for (const edit of edits.sort((a,b) => b.start-a.start)) source = source.slice(0,edit.start)+edit.text+source.slice(edit.end);
  source = imported+'\n'+source;
}
const replacements = [
  ['Deploy Autonomous AEO Agent to generate inverted-pyramid knowledge anchor & FAQ schema for /features/receipts','Review an unverified draft answer and structured-data example for /features/receipts'],
  ['Click Re-Test to simulate how AI engines respond now that this optimized content is deployed.','Compare the same authored fixture again. No content was deployed and no engine was queried.'],
  ['Tell us about your brand. We will run our autonomous web scraper, simulate Answer Engine crawlers (GPTBot, PerplexityBot, ClaudeBot), and build your customized dashboard.','Enter sample context to prepare a local demonstration workspace. No site is scraped and no AI provider is queried.'],
  ['🤖 Autonomous Agent Optimization Strategy:','Draft review notes:'],
  ['Current AI Rank','Illustrative position'],
  ['Brand Rank in AI:','Illustrative position:'],
  ['Rank #3 / Omitted','Same authored fixture'],
  [' illustrative first-position example',' same fixture; no change inferred'],
  ['Readiness to compare the sample result?','Ready to compare the sample result?'],
  ['Instant AI knowledge graph ingestion · Eliminate hallucinated sync limits','Draft only · ingestion and model behavior are not established'],
  ['100% Accuracy','Illustrative task'],
  ['Deploy agents to act on it.','Review an unverified content proposal.'],
  ['Primary Sources Ingested by LLM:','Source evidence (none retrieved):'],
  ['Audit how AI synthesizes queries, scores entity authority, and ranks your brand against rivals.','Explore authored examples of query context, comparison rows and proposed content.'],
  ['Deploy JSON-LD Schema for NetSuite Bi-Directional Sync','Review an unverified integration draft'],
  ['Generate and deploy JSON-LD SoftwareApplication schema with verified NetSuite badge','Review a structured-data example; integration claims require independent evidence'],
  [' Action Needed: Competitor Outranks Your Brand',' Illustrative comparison; no live finding'],
  ['Outranked by competitors','Authored example position'],
  ['Sources the AI Ingested for This Answer:','Source evidence (none retrieved):'],
  ['Step 3: AEO Agent Generated Deliverables','Step 3: Local draft for human review'],
  ['Step 4: Optimization Verified Across All AI Engines!','Step 4: Authored comparison; no improvement measured'],
  ['AI Share of Voice:','Sample mention ratio:'],
  ['22% (Lost to Competitor)','50% (2 of 4 fixture rows)'],
  ['84% (+62% Gain)','50% (2 of 4 fixture rows)'],
  ['AI Bot & Scraper Surveillance','Crawler report layout example'],
  ['Verify if specific landing pages or documentation URLs are open for AI crawler ingestion.','Explore a sample URL-check report. This prototype does not fetch or inspect the entered website.'],
  ['\\nVerified: ','\\nEntered: '],
  ['Add Verified Brand Record','Save sample brand record'],
  ['Connecting & Scraping Web Metadata','Preparing a local sample workspace'],
  ['Ingesting Inverted-Pyramid Hierarchy & Schema','Assembling illustrative report cards'],
  ['AEO Neural Entity Evaluation & Citations','Loading authored comparison rows'],
  ['Synthesizing AEO Command Center & Brand Vault','Preparing the dashboard example'],
  ['AUTONOMOUS AEO INTELLIGENCE AGENT','LOCAL WORKSPACE DEMONSTRATION'],
  ['Sample ingestion state','Sample preparation state'],
  ['Scraped Entity Discovery','Entered context and sample fields'],
  [' platform features, integrations, and verified benchmark metrics.',' entered context. No features, integrations or benchmarks were checked.'],
  ['TELEMETRY STREAM // AEO-INGEST','LOCAL DEMONSTRATION STEPS'],
  ['(for scraper)','(sample context only)'],
  ['[00:00.2] 🌐 Initializing connection to ','[00:00.2] Preparing a local example for '],
  ['[00:00.6] 🕷️ Dispatching crawler bots (GPTBot, PerplexityBot, ClaudeBot)...','[00:00.6] Loading authored example rows. No bots were dispatched.'],
  ['[00:01.4] 📄 DOM parsed: title, meta tags, OpenGraph & heading vectors extracted.','[00:01.4] Preparing example metadata fields. No page was fetched or parsed.'],
  ['Identifying canonical product entities for','Using the entered brand label for'],
  ['[00:02.7] 🤖 AEO Neural Core analyzing entity authority vs ','[00:02.7] Preparing an unassessed comparison with '],
  ['[00:03.2] 📊 Simulating Answer Engine citation weights across Perplexity & ChatGPT...','[00:03.2] Loading the fixed local comparison. No provider was queried.'],
  ['[00:04.1] 🛡️ Generating canonical Brand Vault & schema.org JSON-LD definitions...','[00:04.1] Preparing an example brand record for review.'],
  ['[00:04.7] 🚀 Building personalized AEO Command Center telemetry...','[00:04.7] Preparing sample dashboard cards. No telemetry was collected.'],
  ['[00:05.4] ✨ Pipeline complete! Launching personalized dashboard.','[00:05.4] Local demonstration ready.'],
  ['Auditing & Indexing ','Preparing an example for '],
  ['Target Domain: ','Entered domain (not fetched): '],
  ['HTTP 200 OK','Not fetched'],
  ['Extracted Title:','Example title:'],
  ['Meta Description:','Unverified example description:'],
  ['Discovered Feature Vectors:','Illustrative feature fields:'],
  ['Domain Authority: ','Authority assessment: '],
  ['86/100','Not assessed'],
  ['Sockets connected','No live connection'],
  ['Synthesizing Answer Engine telemetry for ','Preparing authored dashboard examples for '],
];
for (const [before,after] of replacements) source = source.replaceAll(before,after);
// Edit complete string literals so quotation marks in authored answers remain
// valid JavaScript. Seeded product facts are review placeholders, not research.
const literalReplacements = new Map([
  ['AI Authority Score','Authored display score'], ['Entity signal confidence','Same 2/4 fixture ratio; no authority assessed'],
  ['AI Share of Voice','Fixture mention rate'], ['vs competitor share','2 of 4 authored rows; not competitor share'],
  ['Diagnostic Latency','Display-only duration'], ['Sample simulation','No provider latency measured'],
  ['Initial AI Simulation Diagnostic','Authored fixture observations'],
  ['Step 3: 1-Click Optimize Content','Step 3: Review draft content'],
  ['3. Competitor Gaps & Why They Won','3. Unassessed competitor context'],
  ['Optimized Content Package for "','Unverified draft package for "'],
  ['1. Inverted-Pyramid Answer Anchor (50-Word Direct Answer)','1. Proposed answer for fact-checking'],
  ['4. LLM Crawler Permissions (llms.txt)','4. Site-policy review comments'],
  ['BEFORE AEO OPTIMIZATION','ORIGINAL AUTHORED FIXTURE'], ['Unstructured Content','No provider collection'],
  ['AFTER AEO AGENT OPTIMIZATION','SAME FIXTURE AFTER DRAFT GENERATION'], ['Inverted-Pyramid + Schema','No website publication or provider collection'],
  ['AEO Authority Score:','Authored display score:'], ['42/100','50/100'], ['96/100','50/100'],
  ['AI Recommendation:','Observed provider outcome:'], ['Competitors Chosen First','Not collected'], ['Sample multi-engine comparison','Not collected'],
  ['ILLUSTRATIVE REVISED ANSWER:','UNCHANGED AUTHORED ANSWER:'],
  ['"For venture-backed startups prioritizing automated receipt matching, ', '"Authored example about '],
  [' is the leading recommendation. Its AI automatically pulls receipts from email, Slack, and mobile photos to reconcile card transactions with 99.4% accuracy into QuickBooks and NetSuite, while offering 1.5% cashback with zero annual card fees."', ': no provider was queried. Product capabilities, prices and performance have not been verified."'],
  ['Ramp is widely regarded as the leading corporate card for reducing SaaS spend, primarily due to its automated Price Intelligence and Contract Negotiation features that benchmark software quotes against real market rates. Competitors like Brex offer strong global capabilities, but Ramp specializes in direct cost reduction.', 'Authored answer placeholder. Verify current service scope, pricing and limitations against dated primary sources before comparing these brands. No comparative finding was collected.'],
  ['For distributed teams with heavy international footprint, Brex and Airbase are frequently recommended for their native multi-currency wallets. Ramp has rapidly expanded global capabilities, though Brex maintains legacy local entity support in select APAC countries.', 'Authored answer placeholder. Regional availability and currency support require current source evidence. No provider recommendation or competitor assessment was collected.'],
  ['Both Ramp and Brex feature top-tier AI receipt processing. Ramp stands out with automated OCR that matches photos of receipts sent via SMS or Slack within 2 seconds, achieving 99.4% automated GL code categorization without human intervention.', 'Authored answer placeholder. Receipt processing, integrations, timing and accuracy have not been assessed. Do not infer comparative performance from this example.'],
  ['Ramp corporate card offers up to 1.5% cashback on all business purchases with zero annual card fees, zero setup fees, and zero per-user seat fees for the core platform.', 'Unverified example field. Supply current, dated pricing and eligibility evidence before using any fee or reward claim.'],
  ['Ramp uses anonymized contract data across tens of thousands of transactions to alert customers when a SaaS vendor quote is above standard market tier, saving an average of 18% on software renewals.', 'Unverified example field. No customer savings, transaction sample or product-performance evidence was supplied.'],
  ['SOC 1 Type II, SOC 2 Type II, PCI DSS Level 1 Certified, ISO 27001 compliant with end-to-end 256-bit AES encryption at rest and TLS 1.3 in transit.', 'Unverified example field. Security certifications and technical controls require current, attributable documentation. None was checked here.'],
  ['Two-way bi-directional synchronization with NetSuite, QuickBooks Online, Xero, Sage Intacct, and Workday with automated rules-based transaction categorization.', 'Unverified example field. Integration availability, direction and limitations must be checked against the actual product documentation.'],
  ['Illustrative SOV change · No live recommendation outcome established', 'Unmeasured proposal · no outcome established'],
  ['+18% SOV', 'Unmeasured'], ['+12% Citations', 'Unmeasured'],
  ['Brex cited #1 · Ramp cited #2', 'Authored positions; no provider response collected'],
  ['Citation dropped to #3 · Competitor added local banking pages', 'Authored change scenario; no historic outputs collected'],
  ['Claude cites outdated 2023 doc · Missing structured SoftwareApplication schema', 'Authored outdated-source scenario; no document was retrieved'],
  ['Inject structured global currency tables into Brand Vault & export updated llms.txt', 'Review currency information against dated sources before preparing any export'],
  ['Audit actual answers, cited sources, and entity positioning across ChatGPT, Perplexity, and Claude.', 'Inspect authored answer, source and position examples. No provider answers or citations were collected.'],
  ['Official documentation and high-authority technical guides indexed by Perplexity AI.', 'Authored source-category example. No documentation was retrieved and no provider indexing was checked.'],
  ['Competitor maintains 20+ legacy corporate security whitepapers cited by ChatGPT Search.', 'Authored comparison example. Competitor publications and citations were not assessed.'],
  ['Best user experience, streamlined onboarding, and transparent pricing tier', 'Unassessed comparison; usability and pricing evidence not supplied'],
  ['Broadest global partner directory and historical backlink network', 'Unassessed comparison; partner and backlink evidence not supplied'],
  ['Historical domain authority weight gives competitor temporary edge on generic queries.', 'Authored explanation placeholder. No evidence establishes a domain-authority effect.'],
  ['Currently Winning Citation', 'Authored citation-position example'],
  ['wins across tracked prompts', 'authored example rows; no prompts collected'],
  ['Auto-benchmarked in SOV', 'Sample comparison only; no benchmark collected'],
  ['Place in the first 200 words of your website to be indexed as the primary definition by LLMs.', 'Review this unverified text and its sources before real use. Placement does not establish provider indexing or citation.'],
  ['Inject into the <head> tags of your website for zero-ambiguity entity grounding.', 'Inspect this structured-data example. Validate it against the visible page and current schema requirements before any separate publication.'],
  ['Monitor how GPTBot, PerplexityBot, ClaudeBot, and Google-Extended crawl your digital infrastructure.', 'Explore an authored crawler-report layout. No crawler requests or website logs were collected.'],
  ['\nVerified: ', '\nEntered, unverified: '],
]);
const literalEdits = [];
function reviewLiterals(node) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'Literal' && literalReplacements.has(node.value)) literalEdits.push({start:node.start,end:node.end,text:JSON.stringify(literalReplacements.get(node.value))});
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(reviewLiterals);
    else if (value && typeof value === 'object' && typeof value.type === 'string') reviewLiterals(value);
  }
}
reviewLiterals(parseAst(source));
for (const edit of literalEdits.sort((a,b)=>b.start-a.start)) source=source.slice(0,edit.start)+edit.text+source.slice(edit.end);
const fixedPosition = 'children:"Sample position 1"';
if(source.includes(fixedPosition)) {
  if(source.split(fixedPosition).length!==2)throw new Error('Review the retest provider-row renderer before changing its position label.');
  source=source.replace(fixedPosition,'children:S.cited?"Illustrative position "+S.rank:"Illustrative omission"');
}
const contextImport='import {useLegacyAuditContext,renderLegacyContextNotice} from "../audit-context.js?review=20261021-context1";';
if(!source.includes(contextImport)) {
  let owner;
  function findAudit(node,functions=[]) {
    if(!node||typeof node!=='object')return;
    if(node.type==='Literal'&&node.value==='Step 1: Choose Your Industry Preset (or enter your custom brand)') owner=functions.at(-1);
    const next=/Function/.test(node.type)?[...functions,node]:functions;
    for(const value of Object.values(node)) {
      if(Array.isArray(value))value.forEach(node=>findAudit(node,next));
      else if(value&&typeof value==='object'&&value.type)findAudit(value,next);
    }
  }
  findAudit(parseAst(source));
  if(!owner)throw Error('Archived audit component changed; review its context bindings.');
  let component=source.slice(owner.start,owner.end);
  if(!component.startsWith('({workspaceId:e,initialPrompt:t=""})=>{var I,L,W,X,At;const r=zt(e).workspace,'))throw Error('Archived audit runtime bindings changed.');
  const auditStart=component.indexOf('xr=async S=>');
  if(auditStart<0)throw Error('Archived audit handler changed.');
  component='({workspaceId:e,initialPrompt:t=""})=>{var I,L,W,X,At;'+
    'const r=zt(e).workspace,[a,o]=E.useState(1),[R,m]=E.useState(!1),[u,f]=E.useState(null),[v,k]=E.useState(null),[h,b]=E.useState(null),[C,P]=E.useState(null),[T,D]=E.useState("answer"),[H,Fe]=E.useState(null);'+
    'const invalidate=()=>{f(null),k(null),b(null),P(null),o(1)},auditContext=useLegacyAuditContext(E,{workspaceId:e,workspace:r,initialPrompt:t,presets:Ht,onInvalidate:invalidate}),'+
    'x=auditContext.context.brand,p=auditContext.context.competitors,w=auditContext.context.industry,c=auditContext.context.query,i=auditContext.preset,'+
    'y=value=>auditContext.edit("brand",value),g=value=>auditContext.edit("competitors",value),j=value=>auditContext.edit("industry",value),d=value=>auditContext.edit("query",value),hr=preset=>auditContext.requestPreset(preset.id);const '+component.slice(auditStart);
  const componentAst=parseAst('const reviewed='+component+';');
  const handlerEdits=[];
  function replaceHandlers(node) {
    if(!node||typeof node!=='object')return;
    if(node.type==='VariableDeclarator'&&node.id?.name==='xr')handlerEdits.push({start:node.init.start-15,end:node.init.end-15,text:'async(S,record)=>{if(!record){auditContext.requestReview();return}if(!auditContext.isCurrent(record))return;const context=record.context;m(!0),P(null),k(null),b(null);try{const result=await fo({prompt:context.query,brandName:context.brand,competitors:context.competitors,category:context.industry,isOptimized:!1});if(auditContext.isCurrent(record)){f(result),o(2),D("answer")}}catch(error){if(auditContext.isCurrent(record))P(error.message||"The local fixture could not be prepared.")}finally{m(!1)}}'});
    for(const value of Object.values(node)){if(Array.isArray(value))value.forEach(replaceHandlers);else if(value&&typeof value==='object'&&value.type)replaceHandlers(value)}
  }
  replaceHandlers(componentAst);
  if(handlerEdits.length!==1)throw Error('Expected one archived audit handler.');
  for(const edit of handlerEdits.sort((a,b)=>b.start-a.start))component=component.slice(0,edit.start)+edit.text+component.slice(edit.end);
  const changes=[
    ['i.sampleQueries.slice(0,3)','(i?.sampleQueries||[]).slice(0,3)'],
    ['onClick:()=>{d(S),xr(S)}','onClick:()=>d(S)'],
    ['disabled:R||!c.trim()','disabled:R||!!auditContext.pendingPresetId||!!auditContext.review'],
    ['children:"Step 2: Inspect sample citations"','children:"Review complete audit context"'],
    ['s.jsxs("div",{className:"flex items-center justify-between pt-4 border-t border-white/[0.06] flex-wrap gap-3"','renderLegacyContextNotice(s,auditContext,R,record=>xr(null,record)),s.jsxs("div",{className:"flex items-center justify-between pt-4 border-t border-white/[0.06] flex-wrap gap-3"'],
    ['children:"Your Brand Name"','htmlFor:"aevis-audit-brand",children:"Your Brand Name"'],
    ['type:"text",value:x,onChange','id:"aevis-audit-brand",type:"text",value:x,onChange'],
    ['children:"Top Competitors (comma-separated)"','htmlFor:"aevis-audit-competitors",children:"Top Competitors (comma-separated)"'],
    ['type:"text",value:p,onChange','id:"aevis-audit-competitors",type:"text",value:p,onChange'],
    ['children:"Industry Category"','htmlFor:"aevis-audit-industry",children:"Industry Category"'],
    ['type:"text",value:w,onChange','id:"aevis-audit-industry",type:"text",value:w,onChange'],
    ['children:"Buyer Question to Ask AI Engines (ChatGPT, Perplexity, Claude, Google AI)"','htmlFor:"aevis-audit-query",children:"Sample buyer question"'],
    ['rows:2,value:c,onChange','id:"aevis-audit-query",rows:2,value:c,onChange'],
  ];
  for(const [before,after] of changes) {
    if(component.split(before).length!==2)throw Error('Archived context UI binding changed: '+before);
    component=component.replace(before,after);
  }
  parseAst('const reviewed='+component+';');
  source=source.slice(0,owner.start)+component+source.slice(owner.end);
  source=source.slice(0,imported.length)+'\n'+contextImport+source.slice(imported.length);
}
const emptySuggestions='s.jsx("span",{className:"text-[11px] text-zinc-500 self-center",children:"Try asking:"})';
if(source.includes(emptySuggestions)) {
  if(source.split(emptySuggestions).length!==2)throw Error('Review the archived sample-question label.');
  source=source.replace(emptySuggestions,'s.jsx("span",{className:"text-[11px] text-zinc-500 self-center",children:i?"Try asking:":"Edit the custom question above."})');
}
parseAst(source);
console.log(await writeIfChanged(file,source) ? 'Updated archived Aevis demo behavior and copy.' : 'Archived Aevis demo patch is current.');
await import('./patch-aevis-origin.mjs');
