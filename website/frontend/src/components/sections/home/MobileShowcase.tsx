'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Shot = { src: string; alt: string };

const SCREENS: Shot[] = [
  { src: '/images/mobileapp/mobile-home.png',    alt: 'GCSS driver app — home' },
  { src: '/images/mobileapp/mobile-profile.png', alt: 'Account / login' },
  { src: '/images/mobileapp/mobile-map.png',     alt: 'Charging station map' },
];

const SIZES = '(max-width: 960px) 60vw, 280px';

export default function MobileShowcase() {
  const t = useTranslations('mobileShowcase');
  const [order, setOrder] = useState<number[]>(() => SCREENS.map((_, i) => i));

  const bringToFront = (i: number) => {
    setOrder((prev) => {
      const at = prev.indexOf(i);
      if (at <= 0) return prev;
      const next = [...prev];
      next.splice(at, 1);
      next.unshift(i);
      return next;
    });
  };

  const frontIndex = order[0];
  const front = SCREENS[frontIndex];

  return (
    <section className="section mobile-showcase">
      <div className="container mobile-showcase-grid">
        <div className="mobile-showcase-stack">
          <div className="mobile-stack">
            <div className="mobile-stack-deck">
              {order.slice(1).reverse().map((cardIndex, i, arr) => {
                const layer = arr.length - i; // 4..1
                const shot = SCREENS[cardIndex];
                return (
                  <button
                    key={cardIndex}
                    type="button"
                    className={`mobile-phone mobile-phone--back mobile-phone-back--${layer}`}
                    onClick={() => bringToFront(cardIndex)}
                    aria-label={`Bring ${shot.alt} to front`}
                  >
                    <Image
                      src={shot.src}
                      alt=""
                      width={750}
                      height={1624}
                      sizes={SIZES}
                    />
                  </button>
                );
              })}
            </div>
            <div className="mobile-phone mobile-phone--front" key={frontIndex}>
              <Image
                src={front.src}
                alt={front.alt}
                width={750}
                height={1624}
                sizes={SIZES}
              />
            </div>
          </div>
        </div>

        <div className="mobile-showcase-text">
          <span className="section-label">{t('label')}</span>
          <h2>{t('title')}</h2>
          <p>{t('desc')}</p>
          <ul className="mobile-showcase-bullets">
            <li>{t('b1')}</li>
            <li>{t('b2')}</li>
            <li>{t('b3')}</li>
            <li>{t('b4')}</li>
          </ul>
          <div className="mobile-showcase-cta">
            <Link href="/b2c" className="btn btn-primary btn-lg">{t('cta')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
