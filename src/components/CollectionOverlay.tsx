"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

export interface Collection {
  id:      string;
  title:   string;
  country: string;
  year:    string;
  frames:  string;
  photos:  { ratio: "2/3" | "3/4" | "1/1" | "16/9" | "4/3" }[];
}

interface Props {
  collection: Collection;
  onClose: () => void;
}

export function CollectionOverlay({ collection, onClose }: Props) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLDivElement>(null);
  const subRef      = useRef<HTMLDivElement>(null);
  const photosRef   = useRef<(HTMLDivElement | null)[]>([]);
  const ghostRef    = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  // Entrance — wipe up from bottom, then title, then photo
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power4.inOut" }
    )
    .fromTo(titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }, "-=0.2"
    )
    .fromTo(subRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }, "-=0.3"
    );

    // Stagger photos in
    photosRef.current.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.5 + i * 0.1, ease: "power4.out" }
      );
    });

    // Lock scroll
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close — wipe back down
  const handleClose = useCallback(() => {
    gsap.to(overlayRef.current, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.6, ease: "power4.inOut",
      onComplete: onClose,
    });
  }, [onClose]);

  // Ghost double-exposure on hover
  const onPhotoMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const { left, top, width, height } = el.getBoundingClientRect();
    const ghost = ghostRef.current;
    if (!ghost) return;

    // Position ghost relative to hovered photo
    const ghostEl = el.querySelector("[data-ghost]") as HTMLElement;
    if (!ghostEl) return;

    const x = (e.clientX - left) / width  - 0.5;
    const y = (e.clientY - top)  / height - 0.5;

    gsap.to(ghostEl, {
      x: x * 50,
      y: y * 35,
      opacity: 0.4,
      scale: 1.06,
      duration: 0.8,
      ease: "power2.out",
      overwrite: true,
    });
  }, []);

  const onPhotoLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const ghostEl = e.currentTarget.querySelector("[data-ghost]") as HTMLElement;
    if (!ghostEl) return;
    gsap.to(ghostEl, {
      opacity: 0, scale: 0.97, x: 0, y: 0,
      duration: 0.5, ease: "power3.out",
    });
  }, []);

  const goNext = () => {
    if (current < collection.photos.length - 1) {
      const nextIdx = current + 1;
      setCurrent(nextIdx);
      photosRef.current[nextIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const goPrev = () => {
    if (current > 0) {
      const prevIdx = current - 1;
      setCurrent(prevIdx);
      photosRef.current[prevIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") goNext();
      if (e.key === "ArrowUp"   || e.key === "ArrowLeft")  goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, handleClose]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed", inset: 0,
        background: "#050505",
        zIndex: 450,
        display: "flex", flexDirection: "column",
        clipPath: "inset(100% 0% 0% 0%)",
        overflow: "hidden",
      }}
    >
      {/* ── Top bar ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px var(--page-px)",
        borderBottom: "0.5px solid var(--c-border)",
        flexShrink: 0, zIndex: 2,
      }}>
        {/* Title */}
        <div>
          <div ref={titleRef} style={{
            fontSize: "clamp(1.6rem, 5vw, 4rem)",
            fontWeight: 500, letterSpacing: "-0.03em",
            textTransform: "uppercase", color: "var(--c-fg)",
            lineHeight: 1,
          }}>
            {collection.title}
          </div>
          <div ref={subRef} style={{
            fontSize: "9px", letterSpacing: "0.2em",
            color: "var(--c-fg-3)", textTransform: "uppercase",
            marginTop: "6px",
          }}>
            {collection.country} · {collection.frames} frames · {collection.year}
          </div>
        </div>

        <button
          onClick={handleClose}
          data-cursor data-cursor-label="CLOSE"
          style={{
            background: "none", border: "none", padding: 0, cursor: "none",
            fontSize: "9px", letterSpacing: "0.28em",
            color: "var(--c-fg-3)", textTransform: "uppercase",
            fontFamily: "var(--font-display)",
          }}
        >
          Close ✕
        </button>
      </div>

      {/* ── Scrollable photos ── */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "3rem var(--page-px) 6rem",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: "4rem",
      }}>
        {collection.photos.map((photo, i) => (
          <div
            key={i}
            ref={el => { photosRef.current[i] = el; }}
            onMouseMove={onPhotoMove}
            onMouseLeave={onPhotoLeave}
            onClick={() => setCurrent(i)}
            style={{
              position: "relative",
              width: "min(100%, 680px)",
              cursor: "none",
            }}
          >
            {/* Ghost double-exposure layer */}
            <div
              data-ghost
              style={{
                position: "absolute", inset: 0, zIndex: 2,
                mixBlendMode: "screen",
                filter: "blur(2px) brightness(1.8)",
                opacity: 0, pointerEvents: "none",
                willChange: "transform, opacity",
              }}
            >
              <PhotoPlaceholder ratio={photo.ratio} />
            </div>

            {/* Main photo */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <PhotoPlaceholder ratio={photo.ratio} />
            </div>

            {/* Frame number */}
            <span style={{
              position: "absolute", bottom: "12px", right: "14px",
              fontSize: "9px", letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
              zIndex: 3, pointerEvents: "none",
            }}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>

      {/* ── Bottom nav ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.25rem var(--page-px)",
        borderTop: "0.5px solid var(--c-border)",
        background: "#050505",
        zIndex: 10,
      }}>
        {/* Prev */}
        <button
          onClick={goPrev}
          disabled={current === 0}
          data-cursor data-cursor-label="PREV"
          style={{
            background: "none", border: "none", padding: 0, cursor: "none",
            fontSize: "9px", letterSpacing: "0.22em",
            color: current > 0 ? "var(--c-fg-2)" : "var(--c-fg-4)",
            textTransform: "uppercase",
          }}
        >
          ← Prev
        </button>

        {/* Counter */}
        <span style={{
          fontSize: "9px", letterSpacing: "0.18em",
          color: "var(--c-fg-3)", textTransform: "uppercase",
          fontVariantNumeric: "tabular-nums",
        }}>
          {String(current + 1).padStart(2, "0")} — {String(collection.photos.length).padStart(2, "0")}
        </span>

        {/* Next */}
        <button
          onClick={goNext}
          disabled={current === collection.photos.length - 1}
          data-cursor data-cursor-label="NEXT"
          style={{
            background: "none", border: "none", padding: 0, cursor: "none",
            fontSize: "9px", letterSpacing: "0.22em",
            color: current < collection.photos.length - 1 ? "var(--c-fg-2)" : "var(--c-fg-4)",
            textTransform: "uppercase",
          }}
        >
          Next →
        </button>
      </div>

      {/* NEXT fixed right-side button (like aikawakenichi) */}
      {current < collection.photos.length - 1 && (
        <button
          onClick={goNext}
          data-cursor data-cursor-label="NEXT"
          style={{
            position: "absolute", right: "var(--page-px)", top: "50%",
            transform: "translateY(-50%)",
            background: "none", border: "0.5px solid var(--c-border)",
            padding: "8px 14px", cursor: "none",
            fontSize: "8px", letterSpacing: "0.28em",
            color: "var(--c-fg-3)", textTransform: "uppercase",
            zIndex: 10,
          }}
        >
          Next
        </button>
      )}

      <div ref={ghostRef} />
    </div>
  );
}
