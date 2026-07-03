"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/Footer";
import { Lightbox, type LightboxState } from "@/components/ui/Lightbox";
import { getStory, STORIES } from "@/lib/stories";

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const story = getStory(slug);
  const [lb, setLb] = useState<LightboxState | null>(null);

  const openImage = (e: React.MouseEvent<HTMLElement>, src: string, caption: string) => {
    const img = e.currentTarget.querySelector("img") ?? e.currentTarget;
    setLb({ src, caption, rect: img.getBoundingClientRect() });
  };

  const storyIndex = STORIES.findIndex(s => s.slug === slug);
  const prevStory  = STORIES[storyIndex + 1] ?? null; // STORIES is newest-first
  const nextStory  = STORIES[storyIndex - 1] ?? null;
  const readTime   = story ? Math.max(1, Math.round(story.body.join(" ").split(/\s+/).length / 200)) : 1;

  if (!story) {
    return (
      <main style={{ background: "var(--c-bg)", minHeight: "100svh" }}>
        <Nav />
        <div style={{ minHeight: "100svh", display: "grid", placeItems: "center", gap: "1.5rem" }}>
          <span className="caps tracked text-dimmer" style={{ fontSize: "11px" }}>Story not found</span>
          <Link href="/stories" className="story-link" data-cursor data-cursor-label="ARCHIVE">All stories</Link>
        </div>
      </main>
    );
  }

  const ClickableImg = ({ src, caption }: { src: string; caption: string }) => (
    <button
      onClick={e => openImage(e, src, caption)}
      data-cursor data-cursor-label="EXPAND"
      aria-label={`Expand ${caption}`}
      style={{ display: "block", width: "100%", padding: 0, border: "none", background: "none", cursor: "none", margin: "clamp(2rem, 5vw, 4rem) 0" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={caption} loading="lazy"
           style={{ width: "100%", height: "auto", display: "block", background: "#0a0a0a" }} />
    </button>
  );

  return (
    <main style={{ background: "var(--c-bg)", minHeight: "100svh" }}>
      <Nav />

      {/* Fixed back button — always visible regardless of scroll position */}
      <Link
        href="/stories"
        data-cursor
        aria-label="Back to all stories"
        style={{
          position: "fixed",
          top: "18px",
          left: "var(--page-px)",
          zIndex: 110,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5em",
          fontSize: "9.5px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#fff",
          textDecoration: "none",
          mixBlendMode: "difference",
          padding: "10px 0",
        }}
      >
        <span style={{ fontSize: "1.1em", transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)", display: "inline-block" }}
              className="back-arrow">←</span>
        Stories
      </Link>

      <article style={{ padding: "clamp(7rem, 16vh, 11rem) var(--page-px) clamp(3rem, 6vw, 5rem)", maxWidth: "820px", margin: "0 auto" }}>

        <div style={{ display: "flex", gap: "1.5rem", margin: "1.5rem 0 1.25rem", flexWrap: "wrap" }}>
          <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>{story.type}</span>
          <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>{story.location}</span>
          <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>{story.year}</span>
          <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>{readTime} min read</span>
        </div>

        <h1 style={{
          margin: "0 0 clamp(2rem, 5vw, 3rem)", fontSize: "clamp(2rem, 6vw, 4rem)", fontWeight: 500,
          letterSpacing: "-0.03em", textTransform: "uppercase", color: "var(--c-fg)", lineHeight: 1.0,
        }}>
          {story.title}
        </h1>

        {/* Cover */}
        <ClickableImg src={story.images[0]} caption={`${story.title} — ${story.location}`} />

        {/* Body + embedded images interleaved */}
        {story.body.map((para, i) => (
          <div key={i}>
            <p style={{
              margin: "0 0 1.5rem", fontSize: "clamp(14px, 1.5vw, 17px)", lineHeight: 1.85,
              color: "var(--c-fg-2)", maxWidth: "62ch",
            }}>
              {para}
            </p>
            {story.images[i + 1] && (
              <ClickableImg src={story.images[i + 1]} caption={`${story.title} — ${story.location}`} />
            )}
          </div>
        ))}

        {/* Any remaining images */}
        {story.images.slice(story.body.length + 1).map((src, i) => (
          <ClickableImg key={i} src={src} caption={`${story.title} — ${story.location}`} />
        ))}
      </article>

      {/* Next / Prev story navigation */}
      {(prevStory || nextStory) && (
        <nav style={{
          borderTop: "0.5px solid var(--c-border)",
          display: "grid",
          gridTemplateColumns: prevStory && nextStory ? "1fr 1fr" : "1fr",
          maxWidth: "820px", margin: "0 auto",
          padding: "0 var(--page-px)",
        }}>
          {prevStory && (
            <Link href={`/stories/${prevStory.slug}`} data-cursor style={{
              textDecoration: "none", padding: "2rem 0", borderRight: nextStory ? "0.5px solid var(--c-border)" : "none",
            }}>
              <div className="caps tracked text-dimmest" style={{ fontSize: "8px", marginBottom: "0.6rem" }}>← Previous</div>
              <div style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)", fontWeight: 500, letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--c-fg)" }}>
                {prevStory.title}
              </div>
            </Link>
          )}
          {nextStory && (
            <Link href={`/stories/${nextStory.slug}`} data-cursor style={{
              textDecoration: "none", padding: "2rem 0", paddingLeft: prevStory ? "2rem" : 0, textAlign: prevStory ? "right" : "left",
            }}>
              <div className="caps tracked text-dimmest" style={{ fontSize: "8px", marginBottom: "0.6rem" }}>Next →</div>
              <div style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)", fontWeight: 500, letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--c-fg)" }}>
                {nextStory.title}
              </div>
            </Link>
          )}
        </nav>
      )}

      <Footer />
      {lb && <Lightbox state={lb} onClose={() => setLb(null)} />}
    </main>
  );
}
