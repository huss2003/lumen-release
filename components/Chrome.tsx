"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { LumenMark } from "./Glyph";

const LINKS = [
  { key: "top", label: "Watch the intro" },
  { key: "tools", label: "Explore the 12 tools" },
  { key: "integrations", label: "Integrations" },
  { key: "waitlist", label: "Join the waitlist" },
];

export default function Chrome() {
  const [open, setOpen] = useState(false);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (fill.current) fill.current.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // light chrome while over the bright sections
    const st = ScrollTrigger.create({
      trigger: "#tools",
      // desktop: the hero has already flooded to paper ~300px before the tools section arrives
      start: () => (window.innerWidth > 900 ? "top 340px" : "top 40px"),
      endTrigger: "#waitlist",
      end: "top 40px",
      toggleClass: { targets: document.body, className: "is-light" },
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      st.kill();
    };
  }, []);

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else if (!document.body.classList.contains("is-loading")) window.__lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (key: string) => {
    setOpen(false);
    window.__lenis?.start();
    if (key === "tools" && window.innerWidth > 900) {
      window.dispatchEvent(new CustomEvent("lm:jump", { detail: "tools" }));
      return;
    }
    const el = document.getElementById(key);
    if (el) window.__lenis ? window.__lenis.scrollTo(el, { duration: 1.4 }) : el.scrollIntoView();
  };

  return (
    <>
      <div className="progress" aria-hidden="true">
        <div className="progress__fill" ref={fill} />
      </div>
      <a href="#top" className="logo" aria-label="Lumen home" onClick={(e) => (e.preventDefault(), go("top"))}>
        <LumenMark />
        Lumen
      </a>
      <button
        className={`menu-toggle${open ? " is-open" : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
      </button>
      <div className={`menu${open ? " is-open" : ""}`} onClick={(e) => e.target === e.currentTarget && setOpen(false)} aria-hidden={!open}>
        <div className="menu__panel">
          <div className="menu__brand">
            <span className="label" style={{ color: "var(--text-light-dim)" }}>Spring &apos;27 Release</span>
            <h2>
              Twelve new tools.
              <br />
              <span className="spectrum-text">One spectrum.</span>
            </h2>
            <p>Lumen is a fictional AI creative suite for design teams, built as a motion design showcase.</p>
          </div>
          <nav className="menu__list" aria-label="Sections">
            {LINKS.map((l) => (
              <button key={l.key} onClick={() => go(l.key)} tabIndex={open ? 0 : -1}>
                {l.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
