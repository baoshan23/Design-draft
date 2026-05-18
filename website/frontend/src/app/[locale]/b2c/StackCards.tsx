'use client';

import { ReactNode, useEffect, useRef } from 'react';

/**
 * Sticky "stacking deck" wrapper for the b2c feature highlights.
 * Each direct child .b2c-stack-card is position:sticky (pure CSS, see
 * sections.css) so the cards pile at the top as you scroll. This component
 * adds the progressive shrink/dim of the pinned card as the next card rises
 * over it (the "收缩" effect). Pure progressive enhancement: with JS off the
 * cards still stack cleanly, just without the scale.
 */
export default function StackCards({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqNarrow = window.matchMedia('(max-width: 900px)');

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>('.b2c-stack-card')
    );

    const headerH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--header-height'
        )
      ) || 72;
    const stickTop = headerH + 28;

    const clamp = (v: number, lo: number, hi: number) =>
      Math.min(hi, Math.max(lo, v));

    let raf = 0;

    const reset = () => {
      cards.forEach((c) => {
        c.style.transform = '';
        c.style.filter = '';
        c.style.opacity = '';
      });
    };

    const update = () => {
      raf = 0;
      if (mqReduce.matches || mqNarrow.matches) {
        reset();
        return;
      }
      for (let i = 0; i < cards.length - 1; i++) {
        const card = cards[i];
        const next = cards[i + 1];
        const nextTop = next.getBoundingClientRect().top;
        // 0 while the next card is still well below; → 1 as it rises to the
        // sticky line and covers the pinned card.
        const range = card.offsetHeight * 0.9;
        const p = clamp(1 - (nextTop - stickTop) / range, 0, 1);
        const scale = 1 - 0.08 * p;
        card.style.transform = `scale(${scale.toFixed(4)})`;
        card.style.filter = `brightness(${(1 - 0.05 * p).toFixed(3)})`;
        card.style.opacity = `${(1 - 0.18 * p).toFixed(3)}`;
      }
      // Last card never shrinks.
      const last = cards[cards.length - 1];
      if (last) {
        last.style.transform = '';
        last.style.filter = '';
        last.style.opacity = '';
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="b2c-stack" ref={ref}>
      {children}
    </div>
  );
}
