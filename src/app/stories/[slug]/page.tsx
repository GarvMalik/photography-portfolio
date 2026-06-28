"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/Footer";
import { Lightbox, type LightboxState } from "@/components/ui/Lightbox";
import { getStory } from "@/lib/stories";

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const story = getStory(slug);
  const [lb, setLb] = useState<LightboxState | null>(null);

  const openImage = (e: React.MouseEvent<HTMLElement>, src: string, caption: string) => {
    const img = e.currentTarget.querySelector("img") ?? e.currentTarget;
    setLb({ src, caption, rect: img.getBoundingClientRect() });
  };

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

      <article style={{ padding: "clamp(7rem, 16vh, 11rem) var(--page-px) clamp(3rem, 6vw, 5rem)", maxWidth: "820px", margin: "0 auto" }}>
        <Link href="/stories" className="story-link" data-cursor data-cursor-label="ARCHIVE"
              style={{ marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          All stories
        </Link>

        <div style={{ display: "flex", gap: "1.5rem", margin: "1.5rem 0 1.25rem" }}>
          <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>{story.type}</span>
          <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>{story.location}</span>
          <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>{story.year}</span>
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

      <Footer />
      {lb && <Lightbox state={lb} onClose={() => setLb(null)} />}
    </main>
  );
}
