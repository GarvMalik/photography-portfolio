"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { LogoMark } from "@/components/ui/LogoMark";

export function Preloader() {
  const rootRef    = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Organic counter 00 → 100
    let n = 0;
    const countInt = setInterval(() => {
      n = Math.min(n + Math.ceil(Math.random() * 4 + 1), 100);
      if (counterRef.current) counterRef.current.textContent = String(n).padStart(3, "0");
      if (n >= 100) clearInterval(countInt);
    }, 28);

    const strokes = rootRef.current?.querySelectorAll(".lm-stroke") ?? [];
    const words   = rootRef.current?.querySelectorAll(".lm-word") ?? [];

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        document.body.style.overflow = "";
      },
    });

    // Emblem draws itself in
    gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
    tl.to(strokes, { strokeDashoffset: 0, duration: 1.3, stagger: 0.035, ease: "power2.inOut" }, 0.15)
      .fromTo(words, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.8)
      // Progress line fills
      .fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: "power1.inOut" }, 0.2)
      // Hold, then a soft lift + wipe reveals the page
      .to(logoRef.current, { y: -22, scale: 1.05, opacity: 0, duration: 0.7, ease: "power3.in" }, 2.0)
      .to(rootRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.9, ease: "power4.inOut",
      }, 2.05);

    return () => {
      tl.kill();
      clearInterval(countInt);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  const glow: CSSProperties = {
    position: "absolute", inset: 0, pointerEvents: "none",
    background: "radial-gradient(58% 50% at 50% 64%, rgba(255,255,255,0.06), transparent 72%)",
  };

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed", inset: 0,
        background: "#050505",
        zIndex: 400,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        clipPath: "inset(0% 0% 0% 0%)",
        overflow: "hidden",
      }}
    >
      <div style={glow} />

      <div ref={logoRef} style={{ position: "relative", zIndex: 2 }}>
        <LogoMark size="clamp(150px, 18vw, 240px)" />
      </div>

      {/* Progress line + counter */}
      <div style={{
        position: "absolute", bottom: "clamp(2rem, 6vh, 4rem)",
        left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
        width: "min(72vw, 320px)",
      }}>
        <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
          <div ref={barRef} style={{
            width: "100%", height: "100%", background: "rgba(255,255,255,0.7)",
            transformOrigin: "left center",
          }} />
        </div>
        <span ref={counterRef} style={{
          fontSize: "10px", letterSpacing: "0.3em", color: "var(--c-fg-3)",
          fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-display)",
        }}>
          000
        </span>
      </div>
    </div>
  );
}
