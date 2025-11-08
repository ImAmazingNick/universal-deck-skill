# HTML Deck Generation Workflow

Follow these steps to produce an HTML deck that reflects user intent.

## 0. Intent Analysis (Mandatory)
- Capture audience, tone, strategic goals, and desired call-to-action
- Determine slide count and key milestones (e.g., hero, problem, solution, proof, CTA)
- Map each goal to a slide pattern (stats grid, timeline, comparison, etc.)
- Document the plan before generating HTML (bullet list is fine)

## 1. Outline Slides
- List slides in order with title, subtitle, layout choice, and key talking points
- Validate that the sequence tells a coherent story
- Confirm no goals remain uncovered; merge or split slides if needed

## 2. Prepare Template
- Start from `resources/templates/html-deck-template.html`
- Duplicate the slide block for each item in the outline
- Update `totalSlides`, nav dots, and slide numbers accordingly

## 3. Populate Content
- Insert titles, subtitles, metrics, and narratives per slide
- Use consistent class names (`stats-grid`, `timeline-container`, etc.)
- Replace placeholder tokens (`{{HEADER_TITLE}}`, etc.)
- Embed images or charts if requested (remote URLs or data URIs)

## 4. Validate Structure
- Ensure first slide has `class="slide active"`
- Check `data-title` and `data-subtitle` for adaptive header updates
- Verify nav dots count matches `totalSlides`
- Confirm CTA slide includes actionable button if required

## 5. Output
- Return a complete `<!DOCTYPE html>` document (no Markdown fences unless requested)
- Optionally include a short summary of how the deck addresses user intent

## Tips
- Keep gradient/color scheme consistent with template
- Maintain accessibility: alt text, semantic headings, readable contrast
- If the user wants fewer slides, still keep hero/problem/solution/CTA skeleton unless they say otherwise
- For longer decks, reuse layout patterns but vary content emphasis (metrics, testimonials, product walk-through, roadmap, etc.)
