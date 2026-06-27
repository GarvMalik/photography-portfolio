"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

gsap.registerPlugin(ScrollTrigger);

const TRIPS = [
  {
    id: "barcelona",
    city: "Barcelona",
    country: "Spain",
    year: "2024",
    frames: "34",
    tags: ["Street", "Architecture", "Light"],
    description: "The city never stops moving. Every alley an act, every shadow a stage. Gaudí's bones bent into skyline, and strangers walking through golden hour like they owned it.",
    ratio: "2/3" as const,
    accent: "#c4a882",
  },
  {
    id: "finland",
    city: "Finland",
    country: "Suomi",
    year: "2023–24",
    frames: "51",
    tags: ["Landscape", "Nature", "Winter"],
    description: "Six months of silence. The lake freezes over and the forest goes white and you begin to understand why the Finns don't need to speak. The light here is different — low, long, and patient.",
    ratio: "3/4" as const,
    accent: "#8ab3c8",
  },
  {
    id: "future",
    city: "Next",
    country: "Unknown",
    year: "2025 →",
    frames: "—",
    tags: ["TBD", "Open"],
    description: "The camera goes everywhere now. Next: Japan, Morocco, maybe Norway. Always looking for the picture that doesn't announce itself.",
    ratio: "1/1" as const,
    accent: "#888",
  },
];

export function TripsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

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

  return (
    <section ref={sectionRef} style={{
      borderTop: "0.5px solid var(--c-border)",
      padding: "clamp(3rem, 8vw, 7rem) var(--page-px)",
    }}>
      {/* Header */}
      <div ref={headRef} style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: "clamp(2rem, 5vw, 4rem)",
        borderBottom: "0.5px solid var(--c-border)",
        paddingBottom: "1.25rem",
      }}>
        <span style={{
          fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
          fontWeight: 500,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          color: "var(--c-fg)",
        }}>
          Dispatches
        </span>
        <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
          Locations · {TRIPS.length.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
        gap: "var(--grid-gap)",
      }}>
        {TRIPS.map((trip, i) => (
          <div
            key={trip.id}
            ref={el => { cardRefs.current[i] = el; }}
            data-cursor
            data-cursor-label={trip.city.toUpperCase()}
            style={{
              position: "relative",
              cursor: "none",
              background: "var(--c-fg-4)",
            }}
          >
            {/* Photo */}
            <div style={{ position: "relative" }}>
              <PhotoPlaceholder ratio={trip.ratio} />
              {/* Location badge */}
              <div style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}>
                <span style={{
                  fontSize: "clamp(1.1rem, 3vw, 2rem)",
                  fontWeight: 500,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  textShadow: "0 1px 8px rgba(0,0,0,0.6)",
                }}>
                  {trip.city}
                </span>
                <span style={{
                  fontSize: "8px",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.55)",
                  textTransform: "uppercase",
                }}>
                  {trip.country} · {trip.year}
                </span>
              </div>
              {/* Frame count */}
              <span style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                fontSize: "8px",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
              }}>
                {trip.frames} frames
              </span>
            </div>

            {/* Text */}
            <div style={{ padding: "1.25rem 1rem 1.5rem" }}>
              {/* Tags */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                {trip.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: "8px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--c-fg-3)",
                    border: "0.5px solid var(--c-border)",
                    padding: "3px 8px",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <p style={{
                margin: 0,
                fontSize: "clamp(11px, 1.2vw, 13px)",
                lineHeight: 1.7,
                color: "var(--c-fg-2)",
                fontStyle: "italic",
              }}>
                {trip.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
