// Lumen is a fictional brand. Every tool, figure and quote here is invented.

export type Category = "explore" | "build" | "ship" | "present";

export const CATEGORIES: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "All tools" },
  { key: "explore", label: "Explore ideas" },
  { key: "build", label: "Build systems" },
  { key: "ship", label: "Ship faster" },
  { key: "present", label: "Present & share" },
];

export type Tool = {
  slug: string;
  name: string;
  tagline: string;
  category: Category;
  from: string;
  to: string;
  glyph: number;
  body: string;
  features: string[];
  stat: { value: string; label: string };
};

// Ordered like a spectrum: warm → cool → warm again.
export const TOOLS: Tool[] = [
  {
    slug: "dawn",
    name: "Dawn",
    tagline: "Decks that build themselves",
    category: "present",
    from: "#FFC2B4",
    to: "#FFE7D1",
    glyph: 0,
    body: "Drop in a brief and your latest frames. Dawn assembles a client-ready story, writes speaker notes in your voice and keeps every slide on brand.",
    features: ["Narrative outline from a one-line brief", "Pulls live frames, never stale screenshots", "Speaker notes tuned to your audience"],
    stat: { value: "6×", label: "faster first draft of a pitch deck" },
  },
  {
    slug: "halo",
    name: "Halo",
    tagline: "Relight any image",
    category: "present",
    from: "#FFD49A",
    to: "#FFF1C7",
    glyph: 1,
    body: "Move the sun after the shoot. Halo rebuilds depth from a single photo so you can change light direction, warmth and shadow softness in seconds.",
    features: ["Single-image depth estimation", "Drag-to-place light sources", "Matches lighting across a whole set"],
    stat: { value: "40+", label: "studio lighting presets" },
  },
  {
    slug: "glint",
    name: "Glint",
    tagline: "Micro-interactions on demand",
    category: "ship",
    from: "#FFF08A",
    to: "#FFFBD6",
    glyph: 2,
    body: "Describe the feeling, get the motion. Glint turns 'make it feel bouncy but calm' into springs, timings and easing curves you can tweak and export.",
    features: ["Plain-language motion prompts", "Spring and curve editors", "Exports to CSS, Swift and Compose"],
    stat: { value: "300ms", label: "average time from prompt to preview" },
  },
  {
    slug: "beam",
    name: "Beam",
    tagline: "Copy that sounds like you",
    category: "explore",
    from: "#E3FF8C",
    to: "#F6FFD9",
    glyph: 3,
    body: "Beam learns your brand voice from past work and drafts headlines, microcopy and empty states that fit the layout they live in.",
    features: ["Voice profile from your own copy", "Length-aware for tight UI slots", "Tone dial from playful to formal"],
    stat: { value: "92%", label: "of drafts kept with light edits" },
  },
  {
    slug: "facet",
    name: "Facet",
    tagline: "Components that stay in sync",
    category: "build",
    from: "#B9F5C4",
    to: "#E9FFF0",
    glyph: 4,
    body: "Facet watches your design library and your codebase, flags drift between them and proposes the smallest change that brings them back together.",
    features: ["Design-to-code drift detection", "One-click fix proposals", "Weekly health report per component"],
    stat: { value: "0", label: "surprise visual regressions after rollout" },
  },
  {
    slug: "spectrum",
    name: "Spectrum",
    tagline: "Colour systems in one pass",
    category: "build",
    from: "#9FEFDF",
    to: "#E3FBF6",
    glyph: 5,
    body: "Pick a single brand colour. Spectrum builds an accessible palette with light and dark modes, contrast-checked tokens and data-viz ramps.",
    features: ["WCAG contrast built in", "Light, dark and high-contrast themes", "Token export for every platform"],
    stat: { value: "11", label: "steps per generated colour ramp" },
  },
  {
    slug: "ray",
    name: "Ray",
    tagline: "Handoff, straight to code",
    category: "ship",
    from: "#A8E4FF",
    to: "#E5F6FF",
    glyph: 6,
    body: "Ray reads a finished frame and writes production-ready components in your stack, using your tokens and your existing components first.",
    features: ["Respects your design tokens", "Reuses components before writing new ones", "Opens a pull request with screenshots"],
    stat: { value: "3.4×", label: "faster from approved design to merged PR" },
  },
  {
    slug: "aperture",
    name: "Aperture",
    tagline: "Every asset, every size",
    category: "ship",
    from: "#B6C8FF",
    to: "#E8EEFF",
    glyph: 7,
    body: "Mark a frame once and Aperture exports every size, format and density your platforms need, named and organised the way your team expects.",
    features: ["Smart crops per aspect ratio", "WebP, AVIF and SVG optimisation", "Naming rules per destination"],
    stat: { value: "1", label: "click to export a full release kit" },
  },
  {
    slug: "lens",
    name: "Lens",
    tagline: "A second pair of eyes",
    category: "explore",
    from: "#C9B8FF",
    to: "#EFE9FF",
    glyph: 8,
    body: "Lens reviews a screen the way a senior designer would: hierarchy, spacing, contrast and copy, with every note pinned to the exact layer.",
    features: ["Hierarchy and rhythm checks", "Accessibility review on every frame", "Notes pinned to layers, not screenshots"],
    stat: { value: "24", label: "heuristics checked on every review" },
  },
  {
    slug: "refract",
    name: "Refract",
    tagline: "One idea, many directions",
    category: "build",
    from: "#E2B6FF",
    to: "#F6E8FF",
    glyph: 9,
    body: "Refract takes one component or layout and explores variations across density, tone and layout, so you can compare directions side by side.",
    features: ["Variations that respect constraints", "Side-by-side compare mode", "Promote a variant to the library"],
    stat: { value: "12", label: "directions explored in one click" },
  },
  {
    slug: "prism-board",
    name: "Prism Board",
    tagline: "Moodboards that think",
    category: "explore",
    from: "#FFB8E6",
    to: "#FFE9F7",
    glyph: 10,
    body: "Throw references at Prism Board and it sorts them into themes, pulls out palettes and type, and suggests what's missing from the mood.",
    features: ["Auto-clustering by theme", "Palette and type extraction", "Gap suggestions for a fuller board"],
    stat: { value: "5 min", label: "from a pile of links to a clear direction" },
  },
  {
    slug: "caustic",
    name: "Caustic",
    tagline: "Motion presets with taste",
    category: "present",
    from: "#FFB0C8",
    to: "#FFE4EC",
    glyph: 11,
    body: "Caustic brings a library of considered transitions and scroll effects you can apply to any prototype, tuned to feel smooth on real devices.",
    features: ["Curated transition library", "Scroll-linked effects for prototypes", "Performance budget on every preset"],
    stat: { value: "60fps", label: "tested on mid-range phones" },
  },
];

export const INTEGRATIONS = [
  { name: "Figma", note: "Lumen tools run inside your files. Select a frame, pick a tool, and results land as editable layers." },
  { name: "Slack", note: "Share a Lens review or a Dawn deck to a channel, with threaded comments that sync back to the canvas." },
  { name: "Notion", note: "Drop Spectrum palettes and Facet health reports into your design docs. They stay live as things change." },
  { name: "Linear", note: "Ray opens issues and pull requests with the right context, and Lens notes become tickets in one click." },
  { name: "GitHub", note: "Facet and Ray read your component code directly, so suggestions match what actually ships." },
];
