# Ten base components

| Component | Classes | Required behavior |
| --- | --- | --- |
| Button | nq-button, secondary, brand, small | Native button for actions; a for navigation; disabled native; one main action;44px default |
| Input | nq-field, nq-input, nq-help | Visible label/for/id; semantic type; aria-describedby; aria-invalid + useful error |
| Select | nq-select | Native select for a modest set; visible label; do not replace with div |
| Checkbox | nq-check | Native checkbox + clickable label; fieldset/legend for groups; independent choices |
| Switch | nq-check + nq-switch | Native checkbox role=switch; fixed label; immediate setting; Space works |
| Tabs | nq-tabs + data-tabs | tablist/tab/tabpanel roles; controls/labelledby IDs; roving tabindex; automatic activation with RTL arrows/Home/End; skip disabled tabs |
| Badge | nq-badge, success, error | Noninteractive status/category; visible text; live region only for meaningful changes |
| Avatar | nq-avatar, large, square | Circle person/square assistant; initials fallback; avoid duplicate accessible name |
| Dialog | nq-dialog + data-open/data-close | Native showModal; name with labelledby; Escape; visible cancel; focus return |
| Tooltip | nq-tooltip-wrap + nq-tooltip | Describedby relation; hover/focus; Escape dismiss; no essential/interactive content |

Default button min-height44px, input/select48px. Small36px buttons are for dense desktop layouts; expand for touch. Add explicit state previews when documenting a component. Loading states in a real app keep an understandable label and prevent duplicate submits as appropriate.

Load nasaq.js once when using its global behavior. In a framework implement equivalent state/event logic instead. The shared script performs tab activation and dialog/tooltip actions only; it does not submit forms, call models, copy content, or implement billing.

Avoid IDs shared across examples. Trap focus through the native dialog behavior. Tooltips are supplemental; mobile users must understand controls from their labels alone.

## Additional components

Radio: native grouped radios with a shared name, fieldset/legend, selected/focus/disabled states.
Textarea: labelled multiline input, resizable vertically, with persistent help and actionable error.
Alert: information/success/warning/error, color paired with text; role=alert only for newly inserted urgent messages.
Progress: native progress with an 8px track, known value/max or indeterminate without value; visible task label and status. Unknown work has no percentage. Reduced motion keeps a static indicator.
Skeleton: aria-busy on container, decorative placeholders, reduced-motion respected, leave loading on completion/error.
Accordion: native details/summary; collapsed/expanded/focus.
Cards: semantic article, heading and explicit action; avoid nested interactive links.
Breadcrumb: nav with accessible name, current page uses aria-current=page; logical separators and compact mobile path.

Every component has machine-readable `states` HTML specimens in the MCP catalog and a visible docs gallery. Pinned focus/hover examples demonstrate appearance; test real native interaction separately. The switch uses a 48×28px track and a 20px thumb. `.nq-check .nq-switch` must take precedence over generic checkbox sizing.
