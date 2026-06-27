"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

gsap.registerPlugin(ScrollTrigger);

const SERIES = [
  { n: "01", title: "Urban Geometries",    frames: "14", year: "2024", ratio: "2/3"  as const },
  { n: "02", title: "Light & Shadow",      frames: "09", year: "2024", ratio: "3/4"  as const },
  { n: "03", title: "Night Studies",       frames: "11", year: "2023", ratio: "2/3"  as const },
  { n: "04", title: "Architectural Forms", frames: "08", year: "2023", ratio: "3/4"  as const },
  { n: "05", title: "Documentary",         frames: "21", year: "2022", ratio: "1/1"  as const },
];

export function SeriesSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headRef     = useRef<HTMLDivElement>(null);
  const rowRefs     = useRef<(HTMLAnchorElement | null)[]>([]);
  const imgWrapRef  = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeIdx   = useRef<number>(-1);

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

    // ── Hover image reveal ──────────────────────────────────────────
    const wrap = imgWrapRef.current!;

    // Track cursor Y to move the image vertically
    const onMouseMove = (e: MouseEvent) => {
      if (activeIdx.current < 0) return;
      const section = sectionRef.current!.getBoundingClientRect();
      const relY = e.clientY - section.top;
      gsap.to(wrap, { y: relY - wrap.offsetHeight / 2, duration: 0.6, ease: "power3.out" });
    };
    sectionRef.current?.addEventListener("mousemove", onMouseMove);

    rowRefs.current.forEach((row, i) => {
      if (!row) return;

      row.addEventListener("mouseenter", () => {
        activeIdx.current = i;

        // Hide all inner images, show the hovered one
        imgInnerRef.current.forEach((el, j) => {
          if (!el) return;
          gsap.set(el, { display: j === i ? "block" : "none" });
        });

        // Slide in from right with clip-path
        gsap.fromTo(wrap,
          { clipPath: "inset(0% 100% 0% 0%)", x: 30, opacity: 1 },
          { clipPath: "inset(0% 0% 0% 0%)", x: 0,
            duration: 0.55, ease: "power4.out" }
        );
      });

      row.addEventListener("mouseleave", () => {
        activeIdx.current = -1;
        gsap.to(wrap, {
          clipPath: "inset(0% 0% 0% 100%)",
          duration: 0.4,
          ease: "power3.in",
        });
      });
    });

    return () => {
      sectionRef.current?.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <section ref={sectionRef} style={{ borderTop: "0.5px solid var(--c-border)", position: "relative" }}>

      {/* Floating hover image — absolutely positioned, right side */}
      <div
        ref={imgWrapRef}
        style={{
          position: "absolute",
          right: "var(--page-px)",
          top: 0,
          width: "clamp(140px, 16vw, 240px)",
          pointerEvents: "none",
          zIndex: 10,
          clipPath: "inset(0% 100% 0% 0%)",
          willChange: "transform, clip-path",
        }}
      >
        {SERIES.map((s, i) => (
          <div
            key={s.n}
            ref={el => { imgInnerRef.current[i] = el; }}
            style={{ display: "none" }}
          >
            <PhotoPlaceholder ratio={s.ratio} />
          </div>
        ))}
      </div>

      {/* Header */}
      <div ref={headRef} style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        padding: "2.5rem var(--page-px) 0",
      }}>
        <span className="caps tracked text-dimmer" style={{ fontSize: "9px" }}>Series</span>
        <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
          {SERIES.length.toString().padStart(2, "0")} collections
        </span>
      </div>

      {/* Rows */}
      <div style={{ marginTop: "1.5rem" }}>
        {SERIES.map((s, i) => (
          <a
            key={s.n}
            ref={el => { rowRefs.current[i] = el; }}
            href={`#${s.title.toLowerCase().replace(/\s+/g, "-")}`}
            data-cursor
            data-cursor-label="OPEN"
            className="series-row"
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(1rem, 3vw, 3rem)" }}>
              <span className="series-dim" style={{
                fontSize: "9px", letterSpacing: "0.18em",
                color: "var(--c-fg-3)", textTransform: "uppercase", minWidth: "2rem",
              }}>
                {s.n}
              </span>
              <span style={{
                fontSize: "clamp(1.2rem, 3.5vw, 3.2rem)",
                fontWeight: 500, letterSpacing: "-0.01em", textTransform: "uppercase",
              }}>
                {s.title}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
              <span className="series-dim caps tracked" style={{ fontSize: "9px", color: "var(--c-fg-3)" }}>
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
