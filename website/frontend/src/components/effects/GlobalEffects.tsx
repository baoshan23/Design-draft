'use client';

import { useEffect } from 'react';
import { useGlobalCardGlow } from '@/hooks/useGlobalCardGlow';

const LOCALES = ['en', 'zh'];

/**
 * On a full page reload (F5 / browser refresh / direct hard-load) anywhere on
 * the site, send the visitor back to the homepage first screen. Client-side
 * (router) navigation between pages is unaffected — only an actual document
 * reload triggers the jump. Detected via the Navigation Timing API.
 */
function useRefreshToHome() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const navEntry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    // Fallback to the deprecated API for older browsers.
    const legacyType =
      (performance as unknown as { navigation?: { type?: number } }).navigation?.type;
    const isReload = navEntry ? navEntry.type === 'reload' : legacyType === 1;
    if (!isReload) return;

    const segments = window.location.pathname.split('/').filter(Boolean);
    const locale = LOCALES.includes(segments[0]) ? segments[0] : LOCALES[0];
    const home = `/${locale}`;

    // Already on the homepage → let ScrollResetOnLoad pin the first screen.
    if (window.location.pathname === home) return;

    window.location.replace(home);
  }, []);
}

export default function GlobalEffects() {
  useGlobalCardGlow();
  useRefreshToHome();
  return null;
}
