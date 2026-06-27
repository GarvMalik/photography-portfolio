"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "PHOTOGRAPHY IS",
  "NOT ABOUT",
  "CAPTURING —",
  "IT'S ABOUT SEEING.",
];

export function StatementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const photoRef   = useRef<HTMLDivElement>(null);
  const attrRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = { trigger: sectionRef.current, start: "top 70%" };

    lineRefs.current.forEach((line, i) => {
      gsap.fromTo(line,
        { y: "105%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.1, delay: i * 0.1,
          ease: "power4.out", scrollTrigger: trigger }
      );
    });

    gsap.fromTo(photoRef.current,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 1.2, delay: 0.3,
        ease: "power3.out", scrollTrigger: trigger }
    );

    gsap.fromTo(attrRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.6,
        ease: "power3.out", scrollTrigger: trigger }
    );
  }, []);

  return (
    <section ref={sectionRef} style={{
      padding: "clamp(4rem, 10vw, 9rem) var(--page-px)",
      borderTop: "0.5px solid var(--c-border)",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "4rem",
      alignItems: "start",
    }}>
      {/* Left: statement text */}
      <div>
        {LINES.map((line, i) => (
          <div key={i} style={{ overflow: "hidden", lineHeight: 1.02 }}>
            <div ref={el => { lineRefs.current[i] = el; }}
                 style={{
                   fontSize: "clamp(1.8rem, 5.5vw, 5.5rem)",
                   fontWeight: 500,
                   letterSpacing: "-0.01em",
                   color: i < 2 ? "var(--c-fg)" : "var(--c-fg-2)",
                   margin: 0,
                   textTransform: "uppercase",
                 }}>
              {line}
            </div>
          </div>
        ))}

        <div ref={attrRef} style={{
          marginTop: "2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "0.5px solid var(--c-border)",
          paddingTop: "1.25rem",
        }}>
          <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
            On photography
          </span>
          <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
            — GM, 2024
          </span>
        </div>
      </div>

      {/* Right: small accent photo */}
      <div ref={photoRef} style={{
        width: "clamp(120px, 18vw, 240px)",
        marginTop: "0.5rem",
        flexShrink: 0,
      }}>
        <PhotoPlaceholder ratio="3/4" />
      </div>
    </section>
  );
}
