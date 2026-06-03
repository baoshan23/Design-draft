'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type Item = { name: string; icon: ReactNode };

// Flat tiled logo grid with a fisheye lens. Each tile lives in a fixed CSS
// grid cell so neighbours never collide; the only thing that animates is the
// per-tile `scale` and `opacity`, driven by a Gaussian falloff from a moving
// focus point (the cursor while hovered, drifting back to the grid centre
// otherwise). The whole loop writes inline styles on cached refs — React
// never re-renders during animation.
export default function PaymentFisheye({ items }: { items: Item[] }) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const N = items.length;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Lens parameters — wider sigma = softer falloff.
    const SIGMA = 1.7;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 0.98; // < 1 keeps a visible gap between adjacent tiles
    const MIN_OPACITY = 0.22;

    // Read live column count from the CSS grid; reacts to breakpoints.
    let cols = 8;
    let rows = Math.ceil(N / cols);
    const measure = () => {
      const cs = getComputedStyle(grid).gridTemplateColumns.trim();
      const next = cs ? cs.split(/\s+/).length : 8;
      cols = Math.max(1, next);
      rows = Math.ceil(N / cols);
    };
    measure();

    // Focus in grid coordinates (col, row).
    const centerFx = () => cols / 2 - 0.5;
    const centerFy = () => rows / 2 - 0.5;
    let fx = centerFx();
    let fy = centerFy();
    let targetFx = fx;
    let targetFy = fy;

    const render = () => {
      const inv2s2 = 1 / (2 * SIGMA * SIGMA);
      for (let i = 0; i < N; i++) {
        const el = tileRefs.current[i];
        if (!el) continue;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const dx = col - fx;
        const dy = row - fy;
        const g = Math.exp(-(dx * dx + dy * dy) * inv2s2);
        const s = MIN_SCALE + g * (MAX_SCALE - MIN_SCALE);
        el.style.transform = `scale(${s})`;
        el.style.opacity = String(MIN_OPACITY + g * (1 - MIN_OPACITY));
        el.style.zIndex = String(Math.round(g * 100));
      }
    };

    if (reduceMotion) {
      // Static fisheye centred on the grid — no loop, no pointer reaction.
      render();
      const ro = new ResizeObserver(() => {
        measure();
        fx = centerFx();
        fy = centerFy();
        render();
      });
      ro.observe(grid);
      return () => ro.disconnect();
    }

    let raf = 0;
    const tick = () => {
      fx += (targetFx - fx) * 0.18;
      fy += (targetFy - fy) * 0.18;
      render();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      const rect = grid.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      // Clamp so the focus can't fly beyond the outermost cells.
      targetFx = Math.max(0, Math.min(cols - 1, relX * cols - 0.5));
      targetFy = Math.max(0, Math.min(rows - 1, relY * rows - 0.5));
    };
    const onLeave = () => {
      targetFx = centerFx();
      targetFy = centerFy();
    };

    grid.addEventListener('pointermove', onMove);
    grid.addEventListener('pointerleave', onLeave);

    const ro = new ResizeObserver(() => {
      const oldCenter = { fx: centerFx(), fy: centerFy() };
      measure();
      // If we were resting at the centre, follow the new centre.
      if (Math.abs(targetFx - oldCenter.fx) < 0.01) targetFx = centerFx();
      if (Math.abs(targetFy - oldCenter.fy) < 0.01) targetFy = centerFy();
    });
    ro.observe(grid);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      grid.removeEventListener('pointermove', onMove);
      grid.removeEventListener('pointerleave', onLeave);
    };
  }, [items]);

  return (
    <div className="payment-fisheye">
      <div
        ref={gridRef}
        className="payment-fisheye-grid"
        role="list"
        aria-label="Supported payment methods"
      >
        {items.map((it, i) => (
          <div
            key={it.name}
            className="payment-fisheye-cell"
            role="listitem"
            title={it.name}
            aria-label={it.name}
          >
            <div
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              className="payment-fisheye-tile"
            >
              <div className="payment-fisheye-inner">{it.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
