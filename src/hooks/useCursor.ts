import { useEffect, useRef } from "react";

export function useCursor() {
  const state = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  useEffect(() => {
    let prev = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      state.current = { x: e.clientX, y: e.clientY,
                        vx: e.clientX - prev.x, vy: e.clientY - prev.y };
      prev = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return state;
}
