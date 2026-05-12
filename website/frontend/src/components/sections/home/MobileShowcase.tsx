'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import { Link } from '@/i18n/navigation';

type Feature = {
  src: string;
  title: string;
  desc: string;
  icon: ReactNode;
};

const IconScan = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <rect x="7" y="7" width="10" height="10" rx="1" />
  </svg>
);

const IconMap = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconActivity = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const IconFile = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

export default function MobileShowcase() {
  const t = useTranslations('mobileShowcase');

  const features: Feature[] = [
    { src: '/images/mobile-features/feature-home.webp',     title: t('b1Title'), desc: t('b1'), icon: IconScan },
    { src: '/images/mobile-features/feature-map.webp',      title: t('b2Title'), desc: t('b2'), icon: IconMap },
    { src: '/images/mobile-features/feature-charging.webp', title: t('b3Title'), desc: t('b3'), icon: IconActivity },
    { src: '/images/mobile-features/feature-orders.webp',   title: t('b4Title'), desc: t('b4'), icon: IconFile },
  ];

  return (
    <section className="section section-alt mobile-showcase">
      <div className="container">
        <ScrollAnimation>
          <div className="section-header">
            <span className="section-label">{t('label')}</span>
            <h2>{t('title')}</h2>
            <p>{t('desc')}</p>
          </div>
        </ScrollAnimation>
        <div className="mobile-feature-grid">
          {features.map((f) => (
            <div className="mobile-feature-card" key={f.src}>
              <div className="mobile-feature-img">
                <div className="phone-frame">
                  <Image
                    src={f.src}
                    alt={f.title}
                    width={500}
                    height={1083}
                    sizes="(max-width: 720px) 80vw, 240px"
                  />
                </div>
              </div>
              <div className="mobile-feature-text">
                <h3>
                  <span className="mobile-feature-icon" aria-hidden="true">{f.icon}</span>
                  <span>{f.title}</span>
                </h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mobile-showcase-cta">
          <Link href="/b2c" className="btn btn-primary btn-lg">{t('cta')}</Link>
        </div>
      </div>
    </section>
  );
}
