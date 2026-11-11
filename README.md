# Ismail Bettoumi — Portfolio

A static product-design portfolio with project case studies, optional interaction experiments, and a downloadable resume.

## Run

```sh
npm install
npm run dev
```

Use Node 20.19 or newer for the development and DOM-test dependencies. `npm run build` produces the static website in `dist/`; `npm run preview` serves that build. Portfolio content and local interaction studies require no API keys or backend. The optional assistant is a separate third-party service.

`npm test` checks consequential state transitions in the local studies and the active homepage template. `npm run verify:portfolio` checks the later audit revision, including homepage fragments and fallback content that are inactive after the live-homepage restoration. Its homepage findings need to be interpreted against the restored version. Neither command establishes browser accessibility, native-device behavior or participant outcomes. Nasaq documentation fragments use its dynamic router and remain a separate runtime check.

## Content

`src/data.js` supplies profile and employment details. The active homepage is `src/main.js`, styled by `style.css` and `case.css`. On 26 October 2026 it was restored exactly to the published homepage at https://ismail-bettoumi.com/, including its original introduction, timeline, boarding gate, assistant and navigation. The built HTML, CSS and JavaScript match the published version byte-for-byte. Preserve that design and navigation unless the user explicitly requests changes. The alternative homepage and audit enhancements (`src/portfolio.js`, `src/portfolioContent.js`, `src/classicPortfolio.js`, `public/portfolio.css`, and `public/classic-review.css`) are inactive. Do not run `scripts/prepare-portfolio.mjs` or `scripts/render-home.mjs` as part of development or builds; they would replace the restored homepage.

The canonical resume is `public/cv.html`. `scripts/render-resume.py` uses ReportLab and pypdf to regenerate the downloadable PDF and check text parity. Review its rendered layout after changing the CV.

`docs/portfolio-audit-source.json` retains all 180 original review actions. `docs/portfolio-review-progress.json` records local status, original acceptance criteria and evidence paths. In-progress and evidence-dependent items remain open. Protocols and sample interactions are not completed research; do not invent dates, collaborators, testimonials, user findings or impact metrics.

`public/projects/index.html` remains the secondary index for six additional explorations. It and the later case-study revisions are retained separately from the restored homepage. Each additional case and study returns to its own index entry; the index restores focus and remembers ordinary-link origins for browser Back. Regenerate it with `node scripts/render-project-index.mjs` after changing the shared case context.

## Interactions

- The boarding pass supports dragging, keyboard scanning, Skip and Escape; the scanner loads Three.js on demand and is disposed after entry.
- The airplane-window shade switches the homepage theme; reduced-motion styles keep content available.
- Scrolling illuminates the flight path and timeline stops. Return to gate replays the boarding experience.
- Local project studies demonstrate bounded sample tasks and recovery states without sending bookings, edits or messages to external services.
- The homepage uses the published case-study previews. Nasaq's newer two-question language/destination chooser remains available separately at `/projects/nasaq/explore.html`.

## Design provenance

The restored portfolio draws on Mike Barton's portfolio, https://www.mikes.cv/, at the user's request. It retains the published layout, typography, flight path, airplane-window theme control and boarding experience. Scanner code and personalized boarding-pass graphics are implemented in `src/scanner.js` using Three.js; reference-site JavaScript is not included.

## Stack

Vite, vanilla JavaScript, CSS and lazy-loaded Three.js. The restored homepage HTML, stylesheet and four JavaScript bundles were verified byte-for-byte against the live portfolio on 26 October 2026. Later case-study work is retained; the homepage audit enhancements are inactive. The live deployment has not been changed.

## Nasaq exploration and verification

The restored homepage retains its published Nasaq entry. The newer standalone onboarding is `public/projects/nasaq/explore.html`, with shared assets under `public/projects/nasaq/assets/onboarding.*`. Both languages expose 47 documentation routes, including project notes, a connected document-assistant recovery example, quality records, design-to-code mappings and maintenance guidance. Component guidance covers all 18 families.

The editable Figma companion is https://www.figma.com/design/4KET6pUgLcEC34ZirGBZpU. Its actual node IDs, source files and CSS variable names are recorded in `downloads/figma-map.json`. Public Figma link access is unverified; a local foundations preview is included in the documentation. Native Code Connect is not published on the connected Starter account. The final pattern repair is saved, with visual confirmation pending after the MCP call limit.

The standalone source in `../Nasaq` builds the downloadable packages. Run `python3 scripts/build.py` and `python3 scripts/verify.py` there. The verification includes 20 onboarding destinations and document-workflow recovery contracts. The dated `downloads/quality-report.json` separates recorded software checks from research, accessibility and adoption work that still requires human evaluation. No participant results, team rollout metrics or efficiency gains have been invented.

## Nasaq Icon Studio

`/projects/nasaq/en.html#icon-studio` and the equivalent Arabic route present an agent-guided icon creation experience. The bilingual case studies feature its description-first conversation and progressive choices. Original SVG families appear after the style question, support conversational refinement, and download as a complete set. Live generation is explicitly gated because it requires authenticated model access and paid usage. No model service or credentials are connected. `npm test` includes chat progression, escaped briefs, natural-language refinement, ZIP export consistency, access-dialog focus and clipboard recovery.
