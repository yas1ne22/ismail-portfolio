const stage=document.querySelector('#experience');
const steps=[...stage.querySelectorAll('[data-step]')];
const play=stage.querySelector('#motion-play');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const copy=[['01 / EXPLORE','A place catches your eye.','Open a photo pin to see what makes a place worth your time.'],['02 / COLLECT','Make room for this moment.','One addition. A clear confirmation. Your other stops stay in place.'],['03 / ARRANGE','See the day come together.','The numbered route connects your choices. Adjust the order, keep the freedom.']];
let current=0,timer=null,playing=false;
function show(n){current=n;stage.dataset.state=String(n);steps.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===n)));document.querySelector('#motion-kicker').textContent=copy[n][0];document.querySelector('#motion-title').textContent=copy[n][1];document.querySelector('#motion-caption').textContent=copy[n][2];document.querySelector('#motion-check').textContent=n?'✓':'+';}
function stop(){clearTimeout(timer);timer=null;playing=false;play.textContent=reduced.matches?'Next step':'Replay walkthrough';}
function advance(){if(current<2){show(current+1);timer=setTimeout(advance,2500);}else stop();}
steps.forEach(b=>b.addEventListener('click',()=>{stop();show(Number(b.dataset.step));}));
play.addEventListener('click',()=>{if(reduced.matches){stop();show((current+1)%3);return;}if(playing){stop();return;}show(0);playing=true;play.textContent='Pause walkthrough Ⅱ';timer=setTimeout(advance,2000);});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)stop();});
reduced.addEventListener('change',()=>{stop();});
show(0);if(reduced.matches)play.textContent='Next step';
const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
let scheduled=false;function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;scheduled=false;}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress);}},{passive:true});window.addEventListener('resize',updateProgress);updateProgress();
if('IntersectionObserver' in window){const entrances=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){if(!reduced.matches)e.target.classList.add('reveal-in');entrances.unobserve(e.target);}});},{threshold:.12});document.querySelectorAll('.section-heading,.comparison,.wireframe-board,.identity-grid,.test-cards').forEach(el=>entrances.observe(el));const visibility=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&playing)stop();});visibility.observe(stage);}
