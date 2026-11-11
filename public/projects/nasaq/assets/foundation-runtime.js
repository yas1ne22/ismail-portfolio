(function(root){
 'use strict';
 let dispose=()=>{};
 root.mountNasaqFoundations=function(){
  dispose();
  const cleanups=[],api=root.NASAQ_FOUNDATIONS,T=root.NASAQ_TOKENS;
  if(!api||!T)return;
  document.querySelectorAll('[data-foundation]').forEach(host=>{
   const id=host.dataset.foundation,ui=host.dataset.language,t=(en,ar)=>ui==='ar'?ar:en;
   let state=api.initial(id,ui),alive=true,animations=[],observer=null,resize=null;
   const $=s=>host.querySelector(s),stage=$('[data-foundation-stage]'),status=$('[data-foundation-status]'),media=root.matchMedia?.('(prefers-reduced-motion: reduce)');
   const urls=new Set(),timers=new Set();
   const listen=(target,event,fn,options)=>{target.addEventListener(event,fn,options);cleanups.push(()=>target.removeEventListener(event,fn,options))};
   const stop=()=>{animations.forEach(a=>a.cancel());animations=[]};
   function selected(){host.querySelectorAll('[data-foundation-key]').forEach(el=>el.setAttribute('aria-pressed',String(state[el.dataset.foundationKey]===el.dataset.foundationValue)))}
   function measure(){
    const frame=$('[data-layout-frame]');if(!frame)return;
    const actual=Math.round(frame.getBoundingClientRect?.().width||state.width),columns=actual<=640?4:actual<1024?8:12;
    $('[data-layout-measure]').textContent=actual+'px';$('[data-layout-columns]').textContent=columns+' '+t('columns','أعمدة');
   }
   function observe(){observer?.disconnect();if(id==='spacing'){measure();if(root.ResizeObserver){observer=new root.ResizeObserver(measure);observer.observe($('[data-layout-frame]'))}}}
   function setWidth(value){state.width=Math.max(320,Math.min(1100,Number(value)||320));$('[data-layout-frame]').style.setProperty('--layout-width',state.width+'px');$('[data-foundation-width]').value=state.width;measure()}
   function motion(){
    stop();const world=$('.fnd-motion-world');world.dataset.active='true';
    if(media?.matches)return;
    const data=root.NASAQ_EXPLORATION.tokens(T),behavior=api.behaviors.find(b=>b[0]===state.behavior),duration=data.get('motion.duration.'+behavior[3]).value,easing='cubic-bezier('+data.get('motion.easing.'+behavior[4]).join(',')+')',distance=data.get('motion.distance.md').value;
    const target=name=>stage.querySelector(`[data-motion-target="${name}"]`),animate=(el,frames)=>{if(el?.animate&&duration>0)animations.push(el.animate(frames,{duration,easing,fill:'forwards',iterations:1}))};
    if(state.behavior==='hover'){const mode=document.documentElement.dataset.theme==='dark'?'dark':'light',base='semantic.'+mode+'.';animate(target('action'),[{backgroundColor:data.get(base+'action').hex},{backgroundColor:data.get(base+'action-hover').hex}])}
    else if(state.behavior==='press')animate(target('action'),[{transform:'scale(1)'},{transform:'scale('+data.get('motion.scale.pressed')+')'},{transform:'scale(1)'}]);
    else if(state.behavior==='switch')animate(target('switch'),[{transform:'translateX(0)'},{transform:`translateX(${ui==='ar'?-22:22}px)`}]);
    else if(state.behavior==='loading')animate(target('loading').querySelector('span'),[{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}]);
    else if(state.behavior==='disclosure')animate(target('disclosure').querySelector('i'),[{transform:'rotate(0deg)'},{transform:'rotate(180deg)'}]);
    else if(state.behavior!=='focus')animate(target(state.behavior),[{opacity:0,transform:`translateY(${distance}px)`},{opacity:1,transform:'translateY(0)'}]);
   }
   function update(key,value){
    if(state[key]===value){if(id==='motion')motion();return;}
    const before={...state};state[key]=value;stop();
    if(id==='colors'){
     const recipe=api.colorRecipe(state,T),world=$('.fnd-color-world');
     world.style.cssText=recipe.style;world.dataset.sceneTheme=state.theme;
     host.querySelectorAll('[data-color-swatch]').forEach(el=>el.style.background=recipe.values[el.dataset.colorSwatch]);
     host.querySelectorAll('[data-color-value]').forEach(el=>el.textContent=recipe.values[el.dataset.colorValue]);
    }else if(id==='effects'){
     const front=$('.fnd-depth-front');['flat','raised','floating','inset','wash'].forEach(n=>front.classList.remove('nq-effect-'+n));front.classList.add('nq-effect-'+(value==='focus'?'flat':value));front.dataset.effect=value;
     $('[data-depth-action]').classList.toggle('state-focus',value==='focus');$('.fnd-depth-world').dataset.effect=value;
    }else if(id==='spacing'&&key==='density'){
     const [padding,gap]={compact:[16,12],comfortable:[24,24],roomy:[48,32]}[value],frame=$('[data-layout-frame]');frame.style.setProperty('--layout-pad',padding+'px');frame.style.setProperty('--layout-gap',gap+'px');
     const codes=stage.querySelectorAll('.fnd-layout-contract code');codes[0].textContent='padding: '+padding+'px';codes[1].textContent='gap: '+gap+'px';
    }else if(id==='motion'){
     $('.fnd-motion-world').dataset.behavior=value;motion();
    }else{
     if(id==='typography'&&key==='lang'&&state.title===api.initial(id,before.lang).title)state.title=api.initial(id,value).title;
     stage.innerHTML=api.stage(state,T);observe();
    }
    selected();
   }
   function choose(e){
    const button=e.target.closest('[data-foundation-key]');if(!button||!host.contains(button))return;
    if(e.type==='pointerover'&&button.contains(e.relatedTarget))return;
    update(button.dataset.foundationKey,button.dataset.foundationValue);
   }
   listen(host,'pointerover',choose);listen(host,'focusin',choose);
   listen(host,'pointerout',e=>{
    if(id!=='motion')return;const button=e.target.closest('[data-foundation-key]');if(button&&!button.contains(e.relatedTarget)&&!button.contains(document.activeElement)){stop();$('.fnd-motion-world').dataset.active='false'}
   });
   listen(host,'focusout',e=>{if(id==='motion'&&e.target.closest('[data-foundation-key]')&&!host.querySelector('.fnd-toolbar')?.contains(e.relatedTarget)){stop();$('.fnd-motion-world').dataset.active='false'}});
   listen(host,'input',e=>{
    if(e.target.hasAttribute('data-foundation-width')){setWidth(e.target.value);return;}
    if(e.target.hasAttribute('data-foundation-headline')){
     const text=e.target.textContent.slice(0,140);if(e.target.textContent.length>140)e.target.textContent=text;state.title=text;
    }
   });
   listen(host,'paste',e=>{
    const editor=e.target.closest('[data-foundation-headline]');if(!editor)return;
    const text=e.clipboardData?.getData('text/plain');if(text===undefined)return;
    e.preventDefault();
    const selection=root.getSelection?.();
    if(selection?.rangeCount){const range=selection.getRangeAt(0);range.deleteContents();const node=document.createTextNode(text.slice(0,140));range.insertNode(node);range.setStartAfter(node);range.collapse(true);selection.removeAllRanges();selection.addRange(range)}
    else editor.textContent=text.slice(0,140);
    state.title=editor.textContent.slice(0,140);if(editor.textContent.length>140)editor.textContent=state.title;
   });
   listen(host,'click',async e=>{
    const choice=e.target.closest('[data-foundation-key]');if(choice){update(choice.dataset.foundationKey,choice.dataset.foundationValue);return;}
    if(e.target.closest('[data-foundation-guides]')){state.guides=!state.guides;$('[data-layout-frame]').dataset.guides=String(state.guides);$('[data-foundation-guides]').setAttribute('aria-pressed',String(state.guides))}
    if(e.target.closest('[data-foundation-handoff]'))root.NASAQ_ICON_STUDIO_START={set:state.family,style:state.style};
    if(e.target.closest('[data-depth-action]')){const button=$('[data-depth-action]');button.textContent=t('Saved','حُفظت');button.setAttribute('aria-pressed','true');status.textContent=t('Changes saved in this preview.','حُفظت التغييرات في هذه المعاينة.');}
    if(e.target.closest('[data-workspace-save]')){const button=e.target.closest('[data-workspace-save]');button.textContent=t('Saved','حُفظت');status.textContent=t('Changes saved in this preview.','حُفظت التغييرات في هذه المعاينة.');}
    if(e.target.closest('[data-foundation-export]')){
     const recipe=api.exportRecipe(state,T);
     if(recipe.filename){
      const url=URL.createObjectURL(new Blob([recipe.text],{type:recipe.type}));urls.add(url);const link=document.createElement('a');link.href=url;link.download=recipe.filename;link.click();
      const timer=setTimeout(()=>{URL.revokeObjectURL(url);urls.delete(url);timers.delete(timer)},1000);timers.add(timer);status.textContent=t('Theme downloaded.','نُزّل المظهر.');
     }else try{await navigator.clipboard.writeText(recipe.text);if(alive)status.textContent=t('Recipe copied.','نُسخت الوصفة.')}
     catch{if(!alive)return;const fallback=$('.fnd-export-fallback');fallback.hidden=false;fallback.open=true;fallback.querySelector('pre').textContent=recipe.text;fallback.querySelector('pre').focus();status.textContent=t('Select the visible recipe and copy it.','حدد الوصفة الظاهرة وانسخها.')}
    }
   });
   listen(host,'pointerdown',e=>{
    if(e.target.closest('.fnd-resize-edge')){const frame=$('[data-layout-frame]');resize={x:e.clientX,width:frame.getBoundingClientRect().width};host.setPointerCapture?.(e.pointerId);e.preventDefault()}
   });
   listen(host,'pointermove',e=>{if(resize)setWidth(resize.width+(e.clientX-resize.x)*(ui==='ar'?-1:1));});
   listen(host,'pointerup',()=>{resize=null});listen(host,'pointercancel',()=>{resize=null});
   const reduce=()=>stop();
   media?.addEventListener?.('change',reduce);observe();
   cleanups.push(()=>{alive=false;stop();observer?.disconnect();media?.removeEventListener?.('change',reduce);timers.forEach(clearTimeout);urls.forEach(url=>URL.revokeObjectURL(url))});
  });
  dispose=()=>{cleanups.forEach(fn=>fn());cleanups.length=0};
 };
})(globalThis);
