import { Nav } from "@/components/ui/Nav";
import { HeroSection } from "@/components/HeroSection";
import { MasonryGrid } from "@/components/MasonryGrid";
import { PHOTOS } from "@/lib/photos";

export default function Home() {
  return (
    <main style={{ background: "var(--c-bg)", minHeight: "100svh" }}>
      <Nav />
      <HeroSection />
      <MasonryGrid photos={PHOTOS} />
    </main>
  );
}
