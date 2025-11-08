# Customization Workflow

Customize individual slides and items using JSON input.

## When to Use

Use customization when:
- You need to override default item data
- You want to customize title slide metadata
- You need to set custom asset paths
- You want fine-grained control over slide content

## Workflow

0. **Clarify Intent and Audience**
   - Capture audience, goal, tone, and key messages from request
   - Determine which layout best matches each intent before editing JSON
   - Document rationale for selected layouts/items

1. **Start with Base Layout**
   - Choose layout from `resources/layouts.json`
   - Note item identifiers (`i` keys)

2. **Create Custom JSON**
   - Copy from `resources/examples/sample-input.json`
   - Override items by `i` key
   - Customize titleSlide metadata

3. **Generate Customized Deck**
   ```bash
   node scripts/cli.js generate --input custom-input.json --output customized.pptx
   ```

## Item Override Pattern

```json
{
  "slides": [
    {
      "layout": "data-grid-dashboard",
      "title": "Custom KPIs",
      "items": [
        {
          "i": "kpi1",
          "data": {
            "metric": "+45%",
            "label": "Custom Metric",
            "icon": "trending-up"
          }
        }
      ]
    }
  ]
}
```

## Override Behavior

- Item overrides merge shallowly with layout defaults
- Nested `data` objects are merged
- Missing items use layout defaults
- Extra items are ignored

## Title Slide Customization

```json
{
  "titleSlide": {
    "title": "Custom Title",
    "subtitle": "Custom Subtitle",
    "author": "Author Name",
    "company": "Company Name",
    "date": "2025-10-21"
  }
}
```

See `reference/schemas.md` for complete customization options.

