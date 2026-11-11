(function(root){
 const destinations={case:{en:'case-study-en.html',ar:'case-study.html'},system:{en:'en.html',ar:'index.html'}};
 const anchors={icons:{case:'icon-studio',system:'icon-studio'},decisions:{case:'decisions',system:'project'},components:{case:'trace',system:'buttons'},language:{case:'language',system:'quality'},beginning:{case:'brief',system:'overview'}};
 function destination(language,format,focus,base){const lang=language==='ar'?'ar':'en',type=format==='case'?'case':'system',start=anchors[focus]||anchors.beginning;return new URL(destinations[type][lang]+'#'+start[type],base).href;}
 // User requirement: exactly two questions in both languages. See docs/nasaq-entry-decision.md.
 function mount(host,{base=new URL('.',location.href).href,onClose=()=>{},modal=false}={}){
  let step=0,language='en';
  const t=(a,b)=>language==='ar'?a:b;
  function render(focus=true){
   host.lang=language;host.dir=language==='ar'?'rtl':'ltr';
   const title=step===0?t('اختر اللغة','Choose your language'):t('ماذا تود استكشافه؟','What would you like to explore?');
   const options=step===0?`<button type="button" data-language="en" lang="en" dir="ltr">English</button><button type="button" data-language="ar" lang="ar" dir="rtl">العربية</button>`:[['system','نظام التصميم','Design system'],['case','دراسة المشروع','Case study']].map(([format,a,e])=>`<a target="_top" data-format="${format}" data-final href="${destination(language,format,'beginning',base)}">${t(a,e)}</a>`).join('');
   host.innerHTML=`${modal?`<button class="nasaq-onboarding-close" type="button" data-onboarding-close aria-label="${t('إغلاق','Close')}">×</button>`:''}<div class="nasaq-onboarding-brand"><img src="${new URL('assets/nasaq-mark.svg',base).href}" width="32" height="32" alt=""><span>${t('نسق','Nasaq')}</span></div><p class="nasaq-onboarding-count" aria-label="${t('الخطوة','Step')} ${step+1} ${t('من','of')} 2">${step+1} / 2</p><h2 tabindex="-1" id="nasaq-language-title">${title}</h2><p id="nasaq-language-description" class="nasaq-onboarding-description sr-only">${t('اختر اللغة، ثم افتح نظام التصميم أو دراسة المشروع.','Choose your language, then open the design system or case study.')}</p><div class="nasaq-onboarding-options">${options}</div><div class="nasaq-onboarding-footer">${step?`<button type="button" data-onboarding-back>${t('رجوع','Back')}</button>`:'<span></span>'}</div>`;
   if(focus)host.querySelector('h2').focus();
  }
  host.addEventListener('click',event=>{
   const target=event.target.closest('button,a');if(!target)return;
   if(target.hasAttribute('data-onboarding-close'))onClose();
   else if(target.hasAttribute('data-onboarding-back')){step=0;render();}
   else if(target.dataset.language){language=target.dataset.language;step=1;render();}
   else if(target.hasAttribute('data-final')){try{localStorage.setItem('nasaq-language',language)}catch{}}
  });
  render(false);
  return {reset(){step=0;language='en';render(false)},focus(){host.querySelector('h2').focus()}};
 }
 root.NasaqOnboarding={mount,destination};
})(globalThis);
