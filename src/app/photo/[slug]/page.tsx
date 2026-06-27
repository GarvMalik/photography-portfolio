"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

export default function PhotoPage() {
  const { slug }  = useParams<{ slug: string }>();
  const router    = useRouter();
  const frameRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("flipState");
    if (saved && frameRef.current) {
      const state = Flip.parseState(saved);
      Flip.from(state, { targets: frameRef.current, duration: 0.9, ease: "power3.inOut", absolute: true });
    } else {
      gsap.fromTo(frameRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
      );
    }
    sessionStorage.removeItem("flipState");
  }, []);

  const handleBack = () => {
    gsap.to(frameRef.current, {
      opacity: 0, scale: 0.97, duration: 0.45, ease: "power2.in",
      onComplete: () => router.back(),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center"
         style={{ background: "var(--c-bg)", zIndex: 50 }}>
      <div ref={frameRef}
           style={{ aspectRatio: "2/3", height: "88svh",
                    position: "relative", background: "var(--c-bg-3)" }}>
        {/* Phase 5: replace with <OGLDisplacementPlane src={photo.src} /> */}
        <div className="absolute inset-0 flex items-center justify-center caps tracked text-dimmest"
             style={{ fontSize: "10px" }}>
          {slug?.replace("-", " ").toUpperCase()}
        </div>
      </div>

      <button onClick={handleBack} data-cursor
              className="fixed top-6 right-6 caps tracked text-dimmer"
              style={{ fontSize: "10px", background: "none", border: "none",
                       padding: 0, letterSpacing: "0.22em" }}>
        ← BACK
      </button>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
          {slug?.replace("-", " ").toUpperCase()} — GM
        </span>
      </div>
    </div>
  );
}
