# HTML Deck Layout Guide

Use this guide to map user intent to the ECM-Atlas style slide patterns. Pair it with the archetype playbook (`reference/audience-archetypes.md`) after you collect clarifying inputs. For variant specifics and rich media, see `reference/variants-and-media.md`.

## Slide Structure Overview

Each slide lives inside:
```html
<div class="slide" id="slide{{N}}" data-title="{{TITLE}}" data-subtitle="{{SUBTITLE}}">
  <div class="slide-content {{LAYOUT_CLASS}}">
    <!-- Slide-specific content -->
  </div>
</div>
```

Key layout classes:
- `title-slide` – hero typography + stat cards
- `content-slide` – default flexible layout for storytelling, metrics, visuals
- `timeline-container`, `comparison-container`, `feature-showcase` – specialized blocks defined in CSS

## Common Blocks

### Stats Grid (Problem / Insight)
```html
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-number">{{VALUE}}</div>
    <div class="stat-label">{{LABEL}}</div>
    <div class="stat-desc">{{DESCRIPTION}}</div>
  </div>
  <!-- Repeat cards -->
</div>
```

### Metrics Grid (Capabilities)
```html
<div class="metrics-grid">
  <div class="metric-item">
    <div class="metric-number">{{VALUE}}</div>
    <div class="metric-label">{{LABEL}}</div>
    <div class="metric-desc">{{DESCRIPTION}}</div>
  </div>
</div>
```

### Timeline (Roadmap)
```html
<div class="timeline-container">
  <div class="timeline-line"></div>
  <div class="timeline-item">
    <div class="timeline-dot"></div>
    <div class="timeline-content">
      <h3>{{YEAR_OR_PHASE}}</h3>
      <p>{{DETAILS}}</p>
    </div>
  </div>
</div>
```

### Comparison (Before / After)
```html
<div class="comparison-container">
  <div class="comparison-card before"> ... </div>
  <div class="comparison-card after"> ... </div>
</div>
```

### Feature Showcase
```html
<div class="feature-showcase">
  <div class="feature-card-large"> ... </div>
  <div class="feature-card"> ... </div>
</div>
```

### CTA
```html
<div class="cta-section">
  <h3>{{CTA_TITLE}}</h3>
  <p>{{CTA_DESCRIPTION}}</p>
  <a class="cta-button" href="{{CTA_LINK}}">{{CTA_LABEL}}</a>
</div>
```

## Intent → Layout Mapping

| Intent | Recommended Layouts |
|--------|----------------------|
| Vision / Mission | Hero slide → narrative quote |
| Problem Definition | Stats grid + note block |
| Data Proof | Metrics grid, heatmap image |
| Product Features | Feature showcase cards |
| Roadmap | Timeline container |
| Competitive Edge | Comparison container |
| Social Proof | Stat grid + testimonial cards |
| Call to Action | CTA section |

## Navigation Elements

- Slide IDs must be sequential (`slide1`, `slide2`, ...)
- Update `data-slide` attributes for nav dots
- Set `totalSlides` constant and `slideCounter` text
- Ensure first slide has `class="slide active"`

## Assets

- Preferred to use remote images or data URIs
- Maintain aspect ratio and apply border radius / box shadow as in template
- Provide descriptive `alt` text for accessibility

## Accessibility

- Use semantic headings (`<h1>`, `<h2>`, `<h3>`) within slides
- Provide descriptive copy for screen readers
- Ensure color contrast meets WCAG AA (template colors comply)

Refer to `resources/templates/html-deck-template.html` for the full CSS and JS scaffold, and `reference/dynamic-theming.md` for safe color overrides.
