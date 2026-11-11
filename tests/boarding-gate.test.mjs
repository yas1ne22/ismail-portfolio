import test from 'node:test';
import assert from 'node:assert/strict';
import {classicHomeDocument} from '../scripts/classic-home-document.mjs';
import {mountBoardingGate} from '../src/boardingGate.js';

async function fixture(loadScanner, {reducedMotion = false} = {}) {
  const {document, window} = await classicHomeDocument();
  const gate = document.querySelector('#gate'), folio = document.querySelector('#portfolio');
  const opener = document.querySelector('#return-gate');
  const detail = document.createElement('main'); detail.hidden = true;
  document.querySelector('#app').append(detail);
  let active = opener, timerId = 0, now = 0, imports = 0, scans = 0, disposals = 0;
  const timers = new Map(), entered = [], scrolls = [];
  Object.defineProperty(document, 'activeElement', {get: () => active});
  window.HTMLElement.prototype.focus = function() { active = this; };
  Object.assign(window, {scrollX: 12, scrollY: 930, getComputedStyle: element => ({display: element.style.display || 'block', visibility: element.style.visibility || 'visible'})});
  window.scrollTo = (x, y) => { scrolls.push([x, y]); window.scrollX = x; window.scrollY = y; };
  const scanner = {scan() { scans++; }, dispose() { disposals++; }};
  const motionListeners = new Set();
  const reduced = {matches: reducedMotion, addEventListener(type, listener) { if (type === 'change') motionListeners.add(listener); }};
  function setReduced(matches) { reduced.matches = matches; for (const listener of motionListeners) listener({matches}); }
  const controller = mountBoardingGate({
    document, window, gate, folio, detail, reduced, store: {set() {}},
    requestPathMeasure() {}, onEnteredChange: value => entered.push(value),
    loadScanner: () => { imports++; return loadScanner ? loadScanner(scanner) : Promise.resolve({mountScanner: () => scanner}); },
    schedule: (callback, delay) => { const id = ++timerId; timers.set(id, {callback, at: now + delay}); return id; },
    cancel: id => timers.delete(id),
  });
  function advance(milliseconds) {
    now += milliseconds;
    for (const [id, task] of [...timers]) if (task.at <= now) { timers.delete(id); task.callback(); }
  }
  const click = selector => gate.querySelector(selector).dispatchEvent(new window.Event('click', {bubbles: true}));
  function key(target, value, shiftKey = false) {
    const event = new window.Event('keydown', {bubbles: true, cancelable: true});
    Object.assign(event, {key: value, shiftKey}); target.dispatchEvent(event); return event;
  }
  return {document, window, gate, folio, detail, opener, controller, scanner, click, key, advance, entered, scrolls, setReduced,
    get active() { return active; }, get imports() { return imports; }, get scans() { return scans; }, get disposals() { return disposals; }};
}

test('The optional gate loads no scanner on entry, and closing restores the opener and its scroll position', async () => {
  const ui = await fixture();
  assert.equal(ui.imports, 0);
  assert.equal(ui.gate.hidden, true);
  assert.equal(ui.folio.inert, false);
  await ui.controller.showGate(ui.opener);
  assert.equal(ui.folio.inert, true);
  assert.equal(ui.detail.inert, true);
  assert.equal(ui.active, ui.gate);
  assert.equal(ui.imports, 1);
  ui.click('#quick-scan-btn'); assert.equal(ui.scans, 1);
  assert.equal(ui.key(ui.gate, 'Escape').defaultPrevented, true);
  ui.advance(600);
  assert.equal(ui.gate.hidden, true);
  assert.equal(ui.folio.inert, false);
  assert.equal(ui.detail.inert, false);
  assert.equal(ui.active, ui.opener);
  assert.deepEqual(ui.scrolls.at(-1), [12, 930]);
  assert.equal(ui.disposals, 1);
  assert.deepEqual(ui.entered, [false, true]);
});

test('Reduced-motion entry loads no 3D module and returns directly to the opener', async () => {
  const ui = await fixture(undefined, {reducedMotion: true});
  await ui.controller.showGate(ui.opener);
  assert.equal(ui.imports, 0);
  assert.equal(ui.gate.querySelector('#scan-pass').textContent, 'Enter portfolio');
  assert.match(ui.gate.querySelector('#pass-status').textContent, /No scanning gesture or animation is required/);
  ui.click('#scan-pass'); ui.advance(0);
  assert.equal(ui.gate.hidden, true);
  assert.equal(ui.active, ui.opener);
  assert.equal(ui.scans, 0);
  assert.equal(ui.disposals, 0);
});

test('Enabling reduced motion during a pending import prevents its late scanner mount', async () => {
  let resolve, mounts = 0;
  const ui = await fixture(() => new Promise(done => { resolve = done; }));
  const pending = ui.controller.showGate(ui.opener);
  ui.setReduced(true);
  resolve({mountScanner() { mounts++; return ui.scanner; }}); await pending;
  assert.equal(mounts, 0);
  assert.equal(ui.gate.hidden, false);
  assert.match(ui.gate.querySelector('#pass-status').textContent, /Reduced motion is on/);
  ui.click('#scan-pass'); ui.advance(0);
  assert.equal(ui.active, ui.opener);
});

test('Enabling reduced motion disposes an open scanner and keeps a usable plain entry', async () => {
  const ui = await fixture(); await ui.controller.showGate(ui.opener);
  ui.setReduced(true);
  assert.equal(ui.disposals, 1);
  assert.equal(ui.gate.hidden, false);
  assert.equal(ui.folio.inert, true);
  ui.click('#quick-scan-btn'); ui.advance(0);
  assert.equal(ui.scans, 0);
  assert.equal(ui.disposals, 1);
  assert.equal(ui.active, ui.opener);
  ui.setReduced(false); await ui.controller.showGate(ui.opener);
  assert.equal(ui.imports, 2, 'A later opening may use the normal interaction again');
});

test('Enabling reduced motion during closing finishes the return without a delayed stale close', async () => {
  const ui = await fixture(); await ui.controller.showGate(ui.opener);
  ui.controller.enter();
  assert.equal(ui.gate.hidden, false);
  ui.setReduced(true);
  assert.equal(ui.gate.hidden, true);
  assert.equal(ui.active, ui.opener);
  await ui.controller.showGate(ui.opener);
  ui.advance(600);
  assert.equal(ui.gate.hidden, false, 'An older closing timer must not hide the new plain entry');
  assert.match(ui.gate.querySelector('#pass-status').textContent, /Reduced motion is on/);
});

test('Keyboard wrapping includes every enabled control and leaves native scan-button activation intact', async () => {
  const ui = await fixture(); await ui.controller.showGate(ui.opener);
  const first = ui.gate.querySelector('#scan-pass'), last = ui.gate.querySelector('#skip-intro');
  first.focus(); assert.equal(ui.key(first, 'Tab', true).defaultPrevented, true); assert.equal(ui.active, last);
  assert.equal(ui.key(last, 'Tab').defaultPrevented, true); assert.equal(ui.active, first);
  ui.gate.focus(); ui.key(ui.gate, 'Tab', true); assert.equal(ui.active, last);
  const quick = ui.gate.querySelector('#quick-scan-btn'); quick.focus();
  assert.equal(ui.key(quick, ' ').defaultPrevented, false);
  assert.equal(ui.key(quick, 'Enter').defaultPrevented, false);
  assert.equal(ui.folio.inert, true, 'Keydown must not close before the native button click');
  ui.click('#quick-scan-btn'); assert.equal(ui.scans, 1);
  last.hidden = true;
  quick.focus(); ui.key(quick, 'Tab'); assert.equal(ui.active, first, 'Hidden controls are not focus destinations');
  ui.controller.enter(); ui.advance(600);
});

test('Skipping while the 3D module loads prevents a late mount and does not steal focus', async () => {
  let resolve, mounts = 0;
  const ui = await fixture(() => new Promise(done => { resolve = done; }));
  const pending = ui.controller.showGate(ui.opener);
  ui.click('#skip-intro'); ui.advance(600);
  resolve({mountScanner() { mounts++; return ui.scanner; }}); await pending;
  assert.equal(mounts, 0);
  assert.equal(ui.active, ui.opener);
  assert.equal(ui.gate.hidden, true);
});

test('A newer opening owns the scanner and ignores an older pending load', async () => {
  const resolvers = []; let mounts = 0, callbacks;
  const ui = await fixture(() => new Promise(resolve => resolvers.push(resolve)));
  const first = ui.controller.showGate(ui.opener);
  ui.controller.enter();
  const second = ui.controller.showGate(ui.opener);
  resolvers[0]({mountScanner() { mounts++; return ui.scanner; }}); await first;
  assert.equal(mounts, 0);
  resolvers[1]({mountScanner(_canvas, options) { mounts++; callbacks = options; return ui.scanner; }}); await second;
  assert.equal(mounts, 1);
  ui.click('#skip-intro'); ui.advance(600);
  const before = ui.gate.querySelector('#pass-status').textContent;
  callbacks.onStatus('Stale scanner message'); callbacks.onSuccess();
  assert.equal(ui.gate.querySelector('#pass-status').textContent, before);
  assert.equal(ui.active, ui.opener);
  assert.equal(ui.disposals, 1);
});

test('A failed module or scanner leaves a usable plain entry and tolerates cleanup failure', async () => {
  const ui = await fixture(() => Promise.reject(new Error('Offline')));
  await ui.controller.showGate(ui.opener);
  assert.match(ui.gate.querySelector('#pass-status').textContent, /unavailable/);
  assert.equal(ui.gate.querySelector('#scan-pass').textContent, 'Enter portfolio');
  ui.click('#scan-pass'); ui.advance(600);
  assert.equal(ui.active, ui.opener);
  const broken = await fixture(); await broken.controller.showGate(broken.opener);
  broken.scanner.scan = () => { throw new Error('WebGL context lost'); };
  broken.scanner.dispose = () => { throw new Error('Already lost'); };
  broken.click('#scan-pass');
  assert.match(broken.gate.querySelector('#pass-status').textContent, /unavailable/);
  broken.click('#scan-pass'); broken.advance(600);
  assert.equal(broken.active, broken.opener);
  assert.equal(broken.gate.hidden, true);
});
