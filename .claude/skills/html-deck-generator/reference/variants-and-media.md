# Variants & Media Embeds

## Lite / Email Variant
- Add `data-variant="lite"` to `<body>` to switch the template into scrollable mode.
- Slides become stackable cards; navigation dots and progress bar are hidden.
- Reduce motion-heavy JS and ensure inline assets stay under ~1.5 MB for inbox deliverability.
- Consider exporting both files: `deck-interactive.html` and `deck-lite.html`. Log the delta at hand-off.

## Suggested Workflow
1. Finalize the interactive deck.
2. Duplicate the file, rename, and set the lite variant attribute.
3. Strip sections that rely on keyboard navigation or autoplay.
4. Swap high-res videos for poster images + link if email clients block media.

## Video Embeds
- Wrap media in `.video-frame` to inherit rounded corners and responsive sizing.
- Prefer `<video controls playsinline>` with MP4 sources (download via view_x_video-style tooling for X/Twitter).
- Provide `poster` images for better perceived performance and fallback context.
- For TikTok or other platform embeds that require `<iframe>`, include `loading="lazy"` and keep height ratios to 16:9.
- Always include descriptive captions or transcripts beneath the video.

### Example
```html
<div class="video-frame">
  <video controls playsinline preload="metadata" poster="https://cdn.example.com/demo-poster.jpg" aria-label="Product walkthrough">
    <source src="https://video.twimg.com/.../clip.mp4" type="video/mp4" />
    <p>View on X: <a href="https://x.com/brand/status/123">https://x.com/brand/status/123</a></p>
  </video>
</div>
```

## QA Checklist
- [ ] Videos have captions or narrative summaries in text.
- [ ] Lite variant renders correctly without JavaScript (use the built-in `<noscript>` fallback as a guide).
- [ ] Any autoplay settings require user confirmation; respect `playsinline` for mobile.
- [ ] External embeds include source attribution links for compliance.


