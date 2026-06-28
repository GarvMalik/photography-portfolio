"use client";
import { useEffect, useRef, useState, useCallback, type CSSProperties } from "react";
import gsap from "gsap";
import type { ReelFrame } from "@/lib/reel";

interface Props {
  frames: ReelFrame[];
  startIndex?: number;
  variant?: "minimal" | "rich";   // Selected Works vs Dispatches
  collectionTitle?: string;
  onClose: () => void;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function FilmReelViewer({
  frames, startIndex = 0, variant = "minimal", collectionTitle, onClose,
}: Props) {
  const total = frames.length;

  const rootRef   = useRef<HTMLDivElement>(null);
  const stageRef  = useRef<HTMLDivElement>(null);
  const trackRef  = useRef<HTMLDivElement>(null);
  const frameEls  = useRef<Map<number, HTMLDivElement>>(new Map());

  const fF        = useRef({ v: startIndex });   // animated float position
  const curRef    = useRef(startIndex);          // settled integer index
  const animating = useRef(false);
  const drag      = useRef<{ active: boolean; startX: number; startV: number; moved: number }>(
    { active: false, startX: 0, startV: 0, moved: 0 },
  );

  const [current, setCurrent] = useState(startIndex);
  const [expanded, setExpanded] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const contextLabel = collectionTitle ?? "Selected Works";

  // Frame geometry (responsive)
  const geomRef = useRef({ w: 460, h: 307, spacing: 300 });
  const setGeom = useCallback(() => {
    const vw = window.innerWidth;
    const w = clamp(vw * 0.46, 240, 540);
    geomRef.current = { w, h: w * (2 / 3), spacing: w * 0.66 };
  }, []);

  // ── Position every visible frame from the float index ──────────────
  const render = useCallback(() => {
    const f = fF.current.v;
    const { spacing } = geomRef.current;
    frameEls.current.forEach((el, i) => {
      const off = i - f;                         // signed distance from centre
      const a   = Math.abs(off);
      const x   = off * spacing;
      const rotY = clamp(-off * 24, -62, 62);    // the strip curves around a reel
      const z    = -Math.min(a, 4) * 130;        // sides recede
      const sc   = Math.max(0.62, 1 - a * 0.12);
      const op   = Math.max(0.16, 1 - a * 0.4);
      el.style.transform =
        `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${sc})`;
      el.style.opacity = String(op);
      el.style.zIndex = String(100 - Math.round(a * 10));
      // centre frame: sharp & bright; sides: gently dimmed (cheap, no blur)
      el.style.filter = a < 0.5 ? "none" : `brightness(${(1 - Math.min(a, 3) * 0.12).toFixed(2)})`;
    });
  }, []);

  // ── Navigation — mechanical 3-phase advance (resistance → reel → snap) ──
  const animateTo = useCallback((nRaw: number, mechanical = true) => {
    const n = clamp(Math.round(nRaw), 0, total - 1);
    const dir = Math.sign(n - fF.current.v) || 1;
    curRef.current = n;
    setCurrent(n);
    animating.current = true;

    gsap.killTweensOf(fF.current);
    gsap.killTweensOf(trackRef.current);
    const tl = gsap.timeline({ onComplete: () => { animating.current = false; } });

    if (mechanical && n !== Math.round(fF.current.v)) {
      // Phase 1 — resistance: a tiny inverse tug before it gives
      tl.to(fF.current, { v: fF.current.v - 0.07 * dir, duration: 0.1, ease: "power2.out", onUpdate: render });
      // Phase 2+3 — advance, then snap-lock with a faint mechanical overshoot
      tl.to(fF.current, { v: n, duration: 0.62, ease: "back.out(1.1)", onUpdate: render });
      // Reel deformation — the strip dips into depth mid-advance, then returns
      tl.to(trackRef.current, { z: -90, duration: 0.3, ease: "power2.in" }, "<")
        .to(trackRef.current, { z: 0, duration: 0.36, ease: "power3.out" }, ">-0.02");
    } else {
      tl.to(fF.current, { v: n, duration: 0.4, ease: "power3.out", onUpdate: render });
    }
  }, [render, total]);

  const next = useCallback(() => animateTo(curRef.current + 1), [animateTo]);
  const prev = useCallback(() => animateTo(curRef.current - 1), [animateTo]);

  // ── Entrance ───────────────────────────────────────────────────────
  useEffect(() => {
    setGeom();
    render();
    const tl = gsap.timeline();
    tl.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
    tl.fromTo(stageRef.current,
      { scale: 1.08, y: 30 },
      { scale: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.05);
    document.body.style.overflow = "hidden";

    const onResize = () => { setGeom(); render(); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); document.body.style.overflow = ""; };
  }, [render, setGeom]);

  // ── Keyboard ───────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (expanded) setExpanded(false);
        else if (panelOpen) setPanelOpen(false);
        else handleClose();
      }
      else if (e.key === "ArrowRight") { if (!expanded) next(); }
      else if (e.key === "ArrowLeft")  { if (!expanded) prev(); }
      else if (e.key === "Enter")      { if (!expanded) setExpanded(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, expanded, panelOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = useCallback(() => {
    gsap.to(rootRef.current, { opacity: 0, duration: 0.4, ease: "power2.in", onComplete: onClose });
  }, [onClose]);

  // ── Drag / swipe ───────────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    if (expanded) return;
    drag.current = { active: true, startX: e.clientX, startV: fF.current.v, moved: 0 };
    gsap.killTweensOf(fF.current);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    fF.current.v = clamp(drag.current.startV - dx / geomRef.current.spacing, -0.4, total - 0.6);
    render();
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const wasDrag = drag.current.moved > 8;
    drag.current.active = false;
    if (wasDrag) {
      animateTo(Math.round(fF.current.v), false);   // snap to nearest, no resistance
    } else {
      // treat as a click — zone decides (prev / expand / next)
      const r = stageRef.current!.getBoundingClientRect();
      const rel = (e.clientX - r.left) / r.width;
      if (rel < 0.32) prev();
      else if (rel > 0.68) next();
      else setExpanded(true);
    }
  };

  // Index panel — morph the dock up into a glass list
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (panelOpen) {
      gsap.fromTo(panel, { height: 0, opacity: 0 },
        { height: "min(330px, 46vh)", opacity: 1, duration: 0.5, ease: "power3.out" });
    } else {
      gsap.to(panel, { height: 0, opacity: 0, duration: 0.35, ease: "power2.in" });
    }
  }, [panelOpen]);

  const cur = frames[current];

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={collectionTitle ? `${collectionTitle} reel` : "Gallery reel"}
      style={{
        position: "fixed", inset: 0, zIndex: 460,
        background: "radial-gradient(120% 100% at 50% 42%, #0b0b0d 0%, #060606 55%, #020202 100%)",
        overflow: "hidden",
      }}
    >
      {/* ── Context labels (orientation, top-left) ── */}
      <div style={{
        position: "absolute", top: "26px", left: "var(--page-px)", zIndex: 30, pointerEvents: "none",
      }}>
        <div style={{
          fontSize: "9px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.42)",
          textTransform: "uppercase", fontVariantNumeric: "tabular-nums",
        }}>
          Frame {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
        <div style={{
          fontSize: "clamp(0.95rem, 2.4vw, 1.5rem)", fontWeight: 500, letterSpacing: "-0.01em",
          textTransform: "uppercase", color: "#fff", lineHeight: 1, marginTop: "8px",
        }}>
          {contextLabel}
        </div>
        {variant === "rich" && cur?.location && (
          <div style={{
            fontSize: "8px", letterSpacing: "0.24em", color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase", marginTop: "7px",
          }}>
            {cur.location} · {cur.date}
          </div>
        )}
      </div>

      {/* ── Reel stage (display only — interaction handled by the zone layer) ── */}
      <div
        ref={stageRef}
        style={{
          position: "absolute", inset: 0,
          perspective: "1600px", perspectiveOrigin: "50% 50%",
          pointerEvents: "none", touchAction: "pan-y",
        }}
      >
        <div ref={trackRef} style={{
          position: "absolute", top: "50%", left: "50%",
          transformStyle: "preserve-3d", willChange: "transform",
        }}>
          {frames.map((fr, i) => {
            if (Math.abs(i - current) > 4) return null;   // virtualize
            return (
              <div
                key={i}
                ref={el => { if (el) frameEls.current.set(i, el); else frameEls.current.delete(i); }}
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: geomRef.current.w, height: geomRef.current.h,
                  willChange: "transform, opacity",
                }}
              >
                <ReelFrameEl src={fr.src} alt={fr.title ?? ""} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Current-frame label (above the dock) ── */}
      <div style={{
        position: "absolute", bottom: "104px", left: 0, right: 0, zIndex: 30,
        textAlign: "center", pointerEvents: "none", padding: "0 var(--page-px)",
      }}>
        {variant === "rich" && cur?.caption && (
          <div style={{
            fontSize: "clamp(11px, 1.4vw, 13px)", color: "rgba(255,255,255,0.72)",
            fontStyle: "italic", maxWidth: "560px", margin: "0 auto", lineHeight: 1.5,
          }}>
            {cur.caption}
          </div>
        )}
        {variant === "minimal" && cur?.title && (
          <div style={{
            fontSize: "11px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.78)", textTransform: "uppercase",
          }}>
            {cur.title}{cur.type ? ` — ${cur.type}` : ""}
          </div>
        )}
      </div>

      {/* ── Interaction + cursor zones (Previous / Expand / Next) — also carries
            drag/swipe so the labels and gestures share one layer ── */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={(e) => drag.current.active && onPointerUp(e)}
        style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", cursor: "none", touchAction: "pan-y" }}
      >
        <div data-cursor data-cursor-label="PREV"   style={{ flex: "0 0 32%" }} />
        <div data-cursor data-cursor-label="EXPAND" style={{ flex: "1 1 auto" }} />
        <div data-cursor data-cursor-label="NEXT"   style={{ flex: "0 0 32%" }} />
      </div>

      {/* ── Frame index panel — morphs up out of the dock ── */}
      <div
        ref={panelRef}
        className="glass"
        style={{
          position: "absolute", bottom: "94px", left: "50%", transform: "translateX(-50%)",
          width: "min(460px, 88vw)", borderRadius: "18px", overflow: "hidden",
          height: 0, opacity: 0, zIndex: 35,
        }}
      >
        <div style={{ padding: "18px 22px", height: "100%", overflowY: "auto" }}>
          <div style={{ fontSize: "8px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: "12px" }}>
            {contextLabel} · {total} frames
          </div>
          {frames.map((f, i) => (
            <button
              key={i}
              onClick={() => { animateTo(i); setPanelOpen(false); }}
              data-cursor
              style={{
                display: "flex", gap: "16px", alignItems: "baseline", width: "100%",
                background: "none", border: "none", padding: "10px 0", cursor: "none", textAlign: "left",
                borderBottom: "0.5px solid rgba(255,255,255,0.08)",
                color: i === current ? "#fff" : "rgba(255,255,255,0.6)", transition: "color 0.2s",
              }}
            >
              <span style={{ fontSize: "9px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)", fontVariantNumeric: "tabular-nums", minWidth: "22px" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: "12px", letterSpacing: "0.02em" }}>
                {f.caption ?? f.title ?? `Frame ${i + 1}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom glass navigation dock ── */}
      <div style={{
        position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)",
        zIndex: 40, display: "flex", gap: "10px", alignItems: "center",
      }}>
        <div className="glass" style={{ display: "flex", alignItems: "center", gap: "4px", borderRadius: "100px", padding: "6px" }}>
          {/* mobile-only arrows (desktop uses cursor zones / keys / drag) */}
          <button className="reel-arrow" onClick={prev} disabled={current === 0} aria-label="Previous" data-cursor data-cursor-label="PREV"
                  style={dockBtn(current === 0)}>
            <Chevron dir="prev" />
          </button>

          {/* index button + counter */}
          <button
            onClick={() => setPanelOpen(o => !o)}
            aria-label="Frame index" aria-expanded={panelOpen}
            data-cursor data-cursor-label="INDEX"
            style={{
              display: "flex", alignItems: "center", gap: "9px", padding: "8px 16px",
              background: panelOpen ? "rgba(255,255,255,0.16)" : "transparent",
              border: "none", borderRadius: "100px", cursor: "none", color: "#fff",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
            <span style={{ fontSize: "12px", letterSpacing: "0.1em", fontVariantNumeric: "tabular-nums" }}>
              {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </button>

          <button className="reel-arrow" onClick={next} disabled={current === total - 1} aria-label="Next" data-cursor data-cursor-label="NEXT"
                  style={dockBtn(current === total - 1)}>
            <Chevron dir="next" />
          </button>
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close gallery"
          data-cursor data-cursor-label="CLOSE"
          className="glass"
          style={{ width: 46, height: 46, borderRadius: "50%", display: "grid", placeItems: "center", cursor: "none", color: "#fff" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
        </button>
      </div>

      {/* ── Expanded image mode — the photograph escapes the reel ── */}
      {expanded && cur && (
        <ExpandedImageViewer frame={cur} onClose={() => setExpanded(false)} />
      )}
    </div>
  );
}

/* ── A single film frame: slim dark border, metallic edge, subtle perforations ── */
function ReelFrameEl({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      borderRadius: "8px", padding: "7px",
      background: "linear-gradient(160deg, rgba(36,36,40,0.96), rgba(12,12,14,0.96))",
      boxShadow: "0 30px 70px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.10), inset 0 1px 0 rgba(255,255,255,0.18)",
    }}>
      {/* perforation hint — abstract sprocket rails, very subtle */}
      <div aria-hidden style={{
        position: "absolute", top: "7px", bottom: "7px", left: "2px", width: "3px",
        background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.16) 0 3px, transparent 3px 9px)",
        opacity: 0.5, borderRadius: "2px",
      }} />
      <div aria-hidden style={{
        position: "absolute", top: "7px", bottom: "7px", right: "2px", width: "3px",
        background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.16) 0 3px, transparent 3px 9px)",
        opacity: 0.5, borderRadius: "2px",
      }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" style={{
        width: "100%", height: "100%", objectFit: "cover", display: "block",
        borderRadius: "3px",
      }} />
    </div>
  );
}

/* ── Expanded viewer ── */
function ExpandedImageViewer({ frame, onClose }: { frame: ReelFrame; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    const img = ref.current?.querySelector("img");
    if (img) gsap.fromTo(img, { scale: 0.92 }, { scale: 1, duration: 0.7, ease: "power3.out" });
  }, []);
  return (
    <div
      ref={ref}
      onClick={onClose}
      data-cursor data-cursor-label="CLOSE"
      style={{
        position: "absolute", inset: 0, zIndex: 50, background: "rgba(3,3,4,0.94)",
        display: "grid", placeItems: "center", cursor: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={frame.src} alt={frame.title ?? ""} style={{
        maxWidth: "86vw", maxHeight: "82vh", objectFit: "contain", display: "block",
        boxShadow: "0 40px 120px rgba(0,0,0,0.7)",
      }} />
      {frame.caption && (
        <div style={{
          position: "absolute", bottom: "32px", left: 0, right: 0, textAlign: "center",
          fontSize: "12px", letterSpacing: "0.04em", color: "rgba(255,255,255,0.7)", fontStyle: "italic",
        }}>
          {frame.caption}
        </div>
      )}
    </div>
  );
}

/* ── Dock arrow (mobile) ── */
const dockBtn = (disabled: boolean): CSSProperties => ({
  width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center",
  background: "rgba(255,255,255,0.06)", border: "none", cursor: "none", color: "#fff",
  opacity: disabled ? 0.3 : 1, transition: "opacity 0.2s",
});
function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         style={{ transform: dir === "prev" ? "none" : "rotate(180deg)" }}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
