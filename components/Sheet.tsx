"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import Panel from "./Panel";
import RollButton from "./RollButton";

type Props = {
  index: number;
  origin: { x: number; y: number };
  onClose: () => void;
  onNavigate: (index: number) => void;
};

function countUp(el: HTMLElement) {
  const m = el.textContent?.trim().match(/^(\D*)(\d[\d.]*)(.*)$/);
  if (!m) return;
  const [, pre, num, post] = m;
  const end = parseFloat(num);
  const dp = (num.split(".")[1] || "").length;
  const o = { v: 0 };
  gsap.to(o, {
    v: end,
    duration: 1.1,
    ease: "power2.out",
    onUpdate: () => (el.textContent = pre + o.v.toFixed(dp) + post),
    onComplete: () => (el.textContent = pre + num + post),
  });
}

export default function Sheet({ index, origin, onClose, onNavigate }: Props) {
  const card = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const tool = TOOLS[index];
  const closing = useRef(false);

  // open from the click point
  useLayoutEffect(() => {
    const el = card.current!;
    const r = el.getBoundingClientRect();
    const ox = origin.x - r.left;
    const oy = origin.y - r.top;
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.2, transformOrigin: `${ox}px ${oy}px` },
      { opacity: 1, scale: 1, duration: 0.55, ease: "power3.out", clearProps: "transform,transformOrigin" }
    );
    window.__lenis?.stop();
    closeBtn.current?.focus();
    return () => {
      window.__lenis?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // content entrance every time the tool changes
  useEffect(() => {
    const el = card.current!;
    gsap.fromTo(el.querySelectorAll(".reveal"), { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.06, delay: 0.12 });
    gsap.fromTo(el.querySelector(".sheet__visual"), { clipPath: "inset(0 0 0 100%)", scale: 1.06 }, { clipPath: "inset(0 0 0 0%)", scale: 1, duration: 0.8, ease: "power3.out" });
    const stat = el.querySelector<HTMLElement>(".sheet__stat strong");
    if (stat) {
      stat.textContent = tool.stat.value;
      countUp(stat);
    }
  }, [index, tool.stat.value]);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const el = card.current!;
    const r = el.getBoundingClientRect();
    gsap.set(el, { transformOrigin: `${origin.x - r.left}px ${origin.y - r.top}px` });
    gsap.to(el.parentElement, { opacity: 0, duration: 0.36, ease: "power2.in" });
    gsap.to(el, { scale: 0.2, opacity: 0, duration: 0.36, ease: "power2.in", onComplete: onClose });
  };

  // Escape closes, Tab stays inside
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") onNavigate((index + 1) % TOOLS.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + TOOLS.length) % TOOLS.length);
      if (e.key === "Tab") {
        const f = card.current!.querySelectorAll<HTMLElement>("button, a, [tabindex='0']");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const cat = CATEGORIES.find((c) => c.key === tool.category)?.label;
  const next = TOOLS[(index + 1) % TOOLS.length];

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={tool.name} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="sheet__card" ref={card} style={{ ["--from" as string]: tool.from, ["--to" as string]: tool.to }}>
        <button className="sheet__close" ref={closeBtn} onClick={close} aria-label="Close">
          ×
        </button>
        <div className="sheet__grid">
          <div className="sheet__visual">
            <Panel tool={tool} index={index} />
          </div>
          <div>
            <span className="label reveal" style={{ display: "block", color: "var(--text-dim)" }}>
              {String(index + 1).padStart(2, "0")} / 12 · {cat}
            </span>
            <h3 className="reveal">{tool.name}</h3>
            <p className="sheet__tag reveal">{tool.tagline}</p>
            <p className="sheet__body reveal">{tool.body}</p>
            <ul className="sheet__features reveal">
              {tool.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="sheet__stat reveal">
              <strong>{tool.stat.value}</strong>
              <span>{tool.stat.label}</span>
            </div>
            <div className="sheet__nav reveal">
              <RollButton variant="ink" href="#waitlist" onClick={close}>
                Join the waitlist
              </RollButton>
              <button onClick={() => onNavigate((index + 1) % TOOLS.length)}>Next: {next.name} →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
