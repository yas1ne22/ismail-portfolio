import test from 'node:test';
import assert from 'node:assert/strict';
import {classicHomeDocument} from '../scripts/classic-home-document.mjs';
import {mountUIWork} from '../public/projects/ui-work/showcase.js';
import fs from 'node:fs/promises';
import {parseHTML} from 'linkedom';

async function setup(reducedMotion = false) {
  const pages = await Promise.all(['sonder', 'kinetic'].map(key => fs.readFile(new URL(`../public/projects/${key}/index.html`, import.meta.url), 'utf8')));
  const {document, window} = parseHTML(`<html><body>${pages.map(page => page.match(/<body>([\s\S]*)<script type="module">/)[1]).join('')}</body></html>`);
  const intervals = new Set();
  let observe;
  window.matchMedia = () => ({matches:reducedMotion, addEventListener(){}});
  window.setInterval = callback => { intervals.add(callback); return callback; };
  window.clearInterval = callback => intervals.delete(callback);
  window.IntersectionObserver = class { constructor(callback) { observe = callback; } observe() {} };
  window.getComputedStyle = () => ({transform:'matrix(1,0,0,1,0,0)'});
  const animations = [];
  for (const shape of document.querySelectorAll('.kinetic-shape')) {
    shape.animate = (frames, options) => { const animation = {frames,options,cancel(){this.cancelled=true;}}; animations.push(animation); return animation; };
  }
  mountUIWork(document);
  const click = selector => document.querySelector(selector).click();
  return {document, window, intervals, animations, click, observe: visible => observe([{isIntersecting:visible}])};
}

test('UI section sits between case studies and community with sequential numbering', async () => {
  const {document} = await classicHomeDocument();
  const section = document.querySelector('#ui-work');
  assert.equal(section.previousElementSibling.id, 'more-case-studies');
  assert.equal(section.nextElementSibling.id, 'community');
  assert.equal(section.querySelector('.tl-yearnum').textContent, '03');
  assert.equal(document.querySelector('#community .tl-yearnum').textContent, '04');
  assert.equal(section.querySelector('.ui-demo'), null);
  for (const key of ['sonder', 'kinetic']) {
    assert.equal(section.querySelector(`a.case[href="/projects/${key}/index.html"]`), null);
  }
});

test('Player wraps tracks, resets progress, retains per-track saves and suspends offscreen playback', async () => {
  const {document, click, intervals, observe} = await setup();
  click('.sonder-save');
  click('[data-track-prev]');
  assert.equal(document.querySelector('[data-track-title]').textContent, 'Blue in bloom');
  assert.equal(Number(document.querySelector('.sonder-progress').max), 231);
  assert.equal(document.querySelector('.sonder-save').getAttribute('aria-pressed'), 'false');
  click('[data-track-next]');
  assert.equal(document.querySelector('[data-track-title]').textContent, 'Velvet skies');
  assert.equal(document.querySelector('.sonder-save').getAttribute('aria-pressed'), 'true');
  assert.equal(document.querySelector('.sonder-progress').value, '0');
  click('.sonder-play');
  assert.equal(intervals.size, 0);
  observe(true);
  assert.equal(intervals.size, 1);
  observe(false);
  assert.equal(intervals.size, 0);
  assert.equal(document.querySelector('.sonder-play').getAttribute('aria-pressed'), 'true');
  observe(true);
  click('.sonder-play');
  assert.equal(intervals.size, 0);
});

test('Arrangement changes preserve selection and honor tempo and reduced motion', async () => {
  const {document, click, animations} = await setup();
  const input = document.querySelector('#kinetic-duration');
  input.value = '1200';
  input.dispatchEvent(new document.defaultView.Event('input'));
  click('[data-arrangement="stack"]');
  assert.equal(document.querySelector('[data-kinetic]').dataset.layout, 'stack');
  assert.equal(document.querySelector('[data-arrangement="stack"]').getAttribute('aria-pressed'), 'true');
  assert.equal(document.querySelector('[data-arrangement="orbit"]').getAttribute('aria-pressed'), 'false');
  assert.equal(animations.length, 4);
  assert.equal(animations[0].options.duration, 1200);
  click('.kinetic-replay');
  assert.ok(animations.slice(0,4).every(animation => animation.cancelled));
  const reduced = await setup(true);
  reduced.click('[data-arrangement="grid"]');
  reduced.click('.kinetic-replay');
  assert.equal(reduced.animations.length, 0);
  assert.equal(reduced.document.querySelector('[data-kinetic]').dataset.layout, 'grid');
});

test('Focus Agents uses one artwork layer without repeating it as the page background', async () => {
  const [css, html] = await Promise.all([
    fs.readFile(new URL('../public/projects/focus-agents/focus-agents.css', import.meta.url), 'utf8'),
    fs.readFile(new URL('../public/projects/focus-agents/index.html', import.meta.url), 'utf8'),
  ]);
  const bodyRule = css.match(/body\{([^}]+)\}/)?.[1] || '';
  assert.doesNotMatch(bodyRule, /focus-agents-gradient-v2\.webp/);
  assert.match(css, /\.focus-artwork img\{[^}]*object-fit:cover/);
  assert.match(css, /@media\(min-aspect-ratio:3\/2\)\{\.focus-artwork img\{object-fit:contain\}\}/);
  assert.match(html, /focus-agents\.css\?v=2/);
});
