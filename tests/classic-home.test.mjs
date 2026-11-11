import test from 'node:test';
import assert from 'node:assert/strict';
import {classicHomeDocument} from '../scripts/classic-home-document.mjs';
import {revealClassicTarget} from '../src/classicPortfolio.js';

test('Published homepage retains its boarding gate, travel layout and original project navigation', async () => {
  const {document, source} = await classicHomeDocument();
  assert.ok(document.querySelector('.plane-window .shade-control'));
  assert.ok(document.querySelector('.folio-track .folio-path'));
  assert.equal(document.querySelector('#gate').hasAttribute('hidden'), false);
  assert.equal(document.querySelector('#portfolio').hasAttribute('inert'), true);
  assert.equal(document.querySelector('#portfolio').classList.contains('booting'), true);
  assert.equal(document.querySelector('.folio-tagline').textContent, 'Product Designer · UX Strategy & AI Enablement');
  assert.ok(document.querySelector('#skip-intro'));
  assert.ok(document.querySelector('#featured-case-studies [data-impact="andalus"]'));
  assert.ok(document.querySelector('#featured-case-studies a[href="/projects/nasaq/case-study-en.html"]'));
  assert.ok(document.querySelector('#more-case-studies a[href="/projects/flex-academy/index.html"]'));
  assert.ok(document.querySelector('#more-case-studies a[href="/projects/veyra/index.html"]'));
  for (const project of ['design-handoff', 'design-system-doctor', 'nexus']) {
    assert.ok(document.querySelector(`#community a[href="/projects/${project}/index.html"]`));
  }
  assert.equal(document.querySelector('#return-gate').textContent, 'Return to gate');
  assert.equal(document.querySelector('#proposed-layout').hasAttribute('hidden'), true);
  assert.equal(document.querySelector('.classic-project-visual'), null);
  assert.doesNotMatch(source, /enhanceClassicPortfolio|installNasaqOnboarding|mountBoardingGate/);
});

test('Retained target helper restores focus and ignores invalid hashes', async () => {
  const {document, window} = await classicHomeDocument();
  let focused = null, scrolled = null;
  window.HTMLElement.prototype.focus = function() { focused = this; };
  window.HTMLElement.prototype.scrollIntoView = function() { scrolled = this; };
  const target = document.getElementById('featured-case-studies');
  assert.equal(revealClassicTarget(document, '#featured-case-studies'), true);
  assert.equal(focused, target);
  assert.equal(scrolled, target);
  assert.equal(revealClassicTarget(document, '#%E0%A4%A'), false);
  assert.equal(revealClassicTarget(document, '#missing-project'), false);
});

test('Published assistant and loader are present in the restored entry', async () => {
  const {document} = await classicHomeDocument();
  assert.ok(document.querySelector('#loader .loader-logo'));
  assert.ok(document.querySelector('.interview-card elevenlabs-convai'));
  assert.ok(document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]'));
  assert.equal(document.querySelector('.classic-assistant'), null);
});
