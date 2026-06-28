import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/Footer";
import { STORIES } from "@/lib/stories";

export const metadata: Metadata = {
  title: "Stories",
  description: "Field notes — short stories from behind the photographs.",
};

export default function StoriesArchive() {
  return (
    <main style={{ background: "var(--c-bg)", minHeight: "100svh" }}>
      <Nav />

      <section style={{ padding: "clamp(7rem, 16vh, 11rem) var(--page-px) clamp(3rem, 7vw, 6rem)" }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          borderBottom: "0.5px solid var(--c-border)", paddingBottom: "1.5rem", marginBottom: "clamp(2.5rem, 6vw, 4.5rem)",
        }}>
          <div>
            <span className="caps tracked text-dimmest" style={{ fontSize: "9px", display: "block", marginBottom: "0.75rem" }}>
              Field notes · Archive
            </span>
            <h1 style={{
              margin: 0, fontSize: "clamp(2.4rem, 8vw, 6rem)", fontWeight: 500,
              letterSpacing: "-0.03em", textTransform: "uppercase", color: "var(--c-fg)", lineHeight: 0.95,
            }}>
              Stories
            </h1>
          </div>
          <span className="caps tracked text-dimmest" style={{ fontSize: "9px" }}>
            {STORIES.length.toString().padStart(2, "0")} entries
          </span>
        </div>

        {/* Editorial grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
          gap: "clamp(2rem, 4vw, 3.5rem)",
        }}>
          {STORIES.map(story => (
            <Link key={story.slug} href={`/stories/${story.slug}`} data-cursor data-cursor-label="READ"
                  style={{ textDecoration: "none", cursor: "none", display: "block" }}>
              <div style={{ aspectRatio: "4 / 3", overflow: "hidden", background: "#0a0a0a", marginBottom: "1.25rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={story.src} alt={story.title} loading="lazy"
                     style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ display: "flex", gap: "1.25rem", marginBottom: "0.75rem" }}>
                <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>{story.n}</span>
                <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>{story.type}</span>
                <span className="caps tracked text-dimmest" style={{ fontSize: "8px" }}>{story.year}</span>
              </div>
              <h2 style={{
                margin: "0 0 0.75rem", fontSize: "clamp(1.2rem, 2.2vw, 1.7rem)", fontWeight: 500,
                letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--c-fg)", lineHeight: 1.1,
              }}>
                {story.title}
              </h2>
              <p style={{
                margin: 0, fontSize: "13px", lineHeight: 1.7, color: "var(--c-fg-2)",
                fontStyle: "italic", maxWidth: "44ch",
              }}>
                {story.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
