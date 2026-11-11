// Preserve the restored homepage. Project pages know its actual section anchors.
for (const link of document.querySelectorAll('a[href]')) {
  const url = new URL(link.href, location.href);
  if (url.origin === location.origin && url.pathname === '/' && window.parent !== window) {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      window.parent.postMessage({ type: 'close-case-study' }, location.origin);
    });
  }
}

// A readable direct URL is available even when a case opens inside the homepage dialog.
for (const link of document.querySelectorAll('[data-copy-case]')) {
  link.addEventListener('click', async event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const status = document.querySelector('#case-link-status');
    const address = new URL(link.getAttribute('href'), location.href).href;
    try {
      await navigator.clipboard.writeText(address);
      if (status) status.textContent = 'Case study address copied.';
    } catch {
      if (status) status.textContent = `Copy is unavailable. Case study address: ${address}`;
    }
  });
}
