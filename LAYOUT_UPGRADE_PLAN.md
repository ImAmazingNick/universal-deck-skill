## Layouts → PPTX Upgrade Plan

Goals
- Improve visual quality and consistency of generated PPTX across all layouts.
- Fill renderer gaps (photo, table, chart, timeline) in `scripts/exportPptx.js`.
- Standardize grid → inches mapping, spacing, and typography for predictable output.
- Keep JSON layouts stable; add minimal, backwards-compatible enhancements.

Non-goals
- No React UI changes required for PPTX export.
- Avoid theme redesign; only ensure good contrast and consistent usage.

Visual standards for PPTX
- Margins: 0.2in outer padding on all sides; avoid placing items flush to slide edge.
- Grid mapping (12-col): x = (x/12)*10in + 0.1; w = (w/12)*10in − 0.2.
- Vertical rhythm: base row height = 0.42in. y = y*0.42 + 0.2; h = h*0.42 − 0.1.
- Header band: default 4 rows tall unless layout is CTA or Hero; auto-inserted when not present.
- Typography scale: xs 10, sm 12, base 14, lg 18, xl 24, 2xl 32, 3xl 40, 4xl 48.
- Cards: muted background fill, 1px border, 6–8pt radius; inner padding 0.1–0.2in.
- Contrast: always use theme.foreground on muted/background fills; primary for emphasis.

Exporter upgrades (scripts/exportPptx.js)
1) Add missing renderers
   - chart: use PPTX chart when feasible; otherwise placeholder + data text.
   - table: use `slide.addTable` with header row style, zebra rows, wrap text.
   - photo-card: `slide.addImage({ path, x, y, w, h, sizing: 'contain' })`, optional caption.
   - timeline: simple line + dots + labels (horizontal) with evenly spaced stops.

2) Unify grid mapping
   - Replace mixed Y scaling (0.3/0.25) with vertical rhythm (0.42in row).
   - Respect auto header offset by adding `headerHeightInRows` before laying out items.

3) Header logic
   - Keep auto-header for most layouts; skip for `call-to-action` and `bold-minimalist-hero`.
   - Use fixed title/subtitle heights and divider line; ensure adequate spacing under divider.

4) Theming
   - Use `theme.colors.background/foreground/muted/border/primary` consistently.
   - Ignore CSS gradients in PPTX; prefer flat fills. Optional: background rect gradient approximation later.

5) Text robustness
   - Prefer shorter lines; center large titles; enable `wrap: true` everywhere.
   - Clamp oversized text by using conservative font sizes (no dynamic shrink in this pass).

Layout-by-layout recommendations
- bold-minimalist-hero
  - Keep giant title (4xl) centered; ensure 0.2in top/bottom breathing room.
  - Optional thin divider below subtitle (off by default).

- data-grid-dashboard
  - KPI cards: larger metric (28–32), label 12–14; ensure even gutters using unified mapping.
  - Optional small icon space top-left (future enhancement; safe to skip for now).

- photo-narrative-flow
  - Implement photo-card renderer; maintain aspect using `sizing: 'contain'` and centered image.
  - Add optional caption below image with 10–12pt text.

- comparison-table
  - Implement `addTable`; bold header row; zebra row fills using muted variants; left-align cells; wrap.

- chart-showcase
  - Implement bar chart via PPTX if library version supports; otherwise placeholder + data list.
  - Keep legend/explanation as text block.

- timeline-roadmap
  - Implement simple horizontal line with evenly spaced circles; label each event below.

- testimonial-gallery
  - Keep smart quotes + em dash author line; ensure italics for quote, right-align author.

- metrics-breakdown
  - Metric cards + optional change badge in corner; green/red color cue.

- call-to-action
  - Center large headline; button as rounded rect with primary fill and foreground text; optional href ignored in PPTX.

Acceptance criteria
- All layouts render without placeholders or unknown-type markers.
- Slides respect margins, consistent spacing, readable typography in all themes.
- No content clipped at default data sizes in `resources/layouts.json`.
- CLI `list-layouts` and generation continue to work; outputs land in `output/`.

Step-by-step implementation
1) Exporter groundwork
   - Introduce `toInchesX/Y/W/H` helpers using unified mapping.
   - Add `headerHeightInRows` and skip list for auto-header.

2) Renderers
   - photo-card: image + optional caption.
   - table: `addTable` with styles.
   - chart: PPTX chart if available; otherwise placeholder + data dump.
   - timeline: line + dots + labels.

3) Polish
   - Normalize card paddings, border, and radius.
   - Revisit header spacing and divider placement.

4) QA
   - Generate sample decks across all themes with `--slides` covering each layout.
   - Visual check: spacing, clipping, contrast.

CLI examples for QA
```bash
node scripts/cli.js gen --slides "bold-minimalist-hero,data-grid-dashboard,photo-narrative-flow,comparison-table,chart-showcase,timeline-roadmap,testimonial-gallery,metrics-breakdown,call-to-action" --theme metallic-earth -o qa-metallic-earth.pptx
node scripts/cli.js gen --slides "...same..." --theme corporate-blue -o qa-corporate-blue.pptx
```

Token estimates (for AI agent planning)
- Total planning + implementation tokens: ~11k–14k
  - Discovery/context reads: ~1.5k–2k
  - Plan authoring (this doc): ~1k–1.5k
  - Exporter edits (helpers + header logic): ~2k–3k
  - Renderers: photo (~1.2k), table (~1.6k), chart (~1.6k), timeline (~1.6k) = ~6k
  - QA notes/iterations: ~0.5k–1k

Risks
- PptxGenJS chart/table APIs differ across versions; fall back to text placeholders if not supported.
- Images may stretch if source aspect ratio is extreme; use `sizing: 'contain'` and accept letterboxing.

Next action (safe to implement immediately)
- Add unified mapping helpers and the four missing renderers in `scripts/exportPptx.js`.


