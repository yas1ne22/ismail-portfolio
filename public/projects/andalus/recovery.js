const brand = '<div class="screen-brand"><span class="brand-mark">a.</span> ANDALUS SMART WAY</div>';
const trip = '<div class="saved-trip"><small>SAVED SEARCH · ROUND TRIP</small><h4>Algiers <span aria-hidden="true"></span> London</h4><p>18–25 November · 1 adult · Economy</p></div>';
const action = (label) => '<button class="primary" data-resume>' + label + '<span aria-hidden="true"></span></button>';
const channels = {
  web: {
    name: 'Web', title: 'Restore the search.',
    screen: window.recoveryScreens.web
  },
  app: {
    name: 'App', title: 'Resume anywhere.',
    screen: window.recoveryScreens.app
  },
  email: {
    name: 'Email', title: 'Return with context.',
    screen: window.recoveryScreens.email
  }
};
const showcase = document.querySelector('#design-screens');
const screenNotes = {
  web: ['Web', 'Restore the search.'],
  app: ['App', 'Resume anywhere.'],
  email: ['Email', 'Return with context.']
};
showcase.innerHTML = Object.entries(screenNotes).map(([key, [label, title]]) => {
  const preview = channels[key].screen
    .replace(/<button([^>]*)>/g, '<span $1>')
    .replaceAll('</button>', '</span>');
  return '<figure class="design-shot design-shot-' + key + '"><div class="design-shot-stage">' + preview + '</div><figcaption><small>' + label + '</small><h3>' + title + '</h3></figcaption></figure>';
}).join('');
const panel = document.querySelector('#channel-panel');
const tabs = [...document.querySelectorAll('[data-channel]')];
function selectChannel(key, focus = false) {
  const item = channels[key];
  tabs.forEach(tab => {
    const selected = tab.dataset.channel === key;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  panel.setAttribute('aria-labelledby', 'tab-' + key);
  panel.dataset.channel = key;
  panel.innerHTML = item.screen + '<div class="channel-copy"><p class="eyebrow">' + item.name + '</p><h3>' + item.title + '</h3></div>';
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectChannel(tab.dataset.channel));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectChannel(tabs[next].dataset.channel, true);
  });
});
const returnScreen = document.querySelector('#return-screen');
const states = {
  available: {status:'Disponible',title:'Votre voyage est prêt.',copy:'Vérifiez le tarif actuel.',label:'Total · 1 adulte',price:'85 000 DZD',action:'Vérifier le vol',result:'Recherche conservée. Aucun paiement effectué.'},
  changed: {status:'Tarif modifié',title:'Le prix a changé.',copy:'Acceptez le nouveau tarif ou changez de vol.',label:'Total · 1 adulte',price:'<del>85 000 DZD</del> 90 000 DZD',action:'Voir le tarif',result:'Nouveau total à confirmer.'},
  soldout: {status:'Indisponible',title:'Choisissez un autre vol.',copy:'Vos dates sont conservées.',label:'Recherche conservée',price:'ALG  LHR',action:'Voir les vols',result:'Aucun remplacement sélectionné.'}
};
function selectState(key) {
  const state = states[key];
  document.querySelectorAll('[data-state]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.state === key)));
  returnScreen.innerHTML = '<div class="return-status ' + (key === 'available' ? '' : 'warning') + '">' + state.status + '</div><h4>' + state.title + '</h4><p>' + state.copy + '</p><div class="fare-line"><span>' + state.label + '</span><b>' + state.price + '</b></div><button class="primary" data-review="' + key + '">' + state.action + '<span aria-hidden="true"></span></button>';
}
document.querySelectorAll('[data-state]').forEach(button => button.addEventListener('click', () => selectState(button.dataset.state)));
document.addEventListener('click', event => {
  const edit = event.target.closest('button[data-edit-trip]');
  if (edit) {
    edit.outerHTML = '<p class="asw-mobile-notice" role="status">Vos dates : du 18 au 25 novembre. La modification des dates sera disponible dans le parcours de réservation.</p>';
  }
  if (event.target.closest('button[data-resume]')) {
    selectState('available');
    const lab = document.querySelector('.return-lab');
    lab.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'center'});
    returnScreen.querySelector('button').focus({preventScroll:true});
  }
  const review = event.target.closest('[data-review]');
  if (review && !returnScreen.querySelector('.demo-result')) {
    const result = document.createElement('p');
    result.className = 'demo-result';
    result.textContent = states[review.dataset.review].result;
    returnScreen.append(result);
  }
  const dismiss = event.target.closest('[data-dismiss]');
  if (dismiss) {
    const body = dismiss.closest('.screen-body');
    body.innerHTML = brand + '<h4>Search dismissed.</h4><p>Recovery for this saved trip stops. Start again whenever you are ready.</p><button class="primary" data-reset>Reset prototype <span>↻</span></button>';
  }
  if (event.target.closest('[data-reset]')) selectChannel('web');
});
selectChannel('web');
selectState('available');
// The same case study works as a standalone page and inside the portfolio dialog.
if (window.parent !== window) document.documentElement.classList.add('embedded');
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && window.parent !== window) window.parent.postMessage({type:'close-andalus-case'}, location.origin);
});
