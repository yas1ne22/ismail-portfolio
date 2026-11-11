import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';

const asset=name=>fs.readFileSync(new URL('../public/projects/nasaq/assets/'+name,import.meta.url),'utf8');
const T=JSON.parse(fs.readFileSync(new URL('../public/projects/nasaq/downloads/tokens.json',import.meta.url)));
function setup(id,lang='en',{reduced=false,clipboardFails=false,viewport=1060}={}){
 const {window,document}=parseHTML(`<!doctype html><html lang="${lang}" dir="${lang==='ar'?'rtl':'ltr'}"><body></body></html>`);
 let active=null;Object.defineProperty(document,'activeElement',{get:()=>active});
 window.HTMLElement.prototype.focus=function(){active=this};window.HTMLElement.prototype.scrollIntoView=function(){};
 window.HTMLElement.prototype.getBoundingClientRect=function(){return {width:Math.min(viewport,parseInt(this.style.getPropertyValue('--layout-width'))||viewport),height:430,left:0,top:0}};
 const exported={},animations=[],mediaListeners=new Set(),observed=[],timers=new Map();let timerId=0;
 const media={matches:reduced,addEventListener(event,fn){mediaListeners.add(fn)},removeEventListener(event,fn){mediaListeners.delete(fn)}};
 window.HTMLElement.prototype.animate=function(frames,options){const a={target:this,frames,options,cancelled:false,cancel(){this.cancelled=true}};animations.push(a);return a};
 class PreviewURL extends URL{static createObjectURL(blob){exported.blob=blob;return 'blob:theme'}static revokeObjectURL(url){exported.revoked=url}}
 class Observer{constructor(fn){this.fn=fn;this.disconnected=false;observed.push(this)}observe(){}disconnect(){this.disconnected=true}}
 const create=document.createElement.bind(document);document.createElement=name=>{const el=create(name);if(name==='a')el.click=()=>exported.download=el.download;return el};
 const context=vm.createContext({document,NASAQ_TOKENS:T,Blob,TextEncoder,URL:PreviewURL,ResizeObserver:Observer,matchMedia:()=>media,setTimeout(fn){const n=++timerId;timers.set(n,fn);return n},clearTimeout(n){timers.delete(n)},navigator:{clipboard:{async writeText(text){if(clipboardFails)throw Error('Denied');exported.clipboard=text}}},fetch(){throw Error('Creative canvases must not call a network service')}});
 for(const file of ['icon-studio.js','exploration-content.js','foundation-content.js','foundation-runtime.js'])vm.runInContext(asset(file),context);
 const api=context.NASAQ_FOUNDATIONS;document.body.innerHTML=api.render(id,lang,T);context.mountNasaqFoundations();
 const $=s=>document.querySelector(s),fire=(node,type,properties={})=>{assert.ok(node,`Missing target for ${type}`);const event=new window.Event(type,{bubbles:true,cancelable:true});Object.assign(event,properties);node.dispatchEvent(event);return event};
 const click=s=>fire($(s),'click'),choose=(key,value,method='pointerover')=>fire($(`[data-foundation-key="${key}"][data-foundation-value="${value}"]`),method);
 return {api,context,document,$,fire,click,choose,exported,animations,observed,media,mediaListeners,timers};
}

test('every foundation has one clear heading and a working example in both languages',()=>{
 const {api}=setup('colors');
 for(const lang of ['en','ar'])for(const id of Object.keys(api.topics)){
  const html=api.render(id,lang,T),{document}=parseHTML('<html><body>'+html+'</body></html>');
  assert.equal(document.querySelectorAll('h1').length,1,id);
  assert.ok(document.querySelector('[data-foundation-stage]').textContent.trim(),id);
  assert.ok(document.querySelector('[data-foundation-toolbar] button'),id);
  assert.equal(document.querySelector('.page-head'),null,'No documentation head precedes the experience');
  assert.equal(document.querySelectorAll('select').length,0,'The entry is a canvas, not a configuration form');
 }
});

test('all ten color recipes resolve to real tokens and meet their stated text-pair contrast',()=>{
 const {api,context}=setup('colors'),data=context.NASAQ_EXPLORATION.tokens(T),contrast=context.NASAQ_EXPLORATION.contrast;
 for(const [palette] of api.palettes)for(const theme of ['light','dark']){
  const recipe=api.colorRecipe({...api.initial('colors','en'),palette,theme},T);
  for(const [role,source] of Object.entries(recipe.sources))assert.equal(recipe.values[role],data.get(source).hex,`${palette}/${theme}/${role}`);
  for(const [fg,bg] of [['text','background'],['text','surface'],['muted','surface'],['muted','background'],['on-action','action'],['link','surface'],['on-selected','selected']])assert.ok(contrast(recipe.values[fg],recipe.values[bg])>=4.5,`${palette}/${theme}/${fg}/${bg}`);
 }
});

test('hover transforms the same color world, while keyboard and touch select the same recipe',()=>{
 const {$,choose,api,document}=setup('colors'),original=$('.fnd-color-world');
 choose('palette','mint');assert.equal($('.fnd-color-world'),original,'Keep the DOM so colors can transition together');
 assert.equal($('[data-color-value=action]').textContent,api.colorRecipe({...api.initial('colors','en'),palette:'mint'},T).values.action);
 choose('theme','dark','focusin');assert.equal(original.dataset.sceneTheme,'dark');
 choose('palette','coral','click');assert.equal(document.querySelectorAll('.fnd-color-roles>div').length,4);
 assert.equal($('[data-foundation-value="coral"]').getAttribute('aria-pressed'),'true');
 assert.ok(original.getAttribute('style').includes(api.colorRecipe({...api.initial('colors','en'),palette:'coral',theme:'dark'},T).values.action));
});

test('theme download contains the exact visible recipe and releases the object URL',async()=>{
 const {$,choose,click,exported,context,document}=setup('colors');
 choose('palette','blue');choose('theme','dark');click('[data-foundation-export]');
 assert.equal(exported.download,'nasaq-blue-dark.json');
 const result=JSON.parse(await exported.blob.text());assert.equal(result.name,'blue');assert.equal(result.mode,'dark');
 assert.ok($('.fnd-color-world').getAttribute('style').includes(result.values.action));
 document.body.innerHTML='';context.mountNasaqFoundations();assert.equal(exported.revoked,'blob:theme');
});

test('direct typography editing survives composition and language changes without interpreting HTML',async()=>{
 const {$,fire,choose,click,exported}=setup('typography'),words='<img src=x onerror=alert(1)> كلماتك';
 $('[data-foundation-headline]').textContent=words;fire($('[data-foundation-headline]'),'input');
 choose('context','product');choose('lang','ar');
 assert.equal($('[data-foundation-headline]').textContent,words);assert.equal($('.fnd-type-world').dir,'rtl');
 assert.equal($('.fnd-type-world img'),null);
 click('[data-foundation-export]');await new Promise(setImmediate);
 const recipe=JSON.parse(exported.clipboard);assert.equal(recipe.headline,words);assert.equal(recipe.token,'type.heading-xl');
});

test('clipboard denial reveals a usable, selectable recipe',async()=>{
 const {$,click}=setup('effects','ar',{clipboardFails:true});click('[data-foundation-export]');await new Promise(setImmediate);
 assert.equal($('.fnd-export-fallback').hidden,false);assert.equal($('.fnd-export-fallback').open,true);assert.match($('.fnd-export-fallback pre').textContent,/box-shadow/);
});

test('icon handoff carries the exact authored family and style into the real studio',()=>{
 const {$,choose,click,context,document}=setup('icons');
 choose('family','commerce');choose('style','duotone');assert.equal(document.querySelectorAll('.fnd-icon-set svg').length,6);
 click('[data-foundation-handoff]');assert.equal(context.NASAQ_ICON_STUDIO_START.set,'commerce');
 document.body.innerHTML=context.NASAQ_ICON_STUDIO.render('en');context.NASAQ_ICON_STUDIO.mount();
 assert.equal(context.NASAQ_ICON_STUDIO_START,undefined);
 assert.equal(document.querySelectorAll('.studio-icon-tile').length,6);assert.match($('.studio-result').innerHTML,/fill="#E9EFFF"/);
 assert.match($('.studio-result').textContent,/Commerce/);
});

test('effects update real surface classes and the focus specimen without replacing the scene',()=>{
 const {$,choose}=setup('effects'),front=$('.fnd-depth-front');
 choose('effect','floating');assert.equal($('.fnd-depth-front'),front);assert.ok(front.classList.contains('nq-effect-floating'));
 choose('effect','focus','focusin');assert.ok($('[data-depth-action]').classList.contains('state-focus'));
 choose('effect','wash','click');assert.ok(front.classList.contains('nq-effect-wash'));assert.equal($('[data-depth-action]').classList.contains('state-focus'),false);
});

test('resizing uses actual available width and releases its observer on navigation',()=>{
 const {$,fire,choose,click,observed,context,document}=setup('spacing','en',{viewport:800});
 assert.equal($('[data-layout-measure]').textContent,'800px');assert.match($('[data-layout-columns]').textContent,/8 columns/);
 $('[data-foundation-width]').value=360;fire($('[data-foundation-width]'),'input');
 assert.equal($('[data-layout-measure]').textContent,'360px');assert.match($('[data-layout-columns]').textContent,/4 columns/);
 choose('density','roomy');assert.equal($('[data-layout-frame]').style.getPropertyValue('--layout-pad'),'48px');
 click('[data-foundation-guides]');assert.equal($('[data-layout-frame]').dataset.guides,'true');
 document.body.innerHTML='';context.mountNasaqFoundations();assert.ok(observed.every(o=>o.disconnected));
});

for(const lang of ['en','ar'])test(`${lang}: motion previews the selected behavior on the same screen with real tokens`,()=>{
 const {$,choose,animations,context,document}=setup('motion',lang),screen=$('.fnd-motion-world');
 choose('behavior','switch');assert.equal($('.fnd-motion-world'),screen);assert.equal(animations.at(-1).options.duration,120);
 assert.equal(animations.at(-1).frames[1].transform,`translateX(${lang==='ar'?-22:22}px)`);
 choose('behavior','dialog');assert.equal(screen.dataset.behavior,'dialog');assert.equal(animations.at(-1).options.duration,200);
 document.body.innerHTML='';context.mountNasaqFoundations();assert.ok(animations.every(a=>a.cancelled));
});

test('reduced motion stops animations and preserves the selected preview state',()=>{
 const {$,choose,animations,media,mediaListeners}=setup('motion','en',{reduced:true});
 choose('behavior','dialog');assert.equal(animations.length,0);assert.equal($('.fnd-motion-world').dataset.active,'true');
 media.matches=false;choose('behavior','loading');assert.equal(animations.length,1);
 media.matches=true;for(const fn of mediaListeners)fn();assert.equal(animations[0].cancelled,true);
});

test('each symbol has one named picker, one preview and a matching download',()=>{
 const {$,choose,document}=setup('misc');choose('symbol','flower');
 assert.equal(document.querySelectorAll('.fnd-symbol-world img').length,1);
 assert.match($('.fnd-symbol-preview').getAttribute('src'),/misc-flower.svg/);
 assert.equal($('.fnd-symbol-preview').alt,'Flower');
 assert.match($('.fnd-symbol-world>a').getAttribute('href'),/misc-flower.svg/);
 assert.equal($('[data-foundation-value=flower]').textContent,'Flower');
});

for(const lang of ['en','ar'])test(`${lang}: foundation pages omit promotional captions and repeated reference links`,()=>{
 const {api}=setup('colors',lang);
 for(const [id,names] of Object.entries(api.topics)){
  const {document}=parseHTML('<html><body>'+api.render(id,lang,T)+'</body></html>');
  assert.equal(document.querySelector('h1').textContent,names[lang==='ar'?1:0]);
  assert.equal(document.querySelectorAll('.fnd-eyebrow,.fnd-bottom-line,.fnd-canvas-kicker,.fnd-symbol-poster,.fnd-depth-plane,small').length,0,id);
  assert.equal(document.querySelectorAll('[data-foundation-reference]').length,0,id);
 }
});

test('the real documentation routes put each experience first and keep native relationships unique',()=>{
 const context=vm.createContext({});
 for(const file of ['icon-studio.js','exploration-content.js','foundation-content.js','editorial-content.js','artwork-content.js','components-en-data.js','docs-en-content.js'])vm.runInContext(asset(file),context);
 const docs=context.createNasaqEnglish(T,context.NASAQ_COMPONENTS_EN,[]);
 for(const id of Object.keys(context.NASAQ_FOUNDATIONS.topics)){
  const {document}=parseHTML('<html><body><main>'+docs.renderers[id]()+'</main></body></html>');
  assert.equal(document.querySelector('main').firstElementChild.dataset.foundation,id);
  assert.ok(document.querySelector('#foundation-reference details'));
  assert.equal(document.querySelectorAll('main h1').length,1,id);
  const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);assert.equal(ids.length,new Set(ids).size,id);
 }
 assert.ok(docs.renderers.colors({artwork:false}).includes('Core palette'),'Portable documentation can opt out');
 assert.ok(docs.renderers.colors().includes('interaction-colors'),'Keep the existing interaction color contract in the reference');
});
