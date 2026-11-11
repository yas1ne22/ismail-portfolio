import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
import {caseReviews} from '../src/caseReviewContent.js';

const script = await fs.readFile(new URL('../public/projects/case-navigation.js', import.meta.url), 'utf8');
async function fixture(project, clipboard, embedded = false) {
  const html = await fs.readFile(new URL(`../public/projects/${project}/index.html`, import.meta.url), 'utf8');
  const {document, window: domWindow} = parseHTML(html);
  const location = new URL(`https://portfolio.example/projects/${project}/index.html`);
  const messages = [], window = {};
  window.parent = embedded ? {postMessage: (...args) => messages.push(args)} : window;
  vm.runInNewContext(script, {document, location, window, navigator: {clipboard}, URL});
  async function click(link, properties = {}) {
    const event = new domWindow.Event('click', {bubbles: true, cancelable: true});
    Object.assign(event, {button: 0, ...properties}); link.dispatchEvent(event);
    await Promise.resolve(); await Promise.resolve();
    return event;
  }
  return {document, location, messages, click};
}

test('Every enriched case copies its own standalone URL and exposes that URL if clipboard access fails', async () => {
  for (const project of Object.keys(caseReviews)) {
    const copied = [];
    const ui = await fixture(project, {writeText: async value => copied.push(value)});
    const link = ui.document.querySelector('[data-copy-case]'); assert.ok(link, project);
    assert.equal((await ui.click(link)).defaultPrevented, true);
    assert.deepEqual(copied, [ui.location.href], project);
    const denied = await fixture(project, {writeText: async () => {throw new Error('Denied');}});
    await denied.click(denied.document.querySelector('[data-copy-case]'));
    assert.ok(denied.document.querySelector('#case-link-status').textContent.includes(denied.location.href), `No manual-copy fallback for ${project}`);
  }
});

test('Modified clicks keep native link behavior and do not unexpectedly copy an address', async () => {
  let copies = 0;
  const ui = await fixture('andalus', {writeText: async () => {copies++;}});
  for (const properties of [{metaKey:true},{ctrlKey:true},{shiftKey:true},{altKey:true},{button:1}]) {
    const event = await ui.click(ui.document.querySelector('[data-copy-case]'), properties);
    assert.equal(event.defaultPrevented, false);
  }
  assert.equal(copies, 0);
});

test('Only an ordinary portfolio-return click asks an embedding portfolio to close the case', async () => {
  const ui = await fixture('andalus', {}, true);
  const home = ui.document.querySelector('a[href="/#work-andalus"]'); assert.ok(home);
  assert.equal((await ui.click(home, {metaKey:true})).defaultPrevented, false);
  assert.equal(ui.messages.length, 0);
  const next = ui.document.querySelector('.review-next a[href^="/projects/"]');
  assert.equal((await ui.click(next)).defaultPrevented, false);
  assert.equal(ui.messages.length, 0);
  assert.equal((await ui.click(home)).defaultPrevented, true);
  assert.equal(ui.messages.length, 1);
  assert.equal(ui.messages[0][0].type, 'close-case-study');
  assert.equal(ui.messages[0][1], 'https://portfolio.example');
});
