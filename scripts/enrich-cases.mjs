import fs from 'node:fs/promises';
import path from 'node:path';
import { caseReviews,snapshot,deepDive,quickNav,nextCase,portfolioReturn } from '../src/caseReviewContent.js';
import { reflectionCards,reflectionNotes,reflectionSection,escapedReflectionTitle } from '../src/reflectionContent.js';
import { writeIfChanged } from '../lib/writeIfChanged.js';
import {flexVersionSection} from '../src/flexVersionContent.js';
import {andalusDeliveryTimeline,andalusOperationalHandoff} from '../src/andalusDeliveryContent.js';
const root=path.resolve(new URL('..',import.meta.url).pathname);
function afterOpeningContent(html){
 const main=html.search(/<main\b/);
 const start=html.indexOf('>',main)+1;
 const tags=/<\/?(header|section)\b[^>]*>/gi;
 tags.lastIndex=start;
 let target=null,depth=0,match;
 while((match=tags.exec(html))){
  const closing=match[0].startsWith('</');
  if(!target&&!closing&&(/class="[^"]*\bhero\b/.test(match[0])||/id="overview"/.test(match[0]))){target=match[1].toLowerCase();depth=1;continue}
  if(target&&match[1].toLowerCase()===target){depth+=closing?-1:1;if(depth===0)return tags.lastIndex}
 }
 return start;
}
function sectionRange(html,pattern){
 const first=pattern.exec(html);if(!first)return null;
 const tags=/<\/?section\b[^>]*>/gi;tags.lastIndex=first.index;
 let depth=0,match;
 while((match=tags.exec(html))){depth+=match[0].startsWith('</')?-1:1;if(depth===0)return {start:first.index,end:tags.lastIndex}}
 throw Error('Unclosed case section');
}
const nativeEndings={
 andalus:/<section\b[^>]*class="[^"]*\bclosing\b[^\"]*"[^>]*>/,
 'flex-academy':/<section\b[^>]*class="[^"]*\boutcome\b[^\"]*"[^>]*>/,
 veyra:/<section\b[^>]*class="[^"]*\breflection\b[^\"]*"[^>]*>/,
};
function reviseReflection(html,key){
 const range=sectionRange(html,nativeEndings[key]||/<section\b[^>]*id="reflection"[^>]*>/);
 if(!range)return {html,range:null};
 let section=html.slice(range.start,range.end);
 const titleId=/<h2\b[^>]*id="([^"]*)"/.exec(section)?.[1]||'reflection-title';
 section=section.replace(/^<section\b([^>]*)>/,(_tag,attrs)=>{
  if(!/\bid="reflection"/.test(attrs))attrs+=' id="reflection"';
  if(!/\btabindex=/.test(attrs))attrs+=' tabindex="-1"';
  if(!/\baria-labelledby=/.test(attrs))attrs+=` aria-labelledby="${titleId}"`;
  return `<section${attrs}>`;
 });
 section=section.replace(/<h2\b([^>]*)>[\s\S]*?<\/h2>/,(_tag,attrs)=>`<h2${/\bid=/.test(attrs)?attrs:attrs+` id="${titleId}"`}>${escapedReflectionTitle(key)}</h2>`);
 if(key==='veyra'){
  section=section.replace(/<div class="three-columns">[\s\S]*?<\/div>/,`<div class="three-columns">${reflectionCards(key)}</div>`);
 }else{
  const mark=/<!-- review:reflection-notes -->[\s\S]*?<!-- \/review:reflection-notes -->/;
  const existing=mark.exec(section);
  const afterTitle=section.indexOf('</h2>')+5;
  const paragraph=existing||/<p\b[^>]*>[\s\S]*?<\/p>/.exec(section.slice(afterTitle));
  if(!paragraph)throw Error('Missing reflection paragraph: '+key);
  let offset=existing?existing.index:afterTitle+paragraph.index;
  let original=paragraph[0];
  // Flex retains its factual current-outcome paragraph; replace its generic body copy.
  if(key==='flex-academy'&&!existing){const body=/<p\b[^>]*class="body-copy"[^>]*>[\s\S]*?<\/p>/.exec(section);if(!body)throw Error('Missing Flex reflection copy');offset=body.index;original=body[0]}
  const classes=/class="([^"]*)"/.exec(original)?.[1]||'';
  const notes=`<!-- review:reflection-notes -->${reflectionNotes(key,classes)}<!-- /review:reflection-notes -->`;
  section=section.slice(0,offset)+notes+section.slice(offset+original.length);
 }
 return {html:html.slice(0,range.start)+section+html.slice(range.end),range:{start:range.start,end:range.start+section.length}};
}
let updated=0;
for(const [key,p] of Object.entries(caseReviews)){
 const file=path.join(root,'public/projects',key,'index.html');
 let html;
 try{html=await fs.readFile(file,'utf8')}catch{continue}
 html=html.replace(/<!-- review:snapshot -->[\s\S]*?<!-- \/review:snapshot -->/g,'').replace(/<!-- review:detail -->[\s\S]*?<!-- \/review:detail -->/g,'');
 html=html.replace(/<!-- review:quick -->[\s\S]*?<!-- \/review:quick -->/g,'').replace(/<!-- review:skip -->[\s\S]*?<!-- \/review:skip -->/g,'');
 html=html.replace(/<!-- review:reflection -->[\s\S]*?<!-- \/review:reflection -->/g,'').replace(/<!-- review:next -->[\s\S]*?<!-- \/review:next -->/g,'');
 html=html.replace(/<!-- review:flex-version -->[\s\S]*?<!-- \/review:flex-version -->/g,'');
 html=html.replace(/<!-- review:andalus-timeline -->[\s\S]*?<!-- \/review:andalus-timeline -->/g,'').replace(/<!-- review:andalus-handoff -->[\s\S]*?<!-- \/review:andalus-handoff -->/g,'');
 if(!html.includes('/projects/case-navigation.js'))html=html.replace('</body>','<script type="module" src="/projects/case-navigation.js"></script></body>');
 if(!html.includes('/projects/case-review.css'))html=html.replace('</head>','<link rel="stylesheet" href="/projects/case-review.css"></head>');
 if(['nexus','prepflow','promptilo','timer-gym'].includes(key))html=html.replace(/<body([^>]*)>/,(match,a)=>/class=/.test(a)?match.replace(/class="([^"]*)"/,(_m,classes)=>`class="${[...new Set(['review-dark',...classes.split(/\s+/).filter(Boolean)])].join(' ')}"`):`<body${a} class="review-dark">`);
 html=html.replace(/<body\b([^>]*)>/,(_match,attrs)=>`<body${attrs.replace(/\sdata-case-project="[^"]*"/g,'')} data-case-project="${key}">`);
 // Keep the long visual narrative, with a short route to the hiring evidence.
 html=html.replace(/<main\b[^>]*>/,match=>`${match}<!-- review:quick -->${quickNav(key)}<!-- /review:quick -->`);
 if(!/<a\b[^>]*class="[^"]*\bskip(?:-link)?\b/.test(html))html=html.replace(/<body\b[^>]*>/,match=>`${match}<!-- review:skip --><a class="review-skip" href="#project-snapshot">Skip to project summary</a><!-- /review:skip -->`);
 if(!/<link\b[^>]*rel="icon"/.test(html))html=html.replace('</head>','<link rel="icon" href="/favicon.svg"></head>');
 if(!/<link\b[^>]*rel="canonical"/.test(html))html=html.replace('</head>',`<link rel="canonical" href="https://ismail-bettoumi.com/projects/${key}/"></head>`);
 const intro=`<!-- review:snapshot -->${snapshot(key)}<!-- /review:snapshot -->`;
 const at=afterOpeningContent(html);
 html=html.slice(0,at)+intro+html.slice(at);
 if(key==='flex-academy'){
  html=html.replace('>Summary</a>','>Summary</a><a href="#versions">Versions</a>');
  html=html.replace(/<a href="https:\/\/www\.figma\.com\/design\/ISnJ5tL4IaLlsm8m5KSRw2[^\"]*"[^>]*>View Figma ↗<\/a>/,'<a href="study.html">Try the current flow ↗</a>');
  const snapshotEnd=html.indexOf('<!-- /review:snapshot -->')+'<!-- /review:snapshot -->'.length;
  html=html.slice(0,snapshotEnd)+`<!-- review:flex-version -->${flexVersionSection()}<!-- /review:flex-version -->`+html.slice(snapshotEnd);
 }
 if(key==='andalus'){
  html=html.replace('>Summary</a>','>Summary</a><a href="#delivery-timeline">Delivery</a>');
  const snapshotEnd=html.indexOf('<!-- /review:snapshot -->')+'<!-- /review:snapshot -->'.length;
  html=html.slice(0,snapshotEnd)+`<!-- review:andalus-timeline -->${andalusDeliveryTimeline()}<!-- /review:andalus-timeline -->`+html.slice(snapshotEnd);
  const handoffAnchor='<p class="caption">Anonymous visitors get device-local continuity. Cross-device recovery requires a recognized traveler or a secure recovery link. Unknown booking status pauses reminders.</p>';
  if(!html.includes(handoffAnchor))throw Error('Missing Andalus service-handoff insertion point');
  html=html.replace(handoffAnchor,handoffAnchor+`<!-- review:andalus-handoff -->${andalusOperationalHandoff()}<!-- /review:andalus-handoff -->`);
 }
 const reflection=reviseReflection(html,key);html=reflection.html;
 if(!reflection.range){
  const ending=html.search(/<section\b[^>]*class="[^"]*\bend-cta\b/);
  const reflectionAt=ending>=0?ending:html.indexOf('</main>');
  const text=`<!-- review:reflection -->${reflectionSection(key)}<!-- /review:reflection -->`;
  html=html.slice(0,reflectionAt)+text+html.slice(reflectionAt);
 }
 const detail=`<!-- review:detail -->${deepDive(key)}<!-- /review:detail -->`;
 const reflectionAt=sectionRange(html,/<section\b[^>]*id="reflection"[^>]*>/)?.start;
 if(reflectionAt===undefined)throw Error('Missing final reflection: '+key);
 html=html.slice(0,reflectionAt)+detail+html.slice(reflectionAt);
 const mainEnd=html.indexOf('</main>'),footer=html.indexOf('<footer',reflectionAt+detail.length);
 const nextAt=footer>=0&&footer<mainEnd?footer:mainEnd;
 const next=`<!-- review:next -->${nextCase(key)}<!-- /review:next -->`;
 html=html.slice(0,nextAt)+next+html.slice(nextAt);
 // Direct links work from standalone pages and preserve browser history naturally.
 if(key==='andalus')html=html.replace('href="/cv.html" target="_blank" rel="noopener">Ismail Bettoumi','href="/#journey">← Portfolio · Ismail Bettoumi');
 html=html.replaceAll('href="/#journey"',`href="${portfolioReturn(key)}"`).replaceAll('href="/#selected-work"',`href="${portfolioReturn(key)}"`).replaceAll('href="/"',`href="${portfolioReturn(key)}"`);
 if(!html.includes(`href="${portfolioReturn(key)}"`))throw Error(`Missing project-specific return link: ${key}`);
 if(await writeIfChanged(file,html))updated++;
 for(const name of ['study.html','study-protocol.html']){
  const related=path.join(root,'public/projects',key,name);
  let content;
  try{content=await fs.readFile(related,'utf8')}catch(error){if(error.code==='ENOENT')continue;throw error}
  const revised=content.replaceAll('href="/#selected-work"',`href="${portfolioReturn(key)}"`).replaceAll('href="/#journey"',`href="${portfolioReturn(key)}"`).replaceAll('href="/"',`href="${portfolioReturn(key)}"`);
  await writeIfChanged(related,revised);
 }
}
console.log(`Prepared ${Object.keys(caseReviews).length} case pages (${updated} updated).`);
