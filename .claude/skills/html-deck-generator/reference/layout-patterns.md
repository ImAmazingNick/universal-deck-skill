# Advanced HTML Deck Layout Patterns

This document provides detailed examples of the advanced layout patterns extracted from performance analysis decks like the xAI Creative Performance Analysis.

## Cover Slide Layout

```html
<div class="slide" id="slide-1">
    <div class="slide-card">
        <div class="slide-content">
            <div class="cover-content">
                <div class="cover-logo">
                    <svg width="120" height="40" viewBox="0 0 120 40">
                        <!-- Logo SVG content -->
                    </svg>
                </div>
                <div class="cover-header">
                    <h1 class="cover-title text--title text--title--large">Presentation Title</h1>
                    <p class="cover-subtitle text--subtitle text--subtitle--large">Comprehensive subtitle with key context and value proposition.</p>
                </div>
                <div class="cover-body">
                    <div class="cover-meta">
                        <div class="meta-tag">Q4 2024</div>
                        <div class="meta-tag">Key Metric</div>
                        <div class="meta-tag">Date</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

## KPI Dashboard Layout

```html
<div class="slide">
    <div class="slide-header">
        <div class="header-logo"><!-- Logo --></div>
        <div class="breadcrumbs">Section / Sub-section</div>
        <div class="header-period">Q4 2024</div>
    </div>
    <div class="slide-content">
        <div class="slide-title">Key Performance Overview</div>
        <div class="slide-subtitle">Performance summary and context</div>
        <div class="summary-content">
            <div class="kpi-stats">
                <div class="kpi-stat">
                    <div class="kpi-stat-number">8.7x</div>
                    <div class="kpi-stat-label">Average ROAS</div>
                    <div class="kpi-stat-change positive">+2.1x vs Q3</div>
                </div>
                <div class="kpi-stat">
                    <div class="kpi-stat-number">6.3%</div>
                    <div class="kpi-stat-label">Average CTR</div>
                    <div class="kpi-stat-change positive">+2.1% vs Q3</div>
                </div>
                <!-- Additional KPI cards -->
            </div>
        </div>
    </div>
</div>
```

## Image Card Grid Layout

```html
<div class="slide">
    <div class="slide-content">
        <div class="slide-title">Portfolio Showcase</div>
        <div class="slide-subtitle">Top performing examples with metrics</div>
        <div class="creatives-grid-bottom">
            <div class="creative-card">
                <div class="creative-image-container">
                    <img src="image.jpg" alt="Creative" class="creative-image-medium">
                    <div class="creative-rank">#1</div>
                </div>
                <div class="creative-content">
                    <div class="creative-title">Creative Title</div>
                    <div class="creative-metrics">
                        <div class="metric">
                            <span class="metric-label">ROAS:</span>
                            <span class="metric-value">18.4x</span>
                        </div>
                        <!-- Additional metrics -->
                    </div>
                    <div class="performance-indicator performance-good">Performance Level</div>
                </div>
            </div>
            <!-- Additional creative cards -->
        </div>
    </div>
</div>
```

## Data Table Layout

```html
<div class="slide">
    <div class="slide-content">
        <div class="slide-title">Performance Rankings</div>
        <div class="list-layout-container">
            <table class="list-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Metric 1</th>
                        <th>Metric 2</th>
                        <th>Performance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><img src="image.jpg" alt="Item" class="list-image-placeholder"></td>
                        <td><div class="list-performer-label">Item Name</div></td>
                        <td><div class="list-metric-value">$98,400</div><div class="list-metric-label">Spend</div></td>
                        <td><div class="list-metric-value">485</div><div class="list-metric-label">Conversions</div></td>
                        <td><div class="list-metric-value">18.4x</div><div class="list-metric-label">ROAS</div></td>
                    </tr>
                    <!-- Additional table rows -->
                </tbody>
            </table>
        </div>
    </div>
</div>
```

## Chart Dashboard Layout

```html
<div class="slide">
    <div class="slide-content">
        <div class="slide-title">Performance Trends</div>
        <div class="slide-subtitle">Data visualization with key metrics</div>
        <div class="metrics-highlight-container">
            <div class="metrics-chart-section">
                <div class="chart-container">
                    <canvas id="performanceChart"></canvas>
                </div>
            </div>
            <div class="metrics-display-section">
                <div class="metric-item">
                    <div class="metric-value">$3.8M</div>
                    <div class="metric-label">Total Revenue</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">67%</div>
                    <div class="metric-label">Growth Rate</div>
                </div>
                <!-- Additional metrics -->
            </div>
        </div>
    </div>
</div>
```

## Dual Column Comparison Layout

```html
<div class="slide">
    <div class="slide-content">
        <div class="slide-title">Performance Comparison</div>
        <div class="dual-list-container">
            <div class="dual-list-column">
                <div class="dual-list-title">Top Performers</div>
                <div class="list-layout-container">
                    <table class="list-table">
                        <tbody>
                            <tr>
                                <td><img src="image.jpg" class="list-image-placeholder"></td>
                                <td><div class="list-performer-label">Item Name</div></td>
                                <td><div class="list-metric-value">$98K</div><div class="list-metric-label">Spend</div></td>
                                <td><div class="list-metric-value">485</div><div class="list-metric-label">Conv.</div></td>
                                <td><div class="list-metric-value">18.4x</div><div class="list-metric-label">ROAS</div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="dual-list-column">
                <div class="dual-list-title">Bottom Performers</div>
                <!-- Similar table structure -->
            </div>
        </div>
    </div>
</div>
```

## Impact Analysis Layout

```html
<div class="slide">
    <div class="slide-content impact-content">
        <div class="dual-list-container">
            <div class="dual-list-column impact-column">
                <div class="dual-list-title">What's Working</div>
                <div class="list-layout-container">
                    <table class="list-table">
                        <tbody>
                            <tr>
                                <td class="impact-cell">
                                    <div class="impact-label">Success Factor</div>
                                    <div class="impact-description">Detailed explanation of what worked and why</div>
                                </td>
                                <td class="impact-metric">
                                    <div class="list-metric-value">Metric</div>
                                    <div class="list-metric-label">Affected</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="dual-list-column impact-column">
                <div class="dual-list-title">What's Not Working</div>
                <!-- Similar structure for challenges -->
            </div>
        </div>
    </div>
</div>
```

## Numbered Takeaways Layout

```html
<div class="slide">
    <div class="slide-content">
        <div class="slide-title">Key Insights</div>
        <div class="list-layout-container">
            <table class="list-table">
                <tbody>
                    <tr>
                        <td>
                            <div class="takeaway-number">01</div>
                        </td>
                        <td>
                            <div class="takeaway-content">
                                <div class="takeaway-title">Insight Title</div>
                                <div class="takeaway-description">Detailed explanation of the key insight and its implications</div>
                            </div>
                        </td>
                    </tr>
                    <!-- Additional takeaways -->
                </tbody>
            </table>
        </div>
    </div>
</div>
```

## CSS Classes Reference

### Container Classes
- `.cover-content` - Main cover slide container
- `.kpi-stats` - KPI dashboard container
- `.creatives-grid-bottom` - Image card grid container
- `.list-layout-container` - Data table container
- `.metrics-highlight-container` - Chart dashboard container
- `.dual-list-container` - Dual column comparison container
- `.impact-content` - Impact analysis container

### Component Classes
- `.cover-logo`, `.cover-title`, `.cover-subtitle`, `.cover-meta` - Cover elements
- `.kpi-stat`, `.kpi-stat-number`, `.kpi-stat-label`, `.kpi-stat-change` - KPI components
- `.creative-card`, `.creative-image-container`, `.creative-rank` - Card components
- `.list-table`, `.list-image-placeholder`, `.list-performer-label` - Table components
- `.chart-container`, `.metrics-display-section`, `.metric-item` - Chart components
- `.dual-list-column`, `.dual-list-title` - Comparison components
- `.impact-column`, `.impact-cell`, `.impact-label`, `.impact-description` - Impact components
- `.takeaway-number`, `.takeaway-content`, `.takeaway-title`, `.takeaway-description` - Takeaway components

### Modifier Classes
- `.positive`, `.negative` - Change indicators
- `.performance-good`, `.performance-excellent` - Performance levels
- `.scrollable` - For long content areas
