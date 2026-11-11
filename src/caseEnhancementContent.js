// Current artifact descriptions, not invented client approvals or participant findings.
export const caseEnhancements = {
  andalus: {
    audience: 'A traveler returning to an interrupted flight search; segment hypotheses still need traveler evidence.',
    problem: 'A recovery message loses its value when the return page forgets the trip or implies an expired fare is still available.',
    constraint: 'Booking status, identity, consent and current availability must agree before a reminder or booking action is eligible.',
    choice: ['A generic campaign return', 'Restore the saved trip and revalidate the fare', 'Preserved context reduces repeated entry; the cost is a dependency on reliable eligibility and availability checks.'],
    deferred: 'Automatic cross-channel delivery and rollout until the actual service owners, consent rules and experiment sample size are confirmed.',
    walkthrough: [
      ['Recognize the trip', 'Read the saved route, dates and traveler name. A saved search is explicitly separate from a ticket or a held fare.'],
      ['Review a change', 'Switch between available, changed-fare and sold-out conditions. Current price and the retained search remain separate.'],
      ['Recover without starting over', 'Inspect alternatives while keeping the route and traveler context. No purchase is made.'],
      ['Check the invitation', 'Unknown booking status, missing consent or a used contact budget stops contact. The sample explains the blocking reason.'],
    ],
    available: 'A dated role/reconstruction/planned-work timeline, proposed operational handoff, and multilingual local saved-trip and eligibility study.',
    dependencies: 'Operational integration, actual delivery dates, team assignments and historical reporting definitions remain unconfirmed.',
  },
  'flex-academy': {
    audience: 'Two proposed visitor goals: learning to start and improving an existing operation; unit count alone does not assign the route.',
    problem: 'A single broad conversion action hides whether someone is requesting education or an operating-system conversation.',
    constraint: 'A saved desktop reference exists, but approved schedules, commercial terms and a live booking provider have not been supplied.',
    choice: ['Equal-weight offers on one long page', 'A goal-based choice leading to two complete tasks', 'The goal makes the commitment clearer; it adds a routing decision that must be tested with ambiguous one-unit operators.'],
    deferred: 'Real registration, paid commitments and live calendar integration until offer details and the client-approved version are available.',
    walkthrough: [
      ['Choose a goal', 'Choose starting out or improving an existing operation. The person can revise the route.'],
      ['Review before committing', 'Use sample details. Invalid email feedback keeps the other inputs intact.'],
      ['Inspect availability', 'The call route converts the same illustrative appointment into the chosen timezone. No availability offers a notification request.'],
      ['Confirm and recover', 'Complete either sample task, retry a service failure, edit details or cancel. A sample confirmation never implies a real appointment.'],
    ],
    available: 'Current portfolio task study, reviewed 22 October 2026; the Versions section distinguishes the saved desktop composition and supplied Figma file.',
    dependencies: 'Client approval, Figma parity, original delivery period, collaborator responsibilities and conversion outcomes are unverified.',
  },
  veyra: {
    audience: 'A traveler assembling and changing a one-day city plan; this is a design hypothesis awaiting observed planning sessions.',
    problem: 'Saved places do not explain which visits fit together or what a change does to the rest of the day.',
    constraint: 'The local prototype has illustrative geography, visit times and access notes, with no live routing or ticket service.',
    choice: ['Configure preferences before seeing places', 'Explore places and build a day alongside the map', 'A concrete day gives the setup context; list parity and explicit time constraints are needed to keep the map usable.'],
    deferred: 'Live directions, reservations, access verification and multi-day optimization; the MVP is one recoverable day.',
    walkthrough: [
      ['Explore and add', 'Find a place through the searchable list, inspect it and add it to the day.'],
      ['Read the shared plan', 'Map numbering and the ordered list describe the same stops. Visit estimates are editable.'],
      ['Resolve a conflict', 'Shorten a visit or remove a stop when the day exceeds the chosen end time. Ticket checks remain unresolved commitments.'],
      ['Change and undo', 'Use buttons to reorder, replace a weather-sensitive stop or remove one, then restore the prior plan.'],
    ],
    available: 'Map-first local planner is the current reference. The earlier configure-first Figma flow remains labeled Version 1.',
    dependencies: 'The original project duration, feedback attribution, traveler research and a comparative outcome study are not recorded.',
  },
  'design-handoff': {
    audience: 'A designer preparing a bounded file for a developer; practical team usefulness still needs evaluation with both roles.',
    problem: 'A report that only lists issues does not tell the next person where to look, what matters or whether a condition is intentional.',
    constraint: 'The scanner observes file structure; it cannot decide every design intention, inspect unlimited nodes or certify accessibility.',
    choice: ['Automatically repair every flagged layer', 'Explain the finding and let the designer review the source', 'Human review protects intentional exceptions; it requires a clear source reference and a fresh scan after changes.'],
    deferred: 'Automatic source edits and broad quality certification; the MVP is an actionable, bounded review report.',
    walkthrough: [
      ['Choose a bounded scope', 'Selection and current-page scope are distinct. An empty selection should not silently become a complete file scan.'],
      ['Read the source and finding', 'Inspect a named node, the observed condition, priority and implementation question.'],
      ['Correct and rescan', 'Apply the illustrative correction. The previous report stays stale until the same scope is scanned again.'],
      ['Interpret incomplete results', 'Compare no findings, a capped result, unavailable information and an interrupted scan.'],
    ],
    available: 'Development plugin package, readable sample source, interactive repair and rescan, downloadable sample report.',
    dependencies: 'Original development period and assistance are not recorded. No public adoption, manual-review comparison or team time saving is established.',
  },
  'design-system-doctor': {
    audience: 'A system maintainer reviewing a specific component/library scope; cross-library usefulness is not yet measured.',
    problem: 'A literal value, an unresolved library and an intentional alias cannot all be interpreted as confirmed system drift.',
    constraint: 'Matching depends on the bindings and styles actually available to the scanner; unavailable libraries must remain unknown.',
    choice: ['One strict score for every file', 'Balanced and Strict findings with source evidence and exceptions', 'Depth can fit the maintenance task; more findings can also create noise and need maintainer review.'],
    deferred: 'Universal health scores, automatic token replacement and compatibility claims for libraries that have not been tested.',
    walkthrough: [
      ['Compare depth on one source', 'Run Balanced and Strict against the same sample and inspect the additional adoption questions.'],
      ['Check an alias', 'Keep an intentional campaign alias when the source context justifies the variation.'],
      ['Repair actual drift', 'Bind the sample to its intended token, then rescan the same scope to see exactly what changed.'],
      ['Read uncertainty', 'No findings, capped findings, unavailable libraries and interrupted assessment have different meanings.'],
    ],
    available: 'Working tool source and an inspectable diagnosis, exception, correction and rescan sequence.',
    dependencies: 'Real-library and RTL audits, maintainer feedback, misses/false-positive measurement and delivery dates remain unrecorded.',
  },
  nexus: {
    audience: 'Initial design hypothesis: a designer or builder saving references during desk work and retrieving them for a later task.',
    problem: 'A useful link can be captured quickly and still disappear into a flat or ambiguous bookmark archive.',
    constraint: 'This anonymous browser study has page-local state. Cross-device accounts and provider-dependent feeds are separate product features.',
    choice: ['A flat saved-link list', 'Four editable destinations with search and move controls', 'Contexts make retrieval intent visible; overlapping categories require an escape through search, moving and recovery.'],
    deferred: 'Cross-device synchronization and required discovery feeds; the MVP is save, find, move and recover.',
    walkthrough: [
      ['Start without permissions', 'Inspect sample content or start empty. Optional permission refusal leaves manual capture available.'],
      ['Capture a reference', 'Add a valid URL and destination. An absent title falls back to the host; equivalent URLs do not create duplicates.'],
      ['Find, open and reorganize', 'Search across destinations, open a saved title in a new tab, move a reference or delete a category by moving its links to another destination.'],
      ['Recover the workspace', 'Keep an unfinished capture through search and destination changes. Reveal an existing duplicate, undo removal, then export a JSON copy and review its validated contents before replacement.'],
    ],
    available: 'Product captures plus an account-free browser demo: save, find, open, move and recover. The demo requires no configured provider; refresh resets its page-local workspace.',
    dependencies: 'Real category/retrieval research, original delivery dates, actual activation and repeat-use cohorts have not been supplied.',
  },
  prepflow: {
    audience: 'Initial design hypothesis: one household planner with basic cooking experience preparing a small shared meal plan.',
    problem: 'Changing a meal creates repeated work when servings, pantry stock, groceries and preparation are managed separately.',
    constraint: 'Recipe values and preparation times are illustrative estimates; equipment can make a selected preparation unsuitable.',
    choice: ['Require a complete preference questionnaire first', 'Offer a useful sample plan and reveal optional preferences later', 'A useful first plan lowers setup effort; defaults and estimation limits must remain explicit.'],
    deferred: 'Personalized nutrition recommendations, live grocery purchasing and automated scheduling; the current week is a manually editable three-dinner sample.',
    walkthrough: [
      ['Start with a useful week', 'Use three two-serving dinners immediately, or skip preferences. Later goal changes affect only unstarted meals.'],
      ['Swap one meal', 'The selected dinner, nutrition, preparation estimate and shared weekly grocery totals change together. A started session needs an explicit reset decision.'],
      ['Check the constraints', 'Invalid servings keep the last valid week. Lost equipment pauses the current timer. Changes to already prepared quantities require an explicit adjustment.'],
      ['Resume preparation', 'Pause the sample timer, change servings or visit another day, then resume the retained step and elapsed time. Other dinners keep their plan and progress.'],
    ],
    available: 'Product screens and a current portfolio study reviewed 24 October 2026: three planned dinners, one grocery total, per-day progress and a sample timer. It is separate from a production release.',
    dependencies: 'A real planning/shopping/preparation week, physical kitchen observation and original team/duration details are not recorded.',
  },
  promptilo: {
    audience: 'Initial design hypothesis: a designer finding a reusable form workflow for a recurring product deliverable.',
    problem: 'A large resource catalog does not establish relevance, permission to reuse an item or confidence in its original source.',
    constraint: 'Automated discovery is broader than editorial approval; uncertain sources must not acquire a trusted label.',
    choice: ['Publish every collected resource immediately', 'Separate discovery candidates from reviewed resources', 'A visible review boundary protects provenance; it requires exception handling and a clear public explanation.'],
    deferred: 'Automatic publication and claims about search effectiveness until representative retrieval and trust tasks have been observed.',
    walkthrough: [
      ['Search by a job', 'Enter a query, narrow its format and recover from an empty combination without losing saves.'],
      ['Inspect before saving', 'Open creator, original source, freshness context and reuse limits. Return to the same query and filters.'],
      ['Review an exception', 'Choose the fictional unavailable-source condition and apply a hold. Preparing a different draft condition keeps the applied public decision intact.'],
      ['See the public consequence', 'The card and source details show the same applied revision and reason. Explicitly merge the duplicate, inspect its canonical source and return to the same query, format and saves. The candidate stays unsavable.'],
    ],
    available: 'Product captures and a local study reviewed 24 October 2026: search, details, saving and explicit editorial decisions with matching public feedback. No connected publication service is demonstrated.',
    dependencies: 'Actual classification tests, observed relevance, trust comprehension, original project dates and useful-return cohorts are unavailable.',
  },
  skinny: {
    audience: 'A proposed daily-routine organizer for people following their own existing instructions; the initial care segment needs actual research.',
    problem: 'A quick completion action can become an ambiguous historical record when a person changes a schedule or logs by mistake.',
    constraint: 'The interface organizes records and reminders; it does not infer treatment, recommend doses or change medical instructions.',
    choice: ['Treat completion as irreversible progress', 'Keep logging reversible and schedules separate from history', 'Correction preserves an interpretable record; the interface must make the difference between a log and advice explicit.'],
    deferred: 'Treatment guidance, automatic schedule conversion and adherence/health claims; the MVP is a correctable personal record.',
    walkthrough: [
      ['Log and correct', 'Record a sample routine and undo an accidental action. Non-color labels explain the logged state.'],
      ['Change the next schedule', 'Edit a future reminder time while the previous day retains its original schedule.'],
      ['Inspect a day boundary', 'Change the display timezone and review yesterday without moving its records into today.'],
      ['Choose reminder privacy', 'Compare a generic preview with an explicit opt-in named preview; inspect the denied-notification fallback.'],
    ],
    available: 'Native-product case screens plus a fictional, page-local timeline and correction study.',
    dependencies: 'Native notification behavior, device accessibility, daily-use findings, team/duration and sustained usefulness remain unverified.',
  },
  'timer-gym': {
    audience: 'Initial design hypothesis: a person using a short interval timer with intermittent access to the screen; gym conditions need observation.',
    problem: 'A countdown alone does not explain the current phase, the next action or what survived an interruption.',
    constraint: 'The browser can demonstrate timing state and optional speech, but cannot establish native lock-screen, haptic or Bluetooth behavior.',
    choice: ['Expand the coaching ecosystem before validating the timer', 'Keep phase, remaining time and interruption recovery as the core', 'A small core is usable independently; broader training and native cue claims remain separate.'],
    deferred: 'Coaching, scanning and health-service integrations; reliable, understandable interval state is the first task.',
    walkthrough: [
      ['Read the phase', 'Prepare, Work, Rest and Complete use text labels and remaining time, with the next phase named.'],
      ['Remove a cue', 'Disable phase color and leave optional speech off. Phase, position, remaining time and controls remain visible as text. Unsupported or failed speech is labeled; haptics are not provided in this browser study.'],
      ['Pause across a transition', 'An interruption projects elapsed time to the current phase before retaining the remaining time.'],
      ['Review a restart', 'Opening restart review pauses first and shows the retained phase/time. Keep session leaves it paused; only explicit confirmation resets it. Returning from the browser cache also stays paused.'],
    ],
    available: 'Native source case and a local timer study reviewed 24 October 2026. Seven handler contracts cover stable controls, retained elapsed time, optional-speech failures and explicit restart. Native device and audibility findings remain unavailable.',
    dependencies: 'Real movement, physical-device cues, observed control errors, athlete feedback and project duration are not recorded.',
  },
  voicy: {
    audience: 'Initial design hypothesis: a professional preparing a short written project update while preserving names and technical terms.',
    problem: 'A quiet dictation interface can be hard to invoke, and a transformed result can reach the wrong target or duplicate uncertain text.',
    constraint: 'Recording permission, activation and the original insertion target can each fail. An approved result must survive those failures.',
    choice: ['Automatically insert the first generated rewrite', 'Review editable text and approve one insertion attempt', 'Review costs a step but exposes meaning changes and lets target uncertainty stop the effect.'],
    deferred: 'Automatic retry into another app and universal recognition/speed claims; native permissions and insertion require actual-device evidence.',
    walkthrough: [
      ['Find a way in', 'Use text immediately, or choose a sample voice activation before its microphone rationale. Denial retains text access; a shortcut conflict exposes a menu alternative. No OS permission is requested.'],
      ['Edit the transcript', 'Seeded text and unsent edits survive returning to activation. Retry a fictional provider failure within the flow; no provider receives the text.'],
      ['Review the proposal', 'Keep edits when the source is unchanged. A changed source requires an explicit choice before replacing an edited proposal, and each proposal retains its own source for comparison.'],
      ['Approve one effect', 'App-control rationale appears only for an approved insertion into an available sample target. Denial preserves text for copy; a simulated grant returns to review. An uncertain attempt remains used when text is revisited.'],
    ],
    available: 'Native architecture case and a local study reviewed 24 October 2026: proposed permission timing, shortcut/menu recovery, retained drafts and one sample insertion attempt. No microphone, app-control access or global shortcut is enabled.',
    dependencies: 'A native activation-to-insertion recording, actual mixed-language recognition, permission behavior, participant comparisons and duration remain unverified.',
  },
  aevis: {
    audience: 'Initial design hypothesis: a content or brand lead interpreting an AI-visibility audit before deciding whether to change a page.',
    problem: 'A polished score can imply live, reproducible provider evidence even when it is only an interface demonstration.',
    constraint: 'This portfolio connects no audit providers and publishes no website content. Query fixtures and results must identify their simulated origin.',
    choice: ['A single confident score and automatic publication', 'Explain each sample observation, uncertainty and review boundary', 'Review is slower but makes no-data, conflicting answers and unexecuted changes understandable.'],
    deferred: 'Live provider collection, guaranteed rankings and external publishing until data provenance and an approval service exist.',
    walkthrough: [
      ['Confirm the context', 'A preset updates brand, industry, competitors and query together. Custom edits are reviewed before an audit.'],
      ['Interpret a fixture', 'A sample result shows its query, numerator, denominator, fixture date and provider/model status.'],
      ['Handle incomplete evidence', 'Switch to no data, partial provider failure, contradictory responses or stale evidence; missing data never becomes a zero score.'],
      ['Review and roll back', 'Inspect original and proposed content, approve a page-local draft, compare the revision and restore the previous draft. No website publication occurs.'],
    ],
    available: 'Current transparent audit/review study. The earlier dashboard remains an explicitly labeled visual demonstration.',
    dependencies: 'Live provider/model runs, collection periods, buyer research, pilot effectiveness and original team/duration are not available.',
  },
};

const safe = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export function caseContext(key) {
  const p = caseEnhancements[key];
  return `<details class="review-quality review-context" id="delivery-context"><summary>Audience, delivery context and scope</summary><dl class="review-context-list"><div><dt>Primary task and audience</dt><dd>${safe(p.audience)}</dd></div><div><dt>User problem</dt><dd>${safe(p.problem)}</dd></div><div><dt>Constraint shaping the decision</dt><dd>${safe(p.constraint)}</dd></div><div><dt>Current artifact</dt><dd>${safe(p.available)}</dd></div><div><dt>Delivery record</dt><dd>Portfolio iteration: 20 October 2026. ${safe(p.dependencies)}</dd></div><div><dt>MVP boundary</dt><dd>${safe(p.deferred)}</dd></div></dl></details>`;
}

export function caseWalkthrough(key, demo) {
  const p = caseEnhancements[key];
  return `<section class="review-deep-dive review-walkthrough" id="task-walkthrough" aria-labelledby="walkthrough-title"><p class="review-label">A COMPLETE TASK</p><h2 id="walkthrough-title">Follow the decision, including recovery.</h2><ol class="review-walkthrough-list">${p.walkthrough.map(([title, caption]) => `<li><h3>${safe(title)}</h3><p>${safe(caption)}</p></li>`).join('')}</ol><p><a href="${safe(demo)}">Inspect the current interaction </a></p><details class="review-quality"><summary>Alternative considered and selection criteria</summary><dl class="review-context-list"><div><dt>Alternative</dt><dd>${safe(p.choice[0])}</dd></div><div><dt>Chosen direction</dt><dd>${safe(p.choice[1])}</dd></div><div><dt>Reason and cost</dt><dd>${safe(p.choice[2])}</dd></div></dl></details></section>`;
}
