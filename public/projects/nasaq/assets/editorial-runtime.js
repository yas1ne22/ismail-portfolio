(function(){
 const ar=document.documentElement.lang==='ar',t=(a,b)=>ar?a:b;
 window.wireNasaqEditorial=function(){
  window.NASAQ_WORKFLOW?.mount();
  window.NASAQ_ICON_STUDIO?.mount();
  window.mountNasaqExploration?.();
  window.mountNasaqFoundations?.();
  window.NasaqCodeEditor?.mount(document);
  const quality=document.querySelector('#quality-summary');
  if(quality){const report=window.NASAQ_QUALITY;quality.innerHTML=report?`<dl class="project-facts"><div><dt>${t('آخر تحقق','Last verification')}</dt><dd>${report.date}</dd></div><div><dt>${t('النتيجة الآلية','Automated result')}</dt><dd>${report.status==='passed'?t('اجتاز الفحوص المسجلة','Recorded checks passed'):t('قيد التحقق','Verification pending')}</dd></div><div><dt>${t('المسارات','Routes')}</dt><dd>${report.routesPerLanguage} × 2</dd></div><div><dt>${t('نطاق التقرير','Report scope')}</dt><dd>${t('البرنامج والأصول؛ تدقيق الوصول البشري غير مكتمل','Software and assets; human accessibility audit incomplete')}</dd></div></dl>`:'<p>'+t('افتح سجل التحقق لتنزيل آخر نتيجة.','Download the verification record for the latest result.')+'</p>';}
  const library=document.querySelector('#figma-library-status');
  if(library&&window.NASAQ_FIGMA_MAP){const map=window.NASAQ_FIGMA_MAP;library.innerHTML=`<p class="editorial-note">${map.components.length} ${t('عائلة مكونات في المكتبة.','component families in the library.')} ${t('الوضعان في مجموعتي ألوان منفصلتين لتوافق خطة Figma الحالية.','Light and dark values use separate color collections to fit the current Figma plan. The Figma companion records version 1.3; the website and UI package are now 1.4.')}</p>`;}
  document.querySelectorAll('.spec-table').forEach(table=>{if(table.parentElement.classList.contains('table-scroll'))return;const wrapper=document.createElement('div');wrapper.className='table-scroll';wrapper.tabIndex=0;wrapper.setAttribute('role','region');wrapper.setAttribute('aria-label',t('جدول قابل للتمرير','Scrollable specification table'));table.before(wrapper);wrapper.append(table);});
 };
})();
