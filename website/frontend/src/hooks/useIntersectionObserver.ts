import { useEffect, useState, RefObject } from 'react';

interface Options {
  threshold?: number;
  rootMargin?: string;
}

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options: Options = {},
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(el);
        }
      },
      { threshold: options.threshold ?? 0, rootMargin: options.rootMargin ?? '0px' },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, options.threshold, options.rootMargin]);

  return isIntersecting;
}
