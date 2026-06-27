"use client";
import { useId } from "react";

/**
 * Centered brand emblem — a sunrise over mountains by a lake, framed inside a
 * lens/sun ring. Travel + nature + photography in one mark.
 *
 * Every stroke carries className "lm-stroke" and pathLength="1", so a parent
 * can draw it in with GSAP: fromTo(".lm-stroke", {strokeDashoffset:1}, {strokeDashoffset:0}).
 */
export function LogoMark({
  size = "clamp(180px, 22vw, 300px)",
  wordmark = true,
}: { size?: string; wordmark?: boolean }) {
  const clipId = useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.4rem" }}>
      <svg
        viewBox="0 0 220 220"
        width={size}
        height={size}
        fill="none"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        style={{ overflow: "visible" }}
      >
        {/* Outer lens ring */}
        <circle className="lm-stroke" pathLength={1} cx="110" cy="110" r="98" strokeWidth="1" opacity="0.9" />
        {/* Inner ring (clips the scene) */}
        <circle className="lm-stroke" pathLength={1} cx="110" cy="110" r="86" strokeWidth="0.6" opacity="0.4" />

        <clipPath id={clipId}><circle cx="110" cy="110" r="86" /></clipPath>
        <g clipPath={`url(#${clipId})`}>
          {/* Rising sun */}
          <circle className="lm-stroke" pathLength={1} cx="110" cy="98" r="22" />
          {/* Sun rays */}
          {[-60, -30, 0, 30, 60].map((a, i) => {
            const rad = (a - 90) * Math.PI / 180;
            const x1 = 110 + Math.cos(rad) * 28, y1 = 98 + Math.sin(rad) * 28;
            const x2 = 110 + Math.cos(rad) * 35, y2 = 98 + Math.sin(rad) * 35;
            return <line key={i} className="lm-stroke" pathLength={1} x1={x1} y1={y1} x2={x2} y2={y2} opacity="0.7" />;
          })}

          {/* Mountains on the horizon */}
          <path className="lm-stroke" pathLength={1} d="M30 132 L70 86 L98 132 Z" />
          <path className="lm-stroke" pathLength={1} d="M82 132 L128 72 L182 132 Z" />

          {/* Horizon / lake edge */}
          <line className="lm-stroke" pathLength={1} x1="20" y1="132" x2="200" y2="132" opacity="0.85" />

          {/* Lake reflection ripples */}
          <line className="lm-stroke" pathLength={1} x1="74" y1="146" x2="146" y2="146" opacity="0.45" />
          <line className="lm-stroke" pathLength={1} x1="60" y1="158" x2="120" y2="158" opacity="0.3" />
          <line className="lm-stroke" pathLength={1} x1="92" y1="170" x2="160" y2="170" opacity="0.22" />

          {/* A bird, far off */}
          <path className="lm-stroke" pathLength={1} d="M150 62 q5 -5 10 0 q5 -5 10 0" opacity="0.6" strokeWidth="1" />
        </g>
      </svg>

      {wordmark && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div className="lm-word" style={{
            fontSize: "clamp(1.6rem, 4.5vw, 3.4rem)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--c-fg)",
            lineHeight: 1,
          }}>
            Garv Malik
          </div>
          <div className="lm-word" style={{
            fontSize: "clamp(7px, 1vw, 9px)",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "var(--c-fg-3)",
            paddingLeft: "0.42em",
          }}>
            Photography · Travel · Nature
          </div>
        </div>
      )}
    </div>
  );
}
