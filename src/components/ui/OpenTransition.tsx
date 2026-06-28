"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * The staged "framed artwork → portal" transition that bridges a matted
 * thumbnail into the dark film-reel viewer.
 *
 *  Phase 2 — the warm-white mat expands from the exact click origin
 *  Phase 4 — the white surface dims: warm white → grey → charcoal → near-black
 *  Phase 5 — at the dark point the viewer is revealed underneath, then this
 *            overlay dissolves so the reel appears to emerge from darkness
 */
export function OpenTransition({
  origin, onReveal, onDone,
}: { origin: { x: number; y: number }; onReveal: () => void; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useRef(false);

  useEffect(() => {
    const el = ref.current!;
    const { x, y } = origin;
    const vw = window.innerWidth, vh = window.innerHeight;
    const R = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y)) + 60;

    gsap.set(el, { clipPath: `circle(0px at ${x}px ${y}px)`, backgroundColor: "#F7F4EE", opacity: 1 });

    const tl = gsap.timeline();
    // Phase 2 — mat expands from the click point
    tl.to(el, { clipPath: `circle(${R}px at ${x}px ${y}px)`, duration: 0.5, ease: "power3.inOut" });
    // Phase 4 — the gallery lights dim
    tl.to(el, { backgroundColor: "#D6D2CB", duration: 0.12, ease: "none" })
      .to(el, { backgroundColor: "#4A4A4A", duration: 0.16, ease: "none" })
      .to(el, {
        backgroundColor: "#0B0B0B", duration: 0.2, ease: "power2.in",
        onComplete: () => { if (!revealed.current) { revealed.current = true; onReveal(); } },
      });
    // Phase 5 — hold, then dissolve to reveal the emerged reel
    tl.to(el, { opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.18, onComplete: onDone });

    return () => { tl.kill(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} aria-hidden style={{
      position: "fixed", inset: 0, zIndex: 470, pointerEvents: "none",
      willChange: "clip-path, opacity",
    }} />
  );
}
