const resources=[
 {id:'a',name:'Accessible form checklist',type:'Workflow',topic:'design',creator:'Sample editorial resource',source:'https://www.w3.org/WAI/tutorials/forms/',terms:'Original W3C guidance; check source terms.',updated:'Reference sample · no live freshness claim',review:'Reviewed example',desc:'Use form labels, instructions and error feedback to support a complete task.'},
 {id:'b',name:'Browser layout reference',type:'Tutorial',topic:'build',creator:'Sample catalog entry',source:'https://developer.mozilla.org/en-US/docs/Learn_web_development',terms:'Reuse terms are defined by the original source.',updated:'Reference sample · check current source',review:'Reviewed example',desc:'Study responsive layout concepts and their practical constraints.'},
 {id:'c',name:'A new prompt collection',type:'Prompt',topic:'design',creator:'Illustrative submission',source:null,terms:'Reuse terms not yet verified.',updated:'Submission awaiting review',review:'Not approved',desc:'A discovery candidate. Missing provenance prevents publication into a trusted collection.'},
];
const conditions={
 missing:{label:'Original source missing',decision:'Editorial hold · source not verified',reason:'The original author and reuse context are absent. Supply a verifiable original before another review.',preview:'The original author and reuse terms are absent. Keep the candidate outside the trusted collection.'},
 broken:{label:'Fictional source unavailable',decision:'Editorial hold · source unavailable',reason:'The fictional submission source https://example.invalid/form-template is unavailable in this scenario. Supply a verifiable original before another review.',preview:'Sample source: https://example.invalid/form-template. No network request is made. Hold publication and ask for a verifiable original.'},
 duplicate:{label:'Duplicates the existing form checklist',decision:'Duplicate merged · use the canonical source',reason:'This candidate duplicates Accessible form checklist. Use that existing resource and its original source; the submission does not create a second trusted entry.',preview:'The submission points to an existing canonical resource. Merge the candidate and preserve the original source.'},
};

export function mountPromptiloStudy({app,esc,btn,choices,announce,wireClick,restoreSearch}){
 const doc=app.ownerDocument,dialog=doc.querySelector('#resource-dialog'),detail=doc.querySelector('#resource-detail');
 const state={query:'',type:'All',saved:new Set(),draft:'missing',decisions:[],editorOpen:false,origin:null};
 const latest=()=>state.decisions.at(-1);
 const publicReview=item=>item.id==='c'&&latest()?latest().decision:item.review;
 const matches=item=>(state.type==='All'||item.type===state.type)&&`${item.name} ${item.desc} ${item.topic}`.toLowerCase().includes(state.query.toLowerCase().trim());
 const canonicalButton=()=>btn('Inspect canonical resource','canonical','data-id="a"','secondary');

 function render(){
  const priorEditor=app.querySelector('#promptilo-editor');
  if(priorEditor)state.editorOpen=priorEditor.hasAttribute('open');
  const list=resources.filter(matches),decision=latest(),draft=conditions[state.draft];
  app.innerHTML=`<h2 tabindex="-1" data-step-title>Find, evaluate, then save.</h2>
   <label class="lab-label" for="resource-search">What are you trying to do?</label><input type="search" class="lab-field" id="resource-search" value="${esc(state.query)}" placeholder="Try forms, layout or design">
   <div class="promptilo-formats" role="group" aria-label="Resource format">${choices([['All','All formats'],['Workflow','Workflow'],['Tutorial','Tutorial'],['Prompt','Prompt']],state.type)}</div>
   <p id="resource-results-count">${list.length} matching sample ${list.length===1?'resource':'resources'}. ${state.saved.size} sample resources saved in this page.</p>
   <div class="lab-items">${list.length?list.map(item=>`<article class="lab-item" data-resource="${item.id}"><div><strong>${esc(item.name)}</strong><small>${esc(item.type)} · <span data-resource-state>${esc(publicReview(item))}</span></small><p>${esc(item.id==='c'&&decision?decision.reason:item.desc)}</p><div class="lab-actions">${btn('Inspect source and limits','detail',`data-id="${item.id}"`,'secondary')}${btn(state.saved.has(item.id)?'Saved':'Save resource','save',`data-id="${item.id}" aria-pressed="${state.saved.has(item.id)}" ${item.id==='c'?'disabled':''}`,'secondary')}</div></div></article>`).join(''):`<div class="lab-empty"><strong>No resources match this combination.</strong><p>Clear the format or search to broaden the result. Your saved items stay intact.</p>${btn('Clear filters','clear','','secondary')}</div>`}</div>
   ${decision?`<section class="lab-callout" id="promptilo-public-feedback" aria-labelledby="promptilo-public-title"><h3 id="promptilo-public-title" tabindex="-1">Public sample feedback: ${esc(decision.decision)}</h3><p>${esc(decision.reason)}</p><p>Applied sample revision ${decision.revision}. The candidate cannot be saved as trusted content. Existing reviewed examples and saved resources are unchanged.</p>${decision.condition==='duplicate'?canonicalButton():''}</section>`:''}
   <details class="lab-extra" id="promptilo-editor" ${state.editorOpen?'open':''}><summary>Follow a sample editorial exception</summary>
   <p>This is a fictional submission review. Choose a draft condition, inspect the reason, then explicitly apply its sample decision. No actual source availability or moderation action is claimed.</p>
   <label class="lab-label" for="editorial-condition">Draft submission condition</label><select id="editorial-condition" class="lab-field">${Object.entries(conditions).map(([id,condition])=>`<option value="${id}" ${state.draft===id?'selected':''}>${esc(condition.label)}</option>`).join('')}</select>
   <p id="editorial-preview">${esc(draft.preview)}</p><p class="lab-muted">${decision?`Public revision ${decision.revision} stays applied until another decision is explicitly applied.`:'The public candidate remains unapproved until a decision is applied.'} Choosing a draft condition does not change the catalog.</p>
   <div class="lab-actions">${btn(state.draft==='duplicate'?'Merge with canonical resource':'Hold publication','editorial-decision','','secondary')}</div>
   ${state.decisions.length?`<h3>Sample decision history</h3><ol id="editorial-history">${state.decisions.map(record=>`<li>Revision ${record.revision}: ${esc(record.decision)}. ${esc(record.reason)}</li>`).join('')}</ol>`:''}</details>
   <p class="lab-muted">The catalog and decisions are illustrative and page-local; refresh resets them. This is not the product’s full search index or a connected publication service.</p>`;
  app.querySelector('#editorial-condition').addEventListener('change',event=>{if(!conditions[event.target.value])return;state.draft=event.target.value;render();announce('Draft condition changed. The applied public decision and saved resources are unchanged.');});
  app.querySelector('#resource-search').addEventListener('input',event=>{state.query=event.target.value;const {selectionStart,selectionEnd}=event.target;render();restoreSearch('#resource-search',selectionStart,selectionEnd);});
 }

 function restoreOrigin(){
  const origin=state.origin;
  const trigger=origin&&app.querySelector(`button[data-action="${origin.action}"][data-id="${origin.id}"]`);
  (trigger??app.querySelector('#resource-search')).focus({preventScroll:true});
 }
 function showDetails(id,{origin}={}){
  const item=resources.find(resource=>resource.id===id);if(!item)return;
  if(origin)state.origin=origin;
  const decision=item.id==='c'?latest():null;
  detail.innerHTML=`<p class="lab-eyebrow">PROVENANCE AND PUBLICATION STATE</p><h2 id="resource-title" tabindex="-1">${esc(item.name)}</h2>
   <p><strong>Creator / catalog context:</strong> ${esc(item.creator)}</p><p id="resource-public-state"><strong>State:</strong> ${esc(publicReview(item))}</p>
   ${decision?`<div class="lab-callout"><p>${esc(decision.reason)}</p><p>Applied sample revision ${decision.revision}. No actual source check, merge or publication was performed.</p>${decision.condition==='duplicate'?'<button type="button" class="lab-button secondary" data-resource-canonical="a">Inspect canonical resource</button>':''}</div>`:''}
   <p><strong>Reuse:</strong> ${esc(item.terms)}</p><p><strong>Freshness:</strong> ${esc(item.updated)}</p>
   ${item.source?`<p><a href="${esc(item.source)}" target="_blank" rel="noopener noreferrer">Open the original source (new tab) </a></p>`:'<div class="lab-callout">No verified source. This entry remains outside the trusted collection and cannot be saved in this study.</div>'}
   ${id==='a'&&state.origin?.id==='c'?'<button type="button" class="lab-button secondary" data-resource-return="c">Return to submission feedback</button>':''}
   <p class="lab-muted">Closing details returns to the same query, format and saved state.</p>`;
  dialog.removeAttribute('aria-label');dialog.setAttribute('aria-labelledby','resource-title');
  if(!dialog.hasAttribute('open'))dialog.showModal();
  detail.querySelector('#resource-title').focus();
 }

 wireClick(data=>{
  if(data.choice){state.type=data.choice;render();announce(`${resources.filter(matches).length} matching sample resources.`);}
  else if(data.action==='clear'){state.query='';state.type='All';render();app.querySelector('#resource-search').focus();announce('Search and format cleared. Saved resources retained.');}
  else if(data.action==='save'){
   const item=resources.find(resource=>resource.id===data.id);
   if(!item||item.id==='c'){announce('This candidate is unapproved and cannot be saved as trusted content.');return;}
   state.saved.add(item.id);render();announce('Resource saved in this sample page.');
  }else if(data.action==='detail')showDetails(data.id,{origin:{action:'detail',id:data.id}});
  else if(data.action==='canonical')showDetails('a',{origin:{action:'canonical',id:'a'}});
  else if(data.action==='editorial-decision'){
   if(latest()?.condition===state.draft){announce('This sample decision is already applied. The current public revision is unchanged.');return;}
   state.decisions.push({condition:state.draft,revision:state.decisions.length+1,decision:conditions[state.draft].decision,reason:conditions[state.draft].reason});
   render();app.querySelector('#promptilo-public-title').focus();announce(`Sample decision applied: ${latest().decision}. The public card and details show revision ${latest().revision}. No real submission was published.`);
  }
 });
 dialog.addEventListener('click',event=>{
  if(event.target.closest('[data-resource-canonical="a"]'))showDetails('a');
  else if(event.target.closest('[data-resource-return="c"]'))showDetails('c');
 });
 doc.querySelector('#close-resource').addEventListener('click',()=>{dialog.close();restoreOrigin();});
 dialog.addEventListener('close',restoreOrigin);
 render();
}
