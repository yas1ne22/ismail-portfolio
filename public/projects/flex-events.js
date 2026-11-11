const events = {
  sample_path_selected: 'A visitor explicitly chooses Launch or Scale. This is intent, not a conversion.',
  sample_form_rejected: 'The form cannot continue. Only invalid field identifiers enter the trace.',
  sample_request_reviewed: 'Valid sample details reach review. No registration or booking has happened.',
  sample_confirmation_failed: 'The simulated service rejects confirmation. A retry keeps the same local request ID.',
  sample_registration_confirmed: 'A new Launch request receives a successful sample confirmation, once per local request.',
  sample_call_request_confirmed: 'A new Scale request receives a successful sample confirmation with a selected time. It remains unqualified until separately reviewed.',
  sample_qualification_reviewed: 'An explicit demo review records met, not met or not reviewed. Route choice and time selection never imply qualification.',
  sample_qualified_booking_confirmed: 'A new confirmed Scale request also has an explicit met qualification review.',
  sample_qualified_booking_revoked: 'A qualified sample is revised, cancelled or given a different qualification decision.',
  sample_existing_request_recognized: 'The existing-request scenario returns a previous confirmation. It does not add a new conversion.',
  sample_confirmation_reused: 'A confirmed request is inspected or reconfirmed. It does not add another registration or call request.',
  sample_request_revision_started: 'Details are reopened. The current sample confirmation and qualification require review again.',
  sample_request_cancelled: 'The local request is cancelled. This is separate from a new conversion.',
  sample_availability_notification_requested: 'A page-local notification request is recorded. It is not a booking or a promise of availability.',
};

export const flexEventContract = {
  schemaVersion: 1,
  updated: '2026-10-20',
  environment: 'portfolio_study',
  scope: 'Local, in-memory demonstration. Nothing is sent to analytics, a registration service or a booking provider. Real results are not collected.',
  fields: {
    sequence: 'Increasing sequence within this page; continues after clearing the visible trace.',
    event: 'One of the documented sample event names.',
    occurredAt: 'ISO timestamp from the local browser clock, not server receipt time.',
    requestId: 'Page-local sample-flex-N identifier; not a production customer or booking ID.',
    path: 'launch or scale',
    goal: 'start, systems, fit or not_selected',
    scenario: 'success, failure, duplicate or unavailable',
    source: 'Always local_simulation; not a service or analytics delivery receipt.',
    qualification: 'not_reviewed, met or not_met; explicitly simulated, never inferred.',
    invalidFields: 'Only name, email or goal identifiers; never their entered values.',
    reason: 'A documented lifecycle reason when a sample qualified state is revoked.',
    realConversion: 'Always false in this study.',
  },
  events,
  productionReadiness: [
    {event:'registration_confirmed', authority:'Approved webinar/registration service', requirement:'Confirmed service request ID and accepted status. A button click, form review, retry or existing request is not a new registration.', connection:'Not connected in this study. Approved webinar schedule and delivery-service details are not supplied here.'},
    {event:'qualified_booking_confirmed', authority:'Booking service plus a separate qualification record', requirement:'An accepted booking and an explicit qualification decision under client-approved criteria. A time selection or Scale route alone is insufficient.', connection:'Not connected. Qualification criteria, review ownership and the production booking service require client approval.'},
    {event:'webinar_attended / call_attended', authority:'Attendance record from the approved event/call service', requirement:'Join attendance to the accepted request ID. Report the cohort, period, denominator and missing attendance records.', connection:'No attendance integration or real attendance results.'},
  ],
  reporting: 'Use distinct authoritative service request IDs, a defined acquisition cohort and observation window. Retain cancellations and qualification changes; do not sum repeated confirmation events. Report attendance separately from registration and booking. The local sample IDs cannot prove server deduplication or analytics delivery.',
};

const paths = new Set(['launch','scale']);
const goals = new Set(['start','systems','fit']);
const scenarios = new Set(['success','failure','duplicate','unavailable']);
const qualifications = new Set(['not_reviewed','met','not_met']);
const invalidNames = new Set(['name','email','goal']);
const reasons = new Set(['qualification_changed','request_revised','request_cancelled','scenario_changed','existing_request']);

export function createFlexEventLedger({now = () => new Date(), limit = 80} = {}) {
  let nextRequest = 0, sequence = 0, current = null;
  const trace = [];
  function append(event, extra = {}) {
    const record = {
      sequence: ++sequence, event, occurredAt: now().toISOString(), environment:'portfolio_study', source:'local_simulation',
      requestId: current?.id || null, path: current?.path || null,
      goal: current?.goal || 'not_selected', scenario: current?.scenario || 'success',
      qualification: current?.qualification || 'not_reviewed', realConversion: false,
    };
    if (extra.invalidFields) record.invalidFields = [...new Set(extra.invalidFields.filter(value => invalidNames.has(value)))];
    if (reasons.has(extra.reason)) record.reason = extra.reason;
    trace.push(record);
    if (trace.length > limit) trace.shift();
  }
  function revokeQualification(reason) {
    if (!current?.qualified) return;
    current.qualified = false;
    append('sample_qualified_booking_revoked',{reason});
  }
  function qualify() {
    if (!current || current.path !== 'scale' || !current.confirmed || current.existing || current.qualification !== 'met' || current.qualified) return;
    current.qualified = true;
    append('sample_qualified_booking_confirmed');
  }
  function start(path, scenario = 'success') {
    if (!paths.has(path)) throw new Error('Unknown Flex path');
    current = {id:`sample-flex-${++nextRequest}`, path, goal:'not_selected', scenario:scenarios.has(scenario)?scenario:'success', ready:false, confirmed:false, completedOnce:false, existing:false, qualified:false, qualification:'not_reviewed', cancelled:false};
    append('sample_path_selected');
  }
  return {
    start,
    invalid(fields) { append('sample_form_rejected', {invalidFields:fields}); },
    review(goal) {
      if (!current || !goals.has(goal)) return false;
      if (current.cancelled) start(current.path,current.scenario);
      current.goal = goal; current.ready = true;
      append('sample_request_reviewed'); return true;
    },
    scenario(value) {
      if (!current || !scenarios.has(value)) return;
      const changed = current.scenario !== value;
      current.scenario = value;
      if (changed) { revokeQualification('scenario_changed'); current.confirmed = false; }
    },
    qualification(value) {
      if (!current || current.path !== 'scale' || !current.ready || current.cancelled || !qualifications.has(value)) return false;
      if (current.qualification === value) return true;
      current.qualification = value;
      if (value !== 'met') revokeQualification('qualification_changed');
      append('sample_qualification_reviewed'); qualify(); return true;
    },
    confirm({slotSelected = false} = {}) {
      if (!current?.ready || current.cancelled || (current.path === 'scale' && (!slotSelected || current.scenario === 'unavailable'))) return false;
      if (current.scenario === 'failure') { append('sample_confirmation_failed'); return false; }
      if (current.scenario === 'duplicate') {
        current.existing = true; current.confirmed = true; revokeQualification('existing_request');
        append('sample_existing_request_recognized'); return true;
      }
      current.confirmed = true;
      if (current.completedOnce || current.existing) append('sample_confirmation_reused');
      else {
        current.completedOnce = true;
        append(current.path === 'launch' ? 'sample_registration_confirmed' : 'sample_call_request_confirmed');
      }
      qualify(); return true;
    },
    revise() {
      if (!current) return;
      current.confirmed = false; current.ready = false; current.qualification = 'not_reviewed'; revokeQualification('request_revised');
      append('sample_request_revision_started');
    },
    cancel() {
      if (!current || current.cancelled) return;
      current.confirmed = false; current.cancelled = true; current.ready = false; revokeQualification('request_cancelled');
      append('sample_request_cancelled');
    },
    notify() { if (current?.path === 'scale' && current.ready && !current.cancelled && current.scenario === 'unavailable') append('sample_availability_notification_requested'); },
    clear() { trace.length = 0; },
    snapshot() { return {current:current ? {...current} : null, records:trace.map(record => ({...record, ...(record.invalidFields ? {invalidFields:[...record.invalidFields]} : {})}))}; },
  };
}

export function flexMeasurementMarkup() {
  return `<details class="lab-extra lab-measurement" id="measurement-events"><summary>Inspect measurement readiness and local sample events</summary><p>Real registration, booking and attendance results: <strong>not collected by this study</strong>. This panel demonstrates event rules in this browser tab. It does not report client conversion or student outcomes.</p><h2>What counts as a confirmed outcome?</h2><dl class="lab-context">${flexEventContract.productionReadiness.map(item => `<dt>${item.event}</dt><dd><strong>Authority:</strong> ${item.authority}<br>${item.requirement}<br><em>${item.connection}</em></dd>`).join('')}</dl><p>${flexEventContract.reporting}</p><div class="lab-measurement-review"><label class="lab-label" for="flex-qualification">Simulated qualification decision</label><select class="lab-field" id="flex-qualification" aria-describedby="flex-qualification-help" disabled><option value="not_reviewed">Not reviewed</option><option value="met">Sample criteria met</option><option value="not_met">Sample criteria not met</option></select><p class="lab-muted" id="flex-qualification-help">Choose Scale and reach a valid review first. This is an explicit demo review. Real criteria and the person responsible for reviewing them require client approval. Route choice and a selected time do not qualify a booking.</p></div><p id="flex-event-current" class="lab-muted">No sample request started.</p><h3>Events from this page</h3><p class="lab-muted">The latest 80 records stay in memory until this tab is reloaded or closed. Names, emails and entered form text are excluded. Clearing this trace preserves the current request’s deduplication state.</p><p id="flex-event-status" class="lab-muted" role="status" aria-live="polite">No events yet.</p><ol id="flex-event-trace" class="lab-event-trace" tabindex="0" aria-label="Local sample event records"></ol><div class="lab-actions"><button type="button" class="lab-button secondary" id="flex-events-download">Download sample trace</button><button type="button" class="lab-button secondary" id="flex-events-clear">Clear trace</button><a href="measurement-contract.json">Inspect event definitions JSON </a></div><noscript>The event definitions above remain readable. The local trace requires JavaScript.</noscript></details>`;
}

export function mountFlexMeasurement(document, {download} = {}) {
  const panel = document.querySelector('#measurement-events');
  if (!panel) throw new Error('Missing Flex measurement evidence panel');
  const ledger = createFlexEventLedger();
  const control = panel.querySelector('#flex-qualification');
  function render() {
    const {current, records} = ledger.snapshot();
    control.disabled = !current || current.path !== 'scale' || !current.ready || current.cancelled;
    control.value = current?.qualification || 'not_reviewed';
    panel.querySelector('#flex-event-current').textContent = current ? `Current sample: ${current.id} · ${current.path} · ${current.cancelled ? 'cancelled' : current.existing ? 'existing request' : current.confirmed ? 'confirmed' : 'not confirmed'} · qualification: ${current.qualification.replaceAll('_',' ')}. Real conversion: no.` : 'No sample request started.';
    panel.querySelector('#flex-event-status').textContent = records.length ? `${records.length} local sample records. Latest: ${records.at(-1).event}. No data was sent.` : 'No events in this trace. Existing sample request state, if any, is retained.';
    const trace = panel.querySelector('#flex-event-trace');
    trace.replaceChildren();
    for (const record of records) {
      const item = document.createElement('li'), code = document.createElement('pre');
      code.textContent = JSON.stringify(record, null, 2); item.append(code); trace.append(item);
    }
  }
  const api = {};
  for (const action of ['start','invalid','review','scenario','confirm','revise','cancel','notify']) api[action] = (...args) => { const result = ledger[action](...args); render(); return result; };
  control.addEventListener('change', () => { ledger.qualification(control.value); render(); });
  panel.querySelector('#flex-events-clear').addEventListener('click', () => { ledger.clear(); render(); });
  panel.querySelector('#flex-events-download').addEventListener('click', () => download?.('flex-sample-event-trace.json', {schemaVersion:flexEventContract.schemaVersion, environment:'portfolio_study', realResults:'not_collected', ...ledger.snapshot()}));
  if (globalThis.location?.hash === '#measurement-events') { panel.open = true; panel.scrollIntoView(); }
  render(); return api;
}
