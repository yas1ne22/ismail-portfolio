# Token architecture

Source: tokens.json (DTCG Format 2025.10). Three layers:
1. Primitive: color.ink, space.24, radius.md — raw typed values.
2. Semantic: semantic.light.action -> {color.ink}; semantic.dark.action -> {color.paper} — usage roles per mode.
3. Component: component.button.light.background -> {semantic.light.action}; component.card.padding -> {space.24} — reusable component decisions.

Patterns compose components rather than introducing arbitrary values. $type defines type, $value holds value or {reference}, $description explains intent. Avoid screen-specific token names. Build validates missing/cyclic references, then generates mode-aware CSS variables, documentation data and portable copies. From Nasaq run python3 scripts/build.py; then python3 scripts/verify.py. The source reference skill's separation of surfaces, text, borders and effects informed this structure; its presentation-only rules and FDS colors are not Nasaq instructions.

Review contrast and real states before shipping. Do not style new screens with hardcoded colors. Use --nq-text/--nq-surface/--nq-action semantic roles or --nq-component-button-background, with data-theme="dark" on an ancestor.


Typed composites: `type.*` uses DTCG typography (family, size, weight, zero letter-spacing, line-height). `motion.easing.*` uses cubicBezier arrays; durations use milliseconds. `interaction.*` aliases those values for named behaviors. Shade ramps are color primitives. All are generated into CSS and available through MCP get_tokens.
