'use client';

import { useEffect } from 'react';

export default function ScrollResetOnLoad() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, []);

  return null;
}
