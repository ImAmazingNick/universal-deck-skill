---
name: html-deck-generator
description: Generate interactive HTML pitch decks using the ECM-Atlas longevity style. Produces single-file presentations with smooth navigation, fixed header, progress bar, and 16:9 slides. Use when the user wants a web-based deck rather than PPTX.
---

# HTML Deck Generator

Generate interactive HTML presentations styled like `longevity_pitch_deck.html`, automatically populating content from user intent.

## When to Use

Use this skill when the user requests:
- A web-based deck or landing page experience instead of PPTX
- HTML output with the ECM-Atlas/Longevity visual language
- Rich typography, gradients, and interactive navigation
- Fast sharing of a presentation without PowerPoint

## Required Intent Analysis

Before writing HTML, Claude **must** reason about user intent and audience:

1. **Understand the Request**
   - Capture audience, tone, desired takeaway, and number of slides
   - Extract strategic goals (e.g., inspire investors, explain research, onboard customers)
   - If any of these inputs are vague or missing, auto-generate **2–3 clarifying questions** (e.g., “What’s your target slide count?” “Any specific brand colors?”) before you draft the outline.

2. **Plan Slide Narrative**
   - Map goals → slide types (metrics, storyline, visual proof, CTA)
   - Decide layout sequence: hero → problem → opportunity → solution → proof → CTA

3. **Design Structure**
   - Determine which slides should reuse statistics grids vs. narrative blocks
   - Identify where visuals (images/charts) or callouts belong

4. **Validate Intent Coverage**
   - Ensure all user goals map to slides
   - Confirm tone aligns with color usage and copy style
   - Close the loop on clarifying questions; note any assumptions that remain open.

Document the reasoning (bullet list or short plan) before and after generating HTML so users see how layouts support intent.

## Clarifying Prompts Protocol

- Trigger this whenever any of the core inputs (audience, tone, goals, slide count, brand preferences) are absent or ambiguous.
- Generate **2–3 concise questions** tailored to the request; prioritize intent-critical gaps over trivia.
- Surface the questions in your planning notes and resolve them before finalizing the slide outline when possible.
- If answers remain unknown, flag the assumption in the final hand-off so users understand the risk.

## Output Requirements

- Produce a **single self-contained HTML file** (no external assets beyond optional remote images)
- Base structure and CSS must follow `resources/templates/html-deck-template.html`
- Update placeholders (`{{...}}`) with generated content
- Create the requested number of slides (defaults to 16 like the original deck if unspecified)
- Update navigation dots, slide IDs, and counters to match total slides
- Keep CSS and JS inline; modify styles only if asked
- Save the generated artifact to the repository’s `output/` directory (e.g., `output/topic-name.html`) so users can open or ship the deck immediately.

## Layout Patterns

Replicate the longevity style slide patterns and incorporate advanced layouts from performance analysis decks:

| Slide Type | Layout Components | Suggested Use |
|------------|------------------|---------------|
| **Title Hero** | `title-slide` with stat cards | Vision statement, metrics snapshot |
| **Cover Slide** | `cover-content`, `cover-logo`, `cover-meta` | Presentation title with branding and metadata |
| **KPI Dashboard** | `kpi-stats` grid with `.kpi-stat` cards | Key performance indicators display |
| **Problem/Insight** | `.stats-grid` cards + narrative paragraph | Highlight pain points with metrics |
| **Image Card Grid** | `.creatives-grid-bottom` with `.creative-card` | Portfolio showcase with images and metrics |
| **Data Table** | `.list-layout-container` with `.list-table` | Detailed performance rankings and comparisons |
| **Chart Dashboard** | `.metrics-highlight-container` with `.chart-container` | Data visualization with accompanying metrics |
| **Narrative Quote** | `.text-large` headings + body | Vision, mission, storytelling |
| **Dual Column Comparison** | `.dual-list-container` with side-by-side tables | Performance comparisons, pros/cons analysis |
| **Impact Analysis** | `.impact-content` with `.impact-column` | Success factors and challenges analysis |
| **Data Story** | `.metrics-grid`, `.stats-grid-4`, or timeline | KPIs, adoption, roadmap |
| **Visual Proof** | `<img>` embed with caption | Screenshots, charts, prototypes |
| **Comparison** | `.comparison-container` | Before/after, competitor analysis |
| **Feature Showcase** | `.feature-showcase`, `.feature-card` | Product capabilities |
| **Numbered Takeaways** | `.takeaway-number` with `.takeaway-content` | Key insights and strategic recommendations |
| **CTA** | `.cta-section` | Close with strong call-to-action |

Feel free to remix patterns when intent demands. The skill now supports both narrative-driven layouts (hero, storytelling) and data-heavy layouts (KPIs, tables, charts).

## Audience Archetypes

Use predefined archetypes to accelerate personalization. Each archetype bundles audience expectations, slide ordering priorities, and tonality guidance. Reference `reference/audience-archetypes.md` for full prompts and layout recipes.

| Archetype | Audience Signals | Layout Priorities | Tone & Visuals |
|-----------|------------------|-------------------|----------------|
| Investor Pitch | Fundraising, metrics requests, capital raise timelines | Hero → traction metrics → market size → roadmap → CTA | Confident, metric-forward, warm gradients with sharp highlights |
| Performance Analysis | QBR reviews, analytics reports, data insights | Cover → KPI Dashboard → Data Tables → Chart Dashboard → Takeaways | Analytical, data-driven, clean grids with performance indicators |
| Internal Onboarding | New hires, enablement, process walkthroughs | Hero → mission/values → process timeline → resource hub → CTA | Warm, supportive, lighter backgrounds with high-contrast typography |
| Enterprise Sales | Stakeholder buy-in, solution demos, ROI proof | Hero → problem framing → solution features → proof points → CTA | Consultative, crisp, neutral gradients with focal accent color |
| Portfolio Showcase | Creative reviews, case studies, work samples | Cover → Image Card Grid → Impact Analysis → Dual Comparison → CTA | Visual, achievement-focused, image-rich layouts with metrics |
| Conference Keynote | Thought leadership, storytelling, inspiration | Hero → narrative quote → trend data → vision roadmap → CTA | Inspirational, bold typography, elevated motion cues |
| Product Update | Release notes, feature emphasis, adoption nudges | Hero → capability deep-dive → demo visuals → adoption metrics → CTA | Energetic, modular layouts, badge callouts and iconography |

If a request spans multiple archetypes, blend the relevant layout priorities and narrate your rationale during intent documentation.

## Advanced Layout Components

### Data-Heavy Layouts
- **KPI Dashboard**: Use `kpi-stats` container with multiple `kpi-stat` cards showing key metrics, changes, and labels
- **Image Card Grid**: `creatives-grid-bottom` container with `creative-card` elements featuring images, rankings, metrics, and performance indicators
- **Data Tables**: `list-layout-container` with `list-table` for detailed rankings, comparisons, and performance data
- **Chart Dashboards**: `metrics-highlight-container` combining `chart-container` with `metrics-display-section` for visual analytics

### Comparison & Analysis Layouts
- **Dual Column Comparisons**: `dual-list-container` with side-by-side `dual-list-column` sections for performance comparisons
- **Impact Analysis**: `impact-content` with `impact-column` elements for pros/cons, success factors, and challenges
- **Numbered Takeaways**: Sequential insights using `takeaway-number` and `takeaway-content` for key recommendations

### Visual Enhancement Components
- **Performance Indicators**: Color-coded badges showing performance levels (good/excellent/breakthrough)
- **Metric Change Indicators**: Positive/negative change arrows with percentage values
- **Ranking Elements**: Numbered rankings with visual prominence
- **Meta Information**: Period tags, data source indicators, and contextual breadcrumbs

## Dynamic Theming & Accessibility

- Override color tokens via CSS variables (`--primary-gradient`, `--slide-background`, `--slide-text-color`, etc.) to mirror brand palettes without rewriting the stylesheet.
- When customizing, run `npm run build:exporter` once to compile scripts, then execute `node scripts/dist/tools/validate-theme.js --config my-theme.json` (or pass inline overrides) to confirm WCAG-compliant contrast.
- The validator reports `PASS/WARN/FAIL` thresholds at 4.5:1 for primary text and 3:1 for accent or muted text. Resolve any failures before shipping.
- Keep gradients readable by ensuring their dominant color also meets contrast guidelines for overlayed text or icons.

## Asset Optimization Toolkit

- Generate inline charts or illustrations via `node scripts/dist/tools/asset-helper.js chart ...`. The command returns a `data:image/png;base64,...` URI ready for `<img>` tags; see `reference/asset-optimization.md` for recipes.
- Convert existing files to embedded data URIs with `node scripts/dist/tools/asset-helper.js encode --input path/to/file --mime image/svg+xml`. Add `--gzip` for HTML/JSON payloads you want to compress.
- Always provide `<noscript>` fallbacks for JS-driven blocks (the template already exposes a baseline sequential layout); ensure essential insights remain readable without interactivity.

## Deck Variants & Video Embeds

- Produce **lite/email variants** by cloning the deck and adding `data-variant="lite"` to `<body>`. This flattens slides into a scrollable narrative, removes nav dots, and keeps the fixed header inline—ideal for newsletters or microsites.
- Document in your plan whether you’re shipping interactive, lite, or both versions. If both, share the diff (CSS variable overrides, removed scripts, etc.).
- Embed social video exports with the provided `.video-frame` helper. Prefer `<video>` with MP4 sources pulled via `view_x_video`-style download tools; fall back to `loading="lazy"` `<iframe>` for TikTok or similar.
- Pair every video with descriptive alt text or captions and note if audio cues contain critical messaging.

## Template Reference

- Base file: `resources/templates/html-deck-template.html`
- Styles: identical to longevity pitch deck (16:9, fixed header, progress bar)
- Placeholders: replace `{{TOKEN}}` entries and duplicate slide blocks as needed
- Color customization happens through CSS variables (`--primary-gradient`, `--slide-text-color`, etc.). Override them inline or via `<style>` additions and run the theme validator (`scripts/dist/tools/validate-theme.js`) to ensure contrast safety (see `reference/dynamic-theming.md` for recipes).
- Refer to `reference/variants-and-media.md` for lite variant packaging and video embed patterns.

## Workflow

1. **Intent Analysis** – summarize audience, goals, tone, slide strategy
2. **Slide Outline** – list slide titles, layout choice, key content
3. **HTML Generation** – fill template with content using consistent classes
4. **Validation** – ensure slide count, nav dots, and headers match plan
5. **Output** – return full `<!DOCTYPE html>` file (no Markdown code blocks unless user asks)

See `reference/layout-guide.md` and `workflows/html-generation.md` for detailed guidance.
