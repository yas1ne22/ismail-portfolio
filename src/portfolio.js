import { installNasaqOnboarding } from './nasaqOnboarding.js';
const root = document.documentElement;
const savedTheme = (()=>{try{return localStorage.getItem('portfolio-theme')}catch{return null}})();
const themeButton = document.querySelector('#theme-toggle');
function applyTheme(value) {
  root.dataset.theme=value;
  themeButton?.setAttribute('aria-pressed',String(value==='dark'));
  if(themeButton)themeButton.textContent=value==='dark'?'Light appearance':'Dark appearance';
}
applyTheme(savedTheme==='dark'?'dark':'light');
themeButton?.addEventListener('click',()=>{
  const value=root.dataset.theme==='dark'?'light':'dark';applyTheme(value);
  try{localStorage.setItem('portfolio-theme',value)}catch{}
});

// Keep recruitment contact usable even when clipboard permissions are unavailable.
document.querySelector('[data-copy-email]')?.addEventListener('click',async()=>{
  const status=document.querySelector('#copy-status');
  const email=document.querySelector('.home-email').getAttribute('href').replace('mailto:','');
  try{await navigator.clipboard.writeText(email);status.textContent='Email address copied.'}
  catch{status.textContent=`Copy is unavailable here. Email ${email}, or use the email link above.`}
});
function track(name,details){if(typeof window.gtag==='function')window.gtag('event',name,details)}
document.addEventListener('click',event=>{
  const project=event.target.closest('[data-project-open]');
  if(project)track('portfolio_project_open',{project_id:project.dataset.projectOpen});
  const contact=event.target.closest('[data-contact]');
  if(contact)track('portfolio_contact_start',{contact_method:contact.dataset.contact});
});

let scanner=null;
let scannerVersion=0;
const boarding=document.querySelector('#boarding-dialog');
const status=document.querySelector('#boarding-status');
document.querySelector('#open-boarding')?.addEventListener('click',async()=>{
  const version=++scannerVersion;
  boarding.showModal();
  status.textContent='Loading the interaction. You can close it at any time.';
  document.querySelector('#scan-boarding').disabled=true;
  try{
    const {mountScanner}=await import('./scanner.js');
    if(!boarding.open||version!==scannerVersion)return;
    scanner=mountScanner(document.querySelector('#boarding-canvas'),{
      reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,
      onStatus:message=>{status.textContent=message},
      onSuccess:()=>{status.textContent='Boarding pass scanned. Welcome aboard.';document.querySelector('#exit-boarding').focus()},
    });
    document.querySelector('#scan-boarding').disabled=false;
    status.textContent='Drag the pass onto the reader, or use the scan button.';
  }catch{
    status.textContent='The 3D experiment is unavailable in this browser. All portfolio work is available on the page.';
  }
});
document.querySelector('#scan-boarding')?.addEventListener('click',()=>scanner?.scan());
for(const id of ['close-boarding','exit-boarding'])document.querySelector(`#${id}`)?.addEventListener('click',()=>boarding.close());
boarding?.addEventListener('click',event=>{
  if(event.target!==boarding)return;
  const b=boarding.getBoundingClientRect();
  if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)boarding.close();
});
boarding?.addEventListener('close',()=>{scannerVersion++;scanner?.dispose();scanner=null;document.querySelector('#boarding-canvas').replaceChildren()});

// The third-party assistant is optional and loads only after an explicit request.
document.querySelector('#load-assistant')?.addEventListener('click',async event=>{
  const button=event.currentTarget,live=document.querySelector('#assistant-status');
  if(button.dataset.loaded)return;
  button.disabled=true;live.textContent='Loading the optional assistant…';
  const script=document.createElement('script');
  script.src='https://unpkg.com/@elevenlabs/convai-widget-embed';script.async=true;
  let timeout;
  try{
    await Promise.race([
      new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=reject;document.head.append(script)}),
      new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('timeout')),15000)}),
    ]);
    const widget=document.createElement('elevenlabs-convai');
    widget.setAttribute('agent-id','agent_2301m37nyj2sev593dq6rbeyxq77');
    widget.setAttribute('action-text','Ask about Ismail’s portfolio');
    document.querySelector('#assistant-host').append(widget);
    button.dataset.loaded='true';button.hidden=true;live.textContent='Assistant loaded. Direct email remains available above.';
  }catch{script.remove();button.disabled=false;live.textContent='The assistant could not load. Try again, or use the email link above.'}
  finally{clearTimeout(timeout)}
});

installNasaqOnboarding();
