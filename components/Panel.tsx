"use client";

import { useRef } from "react";
import type { Tool } from "@/lib/tools";
import { Glyph } from "./Glyph";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Props = {
  tool: Tool;
  index: number;
  tilt?: boolean;
  onOpen?: (e: React.MouseEvent | React.KeyboardEvent, index: number) => void;
  dim?: boolean;
  showVertical?: boolean;
};

// Iridescent glass panel: gradient base + grain + foil + glare + edge, driven by 4 CSS vars.
export default function Panel({ tool, index, tilt = true, onOpen, dim, showVertical }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const raf = useRef(0);
  const pos = useRef({ x: 0, y: 0 });

  const update = () => {
    raf.current = 0;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gx = Math.min(1, Math.max(0, (pos.current.x - r.left) / r.width));
    const gy = Math.min(1, Math.max(0, (pos.current.y - r.top) / r.height));
    el.style.transition = "transform .12s ease-out, box-shadow .35s, opacity .4s";
    el.style.transform = `perspective(1000px) rotateX(${(gy - 0.5) * -12}deg) rotateY(${(gx - 0.5) * 18}deg) translateY(-4%)`;
    el.style.setProperty("--mx", `${gx * 100}%`);
    el.style.setProperty("--my", `${gy * 100}%`);
    el.style.setProperty("--bgx", `${lerp(25, 75, gx)}%`);
    el.style.setProperty("--bgy", `${lerp(25, 75, gy)}%`);
    el.style.setProperty("--active", "1");
  };

  const onMove = (e: React.MouseEvent) => {
    if (!tilt || window.matchMedia("(hover: none)").matches) return;
    if (!ref.current?.closest(".is-grid, .stage__grid, .sheet")) return;
    pos.current = { x: e.clientX, y: e.clientY };
    if (!raf.current) raf.current = requestAnimationFrame(update);
  };
  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform .45s cubic-bezier(.34,1.45,.64,1), box-shadow .35s, opacity .4s";
    el.style.transform = "";
    el.style.setProperty("--active", "0");
  };

  return (
    <button
      ref={ref}
      className={`panel${dim ? " is-dim" : ""}`}
      style={{ ["--from" as string]: tool.from, ["--to" as string]: tool.to }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={(e) => onOpen?.(e, index)}
      aria-label={`Open ${tool.name}: ${tool.tagline}`}
      tabIndex={onOpen ? 0 : -1}
    >
      <span className="layer panel__grain" />
      <span className="layer panel__foil" />
      <span className="layer panel__glare" />
      <span className="layer panel__edge" />
      {showVertical && <span className="panel__vname">{tool.name}</span>}
      <span className="panel__body">
        <Glyph n={tool.glyph} className="panel__glyph" />
        <span className="panel__num">{String(index + 1).padStart(2, "0")}</span>
        <span>
          <span className="panel__name" style={{ display: "block" }}>{tool.name}</span>
          <span className="panel__tag" style={{ display: "block" }}>{tool.tagline}</span>
        </span>
      </span>
    </button>
  );
}
