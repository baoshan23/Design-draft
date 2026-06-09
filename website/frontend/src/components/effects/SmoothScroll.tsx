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
 * Mounted on the homepage only (per request). Disabled entirely for
 * `prefers-reduced-motion: reduce` users.
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
      }}
    />
  );
}
