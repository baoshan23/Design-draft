import { useEffect } from 'react';

const CARD_CLASSES = ['card', 'model-card'];
const MAX_ANCESTOR_DEPTH = 3;

function findCardElement(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) return null;

  let el: HTMLElement | null = target;
  for (let depth = 0; depth <= MAX_ANCESTOR_DEPTH; depth++) {
    if (!el) break;
    if (CARD_CLASSES.some((cls) => el!.classList.contains(cls))) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

export function useGlobalCardGlow(): void {
  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return; // already scheduled, skip

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const card = findCardElement(e.target);
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);
}
