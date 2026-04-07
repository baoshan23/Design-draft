'use client';

import { useEffect, RefObject } from 'react';

export function useMagneticEffect(ref: RefObject<HTMLElement | null>, strength: number = 0.3): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      // Only activate within proximity
      const distance = Math.sqrt(distX * distX + distY * distY);
      const maxDist = Math.max(rect.width, rect.height) * 1.5;

      if (distance < maxDist) {
        const pullX = distX * strength;
        const pullY = distY * strength;
        el.style.transform = `translate(${pullX}px, ${pullY}px)`;
      }
    };

    const handleMouseLeave = () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { el.style.transition = ''; }, 400);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    // Also listen on parent for proximity detection
    const parent = el.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      if (parent) parent.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref, strength]);
}
