"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeckExporter = void 0;
exports.exportToPptx = exportToPptx;
const pptxgenjs_1 = __importDefault(require("pptxgenjs"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load configuration JSON at runtime with robust path resolution for both source and dist builds
function readJsonResource(relativePathFromResources) {
    const candidates = [
        // When compiled: scripts/dist/scripts -> scripts/dist/resources
        path_1.default.join(__dirname, '../resources', relativePathFromResources),
        // When compiled but need root resources: scripts/dist/scripts -> ../../.. -> project root/resources
        path_1.default.join(__dirname, '../../../resources', relativePathFromResources),
        // When running from source: scripts -> ../resources
        path_1.default.join(__dirname, '../resources', relativePathFromResources)
    ];
    for (const p of candidates) {
        try {
            if (fs_1.default.existsSync(p)) {
                return JSON.parse(fs_1.default.readFileSync(p, 'utf8'));
            }
        }
        catch {
            // ignore and try next
        }
    }
    // Fallback to project root using CWD
    const cwdPath = path_1.default.join(process.cwd(), 'resources', relativePathFromResources);
    if (fs_1.default.existsSync(cwdPath)) {
        return JSON.parse(fs_1.default.readFileSync(cwdPath, 'utf8'));
    }
    throw new Error(`Resource not found: ${relativePathFromResources}`);
}
const themesData = readJsonResource('themes.json');
const layoutsData = readJsonResource('layouts.json');
class DeckExporter {
    constructor(options) {
        this.pptx = new pptxgenjs_1.default();
        this.theme = themesData.themes[options.theme];
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
            this.layout = layoutsData.layouts[options.layout];
            if (!this.layout) {
                throw new Error(`Layout '${options.layout}' not found`);
            }
        }
        // Handle multiple slides
        if (options.slides) {
            this.slides = options.slides.map(slide => {
                const layoutConfig = layoutsData.layouts[slide.layout];
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
    async generateDeck() {
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
        }
        else if (this.layout) {
            console.log('🎨 Creating single content slide...');
            this.createContentSlide();
        }
        // Add additional slides if needed
        console.log('✨ Adding additional slides...');
        this.addAdditionalSlides();
        const totalTime = Date.now() - startTime;
        console.log(`✅ Deck generation complete in ${totalTime}ms!`);
    }
    createTitleSlide() {
        var _a, _b, _c, _d, _e;
        const slide = this.pptx.addSlide();
        // Add background
        slide.background = { color: this.slideBgColor };
        // Add title
        const title = ((_a = this.titleSlide) === null || _a === void 0 ? void 0 : _a.title) || 'Marketing Presentation';
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
        const subtitleParts = [];
        if ((_b = this.titleSlide) === null || _b === void 0 ? void 0 : _b.subtitle)
            subtitleParts.push(this.titleSlide.subtitle);
        const meta = [];
        if ((_c = this.titleSlide) === null || _c === void 0 ? void 0 : _c.author)
            meta.push(this.titleSlide.author);
        if ((_d = this.titleSlide) === null || _d === void 0 ? void 0 : _d.company)
            meta.push(this.titleSlide.company);
        if ((_e = this.titleSlide) === null || _e === void 0 ? void 0 : _e.date)
            meta.push(this.titleSlide.date);
        if (meta.length > 0)
            subtitleParts.push(meta.join(' • '));
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
    createContentSlide() {
        var _a;
        const slide = this.pptx.addSlide();
        slide.background = { color: this.slideBgColor };
        // Process layout items and convert to PPTX elements
        if (this.layout) {
            this.currentMapping = this.computeMapping(this.layout);
            const gridCols = this.currentMapping.gridCols;
            // If an explicit header exists on the layout, render it first and offset content below it
            const explicitHeader = this.layout.header;
            const headerHeightRows = (_a = explicitHeader === null || explicitHeader === void 0 ? void 0 : explicitHeader.h) !== null && _a !== void 0 ? _a : 4;
            if (explicitHeader) {
                // Render explicit header
                this.addItemToSlide(slide, explicitHeader, gridCols);
            }
            this.layout.items.forEach((item) => {
                // Skip double-rendering the explicit header if it appears in items
                if (explicitHeader && item.i === explicitHeader.i)
                    return;
                // Offset items that would overlap the header
                const needsOffset = !!explicitHeader;
                const newY = needsOffset && item.y < headerHeightRows ? item.y + headerHeightRows : item.y;
                const offsetItem = needsOffset ? { ...item, y: newY } : item;
                this.addItemToSlide(slide, offsetItem, gridCols);
            });
        }
    }
    createContentSlideFromConfig(slideConfig, slideIndex) {
        var _a, _b, _c, _d, _e, _f, _g;
        console.log(`  📊 Creating slide ${slideIndex + 1} with layout: ${slideConfig.layout}`);
        const slide = this.pptx.addSlide();
        slide.background = { color: this.slideBgColor };
        // Header policy: use layout.header if provided and autoHeader !== true; otherwise inject auto header except for hero/cta
        const skipHeaderLayouts = ['call-to-action', 'bold-minimalist-hero'];
        const explicitHeader = (_a = slideConfig.layoutConfig) === null || _a === void 0 ? void 0 : _a.header;
        const autoHeader = ((_b = slideConfig.layoutConfig) === null || _b === void 0 ? void 0 : _b.autoHeader) !== false && !explicitHeader && !skipHeaderLayouts.includes(slideConfig.layout);
        const headerHeightRows = (_c = explicitHeader === null || explicitHeader === void 0 ? void 0 : explicitHeader.h) !== null && _c !== void 0 ? _c : 4;
        // Process layout items and convert to PPTX elements
        if (slideConfig.layoutConfig) {
            console.log(`    Processing ${slideConfig.layoutConfig.items.length} layout items...`);
            this.currentMapping = this.computeMapping(slideConfig.layoutConfig);
            const gridCols = this.currentMapping.gridCols;
            // Add header: explicit first (merged with slide title if provided), else auto if allowed
            if (explicitHeader) {
                const mergedExplicitHeader = {
                    ...explicitHeader,
                    data: {
                        ...explicitHeader.data,
                        // If slide provides a custom title, prefer it over layout header title
                        title: (_d = slideConfig.title) !== null && _d !== void 0 ? _d : (_e = explicitHeader.data) === null || _e === void 0 ? void 0 : _e.title
                    }
                };
                this.addItemToSlide(slide, mergedExplicitHeader, gridCols);
            }
            else if (autoHeader) {
                const headerItem = {
                    i: 'auto-header',
                    x: 0,
                    y: 0,
                    w: gridCols,
                    h: headerHeightRows,
                    type: 'header',
                    data: {
                        title: (_f = slideConfig.title) !== null && _f !== void 0 ? _f : this.formatLayoutName(slideConfig.layout),
                        subtitle: ((_g = slideConfig.layoutConfig) === null || _g === void 0 ? void 0 : _g.description) || '',
                        showDivider: true
                    }
                };
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
            const itemsWithOverrides = this.applyItemOverrides(slideConfig.layoutConfig.items, slideConfig);
            itemsWithOverrides.forEach((item) => {
                // If explicit header exists, keep its own grid position; otherwise, offset items under auto header
                if (explicitHeader && item.i === explicitHeader.i) {
                    return; // avoid double-rendering explicit header
                }
                // When explicit header exists, offset only items that would overlap header
                if (explicitHeader) {
                    const newY = item.y < headerHeightRows ? item.y + headerHeightRows : item.y;
                    const offsetItem = { ...item, y: newY };
                    this.addItemToSlide(slide, offsetItem, gridCols);
                    return;
                }
                const needsOffset = autoHeader;
                const offsetItem = needsOffset ? { ...item, y: item.y + headerHeightRows } : item;
                this.addItemToSlide(slide, offsetItem, gridCols);
            });
        }
        else {
            console.log(`    ⚠️  No layout config found for ${slideConfig.layout}`);
        }
    }
    applyItemOverrides(baseItems, slideConfig) {
        if (!Array.isArray(slideConfig.items) || slideConfig.items.length === 0)
            return baseItems;
        const overridesMap = new Map();
        for (const ov of slideConfig.items) {
            if (ov && typeof ov.i === 'string') {
                overridesMap.set(ov.i, ov);
            }
        }
        return baseItems.map((item) => {
            const ov = overridesMap.get(item.i);
            if (!ov)
                return item;
            const merged = {
                ...item,
                ...ov,
                data: { ...item.data, ...ov.data }
            };
            return merged;
        });
    }
    addItemToSlide(slide, item, gridCols = 12) {
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
    computeMapping(layoutConfig) {
        var _a, _b;
        const slideWidthInches = 10; // 16:9 width
        const baseRowHeightPx = 30; // baseline matches resources default
        const baseRowHeightInches = 0.45; // improved vertical rhythm
        const baseMarginPx = 10; // baseline matches resources default
        const grid = layoutConfig.grid || { cols: 12, rowHeight: baseRowHeightPx, margin: [baseMarginPx, baseMarginPx] };
        const gridCols = (_a = grid.cols) !== null && _a !== void 0 ? _a : 12;
        const rowHeightPx = (_b = grid.rowHeight) !== null && _b !== void 0 ? _b : baseRowHeightPx;
        const [marginXpx, marginYpx] = Array.isArray(grid.margin) && grid.margin.length >= 2 ? grid.margin : [baseMarginPx, baseMarginPx];
        const rowHeightInches = baseRowHeightInches * (rowHeightPx / baseRowHeightPx);
        const scaleX = marginXpx / baseMarginPx;
        const scaleY = marginYpx / baseMarginPx;
        const xPadInches = 0.15 * scaleX; // increased for better margins
        const wPadInches = 0.25 * scaleX; // increased for better spacing
        const yPadInches = 0.25 * scaleY; // increased for better vertical rhythm
        const hPadInches = 0.15 * scaleY; // increased for better breathing room
        return { gridCols, rowHeightInches, xPadInches, wPadInches, yPadInches, hPadInches, slideWidthInches };
    }
    toInchesX(gridX, gridCols = 12) {
        var _a, _b;
        const mapping = this.currentMapping || { gridCols, rowHeightInches: 0.42, xPadInches: 0.1, wPadInches: 0.2, yPadInches: 0.2, hPadInches: 0.1 };
        const slideWidthInches = (_b = (_a = this.currentMapping) === null || _a === void 0 ? void 0 : _a.slideWidthInches) !== null && _b !== void 0 ? _b : 10;
        return (gridX / mapping.gridCols) * slideWidthInches + mapping.xPadInches;
    }
    toInchesW(gridW, gridCols = 12) {
        var _a, _b;
        const mapping = this.currentMapping || { gridCols, rowHeightInches: 0.42, xPadInches: 0.1, wPadInches: 0.2, yPadInches: 0.2, hPadInches: 0.1 };
        const slideWidthInches = (_b = (_a = this.currentMapping) === null || _a === void 0 ? void 0 : _a.slideWidthInches) !== null && _b !== void 0 ? _b : 10;
        return (gridW / mapping.gridCols) * slideWidthInches - mapping.wPadInches;
    }
    toInchesY(gridY) {
        const mapping = this.currentMapping || { gridCols: 12, rowHeightInches: 0.42, xPadInches: 0.1, wPadInches: 0.2, yPadInches: 0.2, hPadInches: 0.1, slideWidthInches: 10 };
        return (gridY * mapping.rowHeightInches) + mapping.yPadInches;
    }
    toInchesH(gridH) {
        const mapping = this.currentMapping || { gridCols: 12, rowHeightInches: 0.42, xPadInches: 0.1, wPadInches: 0.2, yPadInches: 0.2, hPadInches: 0.1, slideWidthInches: 10 };
        const h = (gridH * mapping.rowHeightInches) - mapping.hPadInches;
        return h > 0 ? h : 0.1;
    }
    addTextToSlide(slide, item, x, y, w, h) {
        var _a, _b;
        const textData = item.data;
        const fontSize = this.getFontSize(textData.size || 'base');
        const align = textData.align || 'left';
        const color = this.validateColor(textData.color) || this.theme.colors.foreground;
        const fontFamily = textData.fontFamily || ((_b = (_a = this.theme.typography) === null || _a === void 0 ? void 0 : _a.fontFamily) === null || _b === void 0 ? void 0 : _b.body) || 'Inter';
        const letterSpacing = this.getLetterSpacingValue(textData.letterSpacing);
        const lineHeight = textData.lineHeight ? this.getLineHeightValue(textData.lineHeight) : undefined;
        // Handle rich text segments
        if (Array.isArray(textData.text)) {
            const richTextSegments = textData.text.map((segment) => {
                var _a, _b, _c, _d, _e;
                const segmentOptions = {
                    text: segment.text,
                    options: {
                        color: this.validateColor((_a = segment.formatting) === null || _a === void 0 ? void 0 : _a.color) || color,
                        fontSize: ((_b = segment.formatting) === null || _b === void 0 ? void 0 : _b.fontSize) || fontSize,
                        bold: ((_c = segment.formatting) === null || _c === void 0 ? void 0 : _c.bold) || textData.weight === 'bold',
                        italic: ((_d = segment.formatting) === null || _d === void 0 ? void 0 : _d.italic) || textData.weight === 'italic',
                        underline: ((_e = segment.formatting) === null || _e === void 0 ? void 0 : _e.underline) ? { style: 'single' } : undefined,
                        fontFace: fontFamily,
                    }
                };
                return segmentOptions;
            });
            slide.addText(richTextSegments, {
                x, y, w, h,
                align: align,
                valign: 'middle',
                fontFace: fontFamily,
                wrap: true,
                lineSpacing: lineHeight,
                charSpacing: letterSpacing
            });
        }
        else {
            // Simple text
            slide.addText(textData.text, {
                x, y, w, h,
                fontSize,
                color,
                align: align,
                valign: 'middle',
                fontFace: fontFamily,
                bold: textData.weight === 'bold',
                italic: textData.weight === 'italic',
                wrap: true,
                lineSpacing: lineHeight,
                charSpacing: letterSpacing
            });
        }
    }
    addHeaderToSlide(slide, item, x, y, w, h) {
        var _a, _b, _c, _d;
        const headerData = item.data;
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
                fontFace: ((_b = (_a = this.theme.typography) === null || _a === void 0 ? void 0 : _a.fontFamily) === null || _b === void 0 ? void 0 : _b.heading) || 'Space Grotesk',
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
                fontFace: ((_d = (_c = this.theme.typography) === null || _c === void 0 ? void 0 : _c.fontFamily) === null || _d === void 0 ? void 0 : _d.body) || 'Inter',
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
    formatLayoutName(layoutKey) {
        return layoutKey
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    addKpiCardToSlide(slide, item, x, y, w, h) {
        var _a, _b, _c, _d;
        const kpiData = item.data;
        // Add background rectangle with better styling
        slide.addShape('rect', {
            x, y, w, h,
            fill: { color: this.theme.colors.muted },
            line: { color: this.theme.colors.border, width: 1 }
        });
        // Use JetBrains Mono for numbers (with tabular figures and slashed zero)
        const numberFont = ((_b = (_a = this.theme.typography) === null || _a === void 0 ? void 0 : _a.fontFamily) === null || _b === void 0 ? void 0 : _b.mono) || 'JetBrains Mono';
        // Add metric value with proper number formatting
        if (Array.isArray(kpiData.metric)) {
            const richTextSegments = kpiData.metric.map((segment) => {
                var _a, _b, _c, _d, _e;
                return ({
                    text: segment.text,
                    options: {
                        color: this.validateColor((_a = segment.formatting) === null || _a === void 0 ? void 0 : _a.color) || this.theme.colors.primary,
                        fontSize: ((_b = segment.formatting) === null || _b === void 0 ? void 0 : _b.fontSize) || 36,
                        fontFace: numberFont,
                        bold: ((_c = segment.formatting) === null || _c === void 0 ? void 0 : _c.bold) !== false,
                        italic: (_d = segment.formatting) === null || _d === void 0 ? void 0 : _d.italic,
                        underline: ((_e = segment.formatting) === null || _e === void 0 ? void 0 : _e.underline) ? { style: 'single' } : undefined,
                    }
                });
            });
            slide.addText(richTextSegments, {
                x: x + 0.15,
                y: y + 0.15,
                w: w - 0.3,
                h: h * 0.65,
                align: 'center',
                valign: 'bottom',
                fontFace: numberFont
            });
        }
        else {
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
            fontFace: ((_d = (_c = this.theme.typography) === null || _c === void 0 ? void 0 : _c.fontFamily) === null || _d === void 0 ? void 0 : _d.body) || 'Inter',
            color: this.theme.colors.foreground,
            align: 'center',
            valign: 'top',
            bold: true
        });
    }
    addChartToSlide(slide, item, x, y, w, h) {
        const chartData = item.data || { type: 'bar', data: [] };
        const addChart = slide.addChart;
        if (typeof addChart === 'function' && Array.isArray(chartData.data) && chartData.data.length > 0) {
            try {
                const categories = chartData.data.map((d) => d.name || '');
                const values = chartData.data.map((d) => Number(d.value) || 0);
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
            }
            catch (_) {
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
    addTestimonialToSlide(slide, item, x, y, w, h) {
        var _a, _b;
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
        const testimonial = item.data;
        if (Array.isArray(testimonial.quote)) {
            const richTextSegments = testimonial.quote.map((segment) => {
                var _a, _b, _c, _d, _e;
                return ({
                    text: segment.text,
                    options: {
                        color: this.validateColor((_a = segment.formatting) === null || _a === void 0 ? void 0 : _a.color) || this.theme.colors.foreground,
                        fontSize: ((_b = segment.formatting) === null || _b === void 0 ? void 0 : _b.fontSize) || 14,
                        bold: (_c = segment.formatting) === null || _c === void 0 ? void 0 : _c.bold,
                        italic: ((_d = segment.formatting) === null || _d === void 0 ? void 0 : _d.italic) !== false, // Default to italic for testimonials
                        underline: ((_e = segment.formatting) === null || _e === void 0 ? void 0 : _e.underline) ? { style: 'single' } : undefined,
                    }
                });
            });
            slide.addText(richTextSegments, {
                x: x + 0.1,
                y: y + 0.4,
                w: w - 0.2,
                h: h * 0.6,
                align: 'left',
                valign: 'top',
                wrap: true
            });
        }
        else {
            slide.addText(String((_a = testimonial.quote) !== null && _a !== void 0 ? _a : 'This is a great product!'), {
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
        slide.addText(`— ${String((_b = testimonial.author) !== null && _b !== void 0 ? _b : 'Anonymous')}`, {
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
    addMetricCardToSlide(slide, item, x, y, w, h) {
        // Similar to KPI card but with change indicators
        this.addKpiCardToSlide(slide, item, x, y, w, h);
        // Add change indicator if available
        const metricData = item.data;
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
    addButtonToSlide(slide, item, x, y, w, h) {
        var _a;
        // Add button background
        slide.addShape('rect', {
            x, y, w, h,
            fill: { color: this.theme.colors.primary },
            line: { color: this.theme.colors.primary, width: 2 }
        });
        // Add button text - handle rich text segments
        const btn = item.data;
        if (Array.isArray(btn.text)) {
            const richTextSegments = btn.text.map((segment) => {
                var _a, _b, _c, _d, _e;
                return ({
                    text: segment.text,
                    options: {
                        color: this.validateColor((_a = segment.formatting) === null || _a === void 0 ? void 0 : _a.color) || this.theme.colors.background,
                        fontSize: ((_b = segment.formatting) === null || _b === void 0 ? void 0 : _b.fontSize) || 16,
                        bold: ((_c = segment.formatting) === null || _c === void 0 ? void 0 : _c.bold) !== false, // Default to bold for buttons
                        italic: (_d = segment.formatting) === null || _d === void 0 ? void 0 : _d.italic,
                        underline: ((_e = segment.formatting) === null || _e === void 0 ? void 0 : _e.underline) ? { style: 'single' } : undefined,
                    }
                });
            });
            slide.addText(richTextSegments, {
                x, y, w, h,
                align: 'center',
                valign: 'middle'
            });
        }
        else {
            slide.addText(String((_a = btn.text) !== null && _a !== void 0 ? _a : 'Click Here'), {
                x, y, w, h,
                fontSize: 16,
                color: this.theme.colors.background,
                bold: true,
                align: 'center',
                valign: 'middle'
            });
        }
    }
    addTableToSlide(slide, item, x, y, w, h) {
        const table = item.data || { headers: [], rows: [] };
        const headers = Array.isArray(table.headers) ? table.headers : [];
        const rows = Array.isArray(table.rows) ? table.rows : [];
        const addTable = slide.addTable;
        if (typeof addTable === 'function' && headers.length > 0) {
            const zebraFillA = this.theme.colors.background;
            const zebraFillB = this.theme.colors.muted;
            const tableRows = [
                headers.map((text) => {
                    var _a, _b;
                    return ({
                        text,
                        options: {
                            bold: true,
                            color: this.theme.colors.foreground,
                            fill: this.theme.colors.primary,
                            fontFace: ((_b = (_a = this.theme.typography) === null || _a === void 0 ? void 0 : _a.fontFamily) === null || _b === void 0 ? void 0 : _b.heading) || 'Space Grotesk',
                            fontSize: 16,
                            align: 'center'
                        }
                    });
                })
            ];
            rows.forEach((r, idx) => {
                const fill = idx % 2 === 0 ? zebraFillA : zebraFillB;
                tableRows.push(r.map((text) => {
                    var _a, _b;
                    return ({
                        text: String(text),
                        options: {
                            color: this.theme.colors.foreground,
                            fill,
                            fontFace: ((_b = (_a = this.theme.typography) === null || _a === void 0 ? void 0 : _a.fontFamily) === null || _b === void 0 ? void 0 : _b.body) || 'Inter',
                            fontSize: 14,
                            align: 'center'
                        }
                    });
                }));
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
    addPhotoCardToSlide(slide, item, x, y, w, h) {
        const data = item.data || {};
        const src = data.src;
        const addImage = slide.addImage;
        const imageOpts = { x, y, w, h, sizing: 'contain' };
        const tryPaths = [];
        if (typeof src === 'string') {
            if (this.assetsBasePath) {
                const baseJoined = path_1.default.isAbsolute(src) ? src : path_1.default.join(this.assetsBasePath, src);
                tryPaths.push(baseJoined);
            }
            if (path_1.default.isAbsolute(src))
                tryPaths.push(src);
            tryPaths.push(path_1.default.join(process.cwd(), src.replace(/^\//, '')));
            tryPaths.push(path_1.default.join(__dirname, '../public', src.replace(/^\//, '')));
        }
        let added = false;
        if (typeof addImage === 'function') {
            for (const p of tryPaths) {
                try {
                    if (fs_1.default.existsSync(p)) {
                        addImage.call(slide, { path: p, ...imageOpts });
                        added = true;
                        break;
                    }
                }
                catch {
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
    addTimelineToSlide(slide, item, x, y, w, h) {
        const data = item.data || {};
        const events = Array.isArray(data.events) ? data.events : [];
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
    addAdditionalSlides() {
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
    addRichTextToSlide(slide, item, x, y, w, h) {
        var _a, _b, _c, _d;
        const richTextData = item.data;
        const fontSize = this.getRichTextFontSize(richTextData.size || 'base', richTextData.type);
        const color = this.getRichTextColor(richTextData.variant);
        const fontFamily = richTextData.fontFamily ||
            (richTextData.type === 'header' || richTextData.type === 'subheader'
                ? ((_b = (_a = this.theme.typography) === null || _a === void 0 ? void 0 : _a.fontFamily) === null || _b === void 0 ? void 0 : _b.heading) || 'Space Grotesk'
                : ((_d = (_c = this.theme.typography) === null || _c === void 0 ? void 0 : _c.fontFamily) === null || _d === void 0 ? void 0 : _d.body) || 'Inter');
        const letterSpacing = this.getLetterSpacingValue(richTextData.letterSpacing);
        const lineHeight = richTextData.lineHeight ? this.getLineHeightValue(richTextData.lineHeight) : undefined;
        // Handle rich text segments
        if (Array.isArray(richTextData.content)) {
            const richTextSegments = richTextData.content.map((segment) => {
                var _a, _b, _c, _d, _e;
                const segmentOptions = {
                    text: segment.text,
                    options: {
                        color: this.validateColor((_a = segment.formatting) === null || _a === void 0 ? void 0 : _a.color) || color,
                        fontSize: ((_b = segment.formatting) === null || _b === void 0 ? void 0 : _b.fontSize) || fontSize,
                        bold: ((_c = segment.formatting) === null || _c === void 0 ? void 0 : _c.bold) || (richTextData.type === 'header' || richTextData.type === 'subheader'),
                        italic: ((_d = segment.formatting) === null || _d === void 0 ? void 0 : _d.italic) || (richTextData.type === 'blockquote'),
                        underline: ((_e = segment.formatting) === null || _e === void 0 ? void 0 : _e.underline) ? { style: 'single' } : undefined,
                        fontFace: fontFamily,
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
                charSpacing: letterSpacing
            });
        }
        else {
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
                charSpacing: letterSpacing
            });
        }
    }
    addListToSlide(slide, item, x, y, w, h) {
        const listData = item.data;
        const fontSize = Math.min(this.getFontSize(listData.size || 'base'), 14); // Cap list font size
        // Group items to reduce number of text elements (better performance)
        const maxItemsPerGroup = 8;
        const groups = [];
        for (let i = 0; i < listData.items.length; i += maxItemsPerGroup) {
            groups.push(listData.items.slice(i, i + maxItemsPerGroup));
        }
        groups.forEach((group, groupIndex) => {
            var _a, _b;
            let content = '';
            group.forEach((listItem, index) => {
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
                fontFace: ((_b = (_a = this.theme.typography) === null || _a === void 0 ? void 0 : _a.fontFamily) === null || _b === void 0 ? void 0 : _b.body) || 'Inter',
                color: this.theme.colors.foreground,
                align: 'left',
                valign: 'top',
                wrap: true
            });
        });
    }
    addQuoteToSlide(slide, item, x, y, w, h) {
        const quoteData = item.data;
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
    addCodeToSlide(slide, item, x, y, w, h) {
        const codeData = item.data;
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
    addNoteToSlide(slide, item, x, y, w, h) {
        const noteData = item.data;
        const fontSize = Math.min(this.getFontSize(noteData.size || 'base'), 14); // Cap note font size
        const noteColors = {
            info: '3b82f6',
            warning: 'f59e0b',
            success: '10b981',
            error: 'ef4444',
            tip: '8b5cf6'
        };
        const bgColor = noteColors[noteData.type] || '3b82f6';
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
    getRichTextFontSize(size, type) {
        var _a, _b;
        // Use theme typography if available
        if ((_b = (_a = this.theme.typography) === null || _a === void 0 ? void 0 : _a.fontSize) === null || _b === void 0 ? void 0 : _b[size]) {
            let fontSize = this.theme.typography.fontSize[size];
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
        const baseSizes = {
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
    getRichTextColor(variant) {
        switch (variant) {
            case 'muted':
                return this.theme.colors.muted || '#6b7280';
            case 'accent':
                return this.theme.colors.primary;
            default:
                return this.theme.colors.foreground;
        }
    }
    getFontSize(size) {
        var _a, _b;
        // Use theme typography if available, fallback to responsive sizes
        if ((_b = (_a = this.theme.typography) === null || _a === void 0 ? void 0 : _a.fontSize) === null || _b === void 0 ? void 0 : _b[size]) {
            return this.theme.typography.fontSize[size];
        }
        // Fallback responsive sizes for PPTX (scaled down for better fit)
        const sizes = {
            'xs': 9, // Smaller for better performance
            'sm': 11, // Optimized sizes
            'base': 12, // Standard readable size
            'lg': 14, // Good for emphasis
            'xl': 16, // Section headers
            '2xl': 18, // Subheaders
            '3xl': 22, // Main headers (reduced from 30)
            '4xl': 26, // Hero text (reduced from 36)
            '5xl': 32 // Max size (reduced from 48)
        };
        return sizes[size] || 12;
    }
    // Color validation helper
    validateColor(color) {
        if (!color)
            return undefined;
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
    getLetterSpacingValue(spacing) {
        if (!spacing)
            return undefined;
        // Convert CSS letter-spacing to PptxGenJS charSpacing (points)
        // PptxGenJS charSpacing is in points, CSS letter-spacing is in ems
        const conversions = {
            'tight': -0.5, // -0.025em ≈ -0.5 points
            'normal': 0,
            'wide': 0.5, // 0.025em ≈ 0.5 points
            'wider': 1.0 // 0.05em ≈ 1.0 points
        };
        return conversions[spacing] || 0;
    }
    // Line height conversion helper
    getLineHeightValue(height) {
        if (!height)
            return undefined;
        // Convert line height multipliers to PptxGenJS lineSpacing
        const conversions = {
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
    computeBackgroundColor(theme) {
        var _a;
        const gradient = ((_a = theme.gradients) === null || _a === void 0 ? void 0 : _a.background) || '';
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
    async save(outputPath = 'output/deck.pptx') {
        // Ensure output directory exists
        const outputDir = path_1.default.dirname(outputPath);
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        await this.pptx.writeFile({ fileName: outputPath });
    }
}
exports.DeckExporter = DeckExporter;
async function exportToPptx(options) {
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
