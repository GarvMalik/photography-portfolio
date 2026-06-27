export interface Photo {
  slug:   string;
  src:    string;
  ratio:  string;
  label:  string;
  type:   string;
  series: string;
  alt?:   string;
}

// "best of all" — hero masonry grid (7 picks, mix of orientations)
export const PHOTOS: Photo[] = [
  { slug: "frame-01", src: "/images/best-of-all/best-07.jpg", ratio: "4/3",  label: "Frame 01", type: "Landscape",  series: "Best Of",  alt: "Photo 01" },
  { slug: "frame-02", src: "/images/best-of-all/best-01.jpg", ratio: "3/4",  label: "Frame 02", type: "Portrait",   series: "Best Of",  alt: "Photo 02" },
  { slug: "frame-03", src: "/images/best-of-all/best-09.jpg", ratio: "3/4",  label: "Frame 03", type: "Portrait",   series: "Best Of",  alt: "Photo 03" },
  { slug: "frame-04", src: "/images/best-of-all/best-21.jpg", ratio: "4/3",  label: "Frame 04", type: "Landscape",  series: "Best Of",  alt: "Photo 04" },
  { slug: "frame-05", src: "/images/best-of-all/best-10.jpg", ratio: "3/4",  label: "Frame 05", type: "Portrait",   series: "Best Of",  alt: "Photo 05" },
  { slug: "frame-06", src: "/images/best-of-all/best-22.jpg", ratio: "4/3",  label: "Frame 06", type: "Landscape",  series: "Best Of",  alt: "Photo 06" },
  { slug: "frame-07", src: "/images/best-of-all/best-05.jpg", ratio: "3/4",  label: "Frame 07", type: "Portrait",   series: "Best Of",  alt: "Photo 07" },
];
