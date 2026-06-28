import { Nav } from "@/components/ui/Nav";
import { HeroSection } from "@/components/HeroSection";
import { MasonryGrid } from "@/components/MasonryGrid";
import { StatementSection } from "@/components/StatementSection";
import { SeriesSection } from "@/components/SeriesSection";
import { TripsSection } from "@/components/TripsSection";
import { StoriesSection } from "@/components/StoriesSection";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/ui/Marquee";
import { IntroReveal } from "@/components/IntroReveal";
import { PHOTOS } from "@/lib/photos";

export default function Home() {
  return (
    <main style={{ background: "var(--c-bg)", minHeight: "100svh" }}>
      <IntroReveal />
      <Nav />
      <HeroSection />
      <Marquee
        text="SELECTED WORKS — AURORA — BARCELONA — TAMPERE — HIMALAYAS — ARCHITECTURE — STREET — LANDSCAPE — "
      />
      <MasonryGrid photos={PHOTOS} />
      <StatementSection />
      <Marquee
        text="SHOT FOR THE LOVE OF IT — GARV MALIK — TAMPERE · FINLAND — FROST — GOLDEN HOUR — IN BLOOM — "
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
