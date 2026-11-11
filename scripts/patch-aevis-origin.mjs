import fs from 'node:fs/promises';
import {parseAst} from 'rollup/parseAst';
import {writeIfChanged} from '../lib/writeIfChanged.js';

const file=new URL('../public/aeokiller/assets/index-HPfAPLMS.js',import.meta.url);
let source=await fs.readFile(file,'utf8');
const marker='import {tagDemoPackage,renderDemoViewSource,describeUnfetchedUrl,makeDemoBrandRecord,serializeDemoBrandNotes,copyDemoBrandNotes,renderDemoExportFeedback} from "../data-origin.js?review=20261021-origin1";';
const walk=(node,visit)=>{
  if(!node||typeof node!=='object')return;visit(node);
  for(const value of Object.values(node)){if(Array.isArray(value))value.forEach(node=>walk(node,visit));else if(value&&typeof value==='object'&&value.type)walk(value,visit)}
};
function functionNode(name) {
  let found;walk(parseAst(source),node=>{
    if(node.type==='FunctionDeclaration'&&node.id?.name===name)found=node;
    if(node.type==='VariableDeclarator'&&node.id?.name===name)found=node.init;
  });
  if(!found)throw Error('Review archived function binding: '+name);return found;
}
function editFunction(name, transform) {
  const node=functionNode(name),before=source.slice(node.start,node.end),after=transform(before);
  parseAst('const reviewed='+after+';');source=source.slice(0,node.start)+after+source.slice(node.end);
}
function once(value,before,after) {
  if(value.split(before).length!==2)throw Error('Archived origin UI changed: '+before);
  return value.replace(before,after);
}
function literals(value, mapping) {
  const edits=[];walk(parseAst('const reviewed='+value+';'),node=>{
    if(node.type==='Literal'&&typeof node.value==='string'&&Object.hasOwn(mapping,node.value))
      edits.push({start:node.start-15,end:node.end-15,text:JSON.stringify(mapping[node.value])});
  });
  for(const edit of edits.sort((a,b)=>b.start-a.start))value=value.slice(0,edit.start)+edit.text+value.slice(edit.end);
  return value;
}
function handlers(value, mapping) {
  const edits=[],seen=new Set();walk(parseAst('const reviewed='+value+';'),node=>{
    if(node.type==='VariableDeclarator'&&mapping[node.id?.name]){
      if(seen.has(node.id.name))throw Error('Ambiguous archived handler: '+node.id.name);seen.add(node.id.name);
      edits.push({start:node.init.start-15,end:node.init.end-15,text:mapping[node.id.name]});
    }
  });
  if(seen.size!==Object.keys(mapping).length)throw Error('Archived handler bindings changed.');
  for(const edit of edits.sort((a,b)=>b.start-a.start))value=value.slice(0,edit.start)+edit.text+value.slice(edit.end);
  return value;
}

if(!source.includes(marker)) {
  const loader=functionNode('zt'),loaderSource=source.slice(loader.start,loader.end),returns=[];
  walk(loader,node=>{if(node.type==='ReturnStatement')returns.push(node.argument)});
  if(returns.length!==2||!loaderSource.includes('JSON.parse(n)'))throw Error('Archived package loader changed.');
  for(const node of returns.sort((a,b)=>b.start-a.start)) {
    const kind=node.type==='ObjectExpression'?'bundle':'local';
    source=source.slice(0,node.start)+' tagDemoPackage('+source.slice(node.start,node.end)+','+JSON.stringify(kind)+')'+source.slice(node.end);
  }
  editFunction('Gm',value=>{
    value=once(value,'children:[t==="overview"&&s.jsx(Rm,','children:[renderDemoViewSource(s,t,zt(l)),t==="overview"&&s.jsx(Rm,');
    const prompt='{id:"prompts",label:"Prompt Volumes",icon:s.jsx(fr,{className:"w-[18px] h-[18px]"})}';
    value=once(value,prompt,prompt+',{id:"insights",label:"Citation examples",icon:s.jsx(xs,{className:"w-[18px] h-[18px]"})},{id:"crawlers",label:"Crawler examples",icon:s.jsx(ql,{className:"w-[18px] h-[18px]"})}');
    return value;
  });
  editFunction('Rm',value=>literals(value,{
    'AEO Visibility Score':'Example visibility value','Category Share of Voice':'Example share value',
    'Direct Citation Rate':'Example citation value','Tracked AI Prompts':'Example demand value',
    'Action Queue':'Authored action examples','Engine Health':'Example engine bars',
    'Recent Citations':'Unverified answer example','Rank #':'Example position #',
  }));
  editFunction('Lm',value=>{
    value=literals(value,{'How AI Answers Category Queries':'Authored answer examples',
      'Verify Citation':'Review example context','Synthesized Answer Engine Output:':'Unverified example answer:',
      'Primary Citations:':'Unretrieved source examples:','DA ':'Example source value ',
      'Authority Sources Analyzed by the LLM':'Authored source examples · no model analysis',
      'Inspect Source Breakdown ':'Inspect unverified source examples ',
      ' Citation Decay Risk':' Example omission scenario','Ranked #':'Example position #'});
    for(const name of ['p','d'])value=value.replaceAll('children:'+name+'.date','children:"Example date: "+'+name+'.date');
    return value;
  });
  editFunction('Om',value=>literals(value,{'Prompt Volumes':'Prompt examples','k monthly queries tracked':'k example volume units · full catalog',
    'Volume':'Example volume','Growth':'Example change','Rank':'Example position','Verify':'Review context',
    'Unranked':'Example omission',' Cited':' example mention','/mo':'/mo (example)'}));
  editFunction('_m',value=>{
    value=literals(value,{'Competitor SOV':'Competitor examples','Direct Citation Share':'Example citation share',
      'Visibility Index Delta':'Example index difference',' pts':' example points','Ahead':'Example difference',
      'Query Win/Loss Audit vs. ':'Authored query scenarios vs. ','Won':'Example mention','Lost':'Example omission',
      'Verify':'Review context','Fix Gap':'Review draft','Top Sources Powering ':'Unverified source examples for ',"'s AI Citations":''});
    value=once(value,'`Clear pricing table and inverted-pyramid features cited directly from ${i.domain}.`','`Authored source example for ${i.domain}. No page or provider response was retrieved.`');
    return value;
  });
  editFunction('Dm',value=>{
    value=literals(value,{'Generate':'Prepare unverified draft','Strategy':'Draft review notes','Key Facts':'Evidence to supply','Deliverables':'Unverified draft'});
    const intro='`${i.primaryBrand} is a modern platform that helps teams streamline ${i.category.toLowerCase()} and win generative search citations.`';
    if(value.split(intro).length!==3)throw Error('Archived draft defaults changed.');
    value=value.replaceAll(intro,'`Unverified draft context for ${i.primaryBrand} in ${i.category}. Supply accurate source material before real use.`');
    value=value.replaceAll('`Automated ${i.category} with Inverted-Pyramid Citations`','`Sample question about ${i.category}`');
    return value;
  });
  editFunction('$m',value=>{
    value=handlers(value,{c:'()=>o(describeUnfetchedUrl(i))'});
    value=literals(value,{'AI Crawler Activity & Indexing Health':'Authored crawler examples','5 AI Bots Active Today':'5 authored bot profiles',
      'AI Robots.txt Path Validator':'Local URL syntax example','Audit URL Access':'Parse URL locally',
      'Timestamp':'Example timestamp','Status Code':'Example code','Payload Size':'Example size','Robots Status':'Example robots state'});
    value=once(value,'onChange:d=>l(d.target.value)','onChange:d=>{l(d.target.value),o(null)}');
    value=once(value,'type:"text",value:i,onChange','id:"aevis-local-url","aria-label":"URL to parse locally",type:"text",value:i,onChange');
    value=once(value,'sl.useEffect(()=>{l(`https://${n.domain}/pricing`)}','sl.useEffect(()=>{l(`https://${n.domain}/pricing`),o(null)}');
    value=value.replaceAll('children:d.status','children:"Example: "+d.status');
    const result='a&&s.jsxs("div",{className:"p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2",children:[s.jsx(ar,{className:"w-4 h-4 text-emerald-400 shrink-0"}),s.jsx("span",{children:a})]})';
    value=once(value,result,'a&&s.jsx("p",{role:"status",className:"p-3.5 rounded-lg bg-black/40 border border-white/20 text-zinc-200 text-xs font-mono",children:a})');
    return value;
  });
  editFunction('Bm',value=>{
    value=handlers(value,{
      j:'()=>{if(!o.trim()||!y.trim())return;const entry=makeDemoBrandRecord({title:o,category:d,content:y});i([entry,...r]),a(!1),c(""),p("")}',
      R:'()=>serializeDemoBrandNotes(n.name,r)',m:'async()=>w(await copyDemoBrandNotes(R(),navigator.clipboard))',
    });
    value=literals(value,{'Export llms.txt':'Copy unverified brand notes','Add Brand Record':'Add page-local note','Save Record':'Add page-local example',
      'Title':'Title (required)','Description':'Description (required)','Save sample brand record':'Add an unverified example',
      'Enter exact numbers, pricing, or specifications for Answer Engines...':'Enter sample notes. Verify claims against dated sources before real use.'});
    value=once(value,'[g,w]=E.useState(!1)','[g,w]=E.useState(null)');
    value=once(value,'g?s.jsx(qe,','g?.state==="copied"?s.jsx(qe,');
    value=once(value,'s.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:r.map','renderDemoExportFeedback(s,g),s.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:r.map');
    value=once(value,'s.jsxs("span",{className:"text-[11px] text-zinc-500",children:["Cited ",u.citedFrequency," times"]})','s.jsx("span",{className:"text-[11px] text-zinc-500",children:u.origin==="entered_context"?"Entered context · unverified":"Unverified example · not measured"})');
    value=once(value,'className:"text-emerald-400",children:u.verifiedBy','className:"text-zinc-400",children:"No independent verification"');
    value=once(value,'children:u.lastVerified','children:u.origin==="entered_context"?"Entered: "+u.enteredAt:"Example date: "+(u.lastVerified||"not supplied")');
    value=once(value,'onClick:()=>a(!1),className:"text-zinc-400 hover:text-white text-xs font-mono"','onClick:()=>a(!1),"aria-label":"Close sample record",className:"text-zinc-400 hover:text-white text-xs font-mono"');
    value=once(value,'s.jsxs("div",{className:"space-y-3",children:[s.jsxs("div",{children:[s.jsx("label",','s.jsx("p",{className:"text-xs text-zinc-300",children:"This entry stays in this view and resets when you leave it. No claim is verified and nothing is published."}),s.jsxs("div",{className:"space-y-3",children:[s.jsxs("div",{children:[s.jsx("label",');
    value=once(value,'onClick:j,className:','onClick:j,disabled:!o.trim()||!y.trim(),className:');
    for(const [label,id,control]of [['Title (required)','aevis-note-title','type:"text",value:o'],['Category','aevis-note-category','value:d,onChange'],['Description (required)','aevis-note-content','rows:4,value:y']]) {
      value=once(value,'children:'+JSON.stringify(label),'htmlFor:'+JSON.stringify(id)+',children:'+JSON.stringify(label));
      value=once(value,control,'id:'+JSON.stringify(id)+','+control);
    }
    return value;
  });
  source=marker+'\n'+source;
  // Keep the fixture import first for the existing, idempotent base patch.
  const first=source.indexOf('import {simulateLegacyAudit as fo,draftLegacyContent as Ru}');
  const end=source.indexOf(';',first)+1;
  const fixtureImport=source.slice(first,end);
  source=fixtureImport+'\n'+source.slice(0,first)+source.slice(end);
}
if(source.includes('returntagDemoPackage('))source=source.replaceAll('returntagDemoPackage(','return tagDemoPackage(');
const sourceInspector='s.jsxs("span",{className:"text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1",children:["Inspect unverified source examples ",';
if(source.includes(sourceInspector))editFunction('Lm',value=>once(value,sourceInspector,
  's.jsxs("button",{type:"button",onClick:event=>{event.stopPropagation(),x(p)},className:"text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1",children:["Inspect unverified source examples ",'));
if(!source.includes('document.getElementById("aevis-view-origin")')) {
  editFunction('Gm',value=>once(value,'return s.jsxs("div",{className:"min-h-screen',
    'E.useEffect(()=>{if(typeof document==="undefined")return;const target=document.getElementById("aevis-view-origin");if(target){target.focus({preventScroll:true}),target.scrollIntoView({block:"start",behavior:"instant"})}},[t,l]);return s.jsxs("div",{className:"min-h-screen'));
}
parseAst(source);
console.log(await writeIfChanged(file,source)?'Updated origins and unverified-result boundaries across Aevis views.':'Aevis data-origin patch is current.');
