# Context-Driven Generation Workflow

Generate decks from strategic context instead of manually specifying layouts.

## When to Use

Use context-driven generation when:
- You have goals, metrics, or strategic content but don't know which layouts to use
- You want the generator to automatically select appropriate layouts
- You're creating decks from business context (reports, pitches, analyses)

## Workflow

1. **Prepare Context JSON**
   - Define topic, audience, tone
   - List goals
   - Provide sections with focus areas (metrics, charts, timelines, testimonials, CTA)

2. **Generate Deck**
   ```bash
   node scripts/cli.js generate --input resources/examples/sample-context-request.json --output deck.pptx
   ```

3. **Preview Before Export** (Optional)
   ```bash
   npm run qa:context
   ```
   Shows what slides will be generated without creating PPTX file.

## Context Structure

```json
{
  "theme": "tech-purple",
  "deckRequest": {
    "topic": "Product Launch",
    "audience": "Executive Stakeholders",
    "tone": "visionary",
    "goals": ["Goal 1", "Goal 2"],
    "sections": [
      {
        "focus": "metrics",
        "title": "Performance",
        "metrics": [...]
      },
      {
        "focus": "chart",
        "title": "Revenue",
        "chart": {...}
      }
    ]
  }
}
```

## Focus Types

- `metrics` - Maps to `data-grid-dashboard` or `metrics-breakdown`
- `chart` - Maps to `chart-showcase`
- `timeline` - Maps to `timeline-roadmap`
- `testimonials` - Maps to `testimonial-gallery`
- `cta` - Maps to `call-to-action`

See `reference/schemas.md` for complete schema documentation.

