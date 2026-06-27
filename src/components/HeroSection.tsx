"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { PhotoTilt } from "@/components/ui/PhotoTilt";
import { LogoMark } from "@/components/ui/LogoMark";

gsap.registerPlugin(ScrollTrigger);

// Scattered photos — (x%, y%) from top-left, rotation, size, parallax depth, image
const SCATTERED = [
  { x:  4, y:  9, rot: -5, w: "clamp(96px,10vw,158px)", ratio: "3/4"  as const, depth: 0.8, src: "/images/best-of-all/best-01.jpg" },
  { x: 19, y: 48, rot:  3, w: "clamp(120px,12vw,182px)", ratio: "4/3" as const, depth: 0.5, src: "/images/best-of-all/best-07.jpg" },
  { x: 31, y: 13, rot: -2, w: "clamp(78px,8vw,120px)",  ratio: "3/4"  as const, depth: 1.0, src: "/images/best-of-all/best-10.jpg" },
  { x: 69, y:  5, rot:  4, w: "clamp(110px,11vw,168px)", ratio: "4/3" as const, depth: 0.6, src: "/images/best-of-all/best-08.jpg" },
  { x: 80, y: 19, rot: -3, w: "clamp(86px,9vw,134px)",  ratio: "3/4"  as const, depth: 0.9, src: "/images/best-of-all/best-14.jpg" },
  { x: 84, y: 55, rot:  2, w: "clamp(128px,13vw,196px)", ratio: "2/3" as const, depth: 0.4, src: "/images/best-of-all/best-16.jpg" },
  { x: 52, y: 71, rot: -4, w: "clamp(86px,9vw,134px)",  ratio: "3/4"  as const, depth: 0.7, src: "/images/best-of-all/best-18.jpg" },
  { x:  9, y: 71, rot:  5, w: "clamp(98px,10vw,150px)", ratio: "4/3"  as const, depth: 0.6, src: "/images/best-of-all/best-21.jpg" },
  { x: 58, y: 33, rot: -1, w: "clamp(74px,8vw,114px)",  ratio: "2/3"  as const, depth: 1.1, src: "/images/best-of-all/best-09.jpg" },
  { x:  1, y: 33, rot:  3, w: "clamp(88px,9vw,138px)",  ratio: "3/4"  as const, depth: 0.7, src: "/images/best-of-all/best-12.jpg" },
  { x: 41, y:  2, rot: -3, w: "clamp(78px,8vw,120px)",  ratio: "3/4"  as const, depth: 0.9, src: "/images/best-of-all/best-13.jpg" },
  { x: 90, y: 36, rot:  4, w: "clamp(76px,8vw,118px)",  ratio: "3/4"  as const, depth: 1.0, src: "/images/best-of-all/best-19.jpg" },
  { x: 26, y: 83, rot: -2, w: "clamp(90px,9vw,140px)",  ratio: "3/4"  as const, depth: 0.8, src: "/images/best-of-all/best-15.jpg" },
];

const PRELOADER_DELAY = 2.4;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef   = useRef<HTMLDivElement>(null);
  const photoRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const logoRef    = useRef<HTMLDivElement>(null);
  const metaRef    = useRef<HTMLDivElement>(null);

  // ── Entrance ────────────────────────────────────────────────────
  useEffect(() => {
    SCATTERED.forEach((p, i) => {
      const el = photoRefs.current[i];
      if (!el) return;
      const fromX = (p.x < 50 ? -1 : 1) * (180 + Math.random() * 160);
      const fromY = (p.y < 50 ? -1 : 1) * (160 + Math.random() * 160);
      gsap.fromTo(el,
        { x: fromX, y: fromY, opacity: 0, rotation: p.rot * 2.5, scale: 0.7 },
        { x: 0, y: 0, opacity: 1, rotation: p.rot, scale: 1,
          duration: 1.4, delay: PRELOADER_DELAY + i * 0.05, ease: "power4.out" }
      );
    });

    // Logo emblem draws itself in, then the wordmark fades up (scoped to this logo)
    const strokes = logoRef.current?.querySelectorAll(".lm-stroke") ?? [];
    const words   = logoRef.current?.querySelectorAll(".lm-word") ?? [];
    gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.to(strokes, {
      strokeDashoffset: 0, duration: 1.5, stagger: 0.04,
      delay: PRELOADER_DELAY + 0.2, ease: "power2.inOut",
    });
    gsap.fromTo(words,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 1.0, stagger: 0.12, delay: PRELOADER_DELAY + 1.0, ease: "power3.out" }
    );
    gsap.fromTo(metaRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.9, delay: PRELOADER_DELAY + 1.3, ease: "power2.out" }
    );

    // Gentle continuous float per photo
    SCATTERED.forEach((_, i) => {
      const el = photoRefs.current[i];
      if (!el) return;
      gsap.to(el, {
        y: `+=${6 + Math.random() * 8}`,
        duration: 3.5 + Math.random() * 2.5,
        repeat: -1, yoyo: true, ease: "sine.inOut",
        delay: Math.random() * 3,
      });
    });

    // Mouse parallax
    const onMove = (e: MouseEvent) => {
      const cx = e.clientX / window.innerWidth  - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      SCATTERED.forEach((p, i) => {
        const el = photoRefs.current[i];
        if (!el) return;
        gsap.to(el, { x: cx * -28 * p.depth, y: cy * -18 * p.depth,
          duration: 2.0, ease: "power2.out", overwrite: false });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── Scroll choreography: pin, race the photos up, then release ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=130%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
      // Photos race upward fast and clear the viewport first…
      tl.to(layerRef.current,
        { yPercent: -135, ease: "power2.in" }, 0);
      // …then, only later, the logo + meta drift up and fade as the page leaves
      tl.to(logoRef.current,
        { yPercent: -30, opacity: 0, ease: "power2.in" }, 0.55);
      tl.to(metaRef.current,
        { y: -30, opacity: 0, ease: "power2.in" }, 0.55);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100svh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Floating photos layer (moves up on scroll, behind everything) */}
      <div ref={layerRef} style={{ position: "absolute", inset: 0, zIndex: 1, willChange: "transform" }}>
        {SCATTERED.map((p, i) => (
          <div
            key={i}
            ref={el => { photoRefs.current[i] = el; }}
            style={{
              position: "absolute",
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.w,
              transform: `rotate(${p.rot}deg)`,
              willChange: "transform",
              filter: "drop-shadow(0 6px 28px rgba(0,0,0,0.55))",
            }}
          >
            <PhotoTilt strength={8}>
              <PhotoPlaceholder ratio={p.ratio} src={p.src} alt="" />
            </PhotoTilt>
          </div>
        ))}
      </div>

      {/* Centered logo */}
      <div ref={logoRef} style={{
        position: "relative", zIndex: 3, flex: 1,
        display: "grid", placeItems: "center",
        pointerEvents: "none",
        padding: "8svh var(--page-px) 0",
      }}>
        <LogoMark />
      </div>

      {/* Meta bar */}
      <div ref={metaRef} style={{
        position: "relative", zIndex: 3,
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        padding: "1.5rem var(--page-px)",
        borderTop: "0.5px solid var(--c-border)",
      }}>
        <p style={{
          fontSize: "clamp(10px, 1.3vw, 13px)", color: "var(--c-fg-2)",
          margin: 0, lineHeight: 1.5, fontStyle: "italic",
        }}>
          Between light and shadow.
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "0.5px", height: "36px", background: "var(--c-fg-4)" }} />
          <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>Scroll</span>
        </div>

        <div style={{ textAlign: "right" }}>
          <span className="caps tracked text-dimmer" style={{ fontSize: "9px", display: "block" }}>
            Tampere · Finland
          </span>
          <span className="caps tracked text-dimmest" style={{ fontSize: "9px", display: "block", marginTop: "4px" }}>
            MMXXV
          </span>
        </div>
      </div>
    </section>
  );
}
