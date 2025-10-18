# Marketing Deck Generator Skill

A React/TypeScript-powered, Shadcn/UI-enhanced deck generator for creating stunning PPTX marketing presentations with unbreakable slide structures.

## Description

The Marketing Deck Generator Skill automates the creation of professional marketing decks in PPTX format. It features:

- **Interactive Preview Mode**: React-based grid layout for drag-and-drop slide building
- **9 Professional Layouts**: BoldMinimalistHero, DataGridDashboard, PhotoNarrativeFlow, and more
- **Unbreakable Grids**: Responsive layouts that maintain visual integrity across devices
- **Theme System**: 5 built-in themes (Metallic Earth, Corporate Blue, Startup Green, Tech Purple, Warm Orange)
- **Component Library**: KPI Cards, Photo Cards, Charts, Tables, and Timelines
- **PPTX Export**: High-quality PowerPoint presentations ready for client delivery

## Usage

### Interactive Preview Mode
```bash
npm run dev
```
Opens a browser-based editor for drag-and-drop slide creation and real-time preview.

### CLI Export Mode
```bash
# Single layout deck (files are automatically saved to the 'output' folder)
node scripts/cli.js generate --layout "data-grid-dashboard" --theme "metallic-earth" --input data.json --output deck.pptx

# Multiple layouts in one deck
node scripts/cli.js generate --slides "bold-minimalist-hero,data-grid-dashboard,testimonial-gallery" --theme "tech-purple" --output multi-layout-deck.pptx

# Or use default filename (output/deck.pptx)
node scripts/cli.js generate --layout "data-grid-dashboard" --theme "metallic-earth"
```

### Claude Skills Integration
This skill can be invoked by Claude agents using natural language prompts:

**Single Layout Decks:**
- "Generate a Q4 marketing deck with KPI dashboard and photo narrative"
- "Create a startup pitch deck using the green theme with metrics breakdown"
- "Build a product comparison slide with charts and testimonials"

**Multi-Layout Decks:**
- "Create a complete marketing presentation with hero slide, KPI dashboard, testimonials, and call-to-action"
- "Generate a startup pitch deck combining hero, metrics breakdown, timeline roadmap, and testimonials"
- "Build a product launch presentation with photo narrative, chart showcase, and customer testimonials"

## Parameters

- `--layout` (optional): Single layout template (bold-minimalist-hero, data-grid-dashboard, photo-narrative-flow, comparison-table, chart-showcase, timeline-roadmap, testimonial-gallery, metrics-breakdown, call-to-action)
- `--slides` (optional): Multiple layouts in one deck: "layout1,layout2,layout3"
- `--theme` (optional): Visual theme (metallic-earth, corporate-blue, startup-green, tech-purple, warm-orange)
- `--input` (optional): JSON file with slide data
- `--output` (optional): Output filename (defaults to "output/deck.pptx", files saved to output/ folder)

**Note**: Use either `--layout` for single-slide decks or `--slides` for multi-slide decks with different layouts.

## Layout Templates

### Bold Minimalist Hero
Clean, impactful title slides with centered typography and minimal visual elements.

### Data Grid Dashboard
KPI-focused layouts with responsive card grids perfect for metrics presentation.

### Photo Narrative Flow
Image-driven storytelling with side-by-side photo and text combinations.

### Comparison Table
Structured comparison layouts for product/feature analysis.

### Chart Showcase
Data visualization layouts with integrated Recharts components.

### Timeline Roadmap
Chronological presentation of milestones and future plans.

### Testimonial Gallery
Customer quote collections in clean, scannable formats.

### Metrics Breakdown
Detailed KPI presentations with multiple metric types.

### Call to Action
Conversion-focused slides with clear next steps.

## Technical Architecture

- **Frontend**: React 19 + TypeScript + Shadcn/UI + Tailwind CSS
- **Grid System**: React Grid Layout for responsive, draggable components
- **Export Engine**: PptxGenJS for high-quality PPTX generation
- **Animation**: Framer Motion for smooth interactions
- **Charts**: Recharts integration for data visualization
- **Themes**: CSS custom properties for consistent theming

## File Structure

```
marketing-deck-skill/
├── SKILL.md                 # This metadata file
├── README.md                # Project documentation
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn/ui components (Card, Table, Chart, etc.)
│   │   ├── layouts/         # 9 layout templates (BoldMinimalistHero, etc.)
│   │   └── items/           # Reusable slide items (KpiCard, ChartCard, etc.)
│   ├── grid/SlideGrid.tsx   # React Grid Layout wrapper component
│   ├── lib/
│   │   ├── deck-types.ts    # TypeScript type definitions
│   │   ├── export-client.ts # Browser-side export functionality
│   │   └── utils.ts         # Utility functions
│   ├── DeckPreview.tsx      # Main interactive preview app
│   └── app/page.tsx         # Next.js app entry point
├── scripts/
│   ├── cli.js               # CLI entry point for headless operation
│   └── exportPptx.ts        # PPTX generation using PptxGenJS
├── resources/
│   ├── layouts.json         # Layout template configurations
│   ├── themes.json          # Theme definitions (colors, gradients)
│   └── assets/              # Static assets (icons, images)
├── package.json             # Dependencies and npm scripts
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── components.json          # Shadcn/ui configuration
```

## Dependencies

**Core Framework:**
- React 19 + TypeScript: Modern frontend development
- Next.js 15: Full-stack React framework
- Tailwind CSS 4: Utility-first CSS framework

**UI & Components:**
- shadcn/ui: Accessible, customizable component library
- Radix UI: Unstyled, accessible UI primitives
- Framer Motion: Animation library for React

**Grid & Layout:**
- react-grid-layout: Responsive, draggable grid system
- react-resizable: Resizable components

**Data Visualization:**
- Recharts: Composable charting library
- PptxGenJS: PowerPoint presentation generation

**Utilities:**
- Lodash: JavaScript utility library
- clsx & tailwind-merge: Conditional CSS class management
- class-variance-authority: Component variant management

## Development

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Export Test
```bash
# Files are automatically saved to the 'output' folder
node scripts/cli.js generate --layout "data-grid-dashboard" --theme "metallic-earth"
```

## Claude Skills Compatibility

This skill is designed to work with Claude's Skills system:

1. **Progressive Loading**: Metadata loads first, then components on demand
2. **Headless Operation**: CLI supports server-side rendering for agent execution
3. **Natural Language**: Supports descriptive prompts for layout and theme selection
4. **Resource Management**: Efficient bundling under 15MB limit

## Example Prompts

**Single Layout Decks:**
- "Create a marketing deck showcasing our Q4 metrics with the metallic theme"
- "Generate a product launch presentation with photo flow and KPI cards"
- "Build a startup pitch deck with timeline roadmap and testimonials"
- "Make a comparison slide showing us vs competitors with charts"

**Multi-Layout Decks:**
- "Create a complete marketing presentation with hero slide, KPI dashboard, testimonials, and call-to-action using the purple theme"
- "Generate a startup pitch deck combining hero, metrics breakdown, timeline roadmap, and testimonials with the green theme"
- "Build a product launch presentation with photo narrative, chart showcase, customer testimonials, and final call-to-action"
