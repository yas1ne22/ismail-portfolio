/* Icon Studio: an explorable design workflow with authored SVG examples.
   No model requests, API credentials, billing, or invented generation status. */
(function(root){
 'use strict';
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const sets={
  workspace:{name:['مساحة عمل','Workspace'],brief:['عائلة من ست أيقونات لمساحة عمل معرفية: مستند، مجلد، بحث، محادثة، أفكار، وترابط.','A family of six icons for a knowledge workspace: document, folder, search, conversation, ideas, and connections.'],icons:[
   ['document','مستند','Document','<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'],
   ['folder','مجلد','Folder','<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M3 9h18"/>'],
   ['search','بحث','Search','<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5M8 10.5h5"/>'],
   ['conversation','محادثة','Conversation','<path d="M21 11a8 8 0 0 1-8 8H8l-5 3V11a9 9 0 0 1 18 0Z"/><path d="M7 10h10M7 14h6"/>'],
   ['idea','فكرة','Idea','<path d="M8 16c0-3-3-3-3-7a7 7 0 0 1 14 0c0 4-3 4-3 7ZM9 20h6M10 23h4M12 16V9m-3 2 3-2 3 2"/>'],
   ['connections','ترابط','Connections','<rect x="9" y="2" width="6" height="6" rx="2"/><rect x="2" y="16" width="6" height="6" rx="2"/><rect x="16" y="16" width="6" height="6" rx="2"/><path d="M12 8v4M5 16v-4h14v4"/>']
  ]},
  travel:{name:['رحلات','Travel'],brief:['ست أيقونات لتجربة تخطيط سفر: وجهة، حقيبة، تذكرة، إقامة، مسار، ووقت.','Six icons for a travel planner: destination, luggage, ticket, stay, route, and time.'],icons:[
   ['destination','وجهة','Destination','<path d="M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 1 1 14 0Z"/><circle cx="12" cy="9" r="2.5"/>'],
   ['luggage','حقيبة','Luggage','<rect x="5" y="6" width="14" height="14" rx="3"/><path d="M9 6V3h6v3M9 10v6M15 10v6M8 20v2M16 20v2"/>'],
   ['ticket','تذكرة','Ticket','<path d="M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4Z"/><path d="M15 5v3m0 3v2m0 3v3"/>'],
   ['stay','إقامة','Stay','<path d="M4 21V8l8-5 8 5v13M2 21h20M9 21v-7h6v7M8 9h1m6 0h1"/>'],
   ['route','مسار','Route','<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h9a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h9"/>'],
   ['time','وقت','Time','<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>']
  ]},
  commerce:{name:['متجر','Commerce'],brief:['ست أيقونات لمتجر رقمي: حقيبة تسوق، دفع، طرد، توصيل، هدية، وإيصال.','Six icons for a digital store: shopping bag, payment, package, delivery, gift, and receipt.'],icons:[
   ['bag','تسوق','Shopping bag','<path d="M5 7h14l2 14H3ZM8 7V6a4 4 0 0 1 8 0v1"/>'],
   ['payment','دفع','Payment','<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M6 15h4"/>'],
   ['package','طرد','Package','<path d="m12 2 9 5v10l-9 5-9-5V7ZM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5"/>'],
   ['delivery','توصيل','Delivery','<path d="M2 4h12v14H2ZM14 9h4l4 5v4h-8"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>'],
   ['gift','هدية','Gift','<path d="M3 8h18v5H3ZM5 13v9h14v-9M12 8v14"/><path d="M12 8H8a3 3 0 1 1 3-3Zm0 0h4a3 3 0 1 0-3-3Z"/>'],
   ['receipt','إيصال','Receipt','<path d="m5 2 3 2 4-2 4 2 3-2v20l-3-2-4 2-4-2-3 2ZM9 8h6M9 12h6M9 16h3"/>']
  ]}
 };
 function svg(icon,{style='outline',weight=1.7,size=24,soft=true}={}){
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${weight}" stroke-linecap="${soft?'round':'square'}" stroke-linejoin="${soft?'round':'miter'}" aria-hidden="true">${style==='duotone'?'<rect x="2" y="2" width="20" height="20" rx="6" fill="#E9EFFF" fill-opacity=".6" stroke="none"/>':''}${icon[3]}</svg>`;
 }
 function initial(){return {phase:'brief',set:null,style:'outline',size:24,weight:1.7,soft:true,brief:'',turns:[],notes:[]};}
 function inferFamily(text){
  if(/\b(travel|trips?|flights?|tours?|journeys?)\b|سفر|رحل|طيران|سياح/i.test(text))return 'travel';
  if(/\b(shops?|stores?|commerce|payments?|delivery)\b|متجر|تسوق|تجارة|دفع|توصيل/i.test(text))return 'commerce';
  if(/\b(work|documents?|knowledge|folders?|notes?|workspace)\b|عمل|معرف|مستند|ملف|ملاحظ/i.test(text))return 'workspace';
  return null;
 }
 function refinement(text){
  const changes={};
  if(/lighter|thinner|light lines|أخف|اخف|رفيع/i.test(text))changes.weight=1.3;
  if(/bolder|thicker|heavier|أسمك|اثقل|أثقل|سميك/i.test(text))changes.weight=2;
  if(/regular|original|default|عادي|أصلي|افتراضي/i.test(text))changes.weight=1.7;
  if(/crisp|sharp|square|حادة|حاد|مربع/i.test(text))changes.soft=false;
  if(/round|soft.*corner|softer|دائر|ناعمة|لين/i.test(text))changes.soft=true;
  if(/outline|simple|mono|خطي|بسيط/i.test(text))changes.style='outline';
  if(/two.?tone|duotone|colou?r|ثنائي|لون|ملون/i.test(text))changes.style='duotone';
  if(/(?:no|without|remove|remove the) colou?r|بدون لون/i.test(text))changes.style='outline';
  return changes;
 }
 function generationBrief(state){return `Nasaq Icon Studio: generation brief\n\n${state.brief}\n\nExample family: ${state.set||'not chosen'}.\nStyle: ${state.style}; grid: ${state.size}px; stroke: ${state.weight}; joins: ${state.soft?'round':'miter'}.\n${state.notes.length?'Refinement requests:\n'+state.notes.join('\n')+'\n':''}\nCreate six coherent original SVG icons with a 24 × 24 viewBox and currentColor strokes. Check optical weight and small-size legibility. Review RTL meaning before mirroring directional symbols.\nPresent the plan and a cost estimate for approval before invoking a paid model.\n\nPortfolio reference: the visible SVGs are authored examples. Live generation requires authenticated model access and paid usage.`;}
 function iconSource(icon,state){return svg(icon,state).replace(' aria-hidden="true"',' role="img"').replace('><',`><title>${escape(icon[2])}: Nasaq example</title><`);}
 // A small uncompressed ZIP keeps downloads local and preserves the exact preview.
 function zipFiles(files){
  const encoder=new TextEncoder(),parts=[],directory=[];let offset=0;
  const crc32=bytes=>{let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;};
  for(const [name,content] of files){
   const filename=encoder.encode(name),data=encoder.encode(content),crc=crc32(data);
   const local=new Uint8Array(30+filename.length),view=new DataView(local.buffer);
   view.setUint32(0,0x04034b50,true);view.setUint16(4,20,true);view.setUint16(6,0x800,true);view.setUint16(12,0x21,true);
   view.setUint32(14,crc,true);view.setUint32(18,data.length,true);view.setUint32(22,data.length,true);view.setUint16(26,filename.length,true);local.set(filename,30);
   const central=new Uint8Array(46+filename.length),cv=new DataView(central.buffer);
   cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x800,true);cv.setUint16(14,0x21,true);
   cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);cv.setUint16(28,filename.length,true);cv.setUint32(42,offset,true);central.set(filename,46);
   parts.push(local,data);directory.push(central);offset+=local.length+data.length;
  }
  const centralSize=directory.reduce((total,part)=>total+part.length,0),end=new Uint8Array(22),ev=new DataView(end.buffer);
  ev.setUint32(0,0x06054b50,true);ev.setUint16(8,files.length,true);ev.setUint16(10,files.length,true);ev.setUint32(12,centralSize,true);ev.setUint32(16,offset,true);
  const output=new Uint8Array(offset+centralSize+22);let cursor=0;for(const part of [...parts,...directory,end]){output.set(part,cursor);cursor+=part.length;}return output;
 }
 function archive(state){return zipFiles([...sets[state.set].icons.map(icon=>[icon[0]+'.svg',iconSource(icon,state)]),['generation-brief.txt',generationBrief(state)]]);}
 function render(lang='en'){
  const ar=lang==='ar',t=(a,b)=>ar?a:b;
  return `<header class="page-head studio-heading"><h1>${t('استوديو الأيقونات','Icon Studio')}</h1><p>${t('عائلة أيقونات تبدأ بمحادثة.','An icon family starts with a conversation.')}</p></header>
  <div id="nasaq-icon-studio" class="icon-studio" data-language="${lang}">
   <div class="studio-session-status"><span>${t('مساحة الأيقونات','ICON WORKSPACE')}</span><span id="studio-phase-label">${t('جاهز لفكرتك','Ready for your idea')}</span></div><div class="studio-chat-bar"><span><span class="studio-avatar" aria-hidden="true">✳</span> ${t('نسق','Nasaq')}</span><button type="button" data-studio-reset>${t('محادثة جديدة','New chat')} <span aria-hidden="true"></span></button></div>
   <div class="studio-thread" id="studio-thread" role="log" aria-label="${t('محادثة إنشاء الأيقونات','Icon creation conversation')}" aria-live="off"></div>
   <form id="studio-chat-form" class="studio-composer" novalidate><label id="studio-prompt-label" class="sr-only" for="studio-prompt">${t('صف الأيقونات التي تريدها','Describe the icons you want')}</label><textarea id="studio-prompt" rows="2" maxlength="1600" placeholder="${t('أحتاج أيقونات لتطبيق…','I need icons for a…')}" aria-describedby="studio-input-help studio-error"></textarea><div class="studio-composer-bottom"><span id="studio-input-help">${t('فكرتك تكفي. التفاصيل تأتي لاحقًا.','Just your idea. We’ll work out the details together.')}</span><button type="submit" class="studio-send" aria-label="${t('إرسال الرسالة','Send message')}"><span aria-hidden="true">${ar?'':''}</span></button></div></form>
   <p id="studio-error" class="studio-error" role="alert"></p><p id="studio-status" class="sr-only" role="status" aria-live="polite"></p>
   <div class="studio-footnote"><span>${t('استكشف بأمثلة SVG مرفقة.','Explore with included SVG examples.')}</span><button type="button" data-studio-access>${t('التوليد المباشر يتطلب وصولًا','Live generation requires access')} </button></div>
   <details class="studio-brief-details" hidden><summary>${t('موجزك المحفوظ','Your saved brief')}</summary><pre id="studio-export-brief" tabindex="0"></pre></details>
   <dialog class="nq-dialog studio-access-dialog" aria-labelledby="studio-access-title"><h2 id="studio-access-title">${t('التوليد المباشر يتطلب وصولًا','Live generation requires access')}</h2><p>${t('يتطلب توليد أيقونات جديدة وصولًا موثّقًا إلى نموذج واستخدامًا مدفوعًا. لحماية بيانات الوصول وتجنّب تكاليف API المفتوحة، لا أتيح التوليد المباشر على معرض أعمالي.','Creating new icons requires authenticated model access and paid usage. To protect access credentials and avoid open-ended API costs, live generation is not enabled on my portfolio.')}</p><p>${t('يمكنك هنا استكشاف المحادثة وتنقيح أمثلة SVG المرفقة وتنزيلها. في مساحة عمل متصلة، يعرض الوكيل خطته وتقدير التكلفة قبل التوليد.','Here, you can explore the conversation, refine the included SVG examples, and download them. In a connected workspace, the agent would show its plan and estimated cost before generating.')}</p><button type="button" class="nq-button" data-studio-close>${t('متابعة المحادثة','Back to the conversation')}</button></dialog>
  </div>`;
 }
 function mount(){
  const host=document.querySelector('#nasaq-icon-studio');if(!host||host.dataset.mounted)return;host.dataset.mounted='true';
  const ar=host.dataset.language==='ar',t=(a,b)=>ar?a:b,$=selector=>host.querySelector(selector);
  let state=initial();
  const announce=text=>$('#studio-status').textContent=text;
  const choice=(key,label)=>`<button type="button" class="studio-choice" data-studio-choice="${key}">${label}</button>`;
  const familyName=()=>sets[state.set].name[ar?0:1];
  const say=(role,text,result=false)=>state.turns.push({role,text,result});
  function choices(){
   if(state.phase==='family')return Object.entries(sets).map(([key,set])=>choice('family:'+key,set.name[ar?0:1])).join('');
   if(state.phase==='style')return choice('style:outline',t('خطوط بسيطة','Simple outlines'))+choice('style:duotone',t('لون هادئ','A touch of color'));
   if(state.phase==='refine')return choice('lighter',t('خطوط أخف','Lighter lines'))+choice(state.style==='outline'?'color':'outline',state.style==='outline'?t('أضف لونًا','Add a little color'):t('بدون لون','Keep it simple'))+choice('approve',t('هكذا أفضل','Looks good'));
   return '';
  }
  function result(){
   return `<div class="studio-result"><div class="studio-result-heading"><strong>${escape(familyName())}</strong><span>${t('٦ أمثلة SVG','6 SVG examples')}</span></div><div class="studio-icon-grid">${sets[state.set].icons.map(icon=>`<div class="studio-icon-tile">${svg(icon,{...state,size:36})}<span>${icon[ar?1:2]}</span></div>`).join('')}</div>${state.phase==='ready'?`<div class="studio-download-actions"><button type="button" class="nq-button" data-studio-download>${t('تنزيل الأيقونات الست ','Download 6 icons ')}</button><button type="button" class="studio-text-button" data-studio-copy>${t('نسخ الموجز','Copy the brief')}</button></div>`:''}</div>`;
  }
  function paint({focus=false}={}){
   $('.studio-chat-bar').hidden=state.turns.length===0;
   $('#studio-phase-label').textContent=({brief:t('جاهز لفكرتك','Ready for your idea'),family:t('اختر العائلة','Choose a family'),style:t('اختر الاتجاه البصري','Choose a visual direction'),refine:t('تنقيح العائلة','Refining your family'),ready:t('جاهز للتنزيل','Ready to download')})[state.phase];
   const thread=$('#studio-thread'),lastResult=state.turns.map(turn=>turn.result).lastIndexOf(true),options=choices();
   const welcome=`<div class="studio-welcome"><span class="studio-welcome-mark" aria-hidden="true">✳</span><h2>${t('ما الأيقونات التي تدور في بالك؟','What icons do you have in mind?')}</h2><p>${t('أخبرني عن منتجك وما تحتاجه. نأخذها خطوة بخطوة.','Tell me about your product and what you need. We’ll take it from there.')}</p><div class="studio-starting-points"><span>${t('أو ابدأ بفكرة','Or start with an idea')}</span><div>${Object.entries(sets).map(([key,set])=>`<button type="button" data-studio-example="${key}">${{workspace:t('أيقونات مساحة عمل','Workspace icons'),travel:t('أيقونات سفر','Travel icons'),commerce:t('أيقونات متجر','Store icons')}[key]} <span aria-hidden="true">${ar?'':''}</span></button>`).join('')}</div></div></div>`;
   thread.innerHTML=state.turns.length?state.turns.map((turn,i)=>`<article class="studio-turn studio-turn-${turn.role}" ${i===state.turns.length-1?'data-latest-turn':''}><div class="studio-turn-author">${turn.role==='agent'?'<span class="studio-small-avatar" aria-hidden="true">✳</span>':''}<span>${turn.role==='agent'?t('نسق','Nasaq'):t('أنت','You')}</span></div><div class="studio-turn-content"><p>${escape(turn.text)}</p>${turn.result&&i===lastResult?result():''}${i===state.turns.length-1&&options?'<div class="studio-choices">'+options+'</div>':''}</div></article>`).join(''):welcome;
   const labels={brief:t('صف الأيقونات التي تريدها','Describe the icons you want'),family:t('اختر العائلة الأقرب لفكرتك','Choose the closest example family'),style:t('كيف تريد أن تبدو الأيقونات؟','How should your icons feel?'),refine:t('ماذا تريد أن تغيّر؟','What would you like to change?'),ready:t('هل تريد تغيير شيء آخر؟','Anything else you’d like to change?')};
   $('#studio-prompt-label').textContent=labels[state.phase];
   $('#studio-prompt').placeholder=state.phase==='brief'?t('أحتاج أيقونات لتطبيق…','I need icons for a…'):state.phase==='style'?t('مثلًا: خطوط بسيطة وواضحة','For example: simple, clean lines'):state.phase==='family'?t('مساحة عمل، رحلات، أو متجر','Workspace, travel, or commerce'):t('مثلًا: اجعل الخطوط أخف…','For example: make the lines lighter…');
   $('#studio-input-help').textContent=state.phase==='brief'?t('فكرتك تكفي. التفاصيل تأتي لاحقًا.','Just your idea. We’ll work out the details together.'):t('اكتب ردك أو اختر اقتراحًا أعلاه.','Reply in your own words, or choose a suggestion above.');
   if(focus){$('#studio-chat-form').scrollIntoView?.({block:'end',behavior:'auto'});$('#studio-prompt').focus({preventScroll:true});}
  }
  function askStyle(){
   state.phase='style';
   say('agent',t(`لنستكشف عائلة «${familyName()}» المرفقة: ${sets[state.set].icons.map(icon=>icon[1]).join('، ')}. كيف تريد أن تبدو؟`,`Let’s explore the included ${familyName().toLowerCase()} family: ${sets[state.set].icons.map(icon=>icon[2].toLowerCase()).join(', ')}. How should they feel?`));
  }
  function showExamples(){
   state.phase='refine';say('agent',t('هذه العائلة بالأسلوب الذي اخترته. هل تريد تغيير شيء؟','Here’s the example family in your chosen style. Anything you’d like to change?'),true);
  }
  function approve(){state.phase='ready';say('agent',t('جاهزة. يمكنك تنزيل الأيقونات الست كملفات SVG قابلة للتحرير، أو نسخ موجزك للمتابعة في مساحة عمل متصلة.','All yours. Download the six editable SVG examples, or copy your brief to continue in a connected workspace.'),true);}
  function send(text){
   const value=text.trim();if(!value){$('#studio-error').textContent=t('اكتب فكرتك أو اختر اقتراحًا للبدء.','Describe your idea, or choose a suggestion to get started.');$('#studio-prompt').setAttribute('aria-invalid','true');$('#studio-prompt').focus();return;}
   $('#studio-error').textContent='';$('#studio-prompt').removeAttribute('aria-invalid');$('#studio-prompt').value='';say('user',value);
   if(state.phase==='brief'){
    state.brief=value;state.set=inferFamily(value);
    if(state.set)askStyle();else{state.phase='family';say('agent',t('حفظت فكرتك. أي عائلة أمثلة هي الأقرب إليها؟ يمكننا استكشافها هنا، وإنشاء أشكال جديدة يتطلب وصولًا إلى التوليد المباشر.','Your idea is saved. Which example family is closest? We can explore it here; creating new shapes requires live-generation access.'));}
   }else if(state.phase==='family'){
    const family=inferFamily(value);if(family){state.set=family;askStyle();}else say('agent',t('اختر مساحة عمل أو رحلات أو متجر لمتابعة المحادثة بالأمثلة المرفقة.','Choose workspace, travel, or commerce to continue with the included examples.'));
   }else if(state.phase==='style'){
    const changes=refinement(value);if(Object.keys(changes).length){Object.assign(state,changes);showExamples();}else say('agent',t('نبدأ بخطوط بسيطة أم بلمسة لون؟ اختر ما يناسب فكرتك.','Shall we start with simple outlines or a touch of color? Choose what suits your idea.'));
   }else if(/^(looks good|all good|ready|done|download|perfect|هكذا أفضل|جاهز|تنزيل|تمام|ممتاز)[.!؟? ]*$/i.test(value))approve();
   else{
    state.notes.push(value);const changes=refinement(value);
    if(Object.keys(changes).length){Object.assign(state,changes);state.phase='refine';say('agent',t('عدّلت الأمثلة حسب توجيهك. كيف تبدو الآن؟','I’ve adjusted the examples. How do they feel now?'),true);}
    else say('agent',t('أضفت طلبك إلى الموجز. يمكنني هنا معاينة وزن الخط والحواف واللون. تغيير الأشكال بتعليمات حرة يتطلب التوليد المباشر.','I’ve kept that request in your brief. Here I can preview line weight, corners, and color. Free-form changes to the shapes need live generation.'));
   }
   paint({focus:true});announce(state.turns[state.turns.length-1].text);
  }
  $('#studio-chat-form').addEventListener('submit',event=>{event.preventDefault();send($('#studio-prompt').value);});
  $('#studio-prompt').addEventListener('input',()=>{$('#studio-error').textContent='';$('#studio-prompt').removeAttribute('aria-invalid');});
  $('#studio-prompt').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();send($('#studio-prompt').value);}});
  host.addEventListener('click',async event=>{
   const target=event.target.closest('button');if(!target)return;
   if(target.dataset.studioExample){send(sets[target.dataset.studioExample].brief[ar?0:1]);return;}
   if(target.dataset.studioChoice){
    const key=target.dataset.studioChoice;
    if(key.startsWith('family:'))send(sets[key.split(':')[1]].name[ar?0:1]);
    else if(key==='style:outline')send(t('خطوط بسيطة','Simple outlines'));
    else if(key==='style:duotone')send(t('لون هادئ','A touch of color'));
    else send({lighter:t('اجعل الخطوط أخف','Make the lines lighter'),color:t('أضف لونًا هادئًا','Add a little color'),outline:t('خطوط بسيطة بدون لون','Simple outlines'),approve:t('هكذا أفضل','Looks good')}[key]);
    return;
   }
   if(target.hasAttribute('data-studio-reset')){state=initial();$('#studio-prompt').value='';$('#studio-error').textContent='';$('#studio-prompt').removeAttribute('aria-invalid');$('.studio-brief-details').hidden=true;paint();$('#studio-prompt').focus();announce(t('محادثة جديدة. ما فكرتك؟','New conversation. What’s your idea?'));}
   if(target.hasAttribute('data-studio-access')){const dialog=$('.studio-access-dialog');dialog.showModal();dialog.addEventListener('close',()=>target.focus(),{once:true});}
   if(target.hasAttribute('data-studio-close'))$('.studio-access-dialog').close();
   if(target.hasAttribute('data-studio-download')){const url=URL.createObjectURL(new Blob([archive(state)],{type:'application/zip'}));const link=document.createElement('a');link.href=url;link.download=`nasaq-${state.set}-icons.zip`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce(t('تم تجهيز ملفات الأيقونات الست وموجزك للتنزيل.','Your six SVG examples and brief are ready to download.'));}
   if(target.hasAttribute('data-studio-copy')){
    try{await navigator.clipboard.writeText(generationBrief(state));announce(t('تم نسخ موجزك.','Your brief is copied.'));}
    catch{const details=$('.studio-brief-details');details.hidden=false;details.open=true;$('#studio-export-brief').textContent=generationBrief(state);$('#studio-export-brief').focus();announce(t('تعذر النسخ التلقائي. يمكنك تحديد الموجز الظاهر ونسخه.','Automatic copy is unavailable. Select and copy your brief below.'));}
   }
  });
  const handoff=root.NASAQ_ICON_STUDIO_START;
  delete root.NASAQ_ICON_STUDIO_START;
  if(handoff&&sets[handoff.set]&&['outline','duotone'].includes(handoff.style)){
   state.set=handoff.set;state.style=handoff.style;state.brief=sets[state.set].brief[ar?0:1];
   say('user',state.brief);
   state.phase='refine';
   say('agent',t('هذه عائلة الأمثلة التي اخترتها. ماذا تريد أن تغيّر؟','Here is the example family you chose. What would you like to change?'),true);
  }
  paint();
 }
 root.NASAQ_ICON_STUDIO={render,mount,initial,sets,svg,generationBrief,inferFamily,refinement,archive};
})(globalThis);
