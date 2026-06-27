"use client";
import { useEffect, useRef } from "react";

interface Props {
  ratio: string;
  src?: string;
  alt?: string;
  label?: string;
  sub?: string;
  className?: string;
}

export function PhotoPlaceholder({ ratio, src, alt, label, sub, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (src) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.offsetWidth  || 400;
    const H = canvas.offsetHeight || 300;
    canvas.width = W; canvas.height = H;

    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#030303"); g.addColorStop(0.32, "#111111");
    g.addColorStop(0.65, "#1c1c1c"); g.addColorStop(1, "#070707");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    const gl = ctx.createRadialGradient(W*.5, H*.33, 0, W*.5, H*.33, W*.7);
    gl.addColorStop(0, "rgba(60,60,60,.55)"); gl.addColorStop(.6, "rgba(22,22,22,.20)");
    gl.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);

    const id = ctx.getImageData(0, 0, W, H); const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - .5) * 24;
      d[i] = Math.min(255, Math.max(0, d[i] + n)); d[i+1] = d[i]; d[i+2] = d[i];
    }
    ctx.putImageData(id, 0, 0);

    ctx.strokeStyle = "rgba(0,0,0,0.18)"; ctx.lineWidth = 1;
    for (let y = 1; y < H; y += 2) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    const vig = ctx.createRadialGradient(W/2, H/2, W*.08, W/2, H/2, W*1.05);
    vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,.80)");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
  }, [src]);

  return (
    <div className={className}
         style={{ position: "relative", aspectRatio: ratio, width: "100%",
                  overflow: "hidden", background: "#0a0a0a" }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
                   objectFit: "cover", display: "block" }}
        />
      ) : (
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
      )}

      {/* Shimmer sweep — only on placeholders */}
      {!src && (
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,.018) 50%, transparent 60%)",
          backgroundSize: "200% 100%", animation: "shimmer 8s linear infinite",
        }} />
      )}

      {/* Viewfinder corner marks */}
      {[
        { top: 6, left: 6,   borderTop: "1px solid rgba(255,255,255,.2)", borderLeft:  "1px solid rgba(255,255,255,.2)" },
        { top: 6, right: 6,  borderTop: "1px solid rgba(255,255,255,.2)", borderRight: "1px solid rgba(255,255,255,.2)" },
        { bottom: 6, left: 6,  borderBottom: "1px solid rgba(255,255,255,.2)", borderLeft:  "1px solid rgba(255,255,255,.2)" },
        { bottom: 6, right: 6, borderBottom: "1px solid rgba(255,255,255,.2)", borderRight: "1px solid rgba(255,255,255,.2)" },
      ].map((s, i) => (
        <div key={i} aria-hidden style={{ position: "absolute", width: 14, height: 14, pointerEvents: "none", ...s }} />
      ))}

      {label && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "24px 10px 9px",
          background: "linear-gradient(to top, rgba(0,0,0,.65), transparent)",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          pointerEvents: "none",
        }}>
          <span style={{ fontSize: "7.5px", letterSpacing: "0.18em", color: "rgba(255,255,255,.75)", textTransform: "uppercase" }}>
            {label}
          </span>
          {sub && (
            <span style={{ fontSize: "7px", letterSpacing: "0.12em", color: "rgba(255,255,255,.28)", textTransform: "uppercase" }}>
              {sub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
