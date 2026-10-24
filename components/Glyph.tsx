// Twelve simple, original geometric glyphs, one per tool.
export function Glyph({ n, className }: { n: number; className?: string }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const shapes = [
    <g key="0" {...s}><path d="M8 40h32" /><path d="M24 40a16 16 0 0 1 16-16" /><path d="M24 40a16 16 0 0 0-16-16" /><path d="M24 14v4M12 18l3 3M36 18l-3 3" /></g>,
    <g key="1" {...s}><circle cx="24" cy="24" r="9" /><circle cx="24" cy="24" r="16" strokeDasharray="3 5" /></g>,
    <g key="2" {...s}><path d="M24 6l4 14 14 4-14 4-4 14-4-14-14-4 14-4z" /></g>,
    <g key="3" {...s}><path d="M6 24h24" /><path d="M30 24l12-10M30 24l12 10M30 24h12" /></g>,
    <g key="4" {...s}><path d="M24 6l16 9v18l-16 9-16-9V15z" /><path d="M24 6v36M8 15l32 18M40 15L8 33" /></g>,
    <g key="5" {...s}><circle cx="17" cy="20" r="10" /><circle cx="31" cy="20" r="10" /><circle cx="24" cy="31" r="10" /></g>,
    <g key="6" {...s}><path d="M6 36L24 12l18 24" /><path d="M14 36h20" /><path d="M24 12V4" /></g>,
    <g key="7" {...s}><circle cx="24" cy="24" r="16" /><path d="M24 8l8 14M40 24l-16 0M32 38l-8-14M24 40l-8-14M8 24h16M16 10l8 14" /></g>,
    <g key="8" {...s}><circle cx="20" cy="20" r="12" /><path d="M29 29l11 11" /><circle cx="20" cy="20" r="5" /></g>,
    <g key="9" {...s}><path d="M6 38L24 8l18 30z" /><path d="M24 8v30M15 23l18 0" /></g>,
    <g key="10" {...s}><rect x="7" y="7" width="15" height="15" rx="3" /><rect x="26" y="7" width="15" height="22" rx="3" /><rect x="7" y="26" width="15" height="15" rx="3" /><rect x="26" y="33" width="15" height="8" rx="3" /></g>,
    <g key="11" {...s}><path d="M6 30c6-10 12-10 18 0s12 10 18 0" /><path d="M6 20c6-10 12-10 18 0s12 10 18 0" /></g>,
  ];
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {shapes[n % shapes.length]}
    </svg>
  );
}

export function LumenMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="14.6" cy="16" r="10" fill="none" stroke="#ff9a8b" strokeWidth="1.4" opacity="0.9" />
      <circle cx="17.4" cy="16" r="10" fill="none" stroke="#8fc8ff" strokeWidth="1.4" opacity="0.9" />
      <circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10.5 12.5a7 7 0 0 1 5-3.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
