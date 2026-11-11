import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';

const source=fs.readFileSync(new URL('../public/projects/nasaq/assets/icon-studio.js',import.meta.url),'utf8');
function setup(language='en',{clipboardFails=false}={}){
 const {window,document}=parseHTML('<!doctype html><html><body></body></html>');
 const exported={};
 window.HTMLElement.prototype.focus=function(){exported.focused=this;};
 window.HTMLElement.prototype.scrollIntoView=function(){};
 class StudioURL extends URL{
  static createObjectURL(blob){exported.blob=blob;return 'blob:icon-examples';}
  static revokeObjectURL(url){exported.revoked=url;}
 }
 const createElement=document.createElement.bind(document);
 document.createElement=name=>{const node=createElement(name);if(name==='a')node.click=()=>{exported.download=node.download;};return node;};
 const context=vm.createContext({document,Blob,TextEncoder,URL:StudioURL,setTimeout:fn=>fn(),navigator:{clipboard:{async writeText(text){if(clipboardFails)throw Error('Clipboard denied');exported.clipboard=text;}}},fetch(){throw Error('The portfolio must never invoke a model.');}});
 vm.runInContext(source,context);
 const studio=context.NASAQ_ICON_STUDIO;
 document.body.innerHTML=studio.render(language);
 const dialog=document.querySelector('dialog');
 dialog.showModal=()=>dialog.setAttribute('open','');
 dialog.close=()=>{dialog.removeAttribute('open');dialog.dispatchEvent(new window.Event('close'));};
 studio.mount();
 const $=selector=>document.querySelector(selector);
 const fire=(node,type,properties={})=>{const event=new window.Event(type,{bubbles:true,cancelable:true});Object.assign(event,properties);node.dispatchEvent(event);return event;};
 const click=selector=>{assert.ok($(selector),`Missing ${selector}`);return fire($(selector),'click');};
 const send=value=>{$('#studio-prompt').value=value;fire($('#studio-chat-form'),'submit');};
 const key=properties=>fire($('#studio-prompt'),'keydown',properties);
 return {studio,document,$,click,send,key,exported};
}
function zipEntries(bytes){
 const data=Buffer.from(bytes),entries={};let offset=0;
 while(data.readUInt32LE(offset)===0x04034b50){
  assert.equal(data.readUInt16LE(offset+8),0,'Example ZIP uses portable uncompressed entries');
  const size=data.readUInt32LE(offset+18),nameSize=data.readUInt16LE(offset+26),extra=data.readUInt16LE(offset+28);
  const name=data.subarray(offset+30,offset+30+nameSize).toString(),start=offset+30+nameSize+extra;
  entries[name]=data.subarray(start,start+size).toString();offset=start+size;
 }
 assert.equal(data.readUInt32LE(offset),0x02014b50,'ZIP has a central directory');
 assert.equal(data.readUInt32LE(data.length-22),0x06054b50,'ZIP has an end record');
 return entries;
}

test('the opening asks for one description without exposing settings or an icon canvas',()=>{
 for(const language of ['en','ar']){
  const {$,document}=setup(language);
  assert.equal(document.querySelectorAll('textarea').length,1);
  assert.equal(document.querySelectorAll('[data-studio-example]').length,3);
  assert.equal(document.querySelectorAll('.studio-icon-tile, select, .studio-steps').length,0);
  assert.equal($('.studio-chat-bar').hidden,true);
  assert.match($('.studio-footnote').textContent,language==='en'?/included SVG examples/:/أمثلة SVG/);
  assert.ok($('[data-studio-access]'));
 }
});

for(const language of ['en','ar'])test(`${language}: describe, choose a style, refine conversationally and download the whole set`,async()=>{
 const {$,document,click,send,exported}=setup(language);
 click('[data-studio-example="travel"]');
 assert.equal(document.querySelectorAll('.studio-turn').length,2);
 assert.equal(document.querySelectorAll('.studio-icon-tile').length,0,'No icons before choosing a style');
 click('[data-studio-choice="style:duotone"]');
 assert.equal(document.querySelectorAll('.studio-icon-tile').length,6);
 assert.match($('.studio-result').innerHTML,/fill="#E9EFFF"/);
 click('[data-studio-choice="lighter"]');
 assert.equal(document.querySelectorAll('.studio-icon-tile').length,6,'Only the latest preview is shown');
 assert.match($('.studio-result').innerHTML,/stroke-width="1.3"/);
 send(language==='en'?'Make the corners sharper':'اجعل الحواف حادة');
 assert.match($('.studio-result').innerHTML,/stroke-linejoin="miter"/);
 click('[data-studio-choice="approve"]');
 assert.match($('.studio-result').textContent,language==='en'?/Download 6 icons/:/تنزيل الأيقونات الست/);
 click('[data-studio-download]');
 assert.equal(exported.download,'nasaq-travel-icons.zip');
 const entries=zipEntries(await exported.blob.arrayBuffer());
 assert.equal(Object.keys(entries).filter(name=>name.endsWith('.svg')).length,6);
 assert.match(entries['stay.svg'],/stroke-width="1.3"/);
 assert.match(entries['stay.svg'],/stroke-linejoin="miter"/);
 assert.match(entries['stay.svg'],/<title>Stay: Nasaq example<\/title>/);
 assert.match(entries['generation-brief.txt'],/approval before invoking a paid model/);
 click('[data-studio-copy]');await new Promise(setImmediate);
 assert.match(exported.clipboard,/Example family: travel/);
 click('[data-studio-reset]');
 assert.equal(document.querySelectorAll('.studio-turn,.studio-icon-tile').length,0);
 assert.equal($('#studio-prompt').value,'');
});

test('an unfamiliar brief is retained and guides the user to an example without inventing icons',()=>{
 const {$,document,send,click}=setup();
 const brief='Icons for a fitness tracker <script>alert("unsafe")</script> & a calendar';
 send(brief);
 assert.equal($('.studio-turn-user p').textContent,brief);
 assert.equal($('.studio-turn script'),null);
 assert.equal(document.querySelectorAll('[data-studio-choice^="family:"]').length,3);
 click('[data-studio-choice="family:workspace"]');click('[data-studio-choice="style:outline"]');
 const before=$('.studio-icon-grid').innerHTML;
 send('Replace the document with a running shoe');
 assert.match($('#studio-thread').textContent,/Free-form changes to the shapes need live generation/);
 assert.equal($('.studio-icon-grid').innerHTML,before);
 click('[data-studio-choice="approve"]');click('[data-studio-copy]');
 assert.ok($('#studio-thread').textContent.includes(brief));
});

test('Enter sends, Shift+Enter and IME composition preserve the draft; empty input stays focused',()=>{
 const {$,document,key,send,exported}=setup();
 send('  ');assert.equal($('#studio-prompt').getAttribute('aria-invalid'),'true');assert.equal(exported.focused,$('#studio-prompt'));
 $('#studio-prompt').value='A travel planner';
 key({key:'Enter',shiftKey:true});assert.equal(document.querySelectorAll('.studio-turn').length,0);
 key({key:'Enter',isComposing:true});assert.equal(document.querySelectorAll('.studio-turn').length,0);
 key({key:'Enter'});assert.equal(document.querySelectorAll('.studio-turn').length,2);
 assert.equal($('#studio-prompt').getAttribute('aria-invalid'),null);
 assert.equal($('#studio-error').textContent,'');
});

test('access dialog returns focus and clipboard denial exposes the preserved brief',async()=>{
 const {$,click,exported}=setup('en',{clipboardFails:true});
 click('[data-studio-access]');assert.equal($('dialog').hasAttribute('open'),true);
 assert.match($('dialog').textContent,/authenticated model access and paid usage/);
 click('[data-studio-close]');assert.equal($('dialog').hasAttribute('open'),false);assert.equal(exported.focused,$('[data-studio-access]'));
 click('[data-studio-example="commerce"]');click('[data-studio-choice="style:outline"]');click('[data-studio-choice="approve"]');
 click('[data-studio-copy]');await new Promise(setImmediate);
 assert.equal($('.studio-brief-details').hidden,false);assert.equal($('.studio-brief-details').open,true);
 assert.match($('#studio-export-brief').textContent,/Example family: commerce/);
 assert.equal(exported.focused,$('#studio-export-brief'));
});

test('brief routing and supported refinements avoid misleading substring matches',()=>{
 const {studio}=setup();
 assert.equal(studio.inferFamily('A fitness workout tracker'),null);
 assert.equal(studio.inferFamily('Stripe subscription icons'),null);
 assert.equal(studio.inferFamily('Restore my previous set'),null);
 assert.equal(studio.refinement('Remove the color').style,'outline');
 for(const family of Object.values(studio.sets))for(const icon of family.icons){
  assert.match(studio.svg(icon),/viewBox="0 0 24 24"/);
  assert.doesNotMatch(studio.svg(icon),/<script|onload|href=/);
 }
});

test('the documentation renderer opens directly on the conversation without decorative artwork',()=>{
 const assetUrl=new URL('../public/projects/nasaq/assets/',import.meta.url);
 const context=vm.createContext({});
 for(const name of ['icon-studio.js','exploration-content.js','foundation-content.js','editorial-content.js','artwork-content.js','components-en-data.js','docs-en-content.js'])vm.runInContext(fs.readFileSync(new URL(name,assetUrl),'utf8'),context);
 const tokens=JSON.parse(fs.readFileSync(new URL('../downloads/tokens.json',assetUrl),'utf8'));
 const docs=context.createNasaqEnglish(tokens,context.NASAQ_COMPONENTS_EN,[]);
 const html=docs.renderers['icon-studio']();
 assert.match(html,/id="studio-chat-form"/);
 assert.doesNotMatch(html,/data-artwork-area|<figure|<select|studio-steps/);
 const runtime=fs.readFileSync(new URL('docs-en.js',assetUrl),'utf8');
 assert.match(runtime,/form:not\(#chat-form\):not\(#studio-chat-form\)/,'Documentation form examples must not attach a second submit handler to the studio');
});
