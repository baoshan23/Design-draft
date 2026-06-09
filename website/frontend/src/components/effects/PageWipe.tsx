'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { setupGsap } from '@/lib/gsap';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Arcadia-style page-transition "wipe" (切屏效果).
 *
 * arcadia.com covers the viewport with two stacked full-screen panels and
 * scaleY-wipes them away to reveal the page (GSAP + ArcadiaEase, ~0.7s, the
 * two layers staggered). Replicated here in GCSS brand colours: gold + cream.
 *
 * Mounted in [locale]/template.tsx, which re-mounts on every route change —
 * so this plays on a hard refresh AND on every client-side navigation, giving
 * the "screen wipes in" transition between pages.
 *
 * Reveal direction: the panels start covering the screen (scaleY:1, pinned at
 * the top edge) and collapse upward to scaleY:0 — cream first, gold 0.15s
 * later — uncovering the content underneath.
 *
 * Safety: the panels carry a CSS-only fallback animation that wipes them away
 * even if JS never runs; this effect cancels it and takes over for the precise
 * GSAP timing. `prefers-reduced-motion` hides them outright.
 */
export default function PageWipe() {
  const goldRef = useRef<HTMLDivElement>(null);
  const creamRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const gold = goldRef.current;
    const cream = creamRef.current;
    if (!gold || !cream) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gold.style.display = 'none';
      cream.style.display = 'none';
      return;
    }

    // Cancel the CSS fallback so GSAP owns the motion.
    gold.style.animation = 'none';
    cream.style.animation = 'none';

    const { gsap } = setupGsap();
    const ctx = gsap.context(() => {
      gsap.set([gold, cream], {
        autoAlpha: 1,
        scaleY: 1,
        transformOrigin: 'center top',
      });

      const tl = gsap.timeline({
        onComplete: () => {
          gold.style.display = 'none';
          cream.style.display = 'none';
        },
      });
      tl.to(cream, { duration: 0.7, scaleY: 0, ease: 'ArcadiaEase' }, 0)
        .to(gold, { duration: 0.7, scaleY: 0, ease: 'ArcadiaEase' }, 0.15);
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="page-wipe-root" aria-hidden="true">
      <div ref={goldRef} className="page-wipe page-wipe-gold" />
      <div ref={creamRef} className="page-wipe page-wipe-cream" />
    </div>
  );
}
