"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { EyeLogo } from "@/components/ui/EyeLogo";

const NAV_ITEMS = [
  { label: "Work",       href: "#work",      n: "01", ratio: "3/4" as const, src: "/images/best-of-all/best-09.jpg" },
  { label: "Stories",    href: "#stories",   n: "02", ratio: "3/4" as const, src: "/images/spain/spain-29.webp" },
  { label: "Dispatches", href: "#dispatches", n: "03", ratio: "3/4" as const, src: "/images/india/india-04.jpg" },
  { label: "Series",     href: "#series",    n: "04", ratio: "3/4" as const, src: "/images/best-of-all/best-14.jpg" },
];

export function Nav() {
  const navRef      = useRef<HTMLElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const itemRefs    = useRef<(HTMLAnchorElement | null)[]>([]);
  const imgWrapRef  = useRef<HTMLDivElement>(null);
  const imgInners   = useRef<(HTMLDivElement | null)[]>([]);
  const [open, setOpen] = useState(false);

  // Nav entrance
  useEffect(() => {
    gsap.fromTo(navRef.current,
      { opacity: 0, y: -14 },
      { opacity: 1, y: 0, duration: 1.0, delay: 4.9, ease: "power3.out" }
    );
  }, []);

  // Open / close overlay
  useEffect(() => {
    const overlay = overlayRef.current!;
    const items   = itemRefs.current.filter(Boolean);

    if (open) {
      document.body.style.overflow = "hidden";
      // Wipe in from bottom
      gsap.fromTo(overlay,
        { clipPath: "inset(100% 0% 0% 0%)", display: "flex" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power4.inOut",
          onStart: () => { overlay.style.display = "flex"; } }
      );
      // Stagger links up
      gsap.fromTo(items,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, delay: 0.3, ease: "power4.out" }
      );
    } else {
      // Wipe out upward
      gsap.to(overlay, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.6, ease: "power4.inOut",
        onComplete: () => {
          overlay.style.display = "none";
          document.body.style.overflow = "";
        },
      });
    }
  }, [open]);

  // Hover image reveal
  const onItemEnter = (i: number) => {
    imgInners.current.forEach((el, j) => {
      if (el) el.style.display = j === i ? "block" : "none";
    });
    gsap.fromTo(imgWrapRef.current,
      { clipPath: "inset(0% 100% 0% 0%)", x: 20 },
      { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 0.5, ease: "power4.out" }
    );
  };
  const onItemLeave = () => {
    gsap.to(imgWrapRef.current, {
      clipPath: "inset(0% 0% 0% 100%)", duration: 0.35, ease: "power3.in",
    });
  };

  const close = () => setOpen(false);

  // Close the menu on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* ── Persistent top nav bar ── */}
      <nav
        ref={navRef}
        style={{
          position: "fixed", top: 0, left: 0, right: 0,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px var(--page-px)",
          zIndex: 100,
          mixBlendMode: "difference",
        }}
      >
        {/* Spacer for balance */}
        <span aria-hidden style={{ width: "60px" }} />

        {/* Centered eye logo */}
        <a href="/" aria-label="Garv Malik — home" data-cursor style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          color: "#fff", textDecoration: "none",
          display: "block",
        }}>
          <EyeLogo />
        </a>

        {/* MENU button */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-haspopup="dialog"
          data-cursor
          style={{
            background: "none", border: "none", padding: "12px 10px", margin: "-12px -10px",
            cursor: "none",
            fontSize: "9.5px", letterSpacing: "0.28em", color: "#fff",
            textTransform: "uppercase", fontFamily: "var(--font-display)",
          }}
        >
          Menu
        </button>
      </nav>

      {/* ── Full-screen overlay menu ── */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        style={{
          display: "none",
          position: "fixed", inset: 0,
          background: "#050505",
          zIndex: 300,
          flexDirection: "column",
          clipPath: "inset(100% 0% 0% 0%)",
        }}
      >
        {/* Top bar inside overlay */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px var(--page-px)",
          borderBottom: "0.5px solid var(--c-border)",
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: "9.5px", letterSpacing: "0.22em",
            color: "var(--c-fg-3)", textTransform: "uppercase",
          }}>
            Photography · GM
          </span>
          <button
            onClick={close}
            data-cursor data-cursor-label="CLOSE"
            style={{
              background: "none", border: "none", padding: 0, cursor: "none",
              fontSize: "9.5px", letterSpacing: "0.28em", color: "var(--c-fg-2)",
              textTransform: "uppercase", fontFamily: "var(--font-display)",
            }}
          >
            Close ✕
          </button>
        </div>

        {/* Body */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center",
          padding: "0 var(--page-px)",
          position: "relative",
        }}>
          {/* Nav links — left/center */}
          <div style={{ flex: 1 }}>
            {NAV_ITEMS.map((item, i) => (
              <a
                key={item.label}
                ref={el => { itemRefs.current[i] = el; }}
                href={item.href}
                onClick={close}
                onMouseEnter={() => onItemEnter(i)}
                onMouseLeave={onItemLeave}
                data-cursor
                style={{
                  display: "flex", alignItems: "baseline",
                  gap: "clamp(1rem, 3vw, 2.5rem)",
                  textDecoration: "none",
                  padding: "clamp(0.6rem, 1.5vh, 1.1rem) 0",
                  borderBottom: "0.5px solid var(--c-border)",
                  color: "var(--c-fg)",
                  transition: "color 0.2s",
                }}
                onMouseOver={e => (e.currentTarget.style.color = "var(--c-fg-2)")}
                onMouseOut={e => (e.currentTarget.style.color = "var(--c-fg)")}
              >
                <span style={{
                  fontSize: "9px", letterSpacing: "0.2em",
                  color: "var(--c-fg-3)", textTransform: "uppercase", minWidth: "2rem",
                }}>
                  {item.n}
                </span>
                <span style={{
                  fontSize: "clamp(2.5rem, 7vw, 7rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}>
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          {/* Hover photo — right side */}
          <div
            ref={imgWrapRef}
            style={{
              position: "absolute",
              right: "var(--page-px)",
              top: "50%",
              transform: "translateY(-50%)",
              width: "clamp(160px, 18vw, 280px)",
              pointerEvents: "none",
              clipPath: "inset(0% 100% 0% 0%)",
              willChange: "clip-path, transform",
            }}
          >
            {NAV_ITEMS.map((item, i) => (
              <div key={item.label} ref={el => { imgInners.current[i] = el; }} style={{ display: "none" }}>
                <PhotoPlaceholder ratio={item.ratio} src={item.src} alt={item.label} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "1.25rem var(--page-px)",
          borderTop: "0.5px solid var(--c-border)",
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: "9px", letterSpacing: "0.2em",
            color: "var(--c-fg-3)", textTransform: "uppercase",
          }}>
            Tampere · Finland
          </span>
          <a href="mailto:thegarvmalik@gmail.com" data-cursor style={{
            fontSize: "9px", letterSpacing: "0.2em",
            color: "var(--c-fg-3)", textTransform: "uppercase", textDecoration: "none",
          }}>
            thegarvmalik@gmail.com
          </a>
          <span style={{
            fontSize: "9px", letterSpacing: "0.2em",
            color: "var(--c-fg-3)", textTransform: "uppercase",
          }}>
            © 2024
          </span>
        </div>
      </div>
    </>
  );
}
