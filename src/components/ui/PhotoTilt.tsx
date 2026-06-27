"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";

interface Props {
  children: ReactNode;
  strength?: number; // default 12deg max tilt
}

export function PhotoTilt({ children, strength = 12 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current!;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5; // -0.5 → 0.5
    const y = (e.clientY - top)  / height - 0.5;

    gsap.to(el, {
      rotateY:  x * strength,
      rotateX: -y * strength,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 700,
      transformOrigin: "center center",
    });
  };

  const onLeave = () => {
    gsap.to(wrapRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ willChange: "transform", display: "contents" }}
    >
      {children}
    </div>
  );
}
