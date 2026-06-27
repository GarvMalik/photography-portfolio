"use client";
/**
 * OGLDisplacementPlane — Phase 5 target
 *
 * Renders a photo as a WebGL plane with real-time displacement shader.
 * Shader source: /public/shaders/displacement.vert + .frag
 *
 * TODO Phase 5:
 * 1. import { Renderer, Camera, Geometry, Program, Mesh, Vec2, Texture } from "ogl"
 * 2. fetch("/shaders/displacement.vert") + fetch("/shaders/displacement.frag")
 * 3. Create OGL Renderer → attach canvas to containerRef
 * 4. Load tMap texture from `src` prop
 * 5. Uniforms: { tMap, tFlow, uTime: {value:0}, uMouse: {value: new Vec2(0.5,0.5)}, uHover: {value:0} }
 * 6. mousemove → gsap.to(uMouse.value, { x, y }) + gsap.to(uHover, { value:1 })
 * 7. mouseleave → gsap.to(uHover, { value:0 })
 * 8. rAF loop → uTime.value += 0.01; renderer.render({ scene: mesh })
 */
import { useEffect, useRef } from "react";

interface Props { src: string; alt?: string; className?: string; }

export function OGLDisplacementPlane({ src, alt, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    return () => { cancelAnimationFrame(rafRef.current); };
  }, [src]);

  return (
    <div ref={containerRef} className={className}
         style={{ width: "100%", height: "100%", position: "relative" }}
         role="img" aria-label={alt ?? "Photography"} />
  );
}
