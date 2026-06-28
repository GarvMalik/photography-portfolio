// Story archive — newest first. The homepage shows only the latest 3.

export interface Story {
  slug:     string;
  n:        string;
  title:    string;
  location: string;
  year:     string;
  type:     string;
  src:      string;   // cover
  ratio:    "2/3" | "3/4" | "1/1" | "16/9" | "4/3";
  excerpt:  string;   // archive preview
  body:     string[]; // detail-page paragraphs
  images:   string[]; // embedded images on the detail page
}

export const STORIES: Story[] = [
  {
    slug: "the-hour-before-dark",
    n: "001",
    title: "The Hour Before Dark",
    location: "Tampere, Finland",
    year: "2024",
    type: "Street",
    src: "/images/finland/finland-07.jpg",
    ratio: "2/3",
    excerpt: "The forty minutes before the street lamps kick in, when the whole street belongs to no one.",
    body: [
      "It's the forty minutes just before the street lamps kick in. The sky is still holding onto a last bruise of orange. People walk faster. The crosswalk empties and for a second the whole street belongs to no one — just the trees losing their colour and the light going soft.",
      "I pressed the shutter without thinking. That's usually when the good ones happen — when the picture announces itself and you're just quick enough to agree with it.",
    ],
    images: ["/images/finland/finland-07.jpg", "/images/finland/finland-02.jpg", "/images/finland/finland-10.jpg"],
  },
  {
    slug: "geometry-of-gaudi",
    n: "002",
    title: "Geometry of Gaudí",
    location: "Barcelona, Spain",
    year: "2024",
    type: "Architecture",
    src: "/images/spain/spain-29.jpg",
    ratio: "3/4",
    excerpt: "Gaudí didn't build buildings. He built arguments — every curve a rebuttal to the straight line.",
    body: [
      "Gaudí didn't build buildings. He built arguments. Every curve is a rebuttal to the straight line, every tile a sentence in a language the walls are still speaking.",
      "I kept shooting the negative space — what he chose not to fill. The city moves through these façades like water, and the camera just tries to hold still long enough to catch a little of it.",
    ],
    images: ["/images/spain/spain-29.jpg", "/images/spain/spain-30.jpg", "/images/spain/spain-03.jpg", "/images/spain/spain-33.jpg"],
  },
  {
    slug: "ice-season",
    n: "003",
    title: "Ice Season",
    location: "Tampere, Finland",
    year: "2023",
    type: "Landscape",
    src: "/images/finland/finland-13.jpg",
    ratio: "4/3",
    excerpt: "By January the lake is solid enough to walk on. The Finns cross frozen water like it's nothing.",
    body: [
      "By January the lake is solid enough to walk on. The Finns do this without ceremony — they cross frozen water like it's nothing.",
      "I couldn't. I kept stopping, following someone else's footprints out into the white, listening to the ice creak, convinced I was about to fall through into something ancient.",
    ],
    images: ["/images/finland/finland-13.jpg", "/images/finland/finland-12.jpg", "/images/finland/finland-16.jpg", "/images/finland/finland-15.jpg"],
  },
];

export const getStory = (slug: string) => STORIES.find(s => s.slug === slug);
