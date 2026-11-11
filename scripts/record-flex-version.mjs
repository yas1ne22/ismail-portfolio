import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {flexVersion} from '../src/flexVersionContent.js';
import {writeIfChanged} from '../lib/writeIfChanged.js';
const root=new URL('../',import.meta.url);
const sourceFiles=['public/projects/flex-academy/study.html','public/projects/flex-academy/journey.css','public/projects/experience-lab.js','public/projects/experience-lab.css','public/projects/flex-events.js','public/projects/flex-academy/index.html','public/assets/flex/figma-desktop.png'];
const sourceHashes=Object.fromEntries(await Promise.all(sourceFiles.map(async file=>[file,crypto.createHash('sha256').update(await fs.readFile(new URL(file,root))).digest('hex')])));
const record={...flexVersion,scope:'A dated local portfolio reference and comparison. This record does not establish client approval, an original delivery date, live Figma parity or production results.',sourceHashes};
console.log(await writeIfChanged(new URL('public/projects/flex-academy/delivery-status.json',root),JSON.stringify(record,null,2)+'\n')?'Recorded the current Flex portfolio reference.':'Flex reference record is current.');
