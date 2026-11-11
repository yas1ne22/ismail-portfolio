# Foundations

The canonical portable values are in ../assets/tokens.json and ../assets/nasaq.css.
JSON follows the DTCG typed token structure: color primitives use sRGB components, alpha, and a hex fallback; semantic tokens define mode-specific usage roles. Light and dark semantic groups are separate so a converter can assign them to modes. This bundle does not create Figma Variables automatically.

## Color and modes

Light: background #F4F6F8, surface #FFFFFF, text #18202B, muted #566171, action/focus #1D4ED8, on-action #FFFFFF, link #1D4ED8. Neutral hover #E9EDF3; pressed #DEE5EF; selected #E9EFFF with text #173FAE.
Dark: background #101318, surface #1B2028, text #EDF1F7, muted #AAB7C8, action #8EB2FF, on-action #10214B. Hover #283341; pressed #344253; selected #23344D with text #B3CBFF. Brand compositions use explicit foreground and background roles in both themes.

Semantic variables cover interactive UI. Brand backgrounds use primitive tokens explicitly with tested foregrounds. Border is a decorative separator. Inputs use border-strong (#7D8A9B light / #718096 dark) for a visible boundary. Preserve text/shape and a distinct focus ring.

## Typography

Display/H1/H2/H3 use Almarai. Lead/body/labels/controls use Almarai. Available weights:300,400,700,800. Use real weights; do not synthesize500/600. Latin identifiers can use the same UI family or a system monospace for code. Text outline in exported SVG lockups may vary if fonts are not loaded; embed the supplied fonts for web, or outline text in the target design tool before distribution as a fixed logo file.

Do not use a proprietary Thmanyah typeface. Fonts in this package carry SIL OFL licenses in assets.

## Icons / miscellaneous symbols

Original stroke icons on24px grid,1.75px strokes. Inline SVG supports currentColor. Files used as img display black by default; use a suitable single-color treatment in dark mode. Use text labels for action meaning. Decorative stars may use Unicode; render differs by platform. Use icon-spark.svg for stable geometry.

## Effects / motion

Floating surface shadow:0 8px 24px #18202B12. Focus ring:3px,4px offset. Dialog backdrop:#18202B88. Border-only ordinary cards. Fast state transitions120ms, entry200ms. Disable optional motion under reduced-motion.

## Grid / radius

12/8/4 columns across desktop/tablet/mobile. Gaps24/24/16px. Primitive radii0/4/12/20/999px; component aliases use12px controls and cards. CSS utilities are starters; compose responsive layout for the actual content. RTL logical properties are required.

Token format reference: https://www.designtokens.org/tr/2025.10/format/


Expanded foundation groups: 88 color shades, 19 Almarai typography composites and motion/interaction tokens. Read colors.md, typography.md and motion.md. Lucide is bundled separately from original Nasaq icons with its license; preserve attribution. No large red introduction, cover or brand panel.
