# Theme Reference

Complete theme definitions and visual styles.

## Available Themes

### metallic-earth
**Style**: Cyan accents, dark backgrounds, metallic gradients  
**Best for**: Tech products, futuristic concepts, innovation  
**Colors**: Primary #00FFFF, Secondary #FF6B35, Dark gradients

### corporate-blue
**Style**: Professional blue palette, clean white backgrounds  
**Best for**: Business presentations, corporate reports, formal decks  
**Colors**: Primary #0066CC, Secondary #004499, White background

### startup-green
**Style**: Fresh green theme, modern and energetic  
**Best for**: Startup pitches, growth stories, fresh concepts  
**Colors**: Primary #00D4AA, Secondary #00A67E, White background

### tech-purple
**Style**: Vibrant purple theme, dark backgrounds  
**Best for**: Tech innovation, SaaS products, creative tech  
**Colors**: Primary #8B5CF6, Secondary #7C3AED, Dark background

### warm-orange
**Style**: Warm, inviting orange theme  
**Best for**: Creative industries, design, marketing, brand stories  
**Colors**: Primary #FF6B35, Secondary #E55A2B, White background

## Theme Structure

Each theme includes:
- Color palette (primary, secondary, accent, background, foreground, muted, border)
- CSS gradients for web preview
- PPTX color mapping for export

See `resources/themes.json` for complete color definitions.

## Usage

Specify theme via CLI `--theme` parameter or in JSON input:

```json
{
  "theme": "tech-purple"
}
```

Theme affects all slides in the deck, including title slide and auto-generated slides.

