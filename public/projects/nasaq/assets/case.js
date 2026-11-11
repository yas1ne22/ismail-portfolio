// Preserve appearance and the current chapter across language changes.
(()=>{
 const ar=document.documentElement.lang==='ar',button=document.querySelector('#case-theme');
 function paint(theme){document.documentElement.dataset.theme=theme;button.setAttribute('aria-pressed',String(theme==='dark'));button.textContent=theme==='dark'?(ar?'فاتح':'Light'):(ar?'داكن':'Dark')}
 let theme='light';try{theme=localStorage.getItem('nasaq-theme')==='dark'?'dark':'light'}catch{}paint(theme);
 button.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';paint(theme);try{localStorage.setItem('nasaq-theme',theme)}catch{}});
 const locale=document.querySelector('.case-locale'),destination=locale.getAttribute('href');
 const sync=()=>locale.setAttribute('href',destination+location.hash);window.addEventListener('hashchange',sync);sync();
})();
