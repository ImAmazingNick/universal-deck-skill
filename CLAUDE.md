# Claude Project Configuration

This repository contains Claude Skills for generating professional marketing presentations and managing brand guidelines.

## Skills Available

### Marketing Deck Generator
Generate professional PPTX marketing presentations from JSON input or CLI parameters.

**Location**: `.claude/skills/marketing-deck-generator/`

**Usage**: See `.claude/skills/marketing-deck-generator/SKILL.md` for complete documentation.

### HTML Deck Generator
Create interactive HTML pitch decks that mirror the longevity-style presentation.

**Location**: `.claude/skills/html-deck-generator/`

**Usage**: See `.claude/skills/html-deck-generator/SKILL.md` for complete instructions.

### Brand Guidelines
Maintain consistent branding across all generated content and presentations.

**Location**: `.claude/skills/brand-guidelines/`

**Usage**: See `.claude/skills/brand-guidelines/SKILL.md` for complete documentation.

## Required Mindset

Claude must:

- Analyze user intent (audience, tone, goals) before selecting layouts or generating slides
- Explain layout choices and how they support the desired outcome
- Prefer context-driven workflows when the user provides goals or sections
- Cross-check brand consistency using the brand-guidelines skill

## Project Structure

```
.claude/
├── skills/
│   ├── marketing-deck-generator/    # Deck generation skill
│   └── brand-guidelines/            # Brand consistency skill
└── README.md                        # Claude directory overview
```

## Quick Start

### Generate a Deck
```bash
node scripts/cli.js generate --layout "data-grid-dashboard" --theme "corporate-blue"
```

### Apply Brand Guidelines
Use the brand-guidelines skill to ensure consistent branding across all generated content.

## Development

See individual skill documentation for detailed usage instructions and examples.

