'use client';

import { useEffect } from 'react';

/**
 * Per-section scroll transitions for the home / b2b / b2c pages.
 *
 * Every white → grey background switch does a "灰色块叠盖" cover-rise: the grey
 * block (or the inset grey panel inside a white section) slides up into place
 * as it scrolls in — pure transform, OPAQUE, no opacity fade, no shadow, so it
 * reads as a clean colour-block cover, not a translucent ghost. All other
 * colour changes (e.g. grey → white) keep a gentle fade-up; white → white is
 * seamless (no animation).
 *
 * - The hero, the trusted-bar marquee, the full-bleed CTA banner, and the b2c
 *   sticky stacking-deck section (#features) are skipped.
 * - Reduced motion: nothing is hidden / animated.
 */
export default function SectionReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const skip = (el: HTMLElement) =>
      el.classList.contains('hero') ||
      el.classList.contains('product-hero') ||
      el.classList.contains('trusted-bar') ||
      el.classList.contains('cta-banner') ||
      el.querySelector('.b2c-feature-stack') !== null;

    // Effective bg of EVERY section (transparent → white, since the page is
    // white). The site grey is var(--dark) = #F1F2F4 = rgb(241, 242, 244).
    const WHITE = 'rgb(255, 255, 255)';
    const GREY = 'rgb(241, 242, 244)';
    const norm = (c: string) =>
      c === 'rgba(0, 0, 0, 0)' || c === 'transparent' ? WHITE : c;
    const allSections = Array.from(document.querySelectorAll<HTMLElement>('section'));
    const bgs = allSections.map((s) => norm(getComputedStyle(s).backgroundColor));
    const vh0 = window.innerHeight;
    const isB2b = !!document.querySelector('.product-hero.particles-bg');

    // Gentle fade-up for NON-cover colour changes (grey → white, etc.).
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    // The grey blocks whose cover-rise is tied DIRECTLY to the scroll wheel:
    // as you scroll, each grey block slides UP from below and 叠盖s (covers) the
    // white block above it. `el` is the thing we move (the whole grey section,
    // or the inset grey `.container` inside a white section).
    const covers: { sec: HTMLElement; el: HTMLElement }[] = [];

    allSections.forEach((sec, i) => {
      if (skip(sec)) return;

      const secBg = bgs[i];
      const prevBg = i > 0 ? bgs[i - 1] : WHITE;

      // Inset grey panel: a WHITE section whose inner `.container` is the grey
      // block (#how-it-works, #demo) — the section bg reads white like the one
      // above it, so the bg compare alone would miss it.
      const panel = sec.querySelector<HTMLElement>('.container');
      const panelGrey =
        secBg === WHITE && !!panel && norm(getComputedStyle(panel).backgroundColor) === GREY;

      // b2b 营收(white) → 功能(#features): the gradient band has no bg-COLOR
      // (reads white), so the white→grey compare misses it — cover it too.
      const featCover = isB2b && sec.id === 'features';

      // Homepage testimonials(white) → CTA(grey): here the WHITE is the one with
      // rounded corners sitting on TOP (per user 白色做圆角), so the grey CTA must
      // NOT cover-rise — it stays put behind the white. Skip it from the cover set.
      const isHomeCta =
        sec.classList.contains('cta-section') &&
        (sec.previousElementSibling as HTMLElement | null)?.id === 'testimonials';
      if (isHomeCta) return;

      // #demo (系统演示) lives inside a `.section-stack`: the previous section
      // PINS (sticky) and #demo scrolls up over it (z-index:3 + negative margin),
      // so the sticky stack ALREADY produces the 叠盖 cover. The scroll-linked
      // cover-rise below would additionally shove the inset grey panel DOWN by
      // COVER_OFFSET (120px) during scroll-in, exposing the white section bg
      // above the grey panel — that's the white strip the user sees covering
      // first. Skip #demo so ONLY the grey block covers, directly. (user:
      // "做切屏叠盖时，直接是灰色块背景去叠盖")
      if (sec.id === 'demo') return;

      if (featCover || (secBg === GREY && prevBg === WHITE)) {
        covers.push({ sec, el: sec }); // full-bleed grey block
      } else if (panelGrey) {
        covers.push({ sec, el: panel as HTMLElement }); // inset grey panel
      } else if (secBg !== prevBg && sec.getBoundingClientRect().top >= vh0 * 0.85) {
        // other colour changes keep the gentle one-shot fade-up
        sec.classList.add('section-reveal');
        io.observe(sec);
      }
    });

    // Scroll-linked cover. Progress 0→1 as the section rises through the lower
    // part of the viewport; the grey block is pushed DOWN by COVER_OFFSET at
    // p=0 (revealing the white above) and slides up to its resting / overlapped
    // position (y=0) at p=1 — so the cover tracks the wheel, both directions.
    const COVER_OFFSET = 120;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const enter = vh * 0.95; // sec top here → p=0 (grey fully lowered)
      const settle = vh * 0.42; // sec top here → p=1 (grey fully risen / covering)
      for (const c of covers) {
        const top = c.sec.getBoundingClientRect().top;
        let p = (enter - top) / (enter - settle);
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        const y = COVER_OFFSET * (1 - p);
        if (y > 0.5) {
          c.el.style.transform = `translateY(${y.toFixed(1)}px)`;
          c.el.style.willChange = 'transform';
        } else {
          c.el.style.transform = '';
          c.el.style.willChange = '';
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
