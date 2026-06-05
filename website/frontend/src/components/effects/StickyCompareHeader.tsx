'use client';

import { useEffect } from 'react';

/**
 * Bulletproof sticky header for the pricing comparison table.
 *
 * CSS `position: sticky` on the <th> works in modern browsers, but can silently
 * fail (old engines, an overflow:auto ancestor, etc.). This pins a `position:
 * fixed` COPY of the header row under the site nav as a guaranteed fallback.
 *
 * Auto-detecting: while the real (CSS-sticky) header is being held at the nav
 * line, the fixed copy stays hidden — so when sticky DOES work there is no
 * double header. The copy only appears if the real header scrolls ABOVE the
 * pin line (i.e. CSS sticky didn't hold it).
 */
export default function StickyCompareHeader() {
  useEffect(() => {
    const table = document.querySelector<HTMLTableElement>('.comparison-table');
    const thead = table?.querySelector<HTMLTableSectionElement>('thead');
    if (!table || !thead) return;

    const headerH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height')
      ) || 72;

    // A fixed-position table holding only a clone of the header row.
    const clone = document.createElement('table');
    clone.className = `${table.className} comparison-sticky-clone`;
    clone.setAttribute('aria-hidden', 'true');
    clone.appendChild(thead.cloneNode(true));
    clone.style.cssText =
      'position:fixed;z-index:40;margin:0;display:none;table-layout:fixed;border-collapse:collapse;';
    clone.style.top = `${headerH}px`;
    document.body.appendChild(clone);

    let raf = 0;
    const sync = () => {
      raf = 0;
      const r = table.getBoundingClientRect();
      const tr = thead.getBoundingClientRect();
      const theadH = tr.height;
      // Show the fixed copy only when the table is in view AND the real header
      // has scrolled above the pin line (CSS sticky failed to hold it there).
      const tableSpansLine = r.top < headerH && r.bottom > headerH + theadH;
      const realHeaderScrolledPast = tr.top < headerH - 1;
      if (tableSpansLine && realHeaderScrolledPast) {
        clone.style.display = '';
        clone.style.left = `${r.left}px`;
        clone.style.width = `${r.width}px`;
      } else {
        clone.style.display = 'none';
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      clone.remove();
    };
  }, []);

  return null;
}
