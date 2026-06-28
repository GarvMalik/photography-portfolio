export interface Photo {
  slug:   string;
  src:    string;
  ratio:  string;
  label:  string;
  type:   string;
  series: string;
  alt?:   string;
}

// Selected Work — a clean, uniform 3×3 grid (every tile cropped to the same
// aspect ratio for an even, gap-free layout).
export const PHOTOS: Photo[] = [
  { slug: "frame-01", src: "/images/finland/finland-04.jpg",   ratio: "4/3", label: "Tammerkoski", type: "Architecture", series: "Tampere",   alt: "Red-brick factory chimney rising over the Tammerkoski rapids" },
  { slug: "frame-02", src: "/images/best-of-all/best-09.jpg",  ratio: "3/4", label: "Northern Lights", type: "Landscape", series: "Nordic",    alt: "Aurora borealis glowing pink and green over a dark lake" },
  { slug: "frame-03", src: "/images/spain/spain-30.webp",       ratio: "3/4", label: "Barri Gòtic", type: "Architecture", series: "Barcelona", alt: "Gothic spires of the Barcelona Cathedral" },
  { slug: "frame-04", src: "/images/best-of-all/best-16.jpg",  ratio: "3/4", label: "On the Ridge", type: "Figure",       series: "Field",     alt: "A lone figure standing on a green hillside ridge" },
  { slug: "frame-05", src: "/images/spain/spain-40.jpg",       ratio: "4/3", label: "Montjuïc Dusk", type: "Landscape", series: "Barcelona", alt: "The Montjuïc palace and avenue at dusk" },
  { slug: "frame-06", src: "/images/best-of-all/best-14.jpg",  ratio: "3/4", label: "Hanami", type: "Nature",            series: "In Bloom",  alt: "Pink cherry blossom in full bloom" },
  { slug: "frame-07", src: "/images/best-of-all/best-22.jpg",  ratio: "4/3", label: "Kauppatori", type: "Street",         series: "Helsinki",  alt: "Boats moored along the Helsinki harbour canal" },
  { slug: "frame-08", src: "/images/best-of-all/best-21.jpg",  ratio: "4/3", label: "The Pier", type: "Landscape",        series: "Nordic",    alt: "A wooden pier reaching into still water at dusk" },
  { slug: "frame-09", src: "/images/spain/spain-29.webp",       ratio: "3/4", label: "Casa Batlló", type: "Architecture",  series: "Barcelona", alt: "The undulating Modernisme facade of Casa Batlló" },
];
