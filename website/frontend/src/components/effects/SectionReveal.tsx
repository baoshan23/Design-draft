'use client';

import { useEffect } from 'react';

/**
 * "Color-block switch" scroll transition (go-electra style) for the
 * home / b2b / b2c pages.
 *
 * Each top-level white / grey <section> becomes a rounded-top opaque panel.
 * As you scroll, the next block slides up and covers the previous one —
 * sticky stacking panels.
 *
 * Robustness:
 * - Only sections that FIT within the viewport are pinned (`position:sticky`).
 *   A taller section, if pinned at top, would hide its own lower content, so
 *   tall blocks keep the rounded-panel look + slide-in but are NOT pinned.
 * - z-index is kept low (1..N) so the fixed header (100) and sub-nav (99)
 *   always stay on top, and the footer (outside `.page-transition`) is never
 *   covered.
 * - Transparent (white) sections get an explicit white fill so they actually
 *   cover the grey block beneath; sections with their own background are left
 *   alone.
 * - The hero, the trusted-bar marquee, the full-bleed CTA banner, and the b2c
 *   sticky stacking-deck section (#features) are skipped.
 * - Reduced motion: panels still render, but without the slide-in.
 */
export default function SectionReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const skip = (el: HTMLElement) =>
      el.classList.contains('hero') ||
      el.classList.contains('product-hero') ||
      el.classList.contains('trusted-bar') ||
      el.classList.contains('cta-banner') ||
      el.querySelector('.b2c-feature-stack') !== null;

    const panels = Array.from(document.querySelectorAll<HTMLElement>('section')).filter(
      (el) => !skip(el)
    );

    const headerH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
        10
      ) || 72;
    const hasSubNav = !!document.querySelector('.sub-nav');
    const pinTop = headerH + (hasSubNav ? 42 : 0);
    const vh = window.innerHeight;

    panels.forEach((sec, i) => {
      sec.classList.add('section-panel');
      sec.style.zIndex = String(i + 1);

      // Make white (transparent) blocks opaque so they cover the block below.
      const bg = getComputedStyle(sec).backgroundColor;
      if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
        sec.style.backgroundColor = '#fff';
      }

      // Pin only blocks that fit a screen — taller ones would hide their own
      // lower content if frozen at the top.
      if (sec.getBoundingClientRect().height <= vh * 0.96) {
        sec.classList.add('section-panel--pin');
        sec.style.top = `${pinTop}px`;
      }
    });

    if (reduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    panels.forEach((sec) => {
      // Skip anything already in / near the first screen so it never flickers.
      if (sec.getBoundingClientRect().top < vh * 0.85) return;
      sec.classList.add('section-reveal');
      io.observe(sec);
    });

    return () => io.disconnect();
  }, []);

  return null;
}
