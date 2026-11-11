# Compositions

## Marketing

Hero: cool neutral or blue-tinted field, large Almarai headline, short benefit paragraph, one primary CTA. Keep ink foreground on pastel fields; reserve red for error feedback and use explicit foregrounds on graphite. Editorial cards: color/image area + category + title + explicit link; avoid nested links/buttons. Newsletter: neutral or blue-tinted surface + short title + labelled email + button + status; only connect collection when requested. Pricing: genuine prices/features from product; if hypothetical mark all plans illustrative and do not imply checkout exists. FAQ: native details/summary. Footer: identity + a short description + functional navigation.

The example marketing.html contains all six compositions. Reuse its anatomy, adjust actual product copy, and use the host routes. Do not copy demo anchors or fixed illustrative prices into a production product unreviewed.

## AI product

Chat: distinguish user and assistant; restrained assistant marker; legible prose; composer label; sent message state; preserve draft on failure; keyboard submit consistent with multiline needs; accessible output updates.
Search: search field with label; results show title/description/source as real data; no-results message and recovery; genuine loading and failure states.
Dashboard: clear metrics and timeframe; values with units; accessible chart summaries; limits should explain remaining quota. Do not use illustrative analytics as genuine data.
Subscriptions: same pricing hierarchy; real billing logic stays in the host product. Do not add checkout or account actions for a styling request.

## AI states to cover when functionality exists

Empty → suggestion or beginning prompt.
Generating → honest status + stop control.
Complete → distinguish generated content, meaningful copy/export actions.
Error → preserve input, clear message, retry.
Sources → clickable verified sources, not fabricated citations.
Quota → usage information and next action before a request fails.

In standalone visual demos, label output fixed/illustrative and keep interactions local. No spinner masquerading as real generation.


Additional patterns: onboarding, assistant picker, empty state, generation/stop, retry/recovery, genuine sources, local attachments, quota/subscription, settings/privacy. See catalog.json via MCP for exact examples and integration rules. Every local example is illustrative; wire real product behavior before shipping.
