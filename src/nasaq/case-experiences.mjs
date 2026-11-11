// Shared static markup for the English and Arabic visual case study.
export function caseExperiences(lang, original, studio, tokenCount, version) {
 const ar=lang==='ar',t=(a,b)=>ar?a:b,docs=ar?'index.html':'en.html';
 const arrow=`<span class="case-arrow" aria-hidden="true">${ar?'':''}</span>`;
 const icon=(name)=>({layers:'<rect x="4" y="4" width="16" height="5" rx="2"/><path d="M4 12h16M4 17h16M4 21h16"/>',code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16"/>',flow:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><path d="M14 6h4v4M6 14v4h4"/>'}[name]);
 const svg=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon(name)}</svg>`;
 const picture=(name,alt)=>`<picture class="nasaq-artwork"><img src="assets/illustrations/${name.includes('-motion')?name:`${name}-cobalt`}.svg${name.includes('-motion')?'?v=motion-fix-20261111':''}" width="768" height="512" loading="lazy" decoding="async" alt="${alt}"></picture>`;
 const heading=(n,eyebrow,title,lead)=>`<div class="case-chapter-heading"><p class="case-eyebrow"><span>${n}</span> ${eyebrow}</p><h2>${title}</h2><p class="case-lead">${lead}</p></div>`;
 const reasoning=(keys,label)=>`<details class="case-reading"><summary>${label}<span aria-hidden="true">+</span></summary><div class="case-reading-body">${keys.filter(key=>original[key]).map(key=>`<section ${['decisions','trace','language','next','review-release'].includes(key)?`id="${key}"`:''} data-case-original="${key}">${original[key]}</section>`).join('')}</div></details>`;
 const next=(href,n,label)=>`<a class="case-continue" href="#${href}"><span><small>${t('التالي','UP NEXT')} / ${n}</small><strong>${label}</strong></span>${arrow}</a>`;
 return `<section id="project-brief" class="case-brief" data-case-original="brief"><h2 class="sr-only">${t('ملخص المشروع','Project brief')}</h2>${original.brief.replace(/<h2[\s\S]*?<\/h2>/,'')}</section>
 <section id="problem" class="case-chapter">
 ${heading('01',t('اللغة أولًا','LANGUAGE FIRST'),t('العربية نقطة البداية.','Arabic is a starting point.'),t('بدّل لغة الواجهة نفسها، واستكشف اتجاه القراءة وسلوك المحتوى المختلط.','Switch the same interface between languages. Explore reading direction, type and mixed content.'))}
 <figure class="case-direction-experience case-experience">
  <div class="case-experience-toolbar"><span><i class="case-live-dot" aria-hidden="true"></i>${t('جرّب الواجهة','TRY THE INTERFACE')}</span><div class="case-segment" role="group" aria-label="${t('لغة المثال','Example language')}"><button type="button" data-case-language="en" aria-pressed="${!ar}" lang="en">English</button><button type="button" data-case-language="ar" aria-pressed="${ar}" lang="ar">العربية</button></div></div>
  <div class="case-workspace" data-direction-workspace lang="${lang}" dir="${ar?'rtl':'ltr'}">
   <div class="case-workspace-sidebar" aria-hidden="true"><img src="assets/nasaq-mark.svg" width="28" height="28" alt=""><span class="case-sidebar-active">${svg('layers')}</span><span>${svg('code')}</span><span>${svg('flow')}</span><span class="case-sidebar-avatar">IB</span></div>
   <div class="case-workspace-body">
    <div class="case-workspace-breadcrumb"><span data-demo-text="workspace">${t('مساحة العمل','Workspace')}</span><span aria-hidden="true">/</span><span data-demo-text="settings">${t('الإعدادات','Settings')}</span><span class="case-sample-label" data-demo-text="example">${t('مثال تفاعلي','Interactive example')}</span></div>
    <div class="case-workspace-title"><span class="case-demo-avatar" aria-hidden="true">IB</span><div><h3 data-demo-text="title">${t('مساحتك، على طريقتك.','Your space, your way.')}</h3><p data-demo-text="intro">${t('تفاصيل واضحة، بأي لغة تختارها.','Clear details, in the language you choose.')}</p></div></div>
    <form data-direction-form class="case-demo-form">
     <div><label for="case-demo-name" data-demo-text="name">${t('الاسم','Name')}</label><input id="case-demo-name" name="name" value="${t('إسماعيل','Ismail')}" autocomplete="off" required></div>
     <div><label for="case-demo-email" data-demo-text="email">${t('البريد الإلكتروني','Email address')}</label><input id="case-demo-email" name="email" type="email" dir="ltr" value="design@nasaq.example" autocomplete="off" required></div>
     <p class="case-mixed-note"><span data-demo-text="shared">${t('تتم المشاركة مع','Shared with')}</span> <bdi>team@nasaq.example</bdi><span class="case-context-indicator" aria-hidden="true">↔</span></p>
     <div class="case-demo-form-footer"><span data-direction-status role="status">${t('البيانات التجريبية تبقى في هذه الصفحة.','Example data stays on this page.')}</span><button class="nq-button" type="submit"><span data-demo-text="save">${t('حفظ التغييرات','Save changes')}</span><span class="case-demo-forward" aria-hidden="true"></span></button></div>
    </form>
   </div>
  </div>
  <figcaption class="case-demo-caption"><code data-direction-code>lang="${lang}" dir="${ar?'rtl':'ltr'}"</code><span data-direction-caption>${t('ترتيب القراءة من اليمين إلى اليسار. يحتفظ البريد باتجاهه المحلي.','Left-to-right reading order. Email keeps its own local direction.')}</span></figcaption>
 </figure>
 <div class="case-principles"><div><span>01</span><h3>${t('اتجاه من السياق','Contextual direction')}</h3><p>${t('المسافات والأفعال تتبع لغة الواجهة.','Spacing and actions follow the interface language.')}</p></div><div><span>02</span><h3>${t('إيقاع لكل لغة','A rhythm for each script')}</h3><p>${t('المراعي للعربية، وInter للإنجليزية.','Almarai for Arabic. Inter for English.')}</p></div><div><span>03</span><h3>${t('محتوى مختلط واضح','Readable mixed content')}</h3><p>${t('البريد والأرقام تحتفظ بسياقها.','Email and numbers keep their own context.')}</p></div></div>
 ${reasoning(['problem','decisions','language'],t('اقرأ قرارات التصميم والمقايضات','Read the design decisions and tradeoffs'))}
 ${next('craft','02',t('من الأساس إلى الواجهة','From foundations to interface'))}
 </section>
 <section id="craft" class="case-chapter">
 ${heading('02',t('لغة بصرية مترابطة','A CONNECTED VISUAL LANGUAGE'),t('نظام يمكنك لمسه.','A system you can touch.'),t('دور لوني واحد يصل إلى المكوّن. غيّر المظهر، ثم تتبّع الزر إلى مصدره.','One color role flows into a component. Change the appearance, then trace the button to its source.'))}
 <div class="case-token-experience case-experience" data-token-lab>
  <div class="case-experience-toolbar"><span>${t('من الرمز إلى المكوّن','TOKEN  COMPONENT')}</span><div class="case-segment" role="group" aria-label="${t('مظهر المثال','Example appearance')}"><button type="button" data-token-theme="light" aria-pressed="true">${t('فاتح','Light')}</button><button type="button" data-token-theme="dark" aria-pressed="false">${t('داكن','Dark')}</button></div></div>
  <div class="case-token-grid">
   <div class="case-token-map" role="group" aria-label="${t('تتبّع دور اللون','Trace the color role')}">
    <button type="button" data-token-step="semantic" aria-pressed="true"><span class="case-token-index">01</span><span><small>${t('الدور الدلالي','SEMANTIC ROLE')}</small><code data-token-path>semantic.light.action</code><b><i data-token-swatch></i><span data-token-value>#1D4ED8</span></b></span></button>
    <span class="case-token-connector" aria-hidden="true"></span>
    <button type="button" data-token-step="alias" aria-pressed="false"><span class="case-token-index">02</span><span><small>${t('مرجع المكوّن','COMPONENT ALIAS')}</small><code data-token-alias>component.button.light.background</code><b data-token-reference>{semantic.light.action}</b></span></button>
    <span class="case-token-connector" aria-hidden="true"></span>
    <button type="button" data-token-step="interface" aria-pressed="false"><span class="case-token-index">03</span><span><small>${t('الواجهة','INTERFACE')}</small><code>button.nq-button</code><b>${t('فعل واحد، وحالات واضحة','One action, explicit states')}</b></span></button>
   </div>
   <div class="case-token-preview" data-theme="light">
    <div class="case-component-card"><span class="case-component-symbol" aria-hidden="true">${svg('layers')}</span><span class="case-component-label">NASAQ / ${t('مساحة المشروع','PROJECT SPACE')}</span><h3>${t('مساحة للفكرة.','Room for an idea.')}</h3><p>${t('كل تفصيل يعرف دوره.','Every detail has a role.')}</p><div class="case-component-tags"><span>${t('ملف جديد','New document')}</span><span>01</span></div><button type="button" class="nq-button" data-token-action aria-pressed="false"><span data-token-action-label>${t('حفظ في المساحة','Save to workspace')}</span><span aria-hidden="true">${ar?'':''}</span></button><p data-token-state role="status">${t('جرّب الزر أو انتقل إليه بلوحة المفاتيح.','Try the button, or reach it with your keyboard.')}</p></div>
   </div>
  </div>
  <div class="case-token-inspector" aria-live="polite"><code data-token-inspector-path>semantic.light.action</code><p data-token-explanation>${t('الدور يصف الغرض من اللون. لكل مظهر قيمته الخاصة.','The role describes the purpose of the color. Each appearance resolves its own value.')}</p></div>
 </div>
 <div class="case-visual-pair"><figure class="case-image-tile">${picture('material-foundations-motion',t('متغيرات اللون والمسافة والانحناء والخط تتحرك لتشكّل أساسًا مشتركًا.','Animated color, spacing, radius, and typography tokens assembling into a shared foundation.'))}<figcaption>${t('أساسات تتصل وتتحرك معًا.','Foundations that connect and move together.')}</figcaption></figure><figure class="case-type-preview"><div lang="ar" dir="rtl"><span>01 / ALMARAI</span><p>مساحة للفكرة،<br>ووضوح في التفاصيل.</p></div><div lang="en" dir="ltr"><span>02 / INTER</span><p>Room for an idea.<br>Clarity in the details.</p></div></figure></div>
 ${reasoning(['craft','trace'],t('اقرأ عن اللون والخط وربط الرموز','Read about color, type and token mapping'))}
 ${next('icon-studio','03',t('من الفكرة إلى عائلة أيقونات','From an idea to an icon family'))}
 </section>
 <section id="icon-studio" class="case-chapter case-icon-studio">
 ${heading('03',t('التجربة تشرح الفكرة','EXPERIENCE THE IDEA'),t('فكرة واحدة. عائلة كاملة.','One idea. A whole family.'),t('جرّب المحادثة هنا: خفّف الخطوط، أضف لونًا، ثم نزّل الأيقونات الست.','Try the conversation here: refine the lines, add a little color, then download all six icons.'))}
 <div class="case-studio-journey"><span><b>01</b>${t('صِف الفكرة','Describe')}</span><span aria-hidden="true">${ar?'':''}</span><span><b>02</b>${t('راجع ونقّح','Refine')}</span><span aria-hidden="true">${ar?'':''}</span><span><b>03</b>${t('خذ العائلة معك','Take it with you')}</span></div>
 <div class="case-studio-experience case-experience">${studio}</div>
 <p class="case-experience-note">${t('أمثلة SVG أصلية قابلة للتنقيح والتنزيل.','Original SVG examples you can refine and download.')} <a href="${docs}#icon-studio">${t('افتح الاستوديو كاملًا','Open the full studio')} </a></p>
 ${reasoning(['icon-studio'],t('اقرأ عن تصميم المحادثة والتسليم','Read about the conversation and handoff design'))}
 ${next('evidence','04',t('ما الذي تم بناؤه، وما التالي؟','What was built, and what comes next'))}
 </section>
 <section id="evidence" class="case-chapter">
 ${heading('04',t('المخرجات والتعلّم','OUTPUT & REFLECTION'),t('بُني ليُستكشف.','Built to be explored.'),t('من المكوّن إلى الحزمة: افتح العمل، جرّب حالاته، وافحص تفاصيله.','From component to package: open the work, test its states and inspect the details.'))}
 <div class="case-output-strip"><div><strong>18</strong><span>${t('مكوّنًا','Components')}</span></div><div><strong>${tokenCount}</strong><span>${t('رمزًا مُعرّف النوع','Typed tokens')}</span></div><div><strong>2</strong><span>${t('لغتان، نظام واحد','Languages, one system')}</span></div><div><strong>${version}</strong><span>${t('الإصدار المحلي','Local release')}</span></div></div>
 <div class="case-output-gallery">${[
  ['material-components-motion','buttons',t('المكوّنات','Components'),t('حالات يمكنك تجربتها.','States you can test.'),'layers'],
  ['material-direction-motion','design-code',t('التصميم والكود','Design & code'),t('تتبّع العلاقات.','Trace the connections.'),'code'],
  ['patterns','workflow',t('مسار متكامل','A connected workflow'),t('جرّب الخطأ والتعافي.','Try failure and recovery.'),'flow']
 ].map(([image,hash,title,caption,mark])=>`<a class="case-output-card" href="${docs}#${hash}">${picture(image,'')}<div><span>${svg(mark)}${title}</span>${arrow}<p>${caption}</p></div></a>`).join('')}</div>
 <div class="case-reflection-pair"><article><span class="case-eyebrow">${t('ما سأحتفظ به','KEEP')}</span><h3>${t('سياق واضح. سلوك أصلي.','Explicit context. Native behavior.')}</h3><p>${t('اتجاه قراءة واضح وعناصر HTML أصلية تجعل قرارات الواجهة قابلة للفحص.','Contextual direction and native HTML controls make the interface decisions inspectable.')}</p></article><article><span class="case-eyebrow">${t('ما سأختبره تاليًا','LEARN NEXT')}</span><h3>${t('راقب عملية تسليم فعلية.','Observe a real handoff.')}</h3><p>${t('راقب مصممًا ومطورًا ينجزان المهمة نفسها، وسجّل الأسئلة والأخطاء والوقت.','Watch a designer and developer complete the same task. Record questions, errors and time.')}</p></article></div>
 <p class="case-experience-note">${t('هذه مخرجات تنفيذية؛ لا تمثّل قياسًا للتبنّي أو الأثر التجاري.','These are implementation outputs; adoption and commercial impact have not been measured.')}</p>
 ${reasoning(['evidence','review-release','next'],t('اقرأ الأدلة والحدود والخطوات التالية','Read the evidence, limitations and next steps'))}
 <a class="case-finish" href="${docs}#overview"><span>${t('واصل الاستكشاف','KEEP EXPLORING')}<strong>${t('ادخل نظام نسق.','Enter the Nasaq system.')}</strong></span>${arrow}</a>
 </section>`;
}
