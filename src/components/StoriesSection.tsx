"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lightbox, type LightboxState } from "@/components/ui/Lightbox";
import { STORIES } from "@/lib/stories";

gsap.registerPlugin(ScrollTrigger);

const LATEST = STORIES.slice(0, 3); // homepage shows only the newest three

export function StoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const storyRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const [lb, setLb] = useState<LightboxState | null>(null);

  useEffect(() => {
    gsap.fromTo(headRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
    );
    storyRefs.current.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 85%" } }
      );
    });
  }, []);

  const openImage = (e: React.MouseEvent<HTMLElement>, src: string, caption: string) => {
    const img = e.currentTarget.querySelector("img") ?? e.currentTarget;
    setLb({ src, caption, rect: img.getBoundingClientRect() });
  };

  return (
    <section id="stories" ref={sectionRef} style={{
      borderTop: "0.5px solid var(--c-border)",
      padding: "clamp(3rem, 8vw, 7rem) var(--page-px)",
    }}>
      {/* Header */}
      <div ref={headRef} style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        marginBottom: "clamp(2.5rem, 6vw, 5rem)",
        borderBottom: "0.5px solid var(--c-border)", paddingBottom: "1.25rem",
      }}>
        <h2 style={{
          margin: 0, fontSize: "clamp(1.8rem, 4vw, 3.5rem)", fontWeight: 500,
          letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--c-fg)",
        }}>
          Stories
        </h2>
        <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>Field notes</span>
      </div>

      {/* Stories */}
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(3rem, 8vw, 6rem)" }}>
        {LATEST.map((story, i) => {
          const isEven = i % 2 === 0;
          const photo = (
            <button
              onClick={e => openImage(e, story.src, `${story.title} — ${story.location}`)}
              data-cursor data-cursor-label="EXPAND"
              aria-label={`Expand ${story.title}`}
              style={{ position: "relative", padding: 0, border: "none", background: "none", cursor: "none", display: "block", width: "100%" }}
            >
              <div style={{ aspectRatio: story.ratio, overflow: "hidden", background: "#0a0a0a" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={story.src} alt={story.title} loading="lazy"
                     style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <span style={{
                position: "absolute", top: "10px", left: "10px",
                fontSize: "8px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase", textShadow: "0 1px 6px rgba(0,0,0,0.6)",
              }}>
                {story.n}
              </span>
            </button>
          );

          return (
            <div key={story.slug}
                 ref={el => { storyRefs.current[i] = el; }}
                 style={{
                   display: "grid",
                   gridTemplateColumns: isEven ? "1fr 1.1fr" : "1.1fr 1fr",
                   gap: "clamp(1.5rem, 4vw, 4rem)", alignItems: "start",
                 }}>
              {isEven && photo}

              <div style={{
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: isEven ? "0 0 0 clamp(1rem, 3vw, 3rem)" : "0 clamp(1rem, 3vw, 3rem) 0 0",
              }}>
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "1.25rem" }}>
                  <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>{story.type}</span>
                  <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>{story.location}</span>
                  <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>{story.year}</span>
                </div>

                <Link href={`/stories/${story.slug}`} data-cursor data-cursor-label="READ" style={{ textDecoration: "none" }}>
                  <h3 style={{
                    margin: "0 0 1.25rem", fontSize: "clamp(1.4rem, 3vw, 2.8rem)", fontWeight: 500,
                    letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--c-fg)", lineHeight: 1.05,
                  }}>
                    {story.title}
                  </h3>
                </Link>

                <div style={{ height: "0.5px", background: "var(--c-border)", marginBottom: "1.25rem" }} />

                <p style={{
                  margin: 0, fontSize: "clamp(12px, 1.3vw, 14px)", lineHeight: 1.8,
                  color: "var(--c-fg-2)", fontStyle: "italic", maxWidth: "46ch",
                }}>
                  {story.body[0]}
                </p>

                <Link href={`/stories/${story.slug}`} data-cursor data-cursor-label="READ"
                      className="story-link"
                      style={{ marginTop: "1.5rem", alignSelf: "flex-start" }}>
                  Read story
                </Link>
              </div>

              {!isEven && photo}
            </div>
          );
        })}
      </div>

      {/* CTA — view the full archive */}
      <div style={{
        marginTop: "clamp(3rem, 7vw, 6rem)", paddingTop: "1.5rem",
        borderTop: "0.5px solid var(--c-border)",
        display: "flex", justifyContent: "center",
      }}>
        <Link href="/stories" data-cursor data-cursor-label="ARCHIVE" className="story-link" style={{ fontSize: "clamp(13px, 1.6vw, 16px)" }}>
          View all stories
        </Link>
      </div>

      {lb && <Lightbox state={lb} onClose={() => setLb(null)} />}
    </section>
  );
}
