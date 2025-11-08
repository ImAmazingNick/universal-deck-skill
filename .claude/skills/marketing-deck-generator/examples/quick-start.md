# Quick Start Examples

Common usage patterns for deck generation.

## Single Layout Deck

```bash
node scripts/cli.js generate --layout "data-grid-dashboard" --theme "metallic-earth"
```

Creates a single slide deck with KPI dashboard layout.

## Multi-Layout Deck

```bash
node scripts/cli.js generate \
  --slides "bold-minimalist-hero,data-grid-dashboard,testimonial-gallery" \
  --theme "tech-purple" \
  --output presentation.pptx
```

Creates a deck with multiple layouts in sequence.

## From JSON File

```bash
node scripts/cli.js generate \
  --input resources/examples/sample-input.json \
  --output custom-deck.pptx
```

Uses JSON input for full customization.

## Context-Driven Generation

```bash
node scripts/cli.js generate \
  --input resources/examples/sample-context-request.json \
  --output auto-generated.pptx
```

Automatically generates slides from strategic context (goals, metrics, charts).

## Preview Context Generation

```bash
npm run qa:context
```

Shows what slides will be generated without creating PPTX file.

## All Available Layouts

```bash
node scripts/cli.js generate \
  --slides "bold-minimalist-hero,data-grid-dashboard,chart-showcase,testimonial-gallery,comparison-table,photo-narrative-flow,timeline-roadmap,metrics-breakdown,call-to-action" \
  --theme "tech-purple" \
  --output complete-showcase.pptx
```

Creates a showcase deck with all available layouts.

