'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';

type TabCard = {
  icon: ReactNode;
  title: string;
  desc: string;
  image: string;
};

const ArrowIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

export default function MobileHeroTabs() {
  const t = useTranslations('index.mobile');
  const [active, setActive] = useState(0);

  const cards: TabCard[] = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" stroke="#FEBF1D" />
          <rect x="14" y="3" width="7" height="7" stroke="#181818" />
          <rect x="3" y="14" width="7" height="7" stroke="#181818" />
          <rect x="14" y="14" width="3" height="3" stroke="#FEBF1D" />
          <rect x="18" y="18" width="3" height="3" stroke="#FEBF1D" />
        </svg>
      ),
      title: t('card1.title'),
      desc: t('card1.desc'),
      image: '/images/Mobile_home.png',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#FEBF1D" />
          <circle cx="12" cy="10" r="3" stroke="#181818" />
        </svg>
      ),
      title: t('card2.title'),
      desc: t('card2.desc'),
      image: '/images/Mobile-Map.png',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#181818" />
          <circle cx="9" cy="7" r="4" stroke="#FEBF1D" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#181818" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#FEBF1D" />
        </svg>
      ),
      title: t('card3.title'),
      desc: t('card3.desc'),
      image: '/images/App_login_iphone.png',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="#FEBF1D" />
        </svg>
      ),
      title: t('card4.title'),
      desc: t('card4.desc'),
      image: '/images/mobile_ charge.png',
    },
  ];

  return (
    <div className="mobile-hero-grid">
      <ScrollAnimation>
        <div className="mobile-hero-cta">
          <div className="mobile-hero-cta-text">
            <h3>{t('title')}</h3>
            <p>{t('desc')}</p>
          </div>
          <div className="mobile-hero-phone-wrap">
            <div className="mobile-hero-phone-frame" aria-hidden="true">
              <div className="mobile-hero-phone-notch" />
              {cards.map((c, i) => (
                <div
                  key={c.image}
                  className={`mobile-hero-phone-screen ${i === active ? 'is-active' : ''}`}
                >
                  <Image
                    src={c.image}
                    alt={c.title}
                    width={500}
                    height={1083}
                    sizes="(max-width: 960px) 60vw, 220px"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollAnimation>
      <ScrollAnimation>
        <div className="mobile-hero-cards" role="tablist">
          {cards.map((c, i) => (
            <button
              key={c.image}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`mobile-hero-card ${i === active ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
            >
              <span className="mobile-hero-card-icon" aria-hidden="true">{c.icon}</span>
              <span className="mobile-hero-card-arrow">{ArrowIcon}</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </button>
          ))}
        </div>
      </ScrollAnimation>
    </div>
  );
}
