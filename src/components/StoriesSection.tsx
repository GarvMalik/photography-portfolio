"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

gsap.registerPlugin(ScrollTrigger);

const STORIES = [
  {
    n: "001",
    title: "The Hour Before Dark",
    location: "Tampere, Finland",
    year: "2024",
    type: "Street",
    body: "It's the forty minutes just before the street lamps kick in. The sky is still holding onto blue. People walk faster. A woman stops to adjust her scarf and in that pause — that single, unhurried pause — the whole city seems to hold its breath with her. I pressed the shutter without thinking.",
    ratio: "2/3" as const,
  },
  {
    n: "002",
    title: "Geometry of Ramblas",
    location: "Barcelona, Spain",
    year: "2024",
    type: "Architecture",
    body: "Gaudí didn't build buildings. He built arguments. Every curve is a rebuttal to the straight line, every tile a sentence in a language the walls are still speaking. I kept shooting the negative space — what he chose not to fill.",
    ratio: "3/4" as const,
  },
  {
    n: "003",
    title: "Ice Season",
    location: "Pyynikki, Finland",
    year: "2023",
    type: "Landscape",
    body: "By January the lake is solid enough to walk on. The Finns do this without ceremony — they walk on frozen water like it's nothing. I couldn't. I kept stopping, listening to it creak, convinced I was about to fall through into something ancient.",
    ratio: "16/9" as const,
  },
];

export function StoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const storyRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.fromTo(headRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
    );

    storyRefs.current.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.1, delay: i * 0.15, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 85%" } }
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
        marginBottom: "clamp(2.5rem, 6vw, 5rem)",
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
          Stories
        </span>
        <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
          Field notes
        </span>
      </div>

      {/* Stories */}
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(3rem, 8vw, 6rem)" }}>
        {STORIES.map((story, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={story.n}
              ref={el => { storyRefs.current[i] = el; }}
              style={{
                display: "grid",
                gridTemplateColumns: isEven ? "1fr 1.1fr" : "1.1fr 1fr",
                gap: "clamp(1.5rem, 4vw, 4rem)",
                alignItems: "start",
              }}
            >
              {/* Photo — left on even, right on odd */}
              {isEven && (
                <div style={{ position: "relative" }}>
                  <PhotoPlaceholder ratio={story.ratio} />
                  <span style={{
                    position: "absolute", top: "10px", left: "10px",
                    fontSize: "8px", letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                  }}>
                    {story.n}
                  </span>
                </div>
              )}

              {/* Text */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: isEven ? "0 0 0 clamp(1rem, 3vw, 3rem)" : "0 clamp(1rem, 3vw, 3rem) 0 0",
              }}>
                {/* Meta row */}
                <div style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                }}>
                  <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>
                    {story.type}
                  </span>
                  <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>
                    {story.location}
                  </span>
                  <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>
                    {story.year}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  margin: "0 0 1.25rem",
                  fontSize: "clamp(1.4rem, 3vw, 2.8rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: "var(--c-fg)",
                  lineHeight: 1.05,
                }}>
                  {story.title}
                </h3>

                {/* Rule */}
                <div style={{
                  height: "0.5px",
                  background: "var(--c-border)",
                  marginBottom: "1.25rem",
                }} />

                {/* Body */}
                <p style={{
                  margin: 0,
                  fontSize: "clamp(12px, 1.3vw, 14px)",
                  lineHeight: 1.8,
                  color: "var(--c-fg-2)",
                  fontStyle: "italic",
                  maxWidth: "46ch",
                }}>
                  {story.body}
                </p>
              </div>

              {/* Photo — right on odd */}
              {!isEven && (
                <div style={{ position: "relative" }}>
                  <PhotoPlaceholder ratio={story.ratio} />
                  <span style={{
                    position: "absolute", top: "10px", left: "10px",
                    fontSize: "8px", letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                  }}>
                    {story.n}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
