"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FilmReelViewer } from "@/components/FilmReelViewer";
import { OpenTransition } from "@/components/ui/OpenTransition";
import { collectionToFrames, type Collection } from "@/lib/reel";

const MAT = "#F7F4EE";

gsap.registerPlugin(ScrollTrigger);

const COLLECTIONS: Collection[] = [
  {
    id: "barcelona",
    title: "Barcelona",
    country: "Spain",
    year: "2025",
    frames: "23",
    photos: [
      { src: "/images/spain/spain-01.jpg",  ratio: "4/3"  }, // city from above
      { src: "/images/spain/spain-03.jpg",  ratio: "3/4"  }, // Park Güell
       { src: "/images/spain/spain-06.webp",  ratio: "3/4"  }, // sunset over water
       { src: "/images/spain/spain-07.jpg",  ratio: "3/4"  }, // old city photos
       { src: "/images/spain/spain-08.jpg",  ratio: "3/4"  }, // city old map
      { src: "/images/spain/spain-09.webp",  ratio: "3/4"  }, // sunset over water
       { src: "/images/spain/spain-10.webp",  ratio: "4/3"  }, // sunset over water
      { src: "/images/spain/spain-11.webp",  ratio: "4/3"  }, // sunset over water
       { src: "/images/spain/spain-12.webp",  ratio: "3/4"  }, // sunset over water
      { src: "/images/spain/spain-14.webp",  ratio: "4/3"  }, // beach + cliffs
      { src: "/images/spain/spain-16.webp",  ratio: "3/4"  }, // sunset over water
        { src: "/images/spain/spain-19.webp",  ratio: "3/4"  }, // sunset over water
        { src: "/images/spain/spain-22.webp",  ratio: "3/4"  }, // sunset over water
        { src: "/images/spain/spain-24.jpg",  ratio: "3/4"  }, // harbour at night
        { src: "/images/spain/spain-28.jpg",  ratio: "3/4"  }, // Gothic portal
      { src: "/images/spain/spain-29.webp",  ratio: "3/4"  }, // Casa Batlló
      { src: "/images/spain/spain-30.jpg",  ratio: "3/4"  }, // Cathedral
      { src: "/images/spain/spain-33.jpg",  ratio: "4/3"  }, // ornate dome
      { src: "/images/spain/spain-34.jpg",  ratio: "3/4"  }, // Plaça Reial lamp
      { src: "/images/spain/spain-38.webp",  ratio: "4/3"  }, // Montjuïc palace lit
      { src: "/images/spain/spain-40.jpg",  ratio: "4/3"  }, // palm sunset
      { src: "/images/spain/spain-43.webp",  ratio: "4/3"  }, // sunset over water
      { src: "/images/spain/spain-44.webp",  ratio: "4/3"  }, // sunset over water
    ],
  },
  {
    id: "finland",
    title: "Finland",
    country: "Suomi",
    year: "2025 – present",
    frames: "18",
    photos: [
      { src: "/images/finland/finland-01.webp", ratio: "3/4"  },
      { src: "/images/finland/finland-02.webp", ratio: "4/3"  },
      { src: "/images/finland/finland-03.webp", ratio: "3/4"  },
      { src: "/images/finland/finland-04.jpg", ratio: "3/4"  },
      { src: "/images/finland/finland-06.webp", ratio: "16/9" },
      { src: "/images/finland/finland-07.webp", ratio: "2/3"  },
      { src: "/images/finland/finland-08.webp", ratio: "4/3"  },
      { src: "/images/finland/finland-09.webp", ratio: "4/3"  },
      { src: "/images/finland/finland-10.jpg", ratio: "3/4"  },
      { src: "/images/finland/finland-11.jpg", ratio: "4/3"  },
      { src: "/images/finland/finland-12.jpg", ratio: "4/3"  },
      { src: "/images/finland/finland-13.webp", ratio: "4/3"  },
      { src: "/images/finland/finland-14.webp", ratio: "4/3"  },
      { src: "/images/finland/finland-15.jpg", ratio: "3/4"  },
      { src: "/images/finland/finland-16.jpg", ratio: "3/4"  },
      { src: "/images/finland/finland-17.webp", ratio: "3/4"  },
      { src: "/images/finland/finland-18.webp", ratio: "4/3"  },
      { src: "/images/finland/finland-19.webp", ratio: "3/4"  },
    ],
  },
  {
    id: "india",
    title: "India",
    country: "Himachal Pradesh",
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
    year: "2020–24",
    frames: "12",
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
      { src: "/images/bml-life/bml-03.jpg", ratio: "3/4"  },
      { src: "/images/bml-life/bml-10.jpg", ratio: "3/4"  },
    ],
  },
];

const TAGS: Record<string, string[]> = {
  barcelona: ["Gaudí", "Gothic", "Coast"],
  finland:   ["Tampere", "Seasons", "Lakes"],
  india: ["Mountains", "Forest", "Altitude"],
  bml:       ["People", "Campus", "Friends"],
};

const DESCRIPTIONS: Record<string, string> = {
  barcelona: "The city never stops moving. Gaudí's bones bent into the skyline, the Gothic quarter folding in on itself, and the harbour going gold every evening while strangers walked through it like they owned the light.",
  finland:   "One city, every season. Tampere sits on the rapids between two lakes — green and loud in autumn, white and silent by January. You begin to understand why the Finns don't need to speak. The light here is low, long, and patient.",
  india: "The air thins and the noise drops away. Deodar forests, snow on the far peaks, a town stacked up a hillside. You drive through the night to get there and the mountains don't even notice you arrived.",
  bml:       "Four years at BML Munjal. The people more than the place — the late nights, the noise, the in-jokes you can't explain to anyone who wasn't there. Less composed than the rest of this, and that's the point.",
};

export function TripsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const frameRefs  = useRef<(HTMLDivElement | null)[]>([]);

  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
  const [pending, setPending] = useState<{ origin: { x: number; y: number }; col: Collection } | null>(null);

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

  // Phase 1 — press the framed print, then begin the staged transition
  const openFrom = (e: { clientX: number; clientY: number }, col: Collection, i: number) => {
    const fr = frameRefs.current[i];
    if (fr) gsap.to(fr, { scale: 0.985, duration: 0.14, ease: "power2.out" });
    setPending({ origin: { x: e.clientX, y: e.clientY }, col });
  };
  const openFromKey = (col: Collection, i: number) => {
    const r = frameRefs.current[i]?.getBoundingClientRect();
    openFrom({ clientX: r ? r.left + r.width / 2 : innerWidth / 2, clientY: r ? r.top + r.height / 2 : innerHeight / 2 }, col, i);
  };
  const closeViewer = () => {
    setActiveCollection(null);
    frameRefs.current.forEach(el => el && gsap.set(el, { clearProps: "transform" }));
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
          <h2 style={{
            margin: 0,
            fontSize: "clamp(1.8rem, 4vw, 3.5rem)", fontWeight: 500,
            letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--c-fg)",
          }}>
            Dispatches
          </h2>
          <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
            Locations · {COLLECTIONS.length.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Cards — framed prints */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "clamp(18px, 2.6vw, 40px)",
        }}>
          {COLLECTIONS.map((col, i) => (
            <div key={col.id} ref={el => { cardRefs.current[i] = el; }}>
              {/* The framed print (museum mat) */}
              <div
                ref={el => { frameRefs.current[i] = el; }}
                className="art-frame"
                onClick={e => openFrom(e, col, i)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openFromKey(col, i); }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${col.title} collection, ${col.frames} frames. Open`}
                data-cursor
                data-cursor-label="OPEN"
                style={{
                  background: MAT, borderRadius: "3px", cursor: "none",
                  padding: "7% 7% 0", willChange: "transform",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                }}
              >
                <div style={{ aspectRatio: "4 / 3", overflow: "hidden", background: "#e9e6df" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={col.photos[0].src} alt={col.title} loading="lazy"
                       style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                {/* Placard on the bottom mat */}
                <div style={{ padding: "7% 4% 9%", textAlign: "center" }}>
                  <div style={{
                    fontSize: "clamp(0.95rem, 1.6vw, 1.3rem)", fontWeight: 500,
                    letterSpacing: "0.02em", textTransform: "uppercase", color: "rgba(18,16,12,0.9)",
                  }}>
                    {col.title}
                  </div>
                  <div style={{
                    fontSize: "8px", letterSpacing: "0.26em", textTransform: "uppercase",
                    color: "rgba(18,16,12,0.5)", marginTop: "7px",
                  }}>
                    {col.country} · {col.year} · {col.frames} frames
                  </div>
                </div>
              </div>

              {/* Narrative below the frame */}
              <div style={{ padding: "1.1rem 0.25rem 0" }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "0.7rem", flexWrap: "wrap" }}>
                  {TAGS[col.id].map(tag => (
                    <span key={tag} style={{
                      fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "var(--c-fg-3)", border: "0.5px solid var(--c-border)", padding: "3px 8px",
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

      {/* Staged opening transition → then the reel emerges from the dark */}
      {pending && (
        <OpenTransition
          origin={pending.origin}
          onReveal={() => setActiveCollection(pending.col)}
          onDone={() => setPending(null)}
        />
      )}

      {/* Film-reel viewer — rich metadata (location · date · caption) */}
      {activeCollection && (
        <FilmReelViewer
          frames={collectionToFrames(activeCollection)}
          startIndex={0}
          variant="rich"
          collectionTitle={activeCollection.title}
          onClose={closeViewer}
        />
      )}
    </>
  );
}
