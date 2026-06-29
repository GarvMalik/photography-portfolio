"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FilmReelViewer } from "@/components/FilmReelViewer";
import { OpenTransition } from "@/components/ui/OpenTransition";
import type { ReelFrame } from "@/lib/reel";
import type { Photo } from "@/lib/photos";

gsap.registerPlugin(ScrollTrigger);

const MAT = "#F7F4EE"; // warm museum-mat white

export function MasonryGrid({ photos }: { photos: Photo[] }) {
  const gridRef  = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [viewerStart, setViewerStart] = useState<number | null>(null);
  const [pending, setPending] = useState<{ origin: { x: number; y: number }; index: number } | null>(null);

  const reelFrames: ReelFrame[] = photos.map(p => ({ src: p.src, title: p.label, type: p.type }));

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);
    if (!items.length) return;
    // opacity/clip only (no transform) so the CSS hover lift stays available
    gsap.fromTo(items,
      { opacity: 0, clipPath: "inset(6% 6% 6% 6%)" },
      {
        opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, stagger: 0.06, ease: "power3.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 82%" },
      }
    );
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  // Phase 1 — click acknowledgement: the framed print presses in, then the
  // staged transition begins from the exact click point.
  const openFrom = (e: { clientX: number; clientY: number }, i: number) => {
    const tile = itemRefs.current[i];
    if (tile) gsap.to(tile, { scale: 0.985, duration: 0.14, ease: "power2.out" });
    setPending({ origin: { x: e.clientX, y: e.clientY }, index: i });
  };
  const openFromKey = (i: number) => {
    const r = itemRefs.current[i]?.getBoundingClientRect();
    openFrom({ clientX: r ? r.left + r.width / 2 : innerWidth / 2, clientY: r ? r.top + r.height / 2 : innerHeight / 2 }, i);
  };

  const closeViewer = () => {
    setViewerStart(null);
    itemRefs.current.forEach(el => el && gsap.set(el, { clearProps: "transform" }));
  };

  return (
    <section id="work" aria-label="Selected work">
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        padding: "2.5rem var(--page-px) 1.5rem", borderBottom: "0.5px solid var(--c-border)",
      }}>
        <span className="caps tracked text-dimmer" style={{ fontSize: "9px" }}>Selected work</span>
        <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
          {photos.length.toString().padStart(2, "0")} frames
        </span>
      </div>

      {/* Museum wall — framed prints */}
      <div ref={gridRef} className="masonry-grid" style={{
        gap: "clamp(14px, 2.4vw, 34px)",
        padding: "clamp(1.75rem, 4vw, 4rem) var(--page-px)",
      }}>
        {photos.map((photo, i) => {
          const num = String(i + 1).padStart(2, "0");
          return (
            <div key={photo.slug}
                 ref={el => { itemRefs.current[i] = el; }}
                 className="art-frame"
                 role="link"
                 tabIndex={0}
                 aria-label={`${photo.label}, ${photo.type}. View photo`}
                 data-cursor
                 data-cursor-label="VIEW"
                 onClick={e => openFrom(e, i)}
                 onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openFromKey(i); } }}
                 style={{
                   background: MAT, borderRadius: "3px", cursor: "none",
                   padding: "8.5% 8.5% 0", willChange: "transform",
                   boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                 }}>
              {/* the photograph */}
              <div style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "#e9e6df" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt={photo.alt ?? photo.label} loading="lazy"
                     style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              {/* placard on the (larger) bottom mat */}
              <div style={{ padding: "11% 6% 13%", textAlign: "center" }}>
                <div style={{ fontSize: "8px", letterSpacing: "0.3em", color: "rgba(20,18,14,0.45)", fontVariantNumeric: "tabular-nums" }}>
                  {num}
                </div>
                <div style={{ fontSize: "10.5px", letterSpacing: "0.14em", color: "rgba(20,18,14,0.78)", textTransform: "uppercase", marginTop: "5px" }}>
                  {photo.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pending && (
        <OpenTransition
          origin={pending.origin}
          onReveal={() => setViewerStart(pending.index)}
          onDone={() => setPending(null)}
        />
      )}
      {viewerStart !== null && (
        <FilmReelViewer frames={reelFrames} startIndex={viewerStart} variant="minimal" onClose={closeViewer} />
      )}
    </section>
  );
}
