import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
const root=new URL('../public/projects/nasaq/',import.meta.url);
const read=name=>fs.readFileSync(new URL(name,root),'utf8');
function setup(language='en',hash=''){
 const {document,window}=parseHTML(read(language==='ar'?'case-study.html':'case-study-en.html'));
 window.HTMLElement.prototype.focus=function(){};
 window.HTMLElement.prototype.scrollIntoView=function(){};
 window.HTMLElement.prototype.getBoundingClientRect=function(){return {top:300}};
 window.scrollY=0;window.innerHeight=900;
 const context=vm.createContext({document,window,location:{hash},URL,Blob,TextEncoder,setTimeout,requestAnimationFrame:fn=>fn()});
 for(const file of ['case-token-values.js','icon-studio.js','case-experiences.js'])vm.runInContext(read('assets/'+file),context);
 const $=selector=>document.querySelector(selector);
 const click=selector=>{assert.ok($(selector),selector);$(selector).dispatchEvent(new window.Event('click',{bubbles:true,cancelable:true}))};
 return {document,window,$,click};
}
for(const language of ['en','ar']){
 test(`${language}: direction switching retains input and the native form interaction`,()=>{
  const {$,click,window}=setup(language);
  $('#case-demo-name').value='My edited name';
  $('#case-demo-email').value='edited@example.test';
  click('[data-case-language=ar]');
  assert.equal($('[data-direction-workspace]').dir,'rtl');
  assert.equal($('[data-demo-text=title]').textContent,'مساحتك، على طريقتك.');
  assert.equal($('#case-demo-email').dir,'ltr');
  assert.equal($('#case-demo-name').value,'My edited name');
  $('[data-direction-form]').dispatchEvent(new window.Event('submit',{cancelable:true}));
  assert.match($('[data-direction-status]').textContent,/تم الحفظ/);
  click('[data-case-language=en]');
  assert.equal($('[data-direction-workspace]').dir,'ltr');
  assert.equal($('#case-demo-email').value,'edited@example.test');
  assert.match($('[data-direction-status]').textContent,/changes saved/);
 });
 test(`${language}: token inspection follows the published aliases across themes and activation`,()=>{
  const {$,click}=setup(language);
  const tokens=JSON.parse(read('downloads/tokens.json'));
  click('[data-token-theme=dark]');
  assert.equal($('[data-token-value]').textContent,tokens.semantic.dark.action.$value.hex);
  assert.equal($('.case-token-preview').style.getPropertyValue('--nq-action'),tokens.semantic.dark.action.$value.hex);
  assert.equal($('[data-token-reference]').textContent,tokens.component.button.dark.background.$value);
  click('[data-token-step=alias]');
  assert.match($('[data-token-inspector-path]').textContent,/component.button.dark.background/);
  click('[data-token-action]');
  assert.equal($('[data-token-action]').getAttribute('aria-pressed'),'true');
  click('[data-token-theme=light]');
  assert.equal(tokens.semantic.light.action.$value,'{color.cobalt}');
  assert.equal($('[data-token-value]').textContent,tokens.color.cobalt.$value.hex);
  assert.equal($('[data-token-action]').getAttribute('aria-pressed'),'true');
  click('[data-token-action]');
  assert.equal($('[data-token-action]').getAttribute('aria-pressed'),'false');
 });
 test(`${language}: supporting writing remains reachable through existing section URLs`,()=>{
  const {document,$}=setup(language,'#trace');
  assert.equal($('#trace').closest('details').open,true);
  assert.equal(document.querySelectorAll('.case-chapter').length,4);
  assert.equal(document.querySelectorAll('.case-contents>a').length,4);
  assert.equal(document.querySelectorAll('h1').length,1);
  assert.ok($('#decisions'));assert.ok($('#language'));assert.ok($('#next'));
  assert.equal(document.querySelectorAll('.studio-icon-tile').length,6);
  assert.equal(document.querySelectorAll('.case-output-card').length,3);
  const ids=[...document.querySelectorAll('[id]')].map(node=>node.id);
  assert.equal(new Set(ids).size,ids.length,'No duplicate IDs in the embedded experience');
 });
}
