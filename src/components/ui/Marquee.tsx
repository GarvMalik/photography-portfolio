"use client";

interface Props {
  text: string;
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
}

const DURATIONS = { fast: "16s", normal: "26s", slow: "40s" };

export function Marquee({ text, direction = "left", speed = "normal" }: Props) {
  const animation = direction === "right" ? "marquee-right" : "marquee-left";
  const duration  = DURATIONS[speed];
  // 4 copies so the loop is invisible at any screen width
  const copies = [text, text, text, text];

  return (
    <div style={{
      overflow: "hidden",
      padding: "13px 0",
      borderTop: "0.5px solid var(--c-border)",
      borderBottom: "0.5px solid var(--c-border)",
      userSelect: "none",
    }}>
      <div style={{
        display: "flex",
        whiteSpace: "nowrap",
        animation: `${animation} ${duration} linear infinite`,
        willChange: "transform",
      }}>
        {copies.map((copy, i) => (
          <span key={i} style={{
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--c-fg-3)",
            paddingRight: "4rem",
          }}>
            {copy}
          </span>
        ))}
      </div>
    </div>
  );
}
