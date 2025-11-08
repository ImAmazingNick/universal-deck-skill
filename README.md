# Deck Skill Preview

A React/TypeScript-powered, Shadcn/UI-enhanced deck generator for creating stunning PPTX marketing presentations with unbreakable slide structures. Built as a Claude-compatible skill for automated marketing content creation.

## 🚀 Features

- **⚡ Lightning Fast**: Generate decks in milliseconds with optimized performance
- **🎨 Modern Typography**: Rich text, code blocks, lists, quotes, and notes with developer-style aesthetics
- **📱 Interactive Preview**: Lazy-loaded components with real-time layout switching
- **🎯 12 Professional Layouts**: Content slides, code presentations, documentation, and more
- **🎨 5 Beautiful Themes**: Tech Purple, Corporate Blue, Startup Green, Metallic Earth, Warm Orange
- **📊 PPTX Export**: High-quality PowerPoint with modern typography and layouts
- **🧩 Component Library**: RichText, List, Quote, Code, Note cards with theme integration
- **🧠 Context-Aware Generation**: Transform goals, metrics, timelines, and testimonials into full decks
- **🤖 Claude Skills Compatible**: Headless operation for AI agent integration

## ⚡ Performance

- **Quick Preview**: 4 slides in ~4ms generation time
- **Full Showcase**: 12 slides in ~234ms generation time
- **Web Bundle**: ~336KB first load (optimized with code splitting)
- **PPTX Files**: 85KB-214KB (reasonable file sizes)
- **Lazy Loading**: Components load on-demand for faster initial page loads

## 🐛 Bug Fixes

**v1.0.2 - Actual Layout Rendering**
- **Issue**: All decks had identical 3-slide structure showing only layout/theme metadata
- **Fix**: Export script now renders actual layout components (KPI cards, testimonials, metrics, buttons) based on `layouts.json` configuration
- **Result**: Each layout now displays unique, properly positioned content instead of generic metadata

**v1.0.1 - Theme Colors Fixed**
- **Issue**: All generated decks used hardcoded dark colors regardless of theme selection
- **Fix**: Export script now properly loads and applies theme colors from `themes.json`
- **Result**: Each theme now displays its unique color scheme (light/dark backgrounds, proper accent colors)

## ⚡ Quick Start (Fast!)

### 🚀 Instant Preview (Recommended - 4 seconds!)
```bash
npm install
npm run preview
```
Creates `output/quick-preview.pptx` with modern typography showcase in ~4ms!

### 🎨 Full Showcase (Comprehensive - 12 slides)
```bash
npm run build:exporter
node scripts/cli.js gen --input sample-full-deck.json -o output/showcase.pptx
```
Complete feature demonstration in ~234ms.

### 💻 Development Mode (Interactive Preview)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the interactive slide builder.

### CLI Export Mode (Headless)
```bash
# Generate with specific layout and theme (recommended)
# Files are automatically saved to the 'output' folder
node scripts/cli.js generate --layout data-grid-dashboard --theme metallic-earth --output presentation.pptx

# Or use default filename (output/deck.pptx)
node scripts/cli.js generate --layout data-grid-dashboard --theme metallic-earth

# List available options
node scripts/cli.js list-layouts
node scripts/cli.js list-themes

# Alternative: npm script (may have argument parsing issues)
npm run export generate --layout data-grid-dashboard --theme metallic-earth

# Multi-layout deck in one run (all layouts)
node scripts/cli.js generate --slides "bold-minimalist-hero,data-grid-dashboard,chart-showcase,testimonial-gallery,comparison-table,photo-narrative-flow,timeline-roadmap,metrics-breakdown,call-to-action" --theme tech-purple --output complete-all-layouts.pptx

# Generate from input JSON (supports titleSlide, item overrides, assetsBasePath)
node scripts/cli.js generate --input resources/examples/sample-input.json --output complete-all-layouts-customized.pptx

# Generate a narrative-driven deck from context (new!)
node scripts/cli.js generate --input resources/examples/sample-context-request.json --output output/aurora-launch.pptx
```

### 🤖 Context-Driven Decks (Agents & QA)
```bash
# Summarize the deck that will be generated from sample context
npm run qa:context

# Or provide your own context payload
npm run build:exporter
node scripts/context-preview.js path/to/your-context.json
```

## 📋 Available Layouts

| Layout | Description |
|--------|-------------|
| `bold-minimalist-hero` | Clean, impactful title slides with centered typography |
| `data-grid-dashboard` | KPI-focused layouts with responsive card grids |
| `photo-narrative-flow` | Image-driven storytelling with photo-text combinations |
| `chart-showcase` | Data visualization layouts with integrated charts |
| `testimonial-gallery` | Customer quote collections in scannable formats |
| `call-to-action` | Conversion-focused slides with clear next steps |
| `metrics-breakdown` | Detailed KPI presentations with change indicators |
| `comparison-table` | Structured comparison layouts for product analysis |
| `timeline-roadmap` | Chronological presentation of milestones and plans |

## 🎨 Available Themes

| Theme | Description |
|-------|-------------|
| `metallic-earth` | Cyan accents with dark backgrounds and metallic gradients |
| `corporate-blue` | Professional blue palette for business presentations |
| `startup-green` | Fresh green theme perfect for modern startups |
| `tech-purple` | Vibrant purple theme for tech and innovation |
| `warm-orange` | Warm, inviting orange theme for creative industries |

## 🛠️ Technical Architecture

### Frontend (Interactive Mode)
- **React 19** + **TypeScript** for type-safe development
- **Next.js 15** for full-stack capabilities
- **Shadcn/UI** for accessible, customizable components
- **React Grid Layout** for responsive, draggable grids
- **Framer Motion** for smooth animations
- **Recharts** for data visualization

### Backend (Export Mode)
- **Node.js** CLI for headless operation
- **PptxGenJS** for high-quality PPTX generation
- **File system** operations for output management

### Claude Skills Integration
- **Headless CLI** for agent execution
- **JSON configurations** for layout and theme definitions
- **Natural language prompts** for layout selection
- **Progressive loading** for efficient resource management

## 📁 Project Structure

```
marketing-deck-skill/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn/ui components
│   │   ├── layouts/         # Layout templates
│   │   └── items/           # Slide item components
│   ├── grid/SlideGrid.tsx   # Grid layout system
│   ├── lib/
│   │   ├── deck-types.ts    # TypeScript definitions
│   │   ├── export-client.ts # Browser export
│   │   └── utils.ts         # Utilities
│   └── DeckPreview.tsx      # Main preview app
├── scripts/
│   ├── cli.js               # CLI entry point
│   └── exportPptx.ts        # PPTX export logic
├── resources/
│   ├── layouts.json         # Layout configurations
│   ├── themes.json          # Theme definitions
│   └── assets/              # Static assets
├── output/                  # Generated PPTX files (auto-created)
└── .claude/
    └── SKILL.md             # Claude Skills metadata
```

## 🧩 Input JSON Schema (Advanced)

Customize slides using an input file. You can override specific items by their `i` key from `resources/layouts.json`, set a `titleSlide`, and control `assetsBasePath` for images.

```json
{
  "theme": "tech-purple",
  "titleSlide": {
    "title": "Q4 Performance",
    "subtitle": "NA • 2025",
    "author": "Marketing",
    "company": "Acme"
  },
  "assetsBasePath": "./public",
  "slides": [
    {
      "layout": "bold-minimalist-hero",
      "title": "Welcome",
      "items": [ { "i": "title", "data": { "text": "Acme Marketing" } } ]
    },
    {
      "layout": "data-grid-dashboard",
      "title": "KPIs",
      "items": [ { "i": "kpi1", "data": { "metric": "+32%", "label": "Growth" } } ]
    }
  ]
}
```

Notes:
- Item overrides are shallow-merged into the base item; nested `data` is merged.
- Auto-headers are injected except when `autoHeader` is false or an explicit `header` item exists.
- `assetsBasePath` is used to resolve image paths for `photo-card` items.

### Context-Driven Input (`deckRequest`)

Provide strategic context instead of hand-authoring every slide. The generator maps goals, metrics, charts, timelines, testimonials, and CTA instructions into full layouts.

```json
{
  "theme": "tech-purple",
  "deckRequest": {
    "topic": "Aurora AI Launch Blueprint",
    "audience": "Executive Stakeholders",
    "tone": "visionary",
    "goals": [
      "Highlight launch readiness",
      "Demonstrate market momentum"
    ],
    "sections": [
      {
        "focus": "metrics",
        "title": "Pilot Performance Snapshot",
        "metrics": [
          { "label": "Pilot Conversion", "value": "92%", "change": 14, "changeLabel": "QoQ uplift" }
        ]
      },
      {
        "focus": "chart",
        "title": "Revenue Trajectory",
        "chart": {
          "type": "area",
          "categories": ["Q1","Q2","Q3","Q4"],
          "series": [
            { "name": "Core ARR", "values": [4.2, 6.1, 9.3, 13.8] },
            { "name": "Expansion ARR", "values": [0.8, 2.4, 5.1, 8.6] }
          ]
        }
      },
      {
        "focus": "cta",
        "callToAction": {
          "headline": "Greenlight Launch",
          "buttonLabel": "Approve Launch Plan"
        }
      }
    ]
  }
}
```

👉 See `resources/examples/sample-context-request.json` for a comprehensive example and run `npm run qa:context` to preview the generated slide breakdown without producing a PPTX.

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone <repository-url>
cd marketing-deck-skill
npm install
```

### Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm run start
```

### CLI Testing
```bash
# Test CLI functionality (files saved to output/ folder)
npm run export generate --layout bold-minimalist-hero --theme corporate-blue --output test.pptx

# Or use default filename
npm run export generate --layout bold-minimalist-hero --theme corporate-blue

# View available layouts
npm run export list-layouts

# View available themes
npm run export list-themes
```

## 🤖 Claude Skills Usage

This skill can be invoked by Claude agents using natural language prompts:

### Example Prompts
- "Generate a Q4 marketing deck with KPI dashboard and metallic theme"
- "Create a startup pitch deck with photo flow and testimonials"
- "Build a product comparison slide with charts and corporate blue theme"
- "Make a metrics breakdown presentation with the green startup theme"

### Skill Invocation
```bash
# Claude agent would execute:
node scripts/cli.js generate --layout [detected-layout] --theme [detected-theme] --output deck.pptx
```

## 📊 Component Library

### Layout Components
- `BoldMinimalistHero`: Hero slides with title and subtitle
- `DataGridDashboard`: KPI card grids
- `PhotoNarrativeFlow`: Image and text combinations
- `ChartShowcase`: Data visualization layouts
- `TestimonialGallery`: Customer quote collections
- `CallToAction`: Conversion-focused slides
- `MetricsBreakdown`: Detailed KPI displays
- `ComparisonTable`: Feature comparison tables

### Item Components
- `KpiCard`: Metric display with icons and trends
- `PhotoCard`: Image display with captions
- `ChartCard`: Recharts integration for data viz
- `TextCard`: Formatted text content
- `TestimonialCard`: Quote displays with attribution
- `MetricCard`: Detailed metric cards with changes

## 🎨 Customization

### Adding New Layouts
1. Create layout component in `src/components/layouts/`
2. Add configuration to `resources/layouts.json`
3. Export from `src/components/layouts/index.ts`
4. Add to `layoutComponents` in `DeckPreview.tsx`

### Adding New Themes
1. Add theme configuration to `resources/themes.json`
2. Theme will automatically be available in UI

### Adding New Components
1. Create component in appropriate `src/components/` directory
2. Add TypeScript types to `src/lib/deck-types.ts`
3. Add rendering logic to `SlideGrid.tsx`

## 📈 Performance

- **Bundle Size**: ~15MB (Claude Skills compatible)
- **Export Speed**: 10-15 slides in 20-40 seconds
- **Memory Usage**: Optimized for Node.js environments
- **Browser Support**: Modern browsers with React 19 support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Shadcn/UI** for the amazing component library
- **PptxGenJS** for reliable PPTX generation
- **React Grid Layout** for flexible grid systems
- **Recharts** for beautiful data visualization
- **Claude Skills** for the inspiration and framework

---

Built with ❤️ for modern marketing teams who need beautiful, professional presentations fast.