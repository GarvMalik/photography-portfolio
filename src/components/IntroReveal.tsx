"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Photo panels that make up the ring (mix of the library)
const PANELS = [
  "/images/best-of-all/best-01.jpg", "/images/best-of-all/best-09.jpg",
  "/images/best-of-all/best-14.jpg", "/images/best-of-all/best-07.jpg",
  "/images/best-of-all/best-16.jpg", "/images/best-of-all/best-21.jpg",
  "/images/best-of-all/best-10.jpg", "/images/spain/spain-29.jpg",
  "/images/best-of-all/best-12.jpg", "/images/best-of-all/best-22.jpg",
  "/images/finland/finland-07.jpg", "/images/best-of-all/best-18.jpg",
  "/images/india/india-04.jpg",      "/images/best-of-all/best-05.jpg",
  "/images/best-of-all/best-20.jpg", "/images/spain/spain-40.jpg",
];

const N = PANELS.length;
const STEP = 360 / N;
const RADIUS = 250;

export function IntroReveal() {
  const rootRef  = useRef<HTMLDivElement>(null);
  const tiltRef  = useRef<HTMLDivElement>(null);
  const spinRef  = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    // Pre-computed burst targets (stable per card)
    const targets = cards.map(() => ({
      x: gsap.utils.random(-820, 820),
      y: gsap.utils.random(-520, 520),
      z: gsap.utils.random(-150, 460),
      r: gsap.utils.random(-90, 90),
    }));

    // Slow continuous spin (runs the whole time, speeds up subtly)
    const spinTween = gsap.to(spinRef.current, {
      rotateY: "+=360", duration: 16, repeat: -1, ease: "none",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        document.body.style.overflow = "";
      },
    });

    // Initial — a steep near-top view (reads as a circle), cards hidden
    gsap.set(tiltRef.current, { rotateX: 84 });
    gsap.set(cards, { opacity: 0, z: -30 });

    // Phase 1 — the circle assembles & glows (cards fade in)
    tl.to(cards, {
      opacity: 1, z: 0, duration: 1.0,
      stagger: { each: 0.035, from: "random" }, ease: "power2.out",
    }, 0.2);

    // Phase 2 — it starts cracking open (panels drift outward → gaps)
    tl.to(cards, {
      z: 70, duration: 1.0,
      stagger: { each: 0.015, from: "random" }, ease: "power2.inOut",
    }, 1.7);

    // Phase 3 — the whole ring tilts up, revealing it's made of photos
    tl.to(tiltRef.current, {
      rotateX: 11, duration: 1.6, ease: "power3.inOut",
    }, 2.5);
    // spin speeds up a touch as it tilts
    tl.to(spinTween, { timeScale: 2.2, duration: 1.2, ease: "power2.in" }, 2.6);

    // Phase 4 — panels detach and float out across the screen
    tl.to(cards, {
      x: (i) => targets[i].x,
      y: (i) => targets[i].y,
      z: (i) => targets[i].z,
      rotation: (i) => targets[i].r,
      opacity: 0,
      duration: 1.3,
      stagger: { each: 0.03, from: "center" },
      ease: "power4.out",
    }, 4.2);

    // Fade the black stage away as the page underneath takes over
    tl.to(rootRef.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 4.9);

    // Debug handle (lets us pause on a frame during review)
    if (typeof window !== "undefined") {
      (window as Window & { __introTL?: gsap.core.Timeline }).__introTL = tl;
      if (window.location.search.includes("introseek")) tl.pause(0);
    }

    // Safety — never trap the user behind the intro
    const frozen = typeof window !== "undefined" && window.location.search.includes("introseek");
    const safety = gsap.delayedCall(frozen ? 100000 : 7, () => {
      setDone(true); document.body.style.overflow = "";
    });

    return () => {
      tl.kill(); spinTween.kill(); safety.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: "fixed", inset: 0,
        background: "radial-gradient(120% 90% at 50% 45%, #0c0c0e 0%, #050505 60%, #020202 100%)",
        zIndex: 500,
        overflow: "hidden",
        display: "grid", placeItems: "center",
      }}
    >
      <div style={{ perspective: "1500px", perspectiveOrigin: "50% 46%" }}>
        <div ref={tiltRef} style={{ transformStyle: "preserve-3d" }}>
          <div ref={spinRef} style={{ position: "relative", transformStyle: "preserve-3d" }}>
            {PANELS.map((src, i) => {
              // Slight organic asymmetry so it isn't a sterile perfect circle
              const wobble = Math.sin(i * 1.7) * 10;
              const tiltZ  = Math.cos(i * 2.3) * 3;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    width: 116, height: 166,
                    marginLeft: -58, marginTop: -83,
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${i * STEP}deg) translateZ(${RADIUS + wobble}px) rotateZ(${tiltZ}deg)`,
                  }}
                >
                  <div
                    ref={el => { cardRefs.current[i] = el; }}
                    style={{
                      width: "100%", height: "100%",
                      backgroundImage: `url("${src}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "2px",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
                      willChange: "transform, opacity",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
