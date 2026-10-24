"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CATEGORIES, TOOLS, type Category } from "@/lib/tools";
import Panel from "./Panel";
import Sheet from "./Sheet";

const N = TOOLS.length;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Phase boundaries (fractions of the pinned scroll)
const RISE_END = 0.07;
const FOCUS_START = 0.1;
const FOCUS_END = 0.66;
const GRID_START = 0.7;
const GRID_END = 0.86;

export default function Stage() {
  const root = useRef<HTMLElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [open, setOpen] = useState<{ index: number; origin: { x: number; y: number } } | null>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const slots = gsap.utils.toArray<HTMLElement>(".slot");
        const contents = slots.map((s) => s.querySelector<HTMLElement>(".panel__body")!);
        const verticals = slots.map((s) => s.querySelector<HTMLElement>(".panel__vname"));
        const pin = root.current!.querySelector<HTMLElement>(".stage__pin")!;
        let lastIdx = -1;
        let enter = 0;
        let progress = 0;

        const layout = (p: number) => {
          const W = pin.clientWidth;
          const H = pin.clientHeight;
          const pad = Math.max(20, Math.min(80, W * 0.05));
          const top = Math.max(150, H * 0.27);
          const bottom = H * 0.07;
          const FH = H - top - bottom;
          const gap = 8;

          const rise = 1; // bands arrive already formed, handed over from the hero
          const openAmt = smooth(FOCUS_START - 0.04, FOCUS_START + 0.02, p);
          const f = lerp(0, N - 1, clamp((p - FOCUS_START) / (FOCUS_END - FOCUS_START)));
          const g = smooth(GRID_START, GRID_END, p);

          // band widths: a smooth bump around the focused index
          const weights = slots.map((_, i) => 1 + openAmt * 11 * Math.exp(-((i - f) ** 2) / 0.4));
          const total = weights.reduce((a, b) => a + b, 0);
          const avail = W - pad * 2 - gap * (N - 1);

          // grid target
          const cols = W >= 1180 ? 6 : 4;
          const rows = Math.ceil(N / cols);
          const ggap = 16;
          let cw = (W - pad * 2 - ggap * (cols - 1)) / cols;
          let ch = cw / 0.78;
          const maxCh = (FH - ggap * (rows - 1)) / rows;
          if (ch > maxCh) {
            ch = maxCh;
            cw = ch * 0.78;
          }
          const gridW = cw * cols + ggap * (cols - 1);
          const gx0 = (W - gridW) / 2;

          let x = pad;
          slots.forEach((slot, i) => {
            const bw = (weights[i] / total) * avail;
            const bh = FH * rise;
            const by = top + FH * (1 - rise);
            const col = i % cols;
            const row = Math.floor(i / cols);
            const tx = gx0 + col * (cw + ggap);
            const ty = top + row * (ch + ggap);

            const px = lerp(x, tx, g);
            const py = lerp(by, ty, g);
            const pw = lerp(bw, cw, g);
            const ph = lerp(bh, ch, g);
            slot.style.transform = `translate3d(${px}px, ${py}px, 0)`;
            slot.style.width = `${pw}px`;
            slot.style.height = `${Math.max(0, ph)}px`;
            slot.style.zIndex = String(Math.round(weights[i] * 10));

            const focus = Math.exp(-((i - f) ** 2) / 0.25) * openAmt;
            const show = Math.max(focus, g);
            contents[i].style.opacity = String(show);
            const v = verticals[i];
            if (v) v.style.opacity = String((1 - show) * rise * 0.75 * smooth(0, 0.05, p));
            x += bw + gap;
          });

          // header: counter during focus, filters in grid
          const idx = Math.round(f);
          if (counter.current && idx !== lastIdx) {
            lastIdx = idx;
            counter.current.textContent = `${String(idx + 1).padStart(2, "0")} / 12 — ${TOOLS[idx].name}`;
          }
          gsap.set(".stage__head h2", { opacity: smooth(0, 0.05, p), y: (1 - smooth(0, 0.05, p)) * 16 });
          gsap.set(".stage__counter", { opacity: (1 - g) * openAmt });
          gsap.set(".filters", { opacity: g, pointerEvents: g > 0.95 ? "auto" : "none" });
          field.current!.classList.toggle("is-grid", g > 0.98);
        };

        const snaps = [0, ...TOOLS.map((_, i) => FOCUS_START + (i / (N - 1)) * (FOCUS_END - FOCUS_START)), GRID_END, 1];
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "+=5600",
          pin: pin,
          scrub: 0.6,
          anticipatePin: 1,
          snap: { snapTo: snaps, duration: { min: 0.2, max: 0.6 }, ease: "power1.inOut", delay: 0.05 },
          onUpdate: (self) => {
            progress = self.progress;
            layout(progress);
          },
          onRefresh: (self) => layout(self.progress),
        });
        // bands rise while the section scrolls into view, before the pin starts
        const enterST = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            enter = self.progress;
            layout(progress);
          },
        });
        layout(0);

        const jump = (e: Event) => {
          const where = (e as CustomEvent).detail;
          if (where !== "tools") return;
          const y = st.start + (st.end - st.start) * (GRID_END + 0.02);
          window.__lenis?.scrollTo(y, { duration: 1.4 });
        };
        window.addEventListener("lm:jump", jump);
        return () => {
          window.removeEventListener("lm:jump", jump);
          enterST.kill();
        };
      });

      // reveal on mobile / reduced motion grid
      gsap.utils.toArray<HTMLElement>(".stage__grid .slot-m").forEach((el, i) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: (i % 2) * 0.06,
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const onOpen = useCallback((e: React.MouseEvent | React.KeyboardEvent, index: number) => {
    const isGrid = field.current?.classList.contains("is-grid") || window.innerWidth <= 900;
    if (!isGrid) return;
    const pt = "clientX" in e && e.clientX ? { x: e.clientX, y: e.clientY } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setOpen({ index, origin: pt });
  }, []);

  const matches = (i: number) => filter === "all" || TOOLS[i].category === filter;

  return (
    <section className="stage" id="tools" ref={root}>
      <div className="stage__pin">
        <div className="stage__head">
          <div>
            <span className="label stage__counter" ref={counter} style={{ display: "block", color: "var(--text-dim)", marginBottom: 12, opacity: 0 }}>
              01 / 12 — {TOOLS[0].name}
            </span>
            <h2>
              Twelve new tools.
              <br />
              One spectrum.
            </h2>
          </div>
          <div className="filters" role="group" aria-label="Filter tools">
            {CATEGORIES.map((c) => (
              <button key={c.key} className={filter === c.key ? "is-active" : ""} onClick={() => setFilter(c.key)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="stage__field" ref={field}>
          {TOOLS.map((t, i) => (
            <div className="slot" key={t.slug}>
              <Panel tool={t} index={i} onOpen={onOpen} dim={!matches(i)} showVertical />
            </div>
          ))}
        </div>
      </div>

      <div className="stage__grid">
        <span className="label" style={{ color: "var(--text-dim)" }}>Spring &apos;27 Release</span>
        <h2>Twelve new tools. One spectrum.</h2>
        <div className="grid">
          {TOOLS.map((t, i) => (
            <div className="slot-m" key={t.slug}>
              <Panel tool={t} index={i} onOpen={onOpen} />
            </div>
          ))}
        </div>
      </div>

      {open && (
        <Sheet
          index={open.index}
          origin={open.origin}
          onClose={() => setOpen(null)}
          onNavigate={(index) => setOpen((o) => (o ? { ...o, index } : o))}
        />
      )}
    </section>
  );
}
