'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { setupGsap } from '@/lib/gsap';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Cover (panels grow up to cover) is kept brisk so the screen doesn't sit
// fully black for long before the next page reveals; reveal (single panel
// slides off to the right) is snappy too. Panels staggered, brand ArcadiaEase.
const COVER_DUR = 0.5;
const REVEAL_DUR = 0.6;
const STAGGER = 0.08;

/**
 * Arcadia-style page-transition WIPE (切屏效果) — faithful 3-layer replica in
 * GCSS colours (gold + black + a dark overlay scrim).
 *
 * Layers (bottom→top): overlay scrim · gold panel · black panel.
 *
 *   • COVER (onExit — clicking an internal link): the overlay fades the
 *     current page to 50% dark WHILE the gold then black panels grow up from
 *     the bottom edge (scaleY 0→1, transformOrigin "center bottom", black
 *     0.2s after gold) until the screen is covered — THEN navigate.
 *   • REVEAL (onEnter — refresh / arriving on a page): ONLY the black panel
 *     retracts to the right (scaleX 1→0, transformOrigin "right center");
 *     the gold panel + overlay are hidden. This single-layer slide is what
 *     Arcadia actually does on enter.
 *
 * Mounted in [locale]/template.tsx (re-mounts per route): REVEAL plays on
 * refresh + after every navigation; COVER plays when an internal link is
 * clicked (intercepted in the capture phase, since App Router has no
 * before-navigate hook). A safety timer hard-navigates if the cover timeline
 * never completes, so the user can't be stranded behind the panels.
 *
 * `prefers-reduced-motion` hides everything and skips interception. The black
 * panel also has a CSS-only fallback reveal so a no-JS load never stays dark.
 */
export default function PageWipe() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // REVEAL on mount (refresh / after navigation): black panel slides off right.
  useIsoLayoutEffect(() => {
    const overlay = overlayRef.current;
    const gold = goldRef.current;
    const black = blackRef.current;
    if (!overlay || !gold || !black) return;

    const hideAll = () => {
      overlay.style.display = 'none';
      gold.style.display = 'none';
      black.style.display = 'none';
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hideAll();
      return;
    }

    black.style.animation = 'none';

    const { gsap } = setupGsap();
    const ctx = gsap.context(() => {
      gsap.set(overlay, { autoAlpha: 0 });
      gsap.set(gold, { autoAlpha: 0 });
      gsap.set(black, { autoAlpha: 1, scaleX: 1, scaleY: 1, transformOrigin: 'right center' });
      gsap.to(black, { duration: REVEAL_DUR, scaleX: 0, ease: 'ArcadiaEase', onComplete: hideAll });
    });

    return () => ctx.revert();
  }, []);

  // COVER on internal-link click → navigate after the panels land.
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
      if (samePath(url.pathname, window.location.pathname)) return; // same page / in-page anchor

      const overlay = overlayRef.current;
      const gold = goldRef.current;
      const black = blackRef.current;
      if (!overlay || !gold || !black) return;

      e.preventDefault();
      e.stopPropagation();

      const dest = url.pathname + url.search + url.hash;
      const { gsap } = setupGsap();

      [overlay, gold, black].forEach((el) => {
        el.style.display = '';
        el.style.animation = 'none';
      });

      // Hard-navigate fallback if the timeline / onComplete never fires.
      const safety = window.setTimeout(() => {
        window.location.href = dest;
      }, 2000);

      gsap
        .timeline({
          onComplete: () => {
            window.clearTimeout(safety);
            router.push(dest);
          },
        })
        .addLabel('start')
        .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 0.5, duration: COVER_DUR, ease: 'ArcadiaEase' }, 'start')
        .set([gold, black], { autoAlpha: 1, scaleX: 1, scaleY: 0, transformOrigin: 'center bottom' }, 'start')
        .fromTo(gold, { scaleY: 0 }, { scaleY: 1, duration: COVER_DUR, ease: 'ArcadiaEase' }, 'start')
        .fromTo(black, { scaleY: 0 }, { scaleY: 1, duration: COVER_DUR, ease: 'ArcadiaEase' }, `start+=${STAGGER}`);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return (
    <div className="page-wipe-root" aria-hidden="true">
      <div ref={overlayRef} className="page-wipe-overlay" />
      <div ref={goldRef} className="page-wipe page-wipe-gold" />
      <div ref={blackRef} className="page-wipe page-wipe-black" />
    </div>
  );
}
