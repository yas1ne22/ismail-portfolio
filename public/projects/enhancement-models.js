export function contactEligibility({ booking, consent, contacted }) {
  if (booking !== 'incomplete' && booking !== 'completed') return { eligible: false, reason: 'Booking status is unknown. Recheck the booking service; do not send a reminder.' };
  if (booking === 'completed') return { eligible: false, reason: 'A completed booking suppresses recovery contact across channels.' };
  if (!consent) return { eligible: false, reason: 'Contact permission is unavailable. Keep the on-site return available without outbound contact.' };
  if (contacted) return { eligible: false, reason: 'The shared contact budget has been used. Suppress another message on either channel.' };
  return { eligible: true, reason: 'Eligible in this sample only: known incomplete booking, contact permission and an unused shared contact budget.' };
}

export function auditFixture(context, scenario = 'complete') {
  const queries = [context.query, `What does ${context.brand} offer?`];
  const rows = queries.flatMap((query, q) => ['Provider A fixture', 'Provider B fixture'].map((provider, p) => ({
    query, provider, model: 'No model called; authored fixture',
    state: scenario === 'none' || (scenario === 'partial' && p === 1) ? 'unavailable' : 'returned',
    mentioned: scenario === 'conflict' ? p === 0 : q === 0 || p === 0,
    observation: scenario === 'conflict' ? (p === 0 ? 'Sample response names the brand.' : 'Sample response does not name the brand.') : 'Authored interface example; no provider output was collected.',
  })));
  const returned = rows.filter(row => row.state === 'returned');
  const mentions = returned.filter(row => row.mentioned).length;
  return {
    context: structuredClone(context), scenario, rows, mentions, returned: returned.length, missing: rows.length - returned.length,
    percentage: returned.length ? Math.round(100 * mentions / returned.length) : null,
    stale: scenario === 'stale', conflicting: scenario === 'conflict',
    provenance: 'Authored on 20 October 2026 for this portfolio. No provider, model or live collection run is connected.',
  };
}

export function validateWorkspace(value, normalize) {
  if (!value || value.version !== 1 || !Array.isArray(value.sites) || value.sites.length > 100) throw new Error('Use a version 1 workspace with at most 100 sites.');
  const categories = Array.isArray(value.categories) ? value.categories : ['Work', 'Build', 'Create', 'Learn'];
  if (!categories.length || categories.length > 12 || categories.some(c => typeof c !== 'string' || !c.trim() || c.length > 40) || new Set(categories).size !== categories.length) throw new Error('Workspace destinations must be unique, nonempty names.');
  const seen = new Set();
  const sites = value.sites.map((site, i) => {
    if (typeof site.title !== 'string' || !site.title.trim() || site.title.length > 200 || !categories.includes(site.category)) throw new Error('Each site needs a title and an existing destination.');
    const url = normalize(site.url);
    if (seen.has(url)) throw new Error('The imported workspace contains duplicate URLs. No data was replaced.');
    seen.add(url);
    return { id: i + 1, title: site.title, url, category: site.category };
  });
  return { sites, categories };
}
