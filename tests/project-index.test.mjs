import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
import {experiments} from '../src/portfolioContent.js';
import {portfolioReturn} from '../src/caseReviewContent.js';

const html=await fs.readFile(new URL('../public/projects/index.html',import.meta.url),'utf8');
const script=await fs.readFile(new URL('../public/projects/project-index.js',import.meta.url),'utf8');

test('Additional cases and their study/protocol pages return to their own reachable exploration entry',async()=>{
  const {document}=parseHTML(html);
  assert.equal(document.querySelectorAll('[data-project-entry]').length,6);
  for(const [name,,href] of experiments){
    const key=href.split('/')[2],entry=document.getElementById(`work-${key}`);
    assert.ok(entry,name);
    assert.equal(entry.querySelector('[data-project-case]').getAttribute('href'),href);
    assert.equal(portfolioReturn(key),`/projects/index.html#${entry.id}`);
    const caseHtml=await fs.readFile(new URL(`../public${href}`,import.meta.url),'utf8');
    const caseDocument=parseHTML(caseHtml).document;
    assert.equal(caseDocument.querySelector('.review-quick-nav a').getAttribute('href'),portfolioReturn(key));
    assert.match(caseDocument.querySelector('.review-quick-nav a').textContent,/More explorations/);
    assert.equal(caseDocument.querySelectorAll('a[href="/"],a[href="/#selected-work"]').length,0,`${key} still has a return that loses the project position`);
    for(const file of ['study.html','study-protocol.html']){
      const content=await fs.readFile(new URL(`../public/projects/${key}/${file}`,import.meta.url),'utf8');
      assert.ok(content.includes(`href="${portfolioReturn(key)}"`),`${key}/${file}`);
      assert.ok(!content.includes('href="/#selected-work"'),`${key}/${file}`);
    }
  }
});

test('Exploration history remembers an ordinary opener and restores only valid project entries on return',()=>{
  const {document,window:domWindow}=parseHTML(html);
  const location=new URL('https://portfolio.example/projects/index.html?review=1');
  const handlers={},calls=[],state={kept:'existing history state'};
  let denyHistory=false;
  const history={state,replaceState(value,title,url){if(denyHistory)throw Error('Denied');assert.equal(value,state);calls.push(url);location.href=new URL(url,location).href;}};
  let focused=null,scrolled=null;
  domWindow.HTMLElement.prototype.focus=function(){focused=this;};
  domWindow.HTMLElement.prototype.scrollIntoView=function(){scrolled=this;};
  vm.runInNewContext(script,{document,location,history,window:{addEventListener:(name,fn)=>{handlers[name]=fn;}}});
  function click(key,properties={}){
    const event=new domWindow.Event('click',{bubbles:true,cancelable:true});
    Object.assign(event,{button:0,...properties});
    document.querySelector(`#work-${key} a`).dispatchEvent(event);
    assert.equal(event.defaultPrevented,false);
  }
  for(const properties of [{metaKey:true},{ctrlKey:true},{shiftKey:true},{altKey:true},{button:1}])click('voicy',properties);
  assert.deepEqual(calls,[]);
  click('voicy');
  assert.equal(location.search,'?review=1');
  assert.equal(location.hash,'#work-voicy');
  handlers.pageshow();
  assert.equal(focused,document.getElementById('work-voicy'));
  assert.equal(scrolled,focused);
  // A later opener replaces the remembered origin when this page is restored.
  click('prepflow');handlers.pageshow();
  assert.equal(focused,document.getElementById('work-prepflow'));
  for(const hash of ['#%E0%A4%A','#project-index','#missing']){
    location.hash=hash;focused=null;scrolled=null;handlers.hashchange();
    assert.equal(focused,null);assert.equal(scrolled,null);
  }
  denyHistory=true;click('skinny');
});
