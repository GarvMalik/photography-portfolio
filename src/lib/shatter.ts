import gsap from "gsap";

/**
 * Shatters a DOM element into flying glass-like tiles.
 * Uses pure DOM so it works with any background (gradients, images, etc).
 */
export function shatter(
  sourceEl: HTMLElement,
  onComplete: () => void,
  opts: { cols?: number; rows?: number } = {}
) {
  const { cols = 9, rows = 6 } = opts;
  const rect = sourceEl.getBoundingClientRect();
  const tw = rect.width  / cols;
  const th = rect.height / rows;

  // Snapshot the background of the first child with a background
  const photoEl =
    (sourceEl.querySelector("[data-photo-bg]") as HTMLElement) ??
    (sourceEl.firstElementChild as HTMLElement) ??
    sourceEl;
  const bg = window.getComputedStyle(photoEl).background ||
             "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)";

  // Container for all shards
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;inset:0;z-index:500;pointer-events:none;overflow:hidden;";
  document.body.appendChild(container);

  let done = 0;
  const total = cols * rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const shard = document.createElement("div");
      shard.style.cssText = `
        position:absolute;
        left:${rect.left + c * tw}px;
        top:${rect.top  + r * th}px;
        width:${tw + 1}px;
        height:${th + 1}px;
        overflow:hidden;
      `;

      // Inner element — full bg offset so each tile shows the right region
      const inner = document.createElement("div");
      inner.style.cssText = `
        position:absolute;
        left:${-c * tw}px;
        top:${-r * th}px;
        width:${rect.width}px;
        height:${rect.height}px;
        background:${bg};
      `;
      shard.appendChild(inner);
      container.appendChild(shard);

      // Direction from center + random spread
      const cx    = (c + 0.5) / cols - 0.5;
      const cy    = (r + 0.5) / rows - 0.5;
      const angle = Math.atan2(cy, cx);
      const dist  = 180 + Math.random() * 380;

      gsap.to(shard, {
        x:        Math.cos(angle) * dist + (Math.random() - 0.5) * 80,
        y:        Math.sin(angle) * dist + (Math.random() - 0.5) * 40,
        rotation: (Math.random() - 0.5) * 160,
        scaleX:   0.3 + Math.random() * 0.5,
        scaleY:   0.3 + Math.random() * 0.5,
        opacity:  0,
        duration: 0.55 + Math.random() * 0.45,
        delay:    Math.random() * 0.18,
        ease:     "power3.in",
        onComplete: () => {
          done++;
          if (done === total) {
            container.remove();
            onComplete();
          }
        },
      });
    }
  }
}
