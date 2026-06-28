"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FilmReelViewer } from "@/components/FilmReelViewer";
import { collectionToFrames, type Collection } from "@/lib/reel";

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
      { src: "/images/finland/finland-14.webp",   ratio: "4/3" },
      { src: "/images/finland/finland-12.jpg",   ratio: "4/3" },
      { src: "/images/finland/finland-16.jpg",   ratio: "3/4" },
      { src: "/images/best-of-all/best-20.jpg",  ratio: "3/4" },
      { src: "/images/finland/finland-13.webp",   ratio: "4/3" },
    ],
  },
  {
    id: "modernisme", title: "Modernisme", country: "Gaudí's Barcelona",
    year: "2024", frames: "07", cover: "/images/spain/spain-29.webp", coverRatio: "3/4",
    photos: [
      { src: "/images/spain/spain-03.jpg", ratio: "3/4" },
      { src: "/images/spain/spain-29.webp", ratio: "3/4" },
      { src: "/images/spain/spain-30.webp", ratio: "3/4" },
      { src: "/images/spain/spain-28.jpg", ratio: "3/4" },
      { src: "/images/spain/spain-33.webp", ratio: "4/3" },
      { src: "/images/spain/spain-34.jpg", ratio: "3/4" },
      { src: "/images/spain/spain-05.jpg", ratio: "3/4" },
    ],
  },
  {
    id: "golden-hour", title: "Golden Hour", country: "Last Light",
    year: "2024", frames: "08", cover: "/images/spain/spain-40.jpg", coverRatio: "4/3",
    photos: [
      { src: "/images/spain/spain-43.jpg",     ratio: "4/3" },
      { src: "/images/spain/spain-40.jpg",     ratio: "4/3" },
      { src: "/images/best-of-all/best-25.webp", ratio: "4/3" }, // palm sunset
      { src: "/images/spain/spain-41.jpg",     ratio: "4/3" },
      { src: "/images/spain/spain-42.jpg",     ratio: "4/3" },
      { src: "/images/finland/finland-07.webp", ratio: "2/3" },
      { src: "/images/best-of-all/best-23.webp", ratio: "4/3" }, // harbour sunset
      { src: "/images/best-of-all/best-21.jpg", ratio: "4/3" },
    ],
  },
  {
    id: "in-bloom", title: "In Bloom", country: "Still Life",
    year: "2024", frames: "06", cover: "/images/best-of-all/best-14.jpg", coverRatio: "3/4",
    photos: [
      { src: "/images/best-of-all/best-14.jpg", ratio: "3/4" },
      { src: "/images/best-of-all/best-10.webp", ratio: "3/4" },
      { src: "/images/best-of-all/best-15.jpg", ratio: "3/4" },
      { src: "/images/best-of-all/best-18.jpg", ratio: "3/4" },
      { src: "/images/best-of-all/best-19.jpg", ratio: "3/4" },
      { src: "/images/india/india-07.jpg",      ratio: "2/3" },
    ],
  },
  {
    id: "after-dark", title: "After Dark", country: "Night Studies",
    year: "2023", frames: "06", cover: "/images/india/india-11.webp", coverRatio: "4/3",
    photos: [
      { src: "/images/india/india-11.webp",     ratio: "4/3" },
      { src: "/images/spain/spain-24.jpg",     ratio: "3/4" },
      { src: "/images/spain/spain-38.webp",     ratio: "4/3" },
      { src: "/images/finland/finland-08.webp", ratio: "4/3" },
      { src: "/images/india/india-12.webp",     ratio: "4/3" },
      { src: "/images/india/india-13.webp",     ratio: "4/3" },
    ],
  },
];

export function SeriesSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headRef     = useRef<HTMLDivElement>(null);
  const rowRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const rowsWrapRef = useRef<HTMLDivElement>(null);
  const imgWrapRef  = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<(HTMLImageElement | null)[]>([]);
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
        const wasInactive = activeIdx.current < 0;
        activeIdx.current = i;
        // crossfade — previous preview fades out, next fades in + settles
        imgInnerRef.current.forEach((el, j) => {
          if (!el) return;
          gsap.to(el, { opacity: j === i ? 1 : 0, scale: j === i ? 1 : 1.03,
            duration: 0.5, ease: "power2.out", overwrite: true });
        });
        // reveal the panel only when entering the list from outside (no jitter)
        if (wasInactive) {
          gsap.fromTo(wrap,
            { clipPath: "inset(0% 100% 0% 0%)", x: 26 },
            { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 0.55, ease: "power4.out" }
          );
        }
      });
    });

    // hide only when the pointer leaves the whole list
    const onLeave = () => {
      activeIdx.current = -1;
      gsap.to(wrap, { clipPath: "inset(0% 0% 0% 100%)", duration: 0.4, ease: "power3.in" });
    };
    rowsWrapRef.current?.addEventListener("mouseleave", onLeave);

    return () => {
      sectionRef.current?.removeEventListener("mousemove", onMouseMove);
      rowsWrapRef.current?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section id="series" ref={sectionRef} style={{ borderTop: "0.5px solid var(--c-border)", position: "relative" }}>

      {/* Floating hover preview — ONE fixed-size matted frame for all series,
          so dimensions never shift between rows. Images crossfade inside it. */}
      <div
        ref={imgWrapRef}
        style={{
          position: "absolute",
          right: "var(--page-px)",
          top: 0,
          width: "clamp(200px, 23vw, 340px)",
          pointerEvents: "none",
          zIndex: 10,
          clipPath: "inset(0% 100% 0% 0%)",
          willChange: "transform, clip-path",
        }}
      >
        <div style={{
          background: "#F7F4EE", borderRadius: "3px", padding: "7%",
          boxShadow: "0 18px 50px rgba(0,0,0,0.42)",
        }}>
          <div style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden", background: "#e9e6df" }}>
            {SERIES.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.id}
                ref={el => { imgInnerRef.current[i] = el; }}
                src={s.cover}
                alt={s.title}
                loading="lazy"
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  objectFit: "cover", display: "block",
                  opacity: 0, transform: "scale(1.03)", willChange: "opacity, transform",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <div ref={headRef} style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        padding: "2.5rem var(--page-px) 0",
      }}>
        <h2 className="caps tracked text-dimmer" style={{ fontSize: "9px", margin: 0, fontWeight: 400 }}>Series</h2>
        <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
          {SERIES.length.toString().padStart(2, "0")} collections
        </span>
      </div>

      {/* Rows */}
      <div ref={rowsWrapRef} style={{ marginTop: "1.5rem" }}>
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
        <FilmReelViewer
          frames={collectionToFrames(active)}
          startIndex={0}
          variant="rich"
          collectionTitle={active.title}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}
