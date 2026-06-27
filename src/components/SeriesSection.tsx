"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERIES = [
  { n: "01", title: "Urban Geometries",    frames: "14", year: "2024" },
  { n: "02", title: "Light & Shadow",      frames: "09", year: "2024" },
  { n: "03", title: "Night Studies",       frames: "11", year: "2023" },
  { n: "04", title: "Architectural Forms", frames: "08", year: "2023" },
  { n: "05", title: "Documentary",         frames: "21", year: "2022" },
];

export function SeriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const rowRefs    = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const trigger = { trigger: sectionRef.current, start: "top 72%" };

    gsap.fromTo(headRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: trigger }
    );

    rowRefs.current.forEach((row, i) => {
      gsap.fromTo(row,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.7, delay: i * 0.08,
          ease: "power3.out", scrollTrigger: trigger }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} style={{ borderTop: "0.5px solid var(--c-border)" }}>

      {/* Header */}
      <div ref={headRef} style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        padding: "2.5rem var(--page-px) 0",
        marginBottom: "0",
      }}>
        <span className="caps tracked text-dimmer" style={{ fontSize: "9px" }}>
          Series
        </span>
        <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
          {SERIES.length.toString().padStart(2,"0")} collections
        </span>
      </div>

      {/* Rows — each is a large hover-invertible link */}
      <div style={{ marginTop: "1.5rem" }}>
        {SERIES.map((s, i) => (
          <a key={s.n}
             ref={el => { rowRefs.current[i] = el; }}
             href={`#${s.title.toLowerCase().replace(/\s+/g, "-")}`}
             data-cursor
             className="series-row">

            <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(1rem, 3vw, 3rem)" }}>
              <span className="series-dim"
                    style={{ fontSize: "9px", letterSpacing: "0.18em", color: "var(--c-fg-3)",
                             textTransform: "uppercase", minWidth: "2rem" }}>
                {s.n}
              </span>
              <span style={{
                fontSize: "clamp(1.2rem, 3.5vw, 3.2rem)",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                textTransform: "uppercase",
              }}>
                {s.title}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
              <span className="series-dim caps tracked"
                    style={{ fontSize: "9px", color: "var(--c-fg-3)" }}>
                {s.frames} frames · {s.year}
              </span>
              <span className="series-arrow" style={{ fontSize: "1.2rem", lineHeight: 1 }}>→</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
