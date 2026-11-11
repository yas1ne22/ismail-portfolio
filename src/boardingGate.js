// Optional travel interaction. Work remains available without loading its 3D code.
export function mountBoardingGate({
  document, window, gate, folio, detail, reduced, store, requestPathMeasure,
  onEnteredChange = () => {},
  loadScanner = () => import('./scanner.js'),
  schedule = (callback, delay) => window.setTimeout(callback, delay),
  cancel = handle => window.clearTimeout(handle),
}) {
  let state = 'closed', version = 0, scanner = null, returnPoint = null;
  let closeTimer = null, successTimer = null;
  const status = gate.querySelector('#pass-status');
  const scanButton = gate.querySelector('#scan-pass');
  const originalScanLabel = scanButton.textContent;
  const returnButton = document.querySelector('#return-gate');

  gate.hidden = true;
  folio.inert = false;
  folio.classList.remove('booting');

  function disposeScanner() {
    const previous = scanner;
    scanner = null;
    try { previous?.dispose(); } catch { /* Cleanup cannot block returning to work. */ }
  }
  function finishClose() {
    if (state !== 'closing') return;
    state = 'closed';
    gate.hidden = true;
    disposeScanner();
    folio.classList.remove('entering');
    detail.classList.remove('entering');
    const point = returnPoint;
    returnPoint = null;
    if (point) window.scrollTo(point.x, point.y);
    const target = point?.element?.isConnected ? point.element : detail.hidden ? folio : detail;
    target.focus({preventScroll: true});
  }
  function enter() {
    if (state !== 'open') return;
    state = 'closing';
    version++;
    cancel(successTimer);
    onEnteredChange(true);
    try { window.sessionStorage.setItem('yb:entered', '1'); } catch {}
    store.set('yb:boarded', '1');
    gate.classList.add('leaving');
    folio.inert = false;
    detail.inert = false;
    document.documentElement.classList.remove('is-covered');
    folio.classList.remove('booting');
    folio.classList.add('entering');
    if (!detail.hidden) detail.classList.add('entering');
    requestPathMeasure();
    closeTimer = schedule(finishClose, reduced.matches ? 0 : 600);
  }
  function fallback() {
    status.classList.remove('shimmer');
    status.textContent = 'The 3D interaction is unavailable. Enter the portfolio below, or choose Skip.';
    scanButton.classList.add('fallback');
    scanButton.textContent = 'Enter portfolio';
  }
  function reducedEntry() {
    status.classList.remove('shimmer', 'granted');
    status.textContent = 'Reduced motion is on. Enter the portfolio below, or choose Skip. No scanning gesture or animation is required.';
    scanButton.classList.add('fallback');
    scanButton.textContent = 'Enter portfolio';
  }
  async function showGate(opener = document.activeElement) {
    if (state === 'open') return;
    if (state === 'closing') { cancel(closeTimer); finishClose(); }
    returnPoint = {element: opener, x: window.scrollX, y: window.scrollY};
    state = 'open';
    const currentVersion = ++version;
    onEnteredChange(false);
    gate.hidden = false;
    gate.classList.remove('leaving');
    folio.inert = true;
    detail.inert = true;
    folio.classList.add('booting');
    folio.classList.remove('entering');
    detail.classList.remove('entering');
    document.documentElement.classList.add('is-covered');
    status.textContent = 'Loading the boarding interaction. You can enter or skip at any time.';
    status.classList.remove('granted');
    status.classList.add('shimmer');
    scanButton.classList.remove('fallback');
    scanButton.textContent = originalScanLabel;
    window.scrollTo(0, 0);
    gate.focus({preventScroll: true});
    if (reduced.matches) {
      reducedEntry();
      return;
    }
    let fontTimer = null;
    try {
      const fontsReady = document.fonts?.ready;
      const [{mountScanner}] = await Promise.all([
        loadScanner(),
        fontsReady ? Promise.race([fontsReady, new Promise(resolve => { fontTimer = schedule(resolve, 800); })]) : Promise.resolve(),
      ]);
      if (state !== 'open' || version !== currentVersion) return;
      scanner = mountScanner(gate.querySelector('#scanner'), {
        reduced: reduced.matches,
        onStatus(text) { if (state === 'open' && version === currentVersion) status.textContent = text; },
        onSuccess() {
          if (state !== 'open' || version !== currentVersion) return;
          status.classList.remove('shimmer');
          status.classList.add('granted');
          status.innerHTML = '<span class="status-check" aria-hidden="true">✓</span> Access granted';
          successTimer = schedule(enter, reduced.matches ? 0 : 280);
        },
      });
      status.textContent = 'Click or swipe the boarding pass, use a scan button, or choose Skip.';
    } catch {
      if (state === 'open' && version === currentVersion) fallback();
    } finally {
      cancel(fontTimer);
    }
  }
  function scan(event) {
    event?.stopPropagation();
    if (state !== 'open') return;
    if (!scanner) { enter(); return; }
    try { scanner.scan(); } catch { disposeScanner(); fallback(); }
  }
  for (const selector of ['#pass-status', '#scan-pass', '#scan-arrow', '#quick-scan-btn']) {
    gate.querySelector(selector)?.addEventListener('click', scan);
  }
  gate.querySelector('#scan-arrow')?.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    scan(event);
  });
  gate.querySelector('#skip-intro').addEventListener('click', enter);
  returnButton?.addEventListener('click', event => {
    try { window.sessionStorage.removeItem('yb:entered'); } catch {}
    store.set('yb:boarded', '0');
    showGate(event.currentTarget);
  });
  gate.addEventListener('click', event => { if (event.target === gate) scan(event); });
  gate.addEventListener('wheel', event => { if (Math.abs(event.deltaY) > 30) enter(); }, {passive: true});
  gate.addEventListener('keydown', event => {
    if (state !== 'open') return;
    if (event.key === 'Escape' || ((event.key === 'Enter' || event.key === ' ') && event.target === gate)) {
      event.preventDefault();
      enter();
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = [...gate.querySelectorAll('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')].filter(control => {
      if (control.closest('[hidden],[inert]')) return false;
      const style = window.getComputedStyle(control);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
    const first = controls[0] || gate, last = controls.at(-1) || gate;
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === gate || !gate.contains(active))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (active === last || !gate.contains(active))) {
      event.preventDefault(); first.focus();
    }
  });
  reduced.addEventListener?.('change', () => {
    if (!reduced.matches) return;
    if (state === 'open') {
      version++;
      cancel(successTimer);
      disposeScanner();
      reducedEntry();
    } else if (state === 'closing') {
      cancel(closeTimer);
      finishClose();
    }
  });
  return {enter, showGate};
}
