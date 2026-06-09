'use client';

import { useEffect, useState } from 'react';
import { ReactLenis } from 'lenis/react';

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
    />
  );
}
