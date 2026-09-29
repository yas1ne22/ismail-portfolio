# Ismail Bettoumi — Portfolio

A personal portfolio closely following the layout and interaction language of https://www.mikes.cv/.

## Run

```sh
npm install
npm run dev
```

`npm run build` produces the static website in `dist/`. `npm run preview` serves that build. No API keys or backend required.

## Content

Edit `src/data.js` for the headline, biography, employers, dates, and project links. Project overview copy is in `src/main.js`. Professional information was read from Ismail's signed-in LinkedIn profile on 21 September 2026:
https://www.linkedin.com/in/ismail-bettoumi-868b04402/

The profile lists Senior UX Designer (February 2023–Present) and Product Owner Manager (June 2025–Present) concurrently; both are retained as listed. Short descriptions are editorial summaries of the profile, without invented metrics. Contact links to LinkedIn contact information because a preferred public email was not supplied.

Public project posts:
- The Pulse: https://www.linkedin.com/feed/update/urn:li:activity:7299723216573358080/
- Sama / Web Summit: https://www.linkedin.com/feed/update/urn:li:activity:7301018584024018944/
- World Cup: https://www.linkedin.com/feed/update/urn:li:activity:7471155667043676160/

The project pages summarize public announcements. They do not claim to be comprehensive internal case studies. Logos and event photographs are saved locally from the corresponding profile and posts. No private LinkedIn analytics, messages, credentials, or account information are included.

## Interactions

- Drag the pass down to the scanner, then slide it horizontally. A scan button is available by keyboard; Skip and Escape also enter.
- Drop the pass away from the reader and it falls, then resets.
- Drag or click the airplane-window shade to switch themes.
- Scroll to illuminate the flight path and career stops.
- Hover or focus stacked project previews and memory photographs.
- Click projects for detail pages, image enlargement, and previous/next navigation.
- Return to Gate replays the boarding animation. A completed introduction and selected theme persist locally.
- Reduced-motion preferences stop ambient movement and make keyboard scanning immediate.

## Design provenance

Reference: Mike Barton's portfolio, https://www.mikes.cv/. Layout styles, font assets, and window imagery are adapted from the reference at the user's request. Scanner code and personalized boarding-pass graphics are implemented in `src/scanner.js` using Three.js; no reference-site JavaScript bundle, analytics, or tracking is shipped. The recreated scanner and cloud motion are close visual interpretations rather than identical original physics/rendering.

## Stack

Vite, vanilla JavaScript, CSS, Three.js. The scanner is loaded separately and disposed after entry. This workspace is local; it has not been published or deployed.
