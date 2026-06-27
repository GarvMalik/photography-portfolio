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
      { src: "/images/spain/spain-01.jpg",  ratio: "4/3"  }, // city from above
      { src: "/images/spain/spain-03.jpg",  ratio: "3/4"  }, // Park Güell
      { src: "/images/spain/spain-29.jpg",  ratio: "3/4"  }, // Casa Batlló
      { src: "/images/spain/spain-30.jpg",  ratio: "3/4"  }, // Cathedral
      { src: "/images/spain/spain-28.jpg",  ratio: "3/4"  }, // Gothic portal
      { src: "/images/spain/spain-33.jpg",  ratio: "4/3"  }, // ornate dome
      { src: "/images/spain/spain-34.jpg",  ratio: "3/4"  }, // Plaça Reial lamp
      { src: "/images/spain/spain-14.jpg",  ratio: "4/3"  }, // beach + cliffs
      { src: "/images/spain/spain-24.jpg",  ratio: "3/4"  }, // harbour at night
      { src: "/images/spain/spain-38.jpg",  ratio: "4/3"  }, // Montjuïc palace lit
      { src: "/images/spain/spain-40.jpg",  ratio: "4/3"  }, // palm sunset
      { src: "/images/spain/spain-43.jpg",  ratio: "4/3"  }, // sunset over water
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
    id: "himalayas",
    title: "Himalayas",
    country: "India",
    year: "2023",
    frames: "13",
    photos: [
      { src: "/images/india/india-04.jpg", ratio: "4/3"  }, // mountain ridge
      { src: "/images/india/india-02.jpg", ratio: "4/3"  }, // barren valley
      { src: "/images/india/india-03.jpg", ratio: "4/3"  }, // rock crag
      { src: "/images/india/india-08.jpg", ratio: "2/3"  }, // hill town + snow peaks
      { src: "/images/india/india-01.jpg", ratio: "4/3"  }, // green hills
      { src: "/images/india/india-09.jpg", ratio: "4/3"  }, // deodar forest
      { src: "/images/india/india-10.jpg", ratio: "4/3"  }, // forested valley
      { src: "/images/india/india-05.jpg", ratio: "4/3"  }, // heritage interior
      { src: "/images/india/india-07.jpg", ratio: "4/3"  }, // sunflower
      { src: "/images/india/india-11.jpg", ratio: "4/3"  }, // full moon
      { src: "/images/india/india-12.jpg", ratio: "4/3"  }, // night road
      { src: "/images/india/india-13.jpg", ratio: "4/3"  }, // night travel
    ],
  },
  {
    id: "bml",
    title: "BML Munjal",
    country: "Gurgaon, India",
    year: "2019–23",
    frames: "14",
    photos: [
      { src: "/images/bml-life/bml-11.jpg", ratio: "3/4"  },
      { src: "/images/bml-life/bml-13.jpg", ratio: "4/3"  },
      { src: "/images/bml-life/bml-05.jpg", ratio: "3/4"  },
      { src: "/images/bml-life/bml-02.jpg", ratio: "3/4"  },
      { src: "/images/bml-life/bml-01.jpg", ratio: "3/4"  },
      { src: "/images/bml-life/bml-08.jpg", ratio: "3/4"  },
      { src: "/images/bml-life/bml-12.jpg", ratio: "3/4"  },
      { src: "/images/bml-life/bml-09.jpg", ratio: "4/3"  },
      { src: "/images/bml-life/bml-04.jpg", ratio: "3/4"  },
      { src: "/images/bml-life/bml-07.jpg", ratio: "3/4"  },
      { src: "/images/bml-life/bml-06.jpg", ratio: "3/4"  },
      { src: "/images/bml-life/bml-14.jpg", ratio: "3/4"  },
      { src: "/images/bml-life/bml-03.jpg", ratio: "3/4"  },
      { src: "/images/bml-life/bml-10.jpg", ratio: "3/4"  },
    ],
  },
];

const TAGS: Record<string, string[]> = {
  barcelona: ["Gaudí", "Gothic", "Coast"],
  finland:   ["Tampere", "Seasons", "Lakes"],
  himalayas: ["Mountains", "Forest", "Altitude"],
  bml:       ["People", "Campus", "Friends"],
};

const DESCRIPTIONS: Record<string, string> = {
  barcelona: "The city never stops moving. Gaudí's bones bent into the skyline, the Gothic quarter folding in on itself, and the harbour going gold every evening while strangers walked through it like they owned the light.",
  finland:   "One city, every season. Tampere sits on the rapids between two lakes — green and loud in autumn, white and silent by January. You begin to understand why the Finns don't need to speak. The light here is low, long, and patient.",
  himalayas: "The air thins and the noise drops away. Deodar forests, snow on the far peaks, a town stacked up a hillside. You drive through the night to get there and the mountains don't even notice you arrived.",
  bml:       "Four years at BML Munjal. The people more than the place — the late nights, the noise, the in-jokes you can't explain to anyone who wasn't there. Less composed than the rest of this, and that's the point.",
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
      <section id="dispatches" ref={sectionRef} style={{
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
