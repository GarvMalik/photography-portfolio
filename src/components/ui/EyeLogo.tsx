"use client";

/**
 * Bold "eye" mark — the photographer's eye. An almond eye with a diamond
 * (harlequin/joker) pupil and a few bold lashes. Uses currentColor so it adapts
 * to any background. Strokes carry "eye-stroke" (pathLength=1) and the pupil
 * "eye-fill", so a parent can draw it in with GSAP.
 */
export function EyeLogo({
  size = "clamp(54px, 5vw, 74px)",
  className,
}: { size?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 78"
      width={size}
      height="auto"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Garv Malik"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* Lashes */}
      <path className="eye-stroke" pathLength={1} d="M30 16 L24 5" />
      <path className="eye-stroke" pathLength={1} d="M60 10 L60 -2" />
      <path className="eye-stroke" pathLength={1} d="M90 16 L96 5" />

      {/* Eye almond — top and bottom lids */}
      <path className="eye-stroke" pathLength={1} d="M6 40 Q60 6 114 40" />
      <path className="eye-stroke" pathLength={1} d="M6 40 Q60 74 114 40" />

      {/* Iris */}
      <circle className="eye-stroke" pathLength={1} cx="60" cy="40" r="17" strokeWidth="5" />

      {/* Diamond pupil (the joker) */}
      <path className="eye-fill" d="M60 31 L68 40 L60 49 L52 40 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
