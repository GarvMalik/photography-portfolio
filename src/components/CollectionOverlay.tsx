"use client";
import { useEffect, useRef, useState, useCallback, type CSSProperties } from "react";
import gsap from "gsap";

export interface Collection {
  id:      string;
  title:   string;
  country: string;
  year:    string;
  frames:  string;
  photos:  { src?: string; ratio: "2/3" | "3/4" | "1/1" | "16/9" | "4/3" }[];
}

interface Props {
  collection: Collection;
  onClose: () => void;
}

export function CollectionOverlay({ collection, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const figureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [listOpen, setListOpen] = useState(false);

  const total = collection.photos.length;

  // ── Entrance — wipe up, the title flies in from centre, photos stagger ──
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power4.inOut" }
    );

    // Title persistence — the name "survives the glass": appears big at centre,
    // holds, then settles into the top-left header.
    const title = titleRef.current;
    if (title) {
      const r = title.getBoundingClientRect();
      const dx = window.innerWidth  / 2 - (r.left + r.width  / 2);
      const dy = window.innerHeight / 2 - (r.top  + r.height / 2);
      tl.fromTo(title,
        { x: dx, y: dy, scale: 2.3, opacity: 0, transformOrigin: "center center" },
        { opacity: 1, duration: 0.3, ease: "power1.out" }, 0.15
      ).to(title,
        { x: 0, y: 0, scale: 1, duration: 1.1, ease: "power3.inOut" }, 0.75
      );
    }

    figureRefs.current.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.0, delay: 1.1 + i * 0.06, ease: "power3.out" }
      );
    });

    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Metadata list expand / collapse ─────────────────────────────
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (listOpen) {
      gsap.fromTo(panel,
        { height: 0, opacity: 0 },
        { height: "min(320px, 46vh)", opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    } else {
      gsap.to(panel, { height: 0, opacity: 0, duration: 0.35, ease: "power2.in" });
    }
  }, [listOpen]);

  // ── Track which photo is centered (drives counter + avatar) ─────
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setCurrent(idx);
          }
        });
      },
      { root, rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    figureRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(total - 1, idx));
    figureRefs.current[clamped]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [total]);

  const handleClose = useCallback(() => {
    gsap.to(overlayRef.current, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.6, ease: "power4.inOut",
      onComplete: onClose,
    });
  }, [onClose]);

  // ── Keyboard ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
      if (e.key === "ArrowUp"   || e.key === "ArrowLeft")  { e.preventDefault(); goTo(current - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo, handleClose]);

  const glassPill: CSSProperties = { borderRadius: "100px" };
  const ctrlBtn: CSSProperties = {
    width: 34, height: 34, display: "grid", placeItems: "center",
    background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.18)",
    borderRadius: "50%", color: "#fff", cursor: "none",
    transition: "background 0.25s, opacity 0.25s",
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${collection.title} gallery`}
      style={{
        position: "fixed", inset: 0,
        background: "#000",
        zIndex: 450,
        clipPath: "inset(100% 0% 0% 0%)",
        overflow: "hidden",
      }}
    >
      {/* ── Top label ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 3,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        padding: "26px var(--page-px)",
        pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
      }}>
        <div ref={titleRef} style={{ willChange: "transform" }}>
          <div style={{
            fontSize: "clamp(1.4rem, 4vw, 3rem)", fontWeight: 500,
            letterSpacing: "-0.03em", textTransform: "uppercase", lineHeight: 1, color: "#fff",
          }}>
            {collection.title}
          </div>
          <div style={{
            fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.6)",
            textTransform: "uppercase", marginTop: "7px",
          }}>
            {collection.country} · {collection.frames} frames · {collection.year}
          </div>
        </div>
      </div>

      {/* ── Vertical scroll gallery ── */}
      <div
        ref={scrollRef}
        style={{
          position: "absolute", inset: 0,
          overflowY: "auto", overflowX: "hidden",
          scrollBehavior: "smooth",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "16vh var(--page-px) 22vh",
          gap: "8vh",
        }}
      >
        {collection.photos.map((photo, i) => (
          <div
            key={i}
            ref={el => { figureRefs.current[i] = el; }}
            data-idx={i}
            data-cursor
            data-cursor-label="ZOOM"
            style={{ position: "relative", lineHeight: 0 }}
          >
            {photo.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.src}
                alt={`${collection.title} — frame ${i + 1}`}
                style={{
                  display: "block",
                  maxHeight: "80vh",
                  maxWidth: "min(94vw, 1080px)",
                  width: "auto", height: "auto",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div style={{
                width: "min(94vw, 1080px)", aspectRatio: photo.ratio,
                background: "#111",
              }} />
            )}
            {/* Frame number */}
            <span style={{
              position: "absolute", bottom: "12px", right: "14px",
              fontSize: "9px", letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.55)", textTransform: "uppercase",
              textShadow: "0 1px 6px rgba(0,0,0,0.7)", pointerEvents: "none",
            }}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>

      {/* ── Expandable metadata list (grows up out of the dock) ── */}
      <div
        ref={panelRef}
        className="glass"
        style={{
          position: "absolute", bottom: "96px", left: "50%",
          transform: "translateX(-50%)",
          width: "min(440px, 88vw)", borderRadius: "18px",
          height: 0, opacity: 0, overflow: "hidden", zIndex: 5,
        }}
      >
        <div style={{ padding: "18px 22px", height: "100%", overflowY: "auto" }}>
          <div style={{
            fontSize: "8px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase", marginBottom: "12px",
          }}>
            {collection.title} · {collection.country} · {total} frames
          </div>
          {collection.photos.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); setListOpen(false); }}
              data-cursor
              style={{
                display: "flex", gap: "16px", alignItems: "baseline", width: "100%",
                background: "none", border: "none", padding: "10px 0", cursor: "none", textAlign: "left",
                borderBottom: "0.5px solid rgba(255,255,255,0.08)",
                color: i === current ? "#fff" : "rgba(255,255,255,0.6)",
                transition: "color 0.2s",
              }}
            >
              <span style={{ fontSize: "9px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)", fontVariantNumeric: "tabular-nums", minWidth: "22px" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: "12px", letterSpacing: "0.02em" }}>
                {collection.title} — No. {i + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Floating glass control bar ── */}
      <div style={{
        position: "absolute", bottom: "26px", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: "10px",
        zIndex: 6,
      }}>
        <div className="glass" style={{
          ...glassPill,
          display: "flex", alignItems: "center", gap: "14px",
          padding: "8px 10px 8px 8px",
        }}>
          {/* Avatar — current photo */}
          <div style={{
            width: 38, height: 38, borderRadius: "50%", overflow: "hidden",
            flexShrink: 0, background: "#222",
          }}>
            {collection.photos[current]?.src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={collection.photos[current].src} alt=""
                   style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>

          {/* Counter */}
          <div style={{ minWidth: "62px" }}>
            <div style={{ fontSize: "7.5px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>
              Gallery
            </div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "#fff", letterSpacing: "0.04em", fontVariantNumeric: "tabular-nums", marginTop: "1px" }}>
              {String(current + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
            </div>
          </div>

          {/* Up / Down */}
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              aria-label="Previous photo"
              data-cursor
              style={{ ...ctrlBtn, opacity: current === 0 ? 0.35 : 1 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
            </button>
            <button
              onClick={() => goTo(current + 1)}
              disabled={current === total - 1}
              aria-label="Next photo"
              data-cursor
              style={{ ...ctrlBtn, opacity: current === total - 1 ? 0.35 : 1 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          </div>

          {/* Collection list toggle */}
          <button
            onClick={() => setListOpen(o => !o)}
            aria-label="Collection list"
            aria-expanded={listOpen}
            data-cursor
            data-cursor-label="LIST"
            style={{ ...ctrlBtn, background: listOpen ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="7" x2="20" y2="7"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="8" y1="17" x2="20" y2="17"/><circle cx="4" cy="7" r="0.6" fill="#fff"/><circle cx="4" cy="12" r="0.6" fill="#fff"/><circle cx="4" cy="17" r="0.6" fill="#fff"/></svg>
          </button>
        </div>

        {/* Close — separate glass circle */}
        <button
          onClick={handleClose}
          aria-label="Close gallery"
          data-cursor
          data-cursor-label="CLOSE"
          className="glass"
          style={{
            width: 54, height: 54, borderRadius: "50%",
            display: "grid", placeItems: "center", cursor: "none", color: "#fff",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
        </button>
      </div>

      {/* ── Side NEXT pill ── */}
      {current < total - 1 && (
        <button
          onClick={() => goTo(current + 1)}
          aria-label="Next photo"
          data-cursor
          className="glass"
          style={{
            position: "absolute", right: "var(--page-px)", top: "50%",
            transform: "translateY(-50%)",
            padding: "12px 18px", borderRadius: "100px",
            fontSize: "9px", letterSpacing: "0.28em", color: "#fff",
            textTransform: "uppercase", cursor: "none", zIndex: 5,
            fontFamily: "var(--font-display)",
          }}
        >
          Next
        </button>
      )}
    </div>
  );
}
