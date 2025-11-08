import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { tmpdir } from 'os';
import { createRequire } from 'module';
import { DeckGenerationError, extractDeckRequestFromPayload, generateDeckFromRequest } from '@/lib/content-generator';

// Import DeckExporter from compiled scripts
// Use createRequire to properly load CommonJS modules in ES module context
function loadDeckExporter() {
  const possiblePaths = [
    path.join(process.cwd(), 'scripts', 'dist', 'scripts', 'exportPptx.js'),
    path.join(process.cwd(), 'scripts', 'dist', 'exportPptx.js'),
    path.join(process.cwd(), 'scripts', 'exportPptx.js'),
  ];

  const errors: string[] = [];
  
  // Create a require function using the project root (where package.json is)
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  let nodeRequire: NodeRequire;
  try {
    nodeRequire = createRequire(packageJsonPath);
    if (typeof nodeRequire !== 'function') {
      throw new Error(`createRequire returned ${typeof nodeRequire}, expected function`);
    }
  } catch (createError: any) {
    throw new Error(`Failed to create require function: ${createError.message}`);
  }

  for (const exportPath of possiblePaths) {
    try {
      if (fs.existsSync(exportPath)) {
        const absolutePath = path.resolve(exportPath);
        
        // Clear cache to ensure fresh load
        if (nodeRequire.cache && nodeRequire.cache[absolutePath]) {
          delete nodeRequire.cache[absolutePath];
        }
        
        // Use createRequire to load the CommonJS module with absolute path
        try {
          console.log(`Attempting to require: ${absolutePath}`);
          console.log(`nodeRequire type: ${typeof nodeRequire}`);
          const module = nodeRequire(absolutePath);
          console.log(`Module loaded, keys: ${Object.keys(module).join(', ')}`);
          const DeckExporter = module.DeckExporter || module.default?.DeckExporter;
          if (DeckExporter && typeof DeckExporter === 'function') {
            console.log('DeckExporter found and is a function');
            return DeckExporter;
          }
          errors.push(`${exportPath}: DeckExporter not found or not a function. Exports: ${Object.keys(module).join(', ')}`);
        } catch (requireError: any) {
          console.error(`Require error for ${absolutePath}:`, requireError);
          errors.push(`${exportPath}: require error: ${requireError.message || String(requireError)}`);
        }
      } else {
        errors.push(`${exportPath}: File does not exist`);
      }
    } catch (error: any) {
      errors.push(`${exportPath}: ${error.message || String(error)}`);
      continue;
    }
  }

  throw new Error(`DeckExporter not found. Tried:\n${errors.join('\n')}\n\nPlease run: npm run build:exporter`);
}

export async function POST(request: NextRequest) {
  try {
    // Load DeckExporter lazily
    console.log('Loading DeckExporter...');
    const DeckExporter = loadDeckExporter();
    console.log('DeckExporter loaded successfully:', typeof DeckExporter);
    
    const body = await request.json();
    const { layout, layouts } = body;
    let { theme } = body;
    const filename = body.filename || 'deck.pptx';

    let generatedDeck: ReturnType<typeof generateDeckFromRequest> | null = null;

    // Determine slides to export
    let slides: Array<{ layout: string; title?: string; subtitle?: string; description?: string; items?: Array<{ i: string; data: any }>; notes?: string }> | undefined;

    const deckRequest = extractDeckRequestFromPayload(body);
    if (deckRequest) {
      try {
        generatedDeck = generateDeckFromRequest(deckRequest);
      } catch (error: unknown) {
        const generationError = error as DeckGenerationError;
        const response = generationError?.details?.errors?.length
          ? generationError.details.errors.join('\n')
          : generationError?.message ?? 'Failed to generate deck';
        return NextResponse.json(
          { error: response },
          { status: 400 }
        );
      }
      if (generatedDeck.warnings?.length) {
        generatedDeck.warnings.forEach((warning) => console.warn(`⚠️  ${warning}`));
      }
      slides = generatedDeck.slides.map((slide) => ({
        layout: slide.layout,
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        items: slide.items,
        notes: slide.notes,
      }));
      if (!theme && generatedDeck.theme) {
        theme = generatedDeck.theme;
      }
    }

    if (!slides) {
      if (layouts && Array.isArray(layouts) && layouts.length > 0) {
        slides = layouts.map((layoutKey: string) => ({
          layout: layoutKey,
          title: formatLayoutName(layoutKey)
        }));
      } else if (layout) {
        slides = [{
          layout: layout,
          title: formatLayoutName(layout)
        }];
      } else {
        return NextResponse.json(
          { error: 'Either layout/layouts or deckRequest data is required' },
          { status: 400 }
        );
      }
    }

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme is required (provide via request.theme or deckRequest.theme)' },
        { status: 400 }
      );
    }

    // Create temporary file path
    const tempDir = tmpdir();
    const tempFileName = `deck-${Date.now()}.pptx`;
    const tempFilePath = path.join(tempDir, tempFileName);

    // Generate the deck
    const exporter = new DeckExporter({
      theme,
      slides,
      outputPath: tempFilePath,
      titleSlide: generatedDeck?.titleSlide ?? body.titleSlide,
      assetsBasePath: generatedDeck?.assetsBasePath ?? body.assetsBasePath
    });

    await exporter.generateDeck();
    await exporter.save(tempFilePath);

    // Read the generated file
    const fileBuffer = fs.readFileSync(tempFilePath);

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);

    // Return the file as a download
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to export PPTX' },
      { status: 500 }
    );
  }
}

function formatLayoutName(layoutKey: string): string {
  return layoutKey
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

