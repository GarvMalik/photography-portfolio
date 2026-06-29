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
    src: "/images/finland/finland-07.webp",
    ratio: "2/3",
    excerpt: "The forty minutes before the street lamps kick in — that gap where the city forgets itself and becomes briefly, beautifully nobody's.",
    body: [
      "There's a forty-minute window in Tampere, somewhere between November and March, where the day doesn't so much end as dissolve. The sky holds on to a last bruise of orange — not quite sunset, not yet dark — and in that gap everything softens. The shop fronts on Hämeenkatu go amber. The puddles catch what's left of the light and give it back wrong, like a bad print of something better.",
      "People walk faster in that light. Not only because they're cold — though they are — but because there's something older in it, some animal memory that dark used to mean something. You can read it in the way shoulders rise, in how eyes drop to the pavement, in the particular hunch of someone who wants to be indoors before they can name why.",
      "I was near the Tammerkoski rapids when the crosswalk emptied. Just for a second — maybe three frames' worth — four lanes of city became nobody's. Just the trees losing their colour and the tram lines going silver and the light pressing itself flat against everything it could reach. I pressed the shutter without deciding to.",
      "That's usually when the real ones happen. When you've been standing in the cold long enough that the camera stops being a machine and starts being a hand. You stop composing and start reacting. The picture announces itself and all you have to do is be fast enough to agree with it. Most nights I'm not. That night I was.",
    ],
    images: ["/images/finland/finland-07.webp", "/images/finland/finland-02.webp", "/images/finland/finland-10.jpg"],
  },
  {
    slug: "geometry-of-gaudi",
    n: "002",
    title: "Geometry of Gaudí",
    location: "Barcelona, Spain",
    year: "2024",
    type: "Architecture",
    src: "/images/spain/spain-29.webp",
    ratio: "3/4",
    excerpt: "Gaudí didn't build buildings. He built arguments — every curve a formal rebuttal to the straight line, every tile a sentence the walls are still finishing.",
    body: [
      "Gaudí didn't build buildings. He built arguments. Every curve is a rebuttal to the straight line — a formal proof that the right angle has been lying to us for centuries. The columns of the Sagrada Família don't hold the ceiling up so much as they grow it, branching at their capitals like stone trees that have been reaching for the same light since 1882 and haven't given up.",
      "I'd been told to come at dawn, before the tour groups arrive and the stone is still cold from the night. What nobody tells you is how physically strange it feels to stand in front of something that size — not humbling exactly, but destabilising. Like your sense of scale has been quietly recalibrated without your consent.",
      "Through the lens I kept looking for the seams — the places where human decisions become visible. Gaudí's collaborators are still finishing what he started, and if you look closely you can find the transitions: where one century's stone meets another's, where the original drawings gave out and someone had to make a judgement call. The whole history of the building is written in those joints. The grand views are for postcards. The joints are for photographs.",
      "The Gothic Quarter was the counter-argument. Walking back into the medieval city from the Eixample felt like leaving a solved equation for the problem it came from — narrow streets, stone worn to a shine by a thousand years of shoulders, balconies barely wide enough to stand on. I shot there for an entire afternoon and came out with seventeen frames I thought were any good. In Barcelona, seventeen is a lot.",
    ],
    images: ["/images/spain/spain-29.webp", "/images/spain/spain-30.webp", "/images/spain/spain-03.jpg", "/images/spain/spain-33.webp"],
  },
  {
    slug: "ice-season",
    n: "003",
    title: "Ice Season",
    location: "Tampere, Finland",
    year: "2023",
    type: "Landscape",
    src: "/images/finland/finland-13.webp",
    ratio: "4/3",
    excerpt: "By January the lake is solid enough to walk on. The Finns do it without ceremony. I kept stopping to listen to the ice groan and reconsider.",
    body: [
      "By January, Pyhäjärvi is solid. The Finns confirm this by simply walking out onto it — no ceremony, no pause to calculate, just the quiet confidence of people who have been doing this for a thousand winters. They drill holes in the ice with a corkscrew-looking tool and sit on stools and fish through them. They walk their dogs out there. They ski. The ice is infrastructure to them, not spectacle.",
      "I couldn't manage that ease. I kept stopping out on the white, measuring my weight against the silence, following a set of tracks that someone had already made — reasoning that their survival was evidence for mine, then wondering if that was actually how structural loads worked. The ice makes a sound sometimes, a long low groan that travels across the whole surface at once like a thought passing through it. The Finns say this is normal. Fine, even. I chose to believe them.",
      "The light in winter this far north is different in a way that resists description to anyone who hasn't stood under it. It comes in low and sideways, even at noon — never high enough to turn white, so it stays golden for hours. Everything casts a shadow twice its height. The lake amplifies all of this: that much flat white surface bouncing the light back upward, catching it from below, filling in shadows that would exist on any other landscape.",
      "I shot mostly in the late afternoon, when the ice started drinking colour from the sky — blues first, then a long bruised pink, then the deep cold grey just before dark arrived with some permanence. The day's footprints — fishermen, walkers, what might have been a pair of skis — had filled with blue shadow by then and become the lines the composition already needed. Winter had done the work. I just had to notice it.",
    ],
    images: ["/images/finland/finland-13.webp", "/images/finland/finland-12.jpg", "/images/finland/finland-16.jpg", "/images/finland/finland-15.jpg"],
  },
];

export const getStory = (slug: string) => STORIES.find(s => s.slug === slug);
