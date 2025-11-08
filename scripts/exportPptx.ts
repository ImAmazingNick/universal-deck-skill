import PptxGenJS from 'pptxgenjs';
import fs from 'fs';
import path from 'path';
import { DeckItem, ThemeConfig, LayoutConfig } from '../src/lib/deck-types';

// Load configuration JSON at runtime with robust path resolution for both source and dist builds
function readJsonResource(relativePathFromResources: string): any {
  const candidates = [
    // When compiled: scripts/dist/scripts -> scripts/dist/resources
    path.join(__dirname, '../resources', relativePathFromResources),
    // When compiled but need root resources: scripts/dist/scripts -> ../../.. -> project root/resources
    path.join(__dirname, '../../../resources', relativePathFromResources),
    // When running from source: scripts -> ../resources
    path.join(__dirname, '../resources', relativePathFromResources)
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch {
      // ignore and try next
    }
  }
  // Fallback to project root using CWD
  const cwdPath = path.join(process.cwd(), 'resources', relativePathFromResources);
  if (fs.existsSync(cwdPath)) {
    return JSON.parse(fs.readFileSync(cwdPath, 'utf8'));
  }
  throw new Error(`Resource not found: ${relativePathFromResources}`);
}

const themesData: any = readJsonResource('themes.json');
const layoutsData: any = readJsonResource('layouts.json');

interface ExportOptions {
  layout?: string;
  slides?: Array<{ layout: string; title?: string; items?: Array<Partial<DeckItem> & { i: string }>; data?: any }>;
  theme: string;
  items?: DeckItem[];
  outputPath?: string;
  titleSlide?: { title?: string; subtitle?: string; logo?: string; date?: string; author?: string; company?: string };
  assetsBasePath?: string;
}

export class DeckExporter {
  private pptx: PptxGenJS;
  private theme: ThemeConfig;
  private slideBgColor: string;
  private layout?: LayoutConfig;
  private slides?: Array<{ layout: string; title?: string; data?: any; layoutConfig?: LayoutConfig }>;
  private titleSlide?: { title?: string; subtitle?: string; logo?: string; date?: string; author?: string; company?: string };
  private assetsBasePath?: string;
  // Per-slide computed mapping derived from layout.grid
  private currentMapping?: {
    gridCols: number;
    rowHeightInches: number;
    xPadInches: number;
    wPadInches: number;
    yPadInches: number;
    hPadInches: number;
  };

  constructor(options: ExportOptions) {
    this.pptx = new PptxGenJS();
    this.theme = themesData.themes[options.theme as keyof typeof themesData.themes];

    if (!this.theme) {
      throw new Error(`Theme '${options.theme}' not found`);
    }

    // Compute PPTX-friendly theme background
    this.slideBgColor = this.computeBackgroundColor(this.theme);

    // Configure presentation settings
    this.pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 }); // 16:9 aspect ratio
    this.pptx.layout = 'CUSTOM';
    this.pptx.author = 'Marketing Deck Generator';
    this.pptx.company = 'Claude Skills';
    this.pptx.subject = 'Marketing Presentation';
    this.pptx.title = 'Generated Marketing Deck';

    // Optional customizations
    this.titleSlide = options.titleSlide;
    this.assetsBasePath = options.assetsBasePath;

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
    const startTime = Date.now();
    console.log('🎯 Starting deck generation...');

    // Create title slide
    console.log('📄 Creating title slide...');
    this.createTitleSlide();

    // Create content slides
    if (this.slides && this.slides.length > 0) {
      console.log(`🎨 Creating ${this.slides.length} content slides with different layouts...`);
      this.slides.forEach((slide, index) => {
        const slideStartTime = Date.now();
        console.log(`  Slide ${index + 1}: ${slide.layout}`);
        this.createContentSlideFromConfig(slide, index);
        const slideTime = Date.now() - slideStartTime;
        if (slideTime > 50) { // Log slow slides for performance monitoring
          console.log(`    ⏱️  Slide took ${slideTime}ms`);
        }
      });
    } else if (this.layout) {
      console.log('🎨 Creating single content slide...');
      this.createContentSlide();
    }

    // Add additional slides if needed
    console.log('✨ Adding additional slides...');
    this.addAdditionalSlides();

    const totalTime = Date.now() - startTime;
    console.log(`✅ Deck generation complete in ${totalTime}ms!`);
  }

  private createTitleSlide(): void {
    const slide = this.pptx.addSlide();

    // Add background
    slide.background = { color: this.slideBgColor };

    // Add title
    const title = this.titleSlide?.title || 'Marketing Presentation';
    slide.addText(title, {
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
    const subtitleParts: string[] = [];
    if (this.titleSlide?.subtitle) subtitleParts.push(this.titleSlide.subtitle);
    const meta: string[] = [];
    if (this.titleSlide?.author) meta.push(this.titleSlide.author);
    if (this.titleSlide?.company) meta.push(this.titleSlide.company);
    if (this.titleSlide?.date) meta.push(this.titleSlide.date);
    if (meta.length > 0) subtitleParts.push(meta.join(' • '));
    const subtitleText = subtitleParts.length > 0 ? subtitleParts.join(' — ') : 'Generated with Claude Skills';
    slide.addText(subtitleText, {
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
    slide.background = { color: this.slideBgColor };

    // Process layout items and convert to PPTX elements
    if (this.layout) {
      this.currentMapping = this.computeMapping(this.layout);
      const gridCols = this.currentMapping.gridCols;

      // If an explicit header exists on the layout, render it first and offset content below it
      const explicitHeader = this.layout.header as DeckItem | undefined;
      const headerHeightRows = (explicitHeader?.h as number | undefined) ?? 4;

      if (explicitHeader) {
        // Render explicit header
        this.addItemToSlide(slide, explicitHeader as DeckItem, gridCols);
      }

      this.layout.items.forEach((item) => {
        // Skip double-rendering the explicit header if it appears in items
        if (explicitHeader && item.i === explicitHeader.i) return;

        // Offset items that would overlap the header
        const needsOffset = !!explicitHeader;
        const newY = needsOffset && item.y < headerHeightRows ? item.y + headerHeightRows : item.y;
        const offsetItem = needsOffset ? ({ ...item, y: newY } as DeckItem) : (item as DeckItem);
        this.addItemToSlide(slide, offsetItem, gridCols);
      });
    }
  }

  private createContentSlideFromConfig(slideConfig: { layout: string; title?: string; data?: any; layoutConfig?: LayoutConfig }, slideIndex: number): void {
    console.log(`  📊 Creating slide ${slideIndex + 1} with layout: ${slideConfig.layout}`);

    const slide = this.pptx.addSlide();
    slide.background = { color: this.slideBgColor };

    // Header policy: use layout.header if provided and autoHeader !== true; otherwise inject auto header except for hero/cta
    const skipHeaderLayouts = ['call-to-action', 'bold-minimalist-hero'];
    const explicitHeader = slideConfig.layoutConfig?.header;
    const autoHeader = slideConfig.layoutConfig?.autoHeader !== false && !explicitHeader && !skipHeaderLayouts.includes(slideConfig.layout);
    const headerHeightRows = explicitHeader?.h ?? 4;

    // Process layout items and convert to PPTX elements
    if (slideConfig.layoutConfig) {
      console.log(`    Processing ${slideConfig.layoutConfig.items.length} layout items...`);
      this.currentMapping = this.computeMapping(slideConfig.layoutConfig);
      const gridCols = this.currentMapping.gridCols;

      // Add header: explicit first (merged with slide title if provided), else auto if allowed
      if (explicitHeader) {
        const mergedExplicitHeader: DeckItem = {
          ...(explicitHeader as DeckItem),
          data: {
            ...(explicitHeader as any).data,
            // If slide provides a custom title, prefer it over layout header title
            title: slideConfig.title ?? (explicitHeader as any).data?.title
          }
        } as DeckItem;
        this.addItemToSlide(slide, mergedExplicitHeader, gridCols);
      } else if (autoHeader) {
        const headerItem = {
          i: 'auto-header',
          x: 0,
          y: 0,
          w: gridCols,
          h: headerHeightRows,
          type: 'header',
          data: {
            title: slideConfig.title ?? this.formatLayoutName(slideConfig.layout),
            subtitle: slideConfig.layoutConfig?.description || '',
            showDivider: true
          }
        } as DeckItem;
        this.addItemToSlide(slide, headerItem, gridCols);
      }

      // If we did NOT render any header, optionally add a separate title block
      if (!explicitHeader && !autoHeader && slideConfig.title) {
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

      const itemsWithOverrides = this.applyItemOverrides(slideConfig.layoutConfig.items, slideConfig as any);
      itemsWithOverrides.forEach((item) => {
        // If explicit header exists, keep its own grid position; otherwise, offset items under auto header
        if (explicitHeader && item.i === explicitHeader.i) {
          return; // avoid double-rendering explicit header
        }
        // When explicit header exists, offset only items that would overlap header
        if (explicitHeader) {
          const newY = item.y < headerHeightRows ? item.y + headerHeightRows : item.y;
          const offsetItem = { ...item, y: newY } as DeckItem;
          this.addItemToSlide(slide, offsetItem, gridCols);
          return;
        }
        const needsOffset = autoHeader;
        const offsetItem = needsOffset ? ({ ...item, y: item.y + headerHeightRows } as DeckItem) : (item as DeckItem);
        this.addItemToSlide(slide, offsetItem, gridCols);
      });
    } else {
      console.log(`    ⚠️  No layout config found for ${slideConfig.layout}`);
    }
  }

  private applyItemOverrides(baseItems: DeckItem[], slideConfig: { items?: Array<Partial<DeckItem> & { i: string }> }): DeckItem[] {
    if (!Array.isArray(slideConfig.items) || slideConfig.items.length === 0) return baseItems;
    const overridesMap = new Map<string, Partial<DeckItem>>();
    for (const ov of slideConfig.items) {
      if (ov && typeof ov.i === 'string') {
        overridesMap.set(ov.i, ov);
      }
    }
    return baseItems.map((item) => {
      const ov = overridesMap.get(item.i);
      if (!ov) return item;
      const merged: DeckItem = {
        ...item,
        ...(ov as any),
        data: { ...(item as any).data, ...(ov as any).data }
      } as DeckItem;
      return merged;
    });
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
      case 'rich-text':
        this.addRichTextToSlide(slide, item, x, y, w, h);
        break;
      case 'list':
        this.addListToSlide(slide, item, x, y, w, h);
        break;
      case 'quote':
        this.addQuoteToSlide(slide, item, x, y, w, h);
        break;
      case 'code':
        this.addCodeToSlide(slide, item, x, y, w, h);
        break;
      case 'note':
        this.addNoteToSlide(slide, item, x, y, w, h);
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
    }
  }

  // Unified mapping helpers that respect layout.grid rowHeight/margin
  private computeMapping(layoutConfig: LayoutConfig) {
    const slideWidthInches = 10; // 16:9 width
    const baseRowHeightPx = 30; // baseline matches resources default
    const baseRowHeightInches = 0.45; // improved vertical rhythm
    const baseMarginPx = 10; // baseline matches resources default
    const grid = layoutConfig.grid || { cols: 12, rowHeight: baseRowHeightPx, margin: [baseMarginPx, baseMarginPx] };
    const gridCols = grid.cols ?? 12;
    const rowHeightPx = grid.rowHeight ?? baseRowHeightPx;
    const [marginXpx, marginYpx] = Array.isArray(grid.margin) && grid.margin.length >= 2 ? grid.margin as [number, number] : [baseMarginPx, baseMarginPx];

    const rowHeightInches = baseRowHeightInches * (rowHeightPx / baseRowHeightPx);
    const scaleX = marginXpx / baseMarginPx;
    const scaleY = marginYpx / baseMarginPx;

    const xPadInches = 0.15 * scaleX; // increased for better margins
    const wPadInches = 0.25 * scaleX; // increased for better spacing
    const yPadInches = 0.25 * scaleY; // increased for better vertical rhythm
    const hPadInches = 0.15 * scaleY; // increased for better breathing room

    return { gridCols, rowHeightInches, xPadInches, wPadInches, yPadInches, hPadInches, slideWidthInches };
  }

  private toInchesX(gridX: number, gridCols: number = 12): number {
    const mapping = this.currentMapping || { gridCols, rowHeightInches: 0.42, xPadInches: 0.1, wPadInches: 0.2, yPadInches: 0.2, hPadInches: 0.1 } as any;
    const slideWidthInches = (this.currentMapping as any)?.slideWidthInches ?? 10;
    return (gridX / mapping.gridCols) * slideWidthInches + mapping.xPadInches;
  }

  private toInchesW(gridW: number, gridCols: number = 12): number {
    const mapping = this.currentMapping || { gridCols, rowHeightInches: 0.42, xPadInches: 0.1, wPadInches: 0.2, yPadInches: 0.2, hPadInches: 0.1 } as any;
    const slideWidthInches = (this.currentMapping as any)?.slideWidthInches ?? 10;
    return (gridW / mapping.gridCols) * slideWidthInches - mapping.wPadInches;
  }

  private toInchesY(gridY: number): number {
    const mapping = this.currentMapping || { gridCols: 12, rowHeightInches: 0.42, xPadInches: 0.1, wPadInches: 0.2, yPadInches: 0.2, hPadInches: 0.1, slideWidthInches: 10 };
    return (gridY * mapping.rowHeightInches) + mapping.yPadInches;
  }

  private toInchesH(gridH: number): number {
    const mapping = this.currentMapping || { gridCols: 12, rowHeightInches: 0.42, xPadInches: 0.1, wPadInches: 0.2, yPadInches: 0.2, hPadInches: 0.1, slideWidthInches: 10 };
    const h = (gridH * mapping.rowHeightInches) - mapping.hPadInches;
    return h > 0 ? h : 0.1;
  }

  private addTextToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    const textData = item.data as any;
    const fontSize = this.getFontSize(textData.size || 'base');
    const align = textData.align || 'left';
    const color = this.validateColor(textData.color) || this.theme.colors.foreground;
    const fontFamily = textData.fontFamily || this.theme.typography?.fontFamily?.body || 'Inter';
    const letterSpacing = this.getLetterSpacingValue(textData.letterSpacing);
    const lineHeight = textData.lineHeight ? this.getLineHeightValue(textData.lineHeight) : undefined;
    const textShadow = textData.textShadow ? { type: 'outer', color: '000000', opacity: 0.25, blur: 2, angle: 45, offset: 2 } : undefined;

    // Handle rich text segments
    if (Array.isArray(textData.content)) {
      const richTextSegments = textData.content.map((segment: any) => {
        const segmentOptions: any = {
          text: segment.text,
          options: {
            color: this.validateColor(segment.formatting?.color) || color,
            fontSize: segment.formatting?.fontSize || fontSize,
            bold: segment.formatting?.bold || textData.weight === 'bold',
            italic: segment.formatting?.italic || textData.weight === 'italic',
            underline: segment.formatting?.underline ? { style: 'single' } : undefined,
            fontFace: fontFamily,
            shadow: segment.formatting?.textShadow || textShadow,
          }
        };
        return segmentOptions;
      });

      slide.addText(richTextSegments, {
        x, y, w, h,
        align: align as 'left' | 'center' | 'right' | 'justify',
        valign: 'middle',
        fontFace: fontFamily,
        wrap: true,
        lineSpacing: lineHeight,
        charSpacing: letterSpacing,
        shadow: textShadow
      });
    } else {
      // Simple text
      slide.addText(textData.content || textData.text || '', {
        x, y, w, h,
        fontSize,
        color,
        align: align as 'left' | 'center' | 'right' | 'justify',
        valign: 'middle',
        fontFace: fontFamily,
        bold: textData.weight === 'bold',
        italic: textData.weight === 'italic',
        wrap: true,
        lineSpacing: lineHeight,
        charSpacing: letterSpacing,
        shadow: textShadow
      });
    }
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
        fontSize: 32,
        fontFace: this.theme.typography?.fontFamily?.heading || 'Space Grotesk',
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
        fontSize: 20,
        fontFace: this.theme.typography?.fontFamily?.body || 'Inter',
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
    const kpiData = item.data as any;

    // Add background rectangle with better styling
    slide.addShape('rect', {
      x, y, w, h,
      fill: { color: this.theme.colors.muted },
      line: { color: this.theme.colors.border, width: 1 }
    });

    // Use JetBrains Mono for numbers (with tabular figures and slashed zero)
    const numberFont = this.theme.typography?.fontFamily?.mono || 'JetBrains Mono';

    // Add metric value with proper number formatting
    if (Array.isArray(kpiData.metric)) {
      const richTextSegments = kpiData.metric.map((segment: any) => ({
        text: segment.text,
        options: {
          color: this.validateColor(segment.formatting?.color) || this.theme.colors.primary,
          fontSize: segment.formatting?.fontSize || 36,
          fontFace: numberFont,
          bold: segment.formatting?.bold !== false,
          italic: segment.formatting?.italic,
          underline: segment.formatting?.underline ? { style: 'single' } : undefined,
        }
      }));

      slide.addText(richTextSegments, {
        x: x + 0.15,
        y: y + 0.15,
        w: w - 0.3,
        h: h * 0.65,
        align: 'center',
        valign: 'bottom',
        fontFace: numberFont
      });
    } else {
      slide.addText(String(kpiData.metric), {
        x: x + 0.15,
        y: y + 0.15,
        w: w - 0.3,
        h: h * 0.65,
        fontSize: 36,
        fontFace: numberFont,
        color: this.theme.colors.primary,
        bold: true,
        align: 'center',
        valign: 'bottom'
      });
    }

    // Add label with better typography
    slide.addText(kpiData.label, {
      x: x + 0.15,
      y: y + h * 0.65,
      w: w - 0.3,
      h: h * 0.35 - 0.15,
      fontSize: 16,
      fontFace: this.theme.typography?.fontFamily?.body || 'Inter',
      color: this.theme.colors.foreground,
      align: 'center',
      valign: 'top',
      bold: true
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

    // Add quote text - handle rich text segments
    const testimonial = item.data as any;
    if (Array.isArray(testimonial.quote)) {
      const richTextSegments = testimonial.quote.map((segment: any) => ({
        text: segment.text,
        options: {
          color: this.validateColor(segment.formatting?.color) || this.theme.colors.foreground,
          fontSize: segment.formatting?.fontSize || 14,
          bold: segment.formatting?.bold,
          italic: segment.formatting?.italic !== false, // Default to italic for testimonials
          underline: segment.formatting?.underline ? { style: 'single' } : undefined,
        }
      }));

      slide.addText(richTextSegments, {
        x: x + 0.1,
        y: y + 0.4,
        w: w - 0.2,
        h: h * 0.6,
        align: 'left',
        valign: 'top',
        wrap: true
      });
    } else {
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
    }

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

    // Add button text - handle rich text segments
    const btn = item.data as any;
    if (Array.isArray(btn.text)) {
      const richTextSegments = btn.text.map((segment: any) => ({
        text: segment.text,
        options: {
          color: this.validateColor(segment.formatting?.color) || this.theme.colors.background,
          fontSize: segment.formatting?.fontSize || 16,
          bold: segment.formatting?.bold !== false, // Default to bold for buttons
          italic: segment.formatting?.italic,
          underline: segment.formatting?.underline ? { style: 'single' } : undefined,
        }
      }));

      slide.addText(richTextSegments, {
        x, y, w, h,
        align: 'center',
        valign: 'middle'
      });
    } else {
      slide.addText(String(btn.text ?? 'Click Here'), {
        x, y, w, h,
        fontSize: 16,
        color: this.theme.colors.background,
        bold: true,
        align: 'center',
        valign: 'middle'
      });
    }
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
        headers.map((text) => ({
          text,
          options: {
            bold: true,
            color: this.theme.colors.foreground,
            fill: this.theme.colors.primary,
            fontFace: this.theme.typography?.fontFamily?.heading || 'Space Grotesk',
            fontSize: 16,
            align: 'center'
          }
        }))
      ];
      rows.forEach((r, idx) => {
        const fill = idx % 2 === 0 ? zebraFillA : zebraFillB;
        tableRows.push(r.map((text) => ({
          text: String(text),
          options: {
            color: this.theme.colors.foreground,
            fill,
            fontFace: this.theme.typography?.fontFamily?.body || 'Inter',
            fontSize: 14,
            align: 'center'
          }
        })));
      });

      addTable.call(slide, tableRows, {
        x, y, w, h,
        border: { type: 'solid', color: this.theme.colors.border, pt: 1 },
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
      if (this.assetsBasePath) {
        const baseJoined = path.isAbsolute(src) ? src : path.join(this.assetsBasePath, src);
        tryPaths.push(baseJoined);
      }
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
    summarySlide.background = { color: this.slideBgColor };

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

  private addRichTextToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    const richTextData = item.data as any;
    const fontSize = this.getRichTextFontSize(richTextData.size || 'base', richTextData.type);
    const color = this.getRichTextColor(richTextData.variant);
    const fontFamily = richTextData.fontFamily ||
      (richTextData.type === 'header' || richTextData.type === 'subheader'
        ? this.theme.typography?.fontFamily?.heading || 'Space Grotesk'
        : this.theme.typography?.fontFamily?.body || 'Inter');
    const letterSpacing = this.getLetterSpacingValue(richTextData.letterSpacing);
    const lineHeight = richTextData.lineHeight ? this.getLineHeightValue(richTextData.lineHeight) : undefined;
    const textShadow = richTextData.textShadow ? { type: 'outer', color: '000000', opacity: 0.25, blur: 2, angle: 45, offset: 2 } : undefined;

    // Handle rich text segments
    if (Array.isArray(richTextData.content)) {
      const richTextSegments = richTextData.content.map((segment: any) => {
        const segmentOptions: any = {
          text: segment.text,
          options: {
            color: this.validateColor(segment.formatting?.color) || color,
            fontSize: segment.formatting?.fontSize || fontSize,
            bold: segment.formatting?.bold || (richTextData.type === 'header' || richTextData.type === 'subheader'),
            italic: segment.formatting?.italic || (richTextData.type === 'blockquote'),
            underline: segment.formatting?.underline ? { style: 'single' } : undefined,
            fontFace: fontFamily,
            shadow: segment.formatting?.textShadow || textShadow,
          }
        };
        return segmentOptions;
      });

      slide.addText(richTextSegments, {
        x, y, w, h,
        align: richTextData.align || 'left',
        valign: 'top',
        wrap: true,
        lineSpacing: lineHeight,
        charSpacing: letterSpacing,
        shadow: textShadow
      });
    } else {
      // Simple rich text
      slide.addText(richTextData.content, {
        x, y, w, h,
        fontSize,
        color,
        align: richTextData.align || 'left',
        valign: 'top',
        fontFace: fontFamily,
        wrap: true,
        bold: richTextData.type === 'header' || richTextData.type === 'subheader',
        italic: richTextData.type === 'blockquote',
        lineSpacing: lineHeight,
        charSpacing: letterSpacing,
        shadow: textShadow
      });
    }
  }

  private addListToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    const listData = item.data as any;
    const fontSize = Math.min(this.getFontSize(listData.size || 'base'), 14); // Cap list font size

    // Group items to reduce number of text elements (better performance)
    const maxItemsPerGroup = 8;
    const groups = [];
    for (let i = 0; i < listData.items.length; i += maxItemsPerGroup) {
      groups.push(listData.items.slice(i, i + maxItemsPerGroup));
    }

    groups.forEach((group, groupIndex) => {
      let content = '';
      group.forEach((listItem: string, index: number) => {
        const globalIndex = groupIndex * maxItemsPerGroup + index;
        const bullet = listData.type === 'numbered' ? `${globalIndex + 1}.` :
                      listData.type === 'checklist' ? '✓' : '•';
        content += `${bullet} ${listItem}\n`;
      });

      const groupHeight = (h / groups.length);
      const groupY = y + (groupIndex * groupHeight);

      slide.addText(content.trim(), {
        x, y: groupY, w, h: groupHeight,
        fontSize,
        fontFace: this.theme.typography?.fontFamily?.body || 'Inter',
        color: this.theme.colors.foreground,
        align: 'left',
        valign: 'top',
        wrap: true
      });
    });
  }

  private addQuoteToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    const quoteData = item.data as any;
    const fontSize = Math.min(quoteData.variant === 'large' ? 24 : 18, 24); // Cap quote font size

    // Add quote mark as separate element for better performance
    if (quoteData.variant !== 'minimal') {
      slide.addText('"', {
        x: x + 0.05, y: y + 0.05, w: 0.3, h: 0.3,
        fontSize: fontSize + 4,
        color: this.theme.colors.primary,
        align: 'left',
        valign: 'top'
      });
    }

    // Add main quote text
    slide.addText(quoteData.text, {
      x: x + 0.1, y: y + 0.1, w: w - 0.2, h: h - (quoteData.author ? 0.8 : 0.2),
      fontSize,
      color: this.theme.colors.foreground,
      align: quoteData.align === 'center' ? 'center' : 'left',
      valign: 'middle',
      wrap: true,
      italic: quoteData.variant !== 'minimal'
    });

    // Add author attribution separately
    if (quoteData.author) {
      const authorText = `— ${quoteData.author}${quoteData.role ? `, ${quoteData.role}` : ''}${quoteData.company ? `, ${quoteData.company}` : ''}`;
      slide.addText(authorText, {
        x: x + 0.1, y: y + h - 0.6, w: w - 0.2, h: 0.4,
        fontSize: Math.max(fontSize - 4, 10),
        color: this.theme.colors.muted || '#6b7280',
        align: quoteData.align === 'center' ? 'center' : 'right',
        valign: 'top',
        wrap: true
      });
    }
  }

  private addCodeToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    const codeData = item.data as any;
    const fontSize = Math.min(this.getFontSize(codeData.size || 'base'), 12); // Cap code font size for performance

    // Add a background rectangle for code
    slide.addShape('rect', {
      x, y, w, h,
      fill: { color: codeData.theme === 'dark' ? '1f2937' : 'f8fafc' },
      line: { color: this.theme.colors.border, width: 1 }
    });

    // Add code content with simplified font (no font embedding attempts)
    slide.addText(codeData.code, {
      x: x + 0.1, y: y + 0.1, w: w - 0.2, h: h - 0.2,
      fontSize,
      color: codeData.theme === 'dark' ? 'f9fafb' : '1e293b',
      align: 'left',
      valign: 'top',
      wrap: true
    });
  }

  private addNoteToSlide(slide: PptxGenJS.Slide, item: DeckItem, x: number, y: number, w: number, h: number): void {
    const noteData = item.data as any;
    const fontSize = Math.min(this.getFontSize(noteData.size || 'base'), 14); // Cap note font size

    const noteColors = {
      info: '3b82f6',
      warning: 'f59e0b',
      success: '10b981',
      error: 'ef4444',
      tip: '8b5cf6'
    };

    const bgColor = noteColors[noteData.type as keyof typeof noteColors] || '3b82f6';

    // Simplified: Use single text box with background color instead of separate shape
    let content = '';
    if (noteData.title) {
      content += `${noteData.title.toUpperCase()}: `;
    }
    content += noteData.content;

    // Single text element with background for better performance
    slide.addText(content, {
      x: x + 0.15, y: y + 0.1, w: w - 0.3, h: h - 0.2,
      fontSize,
      color: '#1f2937', // Dark text for better contrast on colored backgrounds
      align: 'left',
      valign: 'top',
      wrap: true,
      fill: { color: bgColor + '15' }, // Subtle background
      line: { color: bgColor, width: 1 }
    });
  }

  private getRichTextFontSize(size: string, type: string): number {
    // Use theme typography if available
    if (this.theme.typography?.fontSize?.[size as keyof typeof this.theme.typography.fontSize]) {
      let fontSize = this.theme.typography.fontSize[size as keyof typeof this.theme.typography.fontSize];

      // Adjust based on type
      switch (type) {
        case 'header':
          fontSize = Math.max(fontSize + 4, 18);
          break;
        case 'subheader':
          fontSize = Math.max(fontSize + 2, 16);
          break;
        case 'lead':
          fontSize = Math.max(fontSize + 2, 18);
          break;
      }

      return fontSize;
    }

    // Fallback base sizes
    const baseSizes: Record<string, number> = {
      'sm': 12,
      'base': 14,
      'lg': 18,
      'xl': 20,
      '2xl': 24
    };

    let fontSize = baseSizes[size] || 14;

    // Adjust based on type
    switch (type) {
      case 'header':
        fontSize += 4;
        break;
      case 'subheader':
        fontSize += 2;
        break;
      case 'lead':
        fontSize += 2;
        break;
    }

    return fontSize;
  }

  private getRichTextColor(variant?: string): string {
    switch (variant) {
      case 'muted':
        return this.theme.colors.muted || '#6b7280';
      case 'accent':
        return this.theme.colors.primary;
      default:
        return this.theme.colors.foreground;
    }
  }

  private getFontSize(size: string): number {
    // Use theme typography if available, fallback to responsive sizes
    if (this.theme.typography?.fontSize?.[size as keyof typeof this.theme.typography.fontSize]) {
      return this.theme.typography.fontSize[size as keyof typeof this.theme.typography.fontSize];
    }

    // Fallback responsive sizes for PPTX (scaled down for better fit)
    const sizes: Record<string, number> = {
      'xs': 9,      // Smaller for better performance
      'sm': 11,     // Optimized sizes
      'base': 12,   // Standard readable size
      'lg': 14,     // Good for emphasis
      'xl': 16,     // Section headers
      '2xl': 18,    // Subheaders
      '3xl': 22,    // Main headers (reduced from 30)
      '4xl': 26,    // Hero text (reduced from 36)
      '5xl': 32     // Max size (reduced from 48)
    };
    return sizes[size] || 12;
  }

  // Color validation helper
  private validateColor(color?: string): string | undefined {
    if (!color) return undefined;

    // Support hex colors (#RGB, #RRGGBB)
    if (color.startsWith('#') && (color.length === 4 || color.length === 7)) {
      return color;
    }

    // Support named colors that PptxGenJS recognizes
    const validColors = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'purple', 'orange', 'gray'];
    if (validColors.includes(color.toLowerCase())) {
      return color;
    }

    // Return undefined for invalid colors (will fall back to theme default)
    return undefined;
  }

  // Letter spacing conversion helper
  private getLetterSpacingValue(spacing?: string): number | undefined {
    if (!spacing) return undefined;

    // Convert CSS letter-spacing to PptxGenJS charSpacing (points)
    // PptxGenJS charSpacing is in points, CSS letter-spacing is in ems
    const conversions: Record<string, number> = {
      'tight': -0.5,   // -0.025em ≈ -0.5 points
      'normal': 0,
      'wide': 0.5,     // 0.025em ≈ 0.5 points
      'wider': 1.0     // 0.05em ≈ 1.0 points
    };

    return conversions[spacing] || 0;
  }

  // Line height conversion helper
  private getLineHeightValue(height?: string): number | undefined {
    if (!height) return undefined;

    // Convert line height multipliers to PptxGenJS lineSpacing
    const conversions: Record<string, number> = {
      'none': 1.0,
      'tight': 1.25,
      'snug': 1.375,
      'normal': 1.5,
      'relaxed': 1.625,
      'loose': 2.0
    };

    return conversions[height] || 1.5;
  }

  // Theme → PPTX helpers
  private computeBackgroundColor(theme: ThemeConfig): string {
    const gradient = theme.gradients?.background || '';
    const match = gradient.match(/linear-gradient\([^,]+,\s*([^\s,]+)\s*\d+%/i);
    if (match && match[1]) {
      const color = match[1];
      if (typeof color === 'string' && color.startsWith('#') && (color.length === 7 || color.length === 4)) {
        return color;
      }
    }
    // fallback to solid background color
    return theme.colors.background;
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
    outputPath: options.outputPath,
    titleSlide: options.titleSlide,
    assetsBasePath: options.assetsBasePath
  });
  await exporter.generateDeck();
  await exporter.save(options.outputPath);
}
