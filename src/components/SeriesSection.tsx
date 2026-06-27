"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { CollectionOverlay, type Collection } from "@/components/CollectionOverlay";

gsap.registerPlugin(ScrollTrigger);

// Themed series — cross-cut the locations. Each opens a real gallery.
const SERIES: (Collection & { cover: string; coverRatio: "2/3" | "3/4" | "4/3" })[] = [
  {
    id: "aurora-frost", title: "Aurora & Frost", country: "Nordic Winter",
    year: "2024", frames: "08", cover: "/images/finland/finland-11.jpg", coverRatio: "3/4",
    photos: [
      { src: "/images/best-of-all/best-09.jpg",  ratio: "3/4" },
      { src: "/images/finland/finland-11.jpg",   ratio: "4/3" },
      { src: "/images/finland/finland-15.jpg",   ratio: "3/4" },
      { src: "/images/finland/finland-14.jpg",   ratio: "4/3" },
      { src: "/images/finland/finland-12.jpg",   ratio: "4/3" },
      { src: "/images/finland/finland-16.jpg",   ratio: "3/4" },
      { src: "/images/best-of-all/best-20.jpg",  ratio: "3/4" },
      { src: "/images/finland/finland-13.jpg",   ratio: "4/3" },
    ],
  },
  {
    id: "modernisme", title: "Modernisme", country: "Gaudí's Barcelona",
    year: "2024", frames: "07", cover: "/images/spain/spain-29.jpg", coverRatio: "3/4",
    photos: [
      { src: "/images/spain/spain-03.jpg", ratio: "3/4" },
      { src: "/images/spain/spain-29.jpg", ratio: "3/4" },
      { src: "/images/spain/spain-30.jpg", ratio: "3/4" },
      { src: "/images/spain/spain-28.jpg", ratio: "3/4" },
      { src: "/images/spain/spain-33.jpg", ratio: "4/3" },
      { src: "/images/spain/spain-34.jpg", ratio: "3/4" },
      { src: "/images/spain/spain-05.jpg", ratio: "3/4" },
    ],
  },
  {
    id: "golden-hour", title: "Golden Hour", country: "Last Light",
    year: "2024", frames: "06", cover: "/images/spain/spain-40.jpg", coverRatio: "4/3",
    photos: [
      { src: "/images/spain/spain-43.jpg",     ratio: "4/3" },
      { src: "/images/spain/spain-40.jpg",     ratio: "4/3" },
      { src: "/images/spain/spain-41.jpg",     ratio: "4/3" },
      { src: "/images/spain/spain-42.jpg",     ratio: "4/3" },
      { src: "/images/finland/finland-07.jpg", ratio: "2/3" },
      { src: "/images/best-of-all/best-21.jpg", ratio: "4/3" },
    ],
  },
  {
    id: "in-bloom", title: "In Bloom", country: "Still Life",
    year: "2024", frames: "06", cover: "/images/best-of-all/best-14.jpg", coverRatio: "3/4",
    photos: [
      { src: "/images/best-of-all/best-14.jpg", ratio: "3/4" },
      { src: "/images/best-of-all/best-10.jpg", ratio: "3/4" },
      { src: "/images/best-of-all/best-15.jpg", ratio: "3/4" },
      { src: "/images/best-of-all/best-18.jpg", ratio: "3/4" },
      { src: "/images/best-of-all/best-19.jpg", ratio: "3/4" },
      { src: "/images/india/india-07.jpg",      ratio: "2/3" },
    ],
  },
  {
    id: "after-dark", title: "After Dark", country: "Night Studies",
    year: "2023", frames: "06", cover: "/images/india/india-11.jpg", coverRatio: "4/3",
    photos: [
      { src: "/images/india/india-11.jpg",     ratio: "4/3" },
      { src: "/images/spain/spain-24.jpg",     ratio: "3/4" },
      { src: "/images/spain/spain-38.jpg",     ratio: "4/3" },
      { src: "/images/finland/finland-08.jpg", ratio: "4/3" },
      { src: "/images/india/india-12.jpg",     ratio: "4/3" },
      { src: "/images/india/india-13.jpg",     ratio: "4/3" },
    ],
  },
];

export function SeriesSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headRef     = useRef<HTMLDivElement>(null);
  const rowRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const imgWrapRef  = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeIdx   = useRef<number>(-1);

  const [active, setActive] = useState<Collection | null>(null);

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
        imgInnerRef.current.forEach((el, j) => {
          if (!el) return;
          gsap.set(el, { display: j === i ? "block" : "none" });
        });
        gsap.fromTo(wrap,
          { clipPath: "inset(0% 100% 0% 0%)", x: 30, opacity: 1 },
          { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 0.55, ease: "power4.out" }
        );
      });

      row.addEventListener("mouseleave", () => {
        activeIdx.current = -1;
        gsap.to(wrap, { clipPath: "inset(0% 0% 0% 100%)", duration: 0.4, ease: "power3.in" });
      });
    });

    return () => {
      sectionRef.current?.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <section id="series" ref={sectionRef} style={{ borderTop: "0.5px solid var(--c-border)", position: "relative" }}>

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
            key={s.id}
            ref={el => { imgInnerRef.current[i] = el; }}
            style={{ display: "none" }}
          >
            <PhotoPlaceholder ratio={s.coverRatio} src={s.cover} alt={s.title} />
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
        {SERIES.map((s, i) => {
          const n = String(i + 1).padStart(2, "0");
          return (
            <div
              key={s.id}
              ref={el => { rowRefs.current[i] = el; }}
              role="button"
              tabIndex={0}
              onClick={() => setActive(s)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(s); } }}
              data-cursor
              data-cursor-label="OPEN"
              className="series-row"
              style={{ cursor: "none" }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(1rem, 3vw, 3rem)" }}>
                <span className="series-dim" style={{
                  fontSize: "9px", letterSpacing: "0.18em",
                  color: "var(--c-fg-3)", textTransform: "uppercase", minWidth: "2rem",
                }}>
                  {n}
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
            </div>
          );
        })}
      </div>

      {/* Gallery overlay */}
      {active && (
        <CollectionOverlay collection={active} onClose={() => setActive(null)} />
      )}
    </section>
  );
}
