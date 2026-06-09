'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { setupGsap } from '@/lib/gsap';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Arcadia-style two-panel page-transition WIPE (切屏效果), GCSS colours
 * (gold + black). Two stacked full-screen panels:
 *
 *   • COVER (leaving a page / clicking an internal link): the panels grow up
 *     from the bottom edge (scaleY 0→1, transformOrigin "center bottom"),
 *     gold first then black 0.12s later, covering the screen — THEN navigate.
 *   • REVEAL (entering a page / hard refresh): the panels are already covering
 *     and retract to the right (scaleX 1→0, transformOrigin "right center"),
 *     black first then gold 0.15s later, uncovering the page.
 *
 * Mounted in [locale]/template.tsx (re-mounts per route) so REVEAL plays on
 * refresh + every navigation, and COVER plays when an internal link is clicked.
 * App Router has no before-navigate hook, so COVER is done by intercepting
 * link clicks in the capture phase, then router.push() after the cover lands.
 * A 1.5s safety timer hard-navigates if the animation never completes, so a
 * hiccup can never strand the user behind the panels.
 *
 * CSS gives the panels a no-JS fallback reveal animation; this cancels it and
 * takes over. `prefers-reduced-motion` hides the panels and skips interception.
 */
export default function PageWipe() {
  const goldRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // REVEAL on mount (refresh / after navigation).
  useIsoLayoutEffect(() => {
    const gold = goldRef.current;
    const black = blackRef.current;
    if (!gold || !black) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gold.style.display = 'none';
      black.style.display = 'none';
      return;
    }

    gold.style.animation = 'none';
    black.style.animation = 'none';

    const { gsap } = setupGsap();
    const ctx = gsap.context(() => {
      gsap.set([gold, black], {
        autoAlpha: 1,
        scaleX: 1,
        scaleY: 1,
        transformOrigin: 'right center',
      });
      gsap
        .timeline({
          onComplete: () => {
            gold.style.display = 'none';
            black.style.display = 'none';
          },
        })
        .to(black, { duration: 0.7, scaleX: 0, ease: 'ArcadiaEase' }, 0)
        .to(gold, { duration: 0.7, scaleX: 0, ease: 'ArcadiaEase' }, 0.15);
    });

    return () => ctx.revert();
  }, []);

  // COVER on internal-link click → then navigate.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const samePath = (a: string, b: string) =>
      a.replace(/\/+$/, '') === b.replace(/\/+$/, '');

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const link = (e.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      if ((link.getAttribute('rel') || '').includes('external')) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (or in-page anchor) → let native / the Lenis anchor handler deal with it.
      if (samePath(url.pathname, window.location.pathname)) return;

      const gold = goldRef.current;
      const black = blackRef.current;
      if (!gold || !black) return;

      e.preventDefault();
      e.stopPropagation();

      const dest = url.pathname + url.search + url.hash;
      const { gsap } = setupGsap();

      gold.style.display = '';
      black.style.display = '';
      gold.style.animation = 'none';
      black.style.animation = 'none';

      // Hard-navigate fallback if the animation/onComplete never fires.
      const safety = window.setTimeout(() => {
        window.location.href = dest;
      }, 1500);

      gsap.set([gold, black], {
        autoAlpha: 1,
        scaleX: 1,
        scaleY: 0,
        transformOrigin: 'center bottom',
      });
      gsap
        .timeline({
          onComplete: () => {
            window.clearTimeout(safety);
            router.push(dest);
          },
        })
        .to(gold, { duration: 0.6, scaleY: 1, ease: 'ArcadiaEase' }, 0)
        .to(black, { duration: 0.6, scaleY: 1, ease: 'ArcadiaEase' }, 0.12);
    };

    // Capture phase so we beat next/link's own click handler.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return (
    <div className="page-wipe-root" aria-hidden="true">
      <div ref={goldRef} className="page-wipe page-wipe-gold" />
      <div ref={blackRef} className="page-wipe page-wipe-black" />
    </div>
  );
}
