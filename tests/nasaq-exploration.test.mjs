import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';

const asset=name=>fs.readFileSync(new URL('../public/projects/nasaq/assets/'+name,import.meta.url),'utf8');
const T=JSON.parse(fs.readFileSync(new URL('../public/projects/nasaq/downloads/tokens.json',import.meta.url)));
function setup(id,lang='en',{reduced=false,clipboardFails=false}={}){
 const {window,document}=parseHTML(`<!doctype html><html lang="${lang}" dir="${lang==='ar'?'rtl':'ltr'}"><body></body></html>`);
 let active=null;Object.defineProperty(document,'activeElement',{get:()=>active});
 window.HTMLElement.prototype.focus=function(){active=this};
 const animations=[],clipboard=[],mediaListeners=new Set();
 window.HTMLElement.prototype.animate=function(frames,options){const a={target:this,frames,options,cancelled:false,cancel(){this.cancelled=true}};animations.push(a);return a};
 const media={matches:reduced,addEventListener(event,fn){mediaListeners.add(fn)},removeEventListener(event,fn){mediaListeners.delete(fn)}};
 const context=vm.createContext({document,NASAQ_TOKENS:T,matchMedia:()=>media,navigator:{clipboard:{async writeText(value){if(clipboardFails)throw Error('Denied');clipboard.push(value)}}}});
 vm.runInContext(asset('code-editor.js'),context);
 vm.runInContext(asset('exploration-content.js'),context);
 const api=context.NASAQ_EXPLORATION;document.body.innerHTML=api.markup(id,lang,T);
 vm.runInContext(asset('exploration-runtime.js'),context);context.mountNasaqExploration();
 const $=s=>document.querySelector(s),fire=(node,event,props={})=>{assert.ok(node,`Missing target for ${event}`);const e=new window.Event(event,{bubbles:true,cancelable:true});Object.assign(e,props);node.dispatchEvent(e);return e};
 const click=s=>fire($(s),'click');
 const change=(key,value)=>{const node=$(`[data-control="${key}"]`);assert.ok(node);if(node.type==='checkbox')node.checked=value;else if(node.tagName==='SELECT'){node.querySelectorAll('option').forEach(o=>o.removeAttribute('selected'));node.querySelector(`option[value="${value}"]`).selected=true;}else node.value=value;fire(node,node.tagName==='SELECT'||node.type==='checkbox'?'change':'input')};
 return {context,api,document,$,fire,click,change,animations,clipboard,media,mediaListeners};
}

for(const lang of ['en','ar']){
 test(`${lang}: motion shows every interaction immediately, with no form or playback gate`,()=>{
  const {$,document,api}=setup('motion',lang);
  assert.equal(document.querySelectorAll('select,input,textarea,[data-play]').length,0);
  assert.equal(document.querySelectorAll('[data-motion-demo]').length,10);
  assert.equal(document.querySelectorAll('[data-motion-curve]').length,4);
  for(const [kind,,,,,token] of api.motionRecipes){assert.ok($(`[data-motion-demo="${kind}"]`));assert.ok(api.tokens(T).get(token))}
 });
 test(`${lang}: motion uses token timing on hover and cancels on departure`,()=>{
  const {$,fire,animations,context,document}=setup('motion',lang),tile=$('[data-motion-demo="switch"]');
  assert.equal(animations.length,0,'Nothing loops on page entry');
  fire(tile,'pointerenter');assert.equal(animations.length,1);
  assert.equal(animations[0].options.duration,120);
  assert.equal(animations[0].frames[1].transform,`translateX(${lang==='ar'?-24:24}px)`);
  fire(tile,'pointerleave');assert.equal(animations[0].cancelled,true);
  fire($('[data-motion-demo="curves"]'),'focus');
  assert.equal(animations.length,5);assert.equal(new Set(animations.slice(1).map(a=>a.options.easing)).size,4);
  document.body.innerHTML='';context.mountNasaqExploration();assert.ok(animations.every(a=>a.cancelled),'Route teardown cancels all active previews');
 });
 test(`${lang}: light and dark color scenes are both visible with real token values`,()=>{
  const {document,$,api}=setup('colors',lang);
  assert.equal(document.querySelectorAll('select,input,button').length,0);
  assert.equal(document.querySelectorAll('.color-scene').length,2);
  assert.equal(document.querySelectorAll('.color-annotated').length,8);
  assert.equal(document.querySelectorAll('.color-editorial-strip article').length,3);
  for(const theme of ['light','dark']){
   const scene=$(`.color-scene[data-theme="${theme}"]`),data=api.tokens(T);
   assert.ok(scene.getAttribute('style').includes(data.get(`semantic.${theme}.background`).hex));
   assert.ok(scene.textContent.includes(api.contrast(data.get(`semantic.${theme}.text`).hex,data.get(`semantic.${theme}.background`).hex).toFixed(2)));
  }
 });
}

test('reduced motion prevents hover and keyboard animations, including after a preference change',()=>{
 const {$,fire,media,mediaListeners,animations}=setup('motion','en',{reduced:true});
 fire($('[data-motion-demo="reveal"]'),'pointerenter');assert.equal(animations.length,0);
 media.matches=false;for(const fn of mediaListeners)fn();
 fire($('[data-motion-demo="dialog"]'),'focus');assert.equal(animations.length,1);
 media.matches=true;for(const fn of mediaListeners)fn();assert.equal(animations[0].cancelled,true);
});

for(const lang of ['en','ar'])test(`${lang}: every component renders all states with valid, isolated native relationships`,()=>{
 const {api}=setup('buttons',lang);
 for(const id of Object.keys(api.modes)){
  const {document}=parseHTML('<html><body>'+api.markup(id,lang,T)+'</body></html>');
  assert.equal(document.querySelectorAll('[data-frame]').length,api.modes[id].length,id);
  const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);
  assert.equal(new Set(ids).size,ids.length,id+' has unique IDs');
  for(const el of document.querySelectorAll('[for],[aria-controls],[aria-labelledby],[aria-describedby],[data-open],[data-close]')){
   for(const attr of ['for','aria-controls','aria-labelledby','aria-describedby','data-open','data-close'])if(el.hasAttribute(attr))for(const target of el.getAttribute(attr).split(' '))assert.ok(document.getElementById(target),id+' relationship '+target);
  }
 }
});

test('canvas selection works from each variant label; copy matches the selected variant',async()=>{
 const {$,click,clipboard}=setup('buttons');
 click('.component-frame-name[data-select-variant="disabled"]');
 assert.ok($('[data-frame="disabled"]').classList.contains('is-selected'));
 assert.equal($('.component-frame-name[data-select-variant="disabled"]').getAttribute('aria-pressed'),'true');
 click('[data-copy-example]');await new Promise(setImmediate);
 assert.match(clipboard[0],/disabled/);
 click('[data-frame="loading"] .component-frame-name');
 assert.equal($('[data-selection-name]').textContent,'Loading');
 assert.match($('[data-source]').textContent,/aria-busy="true"/);
});

test('properties change actual variants, preserve visitor text across language switches and reset',()=>{
 const {$,change,click}=setup('buttons'),words='<img src=x onerror=alert(1)> My label';
 change('label',words);change('variant','secondary');change('size','small');change('lang','ar');
 assert.equal($('[data-frame="default"] .nq-button').textContent,words);
 assert.equal($('[data-frame="default"] img'),null);
 assert.ok($('[data-frame="default"] .nq-button').classList.contains('secondary'));
 assert.ok($('[data-frame="default"] .nq-button').classList.contains('small'));
 assert.equal($('[data-frame="default"] .component-frame-surface').dir,'rtl');
 click('[data-reset]');assert.equal($('[data-frame="default"] .nq-button').textContent,'Start writing');
});

test('native changes are represented by selected component source without losing input on selection',()=>{
 const {$,fire,click}=setup('inputs'),input=$('[data-frame="default"] input');
 input.value='custom@example.com';fire(input,'input');
 click('.component-frame-name[data-select-variant="disabled"]');
 click('.component-frame-name[data-select-variant="default"]');
 assert.equal($('[data-frame="default"] input').value,'custom@example.com');
 assert.match($('[data-source]').textContent,/custom@example.com/);
});

test('expanded canvas restores body scrolling on Escape and on route disposal',()=>{
 const {$,click,fire,document,context}=setup('buttons');
 document.body.style.overflow='auto';click('[data-expand]');
 assert.ok($('[data-studio]').classList.contains('is-expanded'));assert.equal(document.body.style.overflow,'hidden');
 fire(document,'keydown',{key:'Escape'});assert.equal(document.body.style.overflow,'auto');
 click('[data-expand]');document.body.innerHTML='';context.mountNasaqExploration();assert.equal(document.body.style.overflow,'auto');
});

for(const lang of ['en','ar'])test(`${lang}: HTML view is keyboard accessible, isolated from preview tabs and preserves the selection`,()=>{
 const {$,click,fire,document}=setup('tabs',lang);
 assert.equal(document.querySelectorAll('[data-zoom],[data-zoom-value]').length,0);
 click('[data-frame="second"] .component-frame-name');
 const codeTab=$('[data-showcase-view="code"]');
 fire($('[data-showcase-view="preview"]'),'keydown',{key:lang==='ar'?'ArrowLeft':'ArrowRight'});
 assert.equal(codeTab.getAttribute('aria-selected'),'true');
 assert.equal($('[data-showcase-panel="preview"]').hidden,true);
 assert.equal($('[data-showcase-panel="code"]').hidden,false);
 assert.equal($('[data-selection-name]').textContent,lang==='ar'?'الثاني':'Second');
 assert.equal($('[data-frame="second"] [role=tab]').getAttribute('aria-selected'),'false','Showcase tabs do not activate component tabs');
 click('[data-showcase-view="preview"]');assert.equal($('[data-showcase-panel="preview"]').hidden,false);
});

test('a typed input survives changes to content and preview language; Reset clears it',()=>{
 const {$,change,fire,click}=setup('inputs'),input=$('[data-frame="default"] input');
 input.value='my.draft@example.com';fire(input,'input');
 change('label','Contact email');change('lang','ar');
 assert.equal($('[data-frame="default"] input').value,'my.draft@example.com');
 assert.equal($('[data-frame="default"] input').dir,'ltr');
 assert.match($('[data-source]').textContent,/my.draft@example.com/);
 click('[data-reset]');assert.equal($('[data-frame="default"] input').value,'nora@example.com');
});

test('copy HTML matches the formatted editor source after a native input change',async()=>{
 const {$,fire,click,clipboard}=setup('inputs');
 $('[data-frame="default"] input').value='new@example.com';fire($('[data-frame="default"] input'),'input');
 click('[data-showcase-view="code"]');click('[data-copy-example]');await new Promise(setImmediate);
 assert.equal(clipboard[0],$('[data-source]').textContent);
 assert.match(clipboard[0],/\n  <div/);assert.match(clipboard[0],/new@example.com/);
 assert.ok($('.nq-code-editor .code-tag'));
});

test('typography and RTL drafts keep their existing editable experience',()=>{
 for(const id of ['typography','start']){
  const {$,change}=setup(id);const key=id==='typography'?'title':'name';
  change(key,'My own text العربية');change('lang','ar');
  assert.equal($('[data-control="'+key+'"]').value,'My own text العربية');
  assert.equal($('[data-preview]').dir,'rtl');assert.ok($('[data-source]').textContent.includes('My own text العربية'));
 }
});

for(const lang of ['en','ar'])test(`${lang}: canvas keeps one selector per variant and one toolbar`,()=>{
 const {api}=setup('buttons',lang);
 for(const id of Object.keys(api.modes)){
  const {document}=parseHTML('<html><body>'+api.markup(id,lang,T)+'</body></html>');
  assert.equal(document.querySelectorAll('[data-select-variant]').length,api.modes[id].length,id);
  assert.equal(document.querySelectorAll('.component-layers,.component-state-chips,.component-canvas-meta').length,0,id);
  assert.equal(document.querySelectorAll('[data-zoom-value],[data-zoom]').length,0,id);
  assert.equal(document.querySelectorAll('[data-showcase-view]').length,2,id);
 }
});

for(const lang of ['en','ar'])test(`${lang}: mixed checkbox initializes correctly, survives property changes and resets`,()=>{
 const {$,click,change,fire}=setup('checkbox',lang);
 assert.equal($('[data-frame="mixed"] input').indeterminate,true);
 change('label','Sources');assert.equal($('[data-frame="mixed"] input').indeterminate,true);
 click('[data-frame="mixed"] .component-frame-name');assert.match($('[data-source]').textContent,/indeterminate = true/);
 const mixed=$('[data-frame="mixed"] input');mixed.indeterminate=false;fire(mixed,'change');
 change('label','Selected sources');assert.equal($('[data-frame="mixed"] input').indeterminate,false);
 click('[data-reset]');assert.equal($('[data-frame="mixed"] input').indeterminate,true);
});
