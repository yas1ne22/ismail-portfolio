/* Focused foundation examples; detailed specifications stay in the disclosure. */
(function(root){
 'use strict';
 const esc=s=>root.NASAQ_EXPLORATION.esc(s),tr=(lang,en,ar)=>lang==='ar'?ar:en;
 const topics={
  colors:['Colors','الألوان','Compare palettes in a working interface.','قارن لوحات الألوان داخل واجهة.'],
  typography:['Typography','الخطوط','Edit the heading and check it in both languages.','عدّل العنوان وراجعه باللغتين.'],
  icons:['Icons','الأيقونات','Choose a family and style to refine in Icon Studio.','اختر عائلة وأسلوبًا لتنقيحهما في استوديو الأيقونات.'],
  effects:['Effects','التأثيرات','Compare surface treatments on the same card.','قارن تأثيرات السطح على البطاقة نفسها.'],
  spacing:['Spacing & grids','المسافات والشبكات','Change the width and spacing to check the layout.','غيّر العرض والمسافات لمراجعة التخطيط.'],
  motion:['Motion','الحركة','Choose an interaction to preview its timing.','اختر تفاعلًا لمعاينة توقيته.'],
  logos:['Logos','الشعارات','Check the logo across languages and backgrounds.','راجع الشعار باللغتين وعلى خلفيات مختلفة.'],
  misc:['Symbols','الرموز','Select a symbol to preview and download.','اختر رمزًا لمعاينته وتنزيله.']
 };
 const symbolNames={arch:['Arch','قوس'],asterisk:['Asterisk','نجمة'],brackets:['Brackets','أقواس'],burst:['Burst','وميض'],compass:['Compass','بوصلة'],connected:['Connected','اتصال'],dots:['Dots','نقاط'],flower:['Flower','زهرة'],focus:['Focus','تركيز'],fold:['Fold','طية'],loop:['Loop','حلقة'],orbit:['Orbit','مدار'],ribbon:['Ribbon','شريط'],seed:['Seed','بذرة'],steps:['Steps','درجات'],wave:['Wave','موجة']};
 const palettes=[['nasaq','Nasaq','نسق','blue'],['mint','Botanical','نباتي','mint'],['coral','Warm','دافئ','coral'],['blue','Blue hour','ساعة زرقاء','blue'],['neutral','Monochrome','أحادي','neutral']];
 const symbols=['arch','asterisk','brackets','burst','compass','connected','dots','flower','focus','fold','loop','orbit','ribbon','seed','steps','wave'];
 const behaviors=[['hover','Hover','التحويم','fast','standard'],['press','Press','الضغط','fast','standard'],['reveal','Reveal','الإظهار','slow','enter'],['dialog','Dialog','النافذة','normal','enter'],['switch','Switch','المفتاح','fast','standard'],['tooltip','Tooltip','التلميح','fast','enter'],['disclosure','Disclosure','التفاصيل','normal','standard'],['loading','Loading','التحميل','loop','linear'],['focus','Focus','التركيز','instant','standard']];
 function initial(id,lang){return {id,lang,palette:'nasaq',theme:'light',context:'editorial',title:tr(lang,'Project notes','ملاحظات المشروع'),family:'travel',style:'outline',effect:'raised',density:'comfortable',width:1024,guides:false,behavior:'reveal',lockup:lang==='ar'?'ar':'en',symbol:'orbit'}}
 function colorRecipe(s,T){
  const api=root.NASAQ_EXPLORATION,data=api.tokens(T),dark=s.theme==='dark';
  let values={},sources={};
  if(s.palette==='nasaq'){
   for(const key of ['background','surface','text','muted','action','on-action','link','border','focus','selected','on-selected']){const name=`semantic.${s.theme}.${key}`;values[key]=data.get(name).hex;sources[key]=name}
  }else{
   const family=s.palette,swatch=n=>data.get(`shade.${family}.${n}`).hex;
   const roles=dark?{background:950,surface:900,text:50,muted:200,action:200,'on-action':950,link:100,border:700,focus:200,selected:800,'on-selected':100}:{background:50,surface:null,text:950,muted:700,action:700,'on-action':null,link:800,border:200,focus:700,selected:100,'on-selected':900};
   for(const [key,n] of Object.entries(roles)){values[key]=n?swatch(n):'#FFFFFF';sources[key]=n?`shade.${family}.${n}`:'color.white'}
  }
  // Every offered recipe checks its actual foreground/background pairs.
  for(const [fg,bg] of [['text','background'],['text','surface'],['muted','surface'],['muted','background'],['on-action','action'],['link','surface'],['on-selected','selected']]){
   if(api.contrast(values[fg],values[bg])<4.5){
    const candidates=['#18202B','#FFFFFF'];values[fg]=candidates.sort((a,b)=>api.contrast(b,values[bg])-api.contrast(a,values[bg]))[0];sources[fg]=values[fg]==='#18202B'?'color.ink':'color.white';
   }
  }
  const pairs=[['text','background'],['text','surface'],['muted','surface'],['muted','background'],['on-action','action'],['link','surface'],['on-selected','selected']];
  return {values,sources,minimum:Math.min(...pairs.map(([a,b])=>api.contrast(values[a],values[b]))),style:Object.entries(values).map(([k,v])=>`--scene-${k}:${v}`).join(';')};
 }
 function choices(key,items,s,{swatches=false,T}={}){
  const lang=s.lang,t=(en,ar)=>tr(lang,en,ar);
  return `<div class="fnd-choices" role="group" aria-label="${esc(({palette:t('Palette','لوحة الألوان'),theme:t('Appearance','المظهر'),context:t('Example','المثال'),lang:t('Language','اللغة'),family:t('Icon family','عائلة الأيقونات'),style:t('Style','الأسلوب'),effect:t('Surface treatment','تأثير السطح'),density:t('Spacing','المسافات'),behavior:t('Interaction','التفاعل'),lockup:t('Logo','الشعار')})[key])}">${items.map(([value,en,ar,family])=>`<button type="button" data-foundation-key="${key}" data-foundation-value="${value}" aria-pressed="${s[key]===value}"${swatches?` style="--choice-color:${T.shade[family]['500'].$value.hex}"`:''}>${swatches?'<span class="fnd-choice-swatch" aria-hidden="true"></span>':''}<span>${tr(lang,en,ar)}</span></button>`).join('')}</div>`;
 }
 function miniWorkspace(s,{motion=false}={}){
  const t=(en,ar)=>tr(s.lang,en,ar);
  return `<div class="fnd-product"><header class="fnd-product-top"><h2>${t('Project notes','ملاحظات المشروع')}</h2><span class="fnd-product-tag">${t('Draft','مسودة')}</span></header><div class="fnd-product-main"><article class="fnd-product-feature" data-motion-target="reveal"><h3>${t('Release checklist','قائمة مراجعة الإصدار')}</h3><p>${t('Review Arabic labels and keyboard navigation.','راجع التسميات العربية والتنقل بلوحة المفاتيح.')}</p></article><div class="fnd-product-bottom"><button type="button" class="fnd-product-action" data-motion-target="action" data-workspace-save>${t('Save changes','حفظ التغييرات')}</button>${motion?`<span class="fnd-product-switch" aria-label="${t('Switch animation','حركة المفتاح')}"><i data-motion-target="switch"></i></span>`:''}</div></div></div>`;
 }
 function renderColors(s,T){
  const t=(en,ar)=>tr(s.lang,en,ar),recipe=colorRecipe(s,T);
  const roles=[['background','Canvas','الخلفية'],['surface','Surface','السطح'],['action','Action','الإجراء'],['text','Text','النص']];
  return `<div class="fnd-color-world" data-scene-theme="${s.theme}" style="${recipe.style}"><div class="fnd-color-workspace">${miniWorkspace(s)}</div><dl class="fnd-color-roles">${roles.map(([role,en,ar])=>`<div><i data-color-swatch="${role}" style="background:${recipe.values[role]}" aria-hidden="true"></i><dt>${t(en,ar)}</dt><dd data-color-value="${role}" dir="ltr">${recipe.values[role]}</dd></div>`).join('')}</dl></div>`;
 }
 function renderType(s,T){
  const t=(en,ar)=>tr(s.lang,en,ar),role=s.context==='editorial'?'display-sm':s.context==='product'?'heading-xl':'heading-lg',group=s.lang==='ar'?'type':'type-en',v=root.NASAQ_EXPLORATION.tokens(T).get(group+'.'+role);
  const title=`<h2 class="fnd-type-title nq-type-${role}" contenteditable="plaintext-only" role="textbox" aria-multiline="true" aria-label="${t('Edit the heading','عدّل العنوان')}" spellcheck="false" data-placeholder="${t('Write a heading','اكتب عنوانًا')}" data-foundation-headline>${esc(s.title)}</h2>`;
  return `<div class="fnd-type-world nq" lang="${s.lang}" dir="${s.lang==='ar'?'rtl':'ltr'}"><div class="fnd-type-sample">${title}${s.context==='numbers'?`<div class="fnd-type-data-grid">${[['12',t('Tasks','مهام')],['8',t('Completed','مكتملة')],['4',t('Remaining','متبقية')]].map(([n,l])=>`<div><b class="nq-type-display-sm" dir="ltr">${n}</b><span>${l}</span></div>`).join('')}</div>`:`<p class="nq-type-body-lg">${t('Review Arabic labels before the next release.','راجع التسميات العربية قبل الإصدار القادم.')}</p>`}</div><div class="fnd-type-spec"><span>${v.fontFamily[0]} · ${v.fontSize.value}px · ${v.fontWeight}</span></div></div>`;
 }
 function renderIcons(s){
  const studio=root.NASAQ_ICON_STUDIO,set=studio.sets[s.family];
  return `<div class="fnd-icon-world"><div class="fnd-icon-set">${set.icons.map(ic=>`<div>${studio.svg(ic,{style:s.style,size:40,weight:1.7})}<span>${ic[s.lang==='ar'?1:2]}</span></div>`).join('')}</div></div>`;
 }
 function renderEffects(s){
  const t=(en,ar)=>tr(s.lang,en,ar);
  return `<div class="fnd-depth-world"><article class="fnd-depth-front nq-card nq-effect-${s.effect==='focus'?'flat':s.effect}" data-effect="${s.effect}"><h2>${t('Release checklist','قائمة مراجعة الإصدار')}</h2><p>${t('Review Arabic labels and keyboard navigation.','راجع التسميات العربية والتنقل بلوحة المفاتيح.')}</p><button type="button" class="nq-button${s.effect==='focus'?' state-focus':''}" data-depth-action>${t('Save changes','حفظ التغييرات')}</button></article></div>`;
 }
 function renderSpacing(s){
  const t=(en,ar)=>tr(s.lang,en,ar),density={compact:[16,12],comfortable:[24,24],roomy:[48,32]}[s.density];
  return `<div class="fnd-layout-world"><div class="fnd-layout-bay"><div class="fnd-layout-frame" data-layout-frame style="--layout-width:${s.width}px;--layout-pad:${density[0]}px;--layout-gap:${density[1]}px" data-guides="${s.guides}"><div class="fnd-layout-screen"><h2>${t('Projects','المشاريع')}</h2><div class="fnd-layout-cards">${[[t('Website refresh','تحديث الموقع'),6],[t('Arabic content','المحتوى العربي'),4],[t('Component review','مراجعة المكونات'),8]].map(([label,n])=>`<article><h3>${label}</h3><p>${s.lang==='ar'?n+' مهام':n+' tasks'}</p></article>`).join('')}</div><div class="fnd-layout-grid-overlay" aria-hidden="true"></div></div><span class="fnd-resize-edge" aria-hidden="true">⋮</span></div></div><div class="fnd-layout-contract"><code>padding: ${density[0]}px</code><code>gap: ${density[1]}px</code><span data-layout-columns></span></div></div>`;
 }
 function renderMotion(s){
  const t=(en,ar)=>tr(s.lang,en,ar),behavior=behaviors.find(b=>b[0]===s.behavior);
  const extra=`<div class="fnd-motion-tooltip" data-motion-target="tooltip">${t('Save your changes','احفظ تغييراتك')}</div><div class="fnd-motion-disclosure" data-motion-target="disclosure"><span>${t('Project details','تفاصيل المشروع')}</span><i aria-hidden="true">⌄</i></div><div class="fnd-motion-pending" data-motion-target="loading"><span></span>${t('Loading notes…','جارٍ تحميل الملاحظات…')}</div><div class="fnd-motion-dialog" data-motion-target="dialog"><h3>${t('Start a new project?','بدء مشروع جديد؟')}</h3><p>${t('Your current notes will be kept.','ستُحفظ ملاحظاتك الحالية.')}</p><b>${t('Create project','إنشاء مشروع')}</b></div>`;
  return `<div class="fnd-motion-world" data-behavior="${s.behavior}"><div class="fnd-motion-product">${miniWorkspace(s,{motion:true})}${extra}</div></div>`;
 }
 function renderLogo(s){
  const t=(en,ar)=>tr(s.lang,en,ar);
  return `<div class="fnd-logo-world" data-logo-theme="${s.theme}"><div class="fnd-logo-lockup" tabindex="0" aria-label="${t('Logo. Focus to show clear space.','الشعار. ركّز لإظهار المساحة الآمنة.')}" ><div class="fnd-logo-mark"><img src="assets/nasaq-mark.svg" width="120" height="120" alt=""><div class="fnd-logo-guides" aria-hidden="true"><span>¼ x</span></div></div>${s.lockup==='mark'?'':`<span class="fnd-logo-word" lang="${s.lockup}" dir="${s.lockup==='ar'?'rtl':'ltr'}">${s.lockup==='ar'?'نسق':'Nasaq'}</span>`}</div><a class="fnd-download" href="${s.lockup==='en'?'downloads/brand-kit/wordmark-en.svg':'assets/'+(s.lockup==='mark'?'nasaq-mark':'nasaq-lockup')+'.svg'}" download>${t('Download SVG','تنزيل SVG')}</a></div>`;
 }
 function renderSymbols(s){
  const t=(en,ar)=>tr(s.lang,en,ar);
  return `<div class="fnd-symbol-world"><img class="fnd-symbol-preview" src="assets/misc-${s.symbol}.svg" alt="${tr(s.lang,...symbolNames[s.symbol])}" width="112" height="112"><a class="fnd-download" href="assets/misc-${s.symbol}.svg" download="nasaq-${s.symbol}.svg">${t('Download SVG','تنزيل SVG')}</a></div>`;
 }
 function stage(s,T){return ({colors:renderColors,typography:renderType,icons:renderIcons,effects:renderEffects,spacing:renderSpacing,motion:renderMotion,logos:renderLogo,misc:renderSymbols})[s.id](s,T)}
 function toolbar(s,T){
  const t=(en,ar)=>tr(s.lang,en,ar);
  if(s.id==='colors')return choices('palette',palettes,s,{swatches:true,T})+choices('theme',[['light','Light','فاتح'],['dark','Dark','داكن']],s);
  if(s.id==='typography')return choices('context',[['editorial','Heading','عنوان'],['product','Interface','واجهة'],['numbers','Data','بيانات']],s)+choices('lang',[['en','English','English'],['ar','العربية','العربية']],s);
  if(s.id==='icons')return choices('family',Object.entries(root.NASAQ_ICON_STUDIO.sets).map(([key,set])=>[key,set.name[1],set.name[0]]),s)+choices('style',[['outline','Outline','خطي'],['duotone','Two tone','ثنائي اللون']],s);
  if(s.id==='effects')return choices('effect',[['flat','Flat','مسطح'],['raised','Raised','مرتفع'],['floating','Floating','عائم'],['inset','Inset','غائر'],['wash','Wash','لوني'],['focus','Focus','تركيز']],s);
  if(s.id==='spacing')return choices('density',[['compact','Compact','مكثف'],['comfortable','Comfortable','مريح'],['roomy','Roomy','واسع']],s)+`<label class="fnd-width-control"><span>${t('Width','العرض')} <output data-layout-measure dir="ltr">${s.width}px</output></span><input type="range" min="320" max="1100" step="1" value="${s.width}" data-foundation-width aria-label="${t('Preview width in pixels','عرض المعاينة بالبكسل')}"></label><button type="button" class="fnd-guide-toggle" data-foundation-guides aria-pressed="false">${t('Show grid','أظهر الشبكة')}</button>`;
  if(s.id==='motion')return choices('behavior',behaviors,s);
  if(s.id==='logos')return choices('lockup',[['en','English','English'],['ar','العربية','العربية'],['mark','Symbol','الرمز']],s)+choices('theme',[['light','Light','فاتح'],['dark','Dark','داكن']],s);
  return `<div class="fnd-symbol-picker" role="group" aria-label="${t('Choose a symbol','اختر رمزًا')}">${symbols.map(name=>`<button type="button" data-foundation-key="symbol" data-foundation-value="${name}" aria-label="${tr(s.lang,...symbolNames[name])}" aria-pressed="${s.symbol===name}"><img src="assets/misc-${name}.svg" alt="" width="28" height="28"><span>${tr(s.lang,...symbolNames[name])}</span></button>`).join('')}</div>`;
 }
 function exportRecipe(s,T){
  const data=root.NASAQ_EXPLORATION.tokens(T);
  if(s.id==='colors'){const recipe=colorRecipe(s,T);return {filename:'nasaq-'+s.palette+'-'+s.theme+'.json',type:'application/json',text:JSON.stringify({name:s.palette,mode:s.theme,description:'Exploration recipe; original Nasaq tokens remain unchanged.',values:recipe.values,sources:recipe.sources},null,2)}}
  if(s.id==='typography'){const role=s.context==='editorial'?'display-sm':s.context==='product'?'heading-xl':'heading-lg',key=(s.lang==='ar'?'type.':'type-en.')+role;return {text:JSON.stringify({language:s.lang,direction:s.lang==='ar'?'rtl':'ltr',token:key,value:data.get(key),headline:s.title},null,2)}}
  if(s.id==='effects')return {text:s.effect==='focus'?'outline: var(--nq-effect-focus-width) solid var(--nq-focus);\noutline-offset: var(--nq-effect-focus-offset);':s.effect==='raised'||s.effect==='floating'?`box-shadow: var(--nq-effect-${s.effect});`:`<!-- Use the native Nasaq surface class. -->\n<article class="nq-card nq-effect-${s.effect}">…</article>`};
  if(s.id==='spacing'){const [pad,gap]={compact:[16,12],comfortable:[24,24],roomy:[48,32]}[s.density];return {text:`.layout-viewport { container-type: inline-size; }\n.layout {\n padding-inline: var(--nq-space-${pad});\n display: grid;\n grid-template-columns: repeat(12, minmax(0, 1fr));\n gap: var(--nq-space-${gap});\n}\n/* Use a parent container for these container queries. */\n@container (max-width: 1023px) { .layout { grid-template-columns: repeat(8, minmax(0, 1fr)); } }\n@container (max-width: 640px) { .layout { grid-template-columns: repeat(4, minmax(0, 1fr)); } }`}}
  return {text:''};
 }
 function render(id,lang,T){
  const s=initial(id,lang),topic=topics[id],t=(en,ar)=>tr(lang,en,ar),canExport=['colors','typography','effects','spacing'].includes(id);
  const action=id==='icons'?`<a class="fnd-header-action" href="#icon-studio" data-foundation-handoff>${t('Open in Icon Studio','افتح في استوديو الأيقونات')}</a>`:canExport?`<button type="button" class="fnd-header-action" data-foundation-export>${id==='colors'?t('Download theme','تنزيل المظهر'):id==='typography'?t('Copy type settings','نسخ إعدادات الخط'):t('Copy code','نسخ الكود')}</button>`:'';
  return `<div class="foundation-experience" data-foundation="${id}" data-language="${lang}"><header class="fnd-header"><div><h1>${t(topic[0],topic[1])}</h1><p>${t(topic[2],topic[3])}</p></div>${action}</header><div class="fnd-toolbar" data-foundation-toolbar>${toolbar(s,T)}</div><div class="fnd-stage" data-foundation-stage>${stage(s,T)}</div><p class="sr-only" role="status" data-foundation-status></p><details class="fnd-export-fallback" hidden><summary>${t('Copy manually','نسخ يدوي')}</summary><pre tabindex="0"></pre></details></div>`;
 }
 function extend({lang,T,renderers}){
  for(const id of Object.keys(topics)){
   const original=renderers[id];if(!original)continue;
   renderers[id]=(options={})=>{
    if(options.artwork===false||options.exploration===false||options.foundations===false)return original(options);
    const decorate=html=>{
     const end=html.indexOf('</header>')+9,reference=html.slice(end).replace(/<figure class="nasaq-visual[\s\S]*?<\/figure>/g,'');
     return render(id,lang,T)+`<section class="section foundation-reference" id="foundation-reference"><details class="nq-reference" open><summary>${tr(lang,id==='icons'?'Icon library & specifications':'Specifications',id==='icons'?'مكتبة الأيقونات والمواصفات':'المواصفات')}</summary>${reference}${id==='colors'&&root.NASAQ_EXPLORATION.interactionRoles?root.NASAQ_EXPLORATION.interactionRoles(lang,T):''}</details></section>`;
    };
    const raw=original({...options,artwork:false,exploration:false});return typeof raw==='string'?decorate(raw):raw.then(decorate);
   };
  }
 }
 root.NASAQ_FOUNDATIONS={topics,palettes,symbols,behaviors,initial,colorRecipe,stage,toolbar,render,extend,exportRecipe};
})(globalThis);
