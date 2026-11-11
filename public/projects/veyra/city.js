const places=[
 {id:'trevi',name:'Trevi Fountain',mood:'The Rome you dreamed of',kind:'Culture',image:'trevi.webp',x:62,y:76,minutes:40,description:'Water, marble and a little movie magic. Make time to simply stand still and take it in.',tip:'Build in breathing room around this stop. Crowds and access conditions vary; check locally before you go.'},
 {id:'garden',name:'Villa Borghese gardens',mood:'A softer side of the city',kind:'Slow moments',image:'garden.webp',x:45,y:30,minutes:75,description:'Trade the bustle for leafy paths and a moment by the lake. This is the part of the day you leave unhurried.',tip:'Keep this flexible if the weather turns. The lakeside image shows the Temple of Aesculapius area.'},
 {id:'gallery',name:'Galleria Borghese',mood:'Get beautifully lost in art',kind:'Culture',image:'gallery.webp',x:78,y:20,minutes:120,description:'A quieter chapter among sculpture, painted ceilings and stories that reward a closer look.',tip:'Check timed-entry availability with the venue before committing. Adding this stop does not book a ticket.'}
];
const app=document.querySelector('#city-app');
let selected=[],filter='All',search='',active='trevi',detail=null,detailOrigin='map',reviewed=false,lastRemoved=null,noticeTimer,dayEnd='14:00',weather='clear',lastPlan=null;
const originalOverflow=document.body.style.overflow;
const dialogBackground=new Map();
const place=id=>places.find(p=>p.id===id);
const visiblePlaces=()=>places.filter(p=>(filter==='All'||p.kind===filter)&&`${p.id} ${p.name} ${p.kind} ${p.mood}`.toLowerCase().includes(search.toLowerCase()));
const visitTimes={},visitDrafts={},visitErrors={};
const visitMinutes=id=>visitTimes[id]??place(id).minutes;
const time=n=>`${Math.floor(n/60)}h ${n%60?`${n%60}m`:''}`.trim();
const duration=()=>selected.reduce((n,id)=>n+visitMinutes(id),0)+Math.max(0,selected.length-1)*25;
function announce(s){const n=document.querySelector('#announcement');n.textContent=s;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>n.textContent='',3500);}
function map(){const mappedPlaces=reviewed?places.filter(p=>selected.includes(p.id)):visiblePlaces();return `<div class="map" role="group" aria-label="${reviewed?'Illustrative route map. Numbered places match your day list.':'Illustrative Rome map. The place list below offers the same stops.'}"><svg viewBox="0 0 800 385" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="blocks" width="72" height="58" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)"><rect width="72" height="58" fill="#efeadf"/><rect x="6" y="6" width="60" height="46" rx="5" fill="#e5dfd1"/><path d="M0 0H72M0 0V58" stroke="#fffdf8" stroke-width="6"/></pattern></defs><rect width="800" height="385" fill="url(#blocks)"/><path d="M-20 -20 Q220 80 120 200T165 420" fill="none" stroke="#b6dce2" stroke-width="35"/><path d="M320 -20L800 -20 800 138Q660 169 541 172L390 200Q287 144 320 -20" fill="#ceddbe"/><path d="M340 25Q480 90 755 45M330 110Q520 145 715 80M398 12Q460 110 470 168" fill="none" stroke="#eff3df" stroke-width="9"/><path d="M232 -20L299 160 440 385M155 280L380 231 820 290M310 220L800 189" fill="none" stroke="#fffdf8" stroke-width="12"/><path d="M379 98Q390 87 410 101T401 127Q373 137 379 98" fill="#a4cfd0"/><g fill="#859779" font-family="Arial" font-size="12" letter-spacing="2"><text x="470" y="112">VILLA BORGHESE</text><text x="220" y="218" fill="#a49b87">CAMPO MARZIO</text><text x="555" y="346" fill="#a49b87">TREVI</text></g>${selected.length>1?`<polyline points="${selected.map(id=>{const p=place(id);return `${p.x*8},${p.y*3.85}`}).join(' ')}" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${selected.map(id=>{const p=place(id);return `${p.x*8},${p.y*3.85}`}).join(' ')}" fill="none" stroke="#075fcc" stroke-width="4" stroke-dasharray="7 7" stroke-linecap="round"/>`:''}</svg>${mappedPlaces.map(p=>`<button class="pin ${active===p.id?'active':''} ${selected.includes(p.id)?'added':''}" style="left:${p.x}%;top:${p.y}%" data-open="${p.id}" data-order="${selected.indexOf(p.id)+1}" aria-label="Explore ${p.name}${selected.includes(p.id)?', stop '+(selected.indexOf(p.id)+1):''}"><img src="assets/${p.image}" alt="${p.name}"><span>${p.name}</span></button>`).join('')}<span class="compass" aria-hidden="true"> N</span><span class="map-label">${reviewed?'Rome · Your selected route':'Rome · route planner'}</span></div>`;}
function card(p){return `<article class="place-card ${active===p.id?'active':''}" id="card-${p.id}"><button class="place-open" data-open="${p.id}" aria-label="Explore ${p.name}"><img class="photo" src="assets/${p.image}" alt="${p.name}"><div class="place-copy"><small>${p.kind}</small><h3>${p.name}</h3><p>${p.mood}</p><div class="place-meta">${p.minutes} min suggested visit${p.id==='gallery'?' · Check tickets':''}</div></div></button><button class="add ${selected.includes(p.id)?'selected':''}" data-add="${p.id}" ${selected.includes(p.id)?'disabled':''}>${selected.includes(p.id)?'✓ Added to your day':'+ Add to my day'}</button></article>`;}
function constraints(){const end=dayEnd.split(':').map(Number),limit=end[0]*60+end[1],finish=9*60+30+duration(),over=Math.max(0,finish-limit);return `<div class="planner-constraints"><h3>Check the day before committing.</h3><div class="planner-context-controls"><div><label for="day-end">Preferred end of day</label><input id="day-end" type="time" value="${dayEnd}"></div><div><label for="day-weather">Try a weather condition</label><select id="day-weather"><option value="clear" ${weather==='clear'?'selected':''}>Clear sample day</option><option value="rain" ${weather==='rain'?'selected':''}>Rain affects outdoor stops</option></select></div></div>${over?`<p class="constraint-warning">This sample plan ends ${over} minutes after your preferred end time. Remove or shorten a stop before treating it as workable.</p>`:`<p class="constraint-ok">Estimated visits and buffers fit your chosen end time.</p>`}${weather==='rain'&&selected.includes('garden')?`<div class="constraint-warning">The garden is weather-sensitive. Compare an indoor alternative without changing the other stops. <button class="text-button" data-replace-garden>${selected.includes('gallery')?'Keep the gallery; remove the garden':'Replace garden with gallery'}</button></div>`:''}${lastPlan?'<button class="text-button" data-undo-plan>Undo the last replacement</button>':''}<p>Visit lengths and 25-minute buffers are illustrative. Confirm opening hours, access and tickets separately. Nothing is booked.</p></div>`;}
function day(){let cursor=9*60+30;return `<aside class="day-panel" id="day-panel"><p class="eyebrow">${reviewed?'03 / Your day, together':'02 / Make it yours'}</p><div class="day-heading"><h2 id="day-title" tabindex="-1">Your day in Rome</h2><span class="count">${selected.length} ${selected.length===1?'stop':'stops'}</span></div><p class="day-desc">${selected.length?'A little structure. Plenty of room to wander.':'Start with the places that make you feel something.'}</p>${selected.length?`<ol class="stops">${selected.map((id,i)=>{const p=place(id),stamp=`${String(Math.floor(cursor/60)).padStart(2,'0')}:${String(cursor%60).padStart(2,'0')}`;cursor+=visitMinutes(id)+25;return `<li class="stop" id="stop-${id}" tabindex="-1" aria-labelledby="stop-name-${id}" aria-describedby="stop-order-${id}"><div class="stop-main"><img src="assets/${p.image}" alt="${p.name}"><div><span class="stop-order" id="stop-order-${id}">${i+1} / ${stamp} · planned time</span><strong id="stop-name-${id}">${p.name}</strong><small>${visitMinutes(id)} min planned visit</small></div></div><label class="stop-duration" for="visit-time-${id}"><span>Visit estimate · minutes</span><input id="visit-time-${id}" type="number" min="15" max="240" step="5" value="${visitDrafts[id]??visitMinutes(id)}" data-duration="${id}" ${visitErrors[id]?'aria-invalid="true" aria-describedby="visit-error-'+id+'"':''}></label>${visitErrors[id]?'<p class="visit-error" id="visit-error-'+id+'" role="alert">'+visitErrors[id]+'</p>':''}<div class="stop-actions"><button class="text-button" data-up="${id}" aria-label="Move ${p.name} earlier" ${i===0?'disabled':''}> Earlier</button><button class="text-button" data-down="${id}" aria-label="Move ${p.name} later" ${i===selected.length-1?'disabled':''}> Later</button><button class="text-button" data-remove="${id}" aria-label="Remove ${p.name}">Remove</button></div>${i<selected.length-1?'<div class="walk">↳ 25 min walking buffer</div>':''}</li>`;}).join('')}</ol>`:`<div class="empty"><img src="assets/mascot.webp" alt="Veyra travel companion"><div><h3>Follow your curiosity.</h3><p>Tap a photo pin or a place below the map. Add a favorite and your day starts here.</p></div></div>`}${lastRemoved?'<button class="text-button" data-undo>↶ Undo removal</button>':''}<div class="summary"><div><strong>${selected.length?time(duration()):'Your pace'}</strong><span>${selected.length?'Visits + walking buffers':'No packed schedule'}</span></div><div><strong>${selected.includes('gallery')?'1 ticket check':'Stay flexible'}</strong><span>${selected.includes('gallery')?'Gallery needs confirmation':'Nothing booked'}</span></div></div><button class="primary" data-review ${!selected.length?'disabled':''}>${reviewed?'Back to exploring':'Review my day '}</button><p class="panel-note">${reviewed?'Your plan stays in this session. You can still change every stop.':'Choose your places first. Work out the details together.'}</p>${constraints()}</aside>`;}
function modal(){const p=place(detail);if(!p)return '';return `<div class="overlay" data-dismiss><section class="detail" role="dialog" aria-modal="true" aria-labelledby="place-title"><button class="close" data-close aria-label="Close place details">×</button><img src="assets/${p.image}" alt="${p.name}"><div class="detail-copy"><p class="eyebrow">${p.mood}</p><h2 id="place-title">${p.name}</h2><p>${p.description}</p><div class="facts"><span>${p.minutes} min suggested</span><span>${p.kind}</span></div><p><small>${p.tip}</small></p><button class="primary" data-add="${p.id}">${selected.includes(p.id)?'Added: keep exploring':'Add to my day '}</button><p class="panel-note">You can change the order or remove it anytime.</p></div></section></div>`;}
function render(){app.innerHTML=`<section class="intro"><div><p class="eyebrow">Italy / Rome / A day of your own</p><h1>${reviewed?'A day that feels <em>like you.</em>':'How will you <em>feel Rome?</em>'}</h1><p>${reviewed?'See your places together. Change the order until it feels right.':'Fountains, leafy detours, a little art. Follow what draws you in.'}</p></div><div class="steps"><b>01 Explore</b><span>02 Add places</span><span>03 Enjoy your day</span></div></section>${reviewed?'<div class="review-banner"><strong>Your day is ready to shape.</strong> The dotted line connects your chosen stops; walking times and opening hours still need checking. <button data-edit>Keep exploring</button></div>':''}<div class="workspace"><section class="discovery"><div class="toolbar"><div class="pills">${['All','Culture','Slow moments'].map(f=>`<button class="pill" data-filter="${f}" aria-pressed="${f===filter}">${f}</button>`).join('')}</div><span class="day-label">DAY 1 · ROME</span></div><label class="search-label" for="place-search">Find a place from the list or map</label><input class="place-search" id="place-search" type="search" value="${search.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')}" placeholder="Search name or activity">${map()}<div class="section-title"><h2>Places to fall for</h2><span>Tap to take a closer look</span></div><div class="places">${visiblePlaces().length?visiblePlaces().map(card).join(''):'<p class="no-places">No places match. Your existing day is retained. <button class="text-button" data-clear-search>Clear search and filters</button></p>'}</div></section>${day()}</div>${modal()}`;document.body.style.overflow=detail?'hidden':originalOverflow;
 app.querySelectorAll('.intro,.workspace,.review-banner').forEach(el=>el.inert=Boolean(detail));
 for(const element of [...document.body.children].filter(el=>el!==app&&el.id!=='announcement'&&el.tagName!=='SCRIPT')){
  if(detail){if(!dialogBackground.has(element))dialogBackground.set(element,element.inert);element.inert=true;}
  else if(dialogBackground.has(element)){element.inert=dialogBackground.get(element);dialogBackground.delete(element);}
 }
 if(detail)app.querySelector('[data-close]').focus();}
function focusControl(selector,{scroll=false}={}){
 const control=app.querySelector(selector)||app.querySelector('#place-search');
 control?.focus({preventScroll:!scroll});
 if(scroll)control?.scrollIntoView({block:'nearest'});
}
function returnFocus(id,origin=detailOrigin){focusControl(`${origin==='list'?'.place-open':'.pin'}[data-open="${id}"]`);}
function focusStop(id,action){
 const control=action&&app.querySelector(`[data-${action}="${id}"]`);
 focusControl(control&&!control.disabled?`[data-${action}="${id}"]`:`#stop-${id}`);
}
app.addEventListener('click',e=>{
 const b=e.target.closest('button');
 if(!b){
  if(e.target.hasAttribute('data-dismiss')){const id=detail;detail=null;render();returnFocus(id);}
  return;
 }
 if(b.disabled)return;
 const d=b.dataset;
 if(d.add||d.remove||d.up||d.down)lastPlan=null;
 if(d.open){
  active=d.open;detail=d.open;detailOrigin=b.classList.contains('place-open')?'list':'map';render();
 }else if(d.close!==undefined){
  const id=detail;detail=null;render();returnFocus(id);
 }else if(d.add){
  const id=d.add,origin=detail?detailOrigin:'list';
  if(!selected.includes(id)){
   if(lastRemoved?.id===id)lastRemoved=null;
   selected.push(id);reviewed=false;
   announce(`${place(id).name} added · ${selected.length} ${selected.length===1?'stop':'stops'} in your day`);
  }
  active=id;detail=null;render();returnFocus(id,origin);
 }else if(d.clearSearch!==undefined){
  search='';filter='All';render();focusControl('#place-search');announce('All three places shown. Your day is retained.');
 }else if(d.filter){
  filter=d.filter;render();focusControl(`[data-filter="${filter}"]`);announce(`${visiblePlaces().length} places shown. Your day is retained.`);
 }else if(d.remove){
  const i=selected.indexOf(d.remove);if(i<0)return;
  lastRemoved={id:d.remove,index:i};selected.splice(i,1);reviewed=false;render();
  focusControl('[data-undo]');announce('Place removed. Undo is available in your day.');
 }else if(d.undo!==undefined&&lastRemoved){
  const {id,index}=lastRemoved;selected.splice(Math.min(index,selected.length),0,id);lastRemoved=null;reviewed=false;render();
  focusStop(id);announce(`${place(id).name} restored at stop ${selected.indexOf(id)+1}.`);
 }else if(d.up||d.down){
  const id=d.up||d.down,i=selected.indexOf(id),j=i+(d.up?-1:1);
  if(i>=0&&j>=0&&j<selected.length){
   [selected[i],selected[j]]=[selected[j],selected[i]];reviewed=false;render();
   focusStop(id,d.up?'up':'down');announce(`${place(id).name} is now stop ${j+1}. Route and times updated.`);
  }
 }else if(d.replaceGarden!==undefined){
  lastPlan=selected.slice();lastRemoved=null;const index=selected.indexOf('garden');
  selected=selected.filter(id=>id!=='garden');if(!selected.includes('gallery'))selected.splice(Math.max(0,index),0,'gallery');
  reviewed=false;render();focusControl('[data-undo-plan]');announce('Garden replaced. Other stops retained. Check gallery tickets.');
 }else if(d.undoPlan!==undefined&&lastPlan){
  selected=lastPlan.slice();lastPlan=null;reviewed=false;render();focusStop('garden');announce('Previous plan restored.');
 }else if(d.review!==undefined){
  reviewed=!reviewed;filter='All';render();focusControl(reviewed?'#day-title':'#place-search',{scroll:true});
  announce(reviewed?'Review your route and timing.':'Keep exploring places. Your day is retained.');
 }else if(d.edit!==undefined){
  reviewed=false;render();focusControl('#place-search',{scroll:true});announce('Keep exploring places. Your day is retained.');
 }
});
app.addEventListener('change',e=>{if(e.target.dataset.duration){const id=e.target.dataset.duration,raw=e.target.value,n=Number(raw);if(!Number.isInteger(n)||n<15||n>240||n%5!==0){visitDrafts[id]=raw;visitErrors[id]='Choose 15–240 minutes, in steps of 5. The plan still uses '+visitMinutes(id)+' minutes.'}else{visitTimes[id]=n;delete visitDrafts[id];delete visitErrors[id];reviewed=false}render();app.querySelector('#visit-time-'+id)?.focus({preventScroll:true});announce(visitErrors[id]||'Visit duration and the remaining day updated.')}else if(e.target.id==='day-end'&&e.target.value){dayEnd=e.target.value;render();app.querySelector('#day-end').focus();announce('Preferred end time updated. Check the plan constraints.')}else if(e.target.id==='day-end'){e.target.value=dayEnd;announce('Choose an end time. The previous preferred end time is retained.')}else if(e.target.id==='day-weather'){weather=e.target.value;render();app.querySelector('#day-weather').focus();announce('Weather scenario updated.')}});
document.addEventListener('focusin',e=>{if(detail&&!e.target.closest('.detail'))app.querySelector('[data-close]')?.focus({preventScroll:true});});
document.addEventListener('keydown',e=>{if(!detail)return;if(e.key==='Escape'){const id=detail;detail=null;render();returnFocus(id);}if(e.key==='Tab'){const buttons=[...app.querySelectorAll('.detail button')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});render();

app.addEventListener('input',e=>{if(e.target.id!=='place-search')return;search=e.target.value;const start=e.target.selectionStart,end=e.target.selectionEnd;render();const field=app.querySelector('#place-search');field.focus();if(typeof field.setSelectionRange==='function'&&start!==null)field.setSelectionRange(start,end??start)});
