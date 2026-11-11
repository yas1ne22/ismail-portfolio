import fs from 'node:fs/promises';
import path from 'node:path';
import {parseHTML} from 'linkedom';
import {classicHomeDocument} from './classic-home-document.mjs';
const root=path.resolve(new URL('..',import.meta.url).pathname),publicRoot=path.join(root,'public');
const projects=['andalus','nasaq','flex-academy','veyra','design-handoff','design-system-doctor','nexus','aevis','prepflow','promptilo','skinny','timer-gym','voicy'];
const files=['index.html','public/cv.html','public/projects/index.html',...projects.map(p=>`public/projects/${p}/${p==='nasaq'?'case-study-en.html':'index.html'}`),'public/projects/nasaq/case-study.html'];
const cache=new Map(),issues=[],dynamic=[];
async function page(file){
 if(!cache.has(file)){
  const html=await fs.readFile(file,'utf8');
  cache.set(file,file===path.join(root,'index.html')&&html.includes('src="/src/main.js"')?(await classicHomeDocument()).document:parseHTML(html).document);
 }
 return cache.get(file);
}
for(const relative of files){
 const file=path.join(root,relative),document=await page(file);
 for(const link of document.querySelectorAll('a[href]')){
  const value=link.getAttribute('href');
  if(/^[a-z][a-z0-9+.-]*:/i.test(value)||value.startsWith('//'))continue;
  const url=new URL(value,'https://portfolio.local/'+(relative==='index.html'?'':relative.replace(/^public\//,'')));
  if(!url.hash)continue;
  let target=url.pathname==='/'?path.join(root,'index.html'):path.join(publicRoot,decodeURIComponent(url.pathname));
  try{if((await fs.stat(target)).isDirectory())target=path.join(target,'index.html')}catch{continue}
  const targetDocument=await page(target),id=decodeURIComponent(url.hash.slice(1));
  if(targetDocument.getElementById(id)||targetDocument.querySelector(`a[name="${id.replaceAll('"','\\"')}"]`))continue;
  const item={file:relative,href:value,label:link.textContent.trim()};
  if(/\/projects\/nasaq\/(index|en|ar)\.html$/.test(target)){dynamic.push(item);continue}
  issues.push(item);
 }
}
const result={checkedPages:files.length,missingStaticFragments:issues,dynamicNasaqRoutesRequiringRuntimeCheck:dynamic};
await fs.writeFile(path.join(root,'docs/fragment-verification.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({checkedPages:files.length,missingStaticFragments:issues,dynamicNasaqLinksDeferredToRuntime:dynamic.length}));
process.exitCode=issues.length?1:0;
