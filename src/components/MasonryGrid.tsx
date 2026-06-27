"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { shatter } from "@/lib/shatter";
import type { Photo } from "@/lib/photos";

gsap.registerPlugin(ScrollTrigger);

// Uniform tile shape — every photo is cropped to this, so the grid is even.
const TILE_RATIO = "4/5";

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
        duration: 1.0, stagger: 0.06, ease: "power4.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 82%" },
      }
    );
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  const open = (photo: Photo, el: HTMLDivElement | null) => {
    if (!el) { router.push(`/photo/${photo.slug}`); return; }
    shatter(el, () => router.push(`/photo/${photo.slug}`));
  };

  return (
    <section id="work" aria-label="Selected work">
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
          const num = String(i + 1).padStart(2, "0");
          return (
            <div key={photo.slug}
                 ref={el => { itemRefs.current[i] = el; }}
                 className="grid-item-wrap"
                 role="link"
                 tabIndex={0}
                 aria-label={`${photo.label}, ${photo.type}. View photo`}
                 data-cursor
                 data-cursor-label="VIEW"
                 onClick={() => open(photo, itemRefs.current[i])}
                 onKeyDown={e => {
                   if (e.key === "Enter" || e.key === " ") {
                     e.preventDefault();
                     open(photo, itemRefs.current[i]);
                   }
                 }}
                 style={{ position: "relative", overflow: "hidden", cursor: "none" }}>

              <PhotoPlaceholder
                ratio={TILE_RATIO}
                src={photo.src}
                alt={photo.alt}
                label={`${photo.label} — ${photo.type}`}
                sub={photo.series}
              />

              {/* Hover affordance */}
              <div className="grid-overlay">
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "9px", letterSpacing: "0.22em", color: "#fff", textTransform: "uppercase" }}>View</span>
                  <span style={{ fontSize: "15px", color: "#fff", lineHeight: 1 }}>→</span>
                </div>
              </div>

              {/* Persistent frame number */}
              <span style={{
                position: "absolute", top: "10px", left: "10px",
                fontSize: "8px", letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.45)", textTransform: "uppercase",
                textShadow: "0 1px 6px rgba(0,0,0,0.6)",
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
