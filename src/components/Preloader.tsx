"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Preloader() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const gPathRef   = useRef<SVGPathElement>(null);
  const mPathRef   = useRef<SVGPathElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const wrap    = wrapRef.current!;
    const gPath   = gPathRef.current!;
    const mPath   = mPathRef.current!;
    const counter = counterRef.current!;
    const line    = lineRef.current!;

    const setupPath = (path: SVGPathElement) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray  = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    };
    setupPath(gPath);
    setupPath(mPath);

    document.body.style.overflow = "hidden";

    // Organic counter
    let n = 0;
    const countInt = setInterval(() => {
      n = Math.min(n + Math.ceil(Math.random() * 4 + 1), 100);
      counter.textContent = String(n).padStart(2, "0");
      if (n >= 100) clearInterval(countInt);
    }, 28);

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        document.body.style.overflow = "";
      },
    });

    tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power3.out" }, 0.1)
      .to(gPath, { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut" }, 0.3)
      .to(mPath, { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut" }, 0.75)
      .fromTo(counter, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.5)
      .to(wrap, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.9,
        ease: "power4.inOut",
        delay: 0.5,
      });

    return () => {
      tl.kill();
      clearInterval(countInt);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={wrapRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "#050505",
        zIndex: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "inset(0% 0% 0% 0%)",
      }}
    >
      {/* Thin horizontal rule behind the mark */}
      <div ref={lineRef} style={{
        position: "absolute",
        top: "50%",
        left: "var(--page-px)",
        right: "var(--page-px)",
        height: "0.5px",
        background: "rgba(255,255,255,0.06)",
        transformOrigin: "left center",
      }} />

      {/* SVG GM — stroke draw-on */}
      <svg
        viewBox="0 0 200 80"
        width="clamp(140px, 16vw, 220px)"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: "block" }}
      >
        <path ref={gPathRef} d="M68 18 A30 30 0 1 0 68 62 L68 42 L50 42" />
        <path ref={mPathRef} d="M88 62 L88 18 L112 52 L136 18 L136 62" />
      </svg>

      {/* Counter */}
      <div style={{
        position: "absolute",
        bottom: "clamp(1.5rem, 4vw, 2.5rem)",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "baseline",
        gap: "4px",
      }}>
        <span ref={counterRef} style={{
          fontSize: "10px",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.3)",
          fontFamily: "var(--font-display)",
          fontVariantNumeric: "tabular-nums",
        }}>
          00
        </span>
        <span style={{
          fontSize: "9px",
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.15)",
          fontFamily: "var(--font-display)",
        }}>
          / 100
        </span>
      </div>
    </div>
  );
}
