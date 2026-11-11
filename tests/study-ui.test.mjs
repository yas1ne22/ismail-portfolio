// DOM contracts for real event handlers. These do not replace browser,
// assistive-technology or participant checks.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseHTML} from 'linkedom';

let sequence=0;
async function openStudy(project,{city=false,clock,speech}={}){
 const file=city?'city.html':'study.html';
 const {window,document}=parseHTML(await readFile(new URL(`../public/projects/${project}/${file}`,import.meta.url),'utf8'));
 Object.assign(globalThis,{window,document});
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async()=>{}}}});
 window.HTMLElement.prototype.focus=function(){document.__focused=this};
 Object.defineProperty(document,'activeElement',{configurable:true,get(){return document.__focused}});
 window.HTMLElement.prototype.scrollIntoView=function(){};
 window.HTMLElement.prototype.showModal=function(){this.setAttribute('open','')};
 window.HTMLElement.prototype.close=function(){this.removeAttribute('open')};
 window.HTMLInputElement.prototype.checkValidity=function(){return this.type!=='email'||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)};
 const selectValue=Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype,'value');
 if(selectValue?.get&&!selectValue.set)Object.defineProperty(window.HTMLSelectElement.prototype,'value',{configurable:true,get:selectValue.get,set(value){for(const option of this.options)option.toggleAttribute('selected',option.value===String(value))}});
 if(!('selectedOptions' in window.HTMLSelectElement.prototype))Object.defineProperty(window.HTMLSelectElement.prototype,'selectedOptions',{get(){return [...this.options].filter(o=>o.selected)}});
 if(clock)Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>clock.now}});
 if(speech){window.speechSynthesis=speech;window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};}
 const entry=city?'veyra/city.js':'experience-lab.js';
 await import(new URL(`../public/projects/${entry}?test=${++sequence}`,import.meta.url));
 const get=selector=>{const node=document.querySelector(selector);assert.ok(node,`Missing control: ${selector}`);return node};
 const fire=(node,type)=>node.dispatchEvent(new window.Event(type,{bubbles:true,cancelable:true}));
 return {document,get,text:()=>document.querySelector(city?'#city-app':'#experience-app').textContent,
  click:selector=>{const node=get(selector);assert.ok(!node.disabled,`Disabled control: ${selector}`);fire(node,'click')},
  set:(selector,value,event='change')=>{const node=get(selector);if(node.tagName==='SELECT'){
   // Linkedom omits the browser's option-text value fallback.
   for(const option of node.options)if(!option.hasAttribute('value'))option.setAttribute('value',option.textContent);
   const option=[...node.options].find(o=>o.value===value);assert.ok(option,`Missing option ${value}`);option.selected=true;
  }else node.value=value;fire(node,event)},
  submit:selector=>fire(get(selector),'submit')};
}

async function withTimerStudy(clock,run,{speech}={}){
 const originalInterval=globalThis.setInterval,originalClear=globalThis.clearInterval,originalPerformance=globalThis.performance;
 let pulse,active=false;
 globalThis.setInterval=callback=>{pulse=callback;active=true;return 1;};globalThis.clearInterval=()=>{active=false;};
 try{const ui=await openStudy('timer-gym',{clock,speech});await run(ui,()=>{assert.ok(active,'The sample clock must be active before a timer pulse');pulse();});}
 finally{window.dispatchEvent(new window.Event('pagehide'));globalThis.setInterval=originalInterval;globalThis.clearInterval=originalClear;Object.defineProperty(globalThis,'performance',{configurable:true,value:originalPerformance});}
}

function cityKey(ui,key,{shiftKey=false}={}){
 const event=new window.Event('keydown',{bubbles:true,cancelable:true});
 Object.defineProperties(event,{key:{value:key},shiftKey:{value:shiftKey}});
 ui.document.dispatchEvent(event);return event;
}

test('Flex preserves a valid request across a confirmation failure and retry',async()=>{
 const ui=await openStudy('flex-academy');
 ui.click('[data-path="launch"]');
 ui.set('#flex-email','reviewer@example.com');ui.set('#flex-goal','start');ui.submit('#flex-form');
 assert.equal(ui.get('#flex-name').getAttribute('aria-invalid'),'true');
 assert.equal(ui.get('#flex-email').getAttribute('aria-invalid'),null);
 assert.match(ui.get('#flex-name').getAttribute('aria-describedby'),/flex-error/);
 ui.set('#flex-name','Sample reviewer');ui.set('#flex-email','not-an-email');ui.set('#flex-goal','start');ui.submit('#flex-form');
 assert.match(ui.text(),/valid sample email/);assert.equal(ui.get('#flex-name').value,'Sample reviewer');
 ui.set('#flex-email','reviewer@example.com');ui.submit('#flex-form');
 ui.set('#scenario','failure');ui.click('[data-action="confirm"]');assert.match(ui.text(),/could not confirm/);
 ui.set('#scenario','success');ui.click('[data-action="edit"]');assert.equal(ui.get('#flex-email').value,'reviewer@example.com');
 ui.submit('#flex-form');ui.click('[data-action="confirm"]');assert.match(ui.text(),/Sample registration complete/);
 ui.click('[data-action="cancel"]');assert.equal(ui.get('#flex-name').value,'Sample reviewer');
});

test('Flex clears a chosen slot when timezone or availability changes',async()=>{
 const ui=await openStudy('flex-academy');ui.click('[data-path="scale"]');
 ui.set('#flex-name','Sample');ui.set('#flex-email','reviewer@example.com');ui.set('#flex-goal','systems');ui.submit('#flex-form');
 ui.click('[data-slot]');assert.ok(!ui.get('[data-action="confirm"]').disabled);
 ui.set('#flex-zone','Europe/London');assert.ok(ui.get('[data-action="confirm"]').disabled);
 ui.set('#scenario','unavailable');assert.match(ui.text(),/No sample times/);assert.ok(ui.get('[data-action="confirm"]').disabled);
});

const flexEvents=ui=>[...ui.document.querySelectorAll('#flex-event-trace pre')].map(node=>JSON.parse(node.textContent));
test('Flex event wiring excludes form values and deduplicates a registration across failure, retry, edit and trace clearing',async()=>{
 const ui=await openStudy('flex-academy');ui.click('[data-path="launch"]');
 ui.set('#flex-email','private-unique@example.com');ui.set('#flex-goal','start');ui.submit('#flex-form');
 assert.deepEqual(flexEvents(ui).at(-1).invalidFields,['name']);
 ui.set('#flex-name','Secret sample name');ui.submit('#flex-form');
 const id=flexEvents(ui).at(-1).requestId;
 assert.equal(flexEvents(ui).filter(e=>e.event==='sample_registration_confirmed').length,0);
 ui.set('#scenario','failure');ui.click('[data-action="confirm"]');
 assert.equal(flexEvents(ui).at(-1).event,'sample_confirmation_failed');
 ui.set('#scenario','success');ui.click('[data-action="confirm"]');
 assert.equal(flexEvents(ui).filter(e=>e.event==='sample_registration_confirmed').length,1);
 ui.click('[data-action="edit"]');ui.submit('#flex-form');ui.click('[data-action="confirm"]');
 assert.equal(flexEvents(ui).at(-1).event,'sample_confirmation_reused');
 assert.equal(flexEvents(ui).at(-1).requestId,id);
 assert.equal(flexEvents(ui).filter(e=>e.event==='sample_registration_confirmed').length,1);
 const serialized=JSON.stringify(flexEvents(ui));
 assert.ok(!serialized.includes('private-unique@example.com')&&!serialized.includes('Secret sample name'));
 ui.click('#flex-events-clear');assert.equal(flexEvents(ui).length,0);
 ui.click('[data-action="edit"]');ui.submit('#flex-form');ui.click('[data-action="confirm"]');
 assert.equal(flexEvents(ui).at(-1).event,'sample_confirmation_reused');
 assert.ok(flexEvents(ui).every(e=>!e.realConversion));
});

test('Flex requires an explicit sample qualification review as well as a confirmed call and records a later reversal',async()=>{
 const ui=await openStudy('flex-academy');ui.click('[data-path="scale"]');
 assert.equal(ui.get('#flex-qualification').disabled,true);
 ui.set('#flex-name','Sample');ui.set('#flex-email','reviewer@example.com');ui.set('#flex-goal','systems');ui.submit('#flex-form');
 assert.equal(ui.get('#flex-qualification').disabled,false);
 ui.click('[data-slot]');ui.click('[data-action="confirm"]');
 assert.equal(flexEvents(ui).filter(e=>e.event==='sample_call_request_confirmed').length,1);
 assert.equal(flexEvents(ui).filter(e=>e.event==='sample_qualified_booking_confirmed').length,0);
 ui.set('#flex-qualification','met');ui.set('#flex-qualification','met');
 assert.equal(flexEvents(ui).filter(e=>e.event==='sample_qualified_booking_confirmed').length,1);
 ui.set('#flex-qualification','not_met');
 const revoked=flexEvents(ui).find(e=>e.event==='sample_qualified_booking_revoked');
 assert.equal(revoked.qualification,'not_met');assert.equal(revoked.reason,'qualification_changed');
 ui.click('[data-action="cancel"]');assert.equal(ui.get('#flex-qualification').disabled,true);
 assert.match(ui.get('#flex-event-current').textContent,/cancelled/);
});

test('Flex recognizes an existing request without counting a new registration, call request or qualified booking',async()=>{
 const ui=await openStudy('flex-academy');ui.set('#scenario','duplicate');ui.click('[data-path="scale"]');
 assert.equal(flexEvents(ui)[0].scenario,'duplicate');
 ui.set('#flex-name','Sample');ui.set('#flex-email','reviewer@example.com');ui.set('#flex-goal','systems');ui.submit('#flex-form');
 ui.set('#flex-qualification','met');ui.click('[data-slot]');ui.click('[data-action="confirm"]');
 assert.match(ui.text(),/Existing sample request/);
 assert.equal(flexEvents(ui).at(-1).event,'sample_existing_request_recognized');
 for(const event of ['sample_registration_confirmed','sample_call_request_confirmed','sample_qualified_booking_confirmed'])assert.equal(flexEvents(ui).filter(e=>e.event===event).length,0);
});

for(const project of ['design-handoff','design-system-doctor'])test(`${project}: corrections require a fresh scan; incomplete scope is disclosed`,async()=>{
 const ui=await openStudy(project);ui.click('[data-action="scan"]');ui.click('[data-action="fix"]');
 assert.doesNotMatch(ui.text(),/No review questions in this sample scope/);
 ui.click('[data-action="scan"]');assert.match(ui.text(),/No review questions in this sample scope/);
 ui.set('#scenario','partial');ui.click('[data-action="scan"]');assert.match(ui.text(),/unscanned nodes have not been cleared/);
 ui.set('#scenario','unsupported');ui.click('[data-action="scan"]');assert.match(ui.text(),/Unable to assess/);
 if(project==='design-system-doctor'){
  ui.set('#scenario','findings');ui.click('[data-choice="strict"]');ui.click('[data-action="scan"]');
  assert.match(ui.text(),/intentional campaign variation/);ui.click('[data-action="exception"]');ui.click('[data-action="scan"]');
  assert.match(ui.text(),/No review questions in this sample scope/);
 }
});

test('Nexus rejects equivalent URLs, retains invalid drafts and supports move/remove/undo',async()=>{
 const ui=await openStudy('nexus');
 ui.set('#site-title','Duplicate');ui.set('#site-url','https://www.figma.com/community/#section');ui.submit('#nexus-form');
 assert.match(ui.text(),/already saved/);
 ui.set('#site-title','Research');ui.set('#site-url','javascript:alert(1)');ui.submit('#nexus-form');
 assert.equal(ui.get('#site-title').value,'Research');assert.match(ui.text(),/complete http or https URL/);
 ui.set('#site-url','https://example.com/research');ui.set('#site-category','Learn');ui.submit('#nexus-form');
 assert.match(ui.text(),/Research/);
 // Remove the newly saved item rather than another item in the same category.
 const card=[...ui.document.querySelectorAll('.lab-item')].find(x=>x.textContent.includes('Research'));
 const savedId=card.querySelector('[data-action="remove"]').dataset.id;
 ui.click(`[data-action="move"][data-id="${savedId}"]`);ui.set('#site-category','Build');ui.submit('#nexus-form');
 assert.match(ui.text(),/example.com\/research · Build/);
 ui.click(`[data-action="remove"][data-id="${savedId}"]`);ui.click('[data-action="undo"]');
 assert.equal([...ui.document.querySelectorAll('.lab-item')].filter(x=>x.textContent.includes('Research')).length,1);
 ui.click(`[data-action="remove"][data-id="${savedId}"]`);
 ui.set('#site-title','Research');ui.set('#site-url','https://example.com/research');ui.set('#site-category','Work');ui.submit('#nexus-form');
 assert.equal(ui.document.querySelector('[data-action="undo"]'),null,'A new save must invalidate stale removal undo');
 ui.click('[data-category="All"]');
 assert.equal([...ui.document.querySelectorAll('.lab-item')].filter(x=>x.textContent.includes('example.com/research')).length,1);
 ui.click('[data-action="move"][data-id="1"]');ui.click('[data-action="remove"][data-id="1"]');
 assert.match(ui.get('#nexus-form').textContent,/Add website/,'Removing an item must also end its move form');
});

test('PrepFlow uses one plan for swaps, pantry deductions and valid serving quantities',async()=>{
 const ui=await openStudy('prepflow');ui.set('#meal','1');ui.set('#servings','3');
 assert.match(ui.text(),/Chickpea/);const rows=[...ui.document.querySelectorAll('tbody tr')].map(r=>r.textContent);
 assert.ok(rows.some(r=>r==='rice560100460'));assert.ok(rows.some(r=>r==='chickpeas9000900'));
 ui.set('#servings','2.5');assert.match(ui.text(),/last valid plan is retained/);assert.equal(ui.get('#servings').value,'3');
 ui.click('[data-action="next"]');ui.click('[data-action="pause"]');assert.ok(ui.get('[data-action="next"]').disabled);
 ui.click('[data-action="pause"]');assert.match(ui.text(),/Step 2 of 3/);
 ui.set('#meal','2');ui.click('[data-action="confirm-swap"]');ui.set('#equipment','none');assert.match(ui.text(),/requires an oven/);
});

test('Promptilo retains saves through empty results and prevents trusting an unapproved source',async()=>{
 const ui=await openStudy('promptilo');ui.click('[data-action="save"][data-id="a"]');
 ui.set('#resource-search','no matches','input');assert.match(ui.text(),/No resources match/);assert.match(ui.text(),/1 sample resources saved/);
 ui.click('[data-action="clear"]');assert.ok(ui.get('[data-action="save"][data-id="c"]').disabled);
 ui.click('[data-action="detail"][data-id="c"]');assert.match(ui.get('#resource-detail').textContent,/No verified source/);
 assert.ok(ui.get('#resource-dialog').hasAttribute('open'));ui.click('#close-resource');
});

test('Skinny keeps previous-day records independent and makes today’s changes reversible',async()=>{
 const ui=await openStudy('skinny');ui.click('[data-log="2"]');assert.equal(ui.get('[data-log="2"]').getAttribute('aria-pressed'),'true');
 ui.click('[data-action="undo"]');assert.equal(ui.get('[data-log="2"]').getAttribute('aria-pressed'),'false');
 ui.click('[data-choice="yesterday"]');assert.equal(ui.get('[data-log="1"]').getAttribute('aria-pressed'),'true');assert.ok(ui.get('[data-log="1"]').disabled);
 ui.click('[data-choice="today"]');assert.equal(ui.get('[data-log="1"]').getAttribute('aria-pressed'),'false');
 ui.set('#care-zone','Europe/London');assert.match(ui.text(),/original schedule: Asia\/Qatar/);
});

test('Timer projects elapsed time at pause and keeps controls stable between ticks',async()=>{
 const clock={now:0},originalInterval=globalThis.setInterval,originalClear=globalThis.clearInterval,originalPerformance=globalThis.performance;
 let tick;
 globalThis.setInterval=callback=>{tick=callback;return 1};globalThis.clearInterval=()=>{};
 try{
  const ui=await openStudy('timer-gym',{clock});ui.click('[data-action="toggle"]');
  const pause=ui.get('[data-action="toggle"]');clock.now=400;tick();assert.equal(ui.get('[data-action="toggle"]'),pause);
  // The tab/event loop can be delayed past a phase boundary before Pause is delivered.
  clock.now=5200;ui.click('[data-action="toggle"]');
  assert.equal(ui.get('.lab-timer').dataset.phase,'work');assert.match(ui.text(),/Paused/);
  ui.click('[data-action="toggle"]');clock.now=15300;tick();assert.equal(ui.get('.lab-timer').dataset.phase,'rest');
  clock.now=40000;tick();assert.equal(ui.get('.lab-timer').dataset.phase,'complete');assert.ok(ui.get('[data-action="toggle"]').disabled);
  ui.click('[data-action="restart"]');ui.click('#cancel-restart');assert.equal(ui.get('.lab-timer').dataset.phase,'complete');
  ui.click('[data-action="restart"]');ui.click('#confirm-restart');assert.equal(ui.get('.lab-timer').dataset.phase,'prepare');
 }finally{globalThis.setInterval=originalInterval;globalThis.clearInterval=originalClear;Object.defineProperty(globalThis,'performance',{configurable:true,value:originalPerformance})}
});

test('Timer preserves a focused cue control across an automatic phase change',async()=>{
 const clock={now:0};await withTimerStudy(clock,(ui,tick)=>{
  ui.click('[data-action="toggle"]');const checkbox=ui.get('#timer-color');checkbox.focus();
  clock.now=5000;tick();
  assert.equal(ui.get('.lab-timer').dataset.phase,'work');
  assert.ok(ui.get('#timer-color')===checkbox,'A phase change must not replace a focused control');
  assert.ok(ui.document.activeElement===checkbox);assert.ok(checkbox.isConnected);
 });
});

test('Timer settles time before page exit and restores a visibly paused session from the browser cache',async()=>{
 const clock={now:0};await withTimerStudy(clock,(ui,tick)=>{
  ui.click('[data-action="toggle"]');clock.now=1234;window.dispatchEvent(new window.Event('pagehide'));
  clock.now=100000;const restored=new window.Event('pageshow');Object.defineProperty(restored,'persisted',{value:true});window.dispatchEvent(restored);
  assert.match(ui.text(),/Paused/);assert.equal(ui.get('.lab-timer>strong').textContent,'00:04');
  assert.match(ui.get('#lab-status').textContent,/Restored from the browser cache.*remains paused/,'The page status must describe the restored paused state, not the previous running state');
  ui.click('[data-action="toggle"]');clock.now=103765;tick();assert.equal(ui.get('.lab-timer').dataset.phase,'prepare');
  clock.now=103766;tick();assert.equal(ui.get('.lab-timer').dataset.phase,'work');
 });
});

test('Timer remains readable without color, browser speech or haptics and keeps a useful completion focus',async()=>{
 const clock={now:0};await withTimerStudy(clock,(ui,tick)=>{
  assert.ok(ui.get('#timer-voice').disabled);assert.match(ui.get('#timer-audio-status').textContent,/unavailable/);
  assert.match(ui.text(),/Haptic cues are not provided/);
  const color=ui.get('#timer-color');color.checked=false;color.dispatchEvent(new window.Event('change',{bubbles:true}));
  assert.ok(ui.get('#experience-app').classList.contains('lab-colorless'));
  ui.click('[data-action="toggle"]');const quietStatus=ui.get('#lab-status').textContent;
  clock.now=1000;tick();assert.equal(ui.get('#lab-status').textContent,quietStatus,'Each second must not become a live announcement');
  assert.equal(ui.get('#timer-clock').getAttribute('role'),'timer');assert.equal(ui.get('#timer-clock').getAttribute('aria-live'),'off');
  clock.now=5000;tick();assert.equal(ui.get('#timer-phase').textContent,'Work');assert.match(ui.get('#lab-status').textContent,/Work/);
  ui.get('[data-action="toggle"]').focus();clock.now=40000;tick();
  assert.equal(ui.get('#timer-state').textContent,'Complete');assert.ok(ui.get('[data-action="toggle"]').disabled);
  assert.ok(ui.document.activeElement===ui.get('[data-action="restart"]'));
 });
});

test('Timer speech failures disable only the optional cue and preserve the running clock and pause action',async()=>{
 const clock={now:0};let fail=true,lastRequest;
 const speech={cancel(){},speak(utterance){if(fail)throw Error('Speech unavailable');lastRequest=utterance;}};
 await withTimerStudy(clock,(ui,tick)=>{
  const voice=ui.get('#timer-voice');voice.checked=true;voice.dispatchEvent(new window.Event('change',{bubbles:true}));
  ui.click('[data-action="toggle"]');assert.match(ui.get('#timer-audio-status').textContent,/failed or is unavailable/);assert.equal(voice.checked,false);
  assert.equal(ui.get('#timer-state').textContent,'Running');
  fail=false;voice.checked=true;voice.dispatchEvent(new window.Event('change',{bubbles:true}));
  assert.equal(lastRequest.text,'Prepare');lastRequest.onerror();assert.equal(voice.checked,false);
  clock.now=6000;tick();assert.equal(ui.get('#timer-phase').textContent,'Work');assert.equal(ui.get('#timer-clock').textContent,'00:09');
  ui.click('[data-action="toggle"]');assert.equal(ui.get('#timer-state').textContent,'Paused');assert.equal(ui.get('#timer-clock').textContent,'00:09');
 },{speech});
});

test('Timer ignores stale speech callbacks after pausing or opening restart review',async()=>{
 const clock={now:0},requests=[];
 const speech={cancel(){},speak(utterance){requests.push(utterance);}};
 await withTimerStudy(clock,(ui)=>{
  const voice=ui.get('#timer-voice');voice.checked=true;voice.dispatchEvent(new window.Event('change',{bubbles:true}));
  ui.click('[data-action="toggle"]');assert.equal(requests.length,1);
  clock.now=1000;ui.click('[data-action="toggle"]');const paused=ui.get('#timer-audio-status').textContent;
  requests[0].onerror();assert.equal(ui.get('#timer-audio-status').textContent,paused);assert.equal(voice.checked,true);
  ui.click('[data-action="toggle"]');assert.equal(requests.length,2);
  ui.click('[data-action="restart"]');assert.equal(ui.get('#timer-state').textContent,'Paused');const reviewing=ui.get('#timer-audio-status').textContent;
  requests[1].onend();requests[1].onerror();assert.equal(ui.get('#timer-audio-status').textContent,reviewing);assert.equal(voice.checked,true);
  ui.get('#restart-dialog').close();ui.get('#restart-dialog').dispatchEvent(new window.Event('close'));
  assert.ok(ui.document.activeElement===ui.get('[data-action="restart"]'));assert.equal(ui.get('#timer-state').textContent,'Paused');
 },{speech});
});

test('Timer restart review retains precise paused time and resets only after explicit confirmation',async()=>{
 const clock={now:0};await withTimerStudy(clock,(ui,tick)=>{
  ui.click('[data-action="toggle"]');clock.now=6100;ui.click('[data-action="restart"]');
  assert.match(ui.get('#restart-snapshot').textContent,/Work, 00:09 remaining/);assert.ok(ui.document.activeElement===ui.get('#cancel-restart'));
  clock.now=100000;ui.click('#cancel-restart');assert.equal(ui.get('#timer-phase').textContent,'Work');assert.equal(ui.get('#timer-state').textContent,'Paused');
  ui.click('[data-action="toggle"]');clock.now=108899;tick();assert.equal(ui.get('#timer-phase').textContent,'Work');
  clock.now=108900;tick();assert.equal(ui.get('#timer-phase').textContent,'Rest');
  ui.click('[data-action="restart"]');ui.click('#confirm-restart');assert.equal(ui.get('#timer-phase').textContent,'Prepare');assert.equal(ui.get('#timer-clock').textContent,'00:05');assert.equal(ui.get('#timer-state').textContent,'Ready');
  assert.ok(ui.document.activeElement===ui.get('[data-action="toggle"]'));
  ui.click('[data-action="toggle"]');clock.now=109134;Object.defineProperty(ui.document,'hidden',{configurable:true,value:true});ui.document.dispatchEvent(new window.Event('visibilitychange'));
  assert.equal(ui.get('#timer-state').textContent,'Paused');Object.defineProperty(ui.document,'hidden',{configurable:true,value:false});ui.document.dispatchEvent(new window.Event('visibilitychange'));
  assert.equal(ui.get('#timer-state').textContent,'Paused','Becoming visible does not resume automatically');
 });
});

test('Voicy retains transcript after provider failure and approved text after target loss',async()=>{
 const ui=await openStudy('voicy');ui.click('[data-action="start"]');ui.set('#voicy-transcript','Keep the name ACME-42 exactly.');
 ui.set('#scenario','failure');ui.click('[data-action="transform"]');assert.equal(ui.get('#voicy-transcript').value,'Keep the name ACME-42 exactly.');
 ui.set('#scenario','success');ui.click('[data-action="transform"]');assert.match(ui.get('#voicy-output').value,/ACME-42/);
 ui.set('#voicy-output','Approved text ACME-42');ui.set('#voicy-target','changed');ui.click('[data-action="insert"]');
 assert.match(ui.text(),/The target changed/);assert.match(ui.text(),/Approved text ACME-42/);assert.doesNotMatch(ui.text(),/Inserted once into the sample target\./);
 ui.click('[data-action="review"]');assert.equal(ui.get('#voicy-output').value,'Approved text ACME-42');
 ui.set('#voicy-target','original');ui.click('[data-action="insert"]');
 ui.click('[data-action="permission-allow"]');ui.click('[data-action="insert"]');assert.match(ui.text(),/Inserted once into the sample target/);
});

test('Voicy retains an unsubmitted transcript when returning to activation and continuing the draft',async()=>{
 const ui=await openStudy('voicy');ui.click('[data-action="start"]');
 ui.set('#voicy-transcript','Keep this unsubmitted اسم ACME-42 draft.','input');
 ui.click('[data-action="cancel"],[data-action="reset"]');ui.click('[data-action="start"]');
 assert.equal(ui.get('#voicy-transcript').value,'Keep this unsubmitted اسم ACME-42 draft.');
});

test('Voicy preserves an edited proposal when its unchanged transcript is revisited',async()=>{
 const ui=await openStudy('voicy');ui.click('[data-action="start"]');ui.click('[data-action="transform"]');
 ui.set('#voicy-output','My reviewed proposal ACME-42','input');ui.click('[data-action="back"]');ui.click('[data-action="transform"]');
 assert.equal(ui.get('#voicy-output').value,'My reviewed proposal ACME-42');
});

test('Voicy asks for simulated microphone access only on voice activation and retains a text path through denial',async()=>{
 const ui=await openStudy('voicy');let microphoneRequests=0;
 navigator.mediaDevices={getUserMedia:()=>{microphoneRequests++;throw Error('No real capture is authorized');}};
 assert.equal(ui.document.querySelector('#voicy-permission-title'),null);
 ui.click('[data-action="start"]');assert.ok(ui.get('#voicy-transcript'));assert.equal(ui.document.querySelector('#voicy-permission-title'),null);
 ui.click('[data-action="cancel"]');ui.click('[data-action="shortcut-start"]');
 assert.match(ui.get('#voicy-permission-title').textContent,/Before a sample voice capture/);
 assert.equal(ui.document.querySelector('[data-action="finish-capture"]'),null);
 ui.click('[data-action="permission-deny"]');assert.match(ui.text(),/typed input available/);
 ui.click('[data-action="shortcut-start"]');assert.equal(ui.document.querySelector('#voicy-permission-title'),null,'A prior denial is not repeatedly prompted');
 ui.click('[data-action="restore-mic"]');assert.equal(ui.document.querySelector('[data-action="finish-capture"]'),null,'Restoration does not start capture automatically');
 ui.click('[data-action="shortcut-start"]');ui.click('[data-action="finish-capture"]');
 assert.ok(ui.get('#voicy-transcript'));assert.equal(microphoneRequests,0);
});

test('Voicy keeps the sample menu route usable when shortcut activation conflicts',async()=>{
 const ui=await openStudy('voicy');ui.set('#voicy-setup','conflict');ui.click('[data-action="shortcut-start"]');
 assert.ok(ui.get('[data-action="menu-start"]'));assert.equal(ui.document.querySelector('#voicy-permission-title'),null);
 ui.click('[data-action="menu-record"]');ui.click('[data-action="permission-allow"]');ui.click('[data-action="finish-capture"]');
 ui.set('#voicy-transcript','Menu draft preserved اسم ACME-42','input');ui.click('[data-action="cancel"]');
 ui.click('[data-action="menu-start"]');assert.equal(ui.get('#voicy-transcript').value,'Menu draft preserved اسم ACME-42');
});

test('Voicy preserves approved text through denied app-control access and rechecks the target after restoration',async()=>{
 const ui=await openStudy('voicy');ui.click('[data-action="start"]');ui.click('[data-action="transform"]');
 ui.set('#voicy-output','Approved ACME-42','input');ui.click('[data-action="insert"]');
 assert.match(ui.get('#voicy-permission-title').textContent,/Before a sample insertion/);
 ui.click('[data-action="permission-deny"]');assert.equal(ui.get('#voicy-approved').value,'Approved ACME-42');
 navigator.clipboard.writeText=async()=>{throw Error('Unavailable');};ui.click('[data-action="copy"]');await Promise.resolve();
 assert.match(ui.get('#lab-status').textContent,/Select the preserved text/);assert.equal(ui.document.activeElement,ui.get('#voicy-approved'));
 ui.click('[data-action="restore-access"]');assert.equal(ui.get('#voicy-output').value,'Approved ACME-42');
 assert.doesNotMatch(ui.text(),/Inserted once/,'Restoring access does not execute a pending insertion');
 ui.set('#voicy-target','changed');ui.click('[data-action="insert"]');assert.match(ui.text(),/The target changed/);
 ui.click('[data-action="review"]');ui.set('#voicy-target','original');ui.click('[data-action="insert"]');
 assert.match(ui.text(),/Inserted once into the sample target/);
});

test('Voicy never renews an uncertain insertion attempt by reviewing or regenerating a proposal',async()=>{
 const ui=await openStudy('voicy');ui.click('[data-action="start"]');ui.click('[data-action="transform"]');
 ui.set('#voicy-target','uncertain');ui.click('[data-action="insert"]');ui.click('[data-action="permission-allow"]');
 assert.ok(ui.get('#voicy-output'));assert.equal(ui.document.querySelector('#voicy-approved'),null,'Permission grant returns to review');
 ui.click('[data-action="insert"]');assert.match(ui.text(),/Insertion could not be confirmed/);
 ui.click('[data-action="review"]');ui.set('#voicy-output','Edited after uncertain attempt','input');ui.click('[data-action="back"]');ui.click('[data-action="transform"]');
 assert.equal(ui.get('#voicy-output').value,'Edited after uncertain attempt');assert.ok(ui.get('[data-action="insert"]').disabled);
 const blocked=ui.get('[data-action="insert"]');blocked.disabled=false;ui.click('[data-action="insert"]');
 assert.match(ui.get('#voicy-error').textContent,/already used its one insertion attempt/);
 ui.click('[data-action="reset"]');assert.match(ui.text(),/previous sample had an uncertain insertion outcome/);assert.equal(ui.document.querySelector('#voicy-approved'),null);
});

test('Voicy retries a provider failure in the flow and requires a choice before replacing an edited proposal',async()=>{
 const ui=await openStudy('voicy');ui.click('[data-action="start"]');ui.set('#voicy-transcript','Original ACME-42','input');ui.click('[data-action="transform"]');
 ui.set('#voicy-output','Human-reviewed original proposal','input');ui.click('[data-action="back"]');ui.set('#voicy-transcript','Revised ACME-43','input');
 ui.set('#scenario','failure');ui.click('[data-action="transform"]');
 assert.equal(ui.get('#voicy-transcript').value,'Revised ACME-43');ui.click('[data-action="retry"]');
 assert.equal(ui.get('#scenario').value,'success');assert.ok(ui.get('#voicy-replace-title'));
 ui.click('[data-action="keep-proposal"]');assert.equal(ui.get('#voicy-output').value,'Human-reviewed original proposal');
 assert.match(ui.get('details .lab-transcript').textContent,/Original ACME-42/);
 ui.click('[data-action="back"]');assert.equal(ui.get('#voicy-transcript').value,'Revised ACME-43');ui.click('[data-action="transform"]');ui.click('[data-action="replace-proposal"]');
 assert.match(ui.get('#voicy-output').value,/Revised ACME-43/);assert.doesNotMatch(ui.get('#voicy-output').value,/Human-reviewed original proposal/);
});

test('Veyra replaces a weather-sensitive stop without losing the other stops, with undo',async()=>{
 const ui=await openStudy('veyra',{city:true});ui.click('[data-add="trevi"]');ui.click('[data-add="garden"]');
 ui.set('#day-end','10:00');assert.match(ui.text(),/after your preferred end time/);
 ui.set('#visit-time-trevi','15');ui.set('#visit-time-garden','15');
 assert.match(ui.text(),/ends 25 minutes after/,'Edited visit times must update the day constraint');
 ui.set('#visit-time-garden','900');assert.match(ui.text(),/plan still uses 15 minutes/);
 assert.equal(ui.get('#visit-time-garden').value,'900');assert.match(ui.text(),/ends 25 minutes after/);
 ui.set('#visit-time-garden','30');assert.match(ui.text(),/ends 40 minutes after/);
 ui.set('#day-weather','rain');ui.click('[data-replace-garden]');
 assert.ok(ui.get('[data-remove="trevi"]'));assert.ok(ui.get('[data-remove="gallery"]'));assert.equal(ui.document.querySelector('[data-remove="garden"]'),null);
 ui.click('[data-undo-plan]');assert.ok(ui.get('[data-remove="garden"]'));assert.equal(ui.document.querySelector('[data-remove="gallery"]'),null);
 ui.click('[data-remove="garden"]');ui.click('[data-undo]');assert.ok(ui.get('[data-remove="garden"]'));
 ui.click('[data-remove="garden"]');ui.click('[data-add="garden"]');
 assert.equal(ui.document.querySelector('[data-undo]'),null,'Adding the same place again must invalidate stale removal undo');
 assert.equal(ui.document.querySelectorAll('[data-remove="garden"]').length,1);
});
test('Andalus retains a long traveler name through fare/language changes and suppresses unknown contact',async()=>{
 const ui=await openStudy('andalus');
 ui.set('#trip-passenger','بن عبد القادر — Amine El Mansouri','input');
 ui.set('#scenario','changed');assert.match(ui.text(),/89,500/);
 ui.set('#trip-language','ar');assert.equal(ui.get('.lab-trip').getAttribute('dir'),'rtl');
 assert.match(ui.get('.lab-passenger').textContent,/Amine El Mansouri/);
 ui.set('#scenario','soldout');assert.match(ui.text(),/الرحلة الأصلية غير متاحة/);
 ui.click('[data-action="trip-review"]');assert.match(ui.text(),/No booking was made/);
 ui.set('#trip-booking','unknown');assert.match(ui.get('#trip-eligibility').textContent,/Contact suppressed/);
 ui.set('#trip-booking','completed');assert.match(ui.get('#trip-eligibility').textContent,/completed booking suppresses/);
});

test('Aevis keeps edited context until preset confirmation and exposes missing evidence instead of a zero score',async()=>{
 const ui=await openStudy('aevis');
 ui.set('#audit-brand','Custom Brand','input');ui.set('#audit-preset','studio');
 assert.equal(ui.get('#audit-brand').value,'Custom Brand');assert.ok(ui.get('#audit-context button').disabled);
 ui.click('[data-action="keep-context"]');assert.equal(ui.get('#audit-brand').value,'Custom Brand');
 ui.set('#audit-preset','studio');ui.click('[data-action="apply-preset"]');
 assert.equal(ui.get('#audit-brand').value,'Nova Studio');assert.match(ui.get('#audit-query').value,/Nova Studio/);
 ui.submit('#audit-context');assert.match(ui.text(),/3 \/ 4 returned fixture responses/);
 ui.set('#scenario','none');assert.match(ui.text(),/No data. No score/);assert.ok(ui.get('[data-action="propose"]').disabled);
 ui.set('#scenario','partial');assert.match(ui.text(),/2 missing/);
 ui.set('#scenario','conflict');assert.match(ui.text(),/Conflicting fixture responses/);
 ui.set('#scenario','stale');assert.ok(ui.get('[data-action="propose"]').disabled);
 ui.set('#scenario','complete');ui.click('[data-action="propose"]');
 ui.set('#audit-proposal','Reviewed draft ACME-42');ui.click('[data-action="approve"]');
 assert.equal(ui.get('#approved-draft').textContent,'Reviewed draft ACME-42');
 ui.click('[data-action="rollback"]');assert.equal(ui.get('#audit-proposal').value,'Explore our services and contact our team.');
 assert.match(ui.get('#lab-status').textContent,/No website was changed/);
});

test('Aevis preserves an edited proposal through observations and evidence changes, and keeps undo visible',async()=>{
 const ui=await openStudy('aevis');ui.submit('#audit-context');ui.click('[data-action="propose"]');
 ui.set('#audit-proposal','First reviewed proposal','input');ui.click('[data-action="results"]');ui.click('[data-action="propose"]');
 assert.equal(ui.get('#audit-proposal').value,'First reviewed proposal');
 ui.set('#scenario','partial');ui.click('[data-action="propose"]');
 assert.equal(ui.get('#audit-proposal').value,'First reviewed proposal');
 ui.click('[data-action="approve"]');
 ui.set('#audit-proposal','Second reviewed proposal','input');ui.click('[data-action="approve"]');
 assert.equal(ui.get('#approved-draft').textContent,'Second reviewed proposal');
 ui.click('[data-action="rollback"]');
 assert.equal(ui.get('#approved-draft').textContent,'First reviewed proposal');
 assert.equal(ui.get('#audit-proposal').value,'First reviewed proposal');
 assert.match(ui.text(),/Local draft revision 3/);
 assert.equal(ui.document.querySelector('[data-action="rollback"]'),null);
 ui.set('#audit-proposal','   ','input');ui.click('[data-action="approve"]');
 assert.equal(ui.get('#approved-draft').textContent,'First reviewed proposal');
 assert.match(ui.get('#lab-status').textContent,/Enter text before approving/);
});

test('Aevis separates drafts and approval history for changed audit contexts',async()=>{
 const ui=await openStudy('aevis');ui.submit('#audit-context');ui.click('[data-action="propose"]');
 ui.set('#audit-proposal','Travel draft retained','input');ui.click('[data-action="approve"]');
 ui.click('[data-action="results"]');ui.click('[data-action="context"]');ui.set('#audit-preset','studio');
 ui.submit('#audit-context');ui.click('[data-action="propose"]');
 assert.match(ui.get('#audit-draft-context').textContent,/Nova Studio.*Acme Travel/);
 assert.ok(ui.get('[data-action="approve"]').disabled);
 assert.equal(ui.get('#audit-proposal').value,'Travel draft retained');
 ui.click('[data-action="keep-saved-draft"]');ui.click('[data-action="propose"]');ui.click('[data-action="open-context-draft"]');
 assert.match(ui.get('#audit-proposal').value,/Nova Studio/);
 assert.equal(ui.document.querySelector('#approved-draft'),null);
 ui.set('#audit-proposal','Studio draft retained','input');ui.click('[data-action="approve"]');
 ui.click('[data-action="results"]');ui.click('[data-action="context"]');ui.set('#audit-preset','travel');
 ui.submit('#audit-context');ui.click('[data-action="propose"]');ui.click('[data-action="open-context-draft"]');
 assert.equal(ui.get('#audit-proposal').value,'Travel draft retained');
 assert.equal(ui.get('#approved-draft').textContent,'Travel draft retained');
 ui.click('[data-action="rollback"]');
 assert.equal(ui.get('#approved-draft').textContent,'Explore our services and contact our team.');
});

test('Aevis requires an explicit valid submission after editing context, including evidence-condition changes',async()=>{
 const ui=await openStudy('aevis');ui.submit('#audit-context');ui.click('[data-action="context"]');
 ui.set('#audit-brand','','input');ui.set('#scenario','partial');
 assert.equal(ui.get('#audit-brand').value,'');
 assert.ok(ui.document.querySelector('#audit-context'));
 ui.submit('#audit-context');assert.match(ui.get('#audit-error').textContent,/Complete the brand/);
 ui.set('#audit-brand','Confirmed Custom Brand','input');ui.submit('#audit-context');
 assert.match(ui.text(),/Confirmed Custom Brand/);assert.match(ui.text(),/2 missing/);
});

test('Nexus validates restore atomically, retains links when deleting a destination, and tolerates missing metadata',async()=>{
 const ui=await openStudy('nexus');
 ui.click('[data-action="decline-permission"]');assert.match(ui.text(),/manual saving remains available/);
 ui.set('#site-title','');ui.set('#site-url','https://example.com/reference');ui.submit('#nexus-form');
 assert.match(ui.text(),/example.com/);
 ui.set('#category-source','Create');ui.set('#category-target','Work');ui.click('[data-action="delete-category"]');
 assert.equal(ui.document.querySelector('[data-category="Create"]'),null);assert.match(ui.text(),/figma.com\/community · Work/);
 ui.click('[data-action="undo-category"]');assert.ok(ui.get('[data-category="Create"]'));
 ui.set('#workspace-import',JSON.stringify({version:1,sites:[{title:'Bad URL',url:'javascript:alert(1)',category:'Work'}]}),'input');
 ui.click('[data-action="validate-import"]');assert.match(ui.text(),/Current workspace is unchanged/);assert.match(ui.text(),/example.com\/reference/);
 ui.set('#workspace-import',JSON.stringify({version:1,sites:[{title:'Restored reference',url:'https://example.org/notes',category:'Work'}]}),'input');
 ui.click('[data-action="validate-import"]');assert.match(ui.text(),/example.com\/reference/);
 ui.click('[data-action="confirm-import"]');assert.match(ui.text(),/Restored reference/);assert.doesNotMatch(ui.text(),/example.com\/reference/);
 ui.click('[data-action="empty"]');assert.match(ui.text(),/Restored reference/);
 ui.click('[data-action="confirm-empty"]');assert.match(ui.text(),/Your workspace is empty/);
});

test('PrepFlow supports a useful first plan and blocks an unresolved equipment task while preserving interruption state',async()=>{
 const ui=await openStudy('prepflow');ui.set('#prep-goal','plant');ui.click('[data-action="apply-goal"]');
 assert.equal(ui.get('#meal').value,'1');ui.click('[data-action="next"]');ui.click('[data-action="interrupt"]');
 ui.set('#servings','4');assert.ok(ui.get('[data-action="next"]').disabled);
 ui.click('[data-action="review-quantity"]');ui.click('[data-action="pause"]');assert.match(ui.text(),/Step 2 of 3/);
 ui.set('#meal','2');ui.click('[data-action="confirm-swap"]');ui.set('#equipment','none');assert.ok(ui.get('[data-action="next"]').disabled);
 ui.set('#equipment','oven');assert.ok(!ui.get('[data-action="next"]').disabled);
});

test('Promptilo reflects editorial holds and duplicate merges publicly without losing search context or saves',async()=>{
 const ui=await openStudy('promptilo');ui.click('[data-action="save"][data-id="a"]');
 ui.set('#editorial-condition','broken');ui.click('[data-action="editorial-decision"]');
 assert.match(ui.text(),/Editorial hold/);assert.ok(ui.get('[data-action="save"][data-id="c"]').disabled);
 ui.set('#editorial-condition','duplicate');ui.click('[data-action="editorial-decision"]');
 assert.match(ui.text(),/Duplicate merged/);assert.match(ui.text(),/1 sample resources saved/);
 ui.set('#resource-search','forms','input');ui.click('[data-action="canonical"][data-id="a"]');ui.click('#close-resource');
 assert.equal(ui.get('#resource-search').value,'forms');
});

test('Promptilo carries a committed editorial hold into public details instead of showing an unrelated approval state',async()=>{
 const ui=await openStudy('promptilo');
 ui.set('#editorial-condition','broken');ui.click('[data-action="editorial-decision"]');
 ui.click('[data-action="detail"][data-id="c"]');
 assert.match(ui.get('#resource-detail').textContent,/Editorial hold/);
 assert.match(ui.get('#resource-detail').textContent,/example\.invalid\/form-template/);
 assert.equal(ui.get('#resource-detail').querySelectorAll('a[href^="https:"]').length,0,'A fictional broken candidate must not acquire a verified source link');
});

test('Promptilo keeps its applied public decision when the editor changes an uncommitted condition',async()=>{
 const ui=await openStudy('promptilo');
 ui.set('#editorial-condition','duplicate');ui.click('[data-action="editorial-decision"]');
 ui.set('#editorial-condition','broken');
 assert.match(ui.get('[data-action="detail"][data-id="c"]').closest('article').textContent,/Duplicate merged/);
 ui.click('[data-action="detail"][data-id="c"]');
 assert.match(ui.get('#resource-detail').textContent,/Duplicate merged/);
 assert.ok(ui.get('#resource-detail').querySelector('[data-resource-canonical="a"]'));
});

test('Promptilo keeps the canonical source, saves and decision history through explicit editorial revisions',async()=>{
 const ui=await openStudy('promptilo');
 ui.click('[data-action="save"][data-id="a"]');
 const source=()=>{ui.click('[data-action="detail"][data-id="a"]');const href=ui.get('#resource-detail a').getAttribute('href');ui.click('#close-resource');return href;};
 const original=source();
 ui.set('#editorial-condition','duplicate');ui.click('[data-action="editorial-decision"]');
 assert.equal(ui.get('#editorial-history').children.length,1);
 ui.click('[data-action="editorial-decision"]');assert.equal(ui.get('#editorial-history').children.length,1,'Applying the same decision twice is idempotent');
 ui.set('#editorial-condition','broken');ui.click('[data-action="editorial-decision"]');
 assert.equal(ui.get('#editorial-history').children.length,2);
 assert.match(ui.get('[data-resource="c"] [data-resource-state]').textContent,/Editorial hold · source unavailable/);
 assert.equal(source(),original);assert.equal(ui.get('[data-action="save"][data-id="a"]').getAttribute('aria-pressed'),'true');
 const blocked=ui.get('[data-action="save"][data-id="c"]');blocked.disabled=false;ui.click('[data-action="save"][data-id="c"]');
 assert.match(ui.get('#resource-results-count').textContent,/1 sample resources saved/,'The handler also rejects unapproved candidates');
 assert.match(ui.get('#lab-status').textContent,/unapproved and cannot be saved/);
});

test('Promptilo preserves a filtered return path while inspecting a duplicate and its canonical source',async()=>{
 const ui=await openStudy('promptilo');ui.set('#editorial-condition','duplicate');ui.click('[data-action="editorial-decision"]');
 ui.set('#resource-search','new prompt','input');ui.click('[data-choice="Prompt"]');
 const origin=ui.get('[data-action="detail"][data-id="c"]');ui.click('[data-action="detail"][data-id="c"]');
 assert.equal(ui.document.activeElement,ui.get('#resource-title'));
 ui.click('[data-resource-canonical="a"]');
 assert.equal(ui.get('#resource-title').textContent,'Accessible form checklist');
 const link=ui.get('#resource-detail a');assert.equal(link.getAttribute('target'),'_blank');assert.match(link.getAttribute('rel'),/noopener/);assert.match(link.textContent,/new tab/);
 ui.click('[data-resource-return="c"]');assert.match(ui.get('#resource-public-state').textContent,/Duplicate merged/);
 ui.click('#close-resource');assert.equal(ui.document.activeElement,origin);
 assert.equal(ui.get('#resource-search').value,'new prompt');assert.equal(ui.get('[data-choice="Prompt"]').getAttribute('aria-pressed'),'true');
 assert.equal(ui.document.querySelectorAll('[data-resource="a"]').length,0,'Detail inspection does not broaden the result list');
 ui.click('[data-action="detail"][data-id="c"]');ui.get('#resource-dialog').close();ui.get('#resource-dialog').dispatchEvent(new window.Event('close'));
 assert.equal(ui.document.activeElement,origin,'Native Escape/close restores the same result action');
});

test('Skinny edits only future reminders and retains logs when notifications are denied',async()=>{
 const ui=await openStudy('skinny');ui.click('[data-log="2"]');
 ui.set('#care-next-time','09:15');ui.click('[data-action="schedule"]');
 assert.match(ui.get('.lab-items').textContent,/09:15/);
 ui.click('[data-choice="yesterday"]');assert.match(ui.get('.lab-items').textContent,/07:30/);assert.doesNotMatch(ui.get('.lab-items').textContent,/09:15/);
 ui.set('#care-notifications','denied');assert.match(ui.text(),/in-app timeline and existing records still work/);
 ui.click('[data-choice="today"]');assert.equal(ui.get('[data-log="2"]').getAttribute('aria-pressed'),'true');
});

test('Voicy supports setup failure, an unsupported action and a missing insertion target without losing text',async()=>{
 const ui=await openStudy('voicy');ui.set('#voicy-setup','denied');assert.match(ui.text(),/typed input available/);
 ui.set('#voicy-setup','conflict');assert.match(ui.text(),/menu-bar route/);ui.click('[data-action="menu-start"]');
 ui.set('#voicy-transcript','Preserve اسم ACME-42 exactly.');ui.set('#voicy-action','unsupported');ui.click('[data-action="transform"]');
 assert.equal(ui.get('#voicy-transcript').value,'Preserve اسم ACME-42 exactly.');assert.match(ui.get('#lab-status').textContent,/unsupported/);
 ui.set('#voicy-action','concise');ui.click('[data-action="transform"]');ui.set('#voicy-target','none');ui.click('[data-action="insert"]');
 assert.match(ui.text(),/No insertion target is available/);assert.match(ui.text(),/ACME-42/);assert.doesNotMatch(ui.text(),/Inserted once into the sample target\./);
});

test('Veyra search and empty-result recovery preserve the day and expose non-map controls',async()=>{
 const ui=await openStudy('veyra',{city:true});ui.click('[data-add="trevi"]');
 ui.set('#place-search','gallery','input');assert.equal(ui.document.querySelectorAll('.place-card').length,1);
 ui.click('[data-add="gallery"]');assert.ok(ui.get('[data-up="gallery"]'));
 ui.set('#place-search','no matching place','input');assert.match(ui.text(),/No places match/);assert.ok(ui.get('[data-remove="trevi"]'));
 ui.click('[data-clear-search]');assert.equal(ui.document.querySelectorAll('.place-card').length,3);
});

test('Veyra place details contain keyboard focus and return to the exact list or map control',async()=>{
 const ui=await openStudy('veyra',{city:true});
 ui.click('.place-open[data-open="garden"]');
 assert.equal(ui.document.activeElement,ui.get('[data-close]'));
 for(const selector of ['.city-skip','.topbar','.prototype-context','footer','.intro','.workspace'])assert.equal(ui.get(selector).inert,true,`${selector} must be unavailable behind the dialog`);
 assert.equal(cityKey(ui,'Tab',{shiftKey:true}).defaultPrevented,true);
 assert.equal(ui.document.activeElement,ui.get('.detail [data-add="garden"]'));
 assert.equal(cityKey(ui,'Tab').defaultPrevented,true);
 assert.equal(ui.document.activeElement,ui.get('[data-close]'));
 ui.get('.case-link').dispatchEvent(new window.Event('focusin',{bubbles:true}));
 assert.equal(ui.document.activeElement,ui.get('[data-close]'));
 cityKey(ui,'Escape');
 assert.equal(ui.document.querySelector('.detail'),null);
 assert.equal(ui.document.activeElement,ui.get('.place-open[data-open="garden"]'));
 for(const selector of ['.city-skip','.topbar','.prototype-context','footer','.intro','.workspace'])assert.ok(!ui.get(selector).inert,`${selector} must be restored after close`);
 ui.click('.pin[data-open="trevi"]');ui.click('.detail [data-add="trevi"]');
 assert.equal(ui.document.activeElement,ui.get('.pin[data-open="trevi"]'));
 assert.equal(ui.document.querySelectorAll('[data-remove="trevi"]').length,1);
 ui.click('.place-open[data-open="garden"]');ui.click('.detail [data-add="garden"]');
 assert.equal(ui.document.activeElement,ui.get('.place-open[data-open="garden"]'));
 assert.equal(ui.document.querySelectorAll('[data-remove="garden"]').length,1);
});

test('Veyra list discovery, day review, ordering and removal undo keep a usable focused continuation',async()=>{
 const ui=await openStudy('veyra',{city:true});
 ui.set('#place-search','Trevi','input');ui.click('.place-open[data-open="trevi"]');ui.click('.detail [data-add="trevi"]');
 ui.set('#place-search','garden','input');ui.click('.place-open[data-open="garden"]');ui.click('.detail [data-add="garden"]');
 const stops=()=>[...ui.document.querySelectorAll('.stop')].map(node=>node.id);
 assert.deepEqual(stops(),['stop-trevi','stop-garden']);
 ui.click('[data-review]');assert.equal(ui.document.activeElement,ui.get('#day-title'));
 assert.equal(ui.document.querySelectorAll('.map polyline').length,2);
 assert.equal(ui.document.querySelectorAll('.map .pin').length,2,'Route review shows both selected places even when discovery search is narrower');
 assert.equal(ui.get('#place-search').value,'garden','Review retains the discovery query');
 ui.click('[data-up="garden"]');assert.deepEqual(stops(),['stop-garden','stop-trevi']);
 assert.equal(ui.document.activeElement,ui.get('#stop-garden'));
 assert.match(ui.get('#stop-order-garden').textContent,/1 \/ 09:30/);
 assert.match(ui.get('#stop-order-trevi').textContent,/2 \/ 11:10/);
 ui.click('[data-remove="garden"]');assert.equal(ui.document.activeElement,ui.get('[data-undo]'));
 ui.click('[data-undo]');assert.deepEqual(stops(),['stop-garden','stop-trevi']);
 assert.equal(ui.document.activeElement,ui.get('#stop-garden'));
 assert.equal(ui.document.querySelector('[data-undo]'),null);
 ui.click('[data-review]');ui.click('[data-edit]');
 assert.equal(ui.document.activeElement,ui.get('#place-search'));assert.deepEqual(stops(),['stop-garden','stop-trevi']);
 ui.set('#place-search','nothing like this','input');assert.match(ui.text(),/No places match/);
 ui.click('[data-clear-search]');assert.equal(ui.document.activeElement,ui.get('#place-search'));
 assert.deepEqual(stops(),['stop-garden','stop-trevi']);
});

test('Flex unavailable calls offer a bounded notification request without confirming a booking',async()=>{
 const ui=await openStudy('flex-academy');ui.click('[data-path="scale"]');
 ui.set('#flex-name','Sample');ui.set('#flex-email','sample@example.com');ui.set('#flex-goal','systems');ui.submit('#flex-form');
 ui.set('#scenario','unavailable');ui.click('[data-action="notify"]');assert.match(ui.text(),/No appointment was booked/);
 assert.ok(ui.get('[data-action="confirm"]').disabled);
});

test('Flex route changes discard an old appointment while preserving editable details',async()=>{
 const ui=await openStudy('flex-academy');ui.click('[data-path="scale"]');
 ui.set('#flex-name','Sample');ui.set('#flex-email','sample@example.com');ui.set('#flex-goal','systems');ui.submit('#flex-form');
 ui.click('[data-slot]');assert.equal(ui.get('[data-action="confirm"]').disabled,false);
 ui.click('[data-action="edit"]');ui.click('[data-action="route"]');ui.click('[data-path="launch"]');
 assert.equal(ui.get('#flex-email').value,'sample@example.com');
 ui.click('[data-action="route"]');ui.click('[data-path="scale"]');ui.submit('#flex-form');
 assert.ok(ui.get('[data-action="confirm"]').disabled,'An appointment from the previous route must not remain selected');
 assert.ok([...ui.document.querySelectorAll('[data-slot]')].every(button=>button.getAttribute('aria-pressed')==='false'));
});

test('Flex retries a failed confirmation from either journey without a second request or conversion',async()=>{
 for(const path of ['launch','scale']){
  const ui=await openStudy('flex-academy');ui.set('#scenario','failure');ui.click(`[data-path="${path}"]`);
  ui.set('#flex-name','Sample');ui.set('#flex-email','sample@example.com');ui.set('#flex-goal',path==='scale'?'systems':'start');ui.submit('#flex-form');
  if(path==='scale')ui.click('[data-slot]');
  ui.click('[data-action="confirm"]');assert.match(ui.text(),/could not confirm/);
  const failed=flexEvents(ui).at(-1);assert.equal(failed.event,'sample_confirmation_failed');
  assert.ok(ui.get('[data-action="retry"]'),'A retry must be available in the task itself');
  ui.click('[data-action="retry"]');
  assert.match(ui.text(),path==='scale'?/Sample call request confirmed/:/Sample registration complete/);
  assert.equal(ui.get('#scenario').value,'success');
  const eventName=path==='scale'?'sample_call_request_confirmed':'sample_registration_confirmed';
  const confirmed=flexEvents(ui).filter(event=>event.event===eventName);
  assert.equal(confirmed.length,1);assert.equal(confirmed[0].requestId,failed.requestId);
  ui.click('[data-action="edit"]');ui.submit('#flex-form');ui.click('[data-action="confirm"]');
  assert.equal(flexEvents(ui).filter(event=>event.event===eventName).length,1);
 }
});

test('Nexus retains an unfinished capture and its open form through discovery, search and filtering',async()=>{
 const ui=await openStudy('nexus');
 ui.get('#nexus-form').parentElement.setAttribute('open','');
 ui.set('#site-title','An unfinished reference');ui.set('#site-url','https://example.org/draft');ui.set('#site-category','Build');
 ui.click('[data-action="discovery"]');
 assert.equal(ui.get('#site-title').value,'An unfinished reference');
 assert.equal(ui.get('#site-url').value,'https://example.org/draft');
 assert.equal(ui.get('#site-category').value,'Build');
 assert.ok(ui.get('#nexus-form').parentElement.hasAttribute('open'));
 ui.set('#nexus-search','documentation','input');ui.click('[data-category="Create"]');
 assert.equal(ui.get('#site-url').value,'https://example.org/draft');
 ui.submit('#nexus-form');
 assert.equal(ui.get('#site-url').value,'');
 assert.equal(ui.get('a[data-site-open][href="https://example.org/draft"]').textContent.includes('An unfinished reference'),true);
});

test('Nexus keeps an edited title and URL through destination changes and their undo',async()=>{
 const ui=await openStudy('nexus');ui.click('[data-action="move"][data-id="1"]');
 ui.set('#site-title','Edited design reference');ui.set('#site-url','https://example.org/revised');
 ui.set('#category-source','Create');ui.set('#category-name','References');ui.click('[data-action="rename-category"]');
 assert.equal(ui.get('#site-title').value,'Edited design reference');
 assert.equal(ui.get('#site-url').value,'https://example.org/revised');
 assert.equal(ui.get('#site-category').value,'References');
 ui.click('[data-action="undo-category"]');assert.equal(ui.get('#site-category').value,'Create');
 ui.set('#category-source','Create');ui.set('#category-target','Work');ui.click('[data-action="delete-category"]');
 assert.equal(ui.get('#site-url').value,'https://example.org/revised');assert.equal(ui.get('#site-category').value,'Work');
 ui.click('[data-action="undo-category"]');ui.submit('#nexus-form');
 assert.ok(ui.get('a[data-site-open][href="https://example.org/revised"]'));
 assert.equal(ui.document.querySelectorAll('#nexus-site-1').length,1);
});

test('Nexus duplicate recovery reveals and focuses the existing site while keeping the capture draft',async()=>{
 const ui=await openStudy('nexus');ui.set('#nexus-search','planning','input');
 ui.get('#nexus-form').parentElement.setAttribute('open','');
 ui.set('#site-title','My unfinished reference');ui.set('#site-url','https://www.figma.com/community#saved');ui.set('#site-category','Learn');
 ui.submit('#nexus-form');assert.match(ui.get('#nexus-error').textContent,/already saved in Create/);
 ui.click('[data-action="show-existing"]');
 assert.equal(ui.document.activeElement,ui.get('#nexus-site-1'));
 assert.equal(ui.get('#nexus-search').value,'');
 assert.equal(ui.get('#site-title').value,'My unfinished reference');
 assert.equal(ui.get('#site-url').value,'https://www.figma.com/community#saved');
 assert.equal(ui.get('#site-category').value,'Learn');
 const link=ui.get('#nexus-site-1 a[data-site-open]');
 assert.equal(link.getAttribute('href'),'https://www.figma.com/community');
 assert.equal(link.getAttribute('target'),'_blank');
 assert.match(link.getAttribute('rel'),/noopener/);assert.match(link.getAttribute('rel'),/noreferrer/);
 assert.equal(ui.document.querySelectorAll('a[data-site-open]').length,3);
});

test('Nexus exports all saved destinations and restores the actual exported file only after a fresh review',async()=>{
 const ui=await openStudy('nexus');ui.set('#site-title','A saved export reference');ui.set('#site-url','https://example.org/exported');ui.set('#site-category','Build');ui.submit('#nexus-form');
 let exported;const create=URL.createObjectURL;
 URL.createObjectURL=blob=>{exported=blob;return create(blob)};
 try{ui.click('[data-action="export"]')}finally{URL.createObjectURL=create}
 const text=await exported.text(),saved=JSON.parse(text);
 assert.equal(saved.version,1);assert.equal(saved.sites.length,4);
 assert.deepEqual(saved.categories,['Work','Build','Create','Learn']);
 assert.ok(saved.sites.some(site=>site.url==='https://example.org/exported'&&site.category==='Build'));
 ui.click('[data-action="empty"]');ui.click('[data-action="confirm-empty"]');
 ui.set('#workspace-import',text,'input');ui.click('[data-action="validate-import"]');
 assert.equal(ui.document.querySelectorAll('a[data-site-open]').length,0,'Validation cannot replace the workspace');
 assert.match(ui.get('#workspace-restore-preview').textContent,/0 current saved sites will be replaced by 4 validated sites/);
 assert.match(ui.get('#workspace-restore-preview').textContent,/example.org\/exported/);
 ui.set('#workspace-import','changed after review','input');
 assert.equal(ui.document.querySelector('[data-action="confirm-import"]'),null);
 assert.equal(ui.document.querySelector('#workspace-restore-preview'),null);
 ui.set('#workspace-import',text,'input');ui.click('[data-action="validate-import"]');ui.click('[data-action="confirm-import"]');
 assert.equal(ui.document.querySelectorAll('a[data-site-open]').length,4);
 ui.set('#nexus-search','export reference','input');
 assert.ok(ui.get('a[data-site-open][href="https://example.org/exported"]'));
 assert.match(ui.text(),/Build/);
});

test('PrepFlow reviews a meal replacement before discarding a started preparation session',async()=>{
 const ui=await openStudy('prepflow');ui.click('[data-action="next"]');
 ui.set('#meal','2');
 assert.match(ui.text(),/Review this meal change/);
 assert.equal(ui.get('#meal').value,'0','The old meal stays authoritative until the change is confirmed');
 ui.click('[data-action="cancel-swap"]');assert.match(ui.text(),/Step 2 of 3/);
 assert.equal(ui.get('#meal').value,'0');
 ui.set('#meal','2');ui.click('[data-action="confirm-swap"]');
 assert.equal(ui.get('#meal').value,'2');assert.match(ui.text(),/Step 1 of 3/);
});

test('PrepFlow starts with a useful week and applies optional preferences only to unstarted meals',async()=>{
 const ui=await openStudy('prepflow');
 assert.equal(ui.document.querySelectorAll('[data-action="day"]').length,3);
 assert.equal(ui.get('#servings').value,'2');assert.ok(ui.get('#meal'));assert.ok(ui.get('tbody tr'));
 ui.click('[data-action="skip-setup"]');ui.click('[data-action="next"]');
 ui.click('[data-action="day"][data-day="wed"]');ui.set('#prep-goal','plant');ui.click('[data-action="apply-goal"]');
 assert.match(ui.get('[data-day="mon"]').textContent,/Chicken rice bowl/);
 assert.match(ui.get('[data-day="fri"]').textContent,/Chickpea rice bowl/);
 assert.doesNotMatch(ui.get('tbody').textContent,/salmon/);
 ui.click('[data-action="day"][data-day="mon"]');assert.equal(ui.get('#meal').value,'0');
 assert.match(ui.get('#prep-stage').textContent,/Step 2 of 3/);
});

test('PrepFlow updates its timer in place and preserves paused time through servings and day changes',async()=>{
 const clock={now:0},ui=await openStudy('prepflow',{clock});
 const set=globalThis.setInterval,clear=globalThis.clearInterval;let tick;
 globalThis.setInterval=callback=>{tick=callback;return 1};globalThis.clearInterval=()=>{};
 try{
  ui.click('[data-action="timer"]');const field=ui.get('#servings');field.focus();clock.now=65000;tick();
  assert.equal(ui.get('#prep-timer').textContent,'08:55');assert.equal(ui.document.activeElement,field);
  assert.equal(ui.get('#servings'),field,'A tick must not replace the field or steal focus');
  window.dispatchEvent(new window.Event('pagehide'));clock.now=100000;
  const restored=new window.Event('pageshow');Object.defineProperty(restored,'persisted',{value:true});window.dispatchEvent(restored);
  assert.match(ui.get('#prep-stage').textContent,/Paused/);assert.equal(ui.get('#prep-timer').textContent,'08:55');
  ui.click('[data-action="interrupt"]');ui.set('#servings','4');assert.equal(ui.get('#prep-timer').textContent,'12:55');
  clock.now=500000;ui.click('[data-action="pause"]');clock.now=510000;ui.click('[data-action="pause"]');
  assert.equal(ui.get('#prep-timer').textContent,'12:45');
  ui.click('[data-action="pause"]');ui.click('[data-action="next"]');ui.set('#servings','3');
  assert.ok(ui.get('[data-action="next"]').disabled);assert.match(ui.get('#prep-time-summary').textContent,/Quantity-adjustment time is not estimated/);
  assert.match(ui.get('#prep-stage').textContent,/Step 2 of 3/);
  ui.click('[data-action="review-quantity"]');ui.click('[data-action="pause"]');assert.ok(!ui.get('[data-action="next"]').disabled);
  ui.click('[data-action="day"][data-day="wed"]');assert.equal(ui.get('#servings').value,'2');
  ui.click('[data-action="day"][data-day="mon"]');assert.equal(ui.get('#servings').value,'3');assert.match(ui.get('#prep-stage').textContent,/Step 2 of 3/);
 }finally{window.dispatchEvent(new window.Event('pagehide'));globalThis.setInterval=set;globalThis.clearInterval=clear;}
});

test('PrepFlow pauses a running equipment conflict and preserves another day through swap review',async()=>{
 const clock={now:0},ui=await openStudy('prepflow',{clock});
 try{
  ui.set('#meal','2');ui.click('[data-action="timer"]');clock.now=30000;ui.set('#equipment','none');
  assert.equal(ui.get('#prep-timer').textContent,'09:30');assert.ok(ui.get('[data-action="pause"]').disabled);
  clock.now=300000;ui.set('#equipment','oven');assert.match(ui.get('#prep-stage').textContent,/Paused/);
  ui.click('[data-action="pause"]');clock.now=310000;ui.click('[data-action="pause"]');
  assert.equal(ui.get('#prep-timer').textContent,'09:20');
  ui.click('[data-action="day"][data-day="wed"]');ui.click('[data-action="next"]');
  ui.click('[data-action="day"][data-day="mon"]');ui.set('#meal','1');ui.click('[data-action="cancel-swap"]');
  assert.equal(ui.get('#meal').value,'2');assert.equal(ui.get('#prep-timer').textContent,'09:20');
  ui.set('#meal','1');ui.click('[data-action="confirm-swap"]');assert.equal(ui.get('#prep-timer').textContent,'08:00');
  ui.click('[data-action="day"][data-day="wed"]');assert.match(ui.get('#prep-stage').textContent,/Step 2 of 3/);
 }finally{window.dispatchEvent(new window.Event('pagehide'));}
});
