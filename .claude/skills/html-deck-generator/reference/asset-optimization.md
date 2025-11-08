# Asset Optimization Cheatsheet

## 1. Generate Chart.js Data URIs
Use the asset helper’s `chart` command for quick inline charts.

```
npm run build:exporter   # one-time compile for scripts/
node scripts/dist/tools/asset-helper.js chart \
  --type bar \
  --labels Q1,Q2,Q3,Q4 \
  --values 12,18,25,31 \
  --dataset-label "ARR ($M)" \
  --title "Quarterly Growth" \
  --output arr-chart.txt
```

Paste the resulting `data:image/png;base64,...` string into your HTML:

```html
<img src="{{ARR_CHART_DATA_URI}}" alt="Quarterly ARR growth bar chart" loading="lazy" />
```

### Pre-baked Configs
- **Line Trend:** `--type line --background rgba(0,87,255,0.35) --border #0057ff`
- **Pie Split:** `--type pie` (provide values + labels)
- **Radar Capability:** `--type radar --values 3,4,5,4,5`

For full control, pass a Chart.js config via `--json '{"type":"line","data":{...}}'`.

## 2. Encode Local Assets
Convert SVGs, logos, or HTML widgets to data URIs:

```
node scripts/dist/tools/asset-helper.js encode \
  --input assets/logo.svg \
  --mime image/svg+xml \
  --output logo-data-uri.txt
```

Embed directly:

```html
<img src="{{LOGO_DATA_URI}}" alt="Company logo" width="128" height="32" />
```

### Compress Rich Embeds
For HTML/JSON embeds, add `--gzip`:

```
node scripts/dist/tools/asset-helper.js encode \
  --input embeds/product-tour.html \
  --mime text/html \
  --gzip \
  --output product-tour-uri.txt
```

Result: `data:application/gzip;base64,...` – pair with `<iframe src="...">` or fetch/decompress in JS if needed.

## 3. Noscript Fallbacks
- The template already exposes a sequential fallback via `<noscript>`.
- When embedding charts, include a text summary for non-JS render:

```html
<figure>
  <img src="{{DATA_URI}}" alt="Pipeline conversion funnel" />
  <figcaption>
    Pipeline conversion rose from 22% → 37% after launch.
  </figcaption>
</figure>
```

## 4. Checklist
- [ ] Run `validate-theme.js` if you tweaked colors.
- [ ] Use `asset-helper.js` to inline heavy assets sparingly (<1 MB).
- [ ] Add descriptive alt text + captions for every embedded chart.
- [ ] Confirm page weight stays reasonable (Chrome DevTools > Network).


