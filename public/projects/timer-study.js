import {advanceTimer} from './study-models.js';

const phases=[{name:'Prepare',duration:5},{name:'Work',duration:10},{name:'Rest',duration:5},{name:'Work',duration:10},{name:'Complete',duration:0}];
const finished=phases.length-1;

export function mountTimerStudy({app,btn,announce,wireClick}){
 const doc=app.ownerDocument,view=doc.defaultView,clock=performance;
 const engine=view.speechSynthesis;
 const speechAvailable=Boolean(engine&&typeof engine.speak==='function'&&typeof engine.cancel==='function'&&typeof view.SpeechSynthesisUtterance==='function');
 const state={phase:0,remainingMs:5000,remaining:5,running:false,started:false,end:null,voice:false,color:true,audio:speechAvailable?'off':'unavailable',note:'Ready. Choose Start when you are settled.'};
 let interval=null,cueGeneration=0,restartOpen=false;
 const dialog=doc.querySelector('#restart-dialog');
 const remainingText=()=>`00:${String(state.remaining).padStart(2,'0')}`;
 const position=()=>state.phase===finished?'Four timed phases complete':`Phase ${state.phase+1} of 4`;
 const audioMessages={off:'Optional speech is off. Phase text and controls remain available.',ready:'Browser speech is enabled. Audibility has not been verified.',requested:'A spoken phase name was requested. Phase text remains available.',finished:'The speech request finished. Audibility has not been verified.',paused:'Speech requests paused. Phase text and controls remain available.',failed:'Browser speech output failed or is unavailable. Phase text and controls remain available.',unavailable:'Browser speech is unavailable. Phase text and controls remain available.'};
 const setText=(selector,value)=>{const node=app.querySelector(selector);if(node.textContent!==value)node.textContent=value;};
 function updateAudio(){app.querySelector('#timer-voice').checked=state.voice;setText('#timer-audio-status',audioMessages[state.audio]);}
 function stopSpeech(){
  cueGeneration++;
  try{engine?.cancel();}catch{/* A cue failure cannot interrupt the timer. */}
  if(state.audio!=='failed')state.audio=!speechAvailable?'unavailable':state.voice?'paused':'off';
  updateAudio();
 }
 function cue(){
  if(!state.voice||!speechAvailable)return;
  const token=++cueGeneration,phase=state.phase;
  const current=()=>token===cueGeneration&&state.phase===phase;
  try{
   engine.cancel();
   const utterance=new view.SpeechSynthesisUtterance(phases[phase].name);
   utterance.onend=()=>{if(current()){state.audio='finished';updateAudio();}};
   utterance.onerror=()=>{if(current()){cueGeneration++;state.voice=false;state.audio='failed';try{engine.cancel();}catch{}updateAudio();}};
   state.audio='requested';updateAudio();engine.speak(utterance);
  }catch{cueGeneration++;state.voice=false;state.audio='failed';updateAudio();}
 }
 function stopClock(){if(interval!==null)clearInterval(interval);interval=null;state.running=false;state.end=null;}
 function settle(){
  if(!state.running)return false;
  const before=state.phase,now=clock.now(),projection=advanceTimer(phases,state.phase,state.end-now);
  state.phase=projection.phase;state.remaining=projection.remainingSeconds;state.remainingMs=projection.remainingMs;state.end=now+projection.remainingMs;
  if(projection.complete){stopClock();state.note='Sample workout complete.';}
  return before!==state.phase;
 }
 function update({focusOnComplete=true}={}){
  const active=doc.activeElement,toggle=app.querySelector('[data-action="toggle"]'),interrupt=app.querySelector('[data-action="interrupt"]');
  app.querySelector('.lab-timer').dataset.phase=phases[state.phase].name.toLowerCase();
  setText('#timer-phase',phases[state.phase].name);setText('#timer-clock',remainingText());
  const label=`${phases[state.phase].name}: ${state.remaining} ${state.remaining===1?'second':'seconds'} remaining`;
  if(app.querySelector('#timer-clock').getAttribute('aria-label')!==label)app.querySelector('#timer-clock').setAttribute('aria-label',label);
  setText('#timer-position',position());setText('#timer-next',state.phase<finished?`Up next: ${phases[state.phase+1].name}`:'Sample session finished');
  setText('#timer-state',state.running?'Running':state.phase===finished?'Complete':state.started?'Paused':'Ready');setText('#timer-note',state.note);
  toggle.textContent=state.phase===finished?'Session complete':state.running?'Pause':state.started?'Resume':'Start';toggle.disabled=state.phase===finished;
  interrupt.disabled=!state.running;app.classList.toggle('lab-colorless',!state.color);updateAudio();
  if(focusOnComplete&&state.phase===finished&&(active===toggle||active===interrupt))app.querySelector('[data-action="restart"]').focus({preventScroll:true});
 }
 function pause(note){settle();stopClock();stopSpeech();if(state.phase!==finished)state.note=note;}
 function tick(){
  if(!app.isConnected){stopClock();stopSpeech();return;}
  const changed=settle();update();
  if(changed){announce(`${phases[state.phase].name}. ${position()}.`);cue();}
 }
 function closeRestart({confirmed=false}={}){
  if(!restartOpen)return;
  restartOpen=false;
  if(dialog.hasAttribute('open'))dialog.close();
  if(confirmed){
   stopClock();stopSpeech();Object.assign(state,{phase:0,remainingMs:5000,remaining:5,started:false,note:'Sample restarted only after confirmation. Choose Start when ready.'});
   update();app.querySelector('[data-action="toggle"]').focus({preventScroll:true});
  }else{
   if(state.phase!==finished)state.note='Restart canceled. The same phase and remaining time are kept paused. Choose Resume when ready.';
   update();app.querySelector('[data-action="restart"]').focus({preventScroll:true});
  }
  announce(state.note);
 }

 app.innerHTML=`<h2 tabindex="-1" data-step-title>Keep the next phase obvious.</h2>
  <p>A 30-second browser sample: Prepare 5 seconds, Work 10, Rest 5, Work 10. The timer keeps its labels when color or optional speech is unavailable.</p>
  <div class="lab-timer" data-phase="prepare"><span id="timer-phase">Prepare</span><strong id="timer-clock" role="timer" aria-live="off" aria-label="Prepare: 5 seconds remaining">00:05</strong><p id="timer-position">Phase 1 of 4</p><p id="timer-next">Up next: Work</p><p id="timer-state">Ready</p></div>
  <p id="timer-note"></p><div class="lab-actions">${btn('Start','toggle')}${btn('Simulate interruption','interrupt','disabled','secondary')}${btn('Restart','restart','','secondary')}</div>
  <fieldset class="timer-cues"><legend>Cue options</legend><label class="lab-checkbox"><input id="timer-color" type="checkbox" checked><span>Use phase colors · turn off to inspect the non-color experience</span></label><label class="lab-checkbox"><input id="timer-voice" type="checkbox" ${speechAvailable?'':'disabled'}><span>Enable optional browser-spoken phase names</span></label><p id="timer-audio-status" class="lab-muted" role="status" aria-live="polite"></p><p class="lab-muted">Haptic cues are not provided in this browser study. The clock does not depend on speech output. Only phase changes are announced; the countdown is not a live announcement.</p></fieldset>
  <details class="lab-extra"><summary>Timing, recovery and device limits</summary><p>The sample uses elapsed browser time. Pause, hiding the page and leaving it retain the remaining time; returning never resumes automatically. Opening Restart pauses before showing the current phase and time for review. Keep session retains that paused state.</p><p>This page-local study resets on refresh. Native background execution, lock-screen behavior, Bluetooth, headphones, haptics, screen-reader output and physical training conditions remain unverified. Optional browser speech starts only after you enable it; an available API does not prove an audible cue.</p></details>`;
 app.querySelector('#timer-color').addEventListener('change',event=>{state.color=event.target.checked;update();announce(`Phase colors ${state.color?'on':'off'}. Text phase, time and controls remain available.`);});
 app.querySelector('#timer-voice').addEventListener('change',event=>{
  state.voice=Boolean(event.target.checked&&speechAvailable);
  if(!state.voice)stopSpeech();else{state.audio='ready';updateAudio();if(state.running)cue();}
 });
 wireClick(data=>{
  if(data.action==='toggle'){
   if(state.running)pause('Paused. Remaining time is retained.');
   else if(state.phase!==finished){state.running=true;state.started=true;state.end=clock.now()+state.remainingMs;state.note='The phase name, position and remaining time stay visible.';interval=setInterval(tick,100);interval?.unref?.();cue();}
   update();announce(state.phase===finished?state.note:state.running?'Sample timer running.':'Sample timer paused. Remaining time retained.');
  }else if(data.action==='interrupt'){if(!state.running)return;pause('Interrupted. Resume continues from the retained remaining time.');update();announce(state.note);}
  else if(data.action==='restart'){
   if(state.running)pause('Paused to review a restart. Your current phase and time are retained.');else stopSpeech();
   update();doc.querySelector('#restart-snapshot').textContent=`Current sample: ${phases[state.phase].name}, ${remainingText()} remaining. ${position()}.`;
   restartOpen=true;
   try{dialog.showModal();doc.querySelector('#cancel-restart').focus();}
   catch{restartOpen=false;state.note='Restart review could not open. The current session is retained and paused.';update();announce(state.note);}
  }
 });
 doc.querySelector('#confirm-restart').addEventListener('click',()=>closeRestart({confirmed:true}));
 doc.querySelector('#cancel-restart').addEventListener('click',()=>closeRestart());dialog.addEventListener('close',()=>closeRestart());
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden&&state.running){pause('The browser study paused while hidden. Resume when ready.');update({focusOnComplete:false});announce(state.note);}});
 view.addEventListener('pagehide',()=>{if(state.running)pause('Paused before leaving the page. Remaining time is retained.');else{stopClock();stopSpeech();}update({focusOnComplete:false});});
 view.addEventListener('pageshow',event=>{if(!event.persisted)return;state.note=state.phase===finished?'Restored sample session is complete.':'Restored from the browser cache. The session remains paused; choose Resume when ready.';update({focusOnComplete:false});announce(state.note);});
 update();
}
