# Languages — Arabic and English

Nasaq shares colors, spacing, geometry, motion and semantic UI roles across locales. Use `lang="ar" dir="rtl"` with Almarai for Arabic and `lang="en" dir="ltr"` with Inter for English. Keep the system Arabic-first; the English companion is a complete alternative, not a replacement for Arabic identity.

19 typography composites exist per locale: `type.*` (Arabic) and `type-en.*` (English). English body is 16px/400/1.6; Arabic body is 16px/400/1.8. Both map to the same `.nq-type-*` classes through language scopes. English display/headings use 1.2 line height. Technical code uses system monospace. Inter is a locally bundled variable font; keep inter-OFL.txt along with Almarai's license.

Set both lang and dir on independent subtrees. Use logical padding, margin, borders, inset and text-align:start/end. Preserve meaningful DOM/tab order. Mirror directional arrows as appropriate, but never logos or nondirectional symbols. Use bdi to isolate names, filenames, URLs and mixed-direction data. Do not impose an LTR paragraph on Arabic content or apply Arabic text spacing/line height blindly to English.

English docs: en.html, with the same route hashes as index.html. The language switch preserves the current page. English examples: components-en.html and motion-en.html. MCP get_component/get_pattern/search_nasaq accept language="en"; Arabic is the default. Both catalogs use the same component IDs. Treat sample content as illustrative, never production AI output.

Review both languages with long labels, actual content, narrow screens, both themes and keyboard navigation. Native checkboxes and switches handle state; tab arrows follow the computed direction. Do not translate user content or change existing product logic as a side effect of styling.
