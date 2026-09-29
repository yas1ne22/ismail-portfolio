import { profile, experience, projects, products, aeoKiller, strategyShowcases } from "./data.js";
import { renderAeoCaseStudy } from "./aeoCaseStudy.js";


const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const store = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
};
const plane =
  '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0c.8 0 1.3 1 1.3 2.4v2.2l6.1 3.5v1.7L9.3 8v3.6l2 1.4v1.4L8 13.5l-3.3.9V13l2-1.4V8L.6 9.8V8.1l6.1-3.5V2.4C6.7 1 7.2 0 8 0Z"/></svg>';
const shot = (name) => `/assets/${name}.jpg`;
const projectIcons = {
  discount:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><circle cx="12" cy="12" r="3"/><path d="m14 10-4 4"/></svg>',
  knowledge:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M4 7l8-4 8 4M4 17l8 4 8-4M4 7v10M20 7v10"/><circle cx="12" cy="3" r="1.5" fill="currentColor"/><circle cx="4" cy="7" r="1.5" fill="currentColor"/><circle cx="20" cy="7" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="17" r="1.5" fill="currentColor"/><circle cx="20" cy="17" r="1.5" fill="currentColor"/><circle cx="12" cy="21" r="1.5" fill="currentColor"/></svg>',
  seo:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/><path d="M8 12.5 10.5 10l2 2 3-3"/><path d="M13 9h2.5V11.5"/></svg>',
  paidmedia:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22"/></svg>',
  shopify:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8.5h12l1.2 11a2 2 0 0 1-2 2.1H6.8a2 2 0 0 1-2-2.1L6 8.5Z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/><path d="m10 14.5 1.5 1.5L14.5 13"/></svg>',
  email:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 7.2 5.4a1.3 1.3 0 0 0 1.6 0L20 7"/></svg>',
  analytics:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20.5h18"/><path d="M7 17v-4M12 17V9M17 17V6.5"/><path d="m5.5 11 4.5-4 4 3 5-5.5"/><circle cx="19" cy="4.5" r="1.3" fill="currentColor"/></svg>',
  aeo:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M5.6 18.4l2.2-2.2M16.2 7.8l2.2-2.2"/></svg>',
  aeokiller:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M5.6 18.4l2.2-2.2M16.2 7.8l2.2-2.2"/></svg>',
  aevis:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M5.6 18.4l2.2-2.2M16.2 7.8l2.2-2.2"/></svg>',
  nexus:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3.5"/><path d="M3 9.5h18"/><circle cx="6.8" cy="6.8" r="1" fill="currentColor"/><circle cx="10.2" cy="6.8" r="1" fill="currentColor"/><path d="m7.5 15.5 4.5-3.5 4.5 3.5M12 12v5.5"/></svg>',
  prepflow:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5h16a8 8 0 0 1-16 0Z"/><path d="M8 5c.5 1.2.5 2.2 0 3.5M12 4c.5 1.5.5 2.8 0 4.5M16 5c.5 1.2.5 2.2 0 3.5M3 19.5h18"/></svg>',
  promptilo:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2.5 2.6 6.2 6.4 2.3-6.4 2.3L12 19.5l-2.6-6.2L3 11l6.4-2.3L12 2.5Z"/><path d="M18.5 16.5l.8 1.8 1.7.7-1.7.8-.8 1.7-.7-1.7-1.8-.8 1.8-.7.7-1.8Z"/></svg>',
  skinny:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5.5" y="4" width="13" height="16" rx="6.5"/><path d="M5.5 12h13"/><circle cx="12" cy="8" r="1.2" fill="currentColor"/><circle cx="12" cy="16" r="1.2" fill="currentColor"/></svg>',
  "timer-gym":
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 1.5M9.5 3.5h5M12 3.5v2.5M18 6.5l1.2 1.2"/></svg>',
  timergym:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 1.5M9.5 3.5h5M12 3.5v2.5M18 6.5l1.2 1.2"/></svg>',
  voicy:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8"/></svg>',
};
const aeoIcons = {
  radar:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 12l5-5"/><path d="M12 3a9 9 0 0 1 9 9"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
  gap:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><circle cx="12" cy="12" r="3"/></svg>',
  agent:
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C12 7.5 7.5 12 2 12c5.5 0 10 4.5 10 10 0-5.5 4.5-10 10-10-5.5 0-10-4.5-10-10Z"/></svg>',
};
const caseRow = (key) => {
  const p = projects[key];
  if (!p) return "";
  const visual = p.icon
    ? `<span class="case-icon case-icon-${p.icon}" aria-hidden="true">${projectIcons[p.icon]}</span>`
    : "";
  return `<li><button type="button" class="case is-strategy-trigger" data-strategy="${key}"><span class="tl-dot tl-dot-case"></span>${visual}<span class="case-text"><span class="case-title">${p.title}</span><span class="case-desc">${p.desc}</span></span><span class="case-arrow" aria-hidden="true">↗</span></button></li>`;
};
const productCaseRow = (p) => {
  const visual = p.logo
    ? `<span class="case-icon case-icon-app case-icon-${p.key}" aria-hidden="true"><img src="${p.logo}" alt="${p.title}" class="case-badge-img" width="36" height="36" loading="lazy" /></span>`
    : `<span class="case-icon case-icon-${p.key}" aria-hidden="true">${projectIcons[p.icon] || projectIcons[p.key] || ""}</span>`;
  const badge = p.isFlagship ? `<span class="case-flagship-pill">Flagship</span>` : "";
  return `<li><a class="case" href="${p.href}" target="_blank" rel="noopener noreferrer"><span class="tl-dot tl-dot-case"></span>${visual}<span class="case-text"><span class="case-title">${p.title} ${badge}</span><span class="case-desc">${p.desc}</span></span><span class="case-arrow" aria-hidden="true">↗</span></a></li>`;
};
document.querySelector("#app").innerHTML = `
<a class="skip-content" href="#journey">Skip to experience</a>
<main class="folio booting" id="portfolio" tabindex="-1" inert>
<aside class="folio-sticky"><span class="fs-rail" aria-hidden="true"></span><div class="fs-lines"><h1 class="fs-name">${profile.name}</h1><p>${profile.location}</p><p><a href="tel:+97470773838" class="fs-phone">${profile.phone}</a></p></div></aside>
<section class="interview-card" aria-label="Talk to Ismail's AI agent">
  <div class="interview-card-heading"><strong>Interview me</strong><span>through my AI agent</span></div>
  <elevenlabs-convai agent-id="agent_2301m37nyj2sev593dq6rbeyxq77" action-text="Interview me through my AI agent"></elevenlabs-convai>
</section>
<div class="folio-col">
<div class="folio-window reveal"><div class="plane-window"><div class="sky"><img class="cloud cloud-one" src="/assets/cloud.png" alt=""><img class="cloud cloud-two" src="/assets/cloud.png" alt=""><span class="sky-glow"></span></div><img class="window-layer back" src="/assets/window-back.webp" alt=""><div class="shade-clip"><img class="window-shade" src="/assets/window-shutter.webp" alt=""></div><img class="window-layer front" src="/assets/window-front.webp" alt=""><button class="shade-control" type="button" aria-label="Close the window shade" aria-pressed="false" title="Drag the shade to switch between day and night"></button></div></div>
<div class="folio-intro reveal">
  <h2 class="folio-tagline">${profile.tagline}</h2>
  <p class="folio-sub">${profile.intro}</p>
  <div class="intro-spot-row">
    <a href="/Ismail_Bettoumi_CV.pdf" target="_blank" rel="noopener noreferrer" class="intro-spot-pill intro-cv-pill" title="Open Ismail Bettoumi CV (PDF)">
      <span class="spot-pulse" aria-hidden="true"></span>
      <span class="spot-pill-txt">Resume / CV</span>
      <span class="spot-pill-tag">PDF ↗</span>
    </a>
  </div>
</div>

<section class="folio-track" id="journey" aria-label="Career flight plan">
<div class="plan-head reveal" aria-hidden="true"><span class="plan-label">Flight plan</span><span class="plan-plane">${plane}</span></div>
<div class="folio-path" aria-hidden="true"><svg class="path-curve" viewBox="0 0 44 110"><defs><clipPath id="flight-path-reveal" clipPathUnits="userSpaceOnUse"><rect class="path-reveal" x="-8" y="-8" width="60" height="0"/></clipPath></defs><path class="pc-dots" d="M44 0 V25 C44 65 0 40 0 80 V110" fill="none"/><path class="pc-lit" d="M44 0 V25 C44 65 0 40 0 80 V110" fill="none" clip-path="url(#flight-path-reveal)"/></svg><div class="path-rail"><div class="path-lit"></div><span class="path-glow"></span><svg class="path-tip" viewBox="0 0 8 4"><path d="m1 1 3 2 3-2"/></svg></div></div>
<ol class="folio-timeline">${experience.map((e) => `<li class="tl-entry"><div class="tl-head"><span class="tl-year">${e.route ? `<span class="tl-route">${e.route}</span>` : ""}<span class="tl-yearnum">${e.year}</span></span><span class="tl-dot tl-dot-${e.current ? "now" : "past"}" aria-hidden="true"></span><h2 class="tl-company">${e.href ? `<a href="${e.href}" target="_blank" rel="noopener noreferrer">${e.company}</a>` : e.company}</h2>${e.current ? '<span class="tl-badge">Current</span>' : ""}</div><div class="tl-body"><h3 class="tl-role">${e.role}</h3><p class="tl-desc">${e.desc}</p><p class="tl-dates">${e.dates}</p></div>${e.projects ? `<ul class="tl-cases">${e.projects.map(caseRow).join("")}</ul>` : ""}</li>`).join("")}
<li class="tl-entry tl-entry-case-study">
  <div class="tl-head">
    <span class="tl-year"><span class="tl-route">CASE</span><span class="tl-yearnum">2025</span></span>
    <span class="tl-dot tl-dot-now" aria-hidden="true"></span>
    <h2 class="tl-company"><button type="button" class="tl-title-btn is-strategy-trigger" data-strategy="aeocase">Case Study</button></h2>
    <span class="tl-badge">AEO & AI Search</span>
  </div>
  <div class="tl-body">
    <h3 class="tl-role">Growing Brand Visibility Across AI Search</h3>
    <div class="tl-case-breakdown">
      <div class="tl-case-row">
        <span class="tl-case-label">Problem</span>
        <p class="tl-case-val">Complete lack of brand visibility and zero citations in generative AI search engines.</p>
      </div>
      <div class="tl-case-row">
        <span class="tl-case-label">Industry</span>
        <p class="tl-case-val">B2B / SaaS</p>
      </div>
      <div class="tl-case-row">
        <span class="tl-case-label">What I Did</span>
        <p class="tl-case-val">Conducted AI citation audits, restructured content for direct-answer Q&A formatting, deployed entity-level structured data schema, and tracked conversational search queries over 6 months.</p>
      </div>
      <div class="tl-case-row tl-case-row-result">
        <span class="tl-case-label">Result</span>
        <p class="tl-case-val tl-case-val-result">+16% AI impressions, +20% conversational Q&A capture rate, and +14% citation share across AI engines.</p>
      </div>
    </div>
  </div>
  <ul class="tl-cases">
    <li>
      <button type="button" class="case is-strategy-trigger" data-strategy="aeocase">
        <span class="tl-dot tl-dot-case"></span>
        <span class="case-icon case-icon-aeo" aria-hidden="true">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/>
          </svg>
        </span>
        <span class="case-text">
          <span class="case-title">AEO Citation Growth & AI Visibility <span class="case-flagship-pill">Case Study</span></span>
          <span class="case-desc">Answer Engine Optimization (AEO), generative search visibility, structured schema & measurement framework.</span>
        </span>
        <span class="case-arrow" aria-hidden="true">↗</span>
      </button>
    </li>
  </ul>
</li>
<li class="tl-entry tl-entry-case-study">
  <div class="tl-head">
    <span class="tl-year"><span class="tl-route">CASE</span><span class="tl-yearnum">2024</span></span>
    <span class="tl-dot tl-dot-now" aria-hidden="true"></span>
    <h2 class="tl-company"><button type="button" class="tl-title-btn is-strategy-trigger" data-strategy="seocase">Case Study</button></h2>
    <span class="tl-badge">SEO & Organic Growth</span>
  </div>
  <div class="tl-body">
    <h3 class="tl-role">Growing Organic Search Visibility</h3>
    <div class="tl-case-breakdown">
      <div class="tl-case-row">
        <span class="tl-case-label">Problem</span>
        <p class="tl-case-val">Stagnant organic traffic and low keyword rankings in traditional search channels.</p>
      </div>
      <div class="tl-case-row">
        <span class="tl-case-label">Industry</span>
        <p class="tl-case-val">E-commerce / Digital Growth</p>
      </div>
      <div class="tl-case-row">
        <span class="tl-case-label">What I Did</span>
        <p class="tl-case-val">Mapped priority search intent, built interconnected topic-cluster content architectures, fixed site structure and internal linking via technical SEO, and optimized for featured snippets.</p>
      </div>
      <div class="tl-case-row tl-case-row-result">
        <span class="tl-case-label">Result</span>
        <p class="tl-case-val tl-case-val-result">+32% organic traffic growth (12K to 16.5K monthly sessions), +18% position-zero lift, and +12% revenue uplift.</p>
      </div>
    </div>
  </div>
  <ul class="tl-cases">
    <li>
      <button type="button" class="case is-strategy-trigger" data-strategy="seocase" data-case="seo-organic-growth">
        <span class="tl-dot tl-dot-case"></span>
        <span class="case-icon case-icon-seo" aria-hidden="true">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2C12 7.5 7.5 12 2 12c5.5 0 10 4.5 10 10 0-5.5 4.5-10 10-10-5.5 0-10-4.5-10-10Z"/>
          </svg>
        </span>
        <span class="case-text">
          <span class="case-title">SEO & Organic Growth Engineering <span class="case-flagship-pill">Case Study</span></span>
          <span class="case-desc">Topic clusters, technical site health, position-zero capture & commercial search intent optimization.</span>
        </span>
        <span class="case-arrow" aria-hidden="true">↗</span>
      </button>
    </li>
  </ul>
</li>
<li class="tl-entry tl-entry-case-study">
  <div class="tl-head">
    <span class="tl-year"><span class="tl-route">CASE</span><span class="tl-yearnum">2023</span></span>
    <span class="tl-dot tl-dot-now" aria-hidden="true"></span>
    <h2 class="tl-company"><button type="button" class="tl-title-btn is-strategy-trigger" data-strategy="paidmediacase">Case Study</button></h2>
    <span class="tl-badge">Paid Advertising</span>
  </div>
  <div class="tl-body">
    <h3 class="tl-role">Paid Media & ROAS Optimization</h3>
    <div class="tl-case-breakdown">
      <div class="tl-case-row">
        <span class="tl-case-label">Problem</span>
        <p class="tl-case-val">High Customer Acquisition Cost (CAC) and low Return on Ad Spend (ROAS).</p>
      </div>
      <div class="tl-case-row">
        <span class="tl-case-label">Industry</span>
        <p class="tl-case-val">E-commerce / D2C</p>
      </div>
      <div class="tl-case-row">
        <span class="tl-case-label">Strategy</span>
        <div class="tl-case-val tl-case-pillars-inline">
          <p><strong>01. Audience Restructuring:</strong> Refined custom and lookalike segmentation across Meta and Google Ads.</p>
          <p><strong>02. Creative Testing:</strong> Deployed a systematic ad variation testing framework to combat ad fatigue.</p>
          <p><strong>03. Funnel Optimization:</strong> Aligned ad messaging with landing pages to boost overall conversion rates.</p>
        </div>
      </div>
      <div class="tl-case-row tl-case-row-result">
        <span class="tl-case-label">Result</span>
        <p class="tl-case-val tl-case-val-result">-22% reduction in CAC, an improved ROAS of 3.4x, and a +27% sales uplift within 90 days.</p>
      </div>
    </div>
  </div>
  <ul class="tl-cases">
    <li>
      <button type="button" class="case is-strategy-trigger" data-strategy="paidmediacase" data-case="paid-media">
        <span class="tl-dot tl-dot-case"></span>
        <span class="case-icon case-icon-paidmedia" aria-hidden="true">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22"/>
          </svg>
        </span>
        <span class="case-text">
          <span class="case-title">Paid Media & ROAS Optimization <span class="case-flagship-pill">Case Study</span></span>
          <span class="case-desc">Audience restructuring, multivariate creative testing & high-converting landing page funnel alignment.</span>
        </span>
        <span class="case-arrow" aria-hidden="true">↗</span>
      </button>
    </li>
  </ul>
</li>
<li class="tl-entry tl-entry-products">
  <div class="tl-head">
    <span class="tl-dot tl-dot-now" aria-hidden="true"></span>
    <h2 class="tl-company">My Work</h2>
    <span class="tl-badge">Selected Projects</span>
  </div>
  <div class="tl-body">
    <h3 class="tl-role">Landing Page & Digital Experience Builder</h3>
    <p class="tl-desc">Designed and built high-converting landing pages and digital experiences from the ground up, combining clean UI/UX, responsive design, conversion-focused structure, and front-end execution.</p>
  </div>
  <ul class="tl-cases">
    ${products.map(productCaseRow).join("")}
  </ul>
</li>
</ol>
<div class="folio-outro reveal">
  <div class="outro-text">
    <p class="outro-title">Thank you for flying. Let's grow something together.</p>
    <a href="${profile.whatsapp}?text=${encodeURIComponent("Hi Ismail, let's talk.")}" target="_blank" rel="noopener noreferrer" class="outro-whatsapp-cta">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.14 4.12 13.68 4.12 12.18C4.12 7.64 7.82 3.67 12.05 3.67M9.04 7.67C8.88 7.67 8.63 7.73 8.42 7.96C8.21 8.19 7.62 8.74 7.62 9.87C7.62 11 8.44 12.09 8.56 12.24C8.67 12.4 10.18 14.72 12.49 15.72C13.04 15.96 13.47 16.1 13.8 16.21C14.36 16.39 14.86 16.36 15.26 16.3C15.71 16.23 16.64 15.74 16.83 15.2C17.03 14.67 17.03 14.21 16.97 14.12C16.91 14.03 16.76 13.97 16.53 13.86C16.3 13.74 15.18 13.19 14.97 13.11C14.76 13.04 14.61 13 14.45 13.23C14.3 13.46 13.87 13.97 13.74 14.12C13.61 14.28 13.48 14.3 13.25 14.18C13.02 14.07 12.28 13.83 11.41 13.05C10.73 12.44 10.27 11.69 10.14 11.47C10.01 11.24 10.13 11.11 10.24 11C10.35 10.89 10.48 10.72 10.6 10.59C10.71 10.45 10.76 10.35 10.83 10.2C10.91 10.05 10.87 9.92 10.81 9.8C10.76 9.69 10.3 8.56 10.11 8.11C9.92 7.67 9.73 7.73 9.58 7.72C9.44 7.71 9.28 7.71 9.12 7.71L9.04 7.67Z"/></svg>
      <span>Let's talk</span>
      <span aria-hidden="true" style="font-size: 11px;">↗</span>
    </a>
  </div>
</div>
</section>
</div>
<div class="folio-footer-fx" aria-hidden="true"><div class="pb pb1"></div><div class="pb pb2"></div><div class="pb pb3"></div><div class="pb pb4"></div><div class="pb pb5"></div><div class="folio-footer-tint"></div></div>
<footer class="folio-footer"><nav class="ff-links" aria-label="Portfolio links"><button class="ff-link" id="return-gate"><span class="ff-link-label">Return to gate</span></button><a class="ff-link" href="/Ismail_Bettoumi_CV.pdf" target="_blank" rel="noopener noreferrer"><span class="ff-link-label">CV / Resume</span></a><a class="ff-link" href="${profile.whatsapp}" target="_blank" rel="noopener noreferrer"><span class="ff-link-label">WhatsApp</span></a><a class="ff-link" href="${profile.linkedin}" target="_blank" rel="noopener noreferrer"><span class="ff-link-label">LinkedIn</span></a></nav></footer>
</main>
<div class="pass-stage" id="gate" tabindex="-1" role="dialog" aria-modal="true" aria-label="Welcome aboard Ismail's portfolio">
  <div class="pass-canvas" id="scanner"></div>
  <button class="scan-keyboard" id="scan-pass">Scan Boarding Pass</button>
  <div class="scan-arrow-guide" id="scan-arrow" role="button" tabindex="0" aria-label="Scan boarding pass">
    <div class="scan-arrow-disc">
      <svg class="scan-arrow-svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="12" y1="4" x2="12" y2="18"></line>
        <polyline points="18 12 12 18 6 12"></polyline>
      </svg>
    </div>
  </div>
  <div class="gate-actions-wrap">
    <p class="pass-hint shimmer" id="pass-status" role="status" aria-live="polite">Click or swipe boarding pass to enter</p>
    <button class="quick-scan-pill" id="quick-scan-btn" type="button" aria-label="Scan boarding pass and enter portfolio">
      <span class="qsp-glow" aria-hidden="true"></span>
      <span class="qsp-icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
          <path d="M17 7V5a2 2 0 0 0-2-2h-2"/>
          <path d="M3 13v2a2 2 0 0 0 2 2h2"/>
          <path d="M17 13v2a2 2 0 0 1-2 2h-2"/>
          <line x1="3" y1="10" x2="17" y2="10"/>
        </svg>
      </span>
      <span class="qsp-label">Tap to Scan</span>
      <span class="qsp-arrow" aria-hidden="true">→</span>
    </button>
  </div>
  <button class="skip-link" id="skip-intro">Skip</button>
</div>
<dialog class="memory-dialog"><button class="close-dialog" aria-label="Close image"><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg></button><img alt=""><p></p></dialog>
<dialog class="aeo-modal-dialog" id="aeo-dialog" aria-labelledby="aeo-modal-title">
  <div class="aeo-modal-box">
    <button class="aeo-close-btn" id="close-aeo-btn" aria-label="Close dialog">
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>
    </button>
    <div class="aeo-modal-header">
      <div class="aeo-pill-badge">
        <span class="aeo-badge-dot" aria-hidden="true"></span>
        <span>${aeoKiller.kicker}</span>
      </div>
      <h2 class="aeo-modal-title" id="aeo-modal-title">${aeoKiller.name}</h2>
      <p class="aeo-modal-tagline">${aeoKiller.headline}</p>
      <p class="aeo-modal-summary">${aeoKiller.value}</p>
    </div>
    <div class="aeo-features-list">
      ${aeoKiller.benefits.map((b) => `
        <div class="aeo-feature-item">
          <div class="aeo-feature-icon-box" aria-hidden="true">
            ${aeoIcons[b.icon] || projectIcons.aevis || projectIcons.aeokiller}
          </div>
          <div class="aeo-feature-text">
            <h3 class="aeo-feature-title">${b.title}</h3>
            <p class="aeo-feature-desc">${b.desc}</p>
          </div>
        </div>
      `).join("")}
    </div>
    <div class="aeo-modal-cta-wrap">
      <a href="${aeoKiller.href}" target="_blank" rel="noopener noreferrer" class="aeo-apple-cta" id="aeo-discover-btn">
        <span>Discover More</span>
        <svg class="aeo-cta-arrow" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
      </a>
    </div>
  </div>
</dialog>
<dialog class="strategy-modal-dialog" id="strategy-dialog" aria-labelledby="strategy-modal-title">
  <div class="strategy-modal-box">
    <button class="strategy-close-btn" id="close-strategy-btn" aria-label="Close dialog">
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>
    </button>
    <div class="strategy-modal-content" id="strategy-modal-content"></div>
  </div>
</dialog>`;
const folio = document.querySelector("#portfolio"),
  gate = document.querySelector("#gate");
const interviewCard = document.querySelector(".interview-card");
const interviewWidget = interviewCard.querySelector("elevenlabs-convai");
customElements.whenDefined("elevenlabs-convai").then(() => {
  const shadow = interviewWidget.shadowRoot;
  if (!shadow) return;
  const syncOpenState = () => {
    interviewCard.classList.toggle(
      "agent-open",
      Boolean(shadow.querySelector('button[aria-label="Collapse"]')),
    );
  };
  new MutationObserver(syncOpenState).observe(shadow, {
    childList: true,
    subtree: true,
  });
  syncOpenState();
});
const detail = document.createElement("main");
detail.className = "case-page";
detail.hidden = true;
detail.tabIndex = -1;
document.querySelector("#app").append(detail);
let scanner = null,
  entered = false;
function enter() {
  if (entered) return;
  entered = true;
  sessionStorage.setItem("yb:entered", "1");
  store.set("yb:boarded", "1");
  gate.classList.add("leaving");
  folio.inert = false;
  detail.inert = false;
  document.documentElement.classList.remove("is-covered");
  folio.classList.remove("booting");
  folio.classList.add("entering");
  if (!detail.hidden) detail.classList.add("entering");
  requestPathMeasure();
  setTimeout(
    () => {
      gate.hidden = true;
      scanner?.dispose();
      scanner = null;
      folio.classList.remove("entering");
      detail.classList.remove("entering");
      (detail.hidden ? folio : detail).focus({ preventScroll: true });
    },
    reduced.matches ? 0 : 600,
  );
}
async function showGate() {
  entered = false;
  gate.hidden = false;
  gate.classList.remove("leaving");
  folio.inert = true;
  folio.classList.add("booting");
  folio.classList.remove("entering");
  detail.classList.remove("entering");
  document.documentElement.classList.add("is-covered");
  window.scrollTo(0, 0);
  const passStatus = document.querySelector("#pass-status");
  passStatus.textContent = "Click or swipe boarding pass to enter";
  passStatus.classList.remove("granted");
  await Promise.race([
    document.fonts?.ready ?? Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, 800)),
  ]);
  try {
    const { mountScanner } = await import("./scanner.js");
    if (entered) return;
    scanner = mountScanner(document.querySelector("#scanner"), {
      onSuccess() {
        passStatus.classList.remove("shimmer");
        passStatus.classList.add("granted");
        passStatus.innerHTML =
          '<span class="status-check" aria-hidden="true">✓</span> Access granted';
        setTimeout(enter, reduced.matches ? 0 : 280);
      },
      onStatus(text) {
        passStatus.textContent = text;
      },
      reduced: reduced.matches,
    });
    const scanBtn = document.querySelector("#scan-pass");
    if (scanBtn) scanBtn.onclick = () => scanner.scan();
  } catch (e) {
    passStatus.textContent =
      "Welcome aboard. Enter to explore.";
    document.querySelector("#scan-pass").classList.add("fallback");
    document.querySelector("#scan-pass").onclick = enter;
    console.warn("3D scanner unavailable; accessible entry enabled.", e);
  }
  gate.focus({ preventScroll: true });
}
document.querySelector("#skip-intro").onclick = enter;
const passStatusEl = document.querySelector("#pass-status");
if (passStatusEl) {
  passStatusEl.onclick = (e) => {
    e.stopPropagation();
    scanner ? scanner.scan() : enter();
  };
}
const scanPassBtn = document.querySelector("#scan-pass");
if (scanPassBtn) {
  scanPassBtn.onclick = (e) => {
    e.stopPropagation();
    scanner ? scanner.scan() : enter();
  };
}
const scanArrow = document.querySelector("#scan-arrow");
if (scanArrow) {
  scanArrow.onclick = (e) => {
    e.stopPropagation();
    scanner ? scanner.scan() : enter();
  };
  scanArrow.onkeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      scanner ? scanner.scan() : enter();
    }
  };
}
const quickScanBtn = document.querySelector("#quick-scan-btn");
if (quickScanBtn) {
  quickScanBtn.onclick = (e) => {
    e.stopPropagation();
    scanner ? scanner.scan() : enter();
  };
}
const returnGateBtn = document.querySelector("#return-gate");
if (returnGateBtn) {
  returnGateBtn.onclick = () => {
    sessionStorage.removeItem("yb:entered");
    store.set("yb:boarded", "0");
    showGate();
  };
}
gate.onclick = (e) => {
  if (e.target === gate) {
    scanner ? scanner.scan() : enter();
  }
};
gate.addEventListener("wheel", (e) => {
  if (Math.abs(e.deltaY) > 30) enter();
}, { passive: true });
gate.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Enter" || e.key === " ") enter();
  if (e.key === "Tab") {
    const a = document.querySelector("#scan-pass"),
      b = document.querySelector("#skip-intro");
    if (e.shiftKey && document.activeElement === a) {
      e.preventDefault();
      b.focus();
    } else if (!e.shiftKey && document.activeElement === b) {
      e.preventDefault();
      a.focus();
    }
  }
});

// Shade position and theme share one progress value, including during a drag.
let shade = store.get("yb:theme") === "dark" ? 1 : 0,
  drag = null;
const windowEl = document.querySelector(".plane-window"),
  shadeButton = document.querySelector(".shade-control");
function applyShade(value, settle = false) {
  shade = Math.max(0, Math.min(1, value));
  windowEl.style.setProperty("--shade", shade);
  document.documentElement.dataset.theme = shade > 0.52 ? "dark" : "light";
  shadeButton.setAttribute("aria-pressed", String(shade > 0.5));
  shadeButton.setAttribute(
    "aria-label",
    shade > 0.5 ? "Open the window shade" : "Close the window shade",
  );
  if (settle) store.set("yb:theme", shade > 0.5 ? "dark" : "light");
}
applyShade(shade);
shadeButton.addEventListener("pointerdown", (e) => {
  drag = { y: e.clientY, start: shade, moved: false };
  shadeButton.setPointerCapture(e.pointerId);
  windowEl.classList.add("dragging");
});
shadeButton.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const dy = e.clientY - drag.y;
  if (Math.abs(dy) > 4) drag.moved = true;
  applyShade(drag.start + dy / 171);
});
function releaseShade() {
  if (!drag) return;
  const moved = drag.moved;
  drag = null;
  windowEl.classList.remove("dragging");
  applyShade(moved ? (shade > 0.5 ? 1 : 0) : shade > 0.5 ? 0 : 1, true);
}
shadeButton.addEventListener("pointerup", releaseShade);
shadeButton.addEventListener("pointercancel", () => {
  drag = null;
  windowEl.classList.remove("dragging");
  applyShade(shade > 0.5 ? 1 : 0, true);
});
shadeButton.addEventListener("click", (e) => {
  if (e.detail === 0) applyShade(shade > 0.5 ? 0 : 1, true);
});
const path = document.querySelector(".folio-path"),
  rail = document.querySelector(".path-rail"),
  track = document.querySelector(".folio-track"),
  curve = document.querySelector(".path-curve"),
  curvePaths = curve.querySelectorAll("path"),
  curveReveal = curve.querySelector(".path-reveal"),
  timelineDots = [...document.querySelectorAll(".tl-dot")];
const clamp01 = (value) => Math.max(0, Math.min(1, value));
let pathFrame = 0,
  measureFrame = 0,
  pathMetrics;

function measurePath() {
  measureFrame = 0;
  const width = curve.clientWidth || 44,
    height = curve.clientHeight || 110,
    bend = `M ${width} 0 V ${height * 0.23} C ${width} ${height * 0.58} 0 ${height * 0.42} 0 ${height * 0.78} V ${height}`;

  curve.setAttribute("viewBox", `0 0 ${width} ${height}`);
  curvePaths.forEach((curvePath) => curvePath.setAttribute("d", bend));
  curveReveal.setAttribute("width", width + 16);

  const scrollTop = window.scrollY,
    curveRect = curve.getBoundingClientRect(),
    railRect = rail.getBoundingClientRect();
  pathMetrics = {
    curveTop: curveRect.top + scrollTop,
    curveHeight: curveRect.height,
    railTop: railRect.top + scrollTop,
    railHeight: railRect.height,
    dotY: timelineDots.map((dot) => {
      const rect = dot.getBoundingClientRect();
      return rect.top + scrollTop + rect.height / 2;
    }),
  };
  requestPath();
}

function updatePath() {
  pathFrame = 0;
  if (!pathMetrics || folio.hidden || !entered) return;

  const viewportEdge = window.scrollY + innerHeight * 0.52,
    bottom =
      window.scrollY + innerHeight >= document.documentElement.scrollHeight - 3,
    complete = reduced.matches || bottom,
    curveProgress = complete
      ? 1
      : clamp01(
          (viewportEdge - pathMetrics.curveTop) / pathMetrics.curveHeight,
        ),
    railProgress = complete
      ? 1
      : clamp01(
          (viewportEdge - pathMetrics.railTop) / pathMetrics.railHeight,
        );

  curveReveal.setAttribute(
    "height",
    Math.max(0, curveProgress * pathMetrics.curveHeight + 8),
  );
  path.style.setProperty("--rail-p", railProgress);
  path.style.setProperty("--rail-y", railProgress * pathMetrics.railHeight);
  timelineDots.forEach((dot, index) => {
    const lit = complete || pathMetrics.dotY[index] <= viewportEdge;
    if (dot.classList.contains("is-lit") !== lit) {
      dot.classList.toggle("is-lit", lit);
    }
  });
}
function requestPath() {
  if (!pathFrame) {
    pathFrame = requestAnimationFrame(updatePath);
  }
}
function requestPathMeasure() {
  if (!measureFrame) {
    measureFrame = requestAnimationFrame(measurePath);
  }
}
window.addEventListener("scroll", requestPath, { passive: true });
window.addEventListener("resize", requestPathMeasure, { passive: true });
window.addEventListener("load", requestPathMeasure, { once: true });
new ResizeObserver(requestPathMeasure).observe(track);
document.fonts?.ready.then(requestPathMeasure);
const strategyDialog = document.querySelector("#strategy-dialog");
const strategyContent = document.querySelector("#strategy-modal-content");
const closeStrategyBtn = document.querySelector("#close-strategy-btn");

const memoryStrategyMap = {
  "placeholder-seo": "seo",
  "placeholder-media": "paidmedia",
  "placeholder-shopify": "shopify",
};

const dialog = document.querySelector(".memory-dialog");
document.querySelectorAll("[data-memory]").forEach(
  (button) =>
    (button.onclick = () => {
      const stratKey = memoryStrategyMap[button.dataset.memory];
      if (stratKey && strategyShowcases[stratKey]) {
        openStrategyModal(stratKey);
      } else {
        dialog.querySelector("img").src = shot(button.dataset.memory);
        dialog.querySelector("img").alt = button.querySelector("img").alt;
        dialog.querySelector("p").textContent = button.querySelector("img").alt;
        dialog.showModal();
      }
    }),
);
dialog.querySelector("button").onclick = () => dialog.close();
dialog.onclick = (e) => {
  if (e.target === dialog) dialog.close();
};

const aeoDialog = document.querySelector("#aeo-dialog");
const openAeoBtn = document.querySelector("#open-aeo-btn");
const closeAeoBtn = document.querySelector("#close-aeo-btn");

const strategyKeys = ["seo", "paidmedia", "shopify", "email", "aeocase", "seocase", "paidmediacase", "aeo", "analytics"];

function renderStrategyModalContent(key) {
  const s = strategyShowcases[key];
  if (!s) return "";

  const waMsg = s.ctaMessage
    ? encodeURIComponent(s.ctaMessage)
    : s.ctaLabel
      ? encodeURIComponent(`Hi Ismail, ${s.ctaLabel.toLowerCase().startsWith("let's talk") ? s.ctaLabel : `let's talk about ${s.ctaLabel}`}.`)
      : encodeURIComponent(`Hi Ismail, I would like to discuss your ${s.ctaSubject || s.title} strategy.`);
  const waUrl = `https://wa.me/97470773838?text=${waMsg}`;
  const linkedinUrl = "https://www.linkedin.com/in/ismail-bettoumi-868b04402/";
  const cleanCategory = s.category ? s.category.replace(/^CASE\s*\/\/\s*/i, "") : "";

  return `
    <div class="dash-modal">
      <!-- Top Badges -->
      <div class="dash-header-bar">
        <div class="dash-pills-row">
          <span class="dash-pill-tag">${s.tag}</span>
          ${cleanCategory ? `<span class="dash-category-meta">${cleanCategory}</span>` : ""}
        </div>
        ${
          s.verifiedBadge
            ? `
          <div class="dash-verified-tag">
            <svg class="dash-verified-icon" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3.5 8.5 6.5 11.5 12.5 4.5"/></svg>
            <span>${s.verifiedBadge}</span>
          </div>
        `
            : ""
        }
      </div>

      <!-- Title & Headline -->
      <div class="dash-title-wrap">
        <h2 class="dash-main-heading" id="strategy-modal-title">${s.title}</h2>
        <p class="dash-main-sub">${s.subtitle}</p>
        ${s.metaLine ? `<p class="dash-meta-line">${s.metaLine}</p>` : ""}
      </div>

      <!-- SECTION 1: THE RESULTS -->
      <div class="dash-section-block">
        <div class="dash-section-header">
          <span class="dash-section-eyebrow">Impact</span>
          <h3 class="dash-section-title">Key Results</h3>
        </div>
        <div class="dash-kpi-grid">
          ${s.topKpis
            .map(
              (kpi) => `
            <div class="dash-kpi-tile">
              <div class="dash-kpi-val">${kpi.value}</div>
              <div class="dash-kpi-label">${kpi.label}</div>
              <div class="dash-kpi-note">${kpi.sub}</div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>

      <!-- SECTION 2: HOW WE GOT THEM -->
      <div class="dash-section-block">
        <div class="dash-section-header">
          <span class="dash-section-eyebrow">Strategy</span>
          <h3 class="dash-section-title">Execution Pillars</h3>
        </div>
        <div class="dash-pillars-2x2">
          ${s.pillars
            .map(
              (p) => `
            <div class="dash-pillar-cell">
              <div class="dash-pillar-topline">
                <span class="dash-pillar-num">${p.num ? p.num.replace(/^PILLAR\s*/i, "") : ""}</span>
                <span class="dash-pillar-chip">${p.badge}</span>
              </div>
              <h4 class="dash-pillar-title">${p.title}</h4>
              <p class="dash-pillar-desc">${p.desc}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>

      <!-- DIRECT ACTIONS -->
      <div class="dash-action-bar">
        ${
          s.singleCta
            ? `
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="dash-cta-btn dash-cta-whatsapp dash-cta-single">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.14 4.12 13.68 4.12 12.18C4.12 7.64 7.82 3.67 12.05 3.67M9.04 7.67C8.88 7.67 8.63 7.73 8.42 7.96C8.21 8.19 7.62 8.74 7.62 9.87C7.62 11 8.44 12.09 8.56 12.24C8.67 12.4 10.18 14.72 12.49 15.72C13.04 15.96 13.47 16.1 13.8 16.21C14.36 16.39 14.86 16.36 15.26 16.3C15.71 16.23 16.64 15.74 16.83 15.2C17.03 14.67 17.03 14.21 16.97 14.12C16.91 14.03 16.76 13.97 16.53 13.86C16.3 13.74 15.18 13.19 14.97 13.11C14.76 13.04 14.61 13 14.45 13.23C14.3 13.46 13.87 13.97 13.74 14.12C13.61 14.28 13.48 14.3 13.25 14.18C13.02 14.07 12.28 13.83 11.41 13.05C10.73 12.44 10.27 11.69 10.14 11.47C10.01 11.24 10.13 11.11 10.24 11C10.35 10.89 10.48 10.72 10.6 10.59C10.71 10.45 10.76 10.35 10.83 10.2C10.91 10.05 10.87 9.92 10.81 9.8C10.76 9.69 10.3 8.56 10.11 8.11C9.92 7.67 9.73 7.73 9.58 7.72C9.44 7.71 9.28 7.71 9.12 7.71L9.04 7.67Z"/></svg>
            <span>${s.ctaLabel || "Let's talk about Aevis"}</span>
            <span aria-hidden="true" style="font-size: 11px;">↗</span>
          </a>
        `
            : `
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="dash-cta-btn dash-cta-whatsapp">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.14 4.12 13.68 4.12 12.18C4.12 7.64 7.82 3.67 12.05 3.67M9.04 7.67C8.88 7.67 8.63 7.73 8.42 7.96C8.21 8.19 7.62 8.74 7.62 9.87C7.62 11 8.44 12.09 8.56 12.24C8.67 12.4 10.18 14.72 12.49 15.72C13.04 15.96 13.47 16.1 13.8 16.21C14.36 16.39 14.86 16.36 15.26 16.3C15.71 16.23 16.64 15.74 16.83 15.2C17.03 14.67 17.03 14.21 16.97 14.12C16.91 14.03 16.76 13.97 16.53 13.86C16.3 13.74 15.18 13.19 14.97 13.11C14.76 13.04 14.61 13 14.45 13.23C14.3 13.46 13.87 13.97 13.74 14.12C13.61 14.28 13.48 14.3 13.25 14.18C13.02 14.07 12.28 13.83 11.41 13.05C10.73 12.44 10.27 11.69 10.14 11.47C10.01 11.24 10.13 11.11 10.24 11C10.35 10.89 10.48 10.72 10.6 10.59C10.71 10.45 10.76 10.35 10.83 10.2C10.91 10.05 10.87 9.92 10.81 9.8C10.76 9.69 10.3 8.56 10.11 8.11C9.92 7.67 9.73 7.73 9.58 7.72C9.44 7.71 9.28 7.71 9.12 7.71L9.04 7.67Z"/></svg>
            <span>WhatsApp</span>
          </a>
          <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" class="dash-cta-btn dash-cta-linkedin">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.55a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z"/></svg>
            <span>LinkedIn Profile</span>
          </a>
          ${
            s.externalHref
              ? `
            <a href="${s.externalHref}" target="_blank" rel="noopener noreferrer" class="dash-cta-btn dash-cta-platform">
              <span>${s.externalLabel || "Launch Aevis Platform ↗"}</span>
            </a>
          `
              : ""
          }
        `
        }
      </div>
    </div>
  `;
}

function openStrategyModal(key) {
  if (!strategyDialog || !strategyShowcases[key]) return;
  strategyContent.innerHTML = renderStrategyModalContent(key);
  strategyDialog.showModal();
}

if (closeStrategyBtn && strategyDialog) {
  closeStrategyBtn.addEventListener("click", () => strategyDialog.close());
}
if (strategyDialog) {
  strategyDialog.addEventListener("click", (e) => {
    if (e.target === strategyDialog) {
      strategyDialog.close();
    }
  });
  strategyDialog.addEventListener("close", () => {
    if (
      location.pathname.includes("/case-studies/aeo-citation-growth") ||
      location.pathname.includes("/case-studies/seo-organic-growth") ||
      location.pathname.includes("/case-studies/paid-advertising")
    ) {
      history.replaceState(null, "", "/");
    }
  });
}

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-strategy]");
  if (trigger) {
    e.preventDefault();
    const strat = trigger.dataset.strategy;
    if (strat === "aeocase") {
      navigateAeoCase();
    } else if (strat === "seocase") {
      navigateSeoCase();
    } else if (strat === "paidmediacase" || strat === "paidmedia") {
      navigatePaidMediaCase();
    } else {
      openStrategyModal(strat);
    }
    return;
  }
});

if (openAeoBtn) {
  openAeoBtn.addEventListener("click", () => {
    openStrategyModal("aeo");
  });
}
if (closeAeoBtn && aeoDialog) {
  closeAeoBtn.addEventListener("click", () => {
    aeoDialog.close();
  });
}
if (aeoDialog) {
  aeoDialog.addEventListener("click", (e) => {
    if (e.target === aeoDialog) {
      aeoDialog.close();
    }
  });
}
// Show Boarding Pass on initial load unless already boarded in session
if (store.get("yb:boarded") === "1" && sessionStorage.getItem("yb:entered") === "1") {
  gate.hidden = true;
  entered = true;
  folio.inert = false;
  folio.classList.remove("booting");
  document.documentElement.classList.remove("is-covered");
  requestPathMeasure();
} else {
  showGate();
}

// Marketing skill summaries — each links to Ismail's LinkedIn for direct contact.
// outcomes or internal screenshots. Detail navigation mirrors the main flight.
const summaries = {
  aeo: {
    year: "2025",
    platform: "AEO · GEO Strategy · AI Recommendation",
    restricted: true,
  },
  analytics: {
    year: "2025",
    platform: "AI Reporting · Analytics · GA4 Pipelines",
    restricted: true,
  },
  seo: {
    year: "2024",
    platform: "SEO · AEO Strategy · Organic Growth",
    restricted: true,
  },
  paidmedia: {
    year: "2023",
    platform: "Paid Advertising · Google & Meta Ads",
    restricted: true,
  },
  email: {
    year: "2023",
    platform: "Email Marketing · HubSpot · Lifecycle",
    restricted: true,
  },
  shopify: {
    year: "2024",
    platform: "Shopify · E-commerce CRO",
    restricted: true,
  },
  offers: {
    year: "2026",
    platform: "AI · Offers · Personalization",
    restricted: true,
  },
  akm: {
    year: "2026",
    platform: "AI · Knowledge intelligence",
    restricted: true,
  },
  pulse: {
    year: "2025",
    platform: "AI · Travel discovery",
    overview:
      "Emotion-aware, prompt-less AI travel recommender exploring discovery through emotional resonance rather than written queries.",
    heading: "Introducing a new way to explore",
    body: "Introduced The Pulse with Ramya Ravindran at Web Summit Qatar 2025 at the Qatar Airways booth, exploring the intersection of travel, emotion, and emerging tech.",
    image: "pulse",
    caption: "Dream Destination: The Pulse — Web Summit Qatar 2025",
  },
  sama: {
    year: "2025",
    platform: "AI · Customer experience",
    overview:
      "Showcasing Qatar Airways' next-gen AI cabin crew and conversational travel experiences at Web Summit Qatar 2025.",
    heading: "From ambitious idea to shared experience",
    body: "Part of the team demonstrating AI customer experiences at Web Summit Qatar, exchanging ideas with global tech leaders and collaborators.",
    image: "summit",
    caption: "Sharing Qatar Airways innovations at Web Summit Qatar 2025",
  },
  football: {
    year: "2026",
    platform: "iOS · Android · Loyalty",
    overview:
      "Privilege Club in-app quiz bringing members closer to the FIFA World Cup 2026™ with interactive trivia and rewards.",
    heading: "Building meaningful customer experiences",
    body: "Collaborated on sports, loyalty, and digital engagement features designed to maximize fan participation and member value.",
    image: "football",
    caption: "Qatar Airways Privilege Club — FIFA World Cup 2026™",
  },
};
const keys = ["aeo", "analytics", "seo", "paidmedia", "email", "shopify"];
const projectNavName = (key) =>
  ({
    aeo: "AEO Strategy",
    analytics: "AI Analytics",
    seo: "AEO & SEO",
    paidmedia: "Paid Ads",
    email: "Email Marketing",
    shopify: "Shopify CRO",
    offers: "Offers",
    akm: "AKM",
    football: "World Cup",
    pulse: "The Pulse",
    sama: "Sama",
  })[key] || "Project";
let homeScroll = 0;
function navigateProject(key, push = true) {
  if (!summaries[key] || projects[key]?.clickable === false) return;
  if (!folio.hidden) homeScroll = scrollY;
  if (push) history.pushState({ project: key }, "", `/work/${key}`);
  const p = projects[key],
    s = summaries[key],
    idx = keys.indexOf(key),
    prev = keys[(idx - 1 + keys.length) % keys.length],
    next = keys[(idx + 1) % keys.length];
  folio.hidden = true;
  detail.hidden = false;
  detail.inert = !entered;
  document.title = `${p.title} — Ismail Bettoumi`;
  const content = s.restricted
    ? `<article class="cs-flow restricted-project"><div class="cs-col cs-reveal is-in"><header class="cs-header"><p class="cs-eyebrow">${s.year}<span class="cs-eyebrow-dot"></span>${s.platform}</p><h1 class="cs-title">${p.title}</h1><p class="cs-blurb">${p.desc}</p></header><section class="project-access" aria-labelledby="project-access-title"><span class="project-access-icon case-icon-${p.icon}" aria-hidden="true">${projectIcons[p.icon]}</span><p class="project-access-kicker">Selected project</p><h2 class="project-access-title" id="project-access-title">The details stay in the room.</h2><p class="project-access-copy">Contact Ismail for more details about this project.</p><a class="project-access-link" href="${profile.linkedin}" target="_blank" rel="noopener noreferrer">Contact Ismail <span aria-hidden="true">↗</span></a></section></div></article>`
    : `<article class="cs-flow"><div class="cs-col cs-reveal is-in"><header class="cs-header"><p class="cs-eyebrow">${s.year}<span class="cs-eyebrow-dot"></span>${s.platform}</p><h1 class="cs-title">${p.title}</h1><p class="cs-blurb">${p.desc}</p></header><section class="cs-overview"><p class="cs-gutter-label">Overview</p><p class="cs-lede">${s.overview}</p></section></div><div class="cs-full cs-reveal is-in"><figure class="cs-figure is-wide project-figure"><button class="cs-figure-card" data-enlarge="${s.image}" aria-label="Enlarge ${p.title} image"><img src="${shot(s.image)}" alt="${s.caption}"></button><figcaption class="cs-figcaption">${s.caption}</figcaption></figure></div><section class="cs-col cs-deep cs-reveal is-in"><h2 class="cs-heading">${s.heading}</h2><p class="cs-body">${s.body}</p><a class="project-source" href="${p.href}" target="_blank" rel="noopener noreferrer">Read my original post <span aria-hidden="true">↗</span></a></section></article>`;
  detail.innerHTML = `${content}<div class="folio-footer-fx" aria-hidden="true"><div class="pb pb1"></div><div class="pb pb2"></div><div class="pb pb3"></div><div class="pb pb4"></div><div class="pb pb5"></div><div class="folio-footer-tint"></div></div><nav class="cs-nav" aria-label="Projects"><a class="cs-nav-btn is-back" href="/work/${prev}" data-project="${prev}"><span class="cs-nav-kicker">‹ Back</span><span class="cs-nav-name">${projectNavName(prev)}</span></a><a class="cs-nav-home" href="/" data-home aria-label="Back to portfolio"><svg class="cs-nav-home-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10 12 4l8 6v10h-6v-6h-4v6H4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></a><a class="cs-nav-btn is-next" href="/work/${next}" data-project="${next}"><span class="cs-nav-kicker">Next ›</span><span class="cs-nav-name">${projectNavName(next)}</span></a></nav>`;
  const enlarge = detail.querySelector("[data-enlarge]");
  if (enlarge) enlarge.onclick = () => {
      dialog.querySelector("img").src = shot(s.image);
      dialog.querySelector("img").alt = s.caption;
      dialog.querySelector("p").textContent = s.caption;
      dialog.showModal();
    };
  window.scrollTo(0, 0);
  detail.focus({ preventScroll: true });
}
function showHome(push = true) {
  if (push) history.pushState(null, "", "/");
  detail.hidden = true;
  folio.hidden = false;
  document.title = "Ismail Bettoumi — Digital Marketing";
  window.scrollTo(0, homeScroll);
  requestPathMeasure();
  folio.focus({ preventScroll: true });
}
function navigateAeoCase(push = true) {
  if (detail && !detail.hidden) showHome(false);
  if (push) history.pushState({ case: "aeo-citation-growth" }, "", "/case-studies/aeo-citation-growth/");
  openStrategyModal("aeocase");
}
function navigateSeoCase(push = true) {
  if (detail && !detail.hidden) showHome(false);
  if (push) history.pushState({ case: "seo-organic-growth" }, "", "/case-studies/seo-organic-growth/");
  openStrategyModal("seocase");
}
function navigatePaidMediaCase(push = true) {
  if (detail && !detail.hidden) showHome(false);
  if (push) history.pushState({ case: "paid-media" }, "", "/case-studies/paid-advertising/");
  openStrategyModal("paidmediacase");
}
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-project],[data-home],[data-case],a[href*='/case-studies/aeo-citation-growth'],a[href*='/case-studies/seo-organic-growth'],a[href*='/case-studies/paid-advertising']");
  if (
    !link ||
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey
  )
    return;
  e.preventDefault();
  if (link.hasAttribute("data-home")) {
    showHome();
  } else if (
    link.dataset.case === "aeo-citation-growth" ||
    link.getAttribute("href")?.includes("/case-studies/aeo-citation-growth")
  ) {
    navigateAeoCase();
  } else if (
    link.dataset.case === "seo-organic-growth" ||
    link.getAttribute("href")?.includes("/case-studies/seo-organic-growth")
  ) {
    navigateSeoCase();
  } else if (
    link.dataset.case === "paid-media" ||
    link.getAttribute("href")?.includes("/case-studies/paid-advertising")
  ) {
    navigatePaidMediaCase();
  } else if (link.dataset.project) {
    navigateProject(link.dataset.project);
  }
});
window.addEventListener("popstate", () => {
  if (location.pathname.includes("/case-studies/aeo-citation-growth")) {
    if (detail && !detail.hidden) showHome(false);
    openStrategyModal("aeocase");
  } else if (location.pathname.includes("/case-studies/seo-organic-growth")) {
    if (detail && !detail.hidden) showHome(false);
    openStrategyModal("seocase");
  } else if (location.pathname.includes("/case-studies/paid-advertising")) {
    if (detail && !detail.hidden) showHome(false);
    openStrategyModal("paidmediacase");
  } else {
    if (strategyDialog?.open) strategyDialog.close();
    const key = location.pathname.split("/")[2];
    summaries[key] ? navigateProject(key, false) : showHome(false);
  }
});
if (location.pathname.includes("/case-studies/aeo-citation-growth")) {
  enter();
  navigateAeoCase(false);
} else if (location.pathname.includes("/case-studies/seo-organic-growth")) {
  enter();
  navigateSeoCase(false);
} else if (location.pathname.includes("/case-studies/paid-advertising")) {
  enter();
  navigatePaidMediaCase(false);
} else {
  const initialProject = location.pathname.split("/")[2];
  if (summaries[initialProject] && projects[initialProject]?.clickable !== false) {
    enter();
    navigateProject(initialProject, false);
  }
}
import("./sky.js")
  .then(({ mountSky }) => mountSky(document.querySelector(".sky"), windowEl))
  .catch(() => {
    /* The static cloud view remains available without WebGL. */
  });
