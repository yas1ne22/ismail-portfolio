const seed='Please turn this into a short project update: the prototype is ready, two issues are still open, and I would like feedback by Thursday.';

export function mountVoicyStudy({app,esc,btn,announce,wireClick,focusTitle}){
 const doc=app.ownerDocument;
 const state={step:0,transcript:seed,output:'',basis:null,dirty:false,target:'original',scenario:'success',language:'en',action:'concise',setup:'ready',mic:'unknown',access:'unknown',prompt:null,attempt:null,previousAttempt:null,approved:'',result:'',error:'',notice:''};
 const sameBasis=()=>state.basis?.text===state.transcript.trim()&&state.basis?.language===state.language;
 function captureFields(){
  const transcript=app.querySelector('#voicy-transcript'),output=app.querySelector('#voicy-output');
  if(transcript)state.transcript=transcript.value;
  if(output&&output.value!==state.output){state.output=output.value;state.dirty=true;}
 }
 function rationale(){
  const mic=state.prompt==='mic';
  return `<section class="lab-callout" aria-labelledby="voicy-permission-title"><h3 id="voicy-permission-title" tabindex="-1">${mic?'Before a sample voice capture':'Before a sample insertion'}</h3>
   <p>${mic?'A proposed native recording needs microphone access when you choose to capture voice. You can keep writing with text instead.':'A proposed native insertion that controls another app needs appropriate app-control access. Reviewing and editing this proposal do not require that access. Your approved text is retained.'}</p>
   <p><strong>Simulation only.</strong> These buttons model a permission decision. They request no device permission and change no system setting.</p>
   <div class="lab-actions">${btn('Simulate access allowed','permission-allow')}${btn('Simulate access denied','permission-deny','','secondary')}${btn(mic?'Use text instead':'Keep reviewing without access',mic?'start':'cancel-permission','','secondary')}</div></section>`;
 }
 function ready(){
  return `<p>Use editable sample text immediately, or inspect a proposed voice-activation path. This page records no audio, registers no global shortcut and reads no desktop content.</p>
   <div class="lab-actions">${btn('Start sample transcript','start')}${btn('Try sample shortcut activation','shortcut-start','','secondary')}${btn('Use sample menu-bar alternative','menu-start','','secondary')}</div>
   ${state.setup==='conflict'?`<div class="lab-callout"><strong>The sample shortcut conflicts with another action.</strong><p>A menu-bar route stays available. It does not replace the conflicting shortcut or request broad keyboard access.</p>${btn('Simulate voice activation from the menu','menu-record','','secondary')}</div>`:''}
   ${state.mic==='denied'?`<div class="lab-callout"><strong>Sample microphone access denied.</strong><p>Denial keeps typed input available. The sample will not repeatedly ask for microphone access. In a native build, access can be reviewed in system privacy settings.</p>${btn('Simulate microphone restored in settings','restore-mic','','secondary')}</div>`:''}
   ${state.transcript!==seed||state.output?'<p class="lab-muted">Your current transcript and proposal are retained for this page session. Continue with sample text to return to the draft.</p>':''}
   ${state.previousAttempt?`<p class="lab-callout">The previous sample had ${state.previousAttempt.outcome==='uncertain'?'an uncertain insertion outcome':'one completed insertion'}. Inspect a real target before starting another insertion. Starting this new sample does not retry it.</p>`:''}
   <details class="lab-extra"><summary>Inspect a setup failure</summary><label class="lab-label" for="voicy-setup">Sample setup condition</label><select id="voicy-setup" class="lab-field"><option value="ready" ${state.setup==='ready'?'selected':''}>First-use microphone access not decided</option><option value="denied" ${state.setup==='denied'?'selected':''}>Microphone permission denied</option><option value="conflict" ${state.setup==='conflict'?'selected':''}>Shortcut conflicts with another action</option></select><p>Changing this condition simulates setup only. Drafts and any previous insertion attempt remain intact.</p></details>`;
 }
 function transcript(){
  return `<label class="lab-label" for="voicy-transcript">Transcript</label><textarea id="voicy-transcript" class="lab-field" dir="auto">${esc(state.transcript)}</textarea>
   <label class="lab-label" for="voicy-language">Output language</label><select id="voicy-language" class="lab-field"><option value="en" ${state.language==='en'?'selected':''}>English</option><option value="ar" ${state.language==='ar'?'selected':''}>العربية</option></select>
   <p>Keep names and technical terms accurate. The sample adds a review wrapper; it does not transcribe audio, translate your text or call a provider.</p>
   <label class="lab-label" for="voicy-action">Proposed action</label><select id="voicy-action" class="lab-field"><option value="concise" ${state.action==='concise'?'selected':''}>Prepare a concise update</option><option value="unsupported" ${state.action==='unsupported'?'selected':''}>Unsupported action · send without review</option></select>
   <div class="lab-actions">${btn('Prepare a concise update','transform')}${state.error&&state.scenario==='failure'?btn('Try the sample provider again','retry','','secondary'):''}${btn('Return to activation · keep draft','cancel','','secondary')}</div>`;
 }
 function review(){
  return `<details><summary>Compare with the source for this proposal</summary><p class="lab-transcript" dir="auto">${esc(state.basis?.text??state.transcript)}</p></details>
   <label class="lab-label" for="voicy-output">Editable proposed text</label><textarea id="voicy-output" class="lab-field" dir="auto">${esc(state.output)}</textarea>
   ${!sameBasis()?'<p class="lab-callout">This retained proposal uses the earlier source shown above. The transcript or language has since changed. Return to the transcript to explicitly replace the proposal.</p>':''}
   <label class="lab-label" for="voicy-target">Target condition</label><select id="voicy-target" class="lab-field">${[['original','Original target still available'],['changed','Target changed'],['none','No insertion target'],['uncertain','Insertion outcome uncertain']].map(([id,label])=>`<option value="${id}" ${state.target===id?'selected':''}>${label}</option>`).join('')}</select>
   ${state.attempt?'<div class="lab-callout">This session has already made its one sample insertion attempt. Reviewing or editing text does not enable another attempt. Copy the proposal deliberately, or start a separate sample after checking the target.</div>':''}
   ${state.previousAttempt?.outcome==='uncertain'?'<p class="lab-callout">The previous sample could not confirm its insertion. Inspect the target before reusing that text; starting this separate sample did not resolve the earlier outcome.</p>':''}
   <p class="lab-muted">App-control access is considered only after you approve an insertion into an available target. A simulated grant returns here for another review; it never inserts automatically.</p>
   <div class="lab-actions">${btn('Approve sample insertion','insert',state.attempt?'disabled':'')}${btn('Copy proposed text','copy-proposal','','secondary')}${btn('Back to transcript','back','','secondary')}${state.attempt?btn('Start a new sample','reset','','secondary'):''}</div>`;
 }
 function result(){
  const titles={inserted:'Inserted once into the sample target.',uncertain:'Insertion could not be confirmed.',changed:'The target changed.',none:'No insertion target is available.',access:'Sample app-control access denied.'};
  return `<div class="${state.result==='inserted'?'lab-confirmation':'lab-callout'}"><h3>${titles[state.result]}</h3><p>${state.result==='inserted'?'One sample insertion was recorded. No other application was changed.':'Your approved text is retained. No automatic insertion retry is made. Inspect the target before deciding what to do.'}</p></div>
   <label class="lab-label" for="voicy-approved">Approved text · select here if clipboard access is unavailable</label><textarea id="voicy-approved" class="lab-field" dir="auto" readonly>${esc(state.approved)}</textarea>
   <div class="lab-actions">${btn('Copy approved text','copy','','secondary')}${btn('Review text again','review','','secondary')}${state.result==='access'?btn('Simulate app-control access restored','restore-access','','secondary'):''}${btn('Start a new sample','reset','','secondary')}</div>`;
 }
 function render(focus){
  const titles=['A writing layer, with a clear way in.','Edit the words before shaping them.','Review the proposed text.','Know what happened.','Sample voice capture is ready.'];
  let content=state.prompt==='mic'||state.prompt==='access'?rationale():state.prompt==='replace'?`<section class="lab-callout"><h3 id="voicy-replace-title" tabindex="-1">Keep or replace the edited proposal?</h3><p>The transcript or language changed. Your edited proposal is retained until you explicitly replace it.</p><div class="lab-actions">${btn('Replace with a new sample proposal','replace-proposal')}${btn('Keep the edited proposal','keep-proposal','','secondary')}</div></section>`:state.step===0?ready():state.step===1?transcript():state.step===2?review():state.step===3?result():`<p>Microphone access is allowed in the sample only. No microphone is open and no audio is being captured. Finish to inspect the retained seeded transcript.</p><div class="lab-actions">${btn('Finish sample capture','finish-capture')}${btn('Cancel sample capture · keep draft','cancel','','secondary')}</div>`;
  app.innerHTML=`<p class="lab-step">${['Ready','Transcript','Review','Result','Sample capture'][state.step]}</p><h2 tabindex="-1" data-step-title>${titles[state.step]}</h2><p class="lab-error" id="voicy-error" tabindex="-1" role="alert">${esc(state.error)}</p>${state.notice?`<p class="lab-callout">${esc(state.notice)}</p>`:''}${content}
   <details class="lab-extra"><summary>Permission design references and study limits</summary><p>This proposed setup sequence is separate from a verified native build. Capture uses seeded text, permission decisions are simulated, and refresh resets page-local drafts and attempts. The exact native shortcut, provider and insertion mechanisms still need build verification.</p><p>Platform references: <a href="https://developer.apple.com/documentation/avfoundation/requesting-authorization-to-capture-and-save-media" target="_blank" rel="noopener noreferrer">Apple capture authorization (new tab)</a> · <a href="https://support.apple.com/guide/mac-help/allow-accessibility-apps-to-access-your-mac-mh43185/mac" target="_blank" rel="noopener noreferrer">Apple app-control access (new tab)</a> · <a href="https://support.apple.com/guide/mac-help/control-access-to-the-microphone-on-mac-mchla1b1e1fe/mac" target="_blank" rel="noopener noreferrer">Review microphone access (new tab)</a>.</p></details>`;
  app.querySelector('#voicy-setup')?.addEventListener('change',event=>{state.setup=event.target.value;if(state.setup==='denied')state.mic='denied';else if(state.setup==='ready')state.mic='unknown';state.notice='Setup condition changed in the sample. Your drafts and insertion-attempt record are retained.';render('#voicy-setup');announce(state.notice);});
  app.querySelector('#voicy-transcript')?.addEventListener('input',event=>state.transcript=event.target.value);
  app.querySelector('#voicy-output')?.addEventListener('input',event=>{state.output=event.target.value;state.dirty=true;});
  for(const [id,key] of [['voicy-language','language'],['voicy-action','action'],['voicy-target','target']])app.querySelector('#'+id)?.addEventListener('change',event=>state[key]=event.target.value);
  if(focus)app.querySelector(focus)?.focus();
 }
 function generate(){
  state.basis={text:state.transcript.trim(),language:state.language};
  state.output=state.language==='ar'?`مسودة للمراجعة\n\n${state.basis.text}\n\nراجع الأسماء والمعنى قبل الإدراج.`:`Project update\n\n${state.basis.text}\n\nPlease review the wording before insertion.`;
  state.dirty=false;state.step=2;state.prompt=null;
 }
 function prepare(){
  if(!state.transcript.trim()){state.error='Add a transcript before preparing a sample update.';return '#voicy-transcript';}
  if(state.action==='unsupported'){state.error='This action is unsupported. Your transcript is retained; choose the reviewed update action instead.';return '#voicy-action';}
  if(state.scenario==='failure'){state.error='The sample provider is unavailable. Your transcript and any edited proposal are retained. Try again or continue editing.';return '#voicy-error';}
  if(state.output&&sameBasis()){state.step=2;state.notice='The source is unchanged. Your existing proposal and edits are retained.';}
  else if(state.output&&state.dirty){state.prompt='replace';return '#voicy-replace-title';}
  else generate();
 }
 function beginCapture(){
  if(state.mic==='denied'){state.step=0;state.notice='Microphone access remains denied in the sample. Use text, or explicitly simulate access restored in settings.';}
  else if(state.mic==='unknown'){state.prompt='mic';return '#voicy-permission-title';}
  else state.step=4;
 }
 function insert(){
  if(state.attempt){state.error='This session already used its one insertion attempt. No automatic or repeated insertion was made.';return;}
  if(!state.output.trim()){state.error='Add the text you want to approve.';return '#voicy-output';}
  state.approved=state.output;
  if(['changed','none'].includes(state.target)){state.result=state.target;state.step=3;}
  else if(state.access==='unknown'){state.prompt='access';return '#voicy-permission-title';}
  else if(state.access==='denied'){state.result='access';state.step=3;}
  else{state.result=state.target==='original'?'inserted':'uncertain';state.attempt={outcome:state.result,text:state.approved};state.step=3;}
 }
 wireClick(async data=>{
  captureFields();state.error='';state.notice='';let focus;
  if(data.action==='start'||data.action==='menu-start'){state.step=1;state.prompt=null;}
  else if(data.action==='shortcut-start'){if(state.setup==='conflict')state.notice='The sample shortcut is unavailable. Use the visible menu-bar route; no conflicting shortcut was replaced.';else focus=beginCapture();}
  else if(data.action==='menu-record')focus=beginCapture();
  else if(data.action==='restore-mic'){state.mic='granted';state.notice='Microphone access restored in the sample only. Choose an activation action to continue.';}
  else if(data.action==='permission-allow'){
   if(state.prompt==='mic'){state.mic='granted';state.step=4;}
   else if(state.prompt==='access'){state.access='granted';state.step=2;state.notice='Sample app-control access allowed. Recheck the retained text and target, then explicitly approve the insertion. Nothing was inserted.';}
   state.prompt=null;
  }else if(data.action==='permission-deny'){
   if(state.prompt==='mic'){state.mic='denied';state.step=0;state.notice='Sample microphone access denied. Typed input remains available.';}
   else if(state.prompt==='access'){state.access='denied';state.result='access';state.step=3;}
   state.prompt=null;
  }else if(data.action==='cancel-permission'){state.prompt=null;state.step=2;state.notice='App-control setup canceled. Your editable proposal is retained.';}
  else if(data.action==='finish-capture'){state.step=1;state.notice='Sample capture finished with retained seeded text. No audio was recorded.';}
  else if(data.action==='cancel'){state.step=0;state.prompt=null;state.notice='Draft retained. Continue with sample text whenever you are ready.';}
  else if(data.action==='transform')focus=prepare();
  else if(data.action==='retry'){state.scenario='success';const control=doc.querySelector('#scenario');if(control)control.value='success';focus=prepare();}
  else if(data.action==='replace-proposal')generate();
  else if(data.action==='keep-proposal'){state.prompt=null;state.step=2;state.notice='Edited proposal kept with its original source. The changed transcript is also retained.';}
  else if(data.action==='back'){state.step=1;state.prompt=null;}
  else if(data.action==='insert')focus=insert();
  else if(data.action==='restore-access'){state.access='granted';state.step=2;state.notice='App-control access restored in the sample only. Review and approve again; nothing was inserted.';}
  else if(data.action==='review'){state.step=2;state.prompt=null;}
  else if(data.action==='reset'){state.previousAttempt=state.attempt??state.previousAttempt;state.attempt=null;state.approved='';state.result='';state.prompt=null;state.step=0;state.notice='A new sample session is ready. Draft text is retained; no insertion was retried.';}
  else if(data.action==='copy'||data.action==='copy-proposal'){
   const text=data.action==='copy'?state.approved:state.output;
   if(!text.trim()){announce('There is no text to copy.');return;}
   try{await navigator.clipboard.writeText(text);announce(data.action==='copy'?'Approved text copied. No insertion or message was sent.':'Proposed text copied deliberately. No insertion or message was sent.');}
   catch{announce('Copy is unavailable. Select the preserved text and copy it manually.');app.querySelector(data.action==='copy'?'#voicy-approved':'#voicy-output')?.focus();}
   return;
  }else return;
  render(focus);if(!focus)focusTitle({scroll:true});
  announce(state.error||state.notice||(state.step===3?(state.result==='inserted'?'Inserted once into the sample target.':'Insertion stopped. Approved text preserved.'):'Sample writing state updated.'));
 });
 doc.querySelector('#scenario').addEventListener('change',event=>{state.scenario=event.target.value;announce(`Scenario: ${event.target.selectedOptions[0].textContent}. Your drafts are retained.`);});
 render();
}
