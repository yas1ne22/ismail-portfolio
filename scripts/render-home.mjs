import fs from 'node:fs/promises';
import { renderHome } from '../src/portfolioContent.js';
import { renderClassicFallback } from '../src/classicPortfolio.js';
import { writeIfChanged } from '../lib/writeIfChanged.js';
const file=new URL('../index.html',import.meta.url);
let html=await fs.readFile(file,'utf8');
// Generate the alternate homepage only when it is already explicitly selected.
// Preparing project pages must never replace the active portfolio design.
const alternateSelected=html.includes('src="/src/portfolio.js"');
if(!alternateSelected){
  if(html.includes('src="/src/main.js"')){
    const fallback=`<!-- classic-home:start -->\n${renderClassicFallback()}\n<!-- classic-home:end -->`;
    if(html.includes('<!-- classic-home:start -->'))html=html.replace(/<!-- classic-home:start -->[\s\S]*?<!-- classic-home:end -->/,fallback);
    else if(html.includes('<div id="app"></div>'))html=html.replace('<div id="app"></div>',`<div id="app">${fallback}</div>`);
    else throw new Error('Existing homepage content needs review before inserting the static fallback.');
    html=html.replace(/\s*<div id="loader"[\s\S]*?<\/div>/,'');
    html=html.replace(/\s*<script\s+src="https:\/\/unpkg\.com\/@elevenlabs\/convai-widget-embed"[\s\S]*?<\/script>/,'');
    html=html.replace('href="/classic-review.css"','href="/classic-review-entry.css"');
    if(!html.includes('/classic-review-entry.css'))html=html.replace('</head>','    <link rel="stylesheet" href="/classic-review-entry.css">\n  </head>');
    const changed=await writeIfChanged(file,html);
    console.log(changed?'Updated the existing homepage fallback; original design preserved.':'Existing homepage is current; alternate draft remains inactive.');
  }else console.log('Preserved the selected homepage; alternate draft is inactive.');
}else{
const content=`<!-- portfolio:start -->\n${renderHome()}\n<!-- portfolio:end -->`;
if(html.includes('<!-- portfolio:start -->'))html=html.replace(/<!-- portfolio:start -->[\s\S]*?<!-- portfolio:end -->/,content);
else html=html.replace('<div id="app"></div>',content);
html=html.replace(/\s*<div id="loader"[\s\S]*?<\/div>/,'');
html=html.replace(/\s*<link\s+rel="preload"[\s\S]*?\/>/,'');
html=html.replace(/\s*<link rel="stylesheet" href="\/(style\.css|case\.css|projects\/nasaq\/assets\/onboarding\.css)"\s*\/?>/g,'');
if(!html.includes('/portfolio.css'))html=html.replace('</head>','    <link rel="stylesheet" href="/portfolio.css">\n  </head>');
html=html.replace(/\s*<script src="\/projects\/nasaq\/assets\/onboarding\.js"><\/script>/,'');
html=html.replace('src="/src/main.js"','src="/src/portfolio.js"');
html=html.replace(/\s*<script\s+src="https:\/\/unpkg\.com\/@elevenlabs\/convai-widget-embed"[\s\S]*?<\/script>/,'');
html=html.replace('content="#faf5f5"','content="#f8f8f4"');
html=html.replace(/"dateModified": "[^"]+"/,'"dateModified": "2026-10-20T21:30:00+03:00"');
html=html.replaceAll('Product Designer, UX Strategy & AI Enablement','Product Designer');
html=html.replaceAll('Product Designer — UX Strategy & AI Enablement','Product Designer');
const changed=await writeIfChanged(file,html);
console.log(changed?'Updated the static portfolio homepage.':'Static portfolio homepage is current.');
}
