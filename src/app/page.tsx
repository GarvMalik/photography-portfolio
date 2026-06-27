import { Nav } from "@/components/ui/Nav";
import { HeroSection } from "@/components/HeroSection";
import { MasonryGrid } from "@/components/MasonryGrid";
import { StatementSection } from "@/components/StatementSection";
import { SeriesSection } from "@/components/SeriesSection";
import { TripsSection } from "@/components/TripsSection";
import { StoriesSection } from "@/components/StoriesSection";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/ui/Marquee";
import { Preloader } from "@/components/Preloader";
import { PHOTOS } from "@/lib/photos";

export default function Home() {
  return (
    <main style={{ background: "var(--c-bg)", minHeight: "100svh" }}>
      <Preloader />
      <Nav />
      <HeroSection />
      <Marquee
        text="SELECTED WORKS — PHOTOGRAPHY — GARV MALIK — 2024 — ARCHITECTURE — STREET — LANDSCAPE — FIGURE — "
      />
      <MasonryGrid photos={PHOTOS} />
      <StatementSection />
      <Marquee
        text="AVAILABLE FOR COMMISSIONS — GARV MALIK — TAMPERE — FINLAND — OPEN TO PROJECTS — "
        direction="right"
        speed="slow"
      />
      <StoriesSection />
      <TripsSection />
      <SeriesSection />
      <Footer />
    </main>
  );
}
