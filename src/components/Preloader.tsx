"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const countRef   = useRef<HTMLSpanElement>(null);
  const logoRef    = useRef<HTMLSpanElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const tl = gsap.timeline();

    // Entrance
    tl.fromTo(logoRef.current,
        { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .fromTo(lineRef.current,
        { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power3.out" }, "-=0.2")
      .fromTo(countRef.current,
        { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.3");

    // Count 0 → 100
    const obj = { val: 0 };
    tl.to(obj, {
      val: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate() {
        if (countRef.current) {
          countRef.current.textContent = String(Math.floor(obj.val)).padStart(2, "0");
        }
      },
    }, "-=0.1");

    // Wipe out — clip-path shrinks upward, no SVG filter needed
    tl.to(overlayRef.current, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.75,
      ease: "power4.inOut",
      delay: 0.2,
      onComplete: () => setDone(true),
    });
  }, [done]);

  if (done) return null;

  return (
    <div ref={overlayRef}
         style={{
           position: "fixed", inset: 0, zIndex: 400,
           background: "#050505",
           display: "flex", flexDirection: "column",
           alignItems: "center", justifyContent: "center",
           clipPath: "inset(0% 0% 0% 0%)",
         }}>
      <span ref={logoRef}
            style={{
              fontSize: "clamp(2.5rem, 8vw, 7rem)",
              fontWeight: 500,
              letterSpacing: "0.22em",
              color: "#fff",
              textTransform: "uppercase",
            }}>
        GM
      </span>
      <div ref={lineRef}
           style={{
             width: "clamp(60px, 10vw, 120px)",
             height: "0.5px",
             background: "rgba(255,255,255,0.25)",
             margin: "1rem 0",
             transformOrigin: "left center",
           }} />
      <span ref={countRef}
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.35)",
              fontVariantNumeric: "tabular-nums",
            }}>
        00
      </span>
    </div>
  );
}
