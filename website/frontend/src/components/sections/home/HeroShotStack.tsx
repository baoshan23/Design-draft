'use client';

import { useState } from 'react';
import Image from 'next/image';

type Shot = { src: string; alt: string };

// Order represents the initial render: index 0 is the front card; the rest
// are back--1, back--2, back--3, back--4 (deepest). User clicks any back
// card to bring it to the front; remaining cards keep their relative order.
const SHOTS: Shot[] = [
  { src: '/images/dashboard-home.png',      alt: 'GCSS dashboard preview' },
  { src: '/images/dashboard-merchants.png', alt: 'Merchant business overview' },
  { src: '/images/dashboard-home-alt.png',  alt: 'Charging distribution dashboard' },
  { src: '/images/dashboard-stations.png',  alt: 'Charging stations table' },
];

const SIZES = '(max-width: 960px) 100vw, 560px';

export default function HeroShotStack() {
  const [order, setOrder] = useState<number[]>(() => SHOTS.map((_, i) => i));

  const bringToFront = (cardIndex: number) => {
    setOrder((prev) => {
      const at = prev.indexOf(cardIndex);
      if (at <= 0) return prev;
      const next = [...prev];
      next.splice(at, 1);
      next.unshift(cardIndex);
      return next;
    });
  };

  const frontIndex = order[0];
  const front = SHOTS[frontIndex];

  return (
    <div className="hero-shot">
      <div className="hero-shot-deck">
        {/* Render back cards deepest-first so DOM order matches paint order
            (back--4 painted before back--1) — matches what z-index expects. */}
        {order.slice(1).reverse().map((cardIndex, i, arr) => {
          const layer = arr.length - i; // 4..1
          const shot = SHOTS[cardIndex];
          return (
            <button
              key={cardIndex}
              type="button"
              className={`hero-shot-back hero-shot-back--${layer}`}
              onClick={() => bringToFront(cardIndex)}
              aria-label={`Bring ${shot.alt} to front`}
            >
              <Image
                src={shot.src}
                alt=""
                width={1200}
                height={760}
                sizes={SIZES}
              />
            </button>
          );
        })}
      </div>
      <div className="hero-shot-front" key={frontIndex}>
        <Image
          src={front.src}
          alt={front.alt}
          width={1200}
          height={760}
          priority={frontIndex === 0}
          sizes={SIZES}
        />
      </div>
    </div>
  );
}
