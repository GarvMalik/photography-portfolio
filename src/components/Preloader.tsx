"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Preloader() {
  const topPanelRef = useRef<HTMLDivElement>(null);
  const btmPanelRef = useRef<HTMLDivElement>(null);
  const gmRef       = useRef<HTMLDivElement>(null);
  const subRef      = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Organic counter
    let n = 0;
    const countInt = setInterval(() => {
      n = Math.min(n + Math.ceil(Math.random() * 5 + 1), 100);
      if (counterRef.current) counterRef.current.textContent = String(n).padStart(2, "0");
      if (n >= 100) clearInterval(countInt);
    }, 22);

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        document.body.style.overflow = "";
      },
    });

    // 1. GM slams in from top
    tl.fromTo(gmRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power4.out" },
      0.1
    )
    // 2. Sub fades in
    .fromTo(subRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      0.5
    )
    // 3. Counter fades in
    .fromTo(counterRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      0.4
    )
    // 4. Hold, then split panels apart — top slides up, bottom slides down
    .to(topPanelRef.current, {
      yPercent: -100,
      duration: 0.85,
      ease: "power4.inOut",
      delay: 0.6,
    })
    .to(btmPanelRef.current, {
      yPercent: 100,
      duration: 0.85,
      ease: "power4.inOut",
    }, "<"); // same time as top panel

    return () => {
      tl.kill();
      clearInterval(countInt);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    left: 0, right: 0,
    background: "#050505",
    zIndex: 400,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  return (
    <>
      {/* Top half */}
      <div ref={topPanelRef} style={{ ...panelStyle, top: 0, height: "50svh", alignItems: "flex-end", paddingBottom: "clamp(1rem, 3vw, 2rem)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* GM — massive */}
          <div ref={gmRef} style={{
            fontSize: "clamp(6rem, 22vw, 22rem)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "#fff",
            lineHeight: 1,
            fontFamily: "var(--font-display)",
          }}>
            GM
          </div>
        </div>
      </div>

      {/* Bottom half */}
      <div ref={btmPanelRef} style={{ ...panelStyle, bottom: 0, height: "50svh", alignItems: "flex-start", paddingTop: "clamp(1rem, 3vw, 2rem)", flexDirection: "column", gap: "2rem" }}>
        {/* Subtitle */}
        <div ref={subRef} style={{
          fontSize: "9px",
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
          fontFamily: "var(--font-display)",
        }}>
          Photography · Garv Malik
        </div>

        {/* Counter — bottom of screen */}
        <div style={{
          position: "absolute",
          bottom: "clamp(1.5rem, 4vw, 2.5rem)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "baseline",
          gap: "5px",
        }}>
          <span ref={counterRef} style={{
            fontSize: "clamp(1rem, 2vw, 1.4rem)",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "var(--font-display)",
            fontVariantNumeric: "tabular-nums",
          }}>
            00
          </span>
          <span style={{
            fontSize: "9px",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.2)",
            fontFamily: "var(--font-display)",
          }}>
            / 100
          </span>
        </div>
      </div>

      {/* Thin dividing line between panels */}
      <div style={{
        position: "fixed",
        top: "50%",
        left: 0, right: 0,
        height: "0.5px",
        background: "rgba(255,255,255,0.06)",
        zIndex: 401,
        transform: "translateY(-0.5px)",
        pointerEvents: "none",
      }} />
    </>
  );
}
