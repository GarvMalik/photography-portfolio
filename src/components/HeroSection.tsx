"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

export function HeroSection() {
  const headRef  = useRef<HTMLHeadingElement>(null);
  const eyeRef   = useRef<HTMLParagraphElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.fromTo(eyeRef.current,  { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.5 })
      .fromTo(headRef.current,  { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2 }, "-=0.5")
      .fromTo(photoRef.current, { opacity: 0, scale: 0.93, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 1.3 }, "-=0.8")
      .fromTo(countRef.current, { opacity: 0 }, { opacity: 1, duration: 0.7 }, "-=0.4");

    const onMove = (e: MouseEvent) => {
      gsap.to(photoRef.current, {
        x: (e.clientX / window.innerWidth  - 0.5) * -22,
        y: (e.clientY / window.innerHeight - 0.5) * -14,
        duration: 2.0, ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden"
             style={{ minHeight: "100svh", paddingTop: "80px" }}>
      <p ref={eyeRef} className="caps tracked-caps text-dimmest mb-3" style={{ fontSize: "9px" }}>
        Selected works — 2024
      </p>
      <h1 ref={headRef} className="caps text-center"
          style={{ fontSize: "clamp(3rem, 10vw, 9rem)", fontWeight: 500,
                   letterSpacing: "0.1em", color: "var(--c-fg)", lineHeight: 1,
                   mixBlendMode: "difference", zIndex: 2, position: "relative" }}>
        Photography
      </h1>

      {/* Single drifting hero photo */}
      <div ref={photoRef} className="absolute" style={{ width: "min(280px, 38vw)", zIndex: 1, willChange: "transform" }}>
        <PhotoPlaceholder ratio="2/3" />
      </div>

      <span ref={countRef} className="absolute caps tracked text-dimmest"
            style={{ bottom: "2rem", right: "var(--page-px)", fontSize: "9px" }}>
        07 / frames
      </span>

      <div className="absolute flex flex-col items-center gap-2"
           style={{ bottom: "2rem", left: "50%", transform: "translateX(-50%)" }} aria-hidden>
        <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>Scroll</span>
        <div style={{ width: 1, height: 32, background: "var(--c-fg-4)" }} />
      </div>
    </section>
  );
}
