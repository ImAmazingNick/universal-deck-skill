# Basic Deck Generation Workflow

Standard workflow for generating PowerPoint presentations.

## Workflow Steps

1. **Prepare Input Data**
   - Choose layout(s) or use context-driven approach
   - Select theme
   - Prepare JSON input if customizing slides

2. **Execute Generation**
   ```bash
   node scripts/cli.js generate --layout "layout-name" --theme "theme-name" --output deck.pptx
   ```

3. **Verify Output**
   - Check `output/` directory for generated PPTX file
   - Open file to verify content and formatting

## Input Methods

### Method 1: CLI Parameters (Simple)
```bash
node scripts/cli.js generate --layout "data-grid-dashboard" --theme "corporate-blue"
```

### Method 2: JSON Input (Customized)
```bash
node scripts/cli.js generate --input resources/examples/sample-input.json --output custom.pptx
```

### Method 3: Context-Driven (Auto-Generated)
```bash
node scripts/cli.js generate --input resources/examples/sample-context-request.json --output auto.pptx
```

## Common Patterns

### Single Layout Deck
Quick single-slide generation for specific content types.

### Multi-Layout Deck
Combine multiple layouts for comprehensive presentations.

### Context-Driven Deck
Provide strategic context and let the generator create appropriate slides automatically.

See `examples/quick-start.md` for detailed examples.

