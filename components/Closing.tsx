"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import RollButton from "./RollButton";

export default function Closing() {
  const root = useRef<HTMLElement>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      gsap.from(".closing h2, .closing__lede", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(".form", {
        y: 60,
        opacity: 0,
        scale: 0.97,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });
      gsap.fromTo(
        ".closing__rays",
        { rotate: -8, opacity: 0.3 },
        { rotate: 8, opacity: 0.9, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true } }
      );
    },
    { scope: root }
  );

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next: Record<string, boolean> = {};
    if (!String(fd.get("name") || "").trim()) next.name = true;
    if (!/^\S+@\S+\.\S+$/.test(String(fd.get("email") || ""))) next.email = true;
    setErrors(next);
    if (Object.keys(next).length) {
      const first = e.currentTarget.querySelector<HTMLInputElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }
    setDone(true);
  };

  return (
    <section className="closing" id="waitlist" ref={root}>
      <div className="closing__rays" />
      <div className="closing__grid">
        <div>
          <span className="label" style={{ color: "var(--text-light-dim)" }}>Spring &apos;27 · Early access</span>
          <h2 style={{ marginTop: 18 }}>
            Bring your ideas <span className="spectrum-text">into the light.</span>
          </h2>
          <p className="closing__lede">
            Lumen&apos;s twelve new tools roll out to teams in waves. Join the waitlist and we&apos;ll set up your workspace with your own library.
          </p>
        </div>
        <form className="form" onSubmit={submit} noValidate>
          {done ? (
            <div className="form__done" role="status">
              <strong>You&apos;re on the list.</strong>
              We&apos;ll be in touch before the first wave opens. (This is a demo; nothing was sent.)
            </div>
          ) : (
            <>
              <label>
                Full name
                <input name="name" autoComplete="name" aria-invalid={!!errors.name} />
              </label>
              <label>
                Work email
                <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} />
              </label>
              <label>
                Team size
                <select name="size" defaultValue="6-20">
                  <option>1-5</option>
                  <option>6-20</option>
                  <option>21-100</option>
                  <option>100+</option>
                </select>
              </label>
              <label>
                Role
                <select name="role" defaultValue="Product designer">
                  <option>Product designer</option>
                  <option>Brand designer</option>
                  <option>Design lead</option>
                  <option>Engineer</option>
                  <option>Other</option>
                </select>
              </label>
              {Object.keys(errors).length > 0 && (
                <p className="form__error" role="alert">
                  Please add {errors.name && "your name"}
                  {errors.name && errors.email && " and "}
                  {errors.email && "a valid work email"}.
                </p>
              )}
              <div className="full" style={{ marginTop: 6 }}>
                <RollButton type="submit">Join the waitlist</RollButton>
              </div>
            </>
          )}
        </form>
      </div>
      <div className="closing__foot">
        <span>© 2027 Lumen. A fictional brand made for a design showcase.</span>
        <span>Built with Next.js · GSAP · Lenis</span>
      </div>
    </section>
  );
}
