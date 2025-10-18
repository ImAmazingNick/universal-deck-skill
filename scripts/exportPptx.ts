import PptxGenJS from 'pptxgenjs';
import fs from 'fs';
import path from 'path';
import { DeckItem, ThemeConfig, LayoutConfig } from '../src/lib/deck-types';
import layoutsData from '../resources/layouts.json';
import themesData from '../resources/themes.json';

interface ExportOptions {
  layout?: string;
  slides?: Array<{ layout: string; title?: string; data?: any }>;
  theme: string;
  items?: DeckItem[];
  outputPath?: string;
}

export class DeckExporter {
  private pptx: PptxGenJS;
  private theme: ThemeConfig;
  private layout?: LayoutConfig;
  private slides?: Array<{ layout: string; title?: string; data?: any; layoutConfig?: LayoutConfig }>;

  constructor(options: ExportOptions) {
    this.pptx = new PptxGenJS();
    this.theme = themesData.themes[options.theme as keyof typeof themesData.themes];

    if (!this.theme) {
      throw new Error(`Theme '${options.theme}' not found`);
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
      this.layout = layoutsData.layouts[options.layout as keyof typeof layoutsData.layouts] as LayoutConfig;
      if (!this.layout) {
        throw new Error(`Layout '${options.layout}' not found`);
      }
    }

    // Handle multiple slides
    if (options.slides) {
      this.slides = options.slides.map(slide => {
        const layoutConfig = layoutsData.layouts[slide.layout as keyof typeof layoutsData.layouts] as LayoutConfig;
        if (!layoutConfig) {
          throw new Error(`Layout '${slide.layout}' not found`);
        }
        return {
          ...slide,
          layoutConfig
        };
      });
    }
  }

  async generateDeck(): Promise<void> {
    console.log('🎯 Starting deck generation...');

    // Create title slide
    console.log('📄 Creating title slide...');
    this.createTitleSlide();

    // Create content slides
    if (this.slides && this.slides.length > 0) {
      console.log(`🎨 Creating ${this.slides.length} content slides with different layouts...`);
      this.slides.forEach((slide, index) => {
        console.log(`  Slide ${index + 1}: ${slide.layout}`);
        this.createContentSlideFromConfig(slide, index);
      });
    } else if (this.layout) {
      console.log('🎨 Creating single content slide...');
      this.createContentSlide();
    }

    // Add additional slides if needed
    console.log('✨ Adding additional slides...');
    this.addAdditionalSlides();

    console.log('✅ Deck generation complete!');
  }

  private createTitleSlide(): void {
    const slide = this.pptx.addSlide();

    // Add background
    slide.background = { color: this.theme.colors.background };

    // Add title
    slide.addText('Marketing Presentation', {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 1,
      fontSize: 44,
      color: this.theme.colors.primary,
      bold: true,
      align: 'center',
      valign: 'middle'
    });

    // Add subtitle
    slide.addText('Generated with Claude Skills', {
      x: 0.5,
      y: 3,
      w: 9,
      h: 0.5,
      fontSize: 24,
      color: this.theme.colors.foreground,
      align: 'center',
      valign: 'middle'
    });
  }

  private createContentSlide(): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.theme.colors.background };

    // Process layout items and convert to PPTX elements
    if (this.layout) {
      const gridCols = this.layout.grid?.cols ?? 12;
      this.layout.items.forEach((item) => {
        this.addItemToSlide(slide, item, gridCols);
      });
    }
  }

  private createContentSlideFromConfig(slideConfig: { layout: string; title?: string; data?: any; layoutConfig?: LayoutConfig }, slideIndex: number): void {
    console.log(`  📊 Creating slide ${slideIndex + 1} with layout: ${slideConfig.layout}`);

    const slide = this.pptx.addSlide();
    slide.background = { color: this.theme.colors.background };

    // Add slide title if provided
    if (slideConfig.title) {
      console.log(`    Adding custom title: ${slideConfig.title}`);
      slide.addText(slideConfig.title, {
        x: 0.5,
        y: 0.2,
        w: 9,
        h: 0.8,
        fontSize: 36,
        color: this.theme.colors.primary,
        bold: true,
        align: 'center'
      });
    }

    // Auto-header logic (skip for CTA and Hero)
    const skipHeaderLayouts = ['call-to-action', 'bold-minimalist-hero'];
    const shouldAddHeader = !skipHeaderLayouts.includes(slideConfig.layout);
    const headerHeightRows = 4; // consistent with JS exporter

    // Process layout items and convert to PPTX elements
    if (slideConfig.layoutConfig) {
      console.log(`    Processing ${slideConfig.layoutConfig.items.length} layout items...`);
      const gridCols = slideConfig.layoutConfig.grid?.cols ?? 12;

      if (shouldAddHeader) {
        const headerItem = {
          i: 'auto-header',
          x: 0,
          y: 0,
          w: gridCols,
          h: headerHeightRows,
          type: 'header',
          data: {
            title: this.formatLayoutName(slideConfig.layout),
            subtitle: slideConfig.layoutConfig?.description || '',
            showDivider: true
          }
        } as unknown as DeckItem;
        this.addItemToSlide(slide, headerItem, gridCols);
      }

      slideConfig.layoutConfig.items.forEach((item) => {
        if (item.type !== 'header' || !shouldAddHeader) {
          const offsetItem = { ...item, y: item.y + (shouldAddHeader ? headerHeightRows : 0) } as DeckItem;
          this.addItemToSlide(slide, offsetItem, gridCols);
        }
      });
    } else {
      console.log(`    ⚠️  No layout config found for ${slideConfig.layout}`);
    }
  }

  private addItemToSlide(slide: PptxGenJS.Slide, item: DeckItem, gridCols: number = 12): void {
    const x = this.toInchesX(item.x, gridCols);
    const y = this.toInchesY(item.y);
    const w = this.toInchesW(item.w, gridCols);
    const h = this.toInchesH(item.h);

    switch (item.type) {
      case 'text':
        this.addTextToSlide(slide, item, x, y, w, h);
        break;
      case 'header':
        this.addHeaderToSlide(slide, item, x, y, w, h);
        break;
      case 'kpi-card':
        this.addKpiCardToSlide(slide, item, x, y, w, h);
        break;
      case 'chart':
        this.addChartToSlide(slide, item, x, y, w, h);
        break;
      case 'testimonial':
        this.addTestimonialToSlide(slide, item, x, y, w, h);
        break;
      case 'metric-card':
        this.addMetricCardToSlide(slide, item, x, y, w, h);
        break;
      case 'table':
        this.addTableToSlide(slide, item, x, y, w, h);
        break;
      case 'photo-card':
        this.addPhotoCardToSlide(slide, item, x, y, w, h);
        break;
      case 'timeline':
        this.addTimelineToSlide(slide, item, x, y, w, h);
        break;
      case 'button':
        this.addButtonToSlide(slide, item, x, y, w, h);
        break;
      default:
        // For unsupported types, add a placeholder
        slide.addText(`${item.type} placeholder`, {
          x, y, w, h,
          fontSize: 12,
          color: this.theme.colors.muted,
          align: 'center',
          valign: 'middle'
        });
    }
  }

  // Unified mapping helpers
  private toInchesX(gridX: number, gridCols: number = 12): number {
    const slideWidth = 10; // inches
    return (gridX / gridCols) * slideWidth + 0.1;
  }

  private toInchesW(gridW: number, gridCols: number = 12): number {
    const slideWidth = 10; // inches
    return (gridW / gridCols) * slideWidth - 0.2;
  }

  private toInchesY(gridY: number): number {
    const rowHeightInches = 0.42; // vertical rhythm
    return (gridY * rowHeightInches) + 0.2;
  }

  private toInchesH(gridH: number): number {
    const rowHeightInches = 0.42;
    const h = (gridH * rowHeightInches) - 0.1;
    return h > 0 ? h : 0.1;
  }

  private addTextToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    const textData = item.data as { text: string; size?: string; align?: string; weight?: string };
    const fontSize = this.getFontSize(textData.size || 'base');
    const align = textData.align || 'left';

    slide.addText(textData.text, {
      x, y, w, h,
      fontSize,
      color: this.theme.colors.foreground,
      align: align as 'left' | 'center' | 'right',
      valign: 'middle',
      bold: textData.weight === 'bold',
      wrap: true
    });
  }

  private addHeaderToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    const headerData = item.data as { title: string; subtitle?: string; icon?: string; showDivider?: boolean };

    // Fixed inch spacing for title/subtitle
    const titleHeight = 0.6;
    const subtitleHeight = 0.35;
    const lineSpacing = 0.2;

    if (headerData.title) {
      slide.addText(headerData.title, {
        x: x + 0.3,
        y: y + 0.1,
        w: w - 0.6,
        h: titleHeight,
        fontSize: 28,
        color: this.theme.colors.primary,
        bold: true,
        align: 'left',
        valign: 'top',
        wrap: true
      });
    }

    if (headerData.subtitle) {
      slide.addText(headerData.subtitle, {
        x: x + 0.3,
        y: y + titleHeight + 0.08,
        w: w - 0.6,
        h: subtitleHeight,
        fontSize: 16,
        color: this.theme.colors.foreground,
        align: 'left',
        valign: 'top',
        wrap: true
      });
    }

    if (headerData.showDivider !== false) {
      const lineY = headerData.subtitle ? y + titleHeight + subtitleHeight + lineSpacing : y + titleHeight + lineSpacing;
      slide.addShape('line', {
        x: x + 0.3,
        y: lineY,
        w: w - 0.6,
        h: 0,
        line: { color: this.theme.colors.primary, width: 3 }
      });
    }
  }

  private formatLayoutName(layoutKey: string): string {
    return layoutKey
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private addKpiCardToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    const kpiData = item.data as { metric: string; label: string; icon?: string };
    // Add background rectangle
    slide.addShape('rect', {
      x, y, w, h,
      fill: { color: this.theme.colors.muted },
      line: { color: this.theme.colors.border, width: 1 }
    });

    // Add metric value
    slide.addText(kpiData.metric, {
      x: x + 0.1,
      y: y + 0.1,
      w: w - 0.2,
      h: h * 0.6,
      fontSize: 32,
      color: this.theme.colors.primary,
      bold: true,
      align: 'center',
      valign: 'bottom'
    });

    // Add label
    slide.addText(kpiData.label, {
      x: x + 0.1,
      y: y + h * 0.6,
      w: w - 0.2,
      h: h * 0.4 - 0.1,
      fontSize: 14,
      color: this.theme.colors.foreground,
      align: 'center',
      valign: 'top'
    });
  }

  private addChartToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    const chartData = (item.data as any) || { type: 'bar', data: [] };
    const addChart = (slide as any).addChart;

    if (typeof addChart === 'function' && Array.isArray(chartData.data) && chartData.data.length > 0) {
      try {
        const categories = chartData.data.map((d: any) => d.name || '');
        const values = chartData.data.map((d: any) => Number(d.value) || 0);
        const series = [{ name: chartData.label || 'Series', labels: categories, values }];
        const type = String(chartData.type || 'bar').toUpperCase();
        addChart.call(slide, type, series, {
          x, y, w, h,
          showLegend: false,
          dataLabelPosition: 'bestFit',
          valAxisLabelColor: this.theme.colors.foreground,
          catAxisLabelColor: this.theme.colors.foreground,
          chartColors: [this.theme.colors.primary]
        });
        return;
      } catch (_) {
        // fall through to placeholder
      }
    }

    // Fallback placeholder
    slide.addShape('rect', {
      x, y, w, h,
      fill: { color: this.theme.colors.muted },
      line: { color: this.theme.colors.border, width: 1 }
    });
    slide.addText('Chart', {
      x, y, w, h,
      fontSize: 16,
      color: this.theme.colors.foreground,
      align: 'center',
      valign: 'middle'
    });
  }

  private addTestimonialToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    // Add quote mark
    slide.addText('"', {
      x: x + 0.1,
      y: y + 0.1,
      w: 0.3,
      h: 0.3,
      fontSize: 24,
      color: this.theme.colors.primary,
      bold: true
    });

    // Add quote text
    const testimonial = item.data as any;
    slide.addText(String(testimonial.quote ?? 'This is a great product!'), {
      x: x + 0.1,
      y: y + 0.4,
      w: w - 0.2,
      h: h * 0.6,
      fontSize: 14,
      color: this.theme.colors.foreground,
      italic: true,
      align: 'left',
      valign: 'top',
      wrap: true
    });

    // Add author
    slide.addText(`— ${String(testimonial.author ?? 'Anonymous')}` , {
      x: x + 0.1,
      y: y + h - 0.4,
      w: w - 0.2,
      h: 0.3,
      fontSize: 12,
      color: this.theme.colors.primary,
      align: 'right',
      valign: 'bottom'
    });
  }

  private addMetricCardToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    // Similar to KPI card but with change indicators
    this.addKpiCardToSlide(slide, item, x, y, w, h);

    // Add change indicator if available
    const metricData = item.data as any;
    if (typeof metricData.change === 'number') {
      const changeText = metricData.change > 0 ? `+${metricData.change}` : String(metricData.change);
      const changeColor = metricData.change > 0 ? '00AA00' : 'AA0000';

      slide.addText(changeText, {
        x: x + w - 1,
        y: y + 0.1,
        w: 0.8,
        h: 0.3,
        fontSize: 12,
        color: changeColor,
        align: 'right',
        valign: 'top'
      });
    }
  }

  private addButtonToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    // Add button background
    slide.addShape('rect', {
      x, y, w, h,
      fill: { color: this.theme.colors.primary },
      line: { color: this.theme.colors.primary, width: 2 }
    });

    // Add button text
    const btn = item.data as any;
    slide.addText(String(btn.text ?? 'Click Here'), {
      x, y, w, h,
      fontSize: 16,
      color: this.theme.colors.background,
      bold: true,
      align: 'center',
      valign: 'middle'
    });
  }

  private addTableToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    const table = (item.data as any) || { headers: [], rows: [] };
    const headers: string[] = Array.isArray(table.headers) ? table.headers : [];
    const rows: string[][] = Array.isArray(table.rows) ? table.rows : [];

    const addTable = (slide as any).addTable;
    if (typeof addTable === 'function' && headers.length > 0) {
      const zebraFillA = this.theme.colors.background;
      const zebraFillB = this.theme.colors.muted;

      const tableRows: any[] = [
        headers.map((text) => ({ text, options: { bold: true, color: this.theme.colors.foreground, fill: this.theme.colors.background } }))
      ];
      rows.forEach((r, idx) => {
        const fill = idx % 2 === 0 ? zebraFillA : zebraFillB;
        tableRows.push(r.map((text) => ({ text: String(text), options: { color: this.theme.colors.foreground, fill } })));
      });

      addTable.call(slide, tableRows, {
        x, y, w, h,
        border: { type: 'solid', color: this.theme.colors.border, pt: 1 },
        fontSize: 12,
        autoPage: true,
        colW: Array(headers.length).fill((w - 0.2) / Math.max(headers.length, 1))
      });
      return;
    }

    // Fallback placeholder
    slide.addText('Table', { x, y, w, h, fontSize: 14, color: this.theme.colors.foreground, align: 'center', valign: 'middle' });
  }

  private addPhotoCardToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    const data = (item.data as any) || {};
    const src: string | undefined = data.src;
    const addImage = (slide as any).addImage;

    const imageOpts = { x, y, w, h, sizing: 'contain' } as any;
    const tryPaths: string[] = [];
    if (typeof src === 'string') {
      if (path.isAbsolute(src)) tryPaths.push(src);
      tryPaths.push(path.join(process.cwd(), src.replace(/^\//, '')));
      tryPaths.push(path.join(__dirname, '../public', src.replace(/^\//, '')));
    }

    let added = false;
    if (typeof addImage === 'function') {
      for (const p of tryPaths) {
        try {
          if (fs.existsSync(p)) {
            addImage.call(slide, { path: p, ...imageOpts });
            added = true;
            break;
          }
        } catch {
          // ignore
        }
      }
    }

    if (!added) {
      slide.addShape('rect', { x, y, w, h, fill: { color: this.theme.colors.muted }, line: { color: this.theme.colors.border, width: 1 } });
      slide.addText('Image', { x, y, w, h, fontSize: 14, color: this.theme.colors.foreground, align: 'center', valign: 'middle' });
    }

    if (data.caption) {
      slide.addText(String(data.caption), {
        x: x + 0.05,
        y: y + h - 0.3,
        w: w - 0.1,
        h: 0.25,
        fontSize: 12,
        color: this.theme.colors.foreground,
        align: 'center',
        valign: 'bottom'
      });
    }
  }

  private addTimelineToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    const data = (item.data as any) || {};
    const events: Array<{ date?: string; title?: string }> = Array.isArray(data.events) ? data.events : [];
    const top = y + h * 0.4;

    slide.addShape('line', {
      x: x + 0.1,
      y: top,
      w: w - 0.2,
      h: 0,
      line: { color: this.theme.colors.border, width: 2 }
    });

    const count = Math.max(events.length, 3);
    for (let i = 0; i < count; i++) {
      const ratio = count === 1 ? 0.5 : i / (count - 1);
      const cx = x + 0.1 + ratio * (w - 0.2);
      const cy = top;

      slide.addShape('ellipse', {
        x: cx - 0.06,
        y: cy - 0.06,
        w: 0.12,
        h: 0.12,
        fill: { color: this.theme.colors.primary },
        line: { color: this.theme.colors.primary, width: 1 }
      });

      const ev = events[i] || {};
      const label = ev.title ? `${ev.date ? ev.date + ' — ' : ''}${ev.title}` : (ev.date || 'Milestone');
      slide.addText(label, {
        x: Math.max(x, cx - 0.8),
        y: cy + 0.12,
        w: 1.6,
        h: Math.max(0.2, h - (cy - y) - 0.2),
        fontSize: 10,
        color: this.theme.colors.foreground,
        align: 'center',
        valign: 'top',
        wrap: true
      });
    }
  }

  private addAdditionalSlides(): void {
    // Add a summary slide
    const summarySlide = this.pptx.addSlide();
    summarySlide.background = { color: this.theme.colors.background };

    summarySlide.addText('Thank You', {
      x: 2,
      y: 2,
      w: 6,
      h: 1,
      fontSize: 36,
      color: this.theme.colors.primary,
      bold: true,
      align: 'center',
      valign: 'middle'
    });

    summarySlide.addText('Questions?', {
      x: 2,
      y: 3.5,
      w: 6,
      h: 0.5,
      fontSize: 24,
      color: this.theme.colors.foreground,
      align: 'center',
      valign: 'middle'
    });
  }

  private getFontSize(size: string): number {
    const sizes: Record<string, number> = {
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

  async save(outputPath: string = 'output/deck.pptx'): Promise<void> {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await this.pptx.writeFile({ fileName: outputPath });
  }
}

export async function exportToPptx(options: ExportOptions): Promise<void> {
  const exporter = new DeckExporter({
    layout: options.layout,
    slides: options.slides,
    theme: options.theme,
    items: options.items,
    outputPath: options.outputPath
  });
  await exporter.generateDeck();
  await exporter.save(options.outputPath);
}
