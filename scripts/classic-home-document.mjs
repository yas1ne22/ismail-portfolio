import fs from 'node:fs/promises';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
import * as data from '../src/data.js';

// Exercise the active published-homepage template without inactive audit enhancements.
// This constructs DOM only; it does not simulate layout or a browser session.
export async function classicHomeDocument() {
  const root = new URL('../', import.meta.url);
  const html = await fs.readFile(new URL('index.html', root), 'utf8');
  const source = await fs.readFile(new URL('src/main.js', root), 'utf8');
  const boundary = source.indexOf('\nconst folio = document.querySelector');
  if (boundary < 0) throw new Error('The existing homepage initialization boundary changed; review the DOM check.');
  const prefix = source.slice(0, boundary).replace(/^import [^\n]+\n/gm, '');
  const {document, window} = parseHTML(html);
  vm.runInNewContext(prefix, {document, ...data, matchMedia: () => ({matches: false})}, {timeout: 5000});
  return {document, window, source};
}
