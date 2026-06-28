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
const FIELD = [
  // hidden upper field
  { x:  8, y: -22, rot: -4, w: "clamp(96px,9vw,150px)",  ratio: "3/4"  as const, depth: 0.5, src: "/images/best-of-all/best-01.jpg" },
  { x: 34, y: -15, rot:  3, w: "clamp(80px,8vw,124px)",  ratio: "1/1"  as const, depth: 0.8, src: "/images/best-of-all/best-10.jpg" },
  { x: 66, y: -17, rot: -2, w: "clamp(86px,9vw,134px)",  ratio: "3/4"  as const, depth: 0.7, src: "/images/best-of-all/best-13.jpg" },
  { x: 90, y: -20, rot:  4, w: "clamp(100px,10vw,156px)", ratio: "4/3" as const, depth: 0.5, src: "/images/best-of-all/best-08.jpg" },
  // top edges / corners (visible)
  { x:  2, y:  9,  rot:  3, w: "clamp(108px,11vw,168px)", ratio: "4/3" as const, depth: 0.6, src: "/images/best-of-all/best-07.jpg" },
  { x: 91, y:  6,  rot: -3, w: "clamp(88px,9vw,138px)",  ratio: "3/4"  as const, depth: 0.9, src: "/images/best-of-all/best-14.jpg" },
  { x: 19, y: 19,  rot: -2, w: "clamp(78px,8vw,118px)",  ratio: "2/3"  as const, depth: 1.1, src: "/images/best-of-all/best-09.jpg" },
  { x: 79, y: 16,  rot:  2, w: "clamp(74px,8vw,112px)",  ratio: "3/4"  as const, depth: 1.0, src: "/images/best-of-all/best-19.jpg" },
  // left / right framing edges (mid)
  { x:  0, y: 40,  rot:  4, w: "clamp(90px,9vw,140px)",  ratio: "3/4"  as const, depth: 0.7, src: "/images/best-of-all/best-12.jpg" },
  { x: 93, y: 36,  rot: -4, w: "clamp(120px,12vw,182px)", ratio: "2/3" as const, depth: 0.4, src: "/images/best-of-all/best-16.jpg" },
  { x:  5, y: 60,  rot: -3, w: "clamp(84px,9vw,128px)",  ratio: "4/3"  as const, depth: 0.9, src: "/images/best-of-all/best-21.jpg" },
  { x: 90, y: 62,  rot:  3, w: "clamp(80px,8vw,122px)",  ratio: "3/4"  as const, depth: 0.8, src: "/images/best-of-all/best-15.jpg" },
  // lower far corners (visible, clear of the centre text)
  { x:  3, y: 82,  rot:  4, w: "clamp(92px,9vw,140px)",  ratio: "3/4"  as const, depth: 0.6, src: "/images/best-of-all/best-18.jpg" },
  { x: 92, y: 84,  rot: -3, w: "clamp(98px,10vw,150px)", ratio: "4/3"  as const, depth: 0.6, src: "/images/best-of-all/best-22.jpg" },
  // hidden lower field — rises into view as you scroll
  { x: 15, y: 112, rot: -3, w: "clamp(96px,10vw,150px)", ratio: "4/3"  as const, depth: 0.5, src: "/images/best-of-all/best-05.jpg" },
  { x: 83, y: 116, rot:  3, w: "clamp(86px,9vw,132px)",  ratio: "3/4"  as const, depth: 0.7, src: "/images/best-of-all/best-03.jpg" },
  { x: 38, y: 126, rot:  2, w: "clamp(82px,8vw,126px)",  ratio: "1/1"  as const, depth: 0.9, src: "/images/best-of-all/best-20.jpg" },
  { x: 64, y: 130, rot: -2, w: "clamp(100px,10vw,156px)", ratio: "4/3" as const, depth: 0.5, src: "/images/spain/spain-40.jpg" },
];

const PRELOADER_DELAY = 4.6; // the 3D intro runs first

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const photoRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const textRef    = useRef<HTMLDivElement>(null);

  // ── Entrance + damped cursor parallax ──────────────────────────
  useEffect(() => {
    // gsap owns each photo's transform (so cursor offsets keep the rotation)
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
        {FIELD.map((p, i) => (
          <div
            key={i}
            ref={el => { photoRefs.current[i] = el; }}
            style={{
              position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
              width: p.w, willChange: "transform",
              filter: "drop-shadow(0 6px 28px rgba(0,0,0,0.5))",
            }}
          >
            <PhotoPlaceholder ratio={p.ratio} src={p.src} alt="" />
          </div>
        ))}
      </div>

      {/* PHOTOGRAPHY */}
      <div ref={textRef} style={{ position: "relative", zIndex: 3, pointerEvents: "none" }}>
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
