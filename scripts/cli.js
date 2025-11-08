#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');
// Note: exportToPptx is imported dynamically from exportPptx.js

const args = process.argv.slice(2);
const command = args[0];

if (command === 'generate' || command === 'gen') {
  generateDeck();
} else if (command === 'list-layouts') {
  listLayouts();
} else if (command === 'list-themes') {
  listThemes();
} else {
  showHelp();
}

function generateDeck() {
  const options = parseGenerateArgs();

  // Load optional input JSON if provided
  let inputData = null;
  if (options.input) {
    try {
      const inputPath = path.isAbsolute(options.input)
        ? options.input
        : path.join(process.cwd(), options.input);
      inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    } catch (error) {
      console.error('❌ Failed to read --input JSON:', error.message);
      process.exit(1);
    }
  }

  // Apply input overrides (JSON takes precedence over defaults)
  if (inputData) {
    if (inputData.theme) options.theme = inputData.theme;
    if (Array.isArray(inputData.slides)) options.slides = inputData.slides;
    // If slides provided via input, clear single-layout to avoid ambiguity
    if (options.slides && options.slides.length > 0) options.layout = undefined;
  }

  console.log('🎨 Marketing Deck Generator');
  console.log('===========================');
  if (options.slides && options.slides.length > 0) {
    console.log(`Slides: ${options.slides.length} (${options.slides.map(s => s.layout).join(', ')})`);
  } else {
    console.log(`Layout: ${options.layout}`);
  }
  console.log(`Theme: ${options.theme}`);
  console.log(`Output: ${options.output}`);
  if (options.input) {
    console.log(`Input: ${options.input}`);
  }
  console.log('');

  try {
    // Prefer compiled TS exporter (CommonJS) if present, else fallback to legacy JS
    let exportModule;
    const compiledPathA = path.join(__dirname, 'dist', 'exportPptx.js');
    const compiledPathB = path.join(__dirname, 'dist', 'scripts', 'exportPptx.js');
    if (fs.existsSync(compiledPathA)) {
      exportModule = require(compiledPathA);
    } else if (fs.existsSync(compiledPathB)) {
      exportModule = require(compiledPathB);
    } else {
      exportModule = require('./exportPptx.js');
    }

    exportModule.exportToPptx({
      layout: options.layout,
      slides: options.slides,
      theme: options.theme,
      outputPath: options.output,
      // Pass through optional input fields for richer customization
      titleSlide: inputData && inputData.titleSlide ? inputData.titleSlide : undefined,
      assetsBasePath: inputData && inputData.assetsBasePath ? inputData.assetsBasePath : undefined
    }).then(() => {
      console.log(`✅ Deck generated successfully: ${options.output}`);
    }).catch((error) => {
      console.error('❌ Error generating deck:', error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function parseGenerateArgs() {
  const options = {
    layout: 'data-grid-dashboard',
    theme: 'metallic-earth',
    output: 'deck.pptx',
    input: null,
    slides: null
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--layout':
      case '-l':
        if (nextArg) {
          options.layout = nextArg;
          i++;
        }
        break;
      case '--slides':
        if (nextArg) {
          // Parse comma-separated layouts: "layout1,layout2,layout3"
          options.slides = nextArg.split(',').map(layout => ({
            layout: layout.trim(),
            title: null,
            data: null
          }));
          i++;
        }
        break;
      case '--theme':
      case '-t':
        if (nextArg) {
          options.theme = nextArg;
          i++;
        }
        break;
      case '--output':
      case '-o':
        if (nextArg) {
          options.output = nextArg;
          i++;
        }
        break;
      case '--input':
      case '-i':
        if (nextArg) {
          options.input = nextArg;
          i++;
        }
        break;
      case '--help':
      case '-h':
        showGenerateHelp();
        process.exit(0);
        break;
    }
  }

  // Prepend output folder to relative paths that don't already include it
  if (options.output && !path.isAbsolute(options.output) && !options.output.startsWith('output/')) {
    options.output = path.join('output', options.output);
  }

  return options;
}

function listLayouts() {
  try {
    const layoutsPath = path.join(__dirname, '../resources/layouts.json');
    const layoutsData = JSON.parse(fs.readFileSync(layoutsPath, 'utf8'));

    console.log('📋 Available Layouts');
    console.log('===================');
    Object.entries(layoutsData.layouts).forEach(([key, layout]) => {
      console.log(`• ${key}: ${layout.description}`);
    });
  } catch (error) {
    console.error('❌ Error reading layouts:', error.message);
    process.exit(1);
  }
}

function listThemes() {
  try {
    const themesPath = path.join(__dirname, '../resources/themes.json');
    const themesData = JSON.parse(fs.readFileSync(themesPath, 'utf8'));

    console.log('🎨 Available Themes');
    console.log('==================');
    Object.entries(themesData.themes).forEach(([key, theme]) => {
      console.log(`• ${key}: ${theme.name}`);
    });
  } catch (error) {
    console.error('❌ Error reading themes:', error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log('🎨 Marketing Deck Generator CLI');
  console.log('================================');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/cli.js generate [options]  Generate a PPTX deck');
  console.log('  node scripts/cli.js list-layouts         List available layouts');
  console.log('  node scripts/cli.js list-themes          List available themes');
  console.log('  node scripts/cli.js --help               Show this help');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/cli.js generate --layout data-grid-dashboard --theme metallic-earth');
  console.log('  node scripts/cli.js generate -l photo-narrative-flow -t corporate-blue -o my-deck.pptx');
  console.log('  node scripts/cli.js list-layouts');
  console.log('');
  console.log('For more details on generate command:');
  console.log('  node scripts/cli.js generate --help');
}

function showGenerateHelp() {
  console.log('🎨 Generate Deck Command');
  console.log('========================');
  console.log('');
  console.log('Generate a PPTX presentation from layout templates.');
  console.log('Files are automatically saved to the "output/" folder.');
  console.log('');
  console.log('Options:');
  console.log('  -l, --layout <name>     Single layout template (default: data-grid-dashboard)');
  console.log('  --slides <layouts>      Multiple layouts: "layout1,layout2,layout3"');
  console.log('  -t, --theme <name>      Visual theme (default: metallic-earth)');
  console.log('  -o, --output <file>     Output filename (default: output/deck.pptx)');
  console.log('  -i, --input <file>      JSON file with custom data (optional)');
  console.log('  -h, --help              Show this help');
  console.log('');
  console.log('Available layouts:');
  console.log('  • bold-minimalist-hero');
  console.log('  • data-grid-dashboard');
  console.log('  • photo-narrative-flow');
  console.log('  • chart-showcase');
  console.log('  • testimonial-gallery');
  console.log('  • call-to-action');
  console.log('  • metrics-breakdown');
  console.log('  • comparison-table');
  console.log('');
  console.log('Available themes:');
  console.log('  • metallic-earth');
  console.log('  • corporate-blue');
  console.log('  • startup-green');
  console.log('  • tech-purple');
  console.log('  • warm-orange');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/cli.js generate');
  console.log('  node scripts/cli.js generate --layout photo-narrative-flow --theme corporate-blue');
  console.log('  node scripts/cli.js generate --slides "bold-minimalist-hero,data-grid-dashboard,testimonial-gallery" --theme tech-purple');
  console.log('  node scripts/cli.js generate -l chart-showcase -t tech-purple -o analysis.pptx');
}
