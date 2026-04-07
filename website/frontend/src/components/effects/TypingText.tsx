'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { prepare, layout } from '@chenglou/pretext';

interface TypingTextProps {
  words: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
  font?: string;
}

export default function TypingText({
  words,
  typingSpeed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
  className,
  font = '700 clamp(2rem, 5vw, 3.5rem) Inter',
}: TypingTextProps) {
  const [text, setText] = useState('');
  const [minWidth, setMinWidth] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const wordIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReducedMotion(true);
      setText(words[0] || '');
    }
  }, [words]);

  // Use pretext to measure the widest word so the container doesn't jump
  useEffect(() => {
    try {
      let maxWidth = 0;
      for (const word of words) {
        const prepared = prepare(word, font);
        // Use a very wide container to get single-line width, lineCount=1 means it fits
        const result = layout(prepared, 10000, 48);
        // The width of the text is approximated by checking when it wraps
        // For single-line text, we binary search for the minimum width
        let lo = 0, hi = 10000;
        while (hi - lo > 1) {
          const mid = (lo + hi) / 2;
          const test = layout(prepared, mid, 48);
          if (test.lineCount <= 1) hi = mid;
          else lo = mid;
        }
        if (hi > maxWidth) maxWidth = hi;
      }
      setMinWidth(Math.ceil(maxWidth));
    } catch {
      // Fallback: no min-width if pretext measurement fails
    }
  }, [words, font]);

  const tick = useCallback(() => {
    const currentWord = words[wordIndex.current];

    if (isDeleting.current) {
      charIndex.current--;
      setText(currentWord.substring(0, charIndex.current));

      if (charIndex.current === 0) {
        isDeleting.current = false;
        wordIndex.current = (wordIndex.current + 1) % words.length;
        timeoutRef.current = setTimeout(tick, typingSpeed);
      } else {
        timeoutRef.current = setTimeout(tick, deleteSpeed);
      }
    } else {
      charIndex.current++;
      setText(currentWord.substring(0, charIndex.current));

      if (charIndex.current === currentWord.length) {
        isDeleting.current = true;
        timeoutRef.current = setTimeout(tick, pauseDuration);
      } else {
        timeoutRef.current = setTimeout(tick, typingSpeed);
      }
    }
  }, [words, typingSpeed, deleteSpeed, pauseDuration]);

  useEffect(() => {
    if (reducedMotion) return;
    timeoutRef.current = setTimeout(tick, typingSpeed);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [tick, typingSpeed, reducedMotion]);

  return (
    <span
      className={`gradient-text-animated typing-text${className ? ` ${className}` : ''}`}
      style={minWidth > 0 ? { display: 'inline-block', minWidth: `${minWidth}px` } : undefined}
    >
      {text}
    </span>
  );
}
