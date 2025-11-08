# Dynamic Theming Guide

The HTML template exposes a SAFE layer of CSS variables so you can swap colors without breaking layout or accessibility.

## Available CSS Variables
| Variable | Default | Purpose |
|----------|---------|---------|
| `--background-color` | `#000000` | Surrounding canvas outside the presentation frame |
| `--base-text-color` | `#ffffff` | Text on the outer canvas and header progress counter |
| `--primary-gradient` | `linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)` | Hero typography gradients and stat highlights |
| `--progress-gradient` | `linear-gradient(90deg, #ff6b35 0%, #ff8c42 100%)` | Progress bar fill |
| `--accent-color` | `#ff6b35` | CTA accents, nav dots, highlight spans |
| `--accent-color-soft` | `#ff8c42` | Secondary accent shade for gradients |
| `--presentation-surface` | `rgba(10, 12, 18, 0.85)` | Frame background behind slides |
| `--slide-background` | `#ffffff` | Inner slide canvas |
| `--slide-text-color` | `#1c1f27` | Primary slide copy |
| `--subtitle-color` | `#343a4a` | Slide subtitles |
| `--muted-text-color` | `#666d80` | Body paragraphs, supporting copy |
| `--card-surface` | `#f8f8f8` | Metric/stat cards |
| `--card-border` | `rgba(0, 0, 0, 0.08)` | Card border/bounds |
| `--header-background` | `rgba(0, 0, 0, 0.9)` | Fixed header backplate |
| `--header-subtitle-color` | `rgba(204, 204, 204, 0.95)` | Header subtitle text |
| `--nav-dot-active` | `var(--accent-color)` | Active navigation dot fill |

## Applying Overrides
1. Inject a `<style>` block after the main one, or set a `data-theme` attribute on `<body>` and scope overrides with `[data-theme="brand"]`.
2. Provide your brand gradient: `--primary-gradient: linear-gradient(to right, #0047ff, #00d4ff);`
3. Adjust text/background tokens as needed.

```html
<body data-theme="brand">
  <style>
    body[data-theme="brand"] {
      --background-color: #05060c;
      --base-text-color: #f5f7ff;
      --slide-background: #0f131f;
      --slide-text-color: #f4f6ff;
      --muted-text-color: #c2c8e4;
    }
  </style>
  ...
</body>
```

## Validate Contrast
1. Create a JSON file with the overridden tokens:
```json
{
  "--background-color": "#05060c",
  "--base-text-color": "#f5f7ff",
  "--slide-background": "#0f131f",
  "--slide-text-color": "#f4f6ff",
  "--muted-text-color": "#c2c8e4",
  "--accent-color": "#00d4ff"
}
```
2. Compile scripts once (`npm run build:exporter`) if you haven’t already.
3. Run `node scripts/dist/tools/validate-theme.js --config brand-theme.json`
4. Resolve any WARN/FAIL results before sharing the deck.

## Tips
- Ensure gradients still produce sufficient contrast where text overlays them. If needed, add a shadow or outline on hero headlines.
- For light-mode variants, flip the outer canvas to a pale tone and adjust nav dots to remain visible (`--nav-dot-color` / `--nav-dot-active`).
- Keep CTA and link colors distinct from body copy to maintain clear affordances.


