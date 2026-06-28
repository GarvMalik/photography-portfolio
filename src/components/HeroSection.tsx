"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { PhotoTilt } from "@/components/ui/PhotoTilt";

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

const PRELOADER_DELAY = 4.6; // the 3D intro runs first; hero enters as it bursts

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef   = useRef<HTMLDivElement>(null);
  const photoRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const textRef    = useRef<HTMLDivElement>(null);

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

    // Hero text resolves softly out of a blur (Phase 5)
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 24, scale: 1.06, filter: "blur(16px)" },
      { opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
        duration: 1.4, delay: PRELOADER_DELAY + 0.15, ease: "power3.out" }
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

  // ── Scroll: pin, drift the photos up slowly while the text holds ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=110%",        // moderate distance → gentle, and the photos
                                // are still partly on screen when the pin releases
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });
      // Only the photos move — up and slightly back — at a measured pace.
      // They DON'T fully clear: the next section scrolls over them while they're
      // still partly visible. The PHOTOGRAPHY text stays put (pin releases naturally).
      tl.to(layerRef.current,
        { yPercent: -58, scale: 0.97, ease: "none" }, 0);
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
        justifyContent: "flex-end",
        padding: "0 var(--page-px) 3rem",
      }}
    >
      {/* Floating photos layer (drifts up on scroll, behind everything) */}
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

      {/* Large PHOTOGRAPHY title — in front of the photos */}
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
    </section>
  );
}
