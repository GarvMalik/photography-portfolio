"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const HINTS = [
  { icon: "↑↓", label: "scroll to explore" },
  { icon: "⊞",  label: "tap photos to open" },
  { icon: "⟵⟶", label: "drag reel to browse" },
];

export function ControlsGuide() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Appear after the intro animation settles
    gsap.fromTo(ref.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 1.0, delay: 5.6, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        bottom: "30px",
        left: "var(--page-px)",
        zIndex: 50,
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      {/* Looks like a torn-off camera manual cheat card */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        borderLeft: "0.5px solid rgba(255,255,255,0.12)",
        paddingLeft: "10px",
      }}>
        <span style={{
          fontSize: "6.5px", letterSpacing: "0.3em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.22)", fontFamily: "var(--font-display)",
        }}>
          Guide
        </span>
        {HINTS.map(h => (
          <div key={h.label} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{
              fontSize: "7.5px", letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.18)", fontFamily: "var(--font-mono)",
              minWidth: "22px",
            }}>
              {h.icon}
            </span>
            <span style={{
              fontSize: "7px", letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.16)", fontFamily: "var(--font-display)",
            }}>
              {h.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
