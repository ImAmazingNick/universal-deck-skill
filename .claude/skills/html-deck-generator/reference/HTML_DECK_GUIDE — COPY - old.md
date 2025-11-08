# Enhanced HTML Deck Guide

This folder provides a structure for autogenerating professional HTML decks (presentations) about analytics, such as "Creative Performance Analysis". The setup is designed to guide an AI Agent in creating decks with a consistent, modern look matching our enhanced HTML dashboard styles and the creative performance demo patterns.

## Folder Structure

```
html-decks/
├── HTML_DECK_GUIDE.md          # This guide
├── blueprint/                  # Templates for deck structure and slides
│   ├── deck-template.html      # Enhanced main deck container
│   ├── cover-template.html     # Cover slide template
│   ├── slide-template.html     # Content slide template
│   ├── ending-template.html    # Ending slide template
│   ├── components/             # Enhanced reusable slide components
│   │   ├── slide-header.html   # Enhanced header with breadcrumbs and period
│   │   ├── slide-footer.html   # Enhanced footer with optional metadata
│   │   ├── kpi-stats.html      # KPI statistics grid component
│   │   └── creative-card.html  # Creative performance card component
│   └── layouts/                # Enhanced individual layout templates
│       ├── kpi-stats-slide.html           # KPI statistics with change indicators
│       ├── creative-cards-grid-slide.html # Grid of creative performance cards
│       ├── metrics-highlight-slide.html   # Chart + metrics side-by-side
│       ├── takeaways-slide.html           # Numbered insights with enhanced typography
│       ├── insights-comparison-slide.html # "What's Working" vs "What's Not Working"
│       ├── left-content-right-chart-slide.html # Enhanced left content, right chart
│       ├── dual-list-slide.html          # Enhanced dual-column comparison
│       └── [20+ more enhanced layout files...]
├── styles/                     # Enhanced CSS for consistent styling
│   └── html-decks-global.css   # Comprehensive design system
└── logic-and-data/            # Configurations and sample data
    ├── configs/               # Configuration files and layout catalog
    │   └── layout-catalog.json # Complete layout definitions
    └── sample-data/           # Sample data for testing
```

## How to Generate a Professional Deck

### 1. User Prompt Definition
The deck topic, content, and structure are defined by the user's prompt when requesting deck creation. The AI agent interprets the user's requirements to determine:
- Deck title and subtitle with enhanced typography
- Analysis period and scope with period indicators
- Key insights and data points with performance indicators
- Slide sequence and layout choices using enhanced templates
- Target audience and tone with modern design patterns

### 2. Enhanced Layout Selection
Based on the user's requirements, select appropriate layouts from the enhanced blueprint/layouts/ directory:
- Use enhanced `deck-template.html` for the main container
- Choose from enhanced layout templates for content slides
- Use modern component system for headers and footers
- Apply enhanced typography and styling patterns

### 3. Enhanced Component Integration
- Include enhanced header/footer components from `blueprint/components/`
- Use `{{INCLUDE:components/slide-header.html}}` and `{{INCLUDE:components/slide-footer.html}}` directives
- Apply enhanced KPI stats and creative card components where appropriate
- Use modern typography classes (`text--title--{size}`, `text--subtitle--{size}`, etc.)

### 4. Enhanced Content Population
- Fill layout placeholders with user-defined content
- Generate auto-insights for charts following voice & tone guidelines
- Apply enhanced data visualization best practices
- Use performance indicators and change indicators
- Include optional metadata and period displays

### 5. Enhanced Deck Assembly
- Combine slides into enhanced `deck-template.html`
- Include enhanced navigation with smooth animations
- Apply comprehensive global styles for consistency and elegance
- Ensure responsive design and mobile optimization

### 6. Output
Save the generated `deck.html` with professional presentation ready for use, matching the quality of creative-performance-demo.html

## Enhanced Deck Requirements

### Cover Slide
- First slide with introductory info (no header/footer)
- Enhanced title with `text--title--large` typography
- Enhanced subtitle with `text--subtitle--large` typography
- Optional metadata section with period, count, and date tags
- Modern cover content structure with header and body sections
- Clean, focused presentation with enhanced styling

### Summary Slide
- Executive summary with key overview using KPI stats component
- Provides context for the presentation with enhanced typography
- Includes analysis period and scope with period indicators
- Sets expectations for content with modern design patterns
- Uses enhanced header component with breadcrumbs and optional period

### Content Slides
- Enhanced header with breadcrumbs and optional period display
- Enhanced title and subtitle with modern typography classes
- Short, focused content with enhanced visual hierarchy
- Enhanced footer with optional metadata
- Card-based design with rounded corners and modern styling
- Performance indicators and change indicators where appropriate

## Key Insight Subtitles for Creative Performance Slides

### **CRITICAL: Generate Key Insight Subtitles (with Exceptions)**

For creative performance slides, AI agents **MUST** generate a `{{SLIDE_SUBTITLE}}` that provides:

#### **When to Add Subtitles:**
- **Grid layouts (1-3 creatives)**: Always include key insight subtitles
- **Table layouts (4-6 creatives)**: Include key insight subtitles
- **Small comparison slides**: Include key insight subtitles

#### **When NOT to Add Subtitles:**
- **Table layouts with 5+ elements**: These slides should be data-focused without descriptive text
- **Large data tables**: When the table contains many rows, focus on the data presentation
- **Complex metric displays**: When the slide is primarily about data visualization

#### **Required Elements:**
1. **Performance Overview**: Brief summary of overall creative performance
2. **Pattern Recognition**: Key patterns or trends observed in the data
3. **Variation Analysis**: Notable differences between top and bottom performers
4. **Optimization Opportunities**: Actionable insights for improvement

#### **Example Subtitle Patterns:**
- **Top Performers**: "Our creative portfolio delivered strong performance across key metrics, with significant variations in effectiveness. Top performers achieved exceptional ROAS while highlighting optimization opportunities."
- **Bottom Performers**: "Underperforming creatives show clear patterns of low engagement and conversion rates. Key issues include generic messaging and poor visual hierarchy, presenting clear optimization opportunities."
- **Mixed Performance**: "Creative performance varies significantly across our portfolio, with top performers achieving 3x better ROAS than underperformers. Seasonal relevance and visual quality emerge as key success factors."

#### **Voice & Tone Guidelines:**
- **Concise**: 1-2 sentences maximum
- **Analytical**: Focus on patterns and insights, not just numbers
- **Actionable**: Include optimization opportunities or recommendations
- **Professional**: Use business language, avoid hype or panic

### **Implementation:**
- **Template Support**: Both `creative-cards-grid-slide` and `creative-list-table-slide` templates include `{{#if SLIDE_SUBTITLE}}` conditional rendering
- **Styling**: Subtitles use `text--subtitle text--subtitle--medium` classes for consistent typography
- **Placement**: Appears between slide title and content area

## Auto-Insight System

Every chart in the system includes an auto-insight feature that provides AI-generated analysis:

### Auto-Insight Features
- **20-word limit**: Concise, actionable insights
- **Elegant styling**: Italic text with light background and left border
- **Voice & tone compliance**: Follows marketing analytics guidelines
- **Automatic validation**: Checks for forbidden words and length limits
- **Formula-based generation**: [Metric] [delta] [driver] [impact] [timeframe]

### Example Insights
- "Revenue +23% after holiday campaigns in Q4 vs Q3 baseline"
- "CTR +0.3pp after creative refresh in last 7 days"
- "ROAS exceeds target by 0.8x on average"

## Voice & Tone Guide

The system includes machine-readable rules for consistent, professional copy:

### Voice Attributes
- **Concise**: ≤12 words per heading, ≤25 per bullet
- **Active**: "Campaigns drove +32% ROAS" not "ROAS was increased"
- **Evidence-first**: Lead with the delta, then the context
- **Neutral-positive**: Celebrate wins without hype; flag risks without panic
- **Consistent**: Same rounding, same units, same tense across deck

### Number Rules
- Round to one meaningful decimal (3.4%, 1.8×)
- Use k, M, B for thousands, millions, billions
- Include signs for deltas (+, −)
- Use pp for percentage point comparisons

### Forbidden Words
Avoid: "very", "huge", "amazing", "skyrocket", "terrible", "stuff", "things", "etc"

## Layout Catalog

The system now includes a comprehensive layout catalog with 23 different slide layouts. See `logic-and-data/configs/layout-catalog.json` for the complete catalog with data contracts, use cases, and examples.

## Layout Selection Guidelines

### **CRITICAL: Choose Layouts Based on Content Quantity**

When selecting layouts, AI agents must consider the number of elements to display:

#### **For Creative Performance Cards:**
- **1-3 Creatives**: Use `creative-cards-grid-slide` (optimal visual layout)
- **4-6 Creatives**: Use `creative-list-table-slide` (table format for better readability)
- **7+ Creatives**: Use `creative-list-table-slide` with pagination or split into multiple slides
- **⚠️ CRITICAL**: **ALWAYS generate a `{{SLIDE_SUBTITLE}}` with key insights about performance patterns and optimization opportunities**
- **⚠️ EXCEPTION**: **DO NOT add subtitles for table layouts with 5+ elements** - these slides should be data-focused without descriptive text

#### **For Comparison Slides:**
- **3-5 items per side**: Use `dual-list-slide` (side-by-side comparison)
- **6+ items per side**: Use `dual-list-table-slide` (table format)
- **Mixed quantities**: Use `insights-comparison-slide` (flexible content blocks)
- **Insights with big numbers**: Use `working-not-working-table-slide` (table format with metrics)

#### **For Data Lists:**
- **1-3 items**: Use card-based layouts
- **4-10 items**: Use table layouts
- **10+ items**: Use paginated table layouts

#### **For Metrics Display:**
- **4 metrics**: Use `kpi-stats-slide` (4-column grid)
- **6-8 metrics**: Use `metrics-highlight-slide` (chart + metrics side-by-side)
- **9+ metrics**: Use table layout

### **Layout Selection Decision Tree:**
```
Content Type → Number of Items → Recommended Layout
├── Creatives (1-3) → creative-cards-grid-slide
├── Creatives (4-6) → creative-list-table-slide  
├── Creatives (7+) → creative-list-table-slide (paginated)
├── Comparison (3-5 each) → dual-list-slide
├── Comparison (6+ each) → dual-list-table-slide
├── Insights with big numbers → working-not-working-table-slide
├── Metrics (4) → kpi-stats-slide
├── Metrics (6-8) → metrics-highlight-slide
└── Metrics (9+) → metrics-table-slide
```

## Enhanced Available Slide Layouts

The system supports 25+ enhanced content slide layouts for maximum flexibility and professional presentation:

### Enhanced Data Display Layouts

#### 1. KPI Stats Slide (`kpi-stats-slide`)
- **Use Case**: Display key performance indicators with change indicators
- **Features**: 4-column KPI grid with change indicators, responsive design
- **Data Contract**: `{{KPI_1_VALUE}}` through `{{KPI_4_VALUE}}`, `{{KPI_1_LABEL}}` through `{{KPI_4_LABEL}}`, `{{KPI_1_CHANGE}}` through `{{KPI_4_CHANGE}}`, `{{KPI_1_CHANGE_TYPE}}` through `{{KPI_4_CHANGE_TYPE}}`

#### 2. Creative Cards Grid (`creative-cards-grid-slide`)
- **Use Case**: Display creative performance cards in a grid layout
- **Features**: Grid layout for creative performance cards, **OPTIMAL FOR 3 CARDS MAXIMUM**
- **Layout Selection**: Use this layout for 1-3 creative cards only
- **Key Insight Subtitle**: **ALWAYS generate a `{{SLIDE_SUBTITLE}}` with key insights about the creative performance patterns, variations, and optimization opportunities**
- **Data Contract**: `{{SLIDE_TITLE}}`, `{{SLIDE_SUBTITLE}}` (key insights), `{{CREATIVE_IMAGE_URL}}`, `{{CREATIVE_RANK}}`, `{{CREATIVE_TITLE}}`, `{{CREATIVE_ROAS}}`, `{{CREATIVE_CTR}}`, `{{CREATIVE_CLICKS}}`, `{{CREATIVE_CPC}}`, `{{CREATIVE_SPEND}}`, `{{PERFORMANCE_CLASS}}`, `{{PERFORMANCE_LABEL}}`

#### 3. Creative List Table (`creative-list-table-slide`)
- **Use Case**: Display 4+ creative performance items in a table format
- **Features**: Table layout for creative performance items, **OPTIMAL FOR 4-10 CREATIVES**
- **Layout Selection**: Use this layout for 4+ creative items (better readability than cards)
- **Key Insight Subtitle**: **Generate `{{SLIDE_SUBTITLE}}` for 4-6 creatives, but DO NOT add subtitles for 5+ elements** - these should be data-focused
- **Data Contract**: `{{SLIDE_TITLE}}`, `{{SLIDE_SUBTITLE}}` (optional, for 4-6 creatives only), `{{CREATIVE_1_RANK}}` through `{{CREATIVE_6_RANK}}`, `{{CREATIVE_1_IMAGE_URL}}` through `{{CREATIVE_6_IMAGE_URL}}`, `{{CREATIVE_1_TITLE}}` through `{{CREATIVE_6_TITLE}}`, `{{CREATIVE_1_ROAS}}` through `{{CREATIVE_6_ROAS}}`, `{{CREATIVE_1_CTR}}` through `{{CREATIVE_6_CTR}}`, `{{CREATIVE_1_CLICKS}}` through `{{CREATIVE_6_CLICKS}}`, `{{CREATIVE_1_CPC}}` through `{{CREATIVE_6_CPC}}`, `{{CREATIVE_1_SPEND}}` through `{{CREATIVE_6_SPEND}}`, `{{CREATIVE_1_PERFORMANCE_CLASS}}` through `{{CREATIVE_6_PERFORMANCE_CLASS}}`, `{{CREATIVE_1_PERFORMANCE_LABEL}}` through `{{CREATIVE_6_PERFORMANCE_LABEL}}`

#### 4. Metrics Highlight (`metrics-highlight-slide`)
- **Use Case**: Chart + metrics side-by-side layout
- **Features**: Left column for chart/image, right column for key metrics
- **Data Contract**: `{{CHART_ID}}` or `{{IMAGE_URL}}`, `{{METRIC_1_VALUE}}` through `{{METRIC_4_VALUE}}`, `{{METRIC_1_LABEL}}` through `{{METRIC_4_LABEL}}`

#### 5. Takeaways (`takeaways-slide`)
- **Use Case**: Numbered insights with enhanced typography
- **Features**: Large numbered insights, enhanced visual hierarchy, supports up to 5 takeaways
- **Data Contract**: `{{TAKEAWAY_1_TITLE}}` through `{{TAKEAWAY_5_TITLE}}`, `{{TAKEAWAY_1_DESCRIPTION}}` through `{{TAKEAWAY_5_DESCRIPTION}}`

#### 6. Insights Comparison (`insights-comparison-slide`)
- **Use Case**: "What's Working" vs "What's Not Working" comparison
- **Features**: Enhanced visual design with icons and gradients, supports up to 5 insights per column
- **Data Contract**: `{{LEFT_TITLE}}`, `{{LEFT_ICON_1}}` through `{{LEFT_ICON_5}}`, `{{LEFT_INSIGHT_1_TITLE}}` through `{{LEFT_INSIGHT_5_TITLE}}`, `{{LEFT_INSIGHT_1_DESCRIPTION}}` through `{{LEFT_INSIGHT_5_DESCRIPTION}}`, `{{LEFT_INSIGHT_1_METRIC}}` through `{{LEFT_INSIGHT_5_METRIC}}`, similar for right column

#### 7. Working vs Not Working Table (`working-not-working-table-slide`)
- **Use Case**: "What's Working" vs "What's Not Working" comparison in table format with descriptions
- **Features**: Table layout with large titles, detailed descriptions, and affected metrics, supports up to 5 insights per column
- **Layout Selection**: Use for comparing insights with detailed explanations and affected metrics
- **Data Contract**: `{{LEFT_TITLE}}`, `{{LEFT_INSIGHT_1_TITLE}}` through `{{LEFT_INSIGHT_5_TITLE}}`, `{{LEFT_INSIGHT_1_DESCRIPTION}}` through `{{LEFT_INSIGHT_5_DESCRIPTION}}`, `{{LEFT_INSIGHT_1_METRIC}}` through `{{LEFT_INSIGHT_5_METRIC}}`, similar for right column

### Enhanced Chart Layouts

#### 8. Enhanced Left Content Right Chart (`left-content-right-chart-slide`)
- **Use Case**: Left content, right chart (50% each) with enhanced typography
- **Features**: Enhanced typography classes, better conditional rendering, improved chart/image handling
- **Data Contract**: `{{SLIDE_TITLE}}`, `{{SLIDE_SUBTITLE}}`, `{{BULLET_POINT_1}}` through `{{BULLET_POINT_3}}`, `{{CHART_ID}}` or `{{IMAGE_URL}}`, `{{CHART_INSIGHT}}`

#### 9. Enhanced Dual List (`dual-list-slide`)
- **Use Case**: Enhanced dual-column comparison with metrics
- **Features**: Enhanced dual-column comparison with better visual hierarchy
- **Layout Selection**: Use for comparing two groups of 3-5 items each
- **Data Contract**: `{{LEFT_TITLE}}`, `{{LEFT_SUBTITLE}}`, `{{LEFT_PERFORMER_1_LABEL}}` through `{{LEFT_PERFORMER_5_LABEL}}`, `{{LEFT_SPEND_1_VALUE}}` through `{{LEFT_SPEND_5_VALUE}}`, `{{LEFT_CONV_1_VALUE}}` through `{{LEFT_CONV_5_VALUE}}`, `{{LEFT_CTR_1_VALUE}}` through `{{LEFT_CTR_5_VALUE}}`, `{{LEFT_ROAS_1_VALUE}}` through `{{LEFT_ROAS_5_VALUE}}`, similar for right column

### Legacy Layouts (Enhanced)
All existing layouts have been enhanced with modern typography and styling:

#### 9. Single Chart Focus (`single-chart`)
- **Use Case**: Deep dive analysis of a single metric or trend
- **Features**: Large chart with insights panel, enhanced styling
- **Chart Types**: bar, line, pie, doughnut, radar

#### 10. Dual Chart Comparison (`dual-chart`)
- **Use Case**: Comparing two related metrics or time periods
- **Features**: Two charts side by side for comparison, enhanced styling
- **Chart Types**: bar, line, pie, doughnut

#### 11. Quad Chart Dashboard (`quad-chart`)
- **Use Case**: Dashboard overview with multiple KPIs
- **Features**: Four small charts in a grid layout, enhanced styling
- **Chart Types**: bar, line, pie, doughnut

#### 12. Six Block Content (`six-block`)
- **Use Case**: Feature overview, benefits, or key points
- **Features**: Six content blocks in a grid layout, enhanced styling
- **Content**: Icons, titles, and descriptions

#### 13. Pros and Cons Analysis (`pros-cons`)
- **Use Case**: Analysis, evaluation, or decision-making support
- **Features**: Two-column layout for positive and negative aspects, enhanced styling
- **Content**: Structured lists with visual indicators

#### 14. Metrics Comparison (`metrics-comparison`)
- **Use Case**: Performance comparison across multiple metrics
- **Features**: Four metric cards with comparison chart, enhanced styling
- **Content**: Icons, values, and change indicators

#### 15. Timeline (`timeline`)
- **Use Case**: Project milestones, campaign timeline, or historical events
- **Features**: Vertical timeline with events and dates, enhanced styling
- **Content**: Chronological events with descriptions

#### 16. Full Width Chart (`full-width-chart`)
- **Use Case**: Detailed data visualization with multiple data series
- **Features**: Large chart occupying most of the slide width, enhanced styling
- **Chart Types**: bar, line, area, scatter

#### 17. KPI Naked (`kpi-naked`)
- **Use Case**: Opening a section or revealing a final result
- **Features**: One hero metric with giant font and micro-trend arrow, enhanced styling
- **Data Contract**: headline (≤8 words), value, trend (up/down/flat), delta

#### 18. Creative Inspector (`creative-inspector`)
- **Use Case**: Deep-diving into a single ad, video, or email
- **Features**: Left 60% creative thumbnail, right 40% mini KPI panel, enhanced styling
- **Data Contract**: thumbUrl, ctr, cpm, roas, insight (≤20 words)

#### 19. Top 3 Creatives (`top-3-creatives`)
- **Use Case**: Quick ranking by ROAS, spend, or CTR (3 items maximum)
- **Features**: 3 large cards with full-width images and detailed metrics, enhanced styling
- **Data Contract**: creatives (array of 3 objects with id, imageUrl, title, roas, ctr, spend, performanceLabel)

#### 20. Funnel 3-Step (`funnel-3-step`)
- **Use Case**: Classic funnel drop-off story
- **Features**: Vertical funnel Impressions → Clicks → Conversions, enhanced styling
- **Data Contract**: steps (array of 3 objects with name, value, rate)

#### 21. A/B 2x2 (`ab-2x2`)
- **Use Case**: A/B test summary
- **Features**: Variant A vs. B across two KPIs (2×2 grid), enhanced styling
- **Data Contract**: kpi1, kpi2, aValue1, aValue2, bValue1, bValue2, winner

#### 22. Story End CTA (`story-end-cta`)
- **Use Case**: Final slide of deck
- **Features**: Full-bleed dark slide with single CTA, enhanced styling
- **Data Contract**: headline (≤8 words), ctaText (≤4 words), ctaUrl

#### 23. Three Card Layout (`three-card`)
- **Use Case**: Showcasing products, services, or key concepts
- **Features**: Three large cards with images and descriptions, enhanced styling
- **Data Contract**: slideTitle, slideSubtitle, card1Image, card1Title, card1Description, card2Image, card2Title, card2Description, card3Image, card3Title, card3Description

#### 24. Five Card Layout (`five-card`)
- **Use Case**: Comparing multiple options or showcasing portfolio items
- **Features**: Five compact cards with images and descriptions, enhanced styling
- **Data Contract**: slideTitle, slideSubtitle, card1Image through card5Image, card1Title through card5Title, card1Description through card5Description

#### 25. Split Content Layout (`split-content`)
- **Use Case**: Data-driven insights with supporting narrative
- **Features**: Left side with title, subtitle, and bullet points, right side with chart, enhanced styling
- **Data Contract**: slideTitle, slideSubtitle, bullet1 through bullet4, chartId, chartInsight

### Enhanced Recap Slide
- Key insights and recommendations with enhanced typography
- Bullet-point format for easy scanning with modern styling
- Actionable takeaways with performance indicators
- Strategic recommendations with enhanced visual hierarchy
- Uses enhanced header component with breadcrumbs

### Enhanced Ending Slide
- Final slide with conclusion (no header/footer)
- Enhanced title with `text--title--large` typography
- Enhanced subtitle with `text--subtitle--large` typography
- Optional ending message and metadata
- Clean, professional closing with modern design patterns

### Enhanced Navigation
- **Enhanced Navigation - Elegant Background Style**
- Left/right arrow buttons for slide navigation
- Center dot indicators for direct slide access
- Right-side slide counter showing current position
- Smooth transitions and hover effects
- Keyboard navigation support (arrow keys, spacebar)
- Touch/swipe support for mobile devices
- **SlideManager** object for optimized slide management
- Enhanced animations with fade effects and scaling

### Enhanced Content Slides
- Enhanced header with breadcrumbs and optional period display
- Enhanced title and subtitle with modern typography classes
- Short, focused content with enhanced visual hierarchy
- Card-based design with rounded corners and modern styling
- Performance indicators and change indicators where appropriate

### Enhanced Design Standards
- Slides are cards with rounded corners and modern shadows
- Enhanced styling matching creative performance demo
- Comprehensive typography system with semantic classes
- Consistent color scheme and spacing
- Responsive design for different screen sizes
- Smooth animations and transitions
- Performance indicators with color coding
- Modern visual hierarchy and layout patterns

## Enhanced Blueprint Templates

### Core Templates
- **`deck-template.html`**: Enhanced main container with navigation, Chart.js integration, and smooth animations
- **`cover-template.html`**: Enhanced cover slide with title, subtitle, and deck metadata
- **`slide-template.html`**: Enhanced base content slide with header/footer placeholders
- **`ending-template.html`**: Enhanced final slide with CTA and restart functionality

### Enhanced Component System
- **`components/slide-header.html`**: Enhanced header with breadcrumbs and optional period display
- **`components/slide-footer.html`**: Enhanced footer with optional metadata
- **`components/kpi-stats.html`**: KPI statistics grid component with change indicators
- **`components/creative-card.html`**: Creative performance card component with metrics and indicators

### Enhanced Layout Templates
25+ enhanced specialized layouts in `blueprint/layouts/` including:
- **Enhanced Data Display**: KPI stats, creative cards grid, metrics highlight, takeaways, insights comparison
- **Enhanced Chart Layouts**: Left content right chart, dual list comparison
- **Legacy Enhanced**: All existing layouts with modern typography and styling
- **Data visualization layouts**: Charts, metrics, funnels with enhanced styling
- **Content layouts**: Cards, blocks, timelines with modern design
- **Analysis layouts**: A/B tests, pros/cons, comparisons with enhanced visual hierarchy

## Critical Implementation Rules

### ❌ Common Mistakes to Avoid
- **NO FOOTERS** in content slides - only use in cover/ending slides
- **NO custom KPI structures** - always use `kpi-stats` component pattern
- **NO complex breadcrumb spans** - use simple text: `"Analysis / Section"`
- **NO custom navigation** - always use enhanced navigation with SlideManager
- **NO custom takeaway containers** - use `list-layout-container` with table structure
- **NO custom ending slide classes** - use `cover-content` structure
- **ALWAYS match reference deck patterns** - use `creative-performance-demo.html` as etalon

### ✅ Required Patterns
- **Headers**: Simple breadcrumbs with `header-period` (not `period-indicator`)
- **KPI Stats**: Use `kpi-stats` with `kpi-stat` items (not `kpi-stats-grid`)
- **Navigation**: Enhanced navigation with `SlideManager` object
- **Key Takeaways**: Table structure with inline color styles
- **Insights**: White background with border styling
- **Ending Slides**: Use `ending-slide` class with `cover-content` structure (dark background like cover slide)

## Enhanced Template Usage

### Cover Slide
```html
<!-- Use enhanced cover structure with modern typography -->
{{COVER_TITLE}} - Main presentation title with text--title--large
{{COVER_SUBTITLE}} - Supporting subtitle with text--subtitle--large
{{COVER_META}} - Optional metadata with period, count, and date tags
```

### Summary Slide
```html
<!-- Use enhanced summary with KPI stats component -->
{{SUMMARY_TITLE}} - Summary title with text--title--medium
{{SUMMARY_SUBTITLE}} - Optional subtitle with text--subtitle--medium
{{SUMMARY_CONTENT}} - Content using KPI stats component
{{INCLUDE:components/slide-header.html}} - Enhanced header
{{INCLUDE:components/slide-footer.html}} - Enhanced footer
```

### Content Slides
```html
<!-- Use enhanced layout templates with component includes -->
{{INCLUDE:components/slide-header.html}} - Enhanced header with breadcrumbs
<!-- Layout-specific content with enhanced typography -->
{{INCLUDE:components/slide-footer.html}} - Enhanced footer with metadata
```

### Enhanced Component Usage
```html
<!-- KPI Stats Component -->
{{INCLUDE:components/kpi-stats.html}}
<!-- Variables: KPI_1_VALUE through KPI_4_VALUE, KPI_1_LABEL through KPI_4_LABEL, KPI_1_CHANGE through KPI_4_CHANGE, KPI_1_CHANGE_TYPE through KPI_4_CHANGE_TYPE -->

<!-- Creative Card Component -->
{{INCLUDE:components/creative-card.html}}
<!-- Variables: CREATIVE_IMAGE_URL, CREATIVE_RANK, CREATIVE_TITLE, CREATIVE_ROAS, CREATIVE_CTR, CREATIVE_CLICKS, CREATIVE_CPC, CREATIVE_SPEND, PERFORMANCE_CLASS, PERFORMANCE_LABEL -->

<!-- IMPORTANT: Content slides should NOT include footers -->
```

### Quick Reference - Required Patterns
```html
<!-- Header Pattern -->
<div class="slide-header">
    <div class="breadcrumbs">Analysis Name / Section</div>
    <div class="header-period">Q4 2024</div>
</div>

<!-- KPI Stats Pattern -->
<div class="kpi-stats">
    <div class="kpi-stat">
        <div class="kpi-stat-number text--number text--number--medium">4.2x</div>
        <div class="kpi-stat-label text--label text--label--medium">Average ROAS</div>
        <div class="kpi-stat-change positive">+0.8x vs Q3</div>
    </div>
</div>

<!-- Navigation Pattern -->
<div class="navigation">
    <div class="nav-container">
        <div class="nav-arrows">
            <button class="nav-button prev-btn" onclick="previousSlide()"><span>←</span></button>
            <button class="nav-button next-btn" onclick="nextSlide()"><span>→</span></button>
        </div>
        <div class="dot-indicators">...</div>
        <div class="slide-counter-pill"><span id="current-slide">1</span> of <span id="total-slides">7</span></div>
    </div>
</div>

<!-- Key Takeaways Pattern -->
<div class="list-layout-container">
    <table class="list-table">
        <tbody>
            <tr>
                <td><div class="takeaway-number text--number text--number--huge" style="color: var(--primary-color);">01</div></td>
                <td><div class="takeaway-content">...</div></td>
            </tr>
        </tbody>
    </table>
</div>

<!-- Ending Slide Pattern -->
<div class="slide-card ending-slide">
    <div class="slide-content">
        <div class="cover-content">
            <div class="cover-header">
                <h1 class="cover-title text--title text--title--large">Thank You</h1>
                <p class="cover-subtitle text--subtitle text--subtitle--large">Summary message...</p>
            </div>
            <div class="cover-body">
                <div class="ending-message">...</div>
                <div class="cover-meta">
                    <div class="meta-tag tag-period">Q4 2024</div>
                    <div class="meta-tag tag-count">25 Creatives</div>
                    <div class="meta-tag tag-date">Jan 15, 2025</div>
                </div>
            </div>
        </div>
    </div>
</div>
```
```

### Ending Slide
```html
<!-- Use enhanced ending structure with modern typography -->
{{ENDING_TITLE}} - Final slide title with text--title--large
{{ENDING_SUBTITLE}} - Supporting subtitle with text--subtitle--large
{{ENDING_MESSAGE}} - Optional closing message
{{ENDING_META}} - Optional metadata
```

## Enhanced AI Agent Instructions

1. **Interpret User Prompt**: Analyze the user's deck request to determine:
   - Topic, scope, and key insights with performance indicators
   - Target audience and presentation goals with modern design patterns
   - Data requirements and visualization needs with enhanced styling
   - Slide sequence and layout preferences using enhanced templates

2. **Select Enhanced Layouts**: Choose appropriate templates from enhanced `blueprint/layouts/`:
   - Cover slide using enhanced `deck-template.html` structure
   - Content slides using enhanced layout templates with modern typography
   - Ending slide using enhanced ending structure
   - **CRITICAL**: Follow layout selection guidelines based on content quantity:
     - **1-3 Creatives**: Use `creative-cards-grid-slide`
     - **4+ Creatives**: Use `creative-list-table-slide`
     - **4 Metrics**: Use `kpi-stats-slide`
     - **6-8 Metrics**: Use `metrics-highlight-slide`
     - **3-5 items per side**: Use `dual-list-slide`
     - **6+ items per side**: Use `dual-list-table-slide`
   - Use new enhanced layouts: KPI stats, creative cards grid, creative list table, metrics highlight, takeaways, insights comparison

3. **Integrate Enhanced Components**: Use enhanced header/footer system:
   - Include `{{INCLUDE:components/slide-header.html}}` and `{{INCLUDE:components/slide-footer.html}}`
   - Use `{{INCLUDE:components/kpi-stats.html}}` for KPI displays
   - Use `{{INCLUDE:components/creative-card.html}}` for creative performance
   - Maintain consistent navigation and enhanced styling

4. **Populate Enhanced Content**: Fill templates with user-defined content:
   - Generate auto-insights for charts (≤20 words)
   - Apply enhanced voice & tone guidelines
   - Use modern typography classes (`text--title--{size}`, `text--subtitle--{size}`, etc.)
   - Include performance indicators and change indicators
   - Add optional metadata and period displays

5. **Validate & Assemble**: 
   - Check all content against enhanced guidelines
   - Combine slides into enhanced `deck-template.html`
   - Include Chart.js and enhanced navigation functionality
   - Apply comprehensive global styles for consistency
   - Ensure responsive design and mobile optimization

6. **Output**: Generate professional `deck.html` ready for presentation, matching the quality of creative-performance-demo.html

7. **Validation Checklist**: Before finalizing any HTML deck, verify:
   - **Structure Validation**:
     - **NO footers** in content slides (only cover/ending slides)
     - **Header pattern** uses simple breadcrumbs: `"Topic / Section"`
     - **KPI stats** use `kpi-stats` container with `kpi-stat` elements
     - **Navigation** uses `SlideManager` with enhanced animations
     - **Key takeaways** use `list-layout-container` with `list-table` structure
     - **Insight columns** have white background with border styling
     - **Ending slide** uses `ending-slide` class for dark purple gradient background
     - **Cover slide** uses `slide:first-child` styling with purple gradient
   - **Reference Validation**:
     - **Matches `creative-performance-demo.html`** patterns exactly
     - **Uses established CSS classes** (text--title--large, text--subtitle--large, etc.)
     - **Follows component structure** from reference deck
     - **Implements proper animations** with `requestAnimationFrame`
     - **Uses correct meta tag structure** (tag-period, tag-count, tag-date)
   - **Content Validation**:
     - **Consistent typography** with semantic classes
     - **Proper color coding** for performance indicators
     - **Responsive design** for different screen sizes
     - **Accessible navigation** with keyboard/touch support
     - **Ending slide message** is simple paragraph (NO bullet lists)
     - **Meta tags** match reference deck format and content

1. **Interpret User Prompt**: Analyze the user's deck request to determine:
   - Topic, scope, and key insights with performance indicators
   - Target audience and presentation goals with modern design patterns
   - Data requirements and visualization needs with enhanced styling
   - Slide sequence and layout preferences using enhanced templates

2. **Select Enhanced Layouts**: Choose appropriate templates from enhanced `blueprint/layouts/`:
   - Cover slide using enhanced `deck-template.html` structure
   - Content slides using enhanced layout templates with modern typography
   - Ending slide using enhanced ending structure
   - **CRITICAL**: Follow layout selection guidelines based on content quantity:
     - **1-3 Creatives**: Use `creative-cards-grid-slide`
     - **4+ Creatives**: Use `creative-list-table-slide`
     - **4 Metrics**: Use `kpi-stats-slide`
     - **6-8 Metrics**: Use `metrics-highlight-slide`
     - **3-5 items per side**: Use `dual-list-slide`
     - **6+ items per side**: Use `dual-list-table-slide`
   - Use new enhanced layouts: KPI stats, creative cards grid, creative list table, metrics highlight, takeaways, insights comparison

3. **Integrate Enhanced Components**: Use enhanced header/footer system:
   - Include `{{INCLUDE:components/slide-header.html}}` and `{{INCLUDE:components/slide-footer.html}}`
   - Use `{{INCLUDE:components/kpi-stats.html}}` for KPI displays
   - Use `{{INCLUDE:components/creative-card.html}}` for creative performance
   - Maintain consistent navigation and enhanced styling

4. **Populate Enhanced Content**: Fill templates with user-defined content:
   - Generate auto-insights for charts (≤20 words)
   - Apply enhanced voice & tone guidelines
   - Use modern typography classes (`text--title--{size}`, `text--subtitle--{size}`, etc.)
   - Include performance indicators and change indicators
   - Add optional metadata and period displays

5. **Validate & Assemble**: 
   - Check all content against enhanced guidelines
   - Combine slides into enhanced `deck-template.html`
   - Include Chart.js and enhanced navigation functionality
   - Apply comprehensive global styles for consistency
   - Ensure responsive design and mobile optimization

6. **Output**: Generate professional `deck.html` ready for presentation, matching the quality of creative-performance-demo.html

## Enhanced Best Practices

- Keep content concise and focused with enhanced typography
- Use consistent visual hierarchy with modern design patterns
- Ensure accessibility with proper contrast and semantic structure
- Test navigation on different devices with responsive design
- Maintain brand consistency across all slides with enhanced styling
- Use data visualization when appropriate with performance indicators
- Include proper meta tags and SEO elements
- Use enhanced typography system for better readability
- Apply performance indicators and change indicators consistently
- Include optional metadata and period displays where relevant
- Use modern card-based design with rounded corners and shadows
- Ensure smooth animations and transitions for better UX
- Apply color-coded performance indicators for data interpretation
- Use enhanced component system for consistency and maintainability

## Enhanced Content Fitting Guidelines

### Slide Content Constraints
- **Maximum Content Width**: 90vw (90% of viewport width)
- **Maximum Content Height**: 90vh (90% of viewport height)
- **Chart Maximum Height**: 300px (desktop), 200px (tablet), 150px (mobile)
- **Metrics Grid**: Minimum 150px per card (desktop), 120px (tablet), 100px (mobile)
- **KPI Stats Grid**: 4-column layout with responsive breakpoints
- **Creative Cards Grid**: Flexible grid with responsive image sizing

### Enhanced Content Overflow Handling
- **Automatic Scaling**: Charts and images scale to fit available space
- **Scroll Areas**: Long content gets scrollable containers with modern styling
- **Responsive Grids**: Metrics grid adapts to screen size with enhanced styling
- **Text Truncation**: Long text gets ellipsis when necessary
- **Performance Indicators**: Color-coded indicators scale appropriately
- **Typography Scaling**: Responsive font sizing with clamp() functions

### Enhanced Data Visualization Best Practices
- **Chart Sizing**: Use responsive canvas with max-height constraints and enhanced styling
- **Table Overflow**: Horizontal scroll for wide tables with modern styling
- **Metric Cards**: Compact design with essential information and performance indicators
- **Progress Bars**: Scale to container width with enhanced visual feedback
- **KPI Stats**: 4-column grid with change indicators and color coding
- **Creative Cards**: Image containers with rank overlays and comprehensive metrics

### Enhanced Mobile Optimization
- **Reduced Padding**: Smaller margins and padding on mobile with enhanced spacing
- **Responsive Typography**: Appropriate font sizes for small screens using clamp()
- **Touch Targets**: Minimum 44px for interactive elements with enhanced hover states
- **Simplified Layout**: Stack elements vertically on mobile with enhanced styling
- **Enhanced Navigation**: Touch-friendly navigation with swipe support
- **Performance Indicators**: Color-coded indicators that work well on mobile
- **Creative Cards**: Responsive image sizing and metric display for mobile

## Enhanced Typography System

### Typography Classes
The system uses a comprehensive typography system with semantic classes:

#### Title Variants
- `text--title--large` - Large titles for cover and ending slides
- `text--title--medium` - Medium titles for content slides
- `text--title--small` - Small titles for subsections

#### Subtitle Variants
- `text--subtitle--large` - Large subtitles for cover and ending slides
- `text--subtitle--medium` - Medium subtitles for content slides
- `text--subtitle--small` - Small subtitles for details

#### Number Variants
- `text--number--huge` - Huge numbers for takeaways
- `text--number--large` - Large numbers for KPIs
- `text--number--medium` - Medium numbers for metrics
- `text--number--small` - Small numbers for details
- `text--number--tiny` - Tiny numbers for creative cards

#### Label and Description Variants
- `text--label--medium` - Medium labels for KPI stats
- `text--label--small` - Small labels for details
- `text--description--large` - Large descriptions
- `text--description--medium` - Medium descriptions
- `text--description--small` - Small descriptions

### Performance Indicators
The system includes color-coded performance indicators:

#### Performance Classes
- `performance-good` - Green styling for good performance
- `performance-bad` - Red styling for poor performance

#### Change Indicators
- `positive` - Green styling for positive changes
- `negative` - Red styling for negative changes
- `neutral` - Gray styling for neutral changes

### Design Patterns
The system follows modern design patterns from the creative performance demo:

#### Card Design
- Rounded corners with modern shadows
- Consistent spacing and padding
- Enhanced visual hierarchy
- Responsive grid layouts

#### Navigation
- Smooth animations and transitions
- Enhanced hover states
- Touch-friendly controls
- Keyboard navigation support

#### Data Visualization
- Color-coded performance indicators
- Change indicators with visual feedback
- Responsive chart sizing
- Enhanced table styling

## Reference Implementation

For the best example of how to use this enhanced system, refer to `creative-performance-demo.html` which demonstrates:

- Enhanced cover slide with metadata
- KPI stats slide with change indicators
- Creative cards grid with performance metrics
- Metrics highlight slide with chart and metrics
- Takeaways slide with numbered insights
- Insights comparison slide with "What's Working" vs "What's Not Working"
- Enhanced navigation with smooth animations
- Comprehensive typography system usage
- Performance indicators and color coding
- Responsive design and mobile optimization 