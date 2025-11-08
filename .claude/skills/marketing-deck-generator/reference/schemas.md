# Input Schema Reference

Complete JSON schema definitions for deck generation.

## Basic Input Schema

```json
{
  "theme": "tech-purple",
  "titleSlide": {
    "title": "Presentation Title",
    "subtitle": "Optional subtitle",
    "author": "Author Name",
    "company": "Company Name",
    "date": "2025-10-21"
  },
  "assetsBasePath": "./public",
  "slides": [
    {
      "layout": "bold-minimalist-hero",
      "title": "Slide Title",
      "items": [
        {
          "i": "title",
          "data": {
            "text": "Custom text"
          }
        }
      ]
    }
  ]
}
```

## Context-Driven Schema (`deckRequest`)

Generate slides automatically from strategic context:

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
        "title": "Performance Metrics",
        "metrics": [
          {
            "label": "Metric Name",
            "value": "92%",
            "change": 14,
            "changeLabel": "QoQ uplift"
          }
        ]
      },
      {
        "focus": "chart",
        "title": "Revenue Chart",
        "chart": {
          "type": "area|bar|line|pie",
          "categories": ["Q1", "Q2", "Q3", "Q4"],
          "series": [
            {
              "name": "Series Name",
              "values": [4.2, 6.1, 9.3, 13.8]
            }
          ]
        }
      },
      {
        "focus": "timeline",
        "title": "Roadmap",
        "timeline": {
          "events": [
            {
              "date": "2025-Q1",
              "title": "Event Title",
              "description": "Event description"
            }
          ]
        }
      },
      {
        "focus": "testimonials",
        "title": "Customer Feedback",
        "testimonials": [
          {
            "quote": "Customer quote",
            "author": "Name",
            "role": "Title",
            "company": "Company"
          }
        ]
      },
      {
        "focus": "cta",
        "callToAction": {
          "headline": "Action Headline",
          "buttonLabel": "Button Text"
        }
      }
    ]
  }
}
```

## Item Overrides

Override specific items by `i` key from layout definition:

```json
{
  "slides": [
    {
      "layout": "data-grid-dashboard",
      "items": [
        {
          "i": "kpi1",
          "data": {
            "metric": "+32%",
            "label": "Growth",
            "icon": "trending-up"
          }
        }
      ]
    }
  ]
}
```

Item overrides merge shallowly with layout defaults. Nested `data` objects are merged.

## Field Reference

### titleSlide
- `title` (string): Main title
- `subtitle` (string, optional): Subtitle text
- `author` (string, optional): Author name
- `company` (string, optional): Company name
- `date` (string, optional): Date (ISO format recommended)

### slides[].items[]
- `i` (string): Item identifier from layout definition
- `data` (object): Item-specific data (varies by item type)

### deckRequest.sections[]
- `focus` (string): Section type (`metrics`, `chart`, `timeline`, `testimonials`, `cta`)
- `title` (string): Section title
- Type-specific fields based on `focus`

See `resources/examples/` for complete working examples.

