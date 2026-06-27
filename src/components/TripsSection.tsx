"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { CollectionOverlay, type Collection } from "@/components/CollectionOverlay";
import { shatter } from "@/lib/shatter";

gsap.registerPlugin(ScrollTrigger);

const COLLECTIONS: Collection[] = [
  {
    id: "barcelona",
    title: "Barcelona",
    country: "Spain",
    year: "2024",
    frames: "43",
    photos: [
      { src: "/images/spain/spain-03.jpg",  ratio: "3/4"  },
      { src: "/images/spain/spain-07.jpg",  ratio: "2/3"  },
      { src: "/images/spain/spain-11.jpg",  ratio: "4/3"  },
      { src: "/images/spain/spain-16.jpg",  ratio: "3/4"  },
      { src: "/images/spain/spain-18.jpg",  ratio: "3/4"  },
      { src: "/images/spain/spain-22.jpg",  ratio: "4/3"  },
      { src: "/images/spain/spain-24.jpg",  ratio: "3/4"  },
      { src: "/images/spain/spain-05.jpg",  ratio: "3/4"  },
      { src: "/images/spain/spain-31.jpg",  ratio: "4/3"  },
      { src: "/images/spain/spain-36.jpg",  ratio: "4/3"  },
      { src: "/images/spain/spain-39.jpg",  ratio: "3/4"  },
      { src: "/images/spain/spain-43.jpg",  ratio: "4/3"  },
    ],
  },
  {
    id: "finland",
    title: "Finland",
    country: "Suomi",
    year: "2023–24",
    frames: "16",
    photos: [
      { src: "/images/finland/finland-01.jpg", ratio: "4/3"  },
      { src: "/images/finland/finland-02.jpg", ratio: "4/3"  },
      { src: "/images/finland/finland-03.jpg", ratio: "3/4"  },
      { src: "/images/finland/finland-04.jpg", ratio: "3/4"  },
      { src: "/images/finland/finland-05.jpg", ratio: "4/3"  },
      { src: "/images/finland/finland-06.jpg", ratio: "16/9" },
      { src: "/images/finland/finland-07.jpg", ratio: "2/3"  },
      { src: "/images/finland/finland-08.jpg", ratio: "4/3"  },
      { src: "/images/finland/finland-09.jpg", ratio: "4/3"  },
      { src: "/images/finland/finland-10.jpg", ratio: "3/4"  },
      { src: "/images/finland/finland-11.jpg", ratio: "4/3"  },
      { src: "/images/finland/finland-12.jpg", ratio: "4/3"  },
      { src: "/images/finland/finland-13.jpg", ratio: "4/3"  },
      { src: "/images/finland/finland-14.jpg", ratio: "4/3"  },
      { src: "/images/finland/finland-15.jpg", ratio: "3/4"  },
      { src: "/images/finland/finland-16.jpg", ratio: "3/4"  },
    ],
  },
  {
    id: "india",
    title: "India",
    country: "India",
    year: "2023",
    frames: "13",
    photos: [
      { src: "/images/india/india-01.jpg", ratio: "4/3"  },
      { src: "/images/india/india-02.jpg", ratio: "4/3"  },
      { src: "/images/india/india-03.jpg", ratio: "4/3"  },
      { src: "/images/india/india-04.jpg", ratio: "4/3"  },
      { src: "/images/india/india-05.jpg", ratio: "4/3"  },
      { src: "/images/india/india-06.jpg", ratio: "4/3"  },
      { src: "/images/india/india-07.jpg", ratio: "4/3"  },
      { src: "/images/india/india-08.jpg", ratio: "2/3"  },
      { src: "/images/india/india-09.jpg", ratio: "4/3"  },
      { src: "/images/india/india-10.jpg", ratio: "4/3"  },
      { src: "/images/india/india-11.jpg", ratio: "4/3"  },
      { src: "/images/india/india-12.jpg", ratio: "4/3"  },
      { src: "/images/india/india-13.jpg", ratio: "4/3"  },
    ],
  },
];

const TAGS: Record<string, string[]> = {
  barcelona: ["Street", "Architecture", "Light"],
  finland:   ["Landscape", "Nature", "Winter"],
  india:     ["Colour", "Culture", "Heat"],
};

const DESCRIPTIONS: Record<string, string> = {
  barcelona: "The city never stops moving. Every alley an act, every shadow a stage. Gaudí's bones bent into skyline, and strangers walking through golden hour like they owned it.",
  finland:   "Six months of silence. The lake freezes over and the forest goes white and you begin to understand why the Finns don't need to speak. The light here is different — low, long, and patient.",
  india:     "Colour that hits you before sound does. Dust and marigolds and a sun that stays too long. Every frame already full before you press the shutter.",
};

export function TripsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs  = useRef<(HTMLDivElement | null)[]>([]);

  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);

  useEffect(() => {
    gsap.fromTo(headRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" } }
    );
    cardRefs.current.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.0, delay: i * 0.12, ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%" } }
      );
    });
  }, []);

  const handleCardClick = (col: Collection, idx: number) => {
    const photoEl = photoRefs.current[idx];
    if (!photoEl) { setActiveCollection(col); return; }

    shatter(photoEl, () => setActiveCollection(col));
  };

  return (
    <>
      <section ref={sectionRef} style={{
        borderTop: "0.5px solid var(--c-border)",
        padding: "clamp(3rem, 8vw, 7rem) var(--page-px)",
      }}>
        {/* Header */}
        <div ref={headRef} style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          marginBottom: "clamp(2rem, 5vw, 4rem)",
          borderBottom: "0.5px solid var(--c-border)", paddingBottom: "1.25rem",
        }}>
          <span style={{
            fontSize: "clamp(1.8rem, 4vw, 3.5rem)", fontWeight: 500,
            letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--c-fg)",
          }}>
            Dispatches
          </span>
          <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
            Locations · {COLLECTIONS.length.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "var(--grid-gap)",
        }}>
          {COLLECTIONS.map((col, i) => (
            <div
              key={col.id}
              ref={el => { cardRefs.current[i] = el; }}
              onClick={() => handleCardClick(col, i)}
              data-cursor
              data-cursor-label="OPEN"
              style={{ cursor: "none", background: "var(--c-fg-4)" }}
            >
              {/* Photo with shatter source */}
              <div
                ref={el => { photoRefs.current[i] = el; }}
                style={{ position: "relative" }}
              >
                <PhotoPlaceholder ratio={col.photos[0].ratio} src={col.photos[0].src} />

                {/* Location badge */}
                <div style={{
                  position: "absolute", top: "12px", left: "12px",
                }}>
                  <span style={{
                    fontSize: "clamp(1.1rem, 3vw, 2rem)", fontWeight: 500,
                    color: "#fff", letterSpacing: "-0.02em", textTransform: "uppercase",
                    lineHeight: 1, textShadow: "0 1px 8px rgba(0,0,0,0.6)",
                    display: "block",
                  }}>
                    {col.title}
                  </span>
                  <span style={{
                    fontSize: "8px", letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.55)", textTransform: "uppercase",
                    display: "block", marginTop: "3px",
                  }}>
                    {col.country} · {col.year}
                  </span>
                </div>

                {/* Frame count */}
                <span style={{
                  position: "absolute", bottom: "10px", right: "10px",
                  fontSize: "8px", letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
                }}>
                  {col.frames} frames
                </span>

                {/* Tap hint */}
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.3s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                >
                  <span style={{
                    fontSize: "9px", letterSpacing: "0.28em",
                    color: "#fff", textTransform: "uppercase",
                    border: "0.5px solid rgba(255,255,255,0.4)",
                    padding: "8px 16px",
                    background: "rgba(0,0,0,0.3)",
                  }}>
                    Open Collection
                  </span>
                </div>
              </div>

              {/* Text */}
              <div style={{ padding: "1.25rem 1rem 1.5rem" }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                  {TAGS[col.id].map(tag => (
                    <span key={tag} style={{
                      fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "var(--c-fg-3)", border: "0.5px solid var(--c-border)",
                      padding: "3px 8px",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p style={{
                  margin: 0, fontSize: "clamp(11px, 1.2vw, 13px)",
                  lineHeight: 1.7, color: "var(--c-fg-2)", fontStyle: "italic",
                }}>
                  {DESCRIPTIONS[col.id]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collection overlay */}
      {activeCollection && (
        <CollectionOverlay
          collection={activeCollection}
          onClose={() => setActiveCollection(null)}
        />
      )}
    </>
  );
}
