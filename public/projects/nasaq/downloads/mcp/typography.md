# Typography — Nasaq 1.2

Almarai remains the primary Arabic, heading, body and interface font, locally bundled in real weights 300/400/700/800. 19 DTCG typography composite tokens under `type`: display-lg/md/sm, heading-xl/lg/md/sm, body-lg/md/sm/light, label-lg/sm, caption, overline, button, quote, data, code. `.nq-type-{name}` classes consume `--nq-type-{name}` generated font shorthands. Composites reference primitive fontFamily, fontSize and fontWeight, and explicitly define letterSpacing 0 and a unitless lineHeight.

Almarai body 16px/400/1.8; labels 14–16px/700; display 48–72px optional editorial use. Mobile display 44/40/36, page heading 32 and section heading 28px. Do not make every screen a large headline poster. Code uses a system monospace only for technical text. English uses locally bundled Inter with 19 corresponding type-en composites and language scopes; see languages.md.

No Arabic tracking, no synthetic weight 500/600, no fixed-height clipping of diacritics. Use logical alignment and bdi for URLs/emails/code. Long reading width around 65ch. Data style requests tabular numerals where the installed font supports them; verify actual Arabic digits. Native headings should retain their semantic level regardless of appearance class.
