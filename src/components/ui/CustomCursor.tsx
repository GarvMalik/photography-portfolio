"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef  = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current!;
    const label  = labelRef.current!;

    // Hide native cursor globally
    document.documentElement.style.cursor = "none";

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    // Smooth lerp via RAF
    let raf: number;
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      gsap.set(cursor, { x: pos.x, y: pos.y });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const setLabel = (text: string) => {
      label.textContent = text;
      gsap.to(label, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
    };
    const clearLabel = () => {
      gsap.to(label, { opacity: 0, y: 4, duration: 0.2 });
    };

    const expand = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const txt = el.dataset.cursorLabel ?? "VIEW";
      gsap.to(cursor, { scale: 1.8, duration: 0.35, ease: "power3.out" });
      setLabel(txt);
    };
    const contract = () => {
      gsap.to(cursor, { scale: 1, duration: 0.35, ease: "power3.out" });
      clearLabel();
    };

    const attachHovers = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach(el => {
        el.removeEventListener("mouseenter", expand);
        el.removeEventListener("mouseleave", contract);
        el.addEventListener("mouseenter", expand);
        el.addEventListener("mouseleave", contract);
      });
    };

    window.addEventListener("mousemove", onMove);
    attachHovers();

    const observer = new MutationObserver(attachHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.documentElement.style.cursor = "";
    };
  }, []);

  const S = 36; // bracket size px

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: S, height: S,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: "var(--z-cursor)" as string,
        willChange: "transform",
      }}
    >
      {/* Center dot */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        width: 3, height: 3,
        borderRadius: "50%",
        background: "var(--c-fg)",
        transform: "translate(-50%, -50%)",
      }} />

      {/* Four corner brackets */}
      {[
        { top: 0, left: 0,  borderTop: "1px solid #fff", borderLeft: "1px solid #fff"  },
        { top: 0, right: 0, borderTop: "1px solid #fff", borderRight: "1px solid #fff" },
        { bottom: 0, left: 0,  borderBottom: "1px solid #fff", borderLeft: "1px solid #fff"  },
        { bottom: 0, right: 0, borderBottom: "1px solid #fff", borderRight: "1px solid #fff" },
      ].map((style, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 9, height: 9,
          ...style,
        }} />
      ))}

      {/* Context label */}
      <span ref={labelRef} style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "8px",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--c-fg)",
        whiteSpace: "nowrap",
        opacity: 0,
        translate: "0 4px",
        fontFamily: "var(--font-display)",
      }}>
      </span>
    </div>
  );
}
