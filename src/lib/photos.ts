export interface Photo {
  slug:   string;
  src:    string | null;   // null = placeholder; "/images/x.jpg" = real photo
  ratio:  string;
  label:  string;
  type:   string;
  series: string;
  alt?:   string;
}

// Swap src: null → "/images/your-photo.jpg" as you add real photos
export const PHOTOS: Photo[] = [
  { slug: "frame-01", src: null, ratio: "16/9",  label: "16:9",  type: "Cinematic wide",  series: "Architecture" },
  { slug: "frame-02", src: null, ratio: "2/3",   label: "2:3",   type: "Vertical mood",   series: "Street"       },
  { slug: "frame-03", src: null, ratio: "1/1",   label: "1:1",   type: "Square study",    series: "Texture"      },
  { slug: "frame-04", src: null, ratio: "1/1",   label: "1:1",   type: "Square study",    series: "Abstract"     },
  { slug: "frame-05", src: null, ratio: "21/9",  label: "21:9",  type: "Panoramic",       series: "Landscape"    },
  { slug: "frame-06", src: null, ratio: "3/4",   label: "3:4",   type: "Portrait piece",  series: "Figure"       },
  { slug: "frame-07", src: null, ratio: "4/3",   label: "4:3",   type: "Standard frame",  series: "Documentary"  },
];
