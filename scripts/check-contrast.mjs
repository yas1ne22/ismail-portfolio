import fs from 'node:fs/promises';
import {contrastChecks,contrastRatio} from '../src/contrastContent.js';
import {writeIfChanged} from '../lib/writeIfChanged.js';
const root=new URL('../',import.meta.url);
const source='public/projects/experience-lab.css';
const css=await fs.readFile(new URL(source,root),'utf8');
function colorOf(selector,property){
 const start=css.indexOf(selector+'{');if(start<0)throw Error('Missing selector: '+selector);
 const body=css.slice(start+selector.length+1,css.indexOf('}',start));
 const declaration=body.split(';').find(item=>item.slice(0,item.indexOf(':')).trim()===property);
 if(!declaration)throw Error(`Missing ${property} in ${selector}`);
 const color=declaration.match(/#[a-f\d]{3,6}\b|\bwhite\b|\bblack\b/i)?.[0]?.toLowerCase();
 if(color==='white')return '#ffffff';if(color==='black')return '#000000';
 return color?.length===4?'#'+[...color.slice(1)].map(c=>c+c).join(''):color;
}
if(contrastRatio('#000000','#ffffff')!==21)throw Error('Contrast calculation reference check failed.');
let checked=0;
for(const check of contrastChecks.slice(1)){
 for(const item of check.rules){if(colorOf(item.selector,item.property)!==item.expected)throw Error(`Source color changed: ${check.label}, ${item.selector}`);checked++}
 if(!check.meetsCriterion)throw Error('Current state below stated criterion: '+check.label);
}
const result={date:'2026-10-20',method:'sRGB relative luminance using the unrounded ratio for the threshold comparison',source,sourceDeclarationsChecked:checked,scope:'The six listed active local-study states; archived reference is retained as a known earlier issue. This is not a complete rendered accessibility audit.',checks:contrastChecks};
await writeIfChanged(new URL('docs/contrast-verification.json',root),JSON.stringify(result,null,2));
await writeIfChanged(new URL('public/projects/contrast-record.json',root),JSON.stringify(result,null,2));
console.log(JSON.stringify({currentStates:contrastChecks.length-1,sourceDeclarationsChecked:checked,currentPasses:contrastChecks.slice(1).filter(c=>c.meetsCriterion).length,archivedReferenceRatio:contrastChecks[0].ratio}));
