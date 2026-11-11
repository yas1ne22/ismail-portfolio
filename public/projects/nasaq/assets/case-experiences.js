/* Case-study experiences: local examples, published tokens and progressive chapters. */
(()=>{
 'use strict';
 if(!document.body.hasAttribute('data-visual-case'))return;
 const ar=document.documentElement.lang==='ar',t=(a,b)=>ar?a:b;
 const $=selector=>document.querySelector(selector);
 const $$=selector=>[...document.querySelectorAll(selector)];
 const workspace=$('[data-direction-workspace]'),form=$('[data-direction-form]');
 let demoLanguage=workspace.lang,saved=false;
 const words={
  ar:{workspace:'مساحة العمل',settings:'الإعدادات',example:'مثال تفاعلي',title:'مساحتك، على طريقتك.',intro:'تفاصيل واضحة، بأي لغة تختارها.',name:'الاسم',email:'البريد الإلكتروني',shared:'تتم المشاركة مع',save:'حفظ التغييرات'},
  en:{workspace:'Workspace',settings:'Settings',example:'Interactive example',title:'Your space, your way.',intro:'Clear details, in the language you choose.',name:'Name',email:'Email address',shared:'Shared with',save:'Save changes'}
 };
 function paintDirection(language){
  demoLanguage=language;const rtl=language==='ar';
  workspace.lang=language;workspace.dir=rtl?'rtl':'ltr';
  workspace.querySelectorAll('[data-demo-text]').forEach(node=>{node.textContent=words[language][node.dataset.demoText]});
  $$('[data-case-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.caseLanguage===language)));
  $('[data-direction-code]').textContent=`lang="${language}" dir="${rtl?'rtl':'ltr'}"`;
  $('[data-direction-caption]').textContent=rtl?t('ترتيب القراءة من اليمين إلى اليسار. يحتفظ البريد باتجاهه المحلي.','Right-to-left reading order. Email keeps its own local direction.'):t('ترتيب القراءة من اليسار إلى اليمين. يحتفظ البريد باتجاهه المحلي.','Left-to-right reading order. Email keeps its own local direction.');
  $('[data-direction-status]').textContent=saved?(rtl?'حالة المثال: تم الحفظ.':'Example state: changes saved.'):(rtl?'البيانات التجريبية تبقى في هذه الصفحة.':'Example data stays on this page.');
 }
 $$('[data-case-language]').forEach(button=>button.addEventListener('click',()=>paintDirection(button.dataset.caseLanguage)));
 form.addEventListener('submit',event=>{event.preventDefault();saved=true;paintDirection(demoLanguage)});
 form.addEventListener('input',()=>{if(saved){saved=false;paintDirection(demoLanguage)}});
 paintDirection(demoLanguage);
 const lab=$('[data-token-lab]'),preview=$('.case-token-preview');
 let theme='light',step='semantic',selected=false;
 function paintTokens(){
  const values=globalThis.NASAQ_CASE_TOKENS[theme];
  for(const [key,value] of Object.entries(values))preview.style.setProperty(`--nq-${key==='background'?'bg':key}`,value);
  // Rebind component aliases locally so a light example also works inside a dark page.
  preview.style.setProperty('--nq-component-button-background','var(--nq-action)');
  preview.style.setProperty('--nq-component-button-text','var(--nq-on-action)');
  preview.dataset.theme=theme;
  lab.querySelectorAll('[data-token-theme]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.tokenTheme===theme)));
  lab.querySelectorAll('[data-token-step]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.tokenStep===step)));
  const path=`semantic.${theme}.action`,alias=`component.button.${theme}.background`;
  $('[data-token-path]').textContent=path;
  $('[data-token-alias]').textContent=alias;
  $('[data-token-reference]').textContent=`{${path}}`;
  $('[data-token-value]').textContent=values.action;
  $('[data-token-swatch]').style.background=values.action;
  $('[data-token-inspector-path]').textContent=step==='semantic'?`${path} = ${values.action}`:step==='alias'?`${alias}  {${path}}`:'<button class="nq-button">';
  $('[data-token-explanation]').textContent=({semantic:t('الدور يصف الغرض من اللون. لكل مظهر قيمته الخاصة.','The role describes the purpose of the color. Each appearance resolves its own value.'),alias:t('مرجع المكوّن يشير إلى الدور الدلالي؛ لا ينسخ قيمة اللون.','The component alias points to the semantic role, keeping one source for the color.'),interface:t('زر HTML أصلي: انتقل إليه بلوحة المفاتيح وجرّب التركيز والضغط.','A native HTML button: use your keyboard to try focus and activation.')})[step];
  $('[data-token-action]').setAttribute('aria-pressed',String(selected));
  $('[data-token-action-label]').textContent=selected?t('تم الحفظ ✓','Saved to workspace ✓'):t('حفظ في المساحة','Save to workspace');
  $('[data-token-state]').textContent=selected?t('حالة مثال محلية. اضغط مرة أخرى لإعادة الضبط.','Local example state. Press again to reset.'):t('جرّب الزر أو انتقل إليه بلوحة المفاتيح.','Try the button, or reach it with your keyboard.');
 }
 lab.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.tokenTheme)theme=button.dataset.tokenTheme;
  if(button.dataset.tokenStep)step=button.dataset.tokenStep;
  if(button.hasAttribute('data-token-action')){selected=!selected;step='interface'}
  paintTokens();
 });
 paintTokens();
 globalThis.NASAQ_ICON_STUDIO_START={set:'workspace',style:'outline'};
 globalThis.NASAQ_ICON_STUDIO.mount();
 // Original section URLs remain useful even when the supporting text is collapsed.
 function revealHash(){
  const id=decodeURIComponent(location.hash.slice(1));if(!id)return;
  const target=document.getElementById(id);if(!target)return;
  let parent=target.parentElement,opened=false;
  while(parent){if(parent.tagName==='DETAILS'&&!parent.open){parent.open=true;opened=true}parent=parent.parentElement}
  if(opened)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'auto'}));
 }
 window.addEventListener('hashchange',revealHash);revealHash();
 const chapters=$$('.case-chapter'),links=$$('.case-contents>a'),progress=$('.case-reading-progress>span');
 let scheduled=false;
 function updateReading(){
  scheduled=false;let active=chapters[0];
  for(const chapter of chapters)if(chapter.getBoundingClientRect().top<=200)active=chapter;
  links.forEach(link=>{if(link.hash===`#${active.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
  const start=chapters[0].offsetTop,end=chapters[chapters.length-1].offsetTop+chapters[chapters.length-1].offsetHeight-window.innerHeight;
  const amount=Math.max(0,Math.min(1,(window.scrollY-start)/Math.max(1,end-start)));
  progress.style.width=`${Math.round(amount*100)}%`;
 }
 const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateReading)}};
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
 document.addEventListener('toggle',schedule,true);updateReading();
})();
