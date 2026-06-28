"use client";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export interface LightboxState {
  src: string;
  caption?: string;
  rect: DOMRect;   // the clicked image's on-screen rect (FLIP origin)
}

/**
 * Premium inline lightbox for editorial (Stories) images. The image grows from
 * its exact original position (manual FLIP), over a dimmed + blurred page.
 * No next/previous — single-image inspection.
 */
export function Lightbox({ state, onClose }: { state: LightboxState; onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const imgRef      = useRef<HTMLImageElement>(null);
  const closing     = useRef(false);

  // FLIP from the origin rect → centred
  useEffect(() => {
    const img = imgRef.current!, backdrop = backdropRef.current!;
    const last  = img.getBoundingClientRect();
    const first = state.rect;
    const dx = first.left - last.left;
    const dy = first.top  - last.top;
    const sx = first.width  / last.width;
    const sy = first.height / last.height;

    gsap.set(img, { x: dx, y: dy, scaleX: sx, scaleY: sy, transformOrigin: "top left" });
    gsap.to(img, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.65, ease: "power3.inOut" });
    gsap.fromTo(backdrop,
      { opacity: 0, backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)" },
      { opacity: 1, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", duration: 0.5, ease: "power2.out" });

    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [state]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const img = imgRef.current!, backdrop = backdropRef.current!;
    const last  = img.getBoundingClientRect();
    const first = state.rect;
    gsap.to(img, {
      x: first.left - last.left, y: first.top - last.top,
      scaleX: first.width / last.width, scaleY: first.height / last.height,
      transformOrigin: "top left", duration: 0.5, ease: "power3.inOut",
    });
    gsap.to(backdrop, { opacity: 0, backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)",
      duration: 0.45, ease: "power2.in", onComplete: onClose });
  }, [state, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div
      ref={backdropRef}
      onClick={close}
      data-cursor data-cursor-label="CLOSE"
      style={{
        position: "fixed", inset: 0, zIndex: 480,
        background: "rgba(4,4,5,0.82)",
        display: "grid", placeItems: "center",
        cursor: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={state.src}
        alt={state.caption ?? ""}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: "86vw", maxHeight: "84vh", objectFit: "contain", display: "block",
          boxShadow: "0 40px 120px rgba(0,0,0,0.7)", willChange: "transform",
        }}
      />
      {state.caption && (
        <div style={{
          position: "absolute", bottom: "30px", left: 0, right: 0, textAlign: "center",
          fontSize: "12px", letterSpacing: "0.04em", color: "rgba(255,255,255,0.7)",
          fontStyle: "italic", pointerEvents: "none",
        }}>
          {state.caption}
        </div>
      )}
      <button
        onClick={close}
        aria-label="Close"
        data-cursor data-cursor-label="CLOSE"
        style={{
          position: "absolute", top: "1.6rem", right: "var(--page-px)",
          background: "none", border: "none", cursor: "none",
          fontSize: "9px", letterSpacing: "0.26em", color: "rgba(255,255,255,0.65)",
          textTransform: "uppercase", fontFamily: "var(--font-display)", padding: "10px",
        }}
      >
        Close ✕
      </button>
    </div>
  );
}
