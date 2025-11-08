#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function loadGenerator() {
  const generatorPath = path.join(__dirname, 'dist', 'src', 'lib', 'content-generator.js');
  if (!fs.existsSync(generatorPath)) {
    throw new Error('Context generator not found. Run "npm run build:exporter" before executing this script.');
  }
  return require(generatorPath);
}

function main() {
  const [, , inputArg] = process.argv;
  const inputPath = inputArg
    ? (path.isAbsolute(inputArg) ? inputArg : path.join(process.cwd(), inputArg))
    : path.join(process.cwd(), 'resources', 'examples', 'sample-context-request.json');

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const generatorModule = loadGenerator();

  const deckRequest = generatorModule.extractDeckRequestFromPayload(payload);
  if (!deckRequest) {
    console.error('❌ No deckRequest data found in payload.');
    process.exit(1);
  }

  const generatedDeck = generatorModule.generateDeckFromRequest(deckRequest);

  console.log('🎯 Context-Driven Deck Generation Summary');
  console.log('=========================================');
  console.log(`Input: ${path.relative(process.cwd(), inputPath)}`);
  console.log(`Theme: ${generatedDeck.theme || 'inherit (fallback to CLI input)'}`);
  console.log(`Slides: ${generatedDeck.slides.length}`);
  console.log('');

  generatedDeck.slides.forEach((slide, index) => {
    const title = slide.title || 'Untitled';
    console.log(`${index + 1}. [${slide.layout}] ${title}`);
    if (slide.subtitle) {
      console.log(`   Subtitle: ${slide.subtitle}`);
    }
    if (slide.description) {
      console.log(`   Description: ${slide.description}`);
    }
    if (slide.items?.length) {
      const itemTypes = slide.items.map((item) => item.i).join(', ');
      console.log(`   Items: ${itemTypes}`);
    }
    if (slide.notes) {
      console.log(`   Notes: ${slide.notes}`);
    }
  });

  if (generatedDeck.warnings?.length) {
    console.log('');
    console.log('Warnings:');
    generatedDeck.warnings.forEach((warning) => console.log(` - ${warning}`));
  }
}

main();


