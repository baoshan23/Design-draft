'use client';

import { useEffect } from 'react';

/**
 * Site-wide "screen-to-screen" scroll transition (go-electra style).
 *
 * Gives every top-level <section> a cohesive glide-in as it enters the
 * viewport, so scrolling reads as one screen sliding into place after the
 * next — on top of the existing per-element `.animate-on-scroll` reveals.
 *
 * Side-effect only (renders nothing). Mounts on the home / b2b / b2c pages.
 *
 * Notes:
 * - The hero (first screen) is skipped — it has its own load entrance.
 * - Sections already in / near the initial viewport are left fully visible
 *   (never hidden), so there is no above-the-fold flicker by construction.
 * - The revealed end state is `transform: none` (NOT translateY(0)) so a
 *   revealed section stops forming a containing block — keeping the b2c
 *   sticky stacking deck and the fixed sub-nav working.
 */
export default function SectionReveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>('section'));

    const skip = (el: HTMLElement) =>
      el.classList.contains('hero') ||
      el.classList.contains('product-hero') ||
      el.classList.contains('trusted-bar');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const vh = window.innerHeight;
    for (const sec of sections) {
      if (skip(sec)) continue;
      // Leave anything already in / near the first screen fully visible —
      // only arm sections that genuinely start below the fold.
      if (sec.getBoundingClientRect().top < vh * 0.85) continue;
      sec.classList.add('section-reveal');
      observer.observe(sec);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
