"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";

export interface LightboxState {
  src: string;
  caption?: string;
  rect: DOMRect;
}

export function Lightbox({ state, onClose }: { state: LightboxState; onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const imgRef      = useRef<HTMLImageElement>(null);
  const closing     = useRef(false);

  // Zoom state
  const [zoom, setZoom]   = useState(1);
  const [origin, setOrigin] = useState({ x: 50, y: 50 }); // transform-origin %
  const pinch = useRef<{ dist: number; cx: number; cy: number } | null>(null);

  // FLIP entrance
  useEffect(() => {
    const img = imgRef.current!, backdrop = backdropRef.current!;
    const last = img.getBoundingClientRect();
    const dx = state.rect.left - last.left;
    const dy = state.rect.top  - last.top;
    const sx = state.rect.width  / last.width;
    const sy = state.rect.height / last.height;
    gsap.set(img, { x: dx, y: dy, scaleX: sx, scaleY: sy, transformOrigin: "top left" });
    gsap.to(img, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.65, ease: "power3.inOut" });
    gsap.fromTo(backdrop,
      { opacity: 0, backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)" },
      { opacity: 1, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", duration: 0.5, ease: "power2.out" });
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [state]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    // Reset zoom before closing so FLIP is accurate
    setZoom(1);
    const img = imgRef.current!, backdrop = backdropRef.current!;
    setTimeout(() => {
      const last = img.getBoundingClientRect();
      gsap.to(img, {
        x: state.rect.left - last.left, y: state.rect.top - last.top,
        scaleX: state.rect.width / last.width, scaleY: state.rect.height / last.height,
        transformOrigin: "top left", duration: 0.5, ease: "power3.inOut",
      });
      gsap.to(backdrop, { opacity: 0, backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)",
        duration: 0.45, ease: "power2.in", onComplete: onClose });
    }, zoom > 1 ? 50 : 0); // tiny delay so zoom reset repaints first
  }, [state, onClose, zoom]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // Scroll-wheel zoom (desktop)
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const img = imgRef.current!;
    const rect = img.getBoundingClientRect();
    const ox = ((e.clientX - rect.left) / rect.width)  * 100;
    const oy = ((e.clientY - rect.top)  / rect.height) * 100;
    setOrigin({ x: ox, y: oy });
    setZoom(z => Math.min(4, Math.max(1, z - e.deltaY * 0.003)));
  }, []);

  // Pinch-to-zoom (mobile)
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinch.current = {
        dist: Math.hypot(dx, dy),
        cx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        cy: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinch.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / pinch.current.dist;
      const img = imgRef.current!;
      const rect = img.getBoundingClientRect();
      const ox = ((pinch.current.cx - rect.left) / rect.width)  * 100;
      const oy = ((pinch.current.cy - rect.top)  / rect.height) * 100;
      setOrigin({ x: ox, y: oy });
      setZoom(z => Math.min(4, Math.max(1, z * scale)));
      pinch.current.dist = dist;
    }
  }, []);

  const onTouchEnd = useCallback(() => { pinch.current = null; }, []);

  // Click backdrop to close (only if not zoomed in significantly)
  const onBackdropClick = useCallback(() => {
    if (zoom > 1.1) { setZoom(1); } // first click resets zoom
    else close();
  }, [zoom, close]);

  return (
    <div
      ref={backdropRef}
      onClick={onBackdropClick}
      data-cursor data-cursor-label={zoom > 1.1 ? "RESET" : "CLOSE"}
      style={{
        position: "fixed", inset: 0, zIndex: 480,
        background: "rgba(4,4,5,0.82)",
        display: "grid", placeItems: "center",
        cursor: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={state.src}
        alt={state.caption ?? ""}
        onClick={e => e.stopPropagation()}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          maxWidth: "86vw", maxHeight: "84vh", objectFit: "contain", display: "block",
          boxShadow: "0 40px 120px rgba(0,0,0,0.7)", willChange: "transform",
          transform: `scale(${zoom})`,
          transformOrigin: `${origin.x}% ${origin.y}%`,
          transition: zoom === 1 ? "transform 0.35s cubic-bezier(0.16,1,0.3,1)" : "none",
          cursor: zoom > 1 ? "zoom-out" : "zoom-in",
          touchAction: "none",
        }}
      />
      {state.caption && (
        <div style={{
          position: "absolute", bottom: "30px", left: 0, right: 0, textAlign: "center",
          fontSize: "12px", letterSpacing: "0.04em", color: "rgba(255,255,255,0.7)",
          fontStyle: "italic", pointerEvents: "none",
          opacity: zoom > 1.1 ? 0 : 1, transition: "opacity 0.3s",
        }}>
          {state.caption}
        </div>
      )}

      {/* Zoom hint — fades in briefly on open */}
      <div style={{
        position: "absolute", bottom: "30px", left: 0, right: 0, textAlign: "center",
        fontSize: "8px", letterSpacing: "0.24em", color: "rgba(255,255,255,0.28)",
        textTransform: "uppercase", pointerEvents: "none",
        opacity: zoom > 1.1 ? 0 : 1, transition: "opacity 0.3s",
      }}>
        {state.caption ? "" : "scroll or pinch to zoom · click outside to close"}
      </div>

      <button
        onClick={e => { e.stopPropagation(); zoom > 1 ? setZoom(1) : close(); }}
        aria-label={zoom > 1 ? "Reset zoom" : "Close"}
        data-cursor data-cursor-label={zoom > 1 ? "RESET" : "CLOSE"}
        style={{
          position: "absolute", top: "1.6rem", right: "var(--page-px)",
          background: "none", border: "none", cursor: "none",
          fontSize: "9px", letterSpacing: "0.26em", color: "rgba(255,255,255,0.65)",
          textTransform: "uppercase", fontFamily: "var(--font-display)", padding: "10px",
        }}
      >
        {zoom > 1 ? "Reset ↺" : "Close ✕"}
      </button>
    </div>
  );
}
