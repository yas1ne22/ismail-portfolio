/* A shared visual directory for both languages. Native examples keep their own markup. */
(function (root) {
  root.extendNasaqArtwork = function ({lang, pages, groups, renderers, head, section}) {
    const ar = lang === 'ar';
    const t = (arabic, english) => ar ? arabic : english;
    const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const areas = [
      {id:'overview', route:'start', group:0, image:'overview-cobalt', icon:'grid',
        title:t('نظرة عامة','Overview'), label:'01 / OVERVIEW',
        headline:t('تفاصيل مختلفة. نسق واحد.','Different parts. One Nasaq.'),
        desc:t('تعرّف على النظام، ثم ابدأ أول واجهة.','Meet the system and build your first interface.'),
        alt:t('تركيب هندسي من الكوبالت والجرافيت يوضح وحدات نظام نسق.','A cobalt and graphite geometric composition of Nasaq system modules.')},
      {id:'foundations', route:'foundations', group:1, image:'foundations-cobalt', icon:'grid',
        title:t('الأسس','Foundations'), label:'02 / FOUNDATIONS',
        headline:t('من الأساس، إلى كل تفصيل.','A foundation for every detail.'),
        desc:t('الألوان، الخطوط، الأيقونات، المسافات والحركة.','Color, typography, icons, spacing and motion.'),
        alt:t('تركيب هندسي من الكوبالت والجرافيت يوضح وحدات نظام نسق.','A cobalt and graphite geometric composition of Nasaq system modules.')},
      {id:'components', route:'components', group:2, image:'components-cobalt', icon:'settings',
        title:t('المكونات','Components'), label:'03 / COMPONENTS',
        headline:t('مكونات صغيرة. إمكانيات كثيرة.','Small parts. Many possibilities.'),
        desc:t('مكونات قابلة لإعادة الاستخدام وأمثلة تفاعلية.','Reusable controls and working examples.'),
        alt:t('تركيب هندسي من الكوبالت والجرافيت يوضح وحدات نظام نسق.','A cobalt and graphite geometric composition of Nasaq system modules.')},
      {id:'patterns', route:'patterns', group:3, image:'patterns-cobalt', icon:'chat',
        title:t('الأنماط','Patterns'), label:'04 / PATTERNS',
        headline:t('حين تجتمع المكونات، تبدأ التجربة.','Bring the interface together.'),
        desc:t('محادثات، بحث، لوحات بيانات وتجارب تسويقية.','Conversations, search, dashboards and marketing layouts.'),
        alt:t('تركيب هندسي من الكوبالت والجرافيت يوضح وحدات نظام نسق.','A cobalt and graphite geometric composition of Nasaq system modules.')},
      {id:'design-development', route:'design-development', group:4, image:'development-cobalt', icon:'code',
        title:t('التصميم والتطوير','Design & development'), label:'05 / DESIGN & DEVELOPMENT',
        headline:t('من قرار التصميم، إلى الكود.','From design decisions to code.'),
        desc:t('مكتبة التصميم، المتغيرات، الحزمة وأدوات مساعدك.','The design library, tokens, package and assistant tools.'),
        alt:t('تركيب هندسي من الكوبالت والجرافيت يوضح وحدات نظام نسق.','A cobalt and graphite geometric composition of Nasaq system modules.')},
      {id:'about', route:'about', group:5, image:'about-cobalt', icon:'info',
        title:t('حول النظام','About the system'), label:'06 / ABOUT NASAQ',
        headline:t('الفكرة، والقرارات، وما بعدها.','The idea. The decisions. What comes next.'),
        desc:t('قصة نسق، قراراته، جودة التنفيذ وطريقة المساهمة.','The story, decisions, quality record and contribution guide.'),
        alt:t('تركيب هندسي من الكوبالت والجرافيت يوضح وحدات نظام نسق.','A cobalt and graphite geometric composition of Nasaq system modules.')}
    ];
    // All imagery stays decorative in navigation: the link text names its destination.
    const picture = (area, {card=false, eager=false}={}) => `<picture class="nasaq-artwork"><img src="assets/illustrations/${area.image}.svg" width="768" height="512" alt="${card?'':esc(area.alt)}" loading="${eager?'eager':'lazy'}" decoding="async"${eager?' fetchpriority="high"':''}></picture>`;
    const visualCard = (area, i) => `<a class="nasaq-area-card" href="#${area.route}" data-area="${area.id}">${picture(area,{card:true,eager:i<3})}<span class="nasaq-area-card-copy"><strong class="nasaq-area-card-title">${area.title}</strong><span class="nasaq-area-card-desc">${area.desc}</span></span></a>`;
    const hero = () => `<header class="system-hero"><div class="system-hero-copy"><h1>${t('واجهات أوضح.<br>في كل اتجاه.','Build with clarity.<br>In every direction.')}</h1><p>${t('مكتبة تبدأ بالعربية لبناء واجهات ويب واضحة ومتناسقة.','An Arabic-first library for clear, consistent web interfaces.')}</p><div class="row"><a class="nq-button" href="#start">${t('ابدأ البناء','Start building')}</a><a class="nq-button secondary" href="#components">${t('استعرض المكونات','Explore components')}</a></div></div><div class="system-preview"><div class="system-preview-card" data-tabs><div class="nq-tabs" role="tablist" aria-label="${t('مثال النظام','System example')}"><button type="button" role="tab" id="overview-ui-tab" aria-controls="overview-ui-panel" aria-selected="true" tabindex="0">${t('الواجهة','Preview')}</button><button type="button" role="tab" id="overview-token-tab" aria-controls="overview-token-panel" aria-selected="false" tabindex="-1">${t('المتغيرات','Tokens')}</button></div><div id="overview-ui-panel" role="tabpanel" aria-labelledby="overview-ui-tab"><h3>${t('إعدادات المشروع','Project settings')}</h3><label class="nq-check">${t('حفظ سجل المشروع','Save project history')}<input type="checkbox" class="nq-switch" role="switch" checked></label><div class="nq-progress-summary"><span>${t('استخدام توضيحي','Example usage')}</span><output dir="ltr">24 / 100</output></div><progress class="nq-progress" value="24" max="100" aria-label="${t('استخدام توضيحي: ٢٤ من ١٠٠','Example usage: 24 of 100')}">24%</progress></div><div id="overview-token-panel" role="tabpanel" aria-labelledby="overview-token-tab" hidden><h3>${t('أدوار الألوان','Color roles')}</h3><pre>surface        canvas
selected       active view
action         primary intent
focus          keyboard position</pre></div></div></div></header>`;
    const directory = () => section('explore-system',t('استكشف النظام','Explore the system'),`<nav class="nasaq-area-grid" aria-label="${t('أقسام نسق','Nasaq sections')}">${areas.filter(area=>area.id!=='overview').map(visualCard).join('')}</nav>`);
    const iconFor = id => ({colors:'grid',typography:'file',logos:'spark',icons:'search','icon-studio':'spark',misc:'spark',effects:'sun',spacing:'grid',motion:'refresh',buttons:'arrow',inputs:'file',select:'chevron',checkbox:'check',switch:'settings',tabs:'grid',badge:'check',avatar:'user',dialog:'grid',tooltip:'info',radio:'check',textarea:'file',alert:'info',progress:'refresh',skeleton:'grid',accordion:'chevron',cards:'grid',breadcrumb:'arrow',npm:'download',brand:'spark','ai-guide':'chat',mcp:'link',tokens:'grid',skill:'spark',downloads:'download',project:'file',workflow:'chat',quality:'check','design-code':'link',contributing:'plus'}[id] || 'arrow');
    const designLinkIndex = groups[5].findIndex(item=>Array.isArray(item)&&item[0]==='design-code');
    if (designLinkIndex>0) groups[4].splice(1,0,groups[5].splice(designLinkIndex,1)[0]);
    const linksFor = area => groups[area.group].slice(1).filter(([id])=>id!==area.route);
    const routeGrid = area => `<nav class="nasaq-topic-grid" aria-label="${esc(area.title)}">${linksFor(area).map(([id,title])=>`<a class="nasaq-topic-card" href="#${id}"><strong>${esc(title)}</strong></a>`).join('')}</nav>`;
    for (const area of areas.filter(a=>['foundations','components','design-development','about'].includes(a.id))) {
      const page = ar ? [area.route,area.title,area.id==='design-development'?'Design & development':area.id] : [area.route,area.title];
      groups[area.group].splice(1,0,page);
      pages.push(page);
      renderers[area.route] = () => head(area.route,area.desc)+routeGrid(area);
    }
    const pageAreas = new Map();
    areas.forEach(area=>groups[area.group].slice(1).forEach(([id])=>pageAreas.set(id,area)));
    const imageOverrides = {tokens:areas[1],brand:areas[0],skill:areas[5],'ai-guide':areas[5],workflow:areas[3],'design-code':areas[4]};
    const illustrateHeader = (id,html) => {
      const area=areas.find(area=>area.route===id);
      if(!area||!['foundations','components','design-development','about'].includes(id))return html;
      return html.replace(/<header class="page-head">([\s\S]*?)<\/header>/,(_,content)=>`<header class="page-head page-head--illustrated"><div>${content}</div>${picture(area,{eager:true})}</header>`);
    };
    // Decorate the website only; downloadable native examples can opt out.
    for (const [id,original] of Object.entries(renderers)) {
      if (!pageAreas.has(id) || id==='icon-studio') continue;
      renderers[id] = (options={}) => {
        const result = original();
        if (options.artwork === false) return result;
        const decorate = html => {
          if (id==='overview') html=html.replace(/<div class="overview-index">[\s\S]*?<\/div><\/div>/,'').replace(/<section class="section" id="review-route">[\s\S]*?<\/section>/,'');
          if(id==='overview') return hero()+directory();
          return illustrateHeader(id,html);
        };
        return typeof result === 'string' ? decorate(result) : result.then(decorate);
      };
    }
    return {areas};
  };
})(globalThis);
