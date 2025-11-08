# Claude Skills Directory

This directory contains Claude Skills for this project.

## Structure

```
.claude/
├── skills/
│   ├── marketing-deck-generator/    # Deck generation skill
│   └── brand-guidelines/            # Brand consistency skill
└── README.md                        # This file
```

## Available Skills

### Marketing Deck Generator
Generate professional PPTX marketing presentations from JSON input or CLI parameters.

**Location**: `.claude/skills/marketing-deck-generator/`

**Main File**: `skills/marketing-deck-generator/SKILL.md`

### HTML Deck Generator
Create interactive longevity-style HTML decks that can be shared in a browser.

**Location**: `.claude/skills/html-deck-generator/`

**Main File**: `skills/html-deck-generator/SKILL.md`

### Brand Guidelines
Maintain consistent branding across all generated content and presentations.

**Location**: `.claude/skills/brand-guidelines/`

**Main File**: `skills/brand-guidelines/SKILL.md`

## Usage

Each skill has its own directory with:
- `SKILL.md` - Main skill definition with YAML frontmatter
- `reference/` - Detailed reference documentation
- `examples/` - Usage examples (if applicable)
- `workflows/` - Step-by-step workflows (if applicable)

See individual skill directories for complete documentation.

## Project Configuration

See `CLAUDE.md` in the repository root for project-wide Claude configuration.
