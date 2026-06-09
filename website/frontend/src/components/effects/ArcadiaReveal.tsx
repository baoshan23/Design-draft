'use client';

import { useEffect, useLayoutEffect } from 'react';
import { setupGsap } from '@/lib/gsap';

// useLayoutEffect runs before paint (kills FOUC) but warns on the server, so
// fall back to useEffect during SSR.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * GSAP-driven entrance animations, modelled 1:1 on arcadia.com's refresh
 * interaction (which uses GSAP + ScrollTrigger + a CustomEase, no preloader):
 *
 *   • text  — `[data-animate]` / `[data-animate="text"]`: autoAlpha 0→1, y 10→0
 *   • media — `[data-animate="media"]`: the above PLUS blur(6px)→0 + scale,
 *             slightly slower, for images / dashboards.
 *
 * Two layers, same as Arcadia:
 *   • above the fold → plays immediately on load/refresh, staggered.
 *   • below the fold → a ScrollTrigger per element, fires as it enters view.
 *
 * Disabled for `prefers-reduced-motion`. Cleaned up via gsap.context().revert()
 * so navigating away removes every ScrollTrigger and restores inline styles.
 */
export default function ArcadiaReveal() {
  useIsoLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const { gsap } = setupGsap();

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-animate]');
      if (!items.length) return;

      const foldLine = window.innerHeight * 0.9;
      let staggerIndex = 0;

      items.forEach((el) => {
        const isMedia = el.dataset.animate === 'media';
        const immediate = el.getBoundingClientRect().top < foldLine;

        // Initial (hidden) state — set before paint so nothing flashes.
        gsap.set(el, {
          autoAlpha: 0,
          y: isMedia ? 24 : 10,
          ...(isMedia ? { scale: 0.985, filter: 'blur(6px)' } : {}),
        });

        const to: gsap.TweenVars = {
          autoAlpha: 1,
          y: 0,
          duration: isMedia ? 0.75 : 0.6,
          ease: 'ArcadiaEase',
          ...(isMedia ? { scale: 1, filter: 'blur(0px)' } : {}),
        };

        if (immediate) {
          // First-screen: glide in right away, staggered like Arcadia (0.08s).
          to.delay = 0.08 + staggerIndex * 0.08;
          staggerIndex += 1;
        } else {
          // Below the fold: reveal as it scrolls into view.
          to.scrollTrigger = { trigger: el, start: 'top 88%', once: true };
        }

        gsap.to(el, to);
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
