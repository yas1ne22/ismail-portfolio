/* Nasaq 1.0 — native dialogs, accessible RTL tabs, dismissible tooltips. */
(()=>{
 document.addEventListener('click',e=>{
  const open=e.target.closest('[data-open]');
  if(open){const dialog=document.getElementById(open.dataset.open);if(dialog instanceof HTMLDialogElement)dialog.showModal()}
  const close=e.target.closest('[data-close]');
  if(close){const dialog=document.getElementById(close.dataset.close);if(dialog instanceof HTMLDialogElement)dialog.close()}
  const tab=e.target.closest('[role="tab"]');if(tab&&!tab.disabled)activate(tab);
 });
 function activate(tab){const parent=tab.closest('[data-tabs]');if(!parent||tab.disabled)return;
  parent.querySelectorAll('[role="tab"]').forEach(t=>{let active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;const panel=document.getElementById(t.getAttribute('aria-controls'));if(panel)panel.hidden=!active});
 }
 document.addEventListener('keydown',e=>{
  const tab=e.target.closest('[role="tab"]');
  if(tab&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
   const list=[...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')].filter(t=>!t.disabled);
   const rtl=getComputedStyle(tab).direction==='rtl';let i=list.indexOf(tab);
   if(e.key==='Home')i=0;else if(e.key==='End')i=list.length-1;else i=(i+(e.key==='ArrowLeft'?(rtl?1:-1):(rtl?-1:1))+list.length)%list.length;
   e.preventDefault();activate(list[i]);list[i].focus();
  }
  if(e.key==='Escape'){document.querySelectorAll('.nq-tooltip').forEach(t=>{t.style.visibility='hidden'})}
 });
 document.addEventListener('focusin',e=>{const w=e.target.closest('.nq-tooltip-wrap');if(w)w.querySelector('.nq-tooltip').style.visibility='visible'});
 document.addEventListener('pointerover',e=>{const w=e.target.closest('.nq-tooltip-wrap');if(w&&!w.contains(e.relatedTarget))w.querySelector('.nq-tooltip').style.visibility='visible'});
})();
