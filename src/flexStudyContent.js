import {flexStudyVersionNotice} from './flexVersionContent.js';

const safe=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function flexStudyBody({scenario,checks,measurement}){
 return `<main class="lab-main flex-study" id="study-main">
 ${flexStudyVersionNotice()}
 <p class="lab-boundary">Portfolio prototype. Use sample details only. Nothing is sent to a service, and no webinar place or appointment is reserved.</p>
 <header class="flex-offer" aria-labelledby="flex-offer-title">
  <p class="flex-wordmark">flex academy.</p>
  <p class="flex-eyebrow">Short-term rental learning</p>
  <h1 id="flex-offer-title">A clearer next step for your rental business.</h1>
  <p class="flex-offer-lede">Learn the foundations or explore systems for an operation you already run.</p>
  <div class="flex-offer-actions"><a class="flex-primary-link" href="#experience-app">Choose your learning path <span aria-hidden="true"></span></a><a class="flex-context-link" href="#flex-proof">See the operating context</a></div>
  <p class="flex-offer-note">Beginner webinar or operator strategy call. Dates and appointments in this prototype are demonstrations.</p>
 </header>
 <section class="flex-proof" id="flex-proof" tabindex="-1" aria-labelledby="flex-proof-title">
  <div class="flex-proof-intro"><p class="flex-eyebrow">Where the operating story comes from</p><h2 id="flex-proof-title">Experience you can trace.</h2><p>Operating experience explains the context. It does not establish Academy learner outcomes.</p></div>
  <div class="flex-proof-grid">
   <article><p class="flex-proof-stage">The accommodation business</p><h3>The Flex</h3><p>The Flex describes furnished stays and property management for guests, businesses and landlords.</p><a href="https://theflex.global/" target="_blank" rel="noopener noreferrer">Read The Flex’s own description <span aria-hidden="true"></span><span class="sr-only"> (opens a new tab)</span></a></article>
   <article><p class="flex-proof-stage">The operating tools</p><h3>Base360</h3><p>Base360 describes a rental-management platform developed from the team’s daily work at The Flex.</p><a href="https://base360.ai/" target="_blank" rel="noopener noreferrer">Read Base360’s operating story <span aria-hidden="true"></span><span class="sr-only"> (opens a new tab)</span></a></article>
   <article><p class="flex-proof-stage">The proposed learning offer</p><h3>Flex Academy</h3><p>The saved brief proposes beginner learning and operator strategy. Student results and approved programme terms are not supplied.</p><a href="index.html#review-evidence">Check the case’s evidence and limits</a></article>
  </div>
  <p class="flex-source-date">Company descriptions checked 22 October 2026. These are attributed company statements, not independent verification or student testimonials.</p>
 </section>
 <div class="lab-layout flex-task-layout">
  <section class="lab-card" id="experience-app" tabindex="-1" aria-label="Interactive Flex Academy study"><noscript>This interaction needs JavaScript. The offer context, case study and evaluation protocol remain readable without it.</noscript></section>
  <aside class="flex-review-aside" aria-label="Prototype review tools"><details class="lab-panel flex-review-tools"><summary>Prototype controls and review notes</summary><h2>What to inspect</h2><ul>${checks.map(check=>`<li>${safe(check)}</li>`).join('')}</ul>${scenario}<p class="lab-muted">The failure condition simulates one failed confirmation. Try again simulates recovery within the same sample request.</p><p class="lab-muted">This later portfolio iteration is not participant feedback, a client-approved release or a measured product outcome.</p><a class="lab-study-link" href="study-protocol.html">Open the task protocol </a></details></aside>
 </div>
 ${measurement}
 <p class="lab-status" id="lab-status" role="status" aria-live="polite" aria-atomic="true"></p>
 </main><script type="module" src="/projects/experience-lab.js"></script>`;
}
