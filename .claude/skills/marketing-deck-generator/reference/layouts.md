# Layout Reference

Complete layout definitions and usage patterns.

## Available Layouts

### bold-minimalist-hero
**Purpose**: Title slides with centered typography  
**Use when**: Creating opening slides, section dividers, or impactful title pages  
**Items**: `title`, `subtitle`

### data-grid-dashboard
**Purpose**: KPI-focused layouts with responsive card grids  
**Use when**: Presenting metrics, KPIs, or performance data  
**Items**: `kpi1`, `kpi2`, `kpi3`, `kpi4`, `header` (auto-injected)

### photo-narrative-flow
**Purpose**: Image-driven storytelling with side-by-side photo and text  
**Use when**: Product showcases, case studies, visual narratives  
**Items**: `image1`, `text1`

### comparison-table
**Purpose**: Structured comparison layouts for product/feature analysis  
**Use when**: Feature comparisons, competitive analysis, before/after  
**Items**: `table`

### chart-showcase
**Purpose**: Data visualization layouts with integrated charts  
**Use when**: Presenting trends, analytics, or quantitative data  
**Items**: `chart`, `legend`, `header` (auto-injected)

### timeline-roadmap
**Purpose**: Chronological presentation of milestones and future plans  
**Use when**: Roadmaps, project timelines, historical overviews  
**Items**: `timeline`

### testimonial-gallery
**Purpose**: Customer quote collections in clean, scannable formats  
**Use when**: Social proof, customer success stories, endorsements  
**Items**: `testimonial1`, `testimonial2`, `header` (auto-injected)

### metrics-breakdown
**Purpose**: Detailed KPI presentations with multiple metric types  
**Use when**: Deep-dive analysis, detailed performance reviews  
**Items**: `metric1`, `metric2`, `metric3`, `header` (auto-injected)

### call-to-action
**Purpose**: Conversion-focused slides with clear next steps  
**Use when**: Closing slides, action items, conversion prompts  
**Items**: `cta-text`, `cta-button`

## Layout Configuration

See `resources/layouts.json` for complete grid configurations, item positions, and default data.

## Auto-Headers

Most layouts automatically inject headers unless:
- Layout has `autoHeader: false` in configuration
- Layout defines explicit `header` item

Headers include slide title and optional subtitle with divider.

