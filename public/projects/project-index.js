(() => {
  function restoreProject() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const entry = document.getElementById(id);
    if (!entry?.hasAttribute('data-project-entry')) return;
    entry.scrollIntoView({block:'start'});
    entry.focus({preventScroll:true});
  }

  // Remember the ordinary link's origin for browser Back as well as the case's
  // explicit return link. Modified clicks retain their normal browser behavior.
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[data-project-case]');
    const entry = link?.closest('[data-project-entry]');
    if (!entry) return;
    try { history.replaceState(history.state,'',`#${encodeURIComponent(entry.id)}`); } catch {}
  });
  window.addEventListener('pageshow',restoreProject);
  window.addEventListener('hashchange',restoreProject);
})();
