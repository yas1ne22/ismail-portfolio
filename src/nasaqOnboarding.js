// Both portfolio layouts enter Nasaq through the same two-question dialog.
export function installNasaqOnboarding() {
  if (document.documentElement.dataset.nasaqOnboarding === 'ready') return;
  document.documentElement.dataset.nasaqOnboarding = 'ready';
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '/projects/nasaq/assets/onboarding.css';
  document.head.append(stylesheet);
  const ready = new Promise(resolve => {
    if (window.NasaqOnboarding) return resolve(window.NasaqOnboarding);
    const script = document.createElement('script');
    script.src = '/projects/nasaq/assets/onboarding.js?v=two-questions-final';
    script.onload = () => resolve(window.NasaqOnboarding);
    script.onerror = () => resolve(null);
    document.head.append(script);
  });
  let dialog, controller, trigger;
  document.addEventListener('click', async event => {
    const link = event.target.closest('a[href]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.hasAttribute('data-nasaq-direct') || link.closest('.nasaq-language-dialog')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith('/projects/nasaq/')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const api = await ready;
    if (!api) { location.assign(url.href); return; }
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'nasaq-language-dialog';
      dialog.setAttribute('aria-labelledby', 'nasaq-language-title');
      dialog.setAttribute('aria-describedby', 'nasaq-language-description');
      document.body.append(dialog);
      controller = api.mount(dialog, {
        base: new URL('/projects/nasaq/', location.href).href,
        modal: true,
        onClose: () => dialog.close(),
      });
      dialog.addEventListener('close', () => trigger?.focus());
      dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      });
    }
    trigger = link;
    controller.reset();
    dialog.showModal();
    controller.focus();
  }, true);
}
