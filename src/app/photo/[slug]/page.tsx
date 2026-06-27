"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { PHOTOS } from "@/lib/photos";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

export default function PhotoPage() {
  const { slug }    = useParams<{ slug: string }>();
  const router      = useRouter();
  const frameRef    = useRef<HTMLDivElement>(null);
  const ghostRef    = useRef<HTMLDivElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const navRef      = useRef<HTMLDivElement>(null);
  const ghostPos    = useRef({ x: 0, y: 0 });

  const photo = PHOTOS.find(p => p.slug === slug) ?? PHOTOS[0];

  // Entrance
  useEffect(() => {
    gsap.fromTo([frameRef.current, navRef.current],
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1.0, stagger: 0.1, ease: "power4.out" }
    );
    // Ghost starts hidden
    gsap.set(ghostRef.current, { opacity: 0, scale: 0.96 });
  }, []);

  // Ghost double-exposure follows cursor
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current!;
    const ghost = ghostRef.current!;
    const { left, top, width, height } = wrap.getBoundingClientRect();

    const relX = e.clientX - left;
    const relY = e.clientY - top;

    // Ghost lags behind cursor — different offset per axis for asymmetry
    ghostPos.current.x = (relX / width  - 0.5) * 40;
    ghostPos.current.y = (relY / height - 0.5) * 30;

    gsap.to(ghost, {
      x: ghostPos.current.x,
      y: ghostPos.current.y,
      opacity: 0.35,
      scale: 1.04,
      duration: 0.9,
      ease: "power2.out",
      overwrite: true,
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    gsap.to(ghostRef.current, {
      opacity: 0,
      scale: 0.96,
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  // Keyboard nav
  useEffect(() => {
    const idx = PHOTOS.findIndex(p => p.slug === slug);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && idx < PHOTOS.length - 1)
        router.push(`/photo/${PHOTOS[idx + 1].slug}`);
      if (e.key === "ArrowLeft" && idx > 0)
        router.push(`/photo/${PHOTOS[idx - 1].slug}`);
      if (e.key === "Escape") handleBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slug]);

  const handleBack = () => {
    gsap.to([frameRef.current, navRef.current], {
      opacity: 0, y: -16, duration: 0.4, ease: "power2.in",
      onComplete: () => router.back(),
    });
  };

  const idx  = PHOTOS.findIndex(p => p.slug === slug);
  const prev = idx > 0              ? PHOTOS[idx - 1] : null;
  const next = idx < PHOTOS.length - 1 ? PHOTOS[idx + 1] : null;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#050505",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      zIndex: 50,
    }}>
      {/* Photo frame with ghost */}
      <div
        ref={wrapRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          position: "relative",
          height: "80svh",
          aspectRatio: photo.ratio,
          cursor: "none",
        }}
      >
        {/* Ghost — double exposure layer, blends over the main */}
        <div ref={ghostRef} style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          mixBlendMode: "screen",
          pointerEvents: "none",
          willChange: "transform, opacity",
          // Slight blur for the overexposed glow look
          filter: "blur(1.5px) brightness(1.6)",
        }}>
          <PhotoPlaceholder ratio={photo.ratio} />
        </div>

        {/* Main photo */}
        <div ref={frameRef} style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <PhotoPlaceholder ratio={photo.ratio} />
          {/* Frame number */}
          <span style={{
            position: "absolute", top: "12px", left: "14px",
            fontSize: "9px", letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
          }}>
            {String(idx + 1).padStart(2, "0")} / {String(PHOTOS.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Nav bar */}
      <div ref={navRef} style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.5rem var(--page-px)",
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
      }}>
        {/* Prev */}
        <button
          onClick={() => prev && router.push(`/photo/${prev.slug}`)}
          disabled={!prev}
          data-cursor data-cursor-label="PREV"
          style={{ background: "none", border: "none", padding: 0, cursor: "none",
                   fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase",
                   color: prev ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)" }}>
          ← {prev ? prev.label : "—"}
        </button>

        {/* Center meta */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "9px", letterSpacing: "0.22em",
                        color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
                        marginBottom: "4px" }}>
            {photo.series}
          </div>
          <div style={{ fontSize: "clamp(11px, 1.5vw, 14px)", letterSpacing: "0.04em",
                        color: "rgba(255,255,255,0.6)", textTransform: "uppercase",
                        fontWeight: 500 }}>
            {photo.type}
          </div>
        </div>

        {/* Next */}
        <button
          onClick={() => next && router.push(`/photo/${next.slug}`)}
          disabled={!next}
          data-cursor data-cursor-label="NEXT"
          style={{ background: "none", border: "none", padding: 0, cursor: "none",
                   fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase",
                   color: next ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)" }}>
          {next ? next.label : "—"} →
        </button>
      </div>

      {/* Back / close */}
      <button
        onClick={handleBack}
        data-cursor data-cursor-label="CLOSE"
        style={{ position: "fixed", top: "1.5rem", right: "var(--page-px)",
                 background: "none", border: "none", padding: 0, cursor: "none",
                 fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase",
                 color: "rgba(255,255,255,0.35)" }}>
        ✕ Close
      </button>

      {/* Keyboard hint */}
      <div style={{ position: "fixed", top: "1.5rem", left: "var(--page-px)",
                    fontSize: "9px", letterSpacing: "0.18em",
                    color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>
        ← → to navigate · esc to close
      </div>
    </div>
  );
}
