## Gen Deck Skill: System Audit and Upgrade Plan

### Scope
- Skill definition and usage
- Layouts and item components
- Theme and style system
- Web rendering and content flow
- PPTX rendering and generation pipeline
- Gaps, risks, and upgrade plan with token estimates

### Architecture Overview (Current)
- Resources: `resources/layouts.json`, `resources/themes.json`
- Web preview: `src/DeckPreview.tsx` → layout components (`src/components/layouts/*`) → `SlideGrid` (`src/grid/SlideGrid.tsx`)
- Item components (composed in grid): `src/components/items/*`
- Export (CLI): `scripts/cli.js` → `scripts/dist/exportPptx.js` (TS compiled; canonical)
- Export (TS): `scripts/exportPptx.ts` (source of truth; compiled for CLI)
- Types: `src/lib/deck-types.ts`
- Client “export”: `src/lib/export-client.ts` (placeholder; no server endpoint)

### How It Works (Happy Path)
1) User previews a slide in the web app, selecting a layout/theme from JSON resources.
2) Layout components render a grid via `SlideGrid` using 12-col positions (x, y, w, h), themed colors/gradients.
3) CLI export reads layout(s) + theme and maps grid positions to PPTX inches, drawing text, shapes, charts, tables, images.
4) A title slide and a “Thank You” slide are appended.

---

## Findings: What’s Not Good / Wrong

### 1) Dual exporter implementations (JS vs TS) and drift
- `scripts/exportPptx.js` is the only one used by the CLI.
- `scripts/exportPptx.ts` diverges in details (header height, metric rendering, method names) and isn’t referenced by the CLI.
- Risk: behavioral drift, duplicated fixes, confusion.

### 2) Types duplication and inconsistency
- `src/lib/deck-types.ts` duplicates many interfaces (e.g., `KpiCardData`, `TextData`, …) in the same file.
- No discriminated union for `DeckItem.data` by `type` → weaker type safety and more `any` casts downstream.

### 3) Layout headers unused in exporter; auto-header conflicts
- `layouts.json` includes an optional `header` item, but the exporter ignores it and injects an “auto header” for most layouts.
- Web preview uses `layout.header` (passed into `SlideGrid`), so preview vs PPTX can disagree.

### 4) Layout grid config ignored for PPTX mapping
- `rowHeight` and `margin` from `layouts.json` are not respected by `toInches*` converters. Hardcoded rhythm (0.42) and padding offsets (0.1–0.2) cause layout mismatch between web and PPTX.

### 5) Themes: gradient/background mismatch for PPTX
- Web uses gradients (`theme.gradients.*`); PPTX renderer only uses solid colors. Visual parity is lost.
- No contrast validation; limited palette usage in PPTX (mostly `primary`/`foreground`).

### 6) Chart limitations
- PPTX chart mapping assumes a single series derived from `data[].value`.
- `chart-showcase` in `layouts.json` has empty data by default → placeholder rectangle in export.
- No support for multi-series, pie-specific labeling nuances, or configurable axes/legends per layout config.

### 7) Images are local-only with narrow path probing
- No support for remote URLs or base64 buffers; relies on `fs.existsSync` for a few guessed paths.
- No asset pipeline or error detail for missing assets.

### 8) `--input` is parsed in CLI but not used
- `scripts/cli.js` accepts `--input` but never reads the file nor passes dynamic data into the exporter.
- No JSON schema for per-slide customization (titles, data, items overrides, assets).

### 9) Preview grid does not reuse item components consistently
- `SlideGrid` renders many types inline (text/kpi/etc.) instead of composing `src/components/items/*` (only header uses `HeaderCard`).
- Harder to maintain visual parity with PPTX and across layouts.

### 10) Missing layout component for an existing resource
- `timeline-roadmap` exists in `layouts.json`, but there is no corresponding React layout component nor listing inside `DeckPreview`.

### 11) Title slide is hard-coded
- PPTX title slide uses fixed strings (“Marketing Presentation”) and theme name; not customizable via CLI/JSON.

### 12) No server export endpoint
- `export-client.ts` just alerts; no Next.js API route to trigger PPTX export and stream a file for download.

### 13) Testing and robustness gaps
- No automated tests for layout-to-PPTX mapping, color usage, or asset resolution.
- Weak error reporting (e.g., chart/image fallbacks) hides root causes.

---

## What’s Missing
- Per-slide data binding via `--input` JSON schema (titles, items, data, assets).
- Strong type safety with a discriminated union for `DeckItem` and data payloads.
- One canonical exporter (TypeScript), used by CLI and server API.
- Theme-to-PPTX translation strategy (gradient approximation or image background fill).
- Multi-series chart support and richer chart configuration.
- Remote/base64 image support and a simple asset pipeline.
- React layout for `timeline-roadmap`; include in preview picker.
- Server API route to export and download PPTX from the UI.
- Title slide customization (title/subtitle/logo/date/author/company) via input.
- Documentation for the input schema and end-to-end examples.

---

## Upgrade Plan (Incremental, safe to land progressively)

### 0) Canonicalize exporter to TypeScript
- Make `scripts/cli.js` call the TS exporter (build step produces `scripts/exportPptx.cjs`), remove JS duplication.
- Align logic with one source of truth; add unit-level tests for helpers.

Status: PARTIAL
- CLI builds and uses the TS exporter (`scripts/dist/exportPptx.js`); legacy JS remains as fallback for now.

Token estimate: 1.8k

### 1) Wire `--input` (JSON) with a clear schema
- Add `resources/schema/deck-input.schema.json` describing:
  - `theme`, `titleSlide` (title, subtitle, logo path, date, author, company)
  - `slides[]` with `layout`, optional `title`, and per-item `data` overrides
  - global `assetsBasePath`
- Update `scripts/cli.js` to read/validate `--input` and pass to exporter.
- In exporter, merge layout defaults with overrides; support per-slide `title` and data.

Status: PARTIAL
- CLI reads `--input` JSON and passes `titleSlide`, `assetsBasePath`, and `slides` to exporter.
- Exporter merges per-slide item overrides, supports per-slide titles and `titleSlide` metadata.
- `resources/sample-input.json` added as a working example.
- JSON schema and validation still pending.

Token estimate: 2.4k

### 2) Respect layout grid config in PPTX mapping
- Read `grid.rowHeight` and `grid.margin` from `layouts.json` when computing `toInches*`.
- Expose slide padding constants at top-level for consistency.

Status: DONE
- Mapping now derives row height and paddings from layout grid config; defaults preserve prior visuals.

Token estimate: 1.2k

### 3) Header policy unification
- Add a top-level `autoHeader: boolean` flag to layouts (default true).
- If layout defines `header` in JSON and `autoHeader` is false, use it; otherwise inject auto-header.
- Mirror the same in the web preview to keep parity.

Status: DONE
- Added `autoHeader` to layouts with explicit headers and updated exporter to respect explicit header and avoid conflicts.

Token estimate: 1.2k

### 4) Theme-to-PPTX translation
- Provide a `themeToPptx` helper:
  - Solid backgrounds: use `colors.background`.
  - Gradients: approximate with a generated background image (canvas) or pick `primary` stop as solid; behind feature flag.
  - Ensure foreground contrast (warn if low).

Status: DONE (approximation)
- Implemented background approximation by using the first gradient stop; falls back to solid background.

Token estimate: 2.0k

### 5) Charts: multi-series + config
- Support `data: Array<{ name: string; series: Record<string, number> }>` OR `series[]` schema.
- Render multiple series with distinct chart colors; enable legends optionally.
- Handle pie labels/percentages better; axis/label font size from theme.

Token estimate: 2.2k

### 6) Images: remote and base64 support
- If `src` is a URL: fetch to temp file, then embed.
- If `src` is base64: use buffer with `data` option (if supported) or temp file.
- Provide `assetsBasePath` resolve helper; better error messages.

Token estimate: 1.6k

### 7) Web preview parity
- Refactor `SlideGrid` to compose item components (`TextCard`, `KpiCard`, `ChartCard`, `MetricCard`, `PhotoCard`, `TestimonialCard`, `HeaderCard`) instead of inline placeholders.
- Add `TimelineRoadmap` React layout component and include it in `DeckPreview`.

Status: PARTIAL
- `SlideGrid` now composes shared item components for all types; added `TimelineCard` component.
- Remaining: add `TimelineRoadmap` layout component and include it in `DeckPreview`.

Token estimate: 2.6k

### 8) Server export API
- Next.js route: `src/app/api/export/route.ts` (POST JSON = input schema) → call exporter → stream PPTX with proper headers.
- Update `export-client.ts` to call this API and save the file in-browser.

Token estimate: 2.0k

### 9) Title slide customization
- Accept `titleSlide` in input (title, subtitle, logo, date, author, company) and render accordingly.
- Optional “Thank You” slide toggle.

Status: PARTIAL
- `titleSlide` supported in CLI/exporter (title, subtitle, author, company, date).
- Thank You slide toggle not implemented yet.

Token estimate: 1.0k

### 10) Types hardening and cleanup
- Fix duplications in `deck-types.ts`.
- Introduce a discriminated union for `DeckItem` based on `type`.
- Reduce `any` casts across exporter and grid.

Status: DONE
- Consolidated types into a discriminated union; removed duplicated interfaces.

Token estimate: 1.8k

### 11) Testing and diagnostics
- Unit tests for `toInches*`, chart series mapping, theme translation, image resolver.
- Add verbose logging gates, and actionable error messages for missing assets/data.

Token estimate: 1.6k

### 12) Docs
- Update `SKILL.md` and `README.md` with input schema, CLI/API examples, and end-to-end flow.
- Add a “web vs PPTX parity” section with known tradeoffs.

Token estimate: 1.2k

#### Total token estimate: ~19.6k
- Notes:
  - Estimates are for agent/LLM planning + implementation prompts (not runtime).
  - Parallelizing smaller steps and reusing context can reduce cost.

---

## Quick Wins (Low risk, high value)
- [ ] Use only one exporter (TS) and point the CLI to it. (partial: JS fallback remains)
- [x] Respect `rowHeight`/`margin` from layouts; remove magic paddings.
- [x] Implement `--input` and per-slide titles; add a sample input file in `resources/`.
- [ ] Add `timeline-roadmap` React layout and show it in the preview.
- [x] Fix duplicated interfaces in `deck-types.ts`.

---

## Follow-ups / Nice-to-haves
- Theme contrast checker with warnings.
- Auto-generate chart palette from theme with accessible contrast.
- Optional deck outline page with auto-generated TOC.
- Auto-branding slot for logo in title/footer.

---

## Schema Sketch (for `--input`)
```json
{
  "theme": "tech-purple",
  "titleSlide": {
    "title": "Q4 Performance Overview",
    "subtitle": "North America | 2025",
    "logo": "public/logo.png",
    "date": "2025-10-21",
    "author": "Marketing Team",
    "company": "Acme Inc."
  },
  "assetsBasePath": "./",
  "slides": [
    {
      "layout": "bold-minimalist-hero",
      "title": "Welcome"
    },
    {
      "layout": "data-grid-dashboard",
      "title": "KPIs",
      "items": [
        { "i": "kpi1", "data": { "metric": "+32%", "label": "Growth" } }
      ]
    },
    {
      "layout": "chart-showcase",
      "title": "Revenue",
      "items": [
        {
          "i": "chart",
          "data": {
            "type": "bar",
            "series": [
              { "name": "2024", "values": [400,300,600,800,500] },
              { "name": "2025", "values": [500,350,700,900,650] }
            ],
            "labels": ["Jan","Feb","Mar","Apr","May"]
          }
        }
      ]
    }
  ]
}
```

---

## Risks
- PptxGenJS chart feature parity can vary; multi-series styling may need iteration.
- Gradient backgrounds may require bitmap generation to approximate.
- Server export must ensure the library runs under Next.js route’s Node runtime.

---

## Acceptance Criteria (Phase 1)
- [ ] Single TS exporter used by CLI and API; JS removed. (partial: CLI uses TS, JS fallback remains)
- [x] CLI `--input` JSON overrides items and titles; sample file provided.
- [x] Layout `rowHeight`/`margin` respected in PPTX mapping.
- [ ] Timeline layout exists in preview and exports correctly.
- [x] No type duplications in `deck-types.ts`; discriminated union in place.


