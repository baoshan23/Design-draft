'use client';

import { useEffect, useState } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';

/**
 * Intercepts clicks on same-page anchor links (`<a href="#id">` or a
 * locale-prefixed link whose hash points at an element on the CURRENT page)
 * and routes them through `lenis.scrollTo` for a smooth glide instead of the
 * browser's instant jump.
 *
 * The landing position is left IDENTICAL to the native jump: we read the
 * target's own `scroll-margin-top` (getComputedStyle resolves the `calc(...)`
 * to px) and pass it as a negative `offset`, so every page's fixed-header /
 * sub-nav clearance is respected automatically — we only add the smoothing.
 *
 * Cross-page links (hash target not present in the current DOM, or a different
 * pathname) are left untouched so the Next.js router navigates normally.
 *
 * Must live INSIDE <ReactLenis> so `useLenis()` can read the instance.
 */
function AnchorScrollHandler() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const samePath = (a: string, b: string) =>
      a.replace(/\/+$/, '') === b.replace(/\/+$/, '');

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const link = (e.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (!url.hash || url.hash === '#') return;
      // Same page only — otherwise let the router navigate.
      if (!samePath(url.pathname, window.location.pathname)) return;

      const id = decodeURIComponent(url.hash.slice(1));
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      lenis.scrollTo(el as HTMLElement, { offset: -margin });
      // Keep the address bar / history in sync without a second jump.
      history.pushState(null, '', url.hash);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lenis]);

  return null;
}

/**
 * Lenis-powered smooth scrolling (go-electra style "丝滑" feel).
 *
 * `root` mode attaches Lenis to the window / documentElement and smooths the
 * NATIVE document scroll — it does NOT transform a wrapper. That's important
 * here: the footer-reveal panel (`position: sticky; bottom: 0`) and the fixed
 * sub-navs keep working exactly as before, and the existing rAF scroll-linked
 * effects (SectionReveal / CtaScrollExpand) still receive native `scroll`
 * events, so nothing else needs to change.
 *
 * Mounted site-wide in [locale]/layout.tsx. Disabled entirely for
 * `prefers-reduced-motion: reduce` users.
 *
 * `allowNestedScroll` lets Lenis auto-detect genuinely scrollable nested
 * containers (modals, sidebars, admin tables — anything `overflow-y:auto`
 * with content taller than its box) and leave the wheel to scroll THEM
 * instead of the page. The MapLibre map is NOT an overflow-scroll container
 * (its wheel = JS zoom, scrollHeight == clientHeight) so it can't be
 * auto-detected — it carries an explicit `data-lenis-prevent` instead.
 */
export default function SmoothScroll() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setEnabled(!mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  if (!enabled) return null;

  return (
    <ReactLenis
      root
      options={{
        // Per-frame interpolation toward the scroll target. Lower = floatier,
        // higher = snappier. 0.09 ≈ go-electra's silky-but-responsive feel.
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 1,
        // Leave touch devices on native momentum scroll (syncTouch tends to
        // feel laggy on mobile); only the mouse wheel is smoothed.
        syncTouch: false,
        // Let the wheel scroll nested overflow:auto containers (modals,
        // sidebars, tables) natively instead of hijacking the page.
        allowNestedScroll: true,
      }}
    >
      <AnchorScrollHandler />
    </ReactLenis>
  );
}
