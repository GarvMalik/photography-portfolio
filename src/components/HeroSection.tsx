"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

export function HeroSection() {
  const photoRef  = useRef<HTMLDivElement>(null);
  const topRef    = useRef<HTMLDivElement>(null);
  const btmRef    = useRef<HTMLDivElement>(null);
  const metaRef   = useRef<HTMLDivElement>(null);
  const tagRef    = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.0, defaults: { ease: "power4.out" } });

    tl.fromTo(topRef.current,
        { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 })
      .fromTo(btmRef.current,
        { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, "-=1.0")
      .fromTo(photoRef.current,
        { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.3 }, "-=0.9")
      .fromTo(tagRef.current,
        { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.6")
      .fromTo(metaRef.current,
        { opacity: 0 }, { opacity: 1, duration: 0.7 }, "-=0.5");

    // Ambient parallax — photo drifts opposite to cursor
    const onMove = (e: MouseEvent) => {
      gsap.to(photoRef.current, {
        x: (e.clientX / window.innerWidth  - 0.5) * -28,
        y: (e.clientY / window.innerHeight - 0.5) * -18,
        duration: 2.2, ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section style={{
      position: "relative",
      height: "100svh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      overflow: "hidden",
      padding: "0 var(--page-px)",
      paddingTop: "clamp(5rem, 12vh, 9rem)",
      paddingBottom: "3rem",
    }}>

      {/* TOP: "PHOTO" — oversized, left-aligned */}
      <div ref={topRef} style={{ lineHeight: 0.88 }}>
        <h1 style={{
          fontSize: "clamp(5rem, 18vw, 18rem)",
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "var(--c-fg)",
          margin: 0,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}>
          PHOTO
        </h1>
      </div>

      {/* CENTER: floating photo — absolute, behind type via z-index */}
      <div ref={photoRef} style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "clamp(180px, 24vw, 340px)",
        zIndex: 2,
        willChange: "transform",
        pointerEvents: "none",
      }}>
        <PhotoPlaceholder ratio="2/3" />
      </div>

      {/* BOTTOM: "GRAPHY" — oversized, right-aligned */}
      <div ref={btmRef} style={{ lineHeight: 0.88, textAlign: "right" }}>
        <h1 style={{
          fontSize: "clamp(5rem, 18vw, 18rem)",
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "var(--c-fg)",
          margin: 0,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}>
          GRAPHY
        </h1>
      </div>

      {/* META BAR: bottom, three columns */}
      <div ref={metaRef} style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingTop: "1.5rem",
      }}>
        <p ref={tagRef} style={{
          fontSize: "clamp(10px, 1.5vw, 14px)",
          letterSpacing: "0.04em",
          color: "var(--c-fg-2)",
          margin: 0,
          maxWidth: "260px",
          lineHeight: 1.4,
        }}>
          Between light<br />and shadow.
        </p>

        {/* Scroll cue */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "0.5px", height: "40px", background: "var(--c-fg-4)" }} />
          <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>Scroll</span>
        </div>

        <div style={{ textAlign: "right" }}>
          <span className="caps tracked text-dimmest" style={{ fontSize: "9px", display: "block" }}>
            Garv Malik
          </span>
          <span className="caps tracked text-dimmest" style={{ fontSize: "9px", display: "block", marginTop: "4px" }}>
            07 Frames · 2024
          </span>
        </div>
      </div>

      {/* Horizontal rule across center — behind the photo */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: 0, right: 0,
        height: "0.5px",
        background: "var(--c-border)",
        zIndex: 1,
        pointerEvents: "none",
      }} />
    </section>
  );
}
