"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const nameRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stmtRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const trigger = { trigger: nameRef.current, start: "top 85%" };

    gsap.fromTo(lineRef.current,
      { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: "power3.out",
        transformOrigin: "left center", scrollTrigger: trigger }
    );
    gsap.fromTo(stmtRef.current,
      { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.0, delay: 0.15,
        ease: "power3.out", scrollTrigger: trigger }
    );
    gsap.fromTo(nameRef.current,
      { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, delay: 0.2,
        ease: "power4.out", scrollTrigger: trigger }
    );
    gsap.fromTo(metaRef.current,
      { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 0.6, scrollTrigger: trigger }
    );
  }, []);

  return (
    <footer style={{
      borderTop: "0.5px solid var(--c-border)",
      padding: "4rem var(--page-px) 2.5rem",
    }}>
      {/* Top rule — animated scale */}
      <div ref={lineRef} style={{
        height: "0.5px",
        background: "var(--c-fg-4)",
        marginBottom: "2.5rem",
        transformOrigin: "left center",
      }} />

      {/* Closing statement — the last wall text before the exit */}
      <p ref={stmtRef} style={{
        margin: "0 0 3rem",
        maxWidth: "26ch",
        fontSize: "clamp(1.1rem, 2.4vw, 1.9rem)",
        lineHeight: 1.4,
        letterSpacing: "-0.01em",
        fontStyle: "italic",
        color: "var(--c-fg-2)",
      }}>
        Everything here happened once — in a light that&rsquo;s already gone.
      </p>

      {/* Massive name */}
      <div ref={nameRef} style={{ overflow: "hidden", marginBottom: "3rem" }}>
        <h2 style={{
          fontSize: "clamp(4rem, 18vw, 18rem)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          color: "var(--c-fg)",
          margin: 0,
          lineHeight: 0.85,
          textTransform: "uppercase",
        }}>
          Garv<br />Malik
        </h2>
      </div>

      {/* Bottom meta row */}
      <div ref={metaRef} style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: "1rem",
        borderTop: "0.5px solid var(--c-border)",
        paddingTop: "1.5rem",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
            Hobby · Tampere, Finland
          </span>
          <a href="mailto:thegarvmalik@gmail.com" data-cursor
             style={{ fontSize: "9px", letterSpacing: "0.12em", color: "var(--c-fg-2)",
                      textDecoration: "none" }}>
            thegarvmalik@gmail.com
          </a>
        </div>

        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <a href="https://instagram.com/thegarvmalik" target="_blank" rel="noopener noreferrer"
             data-cursor
             className="caps tracked text-dimmer"
             style={{ fontSize: "9px", textDecoration: "none", color: "var(--c-fg-2)" }}>
            Instagram ↗
          </a>
        </div>

        <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
          © 2024 GM
        </span>
      </div>
    </footer>
  );
}
