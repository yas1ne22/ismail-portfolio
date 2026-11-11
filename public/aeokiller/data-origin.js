// Readable boundaries for the archived dashboard. These helpers perform no
// provider request, site fetch, analytics collection or external publication.
export function tagDemoPackage(value, source) {
  return {...value,demoSource:source==='bundle' ? 'bundled_examples' : 'unverified_local_examples'};
}

export const demoViewSources = {
  simulator:{title:'Audit and retest',summary:'Entered context produces the same authored fixture before and after draft generation.',
    definitions:[['Mention ratio','Two of four authored rows name the brand: 2 / 4 = 50%. The display score repeats this ratio; it does not assess authority.'],['Provider rows and positions','Names, illustrative positions and omissions are authored examples. No model or engine was called.'],['Draft and retest','Generated text is an unverified proposal. Retest repeats the fixture and cannot establish content effectiveness.']]},
  overview:{title:'Command Center',summary:'The scorecards, change indicators, engine bars, action queue and citation card are interface examples.',
    definitions:[['Scores, rates and changes','These values are authored or unverified local examples. There is no measured query set, denominator or collection interval behind these scorecards.'],['Engine bars','The bar lengths are display examples, not provider health, uptime or measured citation coverage.'],['Actions and citation card','The example queue is not a detected issue list. Any quoted answer, source name or position is unverified; no answer or document was retrieved.']]},
  insights:{title:'Citation examples',summary:'Answer text, source URLs, dates and positions are local examples, not collected provider responses.',
    definitions:[['Answer and source rows','A displayed URL is an example reference, not evidence that a model cited or even retrieved that page.'],['Position and source values','Positions and source-value numbers are illustrative. They do not measure ranking or domain authority.'],['Dates and filtering','Dates belong to the examples and are not collection timestamps. Search and provider filters only select local rows.']]},
  prompts:{title:'Prompt examples',summary:'The prompt catalog and its volume, growth and position columns are illustrative.',
    definitions:[['Volume and growth','Numbers are authored or unverified local examples, not estimates derived from search demand or provider query logs.'],['Catalog total','The displayed total sums the example monthly-volume fields in the full local catalog. Filtering rows does not change that catalog total.'],['Position and actions','Position values are examples. Opening a prompt prepares a local audit context for review; it does not verify a citation.']]},
  benchmark:{title:'Competitor examples',summary:'The comparison numbers, mention/omission scenarios and source names are illustrative, not a competitive assessment.',
    definitions:[['Example shares','The two-part chart uses the selected competitor’s example citation share and 100 minus that value. It is not measured market share.'],['Comparison rate','The example rate is 100 minus the selected competitor’s example win-rate field. There is no observed query denominator.'],['Index difference','The displayed difference subtracts the competitor’s example visibility score from the workspace’s example visibility score.'],['Comparison scenarios','Mention and omission states are authored scenarios, not wins or losses observed in provider output.'],['Source names','Listed sources were not retrieved or checked. They do not establish an advantage for either brand.']]},
  optimizer:{title:'Draft studio',summary:'The studio prepares an unverified draft from entered context; it does not optimize or publish a website.',
    definitions:[['Input','The brand, topic and page notes are unverified context. Editing them does not collect source evidence.'],['Output','Draft text and structured-data examples are for fact-checking and separate validation. Comparison facts are left unfilled when evidence is missing.'],['Effect','Copying text changes the clipboard only. Nothing is published or submitted to an engine, and no citation or rank improvement is inferred.']]},
  crawlers:{title:'Crawler examples',summary:'Bot counts, log rows and response codes are local display examples. The URL tool only parses syntax.',
    definitions:[['Bot cards and logs','Counts, dates, response codes and allowed/blocked states are illustrative, not server telemetry or crawl history.'],['URL example','A valid URL can be parsed locally. HTTP status, robots policy, crawler access and indexability remain unknown because the site is not fetched.']]},
  records:{title:'Unverified brand notes',summary:'Existing notes are unverified examples. New entries are page-local context, not verified business facts.',
    definitions:[['Entries and dates','A title, category or example date does not verify a claim. No certification, integration, price or citation frequency is checked.'],['Local lifetime','Adding an entry changes this mounted view only. Closing or switching views resets its added entries; no account record is saved.'],['Copy','The copied text is labeled unverified notes. It is not a canonical knowledge base, a crawler policy or a publication to any website or engine.']]},
};

export function renderDemoViewSource(runtime, view, pack) {
  const info=demoViewSources[view];
  if(!info)throw new Error('Unknown demonstration view: '+view);
  const {jsx,jsxs}=runtime;
  const origin=view==='simulator' || view==='optimizer' ? 'Entered context · authored output'
    : pack?.demoSource==='bundled_examples' ? 'Bundled authored examples' : 'Unverified local example data';
  return jsxs('section',{id:'aevis-view-origin',tabIndex:-1,className:'aevis-view-context','aria-label':info.title+' data source',
    'data-demo-view':view,children:[
      jsx('p',{className:'aevis-view-context__eyebrow',children:origin}),
      jsx('p',{children:info.summary}),
      jsx('p',{className:'aevis-view-context__limit',children:'No provider collection, source retrieval or external publication is connected. No collection date or measured outcome is available.'}),
      jsxs('details',{children:[jsx('summary',{children:'What the displayed values mean'}),
        jsx('dl',{children:info.definitions.flatMap(([label,description])=>[
          jsx('dt',{children:label},label+'-label'),jsx('dd',{children:description},label+'-description'),
        ])}),
        view!=='simulator' && view!=='optimizer' && jsx('p',{children:'Workspace labels may change while example values are reused. The displayed data does not establish facts about the selected brand.'}),
      ]}),
    ]});
}

export function describeUnfetchedUrl(value) {
  let url;
  try {url=new URL(String(value).trim());} catch {return 'Enter a valid http:// or https:// URL. Nothing was fetched or checked.';}
  if(!['http:','https:'].includes(url.protocol) || url.username || url.password)
    return 'Use an http:// or https:// URL without embedded credentials. Nothing was fetched or checked.';
  return `Parsed locally: ${url.host}${url.pathname || '/'}. Not fetched. HTTP status, robots policy, crawler access and indexability are unknown.`;
}

export function makeDemoBrandRecord({title,category,content}, now=new Date()) {
  if(!String(title ?? '').trim() || !String(content ?? '').trim())throw new Error('A title and description are required.');
  return {id:'local-note-'+now.getTime(),title:String(title).trim(),category:String(category || 'Core Offering'),
    content:String(content).trim(),origin:'entered_context',enteredAt:now.toISOString().slice(0,10),
    citedFrequency:null,verifiedBy:null,lastVerified:null};
}

export function serializeDemoBrandNotes(name, records) {
  return `# ${name || 'Sample brand'}: Unverified portfolio notes\n\n`+
    '> These are unverified local examples and entered context. No provider, source or business claim was checked. Nothing was published. This is not a crawler policy or canonical knowledge base.\n\n'+
    records.map(record=>`## [${record.category}] ${record.title}\n${record.content}\n`+
      `Entry source: ${record.origin==='entered_context'?'page-local entered context':'unverified example record'}.\n`+
      `Date context: ${record.enteredAt || record.lastVerified || 'not supplied'} (not a verification or provider collection date).\n`+
      'Citation frequency: not measured. Independent verification: not performed.\n').join('\n');
}

export async function copyDemoBrandNotes(text, clipboard) {
  try {
    if(!clipboard?.writeText)throw new Error('Clipboard unavailable');
    await clipboard.writeText(text);
    return {state:'copied',message:'Unverified notes copied. Nothing was published.',text:''};
  } catch {
    return {state:'unavailable',message:'Clipboard access is unavailable. Select and copy these unverified notes.',text};
  }
}

export function renderDemoExportFeedback(runtime, result) {
  if(!result)return null;
  const {jsx,jsxs}=runtime;
  return jsxs('div',{className:'aevis-export-feedback',children:[
    jsx('p',{role:'status',children:result.message}),
    result.state==='unavailable' && jsxs('div',{children:[
      jsx('label',{htmlFor:'aevis-brand-notes-copy',children:'Unverified notes to copy'}),
      jsx('textarea',{id:'aevis-brand-notes-copy',readOnly:true,rows:8,value:result.text}),
    ]}),
  ]});
}
