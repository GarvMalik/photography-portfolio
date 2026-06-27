"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current!;
    const ring = ringRef.current!;

    const onMove = (e: MouseEvent) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.55, ease: "power3.out" });
    };

    const expand   = () => {
      gsap.to(ring, { scale: 2.4, opacity: 0.5, duration: 0.3, ease: "power2.out" });
      gsap.to(dot,  { scale: 0, duration: 0.2 });
    };
    const contract = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(dot,  { scale: 1, duration: 0.2 });
    };

    const attachHovers = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach(el => {
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
      observer.disconnect();
    };
  }, []);

  const base: React.CSSProperties = {
    position: "fixed", top: 0, left: 0,
    pointerEvents: "none", willChange: "transform",
    transform: "translate(-50%, -50%)",
    zIndex: 200,
  };

  return (
    <>
      <div ref={dotRef}  style={{ ...base, width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
      <div ref={ringRef} style={{ ...base, width: 34, height: 34, borderRadius: "50%",
                                   border: "1px solid rgba(255,255,255,0.75)", mixBlendMode: "difference" }} />
    </>
  );
}
