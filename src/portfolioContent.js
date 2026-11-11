import { profile, experience } from './data.js';

const arrow = '<span aria-hidden="true"></span>';
const meta = (label, value) => `<div><dt>${label}</dt><dd>${value}</dd></div>`;
export const selectedWork = [
  {
    summary: 'I designed a cart-recovery journey that keeps trip context across web, app and email.',
    id: 'andalus', name: 'Andalus', title: 'Help travelers continue where they left off.',
    href: '/projects/andalus/index.html', discipline: 'Journey strategy · Travel',
    status: 'Client program · Retrospective case',
    description: 'A connected return experience across web, app and email. Preserve the trip, explain changed fares, and make the next decision clear.',
    role: 'Journey strategy, wireframes & interface design',
    evidence: 'Three channels. Available, fare-changed and sold-out return states.',
    note: 'Programme rates are reported separately from the proposed incrementality test.',
    preview: `<div class="trip-preview" aria-label="Interface preview: a saved Algiers–London search with a changed fare"><div class="preview-browser"><i></i><i></i><i></i><span>Andalus · Saved trip</span></div><div class="trip-preview-body"><span class="preview-eyebrow">YOUR SAVED SEARCH</span><div class="preview-route"><div><strong>ALG</strong><span>Algiers</span></div><span class="preview-flight" aria-hidden="true">──── ✈ ────</span><div><strong>LHR</strong><span>London</span></div></div><div class="preview-trip-meta"><span>18–25 November</span><span>1 adult · Economy</span></div><div class="preview-fare"><strong>Your fare has changed.</strong><p>Your trip is saved. Review the current total before continuing.</p><div><span>Current total</span><b>89,500 DZD</b></div></div><span class="preview-action">Review current flights <span aria-hidden="true"></span></span><small>Saved search. No ticket reserved.</small></div></div>`,
  },
  {
    summary: 'I designed an Arabic-first library with 18 components, 340 typed tokens and an Icon Studio conversation flow.',
    id: 'nasaq', name: 'Nasaq', title: 'One system. Two reading directions.',
    href: '/projects/nasaq/case-study-en.html', discipline: 'Design systems · Arabic / English',
    status: 'Independent system · Local release 1.5',
    description: 'An Arabic-first design system connecting reusable interfaces with Icon Studio: a chat experience that turns a description into a coherent icon family, one question at a time.',
    role: 'System design, identity, components & agent experience',
    evidence: 'Bilingual documentation, component states and the Icon Studio walkthrough.',
    note: 'Live icon generation requires authenticated model access and paid usage, so it is not enabled on my portfolio.',
    preview: `<div class="nasaq-preview" aria-label="Nasaq interface specimens in English and Arabic"><div class="nasaq-preview-head"><img src="/projects/nasaq/assets/nasaq-mark.svg" width="28" height="28" alt=""><strong>Nasaq <span lang="ar" dir="rtl">نسق</span></strong><span>RTL / LTR</span></div><div class="nasaq-specimen"><small>ENGLISH · LEFT TO RIGHT</small><h4>Room for your next idea.</h4><p>A clear place to think, write and explore.</p><span class="nasaq-mini-action">Start a conversation </span></div><div class="nasaq-specimen arabic" lang="ar" dir="rtl"><small>العربية · من اليمين إلى اليسار</small><h4>مساحة لفكرتك القادمة.</h4><p>مكان واضح للتفكير والكتابة والاستكشاف.</p><span class="nasaq-mini-action">ابدأ محادثة </span></div><div class="nasaq-studio-preview"><span aria-hidden="true">✳</span><div><strong>Icon Studio</strong><small>Describe  Chat  Refine  Download</small></div><span class="nasaq-studio-symbols" aria-hidden="true">◇ ⊕ </span></div></div>`,
  },
  {
    summary: 'I designed separate landing-page routes for beginner webinars and established operators.',
    id: 'flex', name: 'Flex Academy', title: 'Two audiences. The right next step.',
    href: '/projects/flex-academy/index.html', discipline: 'UX / UI · Conversion journeys',
    status: 'Client project · Design prototype',
    description: 'An education landing page that connects operator credibility with a beginner webinar and a strategy call for existing operators.',
    role: 'UX design, UI design & conversion strategy',
    evidence: 'Audience routing, design rationale and a complete local journey study.',
    note: 'Participant research and live commercial measurement remain pending.',
    preview: `<div class="flex-preview"><img src="/assets/flex/figma-desktop.webp" width="666" height="5000" alt="Saved Flex Academy desktop design showing the operator-led headline and webinar action" loading="lazy" decoding="async"><span class="preview-caption">Saved desktop design · Inspect the reference and current interaction study</span></div>`,
  },
];
export const moreWork = [
  {name:'Veyra', label:'Travel planning · Interaction study', summary:'I designed a map-first planner for building, reordering and recovering a day route.', description:'Explore a place, add it to a day, reorder the route and undo a change.', href:'/projects/veyra/index.html', status:'Independent prototype · Version 2'},
  {name:'Design Handoff', label:'Figma utility · Delivery QA', summary:'I designed a findings-to-report workflow for reviewing handoff risks in Figma.', description:'Turn bounded file checks into a prioritized handoff report.', href:'/projects/design-handoff/index.html', status:'Development plugin · Working source'},
  {name:'Design System Doctor', label:'Figma utility · System consistency', summary:'I designed a scan-and-repair workflow that distinguishes system drift from intentional variation.', description:'Inspect token, typography and component drift before deciding what to repair.', href:'/projects/design-system-doctor/index.html', status:'Figma utility · Working source'},
  {name:'Nexus', label:'Browser workspace · Information architecture', summary:'I designed a capture-and-return workspace for saved websites and design references.', description:'Bring saved websites and design references into a deliberate return workflow.', href:'/projects/nexus/index.html', status:'Browser product · Working implementation'},
];
export const experiments = [
 ['PrepFlow','A connected week of meals, groceries and preparation.','/projects/prepflow/index.html'],
 ['Promptilo','Resource discovery, provenance and editorial operations.','/projects/promptilo/index.html'],
 ['Skinny','A calm, private daily-care timeline.','/projects/skinny/index.html'],
 ['Timer Gym','Interval timing through phase, voice and haptic cues.','/projects/timer-gym/index.html'],
 ['Voicy','Speech-to-writing with editable preview and controlled insertion.','/projects/voicy/index.html'],
 ['Aevis','An AI citation-audit interface concept with simulated results.','/projects/aevis/index.html'],
];

export function renderHome() {
  return `<a class="home-skip" href="#selected-work">Skip to selected work</a>
<header class="home-header"><a class="home-brand" href="/" aria-label="Ismail Bettoumi, portfolio home"><span class="home-monogram" aria-hidden="true">ib.</span><span>Ismail Bettoumi<small>Product designer · Doha</small></span></a><nav aria-label="Main navigation"><a href="#selected-work">Work</a><a href="#about">About</a><a href="/cv.html">Resume</a><a class="header-contact" href="mailto:${profile.email}">Get in touch ${arrow}</a></nav></header>
<main id="portfolio-main">
  <section class="home-hero" aria-labelledby="home-title"><p class="home-eyebrow">PRODUCT DESIGN · CUSTOMER JOURNEYS · ARABIC / ENGLISH SYSTEMS</p><h1 id="home-title">Make the next<br>decision clearer.</h1><div class="home-hero-bottom"><p>I’m Ismail, a product designer in Doha. I connect customer journeys, thoughtful interfaces and reusable systems, with a commercial perspective shaped by marketing.</p><div class="home-hero-actions"><a class="home-button" href="#selected-work">Explore selected work <span aria-hidden="true"></span></a><a class="home-text-link" href="/cv.html">View resume ${arrow}</a></div></div></section>
  <section class="home-work" id="selected-work" aria-labelledby="selected-title"><div class="home-section-head"><div><p class="home-eyebrow">SELECTED WORK</p><h2 id="selected-title">Different problems.<br>Deliberate decisions.</h2></div></div>
    <div class="home-case-list">${selectedWork.map((p,i)=>`<article class="home-case home-case-${p.id}" id="work-${p.id}"><div class="home-case-preview">${p.preview}</div><div class="home-case-copy"><div class="home-case-top"><span class="home-case-index">0${i+1}</span><span>${p.discipline}</span></div><h3>${p.title}</h3><p class="home-case-description">${p.summary || p.description}</p><a class="home-case-link" href="${p.href}" data-project-open="${p.id}">${p.id==='nasaq'?'Explore Nasaq':`Read ${p.name} case study`} ${arrow}</a>${p.id==='nasaq'?'<span class="home-locale-link">English / <bdi lang="ar">العربية</bdi></span><a class="home-studio-link" href="/projects/nasaq/en.html#icon-studio" data-nasaq-direct>Explore Icon Studio <span aria-hidden="true"></span></a>':''}</div></article>`).join('')}</div>
  </section>
  <section class="home-supporting" aria-labelledby="supporting-title"><div class="home-section-head"><div><p class="home-eyebrow">MORE TO EXPLORE</p><h2 id="supporting-title">Craft, systems<br>and useful tools.</h2></div><p>Focused explorations of interaction design and the practical work of designing and delivering products.</p></div><div class="home-supporting-grid">${moreWork.map((p,i)=>`<article><div class="supporting-number">0${i+4}<span>${p.status}</span></div><p class="home-eyebrow">${p.label}</p><h3><a href="${p.href}" data-project-open="${p.name.toLowerCase().replaceAll(' ','-')}">${p.name} ${arrow}</a></h3><p>${p.description}</p></article>`).join('')}</div>
    <details class="home-experiments"><summary>Additional product explorations <span>6 projects <span aria-hidden="true">+</span></span></summary><p>Additional work in native interactions, consumer workflows and AI interfaces. Project pages distinguish implemented behavior from research and release plans.</p><div>${experiments.map(([name,description,href])=>`<a href="${href}" data-project-open="${name.toLowerCase()}"><strong>${name} ${arrow}</strong><span>${description}</span></a>`).join('')}</div></details>
  </section>
  <section class="home-about" id="about" aria-labelledby="about-title"><div><p class="home-eyebrow">HOW I WORK</p><h2 id="about-title">A commercial perspective.<br>A designer’s attention<br>to the next step.</h2><p>My background in marketing made me attentive to how people discover, evaluate and return to a product. I bring that perspective into journey mapping, interface design and prototyping.</p><p>I use AI to explore and build, then inspect the result against the task, the interaction states and the constraints. The decisions and the limits are part of the work.</p><div class="home-skill-links"><a href="/projects/andalus/index.html">Journey strategy ${arrow}</a><a href="/projects/nasaq/explore.html">Bilingual systems ${arrow}</a><a href="/projects/flex-academy/index.html">Client UX / UI ${arrow}</a></div></div><div class="home-experience"><h3>Experience</h3>${experience.map(e=>`<article><p>${e.dates}</p><h4>${e.company}</h4><strong>${e.role}</strong><p>${e.desc}</p></article>`).join('')}<a class="home-text-link" href="/cv.html">Read the complete resume ${arrow}</a></div></section>
  <section class="home-contact" id="contact" aria-labelledby="contact-title"><p class="home-eyebrow">LET’S TALK</p><h2 id="contact-title">Have a product<br>challenge in mind?</h2><p>Based in Doha. Get in touch about product-design opportunities or a project.</p><a class="home-email" href="mailto:${profile.email}" data-contact="email">${profile.email} ${arrow}</a><div class="home-contact-options"><button type="button" data-copy-email>Copy email</button><a href="${profile.linkedin}" data-contact="linkedin">LinkedIn ${arrow}</a><a href="${profile.whatsapp}" data-contact="whatsapp">WhatsApp ${arrow}</a><a href="/Ismail_Bettoumi_CV.pdf" download>Download resume ${arrow}</a></div><p id="copy-status" class="home-live-status" role="status" aria-live="polite"></p></section>
  <section class="home-personal" aria-label="Optional portfolio experiences"><details id="agent-details"><summary>Ask my portfolio assistant <span aria-hidden="true">+</span></summary><p>An optional way to explore the work. You can also email me directly. This assistant can make mistakes; the case studies are the reference.</p><button type="button" id="load-assistant">Load assistant</button><div id="assistant-host"></div><p id="assistant-status" role="status" aria-live="polite"></p></details><div class="home-boarding"><p>A small interaction experiment, inspired by the journey from Algeria to Doha.</p><button type="button" id="open-boarding">Explore the boarding pass <span aria-hidden="true"></span></button></div></section>
</main>
<footer class="home-footer"><p>Ismail Bettoumi · Product designer</p><a href="#home-title">Back to top </a><button type="button" id="theme-toggle" aria-pressed="false">Dark appearance</button></footer>
<dialog class="boarding-dialog" id="boarding-dialog" aria-labelledby="boarding-title"><div class="boarding-dialog-head"><div><p class="home-eyebrow">INTERACTION EXPERIMENT</p><h2 id="boarding-title">Welcome aboard.</h2></div><button type="button" id="close-boarding" aria-label="Close boarding pass">×</button></div><div id="boarding-canvas"></div><div class="boarding-dialog-actions"><p id="boarding-status" role="status" aria-live="polite">Drag the pass onto the reader, or use the scan button.</p><button type="button" id="scan-boarding">Scan boarding pass</button><button type="button" id="exit-boarding">Return to portfolio</button></div></dialog>`;
}
