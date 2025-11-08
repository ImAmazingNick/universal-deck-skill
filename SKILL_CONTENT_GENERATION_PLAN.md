# Deck Content Generation Upgrade Plan

## Context
- Skill currently relies on static layout defaults or manual JSON overrides for slide content.
- When Claude users request a presentation, the system must be able to synthesize or adapt content using provided context without requiring hand-authored JSON.
- We need a deterministic, type-safe pipeline that maps prompts/context → structured slides → PPTX export while staying within existing layout/theme architecture.

## Objectives
- Accept rich deck requests (topic, audience, goals, context snippets, data points) and automatically produce populated slide definitions.
- Ensure generated decks use appropriate layouts (hero, KPIs, charts, roadmap, testimonials, CTA) with high-quality textual copy and optional numeric data.
- Maintain compatibility with existing CLI/API/export flows and keep PPTX output parity.
- Provide sample inputs and documentation so agents know how to invoke the capability.

## Constraints & Considerations
- Follow existing discriminated-union typing in `src/lib/deck-types.ts`.
- Reuse resources in `resources/layouts.json` and honor grid coordinates.
- Ensure plan + implementation stay within ≈20k total tokens.
- Avoid React hooks inside functions called during render (per user rule).
- Respect shadcn UI conventions for any UI touchpoints.

## Implementation Roadmap

| Step | Description | Token Estimate |
| ---- | ----------- | -------------- |
| 1 | Define `DeckRequest` schema & helpers for normalizing user context (types + validation utilities). | 900 |
| 2 | Implement `content-generator` module that maps normalized request to slide blueprints (layout selection, copy blocks, metrics, charts, timeline synthesis). | 2,400 |
| 3 | Integrate generator into CLI/API: detect `context` payloads, call generator, merge with exporter pipeline. | 1,600 |
| 4 | Add deterministic fixtures (sample JSON & tests/QA script) showcasing context-driven generation. | 1,000 |
| 5 | Update docs (`SKILL.md`, README, samples) to explain new workflow & parameters. | 700 |

**Total Estimated Tokens:** 6,600

## Task Checklist
- [x] Step 1 – Request schema & validation
- [x] Step 2 – Content generator module
- [x] Step 3 – CLI/API integration
- [x] Step 4 – Fixtures & QA script
- [x] Step 5 – Documentation updates


