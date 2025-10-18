"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeckExporter = void 0;
exports.exportToPptx = exportToPptx;
const pptxgenjs_1 = require("pptxgenjs");
const fs_1 = require("fs");
const path_1 = require("path");
const layouts_json_1 = require("../resources/layouts.json");
const themes_json_1 = require("../resources/themes.json");
class DeckExporter {
    constructor(options) {
        this.pptx = new pptxgenjs_1.default();
        this.theme = themes_json_1.default.themes[options.theme];
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
            this.layout = layouts_json_1.default.layouts[options.layout];
            if (!this.layout) {
                throw new Error(`Layout '${options.layout}' not found`);
            }
        }
        // Handle multiple slides
        if (options.slides) {
            this.slides = options.slides.map(slide => {
                const layoutConfig = layouts_json_1.default.layouts[slide.layout];
                if (!layoutConfig) {
                    throw new Error(`Layout '${slide.layout}' not found`);
                }
                return Object.assign(Object.assign({}, slide), { layoutConfig });
            });
        }
    }
    async generateDeck() {
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
        }
        else if (this.layout) {
            console.log('🎨 Creating single content slide...');
            this.createContentSlide();
        }
        // Add additional slides if needed
        console.log('✨ Adding additional slides...');
        this.addAdditionalSlides();
        console.log('✅ Deck generation complete!');
    }
    createTitleSlide() {
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
    createContentSlide() {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.theme.colors.background };
        // Process layout items and convert to PPTX elements
        if (this.layout) {
            this.layout.items.forEach((item) => {
                this.addItemToSlide(slide, item);
            });
        }
    }
    createContentSlideFromConfig(slideConfig, slideIndex) {
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
        // Process layout items and convert to PPTX elements
        if (slideConfig.layoutConfig) {
            console.log(`    Processing ${slideConfig.layoutConfig.items.length} layout items...`);
            slideConfig.layoutConfig.items.forEach((item) => {
                this.addItemToSlide(slide, item);
            });
        }
        else {
            console.log(`    ⚠️  No layout config found for ${slideConfig.layout}`);
        }
    }
    addItemToSlide(slide, item) {
        const scaleX = 10 / 12; // Convert from 12-column grid to PPTX width
        const scaleY = 5.625 / 10; // Convert from 10-row grid to PPTX height
        const x = (item.x * scaleX) + 0.1;
        const y = (item.y * scaleY * 0.6) + 0.1; // Scale down Y to fit better
        const w = item.w * scaleX - 0.2;
        const h = item.h * scaleY * 0.6 - 0.2;
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
    addTextToSlide(slide, item, x, y, w, h) {
        const textData = item.data;
        const fontSize = this.getFontSize(textData.size || 'base');
        const align = textData.align || 'left';
        slide.addText(textData.text, {
            x, y, w, h,
            fontSize,
            color: this.theme.colors.foreground,
            align: align,
            valign: 'middle',
            bold: textData.weight === 'bold',
            wrap: true
        });
    }
    addHeaderToSlide(slide, item, x, y, w, h) {
        const headerData = item.data;
        // Add title
        slide.addText(headerData.title, {
            x: x + 0.2,
            y: y + 0.1,
            w: w - 0.4,
            h: h * 0.6,
            fontSize: 32,
            color: this.theme.colors.primary,
            bold: true,
            align: 'left',
            valign: 'top',
            wrap: true
        });
        // Add subtitle if present
        if (headerData.subtitle) {
            slide.addText(headerData.subtitle, {
                x: x + 0.2,
                y: y + h * 0.5,
                w: w - 0.4,
                h: h * 0.3,
                fontSize: 18,
                color: this.theme.colors.foreground,
                align: 'left',
                valign: 'top',
                wrap: true
            });
        }
        // Add decorative divider line if enabled (default true)
        if (headerData.showDivider !== false) {
            slide.addShape('line', {
                x: x + 0.2,
                y: y + h - 0.15,
                w: w - 0.4,
                h: 0,
                line: {
                    color: this.theme.colors.primary,
                    width: 3,
                    dash: 'solid'
                }
            });
        }
    }
    addKpiCardToSlide(slide, item, x, y, w, h) {
        const kpiData = item.data;
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
    addChartToSlide(slide, item, x, y, w, h) {
        var _a;
        // For now, add a placeholder. In a full implementation, you'd convert chart data to PPTX chart
        slide.addText('Chart Placeholder', {
            x, y, w, h,
            fontSize: 16,
            color: this.theme.colors.foreground,
            align: 'center',
            valign: 'middle'
        });
        // Add chart data as text below
        const dataText = ((_a = item.data.data) === null || _a === void 0 ? void 0 : _a.map((d) => `${d.name}: ${d.value}`).join('\n')) || 'Sample data';
        slide.addText(dataText, {
            x, y: y + h * 0.3, w, h: h * 0.7,
            fontSize: 10,
            color: this.theme.colors.muted,
            align: 'left',
            valign: 'top',
            wrap: true
        });
    }
    addTestimonialToSlide(slide, item, x, y, w, h) {
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
        slide.addText(item.data.quote, {
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
        slide.addText(`— ${item.data.author}`, {
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
        if (item.data.change) {
            const changeText = item.data.change > 0 ? `+${item.data.change}` : item.data.change.toString();
            const changeColor = item.data.change > 0 ? '00AA00' : 'AA0000';
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
        // Add button background
        slide.addShape('rect', {
            x, y, w, h,
            fill: { color: this.theme.colors.primary },
            line: { color: this.theme.colors.primary, width: 2 },
            roundRect: true
        });
        // Add button text
        slide.addText(item.data.text, {
            x, y, w, h,
            fontSize: 16,
            color: this.theme.colors.background,
            bold: true,
            align: 'center',
            valign: 'middle'
        });
    }
    addAdditionalSlides() {
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
        outputPath: options.outputPath
    });
    await exporter.generateDeck();
    await exporter.save(options.outputPath);
}
