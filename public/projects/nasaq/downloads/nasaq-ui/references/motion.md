# Motion and interaction — Nasaq 1.2

Token groups: motion.duration (0/120/200/320/500/1600ms), motion.easing (standard/enter/exit/linear cubicBezier), motion.distance (4/8/16px), motion.scale (pressed .98, rest 1), motion.opacity (hidden 0, visible 1), interaction.{hover,press,focus,reveal,dialog,tooltip,switch}.{duration,easing}. Interaction roles alias primitive motion decisions. Focus is immediate (0ms), never animated away.

Use supplied `.nq-enter`, `.nq-motion-dialog`, `.nq-spinner` and control styles. Bind native HTML state: checkbox checked, details open, dialog showModal/close, buttons aria-expanded with hidden content. Motion is appearance, not the event/state model. Reveal is 320ms/enter/8px; dialog entry is 200ms/enter with immediate close; switches and feedback 120ms; decorative loop 1600ms/linear. Demo easing uses 500ms so the curve is visible, not for ordinary controls.

Always honor prefers-reduced-motion. `[data-motion="reduce"]` suppresses animation/transition in a subtree. Keep text, statuses and functionality visible; static loaders need a written loading state. Avoid auto-running page-wide animation, flashing, parallax, moving readable text, and fake AI generation progress. Start decorative demos on user request, with a stop path.

Local examples: dist/index.html#motion and downloads/motion.html. Native keyboard: Tab focuses, Space/Enter activates buttons, Space toggles switch, Escape closes dialog/tooltip. Validate mouse, keyboard, RTL/LTR, dark/light and reduced-motion after integration.
