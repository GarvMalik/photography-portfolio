"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PhotoPage() {
  const { slug }  = useParams<{ slug: string }>();
  const router    = useRouter();
  const frameRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cinematic entrance — scales up from slightly below center
    // Full GSAP FLIP cross-route transition wired in Phase 6
    gsap.fromTo(frameRef.current,
      { opacity: 0, scale: 0.94, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: "power4.out" }
    );
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
