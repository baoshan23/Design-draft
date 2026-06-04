'use client';

import { useEffect } from 'react';

/**
 * Per-section scroll transitions for the home / b2b / b2c pages.
 *
 * Every white → grey background switch does a "灰色块叠盖" cover-rise: the grey
 * block (or the inset grey panel inside a white section) slides up into place
 * as it scrolls in — pure transform, OPAQUE, no opacity fade, no shadow, so it
 * reads as a clean colour-block cover, not a translucent ghost. All other
 * colour changes (e.g. grey → white) keep a gentle fade-up; white → white is
 * seamless (no animation).
 *
 * - The hero, the trusted-bar marquee, the full-bleed CTA banner, and the b2c
 *   sticky stacking-deck section (#features) are skipped.
 * - Reduced motion: nothing is hidden / animated.
 */
export default function SectionReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const skip = (el: HTMLElement) =>
      el.classList.contains('hero') ||
      el.classList.contains('product-hero') ||
      el.classList.contains('trusted-bar') ||
      el.classList.contains('cta-banner') ||
      el.querySelector('.b2c-feature-stack') !== null;

    // Effective bg of EVERY section (transparent → white, since the page is
    // white). The site grey is var(--dark) = #F1F2F4 = rgb(241, 242, 244).
    const WHITE = 'rgb(255, 255, 255)';
    const GREY = 'rgb(241, 242, 244)';
    const norm = (c: string) =>
      c === 'rgba(0, 0, 0, 0)' || c === 'transparent' ? WHITE : c;
    const allSections = Array.from(document.querySelectorAll<HTMLElement>('section'));
    const bgs = allSections.map((s) => norm(getComputedStyle(s).backgroundColor));
    const vh = window.innerHeight;
    const isB2b = !!document.querySelector('.product-hero.particles-bg');

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

    allSections.forEach((sec, i) => {
      if (skip(sec)) return;
      // Skip anything already in / near the first screen so it never flickers.
      if (sec.getBoundingClientRect().top < vh * 0.85) return;

      const secBg = bgs[i];
      const prevBg = i > 0 ? bgs[i - 1] : WHITE;

      // Inset grey panel: a WHITE section whose inner `.container` is the grey
      // block (#how-it-works, #demo) — the section bg reads white like the one
      // above it, so the bg compare alone would miss it.
      const panel = sec.querySelector<HTMLElement>('.container');
      const panelGrey =
        secBg === WHITE && !!panel && norm(getComputedStyle(panel).backgroundColor) === GREY;

      // b2b 营收(white) → 功能(#features): the gradient features band has no
      // bg-COLOR (reads white), so the white→grey compare misses it. Trigger the
      // same opaque cover-rise (NO shadow) so it 叠盖s the revenue block above.
      const featCover = isB2b && sec.id === 'features';

      if (featCover || (secBg === GREY && prevBg === WHITE)) {
        // full-bleed block → rises up to cover the white above (叠盖)
        sec.classList.add('cover-rise');
        io.observe(sec);
      } else if (panelGrey) {
        // inset grey panel → the grey panel rises up to cover
        sec.classList.add('cover-rise--panel');
        io.observe(sec);
      } else if (secBg !== prevBg) {
        // any other colour change (grey → white, …) keeps the gentle fade-up
        sec.classList.add('section-reveal');
        io.observe(sec);
      }
    });

    return () => io.disconnect();
  }, []);

  return null;
}
