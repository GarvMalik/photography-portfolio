// Shared types + helpers for the unified film-reel gallery.

export interface ReelFrame {
  src:       string;
  title?:    string;   // primary label
  type?:     string;   // e.g. "Architecture"
  location?: string;   // rich variant
  date?:     string;   // rich variant
  caption?:  string;   // rich variant
}

export interface Collection {
  id:      string;
  title:   string;
  country: string;
  year:    string;
  frames:  string;
  photos:  { src?: string; ratio: "2/3" | "3/4" | "1/1" | "16/9" | "4/3" }[];
}

/** A collection → reel frames (rich metadata: location, date, caption). */
export function collectionToFrames(c: Collection): ReelFrame[] {
  return c.photos
    .filter(p => p.src)
    .map((p, i) => ({
      src:      p.src as string,
      title:    c.title,
      location: c.country,
      date:     c.year,
      caption:  `${c.title} — No. ${String(i + 1).padStart(2, "0")}`,
    }));
}
