'use client';

import { useEffect } from 'react';

/**
 * Scroll-driven width expansion, reused by:
 *  - the b2c "准备部署？" yellow CTA banner (`.cta-banner-inner`, `--cta-expand`)
 *  - the homepage coverage map (`.map-fullbleed`, `--map-expand`)
 *
 * The target starts CONTAINED (≤1360px wide) and, as it scrolls up toward the
 * middle of the screen, slowly widens into a near-full-bleed band. Expansion
 * completes (target reaches the vertical centre of the viewport) over roughly
 * three mouse-wheel notches of travel.
 *
 * It just writes a 0→1 CSS var on the target element; all the interpolation
 * (width / margin / padding) lives in sections.css.
 *
 * - Reduced motion / small screens: pinned fully expanded (no animation).
 */
type Props = {
  /** Target element selector (default: the b2c CTA banner). */
  selector?: string;
  /** CSS custom property to write the 0→1 progress into. */
  varName?: string;
};

export default function CtaScrollExpand({
  selector = '.cta-banner-inner',
  varName = '--cta-expand',
}: Props) {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty(varName, '1');
      return;
    }

    const mqSmall = window.matchMedia('(max-width: 860px)');
    let raf = 0;

    const update = () => {
      raf = 0;
      if (mqSmall.matches) {
        el.style.setProperty(varName, '1');
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      // centre at 0.88·vh → just entered (expand 0); at 0.50·vh → screen
      // middle (expand 1). The ~0.38·vh band ≈ three wheel notches of scrolling.
      const start = vh * 0.88;
      const end = vh * 0.5;
      let p = (start - center) / (start - end);
      p = Math.max(0, Math.min(1, p));
      el.style.setProperty(varName, p.toFixed(4));
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
  }, [selector, varName]);

  return null;
}
