"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { PhotoTilt } from "@/components/ui/PhotoTilt";

// Scattered photo positions — (x%, y%) from top-left of section, rotation, size, parallax depth
const SCATTERED = [
  { x:  6,  y: 10, rot: -5,  w: "clamp(90px,10vw,150px)",  ratio: "2/3"  as const, depth: 0.8, delay: 0.0 },
  { x: 18,  y: 52, rot:  3,  w: "clamp(110px,12vw,170px)", ratio: "3/4"  as const, depth: 0.5, delay: 0.08 },
  { x: 30,  y: 18, rot: -2,  w: "clamp(70px,8vw,120px)",   ratio: "1/1"  as const, depth: 1.0, delay: 0.14 },
  { x: 62,  y:  8, rot:  4,  w: "clamp(100px,11vw,160px)", ratio: "16/9" as const, depth: 0.6, delay: 0.05 },
  { x: 76,  y: 22, rot: -3,  w: "clamp(80px,9vw,130px)",   ratio: "3/4"  as const, depth: 0.9, delay: 0.18 },
  { x: 82,  y: 58, rot:  2,  w: "clamp(120px,13vw,190px)", ratio: "2/3"  as const, depth: 0.4, delay: 0.1  },
  { x: 48,  y: 68, rot: -4,  w: "clamp(80px,9vw,130px)",   ratio: "1/1"  as const, depth: 0.7, delay: 0.22 },
  { x: 10,  y: 74, rot:  5,  w: "clamp(90px,10vw,150px)",  ratio: "4/3"  as const, depth: 0.6, delay: 0.16 },
  { x: 55,  y: 38, rot: -1,  w: "clamp(70px,8vw,110px)",   ratio: "2/3"  as const, depth: 1.1, delay: 0.25 },
];

// Fly-in origin for each photo (which edge it comes from)
const ORIGINS = [
  { fromX: -200, fromY: -200 },
  { fromX: -300, fromY:    0 },
  { fromX: -150, fromY: -250 },
  { fromX:    0, fromY: -200 },
  { fromX:  300, fromY: -150 },
  { fromX:  300, fromY:    0 },
  { fromX:    0, fromY:  300 },
  { fromX: -200, fromY:  200 },
  { fromX:  200, fromY:  200 },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const textRef    = useRef<HTMLDivElement>(null);
  const metaRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const PRELOADER_DELAY = 2.2;

    // Fly-in for each scattered photo
    SCATTERED.forEach((p, i) => {
      const el = photoRefs.current[i];
      if (!el) return;
      gsap.fromTo(el,
        {
          x: ORIGINS[i].fromX,
          y: ORIGINS[i].fromY,
          opacity: 0,
          rotation: p.rot * 2.5,
          scale: 0.7,
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          rotation: p.rot,
          scale: 1,
          duration: 1.4,
          delay: PRELOADER_DELAY + p.delay,
          ease: "power4.out",
        }
      );
    });

    // Text entrance
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, delay: PRELOADER_DELAY + 0.1, ease: "power3.out" }
    );
    gsap.fromTo(metaRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.9, delay: PRELOADER_DELAY + 0.5, ease: "power2.out" }
    );

    // Gentle continuous float per photo (different phase)
    SCATTERED.forEach((_, i) => {
      const el = photoRefs.current[i];
      if (!el) return;
      const amplitude = 6 + Math.random() * 8;
      const duration  = 3.5 + Math.random() * 2.5;
      gsap.to(el, {
        y: `+=${amplitude}`,
        duration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 3,
      });
    });

    // Mouse parallax — each photo has its own depth
    const onMove = (e: MouseEvent) => {
      const cx = e.clientX / window.innerWidth  - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      SCATTERED.forEach((p, i) => {
        const el = photoRefs.current[i];
        if (!el) return;
        gsap.to(el, {
          x: cx * -30 * p.depth,
          y: cy * -20 * p.depth,
          duration: 2.0,
          ease: "power2.out",
          overwrite: false,
        });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 var(--page-px) 3rem",
      }}
    >
      {/* Scattered photos — absolutely positioned */}
      {SCATTERED.map((p, i) => (
        <div
          key={i}
          ref={el => { photoRefs.current[i] = el; }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.w,
            transform: `rotate(${p.rot}deg)`,
            zIndex: 1,
            willChange: "transform",
            filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.5))",
          }}
        >
          <PhotoTilt strength={8}>
          <PhotoPlaceholder ratio={p.ratio} />
        </PhotoTilt>
        </div>
      ))}

      {/* Large text — sits IN FRONT of photos */}
      <div ref={textRef} style={{ position: "relative", zIndex: 3, pointerEvents: "none" }}>
        <h1 style={{
          fontSize: "clamp(3.5rem, 13vw, 13rem)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          color: "var(--c-fg)",
          margin: 0,
          lineHeight: 0.9,
          textTransform: "uppercase",
        }}>
          Photo&shy;graphy
        </h1>
      </div>

      {/* Meta bar */}
      <div ref={metaRef} style={{
        position: "relative",
        zIndex: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingTop: "1.5rem",
        borderTop: "0.5px solid var(--c-border)",
        marginTop: "1.5rem",
      }}>
        <p style={{
          fontSize: "clamp(10px, 1.3vw, 13px)",
          color: "var(--c-fg-2)",
          margin: 0,
          lineHeight: 1.5,
          fontStyle: "italic",
        }}>
          Between light and shadow.
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "0.5px", height: "36px", background: "var(--c-fg-4)" }} />
          <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>Scroll</span>
        </div>

        <div style={{ textAlign: "right" }}>
          <span className="caps tracked text-dimmest" style={{ fontSize: "9px", display: "block" }}>
            Garv Malik
          </span>
          <span className="caps tracked text-dimmest" style={{ fontSize: "9px", display: "block", marginTop: "4px" }}>
            Tampere · 2024
          </span>
        </div>
      </div>
    </section>
  );
}
