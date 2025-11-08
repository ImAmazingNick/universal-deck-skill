# HTML Deck Generation Workflow

Follow these steps to produce an HTML deck that reflects user intent.

## 0. Intent Analysis (Mandatory)
- Capture audience, tone, strategic goals, desired call-to-action, and slide count target.
- If any of the above inputs are missing or ambiguous, draft **2–3 clarifying questions** for the user (e.g., “Any brand colors to honor?” “What’s the success metric?”). Record them with your plan.
- Pick the closest **audience archetype** (see `reference/audience-archetypes.md`) and note which layout sequence and tone guidance you will use. Blend archetypes if needed.
- Map each goal to a slide pattern (stats grid, timeline, comparison, etc.) aligned with the chosen archetype.
- Document the plan before generating HTML (bullet list is fine); include-resolved clarifications or outstanding assumptions.

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
- Apply brand theming by overriding CSS variables when needed; run the theme validator (`node scripts/dist/tools/validate-theme.js`) to confirm accessible contrast before finalizing.
- Generate inline charts or compress embeds via `node scripts/dist/tools/asset-helper.js` so the deck stays single-file.

## 4. Validate Structure
- Ensure first slide has `class="slide active"`
- Check `data-title` and `data-subtitle` for adaptive header updates
- Verify nav dots count matches `totalSlides`
- Confirm CTA slide includes actionable button if required
- When building an email/lite version, clone the deck, set `<body data-variant="lite">`, and remove any heavy scripts or animations that won’t survive embed environments.

## 5. Output
- Return a complete `<!DOCTYPE html>` document (no Markdown fences unless requested)
- Optionally include a short summary of how the deck addresses user intent
- If delivering multiple variants, provide filenames plus a changelog (e.g., “lite version removes navigation JS, compresses assets, swaps autoplay videos for posters”).

## Tips
- Keep gradient/color scheme consistent with template
- Maintain accessibility: alt text, semantic headings, readable contrast
- If the user wants fewer slides, still keep hero/problem/solution/CTA skeleton unless they say otherwise
- For longer decks, reuse layout patterns but vary content emphasis (metrics, testimonials, product walk-through, roadmap, etc.)
