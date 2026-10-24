"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { INTEGRATIONS } from "@/lib/tools";

export default function Integrations() {
  const [open, setOpen] = useState(0);
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".integrations__head > *", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(".strip", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".strips", start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <section className="integrations" id="integrations" ref={root}>
      <div className="integrations__head">
        <h2>
          Works with the tools
          <br />
          your team already loves
        </h2>
        <p>Every Lumen tool runs where you already design, plan and ship. No exports, no copy-paste.</p>
      </div>
      <div className="strips">
        {INTEGRATIONS.map((it, i) => (
          <div
            key={it.name}
            className={`strip${open === i ? " is-open" : ""}`}
            role="button"
            tabIndex={0}
            aria-expanded={open === i}
            onClick={() => setOpen(i)}
            onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setOpen(i)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpen(i))}
          >
            <span className="strip__title">{it.name}</span>
            <span className="strip__badge" aria-hidden="true">
              {it.name[0]}
            </span>
            <div className="strip__body">
              <h3>Lumen × {it.name}</h3>
              <p>{it.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
