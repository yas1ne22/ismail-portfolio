/* One disposable controller per routed example. */
(function(root){
 'use strict';
 let dispose=()=>{};
 root.mountNasaqExploration=function(){
  dispose();
  const cleanups=[];
  const listen=(target,event,fn,options)=>{target.addEventListener(event,fn,options);cleanups.push(()=>target.removeEventListener(event,fn,options))};
  const api=root.NASAQ_EXPLORATION,T=root.NASAQ_TOKENS;
  if(!api||!T)return;
  const media=root.matchMedia?.('(prefers-reduced-motion: reduce)'),running=new Map();
  const cancel=card=>{(running.get(card)||[]).forEach(a=>a.cancel());running.delete(card);card.removeAttribute('data-active')};
  document.querySelectorAll('[data-motion-demo]').forEach(card=>{
   function start(){
    cancel(card);card.dataset.active='true';
    if(media?.matches)return;
    const data=api.tokens(T),kind=card.dataset.motionDemo,duration=data.get('motion.duration.'+card.dataset.duration).value;
    const curve=name=>'cubic-bezier('+data.get('motion.easing.'+name).join(',')+')',distance=data.get('motion.distance.md').value,rtl=document.documentElement.dir==='rtl'?-1:1;
    const jobs=[];
    const animate=(target,frames,easing=card.dataset.easing)=>{if(target?.animate&&duration>0)jobs.push(target.animate(frames,{duration,easing:curve(easing),fill:'forwards',iterations:1}))};
    const subject=card.querySelector('[data-motion-subject]');
    if(kind==='curves')card.querySelectorAll('[data-motion-curve]').forEach(dot=>{const travel=Math.max(60,(dot.parentElement.clientWidth||180)-20);animate(dot,[{transform:'translateX(0)'},{transform:`translateX(${rtl*travel}px)`}],dot.dataset.motionCurve)});
    else if(kind==='hover')animate(card.querySelector('.motion-sample-button'),[{backgroundColor:data.get('color.ink').hex},{backgroundColor:data.get('color.info').hex}]);
    else if(kind==='press')animate(subject,[{transform:'scale(1)'},{transform:`scale(${data.get('motion.scale.pressed')})`,offset:.5},{transform:'scale(1)'}]);
    else if(kind==='switch')animate(card.querySelector('[data-motion-thumb]'),[{transform:'translateX(0)'},{transform:`translateX(${rtl*24}px)`}]);
    else if(kind==='loading')animate(card.querySelector('[data-motion-spinner]'),[{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}]);
    else if(kind==='disclosure')animate(card.querySelector('[data-motion-chevron]'),[{transform:'rotate(0deg)'},{transform:'rotate(180deg)'}]);
    else if(kind!=='focus')animate(subject,[{opacity:0,transform:`translateY(${distance}px)`},{opacity:1,transform:'translateY(0)'}]);
    running.set(card,jobs);
   }
   listen(card,'pointerenter',start);listen(card,'focus',start);listen(card,'click',start);
   listen(card,'pointerleave',()=>{if(!card.contains(document.activeElement))cancel(card)});
   listen(card,'focusout',e=>{if(!card.contains(e.relatedTarget))cancel(card)});
  });
  const stopMotion=()=>{[...running.keys()].forEach(cancel)};
  media?.addEventListener?.('change',stopMotion);cleanups.push(()=>{stopMotion();media?.removeEventListener?.('change',stopMotion)});
  function mountStudio(host){
   const id=host.dataset.explorer,ui=host.dataset.uiLang,t=(en,ar)=>ui==='ar'?ar:en,$=s=>host.querySelector(s);
   let state=api.defaults(id,ui),expanded=false,previousOverflow='',current,alive=true;
   const status=$('[data-explore-status]'),drafts=new Map();
   function writeSource(){const code=$('[data-source]');if(root.NasaqCodeEditor)root.NasaqCodeEditor.update(code,current.code,'html');else code.textContent=current.code;}
   function setView(view,focus=false){
    host.querySelectorAll('[data-showcase-view]').forEach(tab=>{const active=tab.dataset.showcaseView===view;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus()});
    host.querySelectorAll('[data-showcase-panel]').forEach(panel=>panel.hidden=panel.dataset.showcasePanel!==view);
   }
   function rememberDrafts(){
    host.querySelectorAll('[data-frame]').forEach(frame=>drafts.set(frame.dataset.frame,[...frame.querySelectorAll('input,textarea,select')].map(el=>({tag:el.tagName,type:el.type,value:el.value,checked:el.checked,mixed:el.indeterminate}))));
   }
   function restoreDrafts(){
    host.querySelectorAll('[data-frame]').forEach(frame=>frame.querySelectorAll('input,textarea,select').forEach((el,i)=>{
     const draft=drafts.get(frame.dataset.frame)?.[i];if(!draft||draft.tag!==el.tagName||draft.type!==el.type)return;
     if(el.type==='checkbox'||el.type==='radio'){el.checked=draft.checked;el.indeterminate=draft.mixed;}
     else if(el.tagName!=='SELECT'||[...el.querySelectorAll('option')].some(option=>option.value===draft.value))el.value=draft.value;
    }));
   }
   function selection(){
    host.querySelectorAll('[data-select-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.selectVariant===state.mode)));
    host.querySelectorAll('[data-frame]').forEach(frame=>frame.classList.toggle('is-selected',frame.dataset.frame===state.mode));
    $('[data-selection-name]').textContent=api.stateName(state.mode,ui);$('[data-canvas-selection]').textContent=api.stateName(state.mode,ui);
    current=api.view(id,state,T,ui);$('[data-inspection]').innerHTML=current.inspection;writeSource();liveSource($(`[data-frame="${state.mode}"]`));
   }
   function render(preserve=true){
    if(preserve)rememberDrafts();
    $('[data-board]').innerHTML=api.board(id,state);
    host.querySelectorAll('[data-explore-mixed]').forEach(el=>el.indeterminate=true);
    restoreDrafts();selection();
   }
   function liveSource(frame){
    if(!frame)return;
    const surface=frame.querySelector('.component-frame-surface'),clone=surface.cloneNode(true),inputs=[...surface.querySelectorAll('input,textarea,select')];
    clone.querySelectorAll('input,textarea,select').forEach((el,i)=>{
     const live=inputs[i];if(el.tagName==='TEXTAREA')el.textContent=live.value;
     else if(el.tagName==='SELECT')el.querySelectorAll('option').forEach(o=>o.toggleAttribute('selected',o.value===live.value));
     else if(['checkbox','radio'].includes(el.type))el.toggleAttribute('checked',live.checked);
     else el.setAttribute('value',live.value);
     el.removeAttribute('data-explore-mixed');
    });
    current.code=`<section class="nq" lang="${state.lang}" dir="${state.lang==='ar'?'rtl':'ltr'}">\n${clone.innerHTML}\n</section>`;
    if(surface.querySelector('input')?.indeterminate)current.code+='\n<script>document.querySelector("input[type=checkbox]").indeterminate = true;</script>';
    if(['tabs','dialog','tooltip'].includes(id))current.code+='\n<!-- Include nasaq.js once for native interaction helpers. -->';
    writeSource();
   }
   function expand(on){
    expanded=on;host.classList.toggle('is-expanded',on);$('[data-expand]').setAttribute('aria-expanded',String(on));
    if(on){host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');host.setAttribute('aria-label',t('Nasaq component canvas','لوحة مكونات نسق'))}
    else {host.removeAttribute('role');host.removeAttribute('aria-modal');host.removeAttribute('aria-label')}
    $('[data-expand]').textContent=on?t('Close canvas','إغلاق اللوحة'):t('Expand','توسيع');
    if(on){previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';$('[data-expand]').focus()}
    else {document.body.style.overflow=previousOverflow;$('[data-expand]').focus()}
   }
   listen(host,'click',async e=>{
    const variant=e.target.closest('[data-select-variant]'),frame=e.target.closest('[data-frame]');
    if(variant||frame){state.mode=variant?.dataset.selectVariant||frame.dataset.frame;selection();if(frame)Promise.resolve().then(()=>{if(alive)liveSource(frame)})}
    if(e.target.closest('[data-expand]'))expand(!expanded);
    const view=e.target.closest('[data-showcase-view]');if(view){e.stopPropagation();setView(view.dataset.showcaseView);}
    if(e.target.closest('[data-reset]')){state=api.defaults(id,ui);drafts.clear();$('.component-properties').innerHTML=api.properties(id,state,ui);render(false);status.textContent=t('Preview reset.','أعيد ضبط المعاينة.')}
    if(e.target.closest('[data-copy-example]')){try{await navigator.clipboard.writeText(root.NasaqCodeEditor?root.NasaqCodeEditor.format(current.code,'html'):current.code);if(alive)status.textContent=t('Selected component copied.','نُسخ المكوّن المحدد.')}catch{if(alive){setView('code');$('[data-source]').parentElement.focus();status.textContent=t('Select and copy the source below.','حدد المصدر أدناه وانسخه.')}}}
   });
   function control(e){
    const el=e.target.closest('[data-control]');if(!el)return;
    if(e.type==='input'&&el.tagName==='SELECT'||e.type==='change'&&el.tagName!=='SELECT')return;
    const old=api.defaults(id,state.lang),key=el.dataset.control;state[key]=el.type==='range'?Number(el.value):el.value;
    if(key==='lang'&&state.label===old.label){state.label=api.defaults(id,state.lang).label;$('[data-control="label"]').value=state.label}
    render();
   }
   listen(host,'input',control);listen(host,'change',control);
   listen(host,'keydown',e=>{
    const tab=e.target.closest('[data-showcase-view]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    e.preventDefault();e.stopPropagation();const tabs=[...host.querySelectorAll('[data-showcase-view]')],index=tabs.indexOf(tab),rtl=ui==='ar';
    const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?(rtl?-1:1):(rtl?1:-1))+tabs.length)%tabs.length;
    setView(tabs[next].dataset.showcaseView,true);
   });
   const updateSource=e=>{const frame=e.target.closest('[data-frame]');if(frame){state.mode=frame.dataset.frame;selection();liveSource(frame)}};
   listen(host,'input',updateSource);listen(host,'change',updateSource);listen(host,'toggle',updateSource,true);
   listen(host,'close',e=>{const frame=e.target.closest('[data-frame]');frame?.querySelector('[data-open]')?.focus();updateSource(e)},true);
   listen(host,'focusout',e=>{const wrap=e.target.closest('.nq-tooltip-wrap');if(wrap&&!wrap.contains(e.relatedTarget))wrap.querySelector('.nq-tooltip').style.visibility=''});
   listen(host,'pointerout',e=>{const wrap=e.target.closest('.nq-tooltip-wrap');if(wrap&&!wrap.contains(e.relatedTarget))wrap.querySelector('.nq-tooltip').style.visibility=''});
   listen(document,'keydown',e=>{
    if(!expanded)return;
    if(e.key==='Escape'&&!host.querySelector('dialog[open]')){expand(false);return;}
    if(e.key==='Tab'&&!host.querySelector('dialog[open]')){
     const items=[...host.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),summary')].filter(el=>el.tabIndex!==-1&&!el.closest('[hidden],dialog:not([open])')&&(!el.closest('details:not([open])')||el.tagName==='SUMMARY'));
     const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
    }
   });
   cleanups.push(()=>{alive=false;if(expanded)document.body.style.overflow=previousOverflow});render(false);
  }
  document.querySelectorAll('[data-explorer]').forEach(host=>{
   if(host.hasAttribute('data-studio')){mountStudio(host);return;}
   const api=root.NASAQ_EXPLORATION,id=host.dataset.explorer,ui=host.dataset.uiLang,T=root.NASAQ_TOKENS;
   if(!api||!T)return;
   let state=api.defaults(id,ui),animations=[],alive=true,current;
   const t=(en,ar)=>ui==='ar'?ar:en,$=s=>host.querySelector(s),preview=$('[data-preview]'),status=$('[data-explore-status]');
   const media=root.matchMedia?.('(prefers-reduced-motion: reduce)');
   const listen=(target,event,fn,options)=>{target.addEventListener(event,fn,options);cleanups.push(()=>target.removeEventListener(event,fn,options))};
   const stop=()=>{animations.forEach(a=>a.cancel());animations=[];preview.querySelectorAll('[data-motion-subject]').forEach(el=>{el.style.animation='none';el.style.removeProperty('animation')})};
   function sourceFromLive(){
    if(['motion','colors'].includes(id))return;
    const copy=preview.cloneNode(true);
    const original=[...preview.querySelectorAll('input,textarea,select')];
    copy.querySelectorAll('input,textarea,select').forEach((el,i)=>{
     const live=original[i];
     if(el.tagName==='TEXTAREA')el.textContent=live.value;
     else if(el.tagName==='SELECT')el.querySelectorAll('option').forEach(o=>o.toggleAttribute('selected',o.value===live.value));
     else if(['checkbox','radio'].includes(el.type))el.toggleAttribute('checked',live.checked);
     else el.setAttribute('value',live.value);
     el.removeAttribute('data-draft');el.removeAttribute('data-explore-mixed');
    });
    copy.querySelectorAll('[data-type-role]').forEach(el=>el.removeAttribute('data-type-role'));
    current.code=`<section class="nq" lang="${state.lang}" dir="${state.lang==='ar'?'rtl':'ltr'}">\n${copy.innerHTML}\n</section>`;
    if(preview.querySelector('input')?.indeterminate)current.code+='\n<script>document.querySelector("input[type=checkbox]").indeterminate = true;</script>';
    if(['tabs','dialog','tooltip'].includes(id))current.code+='\n<!-- Include nasaq.js once for native interaction helpers. -->';
    if(root.NasaqCodeEditor)root.NasaqCodeEditor.update($('[data-source]'),current.code);else $('[data-source]').textContent=current.code;
   }
   function render(){
    stop();current=api.view(id,state,T,ui);
    preview.innerHTML=current.html;preview.lang=current.lang;preview.dir=current.dir;
    preview.dataset.theme=state.theme||'inherit';preview.dataset.typeHighlight=String(!!state.highlight);
    preview.style.cssText=current.css;
    preview.querySelectorAll('[data-explore-mixed]').forEach(input=>input.indeterminate=true);
    // Loading states are still examples; decorative loops are paused until explicitly played.
    preview.querySelectorAll('.nq-spinner,.nq-skeleton').forEach(el=>el.style.animation='none');
    $('[data-inspection]').innerHTML=current.inspection;if(root.NasaqCodeEditor)root.NasaqCodeEditor.update($('[data-source]'),current.code);else $('[data-source]').textContent=current.code;
    if(id==='motion')status.textContent=media?.matches||state.reduce?t('Reduced motion: both examples update instantly.','تقليل الحركة: يتحدث المثالان فورًا.'):t('Ready. Press Play both to compare.','جاهز. اضغط تشغيل المثالين للمقارنة.');
   }
   function changeControl(e){
    const input=e.target.closest('[data-control]');if(!input)return;
    const key=input.dataset.control;
    if(e.type==='input'&&(input.tagName==='SELECT'||input.type==='checkbox'))return;
    if(e.type==='change'&&input.tagName!=='SELECT'&&input.type!=='checkbox')return;
    const previous=state.lang;
    state[key]=input.type==='checkbox'?input.checked:input.type==='range'?Number(input.value):input.value;
    if(key==='lang'){
     state.dir=state.lang==='ar'?'rtl':'ltr';
     // Translate untouched sample copy. A visitor's own words are always preserved.
     const before=api.defaults(id,previous),after=api.defaults(id,state.lang);
     for(const field of ['label','title','body'])if(state[field]===before[field]&&after[field]!==undefined){state[field]=after[field];const c=$(`[data-control="${field}"]`);if(c)c.value=state[field]}
    }
    render();
   }
   function play(){
    stop();
    if(media?.matches||state.reduce){status.textContent=t('Reduced motion: both examples are already in their final state.','تقليل الحركة: يظهر المثالان في حالتهما النهائية.');return;}
    const data=api.tokens(T),distance=data.get('motion.distance.md').value,scale=data.get('motion.scale.pressed');
    const subjects=[...preview.querySelectorAll('[data-motion-subject]')];
    status.textContent=t('Playing A and B once.','تشغيل A وB مرة واحدة.');
    const completions=subjects.map(el=>{
     const duration=data.get('motion.duration.'+el.dataset.duration).value,easing='cubic-bezier('+data.get('motion.easing.'+el.dataset.easing).join(',')+')';
     const frames=state.context==='press'?[{transform:'scale(1)'},{transform:`scale(${scale})`},{transform:'scale(1)'}]:[{opacity:0,transform:`translateY(${distance}px)`},{opacity:1,transform:'translateY(0)'}];
     if(!el.animate)return Promise.resolve();
     const a=el.animate(frames,{duration,easing,iterations:1});animations.push(a);
     return a.finished.catch(()=>{});
    });
    const playing=animations;
    Promise.all(completions).then(()=>{if(alive&&animations===playing){status.textContent=t('Comparison complete. Replay or choose another recipe.','اكتملت المقارنة. أعد التشغيل أو اختر وصفة أخرى.');animations=[]}});
   }
   listen(host,'input',changeControl);listen(host,'change',changeControl);
   listen(host,'input',e=>{
    if(!e.target.closest('[data-preview]'))return;
    const key=e.target.dataset.draft;
    if(key){state[key]=e.target.value;const input=$(`[data-control="${key}"]`);if(input)input.value=state[key]}
    sourceFromLive();
   });
   listen(host,'change',e=>{
    if(!e.target.closest('[data-preview]'))return;
    const el=e.target;
    if(['checkbox','switch'].includes(id)){state.mode=el.checked?(id==='switch'?'on':'checked'):(id==='switch'?'off':'unchecked');$('[data-control="mode"]').value=state.mode}
    if(id==='radio'){state.mode=el.value==='direct'?'first':'second';$('[data-control="mode"]').value=state.mode}
    sourceFromLive();
   });
   listen(host,'click',async e=>{
    if(e.target.closest('[data-reset]')){
     state=api.defaults(id,ui);$('.explore-controls').innerHTML=api.controls(id,state,ui);render();status.textContent=t('Example reset.','أعيد ضبط المثال.');return;
    }
    if(e.target.closest('[data-play]')){play();return;}
    if(e.target.closest('[data-copy-example]')){
     try{await navigator.clipboard.writeText(current.code);if(alive)status.textContent=t('Example source copied.','نُسخ مصدر المثال.');}
     catch{if(!alive)return;$('.explore-inspect').open=true;const code=$('[data-source]');code.parentElement.focus();const selection=root.getSelection?.();if(selection&&document.createRange){const range=document.createRange();range.selectNodeContents(code);selection.removeAllRanges();selection.addRange(range)}status.textContent=t('Select the source below and copy it with your keyboard.','حدد المصدر أدناه وانسخه باستخدام لوحة المفاتيح.');}
     return;
    }
    if(e.target.closest('[data-preview]')){
     if(e.target.closest('button:not([role="tab"]):not([data-open]):not([data-close])'))status.textContent=t('Example action selected. Nothing was sent or saved.','اختير إجراء المثال. لم يُرسل أو يُحفظ شيء.');
     // Native tab handlers run at document level; inspect after they update the DOM.
     Promise.resolve().then(()=>{if(alive)sourceFromLive()});
    }
   });
   listen(preview,'toggle',sourceFromLive,true);
   // The shared dialog helper handles containment/Escape. Explicitly restore its opener.
   listen(preview,'close',()=>{preview.querySelector('[data-open]')?.focus();sourceFromLive()},true);
   const clearTip=e=>{const wrap=e.target.closest('.nq-tooltip-wrap');if(wrap&&!wrap.contains(e.relatedTarget)){const tip=wrap.querySelector('.nq-tooltip');if(tip)tip.style.visibility=''}};
   listen(preview,'focusout',clearTip);listen(preview,'pointerout',clearTip);
   const reduced=()=>{if(id==='motion')render()};
   media?.addEventListener?.('change',reduced);cleanups.push(()=>media?.removeEventListener?.('change',reduced));
   cleanups.push(()=>{alive=false;stop()});render();
  });
  dispose=()=>{cleanups.forEach(fn=>fn());cleanups.length=0};
 };
})(globalThis);
