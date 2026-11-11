import fs from 'node:fs/promises';
import {experiments} from '../src/portfolioContent.js';
import {caseReviews} from '../src/caseReviewContent.js';
import {writeIfChanged} from '../lib/writeIfChanged.js';

const safe=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const cards=experiments.map(([name,description,href])=>{
  const id=href.split('/')[2],project=caseReviews[id];
  if(!project)throw Error(`Missing case context: ${id}`);
  return `<li id="work-${id}" data-project-entry tabindex="-1" aria-labelledby="title-${id}"><p class="project-kind">${safe(project.type)}</p><h2 id="title-${id}"><a href="${href}" data-project-case>${safe(name)} <span aria-hidden="true">↗</span></a></h2><p>${safe(description)}</p><p class="project-status">${safe(project.state)}</p></li>`;
}).join('\n');
const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>More product explorations · Ismail Bettoumi</title><meta name="description" content="Six additional product-design explorations, with implementation scope and evidence boundaries."><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/projects/project-index.css"><script defer src="/projects/project-index.js"></script></head>
<body><a class="index-skip" href="#project-index">Skip to projects</a><header><a class="index-name" href="/#selected-work">Ismail Bettoumi</a><nav aria-label="Portfolio navigation"><a href="/#selected-work">← Selected work</a><a href="/cv.html">Resume</a></nav></header>
<main id="project-index" tabindex="-1"><p class="index-eyebrow">ADDITIONAL WORK · 6 PROJECTS</p><h1>More product explorations.</h1><p class="index-intro">Further work in recurring consumer tasks, resource discovery and AI interfaces. Each case separates implementation evidence, local interaction studies and the questions that still need evaluation.</p><ul class="project-list" aria-label="Additional project case studies">${cards}</ul><p class="index-return"><a href="/#selected-work">Return to selected work →</a></p></main>
<footer><p>Ismail Bettoumi · Product Designer · Doha</p><a href="mailto:bettoumi001@gmail.com">Get in touch</a></footer></body></html>\n`;
await fs.mkdir(new URL('../public/projects/',import.meta.url),{recursive:true});
console.log(await writeIfChanged(new URL('../public/projects/index.html',import.meta.url),html)?'Updated the six-project exploration index.':'Exploration index is current.');
