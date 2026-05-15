'use client';

import { useEffect } from 'react';

export default function ScrollResetOnLoad() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    const hash = window.location.hash;
    if (hash && hash !== '#overview') return;
    window.scrollTo(0, 0);
  }, []);

  return null;
}
