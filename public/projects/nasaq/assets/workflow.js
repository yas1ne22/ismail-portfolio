(function(root){
 const initial=()=>({phase:'idle',attachment:null,prompt:'',attempts:0,error:null});
 const reduce=(state,event)=>{
  switch(event.type){
   case 'attach':return {...state,attachment:event.attachment,phase:'ready',error:null};
   case 'submit':if(!state.attachment||!event.prompt.trim()||state.phase==='generating')return state;return {...state,prompt:event.prompt,phase:'generating',attempts:state.attempts+1,error:null};
   case 'fail':return state.phase==='generating'?{...state,phase:'error',error:'connection'}:state;
   case 'complete':return state.phase==='generating'?{...state,phase:'complete',error:null}:state;
   case 'cancel':return state.phase==='generating'?{...state,phase:'cancelled',error:null}:state;
   case 'reset':return initial();default:return state;
  }
 };
 let dispose=()=>{};
 function mount(){
  dispose();dispose=()=>{};
  const host=document.querySelector('#document-workflow');if(!host)return;
  const ar=host.dataset.workflowLanguage==='ar',t=(a,b)=>ar?a:b,esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let state=initial(),timer=null;
  host.innerHTML=`<div class="workflow-top"><div><span class="workflow-dot" aria-hidden="true"></span><b>${t('مساعد المستندات','Document assistant')}</b></div><span>${t('مثال محلي','Local demonstration')}</span></div><div class="workflow-body"><div class="workflow-attachment"><label for="workflow-file">${t('١. أرفق مستندًا','1. Attach a document')}</label><p>${t('ملف PDF أو TXT حتى 2MB. يُعرض الاختيار فقط؛ لا نقرأه أو نرفعه. تستخدم الإجابة موجز العينة.','PDF or TXT up to 2MB. Selection only; no reading or upload. The response uses the sample brief.')}</p><div class="row"><button type="button" id="workflow-sample" class="nq-button secondary">${t('استخدم موجز العينة','Use sample brief')}</button><input type="file" id="workflow-file" accept=".pdf,.txt,application/pdf,text/plain" aria-describedby="workflow-file-status"></div><p id="workflow-file-status" role="status">${t('لا يوجد مرفق.','No document attached.')}</p></div><form id="workflow-form"><label for="workflow-prompt">${t('٢. اسأل عن المستند','2. Ask about the document')}</label><textarea id="workflow-prompt" class="nq-input" rows="3" required maxlength="600" placeholder="${t('ما القرارات الأساسية في هذا الموجز؟','What are the main decisions in this brief?')}"></textarea><div class="workflow-controls"><button id="workflow-send" class="nq-button" type="submit" disabled>${t('لخّص الموجز','Summarize brief')}</button><button id="workflow-stop" class="nq-button secondary" type="button" hidden>${t('أوقف التوليد','Stop generation')}</button><button id="workflow-reset" class="text-button" type="button">${t('ابدأ من جديد','Reset example')}</button></div><details class="workflow-scenarios"><summary>${t('جرّب حالة فشل','Try a failure scenario')}</summary><label class="nq-check"><input type="checkbox" id="workflow-fail">${t('أفشل الطلب التالي، ثم جرّب الإعادة','Fail the next request, then retry')}</label></details></form><p id="workflow-status" role="status" aria-live="polite"></p><div id="workflow-result" aria-busy="false"></div><details class="workflow-source" id="workflow-source"><summary>${t('موجز العينة / المصدر','Sample brief / source')}</summary><div id="workflow-source-passage"><h3>${t('موجز: مكتبة واجهات ثنائية اللغة','Brief: a bilingual interface library')}</h3><p>${t('المهمة: بناء عناصر ويب قابلة لإعادة الاستخدام للعربية والإنجليزية. استخدم المراعي للعربية وInter للإنجليزية. افصل القيم الأساسية عن الأدوار الدلالية. احتفظ بالمحتوى المدخل عند الخطأ، واجعل الإلغاء إجراءً متاحًا. يبدأ التحقق بلوحة المفاتيح والتباين والمحتوى المختلط.','Task: build reusable web controls for Arabic and English. Use Almarai for Arabic and Inter for English. Separate primitives from semantic roles. Keep entered content after an error and make cancellation available. Begin verification with keyboard behavior, contrast and mixed-direction content.')}</p><small>${t('نص عينة كُتب لهذا المثال؛ ليس مستند عميل.','Sample text written for this example; not a client document.')}</small></div></details></div>`;
  const q=s=>host.querySelector(s),prompt=q('#workflow-prompt'),send=q('#workflow-send'),stop=q('#workflow-stop'),result=q('#workflow-result'),status=q('#workflow-status');
  function update(){
   const busy=state.phase==='generating';send.disabled=busy||!state.attachment;stop.hidden=!busy;q('#workflow-sample').disabled=busy;q('#workflow-file').disabled=busy;
   result.setAttribute('aria-busy',String(busy));
   const messages={idle:t('اختر موجز العينة للبدء.','Choose the sample brief to begin.'),ready:t('المستند جاهز. يمكنك تعديل السؤال.','Document ready. You can edit the question.'),generating:t('جارٍ عرض التوليد. يمكنك إيقافه.','Showing generation. You can stop it.'),cancelled:t('توقف التوليد. السؤال والمرفق محفوظان في هذه الصفحة.','Generation stopped. Your question and attachment remain on this page.'),error:t('تعذر إكمال الطلب. السؤال والمرفق ما زالا موجودين.','The request failed. Your question and attachment are still here.'),complete:t('اكتمل المثال. افحص المصدر أسفل الإجابة.','Example complete. Inspect the source below the answer.')};status.textContent=messages[state.phase];
   q('#workflow-file-status').textContent=state.attachment?`${state.attachment.name} · ${Math.ceil(state.attachment.size/1024)} KB` :t('لا يوجد مرفق.','No document attached.');
   if(busy)result.innerHTML=`<div class="workflow-pending"><span class="nq-spinner" aria-hidden="true"></span><span>${t('تلخيص موجز العينة…','Summarizing the sample brief…')}</span></div>`;
   else if(state.phase==='error')result.innerHTML=`<div class="nq-alert error"><h3>${t('الطلب لم يكتمل','Request incomplete')}</h3><p>${t('هذا فشل مقصود لاختبار الاسترداد. لم يُرسل شيء. أعد المحاولة بالسؤال والمرفق نفسيهما.','This failure was deliberately simulated. Nothing was sent. Retry with the same question and attachment.')}</p><button id="workflow-retry" class="nq-button secondary" type="button">${t('أعد المحاولة','Retry request')}</button></div>`;
   else if(state.phase==='complete')result.innerHTML=`<article class="workflow-answer"><small>${t('إجابة توضيحية ثابتة','Fixed demonstration response')}</small><h3 tabindex="-1" id="workflow-answer-title">${t('ثلاثة قرارات في الموجز','Three decisions in the brief')}</h3><ol><li>${t('خط واتجاه مناسب لكل لغة.','Use a language-appropriate font and direction.')}</li><li>${t('أدوار دلالية مشتركة بدل قيم ثابتة لكل شاشة.','Share semantic roles instead of hardcoding values per screen.')}</li><li>${t('احتفظ بالمحتوى عند الخطأ وأتح الإلغاء.','Preserve content on failure and offer cancellation.')}</li></ol><button id="workflow-show-source" class="text-button" type="button">${t('افحص مقطع المصدر [1]','Inspect source passage [1]')} </button><p class="workflow-question">${t('السؤال الذي أرسلته','Your submitted question')}: ${esc(state.prompt)}</p></article>`;
   else result.innerHTML='';
  }
  const attach=attachment=>{state=reduce(state,{type:'attach',attachment});if(!prompt.value)prompt.value=t('ما القرارات الأساسية في هذا الموجز؟','What are the main decisions in this brief?');update();prompt.focus();};
  function run(retry=false){
   const next=reduce(state,{type:'submit',prompt:retry?state.prompt:prompt.value});if(next===state)return;state=next;
   const fail=!retry&&q('#workflow-fail').checked;q('#workflow-fail').checked=false;update();stop.focus();
   timer=setTimeout(()=>{state=reduce(state,{type:fail?'fail':'complete'});update();(fail?q('#workflow-retry'):q('#workflow-answer-title')).focus();},1600);
  }
  q('#workflow-sample').addEventListener('click',()=>attach({name:ar?'موجز-العينة.txt':'sample-brief.txt',size:718,sample:true}));
  q('#workflow-file').addEventListener('change',event=>{const file=event.target.files[0];if(!file)return;if(file.size>2*1024*1024||!(/\.(pdf|txt)$/i.test(file.name))){q('#workflow-file-status').textContent=t('اختر PDF أوTXT بحجم 2MB أو أقل.','Choose a PDF or TXT file of 2MB or less.');event.target.value='';return;}attach({name:file.name,size:file.size,sample:false});});
  q('#workflow-form').addEventListener('submit',event=>{event.preventDefault();run();});
  stop.addEventListener('click',()=>{clearTimeout(timer);state=reduce(state,{type:'cancel'});update();prompt.focus();});
  q('#workflow-reset').addEventListener('click',()=>{clearTimeout(timer);state=reduce(state,{type:'reset'});prompt.value='';q('#workflow-file').value='';update();q('#workflow-sample').focus();});
  result.addEventListener('click',event=>{if(event.target.closest('#workflow-retry'))run(true);if(event.target.closest('#workflow-show-source')){q('#workflow-source').open=true;q('#workflow-source summary').focus();q('#workflow-source').scrollIntoView({block:'nearest',behavior:'auto'});}});
  update();dispose=()=>clearTimeout(timer);
 }
 root.NASAQ_WORKFLOW={initial,reduce,mount};
})(globalThis);
