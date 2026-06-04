'use client';

import { useEffect } from 'react';

/**
 * Gentle per-section reveal for the home / b2b / b2c pages.
 *
 * The old "color-block switch" used sticky stacking panels (each section
 * pinned + covered by the next). That produced broken overlaps where a tall
 * inset-panel section (e.g. #demo) froze and bled into its neighbours, so the
 * sticky stacking is gone. What remains is a subtle fade-up that fires ONLY
 * when a section's background colour differs from the section directly above
 * it (white→white is seamless — no animation).
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
    // white). A section's bg differing from the one directly above it is a
    // real colour change; same colour (white→white) gets no animation.
    const norm = (c: string) =>
      c === 'rgba(0, 0, 0, 0)' || c === 'transparent' ? 'rgb(255, 255, 255)' : c;
    const allSections = Array.from(document.querySelectorAll<HTMLElement>('section'));
    const bgs = allSections.map((s) => norm(getComputedStyle(s).backgroundColor));
    const vh = window.innerHeight;

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
      // Only fade in where the colour actually changes from the section above.
      const prevBg = i > 0 ? bgs[i - 1] : 'rgb(255, 255, 255)';
      if (bgs[i] === prevBg) return;
      sec.classList.add('section-reveal');
      io.observe(sec);
    });

    // 售后服务(white) → 系统演示: the b2c #demo grey inner panel does a
    // contained "叠盖" cover switch — it rises up + overlaps the block above.
    // Scoped to #demo alone so it can't jumble neighbours the way the old
    // global sticky stacking did. (#demo's SECTION bg is white like #support
    // above it, so the colour-change loop skips it — handle it explicitly.)
    const demo = document.querySelector<HTMLElement>('.b2c-demo-section');
    if (demo && demo.getBoundingClientRect().top >= vh * 0.85) {
      demo.classList.add('demo-cover');
      io.observe(demo);
    }

    return () => io.disconnect();
  }, []);

  return null;
}
