// Future design judgments grounded in the documented artifacts. These are not
// retrospective participant findings, client feedback or measured outcomes.
export const reflections={
 andalus:{
  title:'Keep the trip; test the recovery effect.',
  keep:'Keep route, dates and travelers together when someone returns. The available, changed-fare and sold-out examples show why saved context and current availability need separate meanings.',
  change:'Make fare revalidation and the shared contact budget explicit in an operational handoff. A useful screen still depends on booking status, identity and consent reaching the right system.',
  question:'Does restored context reduce repeated entry and improve completed bookings compared with a generic return? The proposed traveler study and holdout are the next evidence, not an established result.'
 },
 'flex-academy':{
  title:'Make the next commitment explicit.',
  keep:'Keep beginner learning and operator advice as separate routes, chosen by the visitor’s goal. The local study makes both commitments and their recovery states inspectable.',
  change:'Carry the current study’s readable action colors, retained form details and explicit confirmation into the client-approved design version. Confirm the webinar schedule, offer terms and actual booking service first.',
  question:'Can beginners and operators explain which route fits, what happens after the action and what the ecosystem proof actually establishes? Audience testing and client feedback are still needed.'
 },
 veyra:{
  title:'Make time as editable as the route.',
  keep:'Keep map pins and the place list connected to the same day. Explicit ordering and undo make a change visible without silently replacing the other stops.',
  change:'Let the traveler adjust visit estimates when the day is overfull. The current planner updates timing from those edits, retains the last valid calculation after an invalid value, and labels ticket checks separately.',
  question:'Does exploring places first help people build and revise a workable day compared with the earlier configure-first flow? The two versions are available for a real comparative task study.'
 },
 'design-handoff':{
  title:'Keep the finding close to its source.',
  keep:'Keep the observed node, review question and proposed correction together. The sample repair and rescan give a reviewer a complete example of what the report is asking them to do.',
  change:'Review the rule language against intentional exceptions before adding more checks. A generic name or manual layout is evidence to inspect; it does not establish that the design is unsuitable.',
  question:'Which findings help a designer and developer resolve a real handoff question, and which create noise? A shared file review and manual comparison are still needed.'
 },
 'design-system-doctor':{
  title:'Document the exception before changing the system.',
  keep:'Keep expected bindings separate from detected local values. The intentional campaign alias shows why a diagnosis needs a maintainer’s judgment before a repair.',
  change:'Compare Balanced and Strict on the same real library, record false positives and missed issues, and revise the severity language before interpreting a summary as system health.',
  question:'Can maintainers identify a useful correction, accept a justified exception and explain the rescan’s scope? The local example prepares that task but does not establish maintainer usefulness.'
 },
 nexus:{
  title:'Evaluate the return task before expanding discovery.',
  keep:'Keep capture short, name the destination and provide a visible way to move or recover a saved site. The local organizer now handles equivalent URLs and stale removal undo explicitly.',
  change:'Test ambiguous links against Work, Build, Create and Learn before extending the taxonomy. Keep discovery optional while the value of the saved-site workflow is being established.',
  question:'Do these destinations help people retrieve their own references compared with current bookmarks? Placement disagreements, retrieval effort and repeat use remain the useful evidence.'
 },
 prepflow:{
  title:'Check the consequences of a swap.',
  keep:'Keep meal choice, servings, pantry subtraction and groceries connected to one plan. The sample swap makes a downstream quantity change inspectable.',
  change:'Observe an interrupted preparation session and revise the schedule and controls around actual equipment, skill and timing. The current browser example retains a step; it does not verify a week of kitchen use.',
  question:'Does the connected workflow reduce coordination work across planning, shopping and preparation? A real week of use is needed to identify rework and unused ingredients.'
 },
 promptilo:{
  title:'Let people judge a resource before saving it.',
  keep:'Keep creator, source, publication state and reuse limits next to the resource. The unapproved sample makes the consequence of missing provenance visible.',
  change:'Review search labels and the detail hierarchy against actual professional tasks before adding catalog breadth. A large index cannot establish that the right resource is easier to find.',
  question:'Which source and freshness signals do people understand when choosing a resource? Observe retrieval and trust decisions, then revise one misunderstanding and check it again.'
 },
 skinny:{
  title:'Make the daily record correctable.',
  keep:'Keep completion logging reversible and previous days interpretable. The sample separates a routine record from treatment decisions and provides a discreet notification preview.',
  change:'Check schedule changes, larger text and reminder choices on the actual native interface. The browser study preserves day context but cannot establish operating-system notification behavior.',
  question:'Can people distinguish today’s record, their saved instructions and a private reminder while recovering an accidental log? Daily-use observation is still needed.'
 },
 'timer-gym':{
  title:'A pause must retain the actual phase.',
  keep:'Keep a named phase and remaining time visible together, with optional audio. The core timer should remain usable without enabling the wider training services.',
  change:'Project elapsed time when Pause arrives and retain subsecond time. The browser study now checks a delayed pause across a phase boundary; the native build still needs physical-device verification.',
  question:'Which cues remain noticeable during real movement, with audio, color or screen visibility unavailable? Record missed cues and accidental controls in the intended session context.'
 },
 voicy:{
  title:'Approval and insertion are separate states.',
  keep:'Keep the transcript and editable proposal available before the final action. The sample preserves approved text when the original target changes or insertion cannot be confirmed.',
  change:'Make first-use activation, shortcut conflicts and permission recovery inspectable in the native build. A menu-bar route needs to complement the quiet hotspot and shortcut.',
  question:'Can people discover the workflow, preserve names and mixed-language meaning, and recover an uncertain insertion without duplication? A native writing task is still needed.'
 },
 aevis:{
  title:'A recommendation needs a traceable observation.',
  keep:'Keep the audit context, result origin and proposed change visible together. The case wrapper and simulation labels distinguish the interface concept from live provider evidence.',
  change:'Complete the source, uncertainty and review states before expanding the dashboard’s metrics. Preset changes also need a full runtime check against the fields the person actually edited.',
  question:'Can an intended buyer explain what a citation result establishes, what remains uncertain and whether a proposed change has taken effect? Buyer-task evidence remains outstanding.'
 },
};
const safe=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function reflectionNotes(key,classes=''){
 const r=reflections[key],names=[...new Set([...classes.split(/\s+/).filter(Boolean),'review-reflection-text'])].join(' ');
 return [['Keep',r.keep],['Change next',r.change],['Question to test',r.question]].map(([label,text])=>`<p class="${safe(names)}"><strong>${label}.</strong> ${safe(text)}</p>`).join('');
}
export function reflectionSection(key){
 return `<section class="review-reflection" id="reflection" tabindex="-1" aria-labelledby="reflection-title"><p class="review-label">REFLECTION · NEXT ITERATION</p><h2 id="reflection-title">${safe(reflections[key].title)}</h2>${reflectionNotes(key)}</section>`;
}
export function reflectionCards(key){const r=reflections[key];return [['Keep',r.keep],['Change next',r.change],['Question to test',r.question]].map(([label,text])=>`<article><h3>${label}</h3><p class="review-reflection-text">${safe(text)}</p></article>`).join('')}
export function escapedReflectionTitle(key){return safe(reflections[key].title)}
