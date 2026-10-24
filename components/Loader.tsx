"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { TOOLS } from "@/lib/tools";
import { LumenMark } from "./Glyph";

// Loader: twelve spectrum bands rise one after another (one per tool),
// then sweep apart as the page arrives.
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      document.body.classList.add("is-loading");
      const finish = () => {
        document.body.classList.remove("is-loading");
        window.__lenis?.start();
        el.style.display = "none";
        window.dispatchEvent(new Event("lm:ready"));
      };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
      }

      const bars = gsap.utils.toArray<HTMLElement>(".ld-bar");
      const count = el.querySelector(".ld-count") as HTMLElement;
      const p = { v: 0 };
      gsap.set(bars, { scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set([".ld-mark", ".loader__meta"], { opacity: 0, y: 10 });

      const tl = gsap.timeline();
      tl.to([".ld-mark", ".loader__meta"], { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }, 0)
        .to(bars, { scaleY: 1, duration: 0.7, ease: "power3.out", stagger: 0.09 }, 0.25)
        .to(p, { v: 100, duration: 1.9, ease: "power1.inOut", onUpdate: () => (count.textContent = String(Math.round(p.v)).padStart(3, "0")) }, 0.2);

      const ready = Promise.all([
        new Promise((r) => tl.eventCallback("onComplete", () => r(null))),
        Promise.race([
          Promise.all([
            document.fonts ? document.fonts.ready : Promise.resolve(),
            new Promise((r) => (document.readyState === "complete" ? r(null) : window.addEventListener("load", () => r(null), { once: true }))),
          ]),
          new Promise((r) => setTimeout(r, 3500)),
        ]),
      ]);
      let cancelled = false;
      ready.then(() => {
        if (cancelled) return;
        gsap
          .timeline({ onComplete: finish })
          .to(bars, { scaleY: 0, transformOrigin: "50% 0%", duration: 0.55, ease: "power3.in", stagger: { each: 0.03, from: "center" } })
          .to([".ld-mark", ".loader__meta"], { opacity: 0, y: -10, duration: 0.4, ease: "power2.in" }, "<")
          .to(el, { opacity: 0, duration: 0.45, ease: "power2.inOut" }, "-=0.1");
      });
      return () => {
        cancelled = true;
      };
    },
    { scope: root }
  );

  return (
    <div className="loader" ref={root} role="status" aria-label="Loading">
      <div className="loader__inner">
        <LumenMark className="ld-mark" />
        <div className="ld-bars" aria-hidden="true">
          {TOOLS.map((t) => (
            <span key={t.slug} className="ld-bar" style={{ background: `linear-gradient(180deg, ${t.from}, ${t.to})` }} />
          ))}
        </div>
        <div className="loader__meta label">
          <span>Lumen · Spring &apos;27</span>
          <span className="ld-count">000</span>
        </div>
      </div>
    </div>
  );
}
