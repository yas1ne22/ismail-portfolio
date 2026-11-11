// Authored fixtures for the archived visual dashboard. No provider is queried.
const text = (value, fallback) => typeof value === 'string' && value.trim() ? value.trim() : fallback;
const alternatives = (values, brand) => {
  const seen = new Set([brand.toLowerCase()]);
  return (Array.isArray(values) ? values : []).filter(value => typeof value === 'string' && value.trim()).map(value => value.trim()).filter(value => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
};

export async function simulateLegacyAudit(input = {}) {
  const brand = text(input.brandName, 'Sample brand');
  const prompt = text(input.prompt, 'A sample buyer question');
  const category = text(input.category, 'the entered category');
  const competitors = alternatives(input.competitors, brand);
  const rows = ['ChatGPT example','Perplexity example','AI Overviews example','Claude example'].map((engine,index) => ({
    engine, cited:index < 2, rank:index < 2 ? 2 : null,
    status:index < 2 ? 'Illustrative mention' : 'Illustrative omission',
    verdict:`Authored example ${index + 1}. This provider was not queried.`,
  }));
  const mentionRate = rows.filter(row => row.cited).length / rows.length * 100;
  return {
    prompt, brandName:brand, competitors,
    model:'Authored local fixture · no model call', durationMs:0,
    provenance:{kind:'authored_fixture',providerRequests:0,sourceRetrievals:0,publication:'none',duration:'Display-only zero; no provider latency was measured'},
    reasoning:`### Authored comparison\nThis local fixture illustrates how an audit interface could display a question about ${brand} in ${category}.\n\n### Reproducible example\nTwo of four authored rows name the entered brand. No provider response, external citation or source document was collected. The display score is the same 50% sample mention ratio.\n\n### Retest limit\nThe same fixture is returned before and after draft generation. A draft does not cause a simulated improvement, and this example cannot establish a rank, recommendation or commercial effect.`,
    content:`Authored demonstration for: ${prompt}\n\nIn this example, two of four fixture rows name ${brand}; two do not. No live answer engine was queried and no external sources were retrieved. The illustrative position shown in two rows is a display example, not an observed ranking. Compare actual provider responses under a defined collection protocol before drawing a conclusion.`,
    aeoAnalysis:{
      brandMentioned:true, competitorMentions:[], brandPosition:2, brandRank:2,
      aeoScore:mentionRate, shareOfVoice:mentionRate,
      sentiment:'Illustrative fixture · sentiment not assessed', intent:'Entered sample question',
      verdictSummary:'Authored fixture: two of four example rows name the brand. No measured rank or content improvement is established.',
      reasoningPhases:[
        {phase:'Entered context',summary:'The brand, category, question and comparison names come from the form; they are not independently verified.'},
        {phase:'Authored rows',summary:'Two rows contain an illustrative mention and two contain an omission. No provider or model executed these rows.'},
        {phase:'Source boundary',summary:'No pages, reviews, knowledge graphs or citation documents were retrieved.'},
        {phase:'Interpretation',summary:'The sample cannot establish placement, provider consensus, ingestion or a causal effect.'},
      ],
      engineConsensus:rows, citedSources:[],
      competitiveGaps:competitors.map(competitor => ({
        competitor, status:'Not assessed', citationAdvantage:'No competitor pages or provider responses were collected.',
        missingEntities:['Evidence is not supplied for a real comparison.','Do not infer a competitive advantage from this fixture.'],
      })),
      actionPlan:{
        invertedPyramidSnippet:`Draft placeholder for ${brand}. Replace this example with accurate, source-supported service information before using it.`,
        keyProofPoints:['No product facts were verified.','No source citations were collected.','No website content was changed.'],
        recommendedSchema:JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:prompt,acceptedAnswer:{'@type':'Answer',text:'Draft placeholder. Supply an accurate answer supported by the visible page content before use.'}}]},null,2),
        citationAcquisitionTargets:['Identify dated, checkable sources for the actual claims.','Define a real collection protocol before comparing outputs.'],
        contentDiffRecommendation:'Review a proposed draft separately from any publishing decision. No improvement is inferred from this example.',
      },
      suggestedActions:['Review the entered context and missing evidence.','Inspect the draft as an unverified proposal. No placement, citation or recommendation is promised.'],
    },
  };
}

export async function draftLegacyContent(input = {}) {
  const brand = text(input.brandName, 'Sample brand');
  const topic = text(input.targetTopic, 'the stated topic');
  const competitors = alternatives(input.competitors, brand);
  const answer = `Draft for ${brand}, based only on the entered context about ${topic}. Supply verified services, relevant limitations and dated sources before using this text.`;
  const keyFacts = ['The entered context is not independent evidence.','Competitor capabilities, customer results and comparative performance have not been assessed.','This draft makes no provider request and changes no website.'];
  const schema = JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:topic,acceptedAnswer:{'@type':'Answer',text:answer}}]},null,2);
  const targets = [brand,...competitors];
  const table = `| Review item | ${targets.join(' | ')} |\n| :--- | ${targets.map(() => ':---').join(' | ')} |\n${['Verified service scope','Dated source','Known limitations','Observed provider response'].map(label => `| ${label} | ${targets.map(() => 'Not supplied').join(' | ')} |`).join('\n')}`;
  const crawler = '# Review note only. No crawler rules or website files were changed.\n# Review the existing site policy with its owner.\n# This prototype generates no Allow or Disallow directive.';
  return {
    reasoning:'Authored draft for human review. Business claims and comparison evidence were not supplied. No engine, crawler or publisher ran. Accurate content and markup do not establish a particular citation or recommendation.',
    optimizedContent:`## DRAFT FOR REVIEW\n${answer}\n\n## EVIDENCE TO SUPPLY\n${keyFacts.map(value => '- '+value).join('\n')}\n\n## STRUCTURED-DATA EXAMPLE\n\`\`\`json\n${schema}\n\`\`\`\n\n## COMPARISON TO VERIFY\n${table}\n\n## SITE-POLICY REVIEW\n\`\`\`\n${crawler}\n\`\`\``,
    deliverables:{
      invertedPyramidAnswer:answer, keyFacts, jsonLdSchema:schema, comparisonTable:table, crawlerDirectives:crawler,
      directAnswerChecklist:['Verify the facts against dated primary sources.','Review the proposed answer and its visible page context.','Validate any structured data separately before real use.','Publish through a separate approved workflow, then measure actual outputs without assuming an improvement.'],
    },
  };
}
