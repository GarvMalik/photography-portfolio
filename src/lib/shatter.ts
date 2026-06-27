import gsap from "gsap";

/**
 * Shatters a DOM element's photo into triangular "glass" shards that tumble
 * outward in 3D, then calls onComplete. Pure DOM — reads the <img> inside the
 * source element so the *real* photo breaks apart (not a placeholder bg).
 */
export function shatter(
  sourceEl: HTMLElement,
  onComplete: () => void,
  opts: { cols?: number; rows?: number } = {}
) {
  const { cols = 6, rows = 4 } = opts;
  const rect = sourceEl.getBoundingClientRect();
  const tw = rect.width  / cols;
  const th = rect.height / rows;

  // Find the actual photo source
  const img = sourceEl.querySelector("img") as HTMLImageElement | null;
  const imgSrc = img?.currentSrc || img?.src || "";

  // Container for all shards (covers the whole viewport so 3D depth is clean)
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;inset:0;z-index:500;pointer-events:none;overflow:hidden;perspective:1200px;";
  document.body.appendChild(container);

  // Two triangles per cell → glass-like angular shards
  const TRIS = [
    "polygon(0 0, 100% 0, 0 100%)",
    "polygon(100% 0, 100% 100%, 0 100%)",
  ];

  const shards: HTMLDivElement[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      for (let t = 0; t < 2; t++) {
        const shard = document.createElement("div");
        shard.style.cssText = `
          position:absolute;
          left:${rect.left + c * tw}px;
          top:${rect.top  + r * th}px;
          width:${tw + 0.5}px;
          height:${th + 0.5}px;
          clip-path:${TRIS[t]};
          -webkit-clip-path:${TRIS[t]};
          background-image:${imgSrc ? `url("${imgSrc}")` : "none"};
          background-color:#0b0b0b;
          background-size:${rect.width}px ${rect.height}px;
          background-position:${-c * tw}px ${-r * th}px;
          will-change:transform,opacity;
          backface-visibility:hidden;
        `;

        // Glassy sheen overlay (same clip)
        const sheen = document.createElement("div");
        sheen.style.cssText = `
          position:absolute;inset:0;
          clip-path:${TRIS[t]};
          -webkit-clip-path:${TRIS[t]};
          background:linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 42%);
          mix-blend-mode:screen;
        `;
        shard.appendChild(sheen);
        container.appendChild(shard);
        shards.push(shard);
      }
    }
  }

  let done = 0;
  const total = shards.length;

  shards.forEach((shard, i) => {
    const c = Math.floor(i / 2) % cols;
    const r = Math.floor(Math.floor(i / 2) / cols);
    const cx = (c + 0.5) / cols - 0.5;
    const cy = (r + 0.5) / rows - 0.5;
    const angle = Math.atan2(cy, cx);
    const dist  = 220 + Math.random() * 460;

    gsap.to(shard, {
      x:        Math.cos(angle) * dist + (Math.random() - 0.5) * 120,
      y:        Math.sin(angle) * dist + (Math.random() - 0.5) * 90 - 40,
      z:        -200 - Math.random() * 500,
      rotationX: (Math.random() - 0.5) * 320,
      rotationY: (Math.random() - 0.5) * 320,
      rotationZ: (Math.random() - 0.5) * 200,
      opacity:  0,
      duration: 0.7 + Math.random() * 0.5,
      delay:    Math.random() * 0.12,
      ease:     "power3.in",
      onComplete: () => {
        done++;
        if (done === total) {
          container.remove();
          onComplete();
        }
      },
    });
  });

  // Safety: never strand the user if a tween is interrupted
  gsap.delayedCall(1.6, () => {
    if (container.isConnected) {
      container.remove();
      if (done < total) onComplete();
    }
  });
}
