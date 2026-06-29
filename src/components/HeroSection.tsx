"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

gsap.registerPlugin(ScrollTrigger);

/**
 * One large virtual photo field — it extends above and below the viewport, so
 * scrolling reveals a continuous canvas rather than spawning new photos. The
 * central band is kept clear for the typography; density sits at the edges,
 * corners and the hidden upper/lower regions.
 *
 *   x, y are % of the viewport (y may be negative = above, or > 100 = below).
 *   depth drives the subtle cursor parallax (no direct following).
 */
// The scroll moves the field up by 112vh, so photos must span y: -20% → ~210%
// to fill the canvas at every scroll position. Brightness computed from y in JSX.
const FIELD = [
  // above viewport
  { x: 14, y: -18, rot:  2, w: "clamp(82px,8vw,124px)",  depth: 0.6, src: "/images/best-of-all/best-01.jpg" },
  { x: 55, y: -12, rot: -1, w: "clamp(94px,9vw,140px)",  depth: 0.8, src: "/images/best-of-all/best-10.webp" },
  { x: 80, y: -16, rot:  3, w: "clamp(74px,7vw,110px)",  depth: 0.5, src: "/images/best-of-all/best-13.jpg" },
  // y 0–30
  { x:  3, y:  3,  rot: -2, w: "clamp(98px,9vw,146px)",  depth: 0.5, src: "/images/best-of-all/best-07.webp" },
  { x: 32, y:  1,  rot:  1, w: "clamp(78px,7vw,116px)",  depth: 0.9, src: "/images/best-of-all/best-24.webp" },
  { x: 60, y:  5,  rot: -3, w: "clamp(90px,8vw,134px)",  depth: 0.7, src: "/images/best-of-all/best-14.jpg" },
  { x: 84, y:  2,  rot:  2, w: "clamp(70px,6vw,102px)",  depth: 1.0, src: "/images/best-of-all/best-19.jpg" },
  { x:  9, y: 18,  rot:  3, w: "clamp(86px,8vw,128px)",  depth: 0.7, src: "/images/best-of-all/best-09.jpg" },
  { x: 42, y: 14,  rot: -2, w: "clamp(108px,10vw,160px)",depth: 0.6, src: "/images/best-of-all/best-02.jpg" },
  { x: 70, y: 19,  rot:  1, w: "clamp(80px,7vw,118px)",  depth: 0.8, src: "/images/best-of-all/best-16.jpg" },
  // y 30–60
  { x:  1, y: 32,  rot: -1, w: "clamp(92px,9vw,138px)",  depth: 0.9, src: "/images/finland/finland-04.jpg" },
  { x: 24, y: 36,  rot:  4, w: "clamp(74px,7vw,110px)",  depth: 1.1, src: "/images/best-of-all/best-15.jpg" },
  { x: 52, y: 30,  rot: -2, w: "clamp(88px,8vw,132px)",  depth: 0.7, src: "/images/spain/spain-06.webp" },
  { x: 76, y: 34,  rot:  3, w: "clamp(102px,10vw,154px)",depth: 0.6, src: "/images/best-of-all/best-21.jpg" },
  { x:  7, y: 50,  rot:  2, w: "clamp(90px,8vw,136px)",  depth: 0.8, src: "/images/india/india-08.webp" },
  { x: 30, y: 54,  rot: -3, w: "clamp(104px,10vw,156px)",depth: 0.6, src: "/images/best-of-all/best-17.jpg" },
  { x: 58, y: 48,  rot:  1, w: "clamp(78px,7vw,116px)",  depth: 0.9, src: "/images/best-of-all/best-22.jpg" },
  { x: 82, y: 52,  rot: -2, w: "clamp(92px,9vw,138px)",  depth: 0.7, src: "/images/best-of-all/best-05.jpg" },
  // y 60–90
  { x:  2, y: 64,  rot: -1, w: "clamp(96px,9vw,144px)",  depth: 0.6, src: "/images/best-of-all/best-18.jpg" },
  { x: 22, y: 70,  rot:  3, w: "clamp(82px,8vw,122px)",  depth: 1.0, src: "/images/best-of-all/best-20.jpg" },
  { x: 46, y: 66,  rot: -2, w: "clamp(110px,10vw,164px)",depth: 0.5, src: "/images/spain/spain-40.jpg" },
  { x: 72, y: 68,  rot:  2, w: "clamp(84px,8vw,126px)",  depth: 0.8, src: "/images/best-of-all/best-03.jpg" },
  { x: 88, y: 64,  rot: -3, w: "clamp(96px,9vw,146px)",  depth: 0.7, src: "/images/best-of-all/best-08.webp" },
  { x: 12, y: 84,  rot:  1, w: "clamp(88px,8vw,132px)",  depth: 0.9, src: "/images/finland/finland-02.webp" },
  { x: 38, y: 88,  rot: -2, w: "clamp(78px,7vw,116px)",  depth: 0.6, src: "/images/india/india-04.jpg" },
  { x: 64, y: 82,  rot:  3, w: "clamp(98px,9vw,148px)",  depth: 0.8, src: "/images/best-of-all/best-12.jpg" },
  { x: 86, y: 86,  rot: -1, w: "clamp(84px,8vw,126px)",  depth: 0.5, src: "/images/best-of-all/best-11.jpg" },
  // y 100–145 (scroll reveals these)
  { x:  4, y: 100, rot:  2, w: "clamp(90px,9vw,136px)",  depth: 0.7, src: "/images/best-of-all/best-23.jpg" },
  { x: 27, y: 106, rot: -3, w: "clamp(100px,9vw,150px)", depth: 0.6, src: "/images/spain/spain-06.webp" },
  { x: 54, y: 102, rot:  1, w: "clamp(82px,8vw,124px)",  depth: 0.9, src: "/images/best-of-all/best-09.jpg" },
  { x: 78, y: 108, rot: -2, w: "clamp(96px,9vw,144px)",  depth: 0.5, src: "/images/best-of-all/best-24.webp" },
  { x: 14, y: 120, rot:  3, w: "clamp(86px,8vw,130px)",  depth: 0.8, src: "/images/finland/finland-04.jpg" },
  { x: 42, y: 118, rot: -1, w: "clamp(104px,10vw,156px)",depth: 0.6, src: "/images/india/india-08.webp" },
  { x: 68, y: 122, rot:  2, w: "clamp(80px,8vw,120px)",  depth: 0.9, src: "/images/best-of-all/best-17.jpg" },
  { x:  6, y: 138, rot: -2, w: "clamp(94px,9vw,142px)",  depth: 0.7, src: "/images/best-of-all/best-15.jpg" },
  { x: 32, y: 134, rot:  1, w: "clamp(88px,8vw,132px)",  depth: 0.5, src: "/images/best-of-all/best-22.jpg" },
  { x: 60, y: 140, rot: -3, w: "clamp(96px,9vw,146px)",  depth: 0.8, src: "/images/best-of-all/best-02.jpg" },
  { x: 84, y: 136, rot:  2, w: "clamp(82px,8vw,124px)",  depth: 0.6, src: "/images/best-of-all/best-21.jpg" },
  // y 150–210 (deep scroll)
  { x: 18, y: 154, rot:  3, w: "clamp(90px,9vw,138px)",  depth: 0.7, src: "/images/spain/spain-40.jpg" },
  { x: 46, y: 158, rot: -2, w: "clamp(100px,9vw,150px)", depth: 0.9, src: "/images/best-of-all/best-07.webp" },
  { x: 74, y: 152, rot:  1, w: "clamp(86px,8vw,130px)",  depth: 0.6, src: "/images/best-of-all/best-14.jpg" },
  { x:  8, y: 172, rot: -1, w: "clamp(94px,9vw,142px)",  depth: 0.8, src: "/images/best-of-all/best-20.jpg" },
  { x: 36, y: 176, rot:  4, w: "clamp(80px,8vw,122px)",  depth: 0.5, src: "/images/best-of-all/best-18.jpg" },
  { x: 62, y: 170, rot: -3, w: "clamp(98px,9vw,148px)",  depth: 0.7, src: "/images/best-of-all/best-05.jpg" },
  { x: 86, y: 174, rot:  2, w: "clamp(84px,8vw,126px)",  depth: 0.9, src: "/images/best-of-all/best-03.jpg" },
  { x: 22, y: 192, rot: -2, w: "clamp(92px,9vw,140px)",  depth: 0.6, src: "/images/finland/finland-02.webp" },
  { x: 50, y: 196, rot:  1, w: "clamp(86px,8vw,130px)",  depth: 0.8, src: "/images/best-of-all/best-08.webp" },
  { x: 76, y: 190, rot: -2, w: "clamp(90px,9vw,136px)",  depth: 0.7, src: "/images/india/india-04.jpg" },
];

const PRELOADER_DELAY = 4.6; // the 3D intro runs first

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const photoRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const textRef    = useRef<HTMLDivElement>(null);

  // ── Entrance + damped cursor parallax ──────────────────────────
  useEffect(() => {
    FIELD.forEach((p, i) => {
      const el = photoRefs.current[i];
      if (el) gsap.set(el, { rotation: p.rot });
    });

    // calm fade-in (no fly-from-edges chaos)
    photoRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 1.3, delay: PRELOADER_DELAY + i * 0.04, ease: "power2.out" }
      );
    });

    // hero text resolves out of a blur
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 24, scale: 1.06, filter: "blur(16px)" },
      { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.4, delay: PRELOADER_DELAY + 0.15, ease: "power3.out" }
    );

    // Damped parallax — photos drift gently toward the pointer, never follow it.
    const target = { x: 0, y: 0 }, curOff = { x: 0, y: 0 };
    const AMP = 22;            // max drift in px
    const onMove = (e: MouseEvent) => {
      target.x = e.clientX / window.innerWidth  - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
    };
    let raf = 0;
    const tick = () => {
      curOff.x += (target.x - curOff.x) * 0.045;   // inertial damping
      curOff.y += (target.y - curOff.y) * 0.045;
      FIELD.forEach((p, i) => {
        const el = photoRefs.current[i];
        if (el) gsap.set(el, { x: curOff.x * AMP * p.depth, y: curOff.y * AMP * p.depth });
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);

    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, []);

  // ── Scroll: the field lifts upward (faster than the text), reversible ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
      // photos rise faster (parallax depth) and accelerate gradually; the field
      // extends below the fold, so some photos rise into view as others leave.
      tl.to(scrollRef.current, { yPercent: -112, ease: "power1.in" }, 0);
      // the typography rises slower — it passes in front of the photos
      tl.to(textRef.current,   { yPercent: -46, ease: "power1.in" }, 0);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative", height: "100svh", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "0 var(--page-px) 3rem",
      }}
    >
      {/* Virtual photo field */}
      <div ref={scrollRef} style={{ position: "absolute", inset: 0, zIndex: 1, willChange: "transform" }}>
        {FIELD.map((p, i) => {
          // y=0 (top) → brightness 0.15 (nearly black); y=80+ → brightness 1.0 (full)
          const brightness = Math.min(1, Math.max(0.12, (p.y + 20) / 90));
          return (
            <div
              key={i}
              ref={el => { photoRefs.current[i] = el; }}
              style={{
                position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
                width: p.w, willChange: "transform",
                filter: `brightness(${brightness}) drop-shadow(0 4px 20px rgba(0,0,0,0.4))`,
              }}
            >
              <PhotoPlaceholder ratio="1/1" src={p.src} alt="" />
            </div>
          );
        })}
      </div>

      {/* PHOTOGRAPHY */}
      <div ref={textRef} style={{ position: "relative", zIndex: 3, pointerEvents: "none", mixBlendMode: "difference" }}>
        <h1 style={{
          fontSize: "clamp(3.5rem, 13vw, 13rem)", fontWeight: 500,
          letterSpacing: "-0.03em", color: "var(--c-fg)", margin: 0,
          lineHeight: 0.9, textTransform: "uppercase",
        }}>
          Photo&shy;graphy
        </h1>
      </div>
    </section>
  );
}
