import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(new URL('../public', import.meta.url).pathname);
const routes = new Map([
  ['work', '/#selected-work'],
  ['case-studies', '/#selected-work'],
  ['case-studies/aeo-citation-growth', '/projects/aevis/'],
  ['case-studies/seo-organic-growth', '/#selected-work'],
  ['case-studies/paid-advertising', '/#selected-work'],
  ['work/andalus', '/projects/andalus/'],
  ['work/nasaq', '/projects/nasaq/case-study-en.html'],
  ['work/flex-academy', '/projects/flex-academy/'],
  ['work/veyra', '/projects/veyra/'],
  ['work/nexus', '/projects/nexus/'],
  ['work/design-handoff', '/projects/design-handoff/'],
  ['work/design-system-doctor', '/projects/design-system-doctor/'],
  ['work/prepflow', '/projects/prepflow/'],
  ['work/promptilo', '/projects/promptilo/'],
  ['work/skinny', '/projects/skinny/'],
  ['work/timer-gym', '/projects/timer-gym/'],
  ['work/voicy', '/projects/voicy/'],
  ['work/aeo', '/projects/aevis/'],
  ['work/analytics', '/#selected-work'],
  ['work/seo', '/#selected-work'],
  ['work/paidmedia', '/#selected-work'],
  ['work/email', '/#selected-work'],
  ['work/shopify', '/#selected-work'],
]);

for (const [route, destination] of routes) {
  const directory = path.join(root, route);
  await fs.mkdir(directory, {recursive: true});
  const escaped = destination.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${escaped}"><link rel="canonical" href="https://ismail-bettoumi.com${escaped}"><title>Redirecting · Ismail Bettoumi</title><script>location.replace(${JSON.stringify(destination)})</script></head><body><p>This portfolio route has moved. <a href="${escaped}">Continue to Ismail Bettoumi’s portfolio</a>.</p></body></html>`;
  await fs.writeFile(path.join(directory, 'index.html'), html);
}

console.log(`Rendered ${routes.size} legacy route shells.`);
