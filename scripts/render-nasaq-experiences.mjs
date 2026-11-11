import fs from 'node:fs/promises';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
import {caseExperiences} from '../src/nasaq/case-experiences.mjs';
import {writeIfChanged} from '../lib/writeIfChanged.js';
const root=new URL('../public/projects/nasaq/',import.meta.url);
const tokens=JSON.parse(await fs.readFile(new URL('downloads/tokens.json',root),'utf8'));
const release=JSON.parse(await fs.readFile(new URL('../../Nasaq/release.json',import.meta.url),'utf8'));
const version=release.version.replace(/\.0$/,'');
const countTokens=value=>value&&typeof value==='object'?('$value'in value?1:Object.values(value).reduce((sum,item)=>sum+countTokens(item),0)):0;
// The playground consumes the published DTCG source rather than a parallel palette.
const resolveColor=value=>typeof value==='string'&&/^\{[^{}]+\}$/.test(value)
 ? resolveColor(value.slice(1,-1).split('.').reduce((node,key)=>node[key],tokens).$value)
 : value.hex;
const themes=Object.fromEntries(['light','dark'].map(theme=>[theme,Object.fromEntries(Object.entries(tokens.semantic[theme]).map(([key,token])=>[key,resolveColor(token.$value)]))]));
await writeIfChanged(new URL('assets/case-token-values.js',root),`globalThis.NASAQ_CASE_TOKENS=${JSON.stringify(themes)};\n`);
const studioContext={};vm.runInNewContext(await fs.readFile(new URL('assets/icon-studio.js',root),'utf8'),studioContext);
for(const lang of ['en','ar']){
 const ar=lang==='ar',t=(a,b)=>ar?a:b,file=new URL(ar?'case-study.html':'case-study-en.html',root);
 const {document}=parseHTML(await fs.readFile(file,'utf8'));
 for(const fact of document.querySelectorAll('.case-facts>div')){
  if(['Release','الإصدار'].includes(fact.querySelector('dt')?.textContent.trim()))fact.querySelector('dd').textContent=version;
 }
 const originals={};
 for(const key of ['brief','problem','decisions','craft','icon-studio','trace','language','review-release','evidence','next']){
  const source=document.querySelector(`[data-case-original="${key}"]`)||document.getElementById(key);
  if(source)originals[key]=source.innerHTML;
 }
 const footer=document.querySelector('main footer').outerHTML;
 const {document:studioDoc}=parseHTML(`<html><body>${studioContext.NASAQ_ICON_STUDIO.render(lang)}</body></html>`);
 studioDoc.querySelector('.studio-heading').remove();
 const studio=studioDoc.body.innerHTML;
 document.body.dataset.visualCase='v1';
 const main=document.querySelector('.case-layout');
 main.innerHTML=`<nav class="case-contents" aria-label="${t('فصول دراسة المشروع','Case study chapters')}">${[['problem','01',t('اللغة','Direction')],['craft','02',t('النظام','System')],['icon-studio','03',t('التجربة','Experience')],['evidence','04',t('التعلّم','Reflection')]].map(([id,n,label],i)=>`<a href="#${id}"${i===0?' aria-current="location"':''}><span>${n}</span>${label}</a>`).join('')}<div class="case-reading-progress" aria-hidden="true"><span></span></div></nav><main id="case-content" tabindex="-1">${caseExperiences(lang,originals,studio,countTokens(tokens),version)}${footer}</main>`;
 document.querySelector('.case-opening').id='brief';
 const copy=document.querySelector('.case-opening-copy');
 copy.querySelector('.case-hero-intro')?.remove();copy.querySelector('.case-hero-actions')?.remove();
 copy.insertAdjacentHTML('afterbegin',`<p class="case-hero-intro case-eyebrow">NASAQ <span>/</span> ${t('دراسة مشروع تفاعلية','AN INTERACTIVE CASE STUDY')}</p>`);
 copy.insertAdjacentHTML('beforeend',`<div class="case-hero-actions"><a class="nq-button" href="#problem">${t('استكشف القصة','Explore the story')} <span aria-hidden="true">↓</span></a><span>${t('٤ فصول · جرّب أثناء القراءة','4 chapters · Try as you read')}</span></div>`);
 const art=document.querySelector('.case-opening-art');
 art.querySelector('.case-hero-art-caption')?.remove();
 art.insertAdjacentHTML('beforeend',`<figcaption class="case-hero-art-caption"><span>${t('لغة واحدة للتصميم','ONE DESIGN LANGUAGE')}</span><strong>${t('اتجاها قراءة.\nنظام واحد.','Two directions.\nOne system.')}</strong><div><b lang="ar" dir="rtl">العربية</b><span aria-hidden="true">↔</span><b lang="en">English</b></div></figcaption>`);
 for(const href of ['assets/icon-studio.css','assets/case-experiences.css'])if(!document.querySelector(`link[href="${href}"]`))document.head.insertAdjacentHTML('beforeend',`<link rel="stylesheet" href="${href}">`);
 for(const src of ['assets/case-token-values.js','assets/icon-studio.js','assets/case-experiences.js'])if(!document.querySelector(`script[src="${src}"]`))document.body.insertAdjacentHTML('beforeend',`<script src="${src}"></script>`);
 await writeIfChanged(file,document.toString());
}
// Keep the Nasaq source distribution and the portfolio copy aligned, without
// overwriting documentation assets being developed separately.
const distribution=new URL('../../Nasaq/dist/',import.meta.url);
for(const name of ['case-study-en.html','case-study.html','assets/case-experiences.css','assets/case-experiences.js','assets/case-token-values.js']){
 await writeIfChanged(new URL(name,distribution),await fs.readFile(new URL(name,root),'utf8'));
}
console.log('Prepared English and Arabic visual Nasaq cases with published token values.');
