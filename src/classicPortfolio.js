import {profile} from './data.js';
import {selectedWork, moreWork} from './portfolioContent.js';
import {attachClassicPreview,classicPreviewFigure} from './classicPreviews.js';

const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const introduction = 'I design connected customer journeys and Arabic-first systems. See the <a href="/projects/andalus/index.html">Andalus</a> and <a href="/projects/nasaq/case-study-en.html" data-nasaq-direct>Nasaq</a> case studies.';
const careerIntroduction = 'My marketing background made me attentive to how people discover, evaluate and return to a product. I bring that perspective into journey and interface decisions, using wireframes and working prototypes to make the flow concrete for a shared review.';
const projectStatus = project => `<span class="classic-project-status" id="work-${project.id || project.href.split('/')[2]}-status">${escape(project.status)} <time datetime="2026-10-21">· Status reviewed 21 Oct 2026</time></span>`;

function attachProjectStatus(link, project) {
  link.querySelector('.case-text').insertAdjacentHTML('beforeend', projectStatus(project));
  const status = link.querySelector('.classic-project-status');
  link.setAttribute('aria-describedby', [link.getAttribute('aria-describedby'), status.id].filter(Boolean).join(' '));
}

// The same links remain useful if the interactive travel presentation cannot load.
export function renderClassicFallback() {
  return `<main class="classic-fallback" aria-labelledby="fallback-name">
    <h1 id="fallback-name">${escape(profile.name)}</h1><p>Product Designer · Doha, Qatar</p>
    <p>${introduction}</p>
    <nav aria-label="Portfolio navigation"><a href="#selected-work">Selected work</a><a href="/cv.html">Resume</a><a href="#contact">Contact</a></nav>
    <section aria-labelledby="selected-work"><h2 id="selected-work" tabindex="-1">Selected work</h2>
      ${selectedWork.map(project => `<article id="work-${project.id}"><h3><a href="${project.href}">${project.name}</a></h3><p>${project.summary || project.description}</p>${projectStatus(project)}${classicPreviewFigure(project.id)}</article>`).join('')}
    </section>
    <section><h2>More work</h2><ul>${moreWork.map(project => `<li id="work-${project.href.split('/')[2]}" tabindex="-1"><a href="${project.href}">${project.name}</a>: ${project.summary || project.description}${projectStatus(project)}</li>`).join('')}</ul><p><a href="/projects/index.html">More product explorations · 6 projects </a></p>
    </section>
    <section><h2>Background</h2><p>${careerIntroduction}</p></section>
    <section aria-labelledby="contact"><h2 id="contact" tabindex="-1">Contact</h2><a href="mailto:${profile.email}">${profile.email}</a><p><a href="/Ismail_Bettoumi_CV.pdf" download>Download resume PDF</a> · <a href="${profile.linkedin}">LinkedIn</a></p></section>
  </main>`;
}

export function enhanceClassicPortfolio(document) {
  const folio = document.querySelector('#portfolio');
  const intro = folio.querySelector('.folio-intro');
  intro.querySelector('.folio-tagline').textContent = 'Product Designer';
  intro.querySelector('.folio-sub').innerHTML = introduction;
  intro.querySelector('.intro-spot-row').innerHTML = `<a class="intro-spot-pill" href="#selected-work"><span class="spot-pill-txt">Selected work </span></a><a class="intro-spot-pill" href="/cv.html"><span class="spot-pill-txt">Resume</span></a><a class="intro-spot-pill" href="mailto:${profile.email}"><span class="spot-pill-txt">Email me</span></a>`;
  document.querySelector('.skip-content').setAttribute('href', '#selected-work');

  const featured = folio.querySelector('#featured-case-studies');
  const heading = featured.querySelector('h2');
  heading.id = 'selected-work';
  heading.tabIndex = -1;
  const rows = featured.querySelector('.tl-cases');
  const moreCases = folio.querySelector('#more-case-studies');
  moreCases.insertAdjacentHTML('beforeend', '<p class="classic-more-projects"><a href="/projects/index.html">More product explorations · 6 projects <span aria-hidden="true"></span></a></p>');
  const flex = folio.querySelector('#more-case-studies a[href="/projects/flex-academy/index.html"]');
  if (flex) rows.append(flex.closest('li'));
  for (const project of selectedWork) {
    let row = project.id === 'andalus' ? rows.querySelector('[data-impact="andalus"]') : rows.querySelector(`a[href*="/projects/${project.id === 'flex' ? 'flex-academy' : project.id}/"]`);
    if (!row) throw new Error(`Missing selected project in the existing timeline: ${project.id}`);
    if (row.tagName === 'BUTTON') {
      const link = document.createElement('a');
      link.className = row.className;
      while (row.firstChild) link.append(row.firstChild);
      row.replaceWith(link);
      row = link;
    }
    row.href = project.href;
    row.closest('li').id = `work-${project.id}`;
    row.querySelector('.case-title').textContent = project.id === 'andalus' ? 'Andalus · Cart recovery program' : project.name;
    row.querySelector('.case-desc').textContent = project.summary || project.description;
    attachClassicPreview(document,row,project.id);
    attachProjectStatus(row,project);
  }
  // Keep case studies in normal browser history, including modifier-key opening.
  for (const link of folio.querySelectorAll('.folio-track a.case')) {
    link.removeAttribute('data-plugin-showcase');
    link.removeAttribute('target');
    if (link.closest('#featured-case-studies')) continue;
    const project = moreWork.find(item => item.href === link.getAttribute('href'));
    if (!project) continue;
    const id = project.href.split('/')[2];
    link.closest('li').id = `work-${id}`;
    link.querySelector('.case-desc').textContent = project.summary || project.description;
    attachProjectStatus(link,project);
  }

  folio.querySelector('#experience').insertAdjacentHTML('beforeend', `<div class="tl-body classic-career-note"><p>${careerIntroduction}</p></div>`);
  const contact = folio.querySelector('.folio-track > .folio-outro .outro-text');
  contact.id = 'contact';
  contact.tabIndex = -1;
  contact.insertAdjacentHTML('beforeend', `<p class="classic-email"><a href="mailto:${profile.email}">${profile.email}</a><button type="button" class="classic-copy-email">Copy email</button><span class="classic-copy-status" role="status"></span></p><p><a href="/Ismail_Bettoumi_CV.pdf" download>Download resume PDF</a> · <a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>`);
  contact.querySelector('.classic-copy-email').addEventListener('click', async () => {
    const status = contact.querySelector('.classic-copy-status');
    try {
      await globalThis.navigator.clipboard.writeText(profile.email);
      status.textContent = 'Email copied.';
    } catch {
      status.textContent = `Copy ${profile.email}, or use the email link.`;
    }
  });
  document.querySelector('#return-gate .ff-link-label').textContent = 'Try the boarding pass';
  const widget = folio.querySelector('elevenlabs-convai');
  const assistant = folio.querySelector('.interview-card');
  const details = document.createElement('details');
  details.innerHTML = `<summary>Ask my portfolio assistant</summary><p>Optional AI overview. For a personal response, <a href="mailto:${profile.email}">email me directly</a>.</p><button type="button" class="classic-load-assistant">Load assistant</button><p class="classic-assistant-status" role="status"></p>`;
  details.append(widget);
  assistant.replaceChildren(details);
  assistant.classList.add('classic-assistant');
  assistant.setAttribute('aria-label', 'Optional portfolio assistant');
  details.querySelector('button').addEventListener('click', event => {
    const button = event.currentTarget;
    if (document.querySelector('#portfolio-assistant-sdk')) return;
    button.disabled = true;
    const status = details.querySelector('.classic-assistant-status');
    status.textContent = 'Loading assistant…';
    const script = document.createElement('script');
    script.id = 'portfolio-assistant-sdk';
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.onload = () => { status.textContent = 'Assistant loaded.'; button.hidden = true; };
    script.onerror = () => { script.remove(); button.disabled = false; status.textContent = 'The assistant could not load. Try again or email me directly.'; };
    document.head.append(script);
  });
}

export function revealClassicTarget(document, hash) {
  let id;
  try { id = decodeURIComponent(hash.replace(/^#/, '')); } catch { return false; }
  const target = document.getElementById(id);
  if (!target) return false;
  for (let parent = target.parentElement; parent; parent = parent.parentElement) {
    if (parent.tagName === 'DETAILS') parent.open = true;
  }
  if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
  target.scrollIntoView();
  target.focus({preventScroll: true});
  return true;
}
