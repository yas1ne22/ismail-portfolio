(() => {
  const languageKey = 'nasaq-language';
  const entry = document.body.classList.contains('nasaq-entry');
  const language = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  const remember = value => {
    try { localStorage.setItem(languageKey, value); } catch {}
  };

  if (entry) {
    let previous;
    try { previous = localStorage.getItem(languageKey); } catch {}
    if (previous === 'en' || previous === 'ar') {
      document.querySelector(`[data-recent="${previous}"]`).hidden = false;
      document.querySelector(`[data-language-card="${previous}"]`).classList.add('last-viewed');
    }
  } else {
    remember(language);
  }

  const notifyParent = () => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'nasaq-navigation', href: location.href, language }, location.origin);
    }
  };
  notifyParent();
  window.addEventListener('hashchange', notifyParent);

  document.addEventListener('click', event => {
    const choice = event.target.closest('[data-nasaq-language], #language-switch, .case-nav .locale-link');
    if (choice) remember(choice.dataset.nasaqLanguage || choice.lang);
    const back = event.target.closest('[data-nasaq-return]');
    if (back && window.parent !== window && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      window.parent.postMessage({ type: 'close-case-study' }, location.origin);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !document.querySelector('dialog[open]') && window.parent !== window) {
      window.parent.postMessage({ type: 'close-case-study' }, location.origin);
    }
  });
})();
