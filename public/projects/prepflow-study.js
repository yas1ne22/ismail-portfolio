import {prepMeals,prepPhaseNames,createPrepWeek,selectedPrepSlot,hasPrepWork,prepConflict,prepDurations,prepRemaining,settlePrepTimer,pausePrep,startPrepTimer,resumePrep,completePrepStep,changePrepServings,requestPrepSwap,confirmPrepSwap,selectPrepDay,setPrepEquipment,resetPrepSession,weeklyGroceries} from './prepflow-model.js';

export function mountPrepflowStudy({app,esc,btn,announce,wireClick}){
 const state=createPrepWeek(),clock=performance,now=()=>clock.now();
 let error='',notice='',goal='simple',setup=false,interval=null;
 const timerText=milliseconds=>{const seconds=Math.ceil(milliseconds/1000);return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`};
 const stopClock=()=>{if(interval!==null)clearInterval(interval);interval=null;};
 const progress=slot=>slot.session.done?'Complete':slot.quantityReview?'Quantity adjustment needed':slot.session.paused?`Paused at step ${slot.session.phase+1}`:slot.session.running?`Timer running · step ${slot.session.phase+1}`:hasPrepWork(slot)?`Step ${slot.session.phase+1} of 3`:'Not started';
 const timeSummary=slot=>`Estimated remaining stages: ${Math.ceil(prepRemaining(slot,now()).total/60000)} min.${slot.quantityReview?' Quantity-adjustment time is not estimated.':''}`;
 function tick(){
  const slot=selectedPrepSlot(state),running=slot.session.running;
  if(!app.isConnected){stopClock();return;}
  settlePrepTimer(slot,now());
  const timer=app.querySelector('#prep-timer');if(timer)timer.textContent=timerText(prepRemaining(slot,now()).step);
  const summary=app.querySelector('#prep-time-summary');if(summary)summary.textContent=timeSummary(slot);
  const day=app.querySelector(`[data-prep-progress="${slot.id}"]`);if(day)day.textContent=progress(slot);
  if(running&&!slot.session.running){
   stopClock();const button=app.querySelector('[data-action="timer"]');if(button){button.textContent='Step estimate elapsed';button.disabled=true;}
   app.querySelector('#prep-clock-note').textContent='The sample estimate has elapsed. Check the step before marking it complete; the next stage never starts automatically.';
   announce('Sample step estimate elapsed. Check the step before continuing.');
  }
 }
 function render(){
  stopClock();const slot=selectedPrepSlot(state),meal=prepMeals[slot.meal],session=slot.session;
  const blocked=Boolean(state.pendingSwap||slot.quantityReview||prepConflict(state,slot)||session.done),remaining=prepRemaining(slot,now()),durations=prepDurations(slot),groceries=weeklyGroceries(state);
  app.innerHTML=`<h2 tabindex="-1" data-step-title>Your sample week</h2><p>Three planned dinners share one grocery list. Each day keeps its own preparation progress. Other days are unplanned; no account or questionnaire is required.</p>
  <details class="lab-extra"><summary>First useful plan and optional preferences</summary><p>Defaults: Monday, Wednesday and Friday dinners; two servings each; oven available. These are sample choices, not findings from a household study.</p><label class="lab-label" for="prep-goal">Optional planning goal</label><select id="prep-goal" class="lab-field"><option value="simple" ${goal==='simple'?'selected':''}>A simple shared meal plan</option><option value="plant" ${goal==='plant'?'selected':''}>A plant-based sample</option></select><div class="lab-actions">${btn('Apply to unstarted meals','apply-goal',state.pendingSwap?'disabled':'')}${btn('Skip preferences','skip-setup','','secondary')}</div><p>${setup?'The sample week is ready. Keep refining individual meals below.':'Use the default week immediately, or refine it here. Skipping keeps the current meals and servings.'}</p></details>
  <div class="prep-week-days" aria-label="Planned dinners">${state.slots.map(day=>`<button type="button" class="prep-day" data-action="day" data-day="${day.id}" aria-pressed="${day.id===state.selected}" ${state.pendingSwap?'disabled':''}><strong>${day.day}</strong><span>${esc(prepMeals[day.meal].name)} · ${day.servings} servings</span><small data-prep-progress="${day.id}">${progress(day)}</small></button>`).join('')}</div>
  <h3 id="prep-day-title" tabindex="-1">${slot.day} dinner</h3><p>Recipe values, ingredient quantities and preparation times are illustrative. This is a portfolio study, not a configured recipe or alarm service.</p><label class="lab-label" for="meal">Meal</label><select class="lab-field" id="meal" ${state.pendingSwap?'disabled':''}>${prepMeals.map((item,index)=>`<option value="${index}" ${slot.meal===index?'selected':''}>${esc(item.name)}</option>`).join('')}</select>
  <div class="lab-row"><div><label class="lab-label" for="servings">Servings</label><input id="servings" class="lab-field" type="number" min="1" max="6" value="${slot.servings}" ${session.done||state.pendingSwap?'disabled':''}></div><div><label class="lab-label" for="equipment">Equipment</label><select id="equipment" class="lab-field" ${state.pendingSwap?'disabled':''}><option value="oven" ${state.equipment==='oven'?'selected':''}>Oven available</option><option value="none" ${state.equipment==='none'?'selected':''}>No oven</option></select></div></div>
  <p class="lab-error" role="alert">${esc(error)}</p>${notice?`<p class="lab-callout">${esc(notice)}</p>`:''}
  ${state.pendingSwap?`<div class="lab-callout" role="region" aria-labelledby="prep-swap-title"><h3 id="prep-swap-title" tabindex="-1">Review this meal change</h3><p>Changing ${slot.day} to ${esc(prepMeals[state.pendingSwap.meal].name)} resets only this day’s preparation session. Its ${session.phase} completed stages and sample timer will be reset. The other planned days keep their meals, servings and progress. The grocery list changes after confirmation.</p><div class="lab-actions">${btn('Change meal and reset this session','confirm-swap')}${btn('Keep current meal','cancel-swap','','secondary')}</div></div>`:''}
  <div class="lab-stats"><div><strong>${meal.kcal}</strong><span>Sample kcal / serving</span></div><div><strong>${meal.protein} g</strong><span>Sample protein / serving</span></div><div><strong>${durations.reduce((sum,value)=>sum+value,0)/60000} min</strong><span>Estimated preparation for ${slot.servings} servings</span></div></div>
  ${prepConflict(state,slot)?'<div class="lab-callout">This sample salmon preparation requires an oven. Choose another meal or restore suitable equipment. Progress is retained; a running timer is paused.</div>':''}
  <table class="lab-table"><caption>Initial shopping quantities for the planned week · grams. Opening pantry stock is subtracted once across all three dinners.</caption><thead><tr><th>Ingredient</th><th>Required</th><th>In pantry</th><th>To buy</th></tr></thead><tbody>${groceries.map(item=>`<tr><td>${esc(item.ingredient)}</td><td>${item.total}</td><td>${item.pantry}</td><td>${item.toBuy}</td></tr>`).join('')}</tbody></table>
  <h3 id="prep-session-title" tabindex="-1">${slot.day} preparation session</h3><p id="prep-stage">${session.done?'Sample session complete. This records your action, not an observed cooking outcome.':`Step ${session.phase+1} of 3 · ${prepPhaseNames[session.phase]}.${session.paused?' Paused. Your current step and elapsed time are retained.':''}`}</p>
  ${slot.quantityReview?`<div class="lab-callout"><h4>Review the changed quantities</h4><p>You completed ${slot.quantityReview.completedStages} stages for ${slot.quantityReview.from} servings. The plan now needs ${slot.quantityReview.to}. Completed work is kept; the time needed to adjust already prepared food is not estimated. Review the revised quantities and complete the necessary adjustment before resuming.</p>${btn('Complete sample quantity adjustment','review-quantity',state.pendingSwap?'disabled':'','secondary')}</div>`:''}
  <ol class="prep-stage-list">${prepPhaseNames.map((label,index)=>`<li><span>${label}</span><strong>${index<session.phase?'Marked complete':`${durations[index]/60000} min estimate`}</strong></li>`).join('')}</ol>
  ${session.done?`<div class="lab-actions">${btn('Reset this sample session','reset-session',state.pendingSwap?'disabled':'','secondary')}</div>`:`<div class="prep-timer"><span>Current step estimate remaining</span><output id="prep-timer" role="timer" aria-live="off">${timerText(remaining.step)}</output><p id="prep-clock-note">${session.running?'Sample timer running.':session.paused?'Paused. Time away does not consume this step’s remaining estimate.':remaining.step===0?'The estimate has elapsed. Check the step before continuing.':'Start the sample timer or mark the step complete yourself. It never advances a stage automatically.'}</p></div><div class="lab-actions">${btn(session.running?'Sample timer running':'Start sample timer','timer',blocked||session.paused||session.running||remaining.step===0?'disabled':'')}${btn(session.paused?'Resume preparation':'Pause preparation','pause',blocked?'disabled':'','secondary')}${btn('Simulate an interruption','interrupt',state.pendingSwap?'disabled':'','secondary')}${btn(session.phase===2?'Finish sample session':'Complete this step','next',blocked||session.paused?'disabled':'','secondary')}</div>`}
  <p class="lab-muted" id="prep-time-summary">${timeSummary(slot)}</p><details class="lab-extra"><summary>Estimate rules and state limits</summary><p>The two-serving examples use preparation/cooking/portioning estimates of 10/20/5, 8/12/5 or 10/15/5 minutes. Each extra serving adds two preparation minutes and one portioning minute; the cooking estimate stays unchanged. These rules illustrate coordination, not a validated recipe or batch capacity.</p><p>The grocery list is an initial shopping calculation from a sample opening pantry balance. Marking a meal complete does not track purchases, food consumption or live inventory.</p><p>Only one sample timer runs at a time. Changing days pauses it and keeps that day’s progress. Refresh resets this page-local week. There is no background alarm, notification or actual kitchen observation.</p></details>`;
  app.querySelector('#prep-goal').addEventListener('change',event=>goal=event.target.value);
  app.querySelector('#meal').addEventListener('change',event=>change(()=>{requestPrepSwap(state,slot,Number(event.target.value),now());notice=state.pendingSwap?'The current meal and grocery list are unchanged until you decide.':'Meal, nutrition, grocery totals and this day’s preparation estimate updated together.';},state.pendingSwap?'#prep-swap-title':null));
  app.querySelector('#servings').addEventListener('change',event=>change(()=>{changePrepServings(state,slot,Number(event.target.value),now());notice=slot.quantityReview?'The week’s quantities changed. Review work already completed before resuming this day.':'Servings, weekly groceries and remaining preparation estimates updated together.';}));
  app.querySelector('#equipment').addEventListener('change',event=>change(()=>{setPrepEquipment(state,event.target.value,now());notice=prepConflict(state,slot)?'Equipment conflict: progress is retained. Resolve the conflict before continuing.':'Equipment updated. A paused session stays paused until you choose Resume.';}));
  if(session.running){interval=setInterval(tick,1000);interval?.unref?.();}
 }
 function change(update,focus){
  error='';notice='';try{update();}catch(problem){error=problem.message;}
  render();if(state.pendingSwap)app.querySelector('#prep-swap-title')?.focus();else if(focus)app.querySelector(focus)?.focus();
  announce(error||notice||'Sample plan updated.');
 }
 wireClick(data=>change(()=>{
  const slot=selectedPrepSlot(state);
  if(data.action==='day'){const previous=state.selected;selectPrepDay(state,data.day,now());notice=previous===data.day?'This day is already selected. Its timer state is unchanged.':'Selected day changed. Any running session was paused; every day keeps its own progress.';}
  else if(data.action==='apply-goal'){
   let changed=0;for(const day of state.slots){if(hasPrepWork(day))continue;const meal=goal==='plant'?1:{mon:0,wed:1,fri:2}[day.id];if(day.meal!==meal){requestPrepSwap(state,day,meal,now());changed++;}}
   setup=true;notice=`Preferences applied to ${changed} unstarted meals. Started sessions are retained.`;
  }else if(data.action==='skip-setup'){setup=true;notice='Preferences skipped. The useful sample week and its quantities are unchanged.';}
  else if(data.action==='confirm-swap'){confirmPrepSwap(state);notice='Only the selected day’s session was reset. Other days retain their plan and progress.';}
  else if(data.action==='cancel-swap'){state.pendingSwap=null;notice='Meal change canceled. The current session is paused and its progress is retained.';}
  else if(data.action==='timer'){startPrepTimer(state,slot,now());notice='Sample timer started. It is an estimate, not a cooking alarm.';}
  else if(data.action==='interrupt'){pausePrep(slot,now());notice='Preparation interrupted. Current step, elapsed time, servings and the rest of the week are retained.';}
  else if(data.action==='pause'){if(slot.session.paused){resumePrep(state,slot,now());notice='Preparation resumed from its retained step and time.';}else{pausePrep(slot,now());notice='Preparation paused. Current step and elapsed time are retained.';}}
  else if(data.action==='next'){completePrepStep(state,slot,now());notice=slot.session.done?'Sample preparation marked complete. No real cooking outcome is inferred.':'Step marked complete. Check the next stage before starting its sample timer.';}
  else if(data.action==='review-quantity'){slot.quantityReview=null;notice='Sample quantity adjustment marked complete. The retained session is still paused; choose Resume when ready.';}
  else if(data.action==='reset-session'){resetPrepSession(slot);notice='This day’s session was reset. The week’s meals, servings and other progress remain.';}
 },data.action==='day'?'#prep-day-title':['timer','next','confirm-swap','cancel-swap','review-quantity','reset-session'].includes(data.action)?'#prep-session-title':null));
 const view=app.ownerDocument.defaultView;
 view.addEventListener('pagehide',()=>{const slot=selectedPrepSlot(state);if(slot.session.running)pausePrep(slot,now());stopClock();});
 view.addEventListener('pageshow',event=>{if(!event.persisted)return;notice='The page-local week was restored. Any running timer was paused when you left; check the retained stage before resuming.';render();});
 render();
}
