---
name: html-deck-generator
description: Generate interactive HTML pitch decks using the ECM-Atlas longevity style. Produces single-file presentations with smooth navigation, fixed header, progress bar, and 16:9 slides. Use when the user wants a web-based deck rather than PPTX.
---

# HTML Deck Generator

Generate interactive HTML presentations styled like `longevity_pitch_deck.html`, automatically populating content from user intent.

## When to Use

Use this skill when the user requests:
- A web-based deck or landing page experience instead of PPTX
- HTML output with the ECM-Atlas/Longevity visual language
- Rich typography, gradients, and interactive navigation
- Fast sharing of a presentation without PowerPoint

## Required Intent Analysis

Before writing HTML, Claude **must** reason about user intent and audience:

1. **Understand the Request**
   - Capture audience, tone, desired takeaway, and number of slides
   - Extract strategic goals (e.g., inspire investors, explain research, onboard customers)

2. **Plan Slide Narrative**
   - Map goals → slide types (metrics, storyline, visual proof, CTA)
   - Decide layout sequence: hero → problem → opportunity → solution → proof → CTA

3. **Design Structure**
   - Determine which slides should reuse statistics grids vs. narrative blocks
   - Identify where visuals (images/charts) or callouts belong

4. **Validate Intent Coverage**
   - Ensure all user goals map to slides
   - Confirm tone aligns with color usage and copy style

Document the reasoning (bullet list or short plan) before and after generating HTML so users see how layouts support intent.

## Output Requirements

- Produce a **single self-contained HTML file** (no external assets beyond optional remote images)
- Base structure and CSS must follow `resources/templates/html-deck-template.html`
- Update placeholders (`{{...}}`) with generated content
- Create the requested number of slides (defaults to 16 like the original deck if unspecified)
- Update navigation dots, slide IDs, and counters to match total slides
- Keep CSS and JS inline; modify styles only if asked

## Layout Patterns

Replicate the longevity style slide patterns:

| Slide Type | Layout Components | Suggested Use |
|------------|------------------|---------------|
| Title Hero | `title-slide` with stat cards | Vision statement, metrics snapshot |
| Problem/Insight | `.stats-grid` cards + narrative paragraph | Highlight pain points |
| Narrative Quote | `.text-large` headings + body | Vision, mission, storytelling |
| Data Story | `.metrics-grid`, `.stats-grid-4`, or timeline | KPIs, adoption, roadmap |
| Visual Proof | `<img>` embed with caption | Screenshots, charts, prototypes |
| Comparison | `.comparison-container` | Before/after, competitor analysis |
| Feature Showcase | `.feature-showcase`, `.feature-card` | Product capabilities |
| CTA | `.cta-section` | Close with strong call-to-action |

Feel free to remix patterns when intent demands.

## Template Reference

- Base file: `resources/templates/html-deck-template.html`
- Styles: identical to longevity pitch deck (16:9, fixed header, progress bar)
- Placeholders: replace `{{TOKEN}}` entries and duplicate slide blocks as needed

## Workflow

1. **Intent Analysis** – summarize audience, goals, tone, slide strategy
2. **Slide Outline** – list slide titles, layout choice, key content
3. **HTML Generation** – fill template with content using consistent classes
4. **Validation** – ensure slide count, nav dots, and headers match plan
5. **Output** – return full `<!DOCTYPE html>` file (no Markdown code blocks unless user asks)

See `reference/layout-guide.md` and `workflows/html-generation.md` for detailed guidance.
