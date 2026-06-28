"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A collection-card cover rendered in WebGL so it can refract under the cursor
 * like real glass: a local lens magnification, a faint chromatic split, a
 * specular bloom and a thin rainbow rim — all confined to a radius around the
 * pointer. Renders only while hovered (cheap). Falls back to a plain <img> on
 * touch / no-WebGL.
 */
const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2  uMouse;
  uniform float uHover;
  uniform float uRadius;
  uniform vec2  uAspect;   // (1, h/w) → circular falloff
  uniform vec2  uCover;    // object-fit: cover crop

  vec3 sampleCover(vec2 uv) {
    vec2 c = 0.5 + (uv - 0.5) * uCover;
    return texture2D(uTex, c).rgb;
  }

  void main() {
    vec2 uv = vUv;
    vec2 d = (uv - uMouse) * uAspect;
    float dist = length(d);
    float fall = smoothstep(uRadius, 0.0, dist) * uHover;

    vec2 dir = dist > 0.0001 ? normalize(uv - uMouse) : vec2(0.0);

    // convex lens — pull the sample toward the cursor (magnify), gently
    vec2 luv = uv - dir * fall * 0.034;

    // chromatic refraction — a whisper of R/B split along the radius
    float ca = fall * 0.0045;
    float r = sampleCover(luv + dir * ca).r;
    float g = sampleCover(luv).g;
    float b = sampleCover(luv - dir * ca).b;
    vec3 col = vec3(r, g, b);

    // specular bloom right under the cursor
    float spec = smoothstep(uRadius * 0.4, 0.0, dist) * uHover;
    col += spec * 0.12;

    // very faint prism rim at the distortion boundary
    float ring = smoothstep(uRadius, uRadius * 0.85, dist)
               * (1.0 - smoothstep(uRadius * 0.85, uRadius * 0.72, dist));
    col += ring * uHover * vec3(0.022, 0.01, 0.03);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function GlassCard({ src, alt = "" }: { src: string; alt?: string }) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    // Only on devices with a precise pointer (hover makes sense); else keep <img>
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch { return; } // no WebGL → <img> fallback stays
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene  = new THREE.Scene();
    const camera = new THREE.Camera();
    const geo    = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uTex:    { value: null as THREE.Texture | null },
      uMouse:  { value: new THREE.Vector2(0.5, 0.5) },
      uHover:  { value: 0 },
      uRadius: { value: 0.28 },
      uAspect: { value: new THREE.Vector2(1, 1) },
      uCover:  { value: new THREE.Vector2(1, 1) },
    };
    const mat  = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const render = () => renderer.render(scene, camera);

    const updateCover = () => {
      const img = uniforms.uTex.value?.image as HTMLImageElement | undefined;
      if (!img || !img.width) return;
      const ia = img.width / img.height;
      const pa = wrap.clientWidth / wrap.clientHeight;
      uniforms.uCover.value.set(ia > pa ? pa / ia : 1, ia > pa ? 1 : ia / pa);
    };

    const tex = new THREE.TextureLoader().load(src, (t) => {
      t.minFilter = THREE.LinearFilter;
      uniforms.uTex.value = t;
      updateCover();
      render();
    });

    const resize = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      uniforms.uAspect.value.set(1, h / w);
      updateCover();
      render();
    };

    let raf = 0, hovering = false;
    const loop = () => {
      uniforms.uHover.value += ((hovering ? 1 : 0) - uniforms.uHover.value) * 0.1;
      render();
      if (hovering || uniforms.uHover.value > 0.01) {
        raf = requestAnimationFrame(loop);
      } else {
        uniforms.uHover.value = 0;
        render();
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      uniforms.uMouse.value.set(
        (e.clientX - r.left) / r.width,
        1 - (e.clientY - r.top) / r.height,
      );
    };
    const onEnter = () => { hovering = true; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); };
    const onLeave = () => { hovering = false; };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    wrap.addEventListener("pointermove",  onMove);
    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);
    resize();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove",  onMove);
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      geo.dispose(); mat.dispose(); tex.dispose(); renderer.dispose();
    };
  }, [src]);

  return (
    <div ref={wrapRef} style={{
      position: "relative", width: "100%", aspectRatio: "4 / 3",
      overflow: "hidden", background: "#0a0a0a",
    }}>
      {/* Fallback / shatter source / pre-WebGL paint */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
      }} />
      <canvas ref={canvasRef} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", display: "block",
      }} />
    </div>
  );
}
