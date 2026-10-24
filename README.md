# Lumen: Spring '27 Release

A scroll-driven product launch for **Lumen**, a fictional AI creative suite for design teams. It was built as a motion design showcase: one continuous scroll story instead of stacked sections.

## The story

| Beat | What happens |
| --- | --- |
| Loader | Twelve spectrum bands rise one after another (one per tool), then sweep away |
| Hero (pinned) | A glass lens with an iridescent halo, drawn live on `<canvas>` and scrubbed by scroll. Two lines crossfade, then the halo's colours separate into twelve vertical bands |
| Hand-off | The hero's last frame matches the tools section exactly, so it dissolves into it with no cut |
| Tools (pinned) | Scrolling opens the bands one at a time into iridescent glass panels, then they settle into a filterable grid. Snap points land on every tool |
| Detail sheet | Clicking a panel opens a sheet that grows from the click point, with a count-up stat, Escape to close, arrow keys to browse and a focus trap |
| Integrations | Frosted-glass strips that expand with `flex-grow` |
| Closing | Dark spectrum light, waitlist form with inline validation |

## Techniques

- **GSAP** ScrollTrigger timelines, pinning, scrubbing and snap points; **Lenis** smooth scroll on the GSAP ticker
- Procedural canvas "film" (no video files), DPR-capped and redrawn only on scroll
- Per-frame layout of 12 panels driven by one progress value (band widths from a Gaussian around the focused index, then a lerp into the grid)
- Holographic glass panels: gradient, grain, foil, glare and edge layers controlled by four CSS custom properties
- Roll-up buttons, a scroll progress bar that reveals a fixed spectrum, a glass menu with section jumps
- Mobile layout (no pinned stage, reveal-on-scroll grid) and full `prefers-reduced-motion` support

## Stack

Next.js · TypeScript · GSAP · Lenis · General Sans (Fontshare)

```bash
npm install
npm run dev
```

Lumen, its tools, figures and copy are invented. Built by **Hussain Singapuri** ([@huss2003](https://github.com/huss2003)).
