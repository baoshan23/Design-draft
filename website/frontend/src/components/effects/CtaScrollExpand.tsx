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
    const EASE = 0.16; // glide factor — discrete wheel ticks ease smoothly
    let raf = 0;
    let cur = -1; // applied 0→1 value; -1 = unset (snap on first frame)

    const targetFor = () => {
      if (mqSmall.matches) return 1;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      // centre at 0.88·vh → just entered (expand 0); at 0.50·vh → screen
      // middle (expand 1). The ~0.38·vh band ≈ three wheel notches of scrolling.
      const start = vh * 0.88;
      const end = vh * 0.5;
      const p = (start - center) / (start - end);
      return Math.max(0, Math.min(1, p));
    };

    // A persistent rAF loop EASES the applied value toward the scroll-derived
    // target instead of snapping each scroll event, so the width glides smoothly
    // with a discrete mouse wheel. It parks once settled and re-wakes on scroll.
    const frame = () => {
      const target = targetFor();
      if (cur < 0) cur = target; // first frame: snap (no load-time animation)
      else cur += (target - cur) * EASE;
      let moving = true;
      if (Math.abs(target - cur) < 0.0008) {
        cur = target;
        moving = false;
      }
      el.style.setProperty(varName, cur.toFixed(4));
      raf = moving ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    wake();
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    return () => {
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', wake);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [selector, varName]);

  return null;
}
