// Context integrity for the archived portfolio dashboard. This module does not
// call a provider or publish content. React and its JSX runtime are supplied by
// the existing bundle so the dashboard keeps a single runtime.
const clean = value => String(value ?? '').trim();
const competitors = (value, brand) => {
  const seen = new Set([clean(brand).toLowerCase()]);
  return (Array.isArray(value) ? value : String(value ?? '').split(/[,\n]/))
    .map(clean).filter(value => {
      const key = value.toLowerCase();
      if (!value || seen.has(key)) return false;
      seen.add(key); return true;
    });
};
const normalized = context => ({
  brand: clean(context.brand), industry: clean(context.industry),
  competitors: competitors(context.competitors, context.brand), query: clean(context.query),
});
const presetContext = preset => ({brand:preset.defaultBrand, industry:preset.category,
  competitors:preset.defaultCompetitors.join(', '), query:preset.defaultQuery});
const key = context => JSON.stringify(normalized(context));
const sourceKey = (workspaceId, initialPrompt) => JSON.stringify([workspaceId,initialPrompt || '']);
const matchingPreset = (context, presets) => presets.find(preset => key(context) === key(presetContext(preset)))?.id ?? null;

export function createLegacyAuditContext({workspaceId, workspace = {}, initialPrompt = '', presets}) {
  const known = presets.find(preset => clean(preset.defaultBrand).toLowerCase() === clean(workspace.primaryBrand).toLowerCase());
  const context = {
    brand:workspace.primaryBrand || '', industry:workspace.category || known?.category || '',
    competitors:competitors(workspace.competitors ?? known?.defaultCompetitors ?? [],workspace.primaryBrand).join(', '),
    query:initialPrompt || known?.defaultQuery || (workspace.primaryBrand ? `How do customers compare ${workspace.primaryBrand} with its alternatives?` : ''),
  };
  return {context, baseline:key(context), presetId:matchingPreset(context,presets), dirty:false,
    pendingPresetId:null, review:null, error:'', notice:'Review all four fields before preparing a sample audit.',
    version:0, sourceKey:sourceKey(workspaceId,initialPrompt)};
}

export function transitionLegacyAuditContext(state, action, presets) {
  if (action.type === 'edit') {
    if (!['brand','industry','competitors','query'].includes(action.field)) throw new Error('Unknown audit field');
    if (state.context[action.field] === action.value) return state;
    const context = {...state.context,[action.field]:action.value};
    return {...state,context,presetId:matchingPreset(context,presets),dirty:key(context)!==state.baseline,
      pendingPresetId:null,review:null,error:'',version:state.version+1,
      notice:'Context edited. Previous sample results are cleared; review the complete context before running again.'};
  }
  if (action.type === 'request-preset') {
    const preset = presets.find(preset=>preset.id===action.id);
    if (!preset) throw new Error('Unknown audit preset');
    if (key(state.context) === key(presetContext(preset))) return state.pendingPresetId
      ? {...state,pendingPresetId:null,notice:'The currently displayed context is retained.'} : state;
    if (state.dirty) return {...state,pendingPresetId:preset.id,error:'',notice:'Your edited fields have not been replaced. Choose whether to apply all four preset fields.'};
    return applyPreset(state,preset);
  }
  if (action.type === 'apply-preset') {
    const preset = presets.find(preset=>preset.id===state.pendingPresetId);
    return preset ? applyPreset(state,preset) : state;
  }
  if (action.type === 'keep-context') return {...state,pendingPresetId:null,notice:'Your complete edited context is retained.'};
  if (action.type === 'review') {
    if (state.pendingPresetId) return state;
    const context=normalized(state.context);
    const missing=['brand','industry','query'].filter(field=>!context[field]);
    if (missing.length) return {...state,review:null,error:`Complete ${missing.join(', ')} before reviewing this audit.`};
    return {...state,error:'',review:{context,version:state.version,sourceKey:state.sourceKey},
      notice:'Confirm this exact context. No provider will be called.'};
  }
  if (action.type === 'edit-review') return {...state,review:null,error:'',notice:'Edit any field, then review the complete context again.'};
  throw new Error('Unknown audit context action');
}

function applyPreset(state,preset) {
  const context=presetContext(preset);
  return {...state,context,baseline:key(context),presetId:preset.id,dirty:false,pendingPresetId:null,
    review:null,error:'',version:state.version+1,
    notice:'All four preset fields were applied together. Previous sample results are cleared.'};
}

export function useLegacyAuditContext(React, options) {
  const [state,setState]=React.useState(()=>createLegacyAuditContext(options));
  const current=React.useRef(state),invalidate=React.useRef(options.onInvalidate),lastAction=React.useRef(null);
  invalidate.current=options.onInvalidate;
  function update(action) {
    const previous=current.current,next=transitionLegacyAuditContext(previous,action,options.presets);
    lastAction.current=action.type;current.current=next;setState(next);
    if (next.version!==previous.version) invalidate.current();
    return next;
  }
  React.useEffect(()=>{
    const incomingKey=sourceKey(options.workspaceId,options.initialPrompt);
    if (incomingKey===current.current.sourceKey) return;
    const next=createLegacyAuditContext(options);
    current.current=next;setState(next);invalidate.current();
  },[options.workspaceId,options.initialPrompt]);
  const previousPending=React.useRef(null);
  React.useEffect(()=>{
    const hadPending=previousPending.current;previousPending.current=state.pendingPresetId;
    if(typeof document==='undefined')return;
    const invalid=state.error && ['brand','industry','query'].find(field=>!clean(state.context[field]));
    const id=state.pendingPresetId ? 'aevis-audit-preset-choice' : state.review ? 'aevis-audit-review-title'
      : invalid ? 'aevis-audit-'+invalid : hadPending && ['apply-preset','keep-context'].includes(lastAction.current) ? 'aevis-audit-brand' : null;
    const target=id && document.getElementById(id);
    if(target){target.focus({preventScroll:true});target.scrollIntoView({block:'start',behavior:'instant'});}
  },[state.review,state.pendingPresetId,state.error]);
  return {...state,preset:options.presets.find(preset=>preset.id===state.presetId) ?? null,
    pendingPreset:options.presets.find(preset=>preset.id===state.pendingPresetId) ?? null,
    edit:(field,value)=>update({type:'edit',field,value}),
    requestPreset:id=>update({type:'request-preset',id}),
    applyPreset:()=>update({type:'apply-preset'}),keepContext:()=>update({type:'keep-context'}),
    requestReview:()=>update({type:'review'}),editReview:()=>update({type:'edit-review'}),
    isCurrent:record=>!!record && !current.current.pendingPresetId && record===current.current.review
      && record.version===current.current.version && record.sourceKey===sourceKey(options.workspaceId,options.initialPrompt),
  };
}

export function renderLegacyContextNotice(runtime, context, busy, onRun) {
  const {jsx,jsxs}=runtime;
  const button=(label,onClick,extra={})=>jsx('button',{type:'button',onClick,disabled:busy,
    className:'px-4 py-2 rounded-lg border border-white/30 text-sm text-white disabled:opacity-50',...extra,children:label});
  const review=context.review?.context;
  return jsxs('section',{className:'rounded-xl border border-cyan-500/40 bg-black/30 p-4 space-y-3',
    'aria-label':'Audit context review',children:[
      jsx('p',{className:'text-sm font-semibold text-cyan-300',children:context.preset ? `Preset context: ${context.preset.name}` : 'Custom context · no preset is selected'}),
      jsx('p',{role:'status','aria-live':'polite',className:'text-xs text-zinc-300',children:context.notice}),
      context.error && jsx('p',{role:'alert',className:'text-sm text-rose-300',children:context.error}),
      context.pendingPresetId && jsxs('div',{'aria-label':'Preset replacement choice',className:'space-y-3',children:[
        jsx('p',{id:'aevis-audit-preset-choice',tabIndex:-1,style:{scrollMarginTop:'96px'},className:'text-sm text-amber-200',children:`Apply ${context.pendingPreset?.name} (${context.pendingPreset?.defaultBrand})? This replaces the brand, industry, competitors and question together. Your current edits stay intact until you choose.`}),
        jsxs('div',{className:'flex flex-wrap gap-3',children:[button('Apply all four preset fields',context.applyPreset),button('Keep my edited context',context.keepContext)]}),
      ]}),
      review && !context.pendingPresetId && jsxs('div',{className:'space-y-3',children:[
        jsx('h2',{id:'aevis-audit-review-title',tabIndex:-1,style:{scrollMarginTop:'96px'},className:'text-base font-bold text-white',children:'Confirm the complete audit context'}),
        jsxs('dl',{className:'grid gap-2 text-sm text-zinc-200',children:[
          ...[['Brand',review.brand],['Industry',review.industry],['Competitors',review.competitors.join(', ') || 'None · no competitor comparison'],['Question',review.query]]
            .flatMap(([label,value])=>[jsx('dt',{className:'font-semibold text-zinc-400',children:label},label+'-label'),jsx('dd',{className:'break-words',children:value},label+'-value')]),
        ]}),
        jsx('p',{className:'text-xs text-zinc-300',children:'Blank, duplicate and own-brand competitor entries are excluded. This exact context produces an authored fixture; no website or provider is queried.'}),
        jsxs('div',{className:'flex flex-wrap gap-3',children:[button('Run simulated audit with this context',()=>onRun(context.review)),button('Edit this context',context.editReview)]}),
      ]}),
    ]});
}
