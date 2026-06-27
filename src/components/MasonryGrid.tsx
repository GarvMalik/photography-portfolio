"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { ParticleBlast } from "@/components/ParticleBlast";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import type { Photo } from "@/lib/photos";

gsap.registerPlugin(ScrollTrigger, Flip);

const SPANS = [
  { col: "1 / 3", row: "1"     },
  { col: "3",     row: "1 / 3" },
  { col: "1",     row: "2"     },
  { col: "2",     row: "2"     },
  { col: "1 / 4", row: "3"     },
  { col: "1",     row: "4"     },
  { col: "2 / 4", row: "4"     },
] as const;

export function MasonryGrid({ photos }: { photos: Photo[] }) {
  const gridRef  = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const router   = useRouter();

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);
    if (!items.length) return;

    gsap.fromTo(items,
      { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
      {
        clipPath: "inset(0% 0% 0% 0%)", opacity: 1,
        duration: 1.1, stagger: 0.1, ease: "power4.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 75%" },
      }
    );
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const handleNavigate = (slug: string, i: number) => {
    const el = itemRefs.current[i];
    if (!el) return;
    const state = Flip.getState(el);
    sessionStorage.setItem("flipState", JSON.stringify(state));
    router.push(`/photo/${slug}`);
  };

  return (
    <section id="work" ref={gridRef}
             style={{
               padding: "0 var(--page-px) var(--page-px)",
               display: "grid",
               gridTemplateColumns: "1fr 1fr 1fr",
               gap: "var(--grid-gap)",
             }}>
      {photos.map((photo, i) => {
        const span = SPANS[i] ?? { col: "auto", row: "auto" };
        return (
          <div key={photo.slug}
               ref={el => { itemRefs.current[i] = el; }}
               style={{ gridColumn: span.col, gridRow: span.row,
                        position: "relative", overflow: "hidden" }}>
            <ParticleBlast onDoubleClick={() => handleNavigate(photo.slug, i)}>
              <PhotoPlaceholder
                ratio={photo.ratio}
                label={`${photo.label} — ${photo.type}`}
                sub={photo.series}
              />
            </ParticleBlast>
          </div>
        );
      })}
    </section>
  );
}
