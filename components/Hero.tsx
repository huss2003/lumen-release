"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { LumenMark } from "./Glyph";

import { TOOLS } from "@/lib/tools";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const HALO = ["#ff9a8b", "#ffb98a", "#ffd36b", "#f4f27a", "#e3ff8c", "#b4f7a8", "#8ff0d8", "#8fdcff", "#8fc8ff", "#a7b4ff", "#b6a6ff", "#ff9fd6"];

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

// Procedural "film": a glass lens with an iridescent halo whose colours separate
// into twelve vertical spectrum bands (the same bands the next section starts with).
function drawLens(ctx: CanvasRenderingContext2D, W: number, H: number, p: number, dpr: number) {
  ctx.clearRect(0, 0, W, H);
  const cx = W * (W / dpr > 900 ? 0.6 : 0.5);
  const cy = H * 0.42;
  const grow = smooth(0, 0.4, p);
  const split = smooth(0.42, 0.82, p);
  const flood = smooth(0.84, 1, p);
  const R = Math.min(W, H) * lerp(0.15, 0.22, grow);
  const lensScale = lerp(1, 0.55, split);
  const lensAlpha = 1 - smooth(0.55, 0.8, p);

  // 1. iridescent halo with chromatic separation
  ctx.globalCompositeOperation = "lighter";
  const disp = lerp(1.5, 5, grow) * (1 - split);
  HALO.forEach((c, i) => {
    const off = (i - 5.5) * disp * dpr;
    const rr = R * lensScale * (1.18 + i * 0.012);
    const g = ctx.createRadialGradient(cx + off, cy - off * 0.4, rr * 0.9, cx + off, cy - off * 0.4, rr * 2.3);
    g.addColorStop(0, c + "00");
    g.addColorStop(0.1, c + "2e");
    g.addColorStop(0.45, c + "0d");
    g.addColorStop(1, c + "00");
    ctx.globalAlpha = (0.6 + grow * 0.4) * (1 - split);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx + off, cy - off * 0.4, rr * 2.3, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // 2. the background floods to paper, behind everything that follows
  if (flood > 0) {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(244,245,250,${flood})`;
    ctx.fillRect(0, 0, W, H);
  }

  // 3. the colours separate into twelve vertical bands
  if (split > 0) {
    ctx.globalCompositeOperation = "source-over";
    const cssW = W / dpr;
    const cssH = H / dpr;
    const pad = Math.max(20, Math.min(80, cssW * 0.05)) * dpr;
    const top = Math.max(150, cssH * 0.27) * dpr;
    const FH = H - top - H * 0.07;
    const radius = Math.min(24, Math.max(14, cssW * 0.016)) * dpr;
    const gap = 8 * dpr;
    const bw = (W - pad * 2 - gap * 11) / 12;
    TOOLS.forEach((t, i) => {
      const tx = pad + i * (bw + gap);
      const x = lerp(cx - R * 0.08, tx, split);
      const w = lerp(R * 0.16, bw, split);
      const h = lerp(R * 1.6, FH, split);
      const y = lerp(cy - h / 2, top, split);
      const g = ctx.createLinearGradient(x, y, x + w * 0.6, y + h);
      g.addColorStop(0, t.from);
      g.addColorStop(1, t.to);
      ctx.globalAlpha = smooth(0, 0.35, split);
      ctx.fillStyle = g;
      roundRect(ctx, x, y, w, h, radius);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // 3. the lens
  if (lensAlpha > 0.01) {
    ctx.globalCompositeOperation = "source-over";
    const r = R * lensScale;
    ctx.globalAlpha = lensAlpha;
    const body = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.05, cx, cy, r);
    body.addColorStop(0, "rgba(255,255,255,0.32)");
    body.addColorStop(0.55, "rgba(190,200,255,0.08)");
    body.addColorStop(1, "rgba(255,255,255,0.16)");
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 1.4 * dpr;
    ctx.stroke();
    // specular arc
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2.4 * dpr;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.82, Math.PI * 1.08, Math.PI * 1.42);
    ctx.stroke();
    // inner caustic ring
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1 * dpr;
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.08, cy + r * 0.12, r * 0.55, r * 0.42, 0.4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const cvs = canvas.current!;
      const ctx = cvs.getContext("2d")!;
      const state = { p: 0 };
      let dpr = 1;
      const render = () => drawLens(ctx, cvs.width, cvs.height, state.p, dpr);
      const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, window.matchMedia("(pointer: coarse)").matches ? 1.25 : 2);
        cvs.width = Math.round(cvs.clientWidth * dpr);
        cvs.height = Math.round(cvs.clientHeight * dpr);
        render();
      };
      resize();
      window.addEventListener("resize", resize);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        state.p = 0.55;
        gsap.set(cvs, { opacity: 1 });
        render();
        return () => window.removeEventListener("resize", resize);
      }

      // entrance once the loader has finished
      gsap.set([".hero__wordmark", ".hero__sub", ".hero__bottom > *"], { opacity: 0, y: 24 });
      const intro = () =>
        gsap.to([".hero__wordmark", ".hero__sub", ".hero__bottom > *"], {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.08,
        });
      window.addEventListener("lm:ready", intro, { once: true });

      const touch = window.matchMedia("(pointer: coarse)").matches;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: touch ? "+=3000" : "+=3600",
          pin: true,
          scrub: touch ? true : 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(".hero__bottom", { opacity: 0, y: 20, duration: 0.6, ease: "power2.in" }, 0)
        .to(".hero__aurora-warm", { opacity: 1, duration: 3 }, 0)
        .to(".hero__lockup", { opacity: 0, y: -60, scale: 0.94, duration: 1.2, ease: "power2.in" }, 0.2)
        .to(cvs, { opacity: 1, duration: 1, ease: "power2.out" }, 0.6)
        .to(state, { p: 1, duration: 8.4, onUpdate: render }, 0.4)
        .fromTo(".hero__beat--1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 1.0)
        .to(".hero__beat--1", { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" }, 2.2)
        .fromTo(".hero__beat--2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 2.5)
        .to(".hero__beat--2", { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" }, 3.5)
        // desktop: the last frame matches the tools section exactly, so the hero dissolves into it
        .to(root.current, { opacity: window.innerWidth > 900 ? 0 : 1, duration: 0.3, ease: "none" }, 8.9)


      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("lm:ready", intro);
        ScrollTrigger.getAll().forEach((t) => t.trigger === root.current && t.kill());
      };
    },
    { scope: root }
  );

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__aurora" />
      <div className="hero__aurora-warm" />
      <div className="hero__lines" />
      <canvas className="hero__canvas" ref={canvas} aria-hidden="true" />

      <div className="hero__lockup">
        <h1 className="hero__wordmark">
          Lumen
          <span className="shine" aria-hidden="true">Lumen</span>
        </h1>
        <p className="hero__sub">Twelve new tools to bring your ideas into the light.</p>
      </div>

      <div className="hero__beats" aria-hidden="true">
        <p className="hero__beat hero__beat--1">Every idea starts as a single point of light.</p>
        <p className="hero__beat hero__beat--2">
          Lumen splits it into <span className="spectrum-text">everything</span> it could become.
        </p>
      </div>

      <div className="hero__bottom label">
        <span>Spring &apos;27</span>
        <div className="cue">
          <span className="cue__label">Scroll to see the light</span>
          <span className="cue__line" />
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
          <LumenMark className="cue-mark" />
          For design teams
        </span>
      </div>

      <div className="hero__flood" />
    </section>
  );
}
