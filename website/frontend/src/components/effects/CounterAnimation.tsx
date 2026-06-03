'use client';

import { useEffect, useRef } from 'react';

interface CounterAnimationProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function CounterAnimation({
  target,
  suffix = '',
  duration = 2000,
  className,
}: CounterAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString() + suffix;
      return;
    }

    // Reset to 0 so the count-up is visible. (The span renders the final value
    // on the server — good for SEO / no-JS, and it gives the element real size
    // so the IntersectionObserver below fires reliably.)
    el.textContent = '0' + suffix;

    const run = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;
      const start = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);

    // Safety net: if the observer never reports an intersection (zero-area
    // edge cases, already on-screen, etc.), kick the count-up off anyway.
    const fallback = window.setTimeout(run, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [target, duration, suffix]);

  return (
    <span ref={ref} className={className}>
      {target.toLocaleString() + suffix}
    </span>
  );
}
