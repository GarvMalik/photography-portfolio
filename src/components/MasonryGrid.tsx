"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParticleBlast } from "@/components/ParticleBlast";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import type { Photo } from "@/lib/photos";

gsap.registerPlugin(ScrollTrigger);

const SPANS = [
  { col: "1 / 3", row: "1"     },
  { col: "3",     row: "1 / 3" },
  { col: "1",     row: "2"     },
  { col: "2",     row: "2"     },
  { col: "1 / 4", row: "3"     },
  { col: "1",     row: "4"     },
  { col: "2 / 4", row: "4"     },
] as const;

export function MasonryGrid({ photos }: { photos: Photo[] }) {
  const gridRef  = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const router   = useRouter();

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);
    if (!items.length) return;

    gsap.fromTo(items,
      { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
      {
        clipPath: "inset(0% 0% 0% 0%)", opacity: 1,
        duration: 1.1, stagger: 0.08, ease: "power4.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 78%" },
      }
    );
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section id="work">
      {/* Section header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        padding: "2.5rem var(--page-px) 1.5rem",
        borderBottom: "0.5px solid var(--c-border)",
      }}>
        <span className="caps tracked text-dimmer" style={{ fontSize: "9px" }}>
          Selected work
        </span>
        <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
          {photos.length.toString().padStart(2, "0")} frames
        </span>
      </div>

      {/* Grid */}
      <div ref={gridRef} className="masonry-grid">
        {photos.map((photo, i) => {
          const span = SPANS[i] ?? { col: "auto", row: "auto" };
          const num  = String(i + 1).padStart(2, "0");

          return (
            <div key={photo.slug}
                 ref={el => { itemRefs.current[i] = el; }}
                 className="grid-item-wrap"
                 style={{ gridColumn: span.col, gridRow: span.row,
                          position: "relative", overflow: "hidden" }}>

              <ParticleBlast onDoubleClick={() => router.push(`/photo/${photo.slug}`)}>
                <PhotoPlaceholder
                  ratio={photo.ratio}
                  src={photo.src}
                  alt={photo.alt}
                  label={`${photo.label} — ${photo.type}`}
                  sub={photo.series}
                />
              </ParticleBlast>

              {/* Hover overlay */}
              <div className="grid-overlay">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "9px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
                    {num}
                  </span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>→</span>
                </div>
                <p style={{ margin: "0 0 4px", fontSize: "clamp(12px, 1.5vw, 16px)",
                            fontWeight: 500, color: "#fff", textTransform: "uppercase",
                            letterSpacing: "0.04em" }}>
                  {photo.type}
                </p>
                <p style={{ margin: 0, fontSize: "9px", letterSpacing: "0.16em",
                            color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                  {photo.series} · 2024
                </p>
              </div>

              {/* Persistent frame number — top left */}
              <span style={{
                position: "absolute", top: "10px", left: "10px",
                fontSize: "8px", letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.28)", textTransform: "uppercase",
                zIndex: 3, pointerEvents: "none",
              }}>
                {num}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
