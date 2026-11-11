import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';

// User requirement: exactly TWO questions in both languages; the second opens the destination.
for (const language of ['en','ar']) for (const format of ['case','system']) {
 test(`Nasaq ${language} ${format} opens directly after exactly two questions`,async()=>{
  const {document,window}=parseHTML('<main id="entry"></main>');
  window.HTMLElement.prototype.focus=function(){};
  let saved,closed=false;
  const context=vm.createContext({URL,localStorage:{setItem(key,value){saved=[key,value]}}});
  vm.runInContext(await fs.readFile(new URL('../public/projects/nasaq/assets/onboarding.js',import.meta.url),'utf8'),context);
  const host=document.querySelector('#entry');
  const controller=context.NasaqOnboarding.mount(host,{base:'https://example.test/projects/nasaq/',modal:true,onClose(){closed=true}});
  const click=selector=>host.querySelector(selector).dispatchEvent(new window.Event('click',{bubbles:true}));
  assert.equal(host.querySelector('.nasaq-onboarding-count').textContent,'1 / 2');
  assert.equal(host.querySelectorAll('[data-final]').length,0);
  click(`[data-language=${language}]`);
  assert.equal(host.querySelector('.nasaq-onboarding-count').textContent,'2 / 2');
  assert.equal(host.dir,language==='ar'?'rtl':'ltr');
  assert.equal(host.lang,language);
  assert.equal(host.querySelectorAll('[data-final]').length,2);
  const file=format==='case'?(language==='ar'?'case-study.html':'case-study-en.html'):(language==='ar'?'index.html':'en.html');
  const link=host.querySelector(`[data-format=${format}]`);
  assert.equal(link.tagName,'A');
  assert.equal(link.href,`https://example.test/projects/nasaq/${file}#${format==='case'?'brief':'overview'}`);
  click(`[data-format=${format}]`);
  assert.deepEqual(saved,['nasaq-language',language]);
  assert.equal(host.querySelector('.nasaq-onboarding-count').textContent,'2 / 2');
  click('[data-onboarding-back]');
  assert.equal(host.querySelector('.nasaq-onboarding-count').textContent,'1 / 2');
  click('[data-onboarding-close]');assert.equal(closed,true);
  controller.reset();assert.equal(host.dir,'ltr');
 });
}
