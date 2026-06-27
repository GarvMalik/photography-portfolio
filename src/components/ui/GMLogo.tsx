"use client";

/**
 * Clean "GM" monogram — a thin roundel with the initials. Company-logo feel,
 * small-to-medium. The ring carries className "gm-stroke" (pathLength=1) and the
 * letters "gm-word", so a parent can draw it in with GSAP.
 */
export function GMLogo({
  size = "clamp(50px, 5.2vw, 68px)",
  className,
}: { size?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      role="img"
      aria-label="GM"
      style={{ display: "block", overflow: "visible" }}
    >
      <circle className="gm-stroke" pathLength={1} cx="50" cy="50" r="47" strokeWidth="1.1" />
      <text
        className="gm-word"
        x="50" y="53"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-display)"
        fontWeight={600}
        fontSize="33"
        letterSpacing="0.01em"
        fill="currentColor"
        stroke="none"
      >
        GM
      </text>
    </svg>
  );
}
