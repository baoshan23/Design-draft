'use client';

import { useEffect, useRef, ReactNode, CSSProperties } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
}

export default function ScrollAnimation({ children, className, style, delay }: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay) {
            el.style.transitionDelay = `${delay}ms`;
          }
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`animate-on-scroll${className ? ` ${className}` : ''}`}
      style={style}
    >
      {children}
    </div>
  );
}
