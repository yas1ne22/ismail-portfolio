const root = document.querySelector('[data-space]');
const $ = selector => root.querySelector(selector);
const $$ = selector => [...root.querySelectorAll(selector)];
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
let toastTimer;
function toast(message) { const el = $('[data-toast]'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200); }
function closePopovers(except) { $$('[data-attach-menu],[data-model-menu]').forEach(menu => { if (menu !== except) menu.hidden = true; }); }
function togglePopover(menu) { const willOpen = menu.hidden; closePopovers(menu); menu.hidden = !willOpen; }

$('[data-attach]').addEventListener('click', event => { event.stopPropagation(); togglePopover($('[data-attach-menu]')); });
$('[data-model]').addEventListener('click', event => { event.stopPropagation(); togglePopover($('[data-model-menu]')); });
document.addEventListener('click', event => { if (!event.target.closest('.popover') && !event.target.closest('[data-attach]') && !event.target.closest('[data-model]')) closePopovers(); });

$$('[data-pick-model]').forEach(button => button.addEventListener('click', () => {
  $$('[data-pick-model]').forEach(item => {
    item.classList.toggle('selected', item === button);
    item.querySelector('b').innerHTML = item === button ? '<img src="/assets/icons/lucide/check.svg" alt="Selected">' : '';
  });
  $('[data-model-name]').textContent = button.dataset.pickModel; $('[data-model-menu]').hidden = true; toast(`${button.dataset.pickModel} is ready`);
}));

const voicePanel = $('[data-voice-panel]');
$('[data-voice]').addEventListener('click', () => { closePopovers(); voicePanel.hidden = false; $('[data-voice]').setAttribute('aria-pressed', 'true'); });
$$('[data-close-voice]').forEach(button => button.addEventListener('click', () => { voicePanel.hidden = true; $('[data-voice]').setAttribute('aria-pressed', 'false'); toast('Voice note captured'); }));

const drop = $('[data-drop]');
$('[data-upload]').addEventListener('click', () => { closePopovers(); drop.hidden = false; });
drop.addEventListener('click', () => { drop.hidden = true; toast('image_dashboard(1).jpg attached'); });
['dragenter','dragover'].forEach(type => root.addEventListener(type, event => { event.preventDefault(); drop.hidden = false; }));
drop.addEventListener('dragleave', event => { if (event.target === drop) drop.hidden = true; });
drop.addEventListener('drop', event => { event.preventDefault(); drop.hidden = true; toast(`${event.dataTransfer?.files?.[0]?.name || 'File'} attached`); });

const drawer = $('[data-widget-drawer]');
$('[data-widgets]').addEventListener('click', () => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); });
$('[data-close-widgets]').addEventListener('click', () => { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); });
$$('[data-toggle-target]').forEach(input => input.addEventListener('change', () => { $(`[data-${input.dataset.toggleTarget}]`).hidden = !input.checked; toast('Workspace updated'); }));

const prompt = $('#space-prompt');
$$('[data-prompt]').forEach(button => button.addEventListener('click', () => { prompt.value = button.dataset.prompt; prompt.focus(); }));
function sendPrompt() {
  const text = prompt.value.trim(); if (!text) { prompt.focus(); toast('Type a message first'); return; }
  const conversation = $('[data-conversation]'); conversation.hidden = false; $('.composer-shell').classList.add('has-conversation');
  conversation.innerHTML = `<div class="user-message"></div><div class="ai-message">I’ll turn that into a clear plan, then create the first draft in your workspace.</div>`;
  conversation.querySelector('.user-message').textContent = text; prompt.value = ''; toast('Draft created in Cansaas Space');
}
$('[data-send]').addEventListener('click', sendPrompt); prompt.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendPrompt(); } });
$('[data-help]').addEventListener('click', () => toast('Tip: press Enter to send your prompt'));
$$('.side-nav button').forEach(button => button.addEventListener('click', () => { $$('.side-nav button').forEach(item => item.classList.toggle('active', item === button)); toast(`${button.textContent.trim()} opened`); }));

let touring = false;
$('[data-tour]').addEventListener('click', async event => {
  if (touring) return; touring = true; event.currentTarget.innerHTML = '<span>●</span> Demo playing';
  toast('Welcome to your AI workspace'); await wait(1100);
  togglePopover($('[data-attach-menu]')); await wait(1500); $('[data-attach-menu]').hidden = true;
  togglePopover($('[data-model-menu]')); await wait(1500);
  const gemini = $('[data-pick-model="Gemini 3 Pro"]'); gemini.click(); await wait(1000);
  voicePanel.hidden = false; await wait(1800); voicePanel.hidden = true;
  prompt.value = 'Create a launch plan for Blanc Project 2.0'; prompt.focus(); await wait(1100); sendPrompt(); await wait(1600);
  drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); await wait(1500); drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true');
  toast('Demo complete — now make it yours'); event.currentTarget.innerHTML = '<span>↻</span> Replay guided demo'; touring = false;
});

if (window.parent !== window) document.querySelector('.portfolio-nav a')?.addEventListener('click', event => { event.preventDefault(); window.parent.postMessage({type:'close-case-study'}, window.location.origin); });
