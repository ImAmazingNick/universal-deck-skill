const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// Load configuration files
const themesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../resources/themes.json'), 'utf8'));
const layoutsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../resources/layouts.json'), 'utf8'));

class DeckExporter {
  constructor(options) {
    this.pptx = new PptxGenJS();
    this.layout = options.layout;
    this.slides = options.slides;
    this.themeName = options.theme;

    // Load theme configuration
    this.themeConfig = themesData.themes[this.themeName];
    if (!this.themeConfig) {
      console.warn(`Theme '${this.themeName}' not found, using default theme`);
      this.themeConfig = themesData.themes['metallic-earth'];
    }

    // Configure presentation settings
    this.pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 }); // 16:9 aspect ratio
    this.pptx.layout = 'CUSTOM';
    this.pptx.author = 'Marketing Deck Generator';
    this.pptx.company = 'Claude Skills';
    this.pptx.subject = 'Marketing Presentation';
    this.pptx.title = 'Generated Marketing Deck';

    // Handle single layout (backward compatibility)
    if (options.layout) {
      this.layoutConfig = layoutsData.layouts[options.layout];
      if (!this.layoutConfig) {
        console.warn(`Layout '${options.layout}' not found, using default layout`);
        this.layoutConfig = layoutsData.layouts['data-grid-dashboard'];
      }
    }

    // Handle multiple slides
    if (options.slides) {
      this.slidesConfig = options.slides.map(slide => {
        const layoutConfig = layoutsData.layouts[slide.layout];
        if (!layoutConfig) {
          console.warn(`Layout '${slide.layout}' not found, skipping`);
          return null;
        }
        return {
          ...slide,
          layoutConfig
        };
      }).filter(config => config !== null);
    }
  }

  async generateDeck() {
    // Create title slide
    this.createTitleSlide();

    // Create content slides
    if (this.slidesConfig && this.slidesConfig.length > 0) {
      this.slidesConfig.forEach((slide, index) => {
        this.createContentSlideFromConfig(slide, index);
      });
    } else if (this.layoutConfig) {
      this.createContentSlide();
    }

    // Add additional slides if needed
    this.createSummarySlide();
  }

  createTitleSlide() {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.themeConfig.colors.background };

    // Add title
    slide.addText('Marketing Presentation', {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 1,
      fontSize: 44,
      color: this.themeConfig.colors.primary,
      bold: true,
      align: 'center',
      valign: 'middle'
    });

    // Add subtitle
    slide.addText(`Layout: ${this.layout} | Theme: ${this.themeConfig.name}`, {
      x: 0.5,
      y: 3,
      w: 9,
      h: 0.5,
      fontSize: 24,
      color: this.themeConfig.colors.foreground,
      align: 'center',
      valign: 'middle'
    });
  }

  createContentSlide() {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.themeConfig.colors.background };

    // Render each item in the layout
    if (this.layoutConfig) {
      this.layoutConfig.items.forEach(item => {
        this.renderLayoutItem(slide, item, this.layoutConfig);
      });
    }
  }

  createContentSlideFromConfig(slideConfig, slideIndex) {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.themeConfig.colors.background };

    // Skip headers for CTA and big title hero slides
    const skipHeaderLayouts = ['call-to-action', 'bold-minimalist-hero'];
    const shouldAddHeader = !skipHeaderLayouts.includes(slideConfig.layout);

    let headerHeight = 0; // No offset if no header

    if (shouldAddHeader) {
      // Add automatic header for content slides (except CTA and hero)
      const headerTitle = this.formatLayoutName(slideConfig.layout);
      const headerSubtitle = slideConfig.layoutConfig?.description || '';

      // Create header item - make it taller for better presence
      headerHeight = 4; // Increased from 3 to 4 for better visual presence
      const headerItem = {
        i: 'auto-header',
        x: 0,
        y: 0,
        w: 12,
        h: headerHeight,
        type: 'header',
        data: {
          title: headerTitle,
          subtitle: headerSubtitle,
          showDivider: true
        }
      };

      // Render the header
      this.renderLayoutItem(slide, headerItem, slideConfig.layoutConfig);

      // Add custom slide title if provided (overrides auto header)
      if (slideConfig.title) {
        slide.addText(slideConfig.title, {
          x: 0.5,
          y: 0.2,
          w: 9,
          h: 0.8,
          fontSize: 36,
          color: this.themeConfig.colors.primary,
          bold: true,
          align: 'center'
        });
      }
    }

    // Process layout items and convert to PPTX elements
    if (slideConfig.layoutConfig) {
      slideConfig.layoutConfig.items.forEach(item => {
        // Skip header items if we added one, or for slides without headers
        if (item.type !== 'header' || !shouldAddHeader) {
          // Create a copy of the item with y position offset by header height (0 if no header)
          const offsetItem = {
            ...item,
            y: item.y + headerHeight // Offset content below header (0 if no header)
          };
          this.renderLayoutItem(slide, offsetItem, slideConfig.layoutConfig);
        }
      });
    }
  }

  renderLayoutItem(slide, item, customLayoutConfig) {
    // Use provided layout config or fall back to instance config
    const layoutConfig = customLayoutConfig || this.layoutConfig;
    if (!layoutConfig) return;

    // Convert grid coordinates (12-column system) to PPTX inches using unified mapping
    const gridCols = layoutConfig.grid.cols || 12;
    const x = this.toInchesX(item.x, gridCols);
    const y = this.toInchesY(item.y);
    const w = this.toInchesW(item.w, gridCols);
    const h = this.toInchesH(item.h);

    // Render based on item type
    switch (item.type) {
      case 'text':
        this.renderTextItem(slide, item, x, y, w, h);
        break;
      case 'header':
        this.renderHeader(slide, item, x, y, w, h);
        break;
      case 'kpi-card':
        this.renderKpiCard(slide, item, x, y, w, h);
        break;
      case 'chart':
        this.renderChart(slide, item, x, y, w, h);
        break;
      case 'metric-card':
        this.renderMetricCard(slide, item, x, y, w, h);
        break;
      case 'testimonial':
        this.renderTestimonial(slide, item, x, y, w, h);
        break;
      case 'table':
        this.renderTable(slide, item, x, y, w, h);
        break;
      case 'photo-card':
        this.renderPhotoCard(slide, item, x, y, w, h);
        break;
      case 'timeline':
        this.renderTimeline(slide, item, x, y, w, h);
        break;
      case 'button':
        this.renderButton(slide, item, x, y, w, h);
        break;
      default:
        // Unknown item type - render placeholder
        slide.addText(`[${item.type}]`, {
          x, y, w, h,
          fontSize: 12,
          color: this.themeConfig.colors.muted,
          align: 'center',
          valign: 'middle'
        });
    }
  }

  // Unified mapping helpers
  toInchesX(gridX, gridCols = 12) {
    const slideWidth = 10; // inches
    return (gridX / gridCols) * slideWidth + 0.1;
  }

  toInchesW(gridW, gridCols = 12) {
    const slideWidth = 10; // inches
    return (gridW / gridCols) * slideWidth - 0.2;
  }

  toInchesY(gridY) {
    const rowHeightInches = 0.42; // vertical rhythm
    return (gridY * rowHeightInches) + 0.2;
  }

  toInchesH(gridH) {
    const rowHeightInches = 0.42;
    const h = (gridH * rowHeightInches) - 0.1;
    return h > 0 ? h : 0.1;
  }

  renderTextItem(slide, item, x, y, w, h) {
    const fontSize = this.getFontSize(item.data.size || 'base');

    slide.addText(item.data.text || 'Sample text', {
      x, y, w, h,
      fontSize,
      color: this.themeConfig.colors.foreground,
      align: item.data.align || 'left',
      valign: 'middle',
      bold: item.data.weight === 'bold',
      wrap: true
    });
  }

  renderHeader(slide, item, x, y, w, h) {
    const headerData = item.data;

    // Use fixed heights for better control and spacing
    const titleHeight = 0.6;      // 0.6 inches for title
    const subtitleHeight = 0.35;  // 0.35 inches for subtitle
    const lineSpacing = 0.2;      // 0.2 inches spacing around line

    // Title position - at the top with small margin
    if (headerData.title) {
      slide.addText(headerData.title, {
        x: x + 0.3,
        y: y + 0.1,  // Small top margin
        w: w - 0.6,
        h: titleHeight,
        fontSize: 28,  // Slightly smaller for better fit
        color: this.themeConfig.colors.primary,
        bold: true,
        align: 'left',
        valign: 'top',
        wrap: true
      });
    }

    // Subtitle position - below title with tighter spacing
    if (headerData.subtitle) {
      slide.addText(headerData.subtitle, {
        x: x + 0.3,
        y: y + titleHeight + 0.08,  // Tighter spacing from title (reduced from 0.15)
        w: w - 0.6,
        h: subtitleHeight,
        fontSize: 16,
        color: this.themeConfig.colors.foreground,
        align: 'left',
        valign: 'top',
        wrap: true
      });
    }

    // Decorative divider line - positioned below subtitle with spacing
    if (headerData.showDivider !== false) {
      const lineY = headerData.subtitle
        ? y + titleHeight + subtitleHeight + lineSpacing  // Below subtitle
        : y + titleHeight + lineSpacing;  // Below title only

      slide.addShape('line', {
        x: x + 0.3,
        y: lineY,
        w: w - 0.6,
        h: 0,
        line: {
          color: this.themeConfig.colors.primary,
          width: 3,
          dash: 'solid'
        }
      });
    }
  }

  renderKpiCard(slide, item, x, y, w, h) {
    // Add background rectangle
    slide.addShape('rect', {
      x, y, w, h,
      fill: { color: this.themeConfig.colors.muted },
      line: { color: this.themeConfig.colors.border, width: 1 },
      roundRect: true
    });

    // Add metric value
    slide.addText(item.data.metric || '24%', {
      x: x + 0.1,
      y: y + 0.1,
      w: w - 0.2,
      h: h * 0.6,
      fontSize: 28,
      color: this.themeConfig.colors.primary,
      bold: true,
      align: 'center',
      valign: 'bottom'
    });

    // Add label
    slide.addText(item.data.label || 'Metric', {
      x: x + 0.1,
      y: y + h * 0.6,
      w: w - 0.2,
      h: h * 0.4 - 0.1,
      fontSize: 14,
      color: this.themeConfig.colors.foreground,
      align: 'center',
      valign: 'top'
    });
  }

  renderMetricCard(slide, item, x, y, w, h) {
    // Add background rectangle
    slide.addShape('rect', {
      x, y, w, h,
      fill: { color: this.themeConfig.colors.muted },
      line: { color: this.themeConfig.colors.border, width: 1 },
      roundRect: true
    });

    // Add value with unit
    const valueText = `${item.data.value || 0}${item.data.unit || ''}`;
    slide.addText(valueText, {
      x: x + 0.1,
      y: y + 0.1,
      w: w - 0.2,
      h: h * 0.6,
      fontSize: 24,
      color: this.themeConfig.colors.accent,
      bold: true,
      align: 'center',
      valign: 'bottom'
    });

    // Add label
    slide.addText(item.data.label || 'Label', {
      x: x + 0.1,
      y: y + h * 0.6,
      w: w - 0.2,
      h: h * 0.4 - 0.1,
      fontSize: 12,
      color: this.themeConfig.colors.foreground,
      align: 'center',
      valign: 'top'
    });
  }

  renderTestimonial(slide, item, x, y, w, h) {
    // Add quote mark
    slide.addText('"', {
      x: x + 0.1,
      y: y + 0.1,
      w: 0.3,
      h: 0.3,
      fontSize: 24,
      color: this.themeConfig.colors.primary,
      bold: true
    });

    // Add quote text
    slide.addText(item.data.quote || 'This is a great product!', {
      x: x + 0.1,
      y: y + 0.4,
      w: w - 0.2,
      h: h * 0.6,
      fontSize: 14,
      color: this.themeConfig.colors.foreground,
      italic: true,
      align: 'left',
      valign: 'top',
      wrap: true
    });

    // Add author
    slide.addText(`— ${item.data.author || 'Anonymous'}`, {
      x: x + 0.1,
      y: y + h - 0.4,
      w: w - 0.2,
      h: 0.3,
      fontSize: 12,
      color: this.themeConfig.colors.primary,
      align: 'right',
      valign: 'bottom'
    });
  }

  renderButton(slide, item, x, y, w, h) {
    // Add button background
    slide.addShape('rect', {
      x, y, w, h,
      fill: { color: this.themeConfig.colors.primary },
      line: { color: this.themeConfig.colors.primary, width: 2 },
      roundRect: true
    });

    // Add button text
    slide.addText(item.data.text || 'Click Here', {
      x, y, w, h,
      fontSize: 16,
      color: this.themeConfig.colors.background,
      bold: true,
      align: 'center',
      valign: 'middle'
    });
  }

  // Additional renderers
  renderChart(slide, item, x, y, w, h) {
    const chartData = item.data || { type: 'bar', data: [] };
    const hasAddChart = typeof slide.addChart === 'function';

    if (hasAddChart && Array.isArray(chartData.data) && chartData.data.length > 0) {
      try {
        const categories = chartData.data.map(d => d.name || '');
        const values = chartData.data.map(d => Number(d.value) || 0);
        const series = [{ name: chartData.label || 'Series', labels: categories, values }];
        const type = (chartData.type || 'bar').toUpperCase();
        slide.addChart(type, series, {
          x, y, w, h,
          showLegend: false,
          dataLabelPosition: 'bestFit',
          valAxisLabelColor: this.themeConfig.colors.foreground,
          catAxisLabelColor: this.themeConfig.colors.foreground,
          chartColors: [this.themeConfig.colors.primary]
        });
        return;
      } catch (e) {
        // fall through to placeholder
      }
    }

    // Fallback placeholder
    slide.addShape('rect', {
      x, y, w, h,
      fill: { color: this.themeConfig.colors.muted },
      line: { color: this.themeConfig.colors.border, width: 1 }
    });
    slide.addText('Chart', {
      x, y, w, h,
      fontSize: 16,
      color: this.themeConfig.colors.foreground,
      align: 'center',
      valign: 'middle'
    });
  }

  renderTable(slide, item, x, y, w, h) {
    const table = item.data || { headers: [], rows: [] };
    const headers = Array.isArray(table.headers) ? table.headers : [];
    const rows = Array.isArray(table.rows) ? table.rows : [];

    if (typeof slide.addTable === 'function' && headers.length > 0) {
      const zebraFillA = this.themeConfig.colors.background;
      const zebraFillB = this.themeConfig.colors.muted;

      const tableRows = [
        headers.map(text => ({ text, options: { bold: true, color: this.themeConfig.colors.foreground, fill: this.themeConfig.colors.background } }))
      ];
      rows.forEach((r, idx) => {
        const fill = idx % 2 === 0 ? zebraFillA : zebraFillB;
        tableRows.push(r.map(text => ({ text: String(text), options: { color: this.themeConfig.colors.foreground, fill } })));
      });

      slide.addTable(tableRows, {
        x, y, w, h,
        border: { type: 'solid', color: this.themeConfig.colors.border, pt: 1 },
        fontSize: 12,
        autoPage: true,
        colW: Array(headers.length).fill((w - 0.2) / Math.max(headers.length, 1))
      });
      return;
    }

    // Fallback placeholder
    slide.addText('Table', { x, y, w, h, fontSize: 14, color: this.themeConfig.colors.foreground, align: 'center', valign: 'middle' });
  }

  renderPhotoCard(slide, item, x, y, w, h) {
    const data = item.data || {};
    const src = data.src;

    const imageOpts = { x, y, w, h, sizing: 'contain' };
    const tryPaths = [];
    if (typeof src === 'string') {
      if (path.isAbsolute(src)) tryPaths.push(src);
      tryPaths.push(path.join(process.cwd(), src.replace(/^\//, '')));
      tryPaths.push(path.join(__dirname, '../public', src.replace(/^\//, '')));
    }

    let added = false;
    for (const p of tryPaths) {
      try {
        if (fs.existsSync(p)) {
          slide.addImage({ path: p, ...imageOpts });
          added = true;
          break;
        }
      } catch (_) {}
    }

    if (!added) {
      slide.addShape('rect', { x, y, w, h, fill: { color: this.themeConfig.colors.muted }, line: { color: this.themeConfig.colors.border, width: 1 } });
      slide.addText('Image', { x, y, w, h, fontSize: 14, color: this.themeConfig.colors.foreground, align: 'center', valign: 'middle' });
    }

    if (data.caption) {
      slide.addText(data.caption, {
        x: x + 0.05,
        y: y + h - 0.3,
        w: w - 0.1,
        h: 0.25,
        fontSize: 12,
        color: this.themeConfig.colors.foreground,
        align: 'center',
        valign: 'bottom'
      });
    }
  }

  renderTimeline(slide, item, x, y, w, h) {
    const events = (item.data && Array.isArray(item.data.events)) ? item.data.events : [];
    const top = y + h * 0.4;

    // Base line
    slide.addShape('line', {
      x: x + 0.1,
      y: top,
      w: w - 0.2,
      h: 0,
      line: { color: this.themeConfig.colors.border, width: 2 }
    });

    const count = Math.max(events.length, 3);
    for (let i = 0; i < count; i++) {
      const ratio = count === 1 ? 0.5 : i / (count - 1);
      const cx = x + 0.1 + ratio * (w - 0.2);
      const cy = top;
      // Dot
      slide.addShape('ellipse', {
        x: cx - 0.06,
        y: cy - 0.06,
        w: 0.12,
        h: 0.12,
        fill: { color: this.themeConfig.colors.primary },
        line: { color: this.themeConfig.colors.primary, width: 1 }
      });

      const ev = events[i] || {};
      const label = ev.title ? `${ev.date ? ev.date + ' — ' : ''}${ev.title}` : (ev.date || 'Milestone');
      slide.addText(label, {
        x: Math.max(x, cx - 0.8),
        y: cy + 0.12,
        w: 1.6,
        h: Math.max(0.2, h - (cy - y) - 0.2),
        fontSize: 10,
        color: this.themeConfig.colors.foreground,
        align: 'center',
        valign: 'top',
        wrap: true
      });
    }
  }

  formatLayoutName(layoutKey) {
    // Convert kebab-case layout names to readable titles
    return layoutKey
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  createSummarySlide() {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.themeConfig.colors.background };

    slide.addText('Thank You', {
      x: 2,
      y: 2,
      w: 6,
      h: 1,
      fontSize: 36,
      color: this.themeConfig.colors.primary,
      bold: true,
      align: 'center',
      valign: 'middle'
    });

    slide.addText('Questions?', {
      x: 2,
      y: 3.5,
      w: 6,
      h: 0.5,
      fontSize: 24,
      color: this.themeConfig.colors.foreground,
      align: 'center',
      valign: 'middle'
    });
  }

  getFontSize(size) {
    const sizes = {
      'xs': 10,
      'sm': 12,
      'base': 14,
      'lg': 18,
      'xl': 24,
      '2xl': 32,
      '3xl': 40,
      '4xl': 48
    };
    return sizes[size] || 14;
  }

  hexToRgb(hex) {
    if (typeof hex !== 'string') {
      return { r: 0, g: 255, b: 255 }; // Cyan fallback
    }

    // Remove # if present
    hex = hex.replace('#', '');

    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }

    // Parse hex values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    return { r, g, b };
  }

  async save(outputPath = 'deck.pptx') {
    try {
      const outDir = path.dirname(outputPath);
      if (outDir && outDir !== '.' && !fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
    } catch (_) {}
    await this.pptx.writeFile({ fileName: outputPath });
  }
}

async function exportToPptx(options) {
  const exporter = new DeckExporter(options);
  await exporter.generateDeck();
  await exporter.save(options.outputPath);
}

module.exports = { exportToPptx };
