---
name: marketing-deck-generator
description: Generate professional PPTX marketing presentations from JSON input or CLI parameters. Supports 9 layout templates, 5 themes, and context-driven generation. Use when creating pitch decks, marketing presentations, investor decks, or any PowerPoint presentation that needs consistent branding and layouts.
---

# Marketing Deck Generator

Generate professional PowerPoint presentations (PPTX) from JSON configurations, CLI parameters, or strategic context descriptions.

## When to Use

Use this skill when you need to:
- Create marketing or pitch decks with consistent layouts
- Generate presentations from structured data (metrics, charts, timelines)
- Produce branded PowerPoint files programmatically
- Convert strategic context (goals, metrics, testimonials) into slide decks

## Required Intent Analysis

Before generating or suggesting slides, Claude **must** think through the user's intent and audience:

1. **Understand the Request**  
   - Identify primary goal (e.g., persuade investors, educate customers, report metrics)  
   - Note audience, tone, time horizon, and any explicit constraints
2. **Plan Slide Strategy**  
   - Map goals to layouts (e.g., KPIs → `data-grid-dashboard`, roadmap → `timeline-roadmap`, testimonials → `testimonial-gallery`)  
   - Decide slide sequencing and transitions that support the narrative arc
3. **Choose Layouts Intentionally**  
   - Prefer layouts that reinforce the message (metrics → KPI cards, comparisons → tables, vision → hero slide)  
   - Avoid redundant slides; each layout should add new insight
4. **Validate Against Intent**  
   - Ensure selected layouts, themes, and data support the desired tone and outcome  
   - If information is missing, ask for clarification or propose assumptions explicitly
5. **Prefer Context-Driven Flow**  
   - When the request contains goals/sections, use the context-driven workflow to auto-map intent to layouts  
   - When intent is ambiguous, outline options and explain trade-offs before generating content

Document your reasoning (at least briefly) before producing the final deck so the user can see how intent informed layout selection.

## Quick Start

```bash
# Single layout deck
node scripts/cli.js generate --layout "data-grid-dashboard" --theme "metallic-earth"

# Multiple layouts
node scripts/cli.js generate --slides "bold-minimalist-hero,data-grid-dashboard,testimonial-gallery" --theme "tech-purple" --output deck.pptx

# From JSON input
node scripts/cli.js generate --input resources/examples/sample-input.json --output deck.pptx

# Context-driven (auto-generates slides from goals/metrics)
node scripts/cli.js generate --input resources/examples/sample-context-request.json --output deck.pptx
```

Output files are saved to `output/` folder.

## Layouts

9 professional layouts available. See `reference/layouts.md` for details:
- `bold-minimalist-hero` - Title slides
- `data-grid-dashboard` - KPI cards
- `photo-narrative-flow` - Image + text
- `comparison-table` - Feature comparison
- `chart-showcase` - Data visualization
- `timeline-roadmap` - Milestones
- `testimonial-gallery` - Customer quotes
- `metrics-breakdown` - Detailed KPIs
- `call-to-action` - Conversion slides

## Themes

5 branded themes available. See `reference/themes.md` for details:
- `metallic-earth` - Cyan accents, dark backgrounds
- `corporate-blue` - Professional business
- `startup-green` - Modern startup
- `tech-purple` - Tech/innovation
- `warm-orange` - Creative industries

## Input Methods

### 1. CLI Parameters
```bash
--layout    # Single layout name
--slides    # Comma-separated layout names
--theme     # Theme name
--input     # JSON input file path
--output    # Output filename (default: output/deck.pptx)
```

### 2. JSON Input
Basic structure with theme, titleSlide, and slides array. See `reference/schemas.md` for complete schema.

### 3. Context-Driven (`deckRequest`)
Provide strategic context (topic, goals, sections with metrics/charts/timelines/testimonials/CTA) and let the generator assemble slides automatically. See `reference/schemas.md` for `deckRequest` schema.

## Workflows

- `workflows/basic-generation.md` - Standard deck generation workflow
- `workflows/context-driven.md` - Generate decks from strategic context
- `workflows/customization.md` - Customize slides and items

## Reference Files

- `reference/layouts.md` - Complete layout definitions and usage
- `reference/themes.md` - Theme styles and color palettes
- `reference/schemas.md` - JSON input schemas and field reference
- `examples/quick-start.md` - Common usage patterns
- `resources/layouts.json` - Layout configurations (grid, items, defaults) (repository root)
- `resources/themes.json` - Theme color definitions (repository root)
- `resources/examples/` - Working example JSON files (repository root)

## Development

```bash
npm install
npm run dev              # Interactive preview (http://localhost:3000)
npm run build:exporter   # Build TypeScript exporter
npm run preview          # Quick preview deck
npm run qa:context       # Preview context-driven generation
```

## Technical Notes

- Exports use PptxGenJS library
- Web preview uses React Grid Layout
- Supports image assets via `assetsBasePath` in JSON input
- Item overrides merge with layout defaults (shallow merge)
- Auto-headers injected unless `autoHeader: false` in layout config
