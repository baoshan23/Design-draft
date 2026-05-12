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
    <section className="section section-alt mobile-showcase">
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
            <li>
              <span className="bullet-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <rect x="7" y="7" width="10" height="10" rx="1" />
                </svg>
              </span>
              <span>{t('b1')}</span>
            </li>
            <li>
              <span className="bullet-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span>{t('b2')}</span>
            </li>
            <li>
              <span className="bullet-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </span>
              <span>{t('b3')}</span>
            </li>
            <li>
              <span className="bullet-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </span>
              <span>{t('b4')}</span>
            </li>
          </ul>
          <div className="mobile-showcase-cta">
            <Link href="/b2c" className="btn btn-primary btn-lg">{t('cta')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
