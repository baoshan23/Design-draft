'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
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
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <rect x="7" y="7" width="10" height="10" rx="1" />
  </svg>
);

const IconMap = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconActivity = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const IconFile = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

export default function MobileShowcase() {
  const t = useTranslations('mobileShowcase');
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const directionRef = useRef(1);

  const features: Feature[] = [
    { src: '/images/mobile-features/feature-home.webp',     title: t('b1Title'), desc: t('b1'), icon: IconScan },
    { src: '/images/mobile-features/feature-map.webp',      title: t('b2Title'), desc: t('b2'), icon: IconMap },
    { src: '/images/mobile-features/feature-charging.webp', title: t('b3Title'), desc: t('b3'), icon: IconActivity },
    { src: '/images/mobile-features/feature-orders.webp',   title: t('b4Title'), desc: t('b4'), icon: IconFile },
  ];

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => {
        const total = features.length;
        const next = prev + directionRef.current;
        if (next >= total) {
          directionRef.current = -1;
          return prev - 1;
        }
        if (next < 0) {
          directionRef.current = 1;
          return prev + 1;
        }
        return next;
      });
    }, 3500);
    return () => window.clearInterval(id);
  }, [paused, features.length]);

  return (
    <section className="section section-alt mobile-showcase">
      <div className="container">
        <div className="mobile-showcase-grid">
          <ScrollAnimation>
            <div className="mobile-showcase-info">
              <span className="section-label">{t('label')}</span>
              <h2>{t('title')}</h2>
              <p>{t('desc')}</p>
              <ul
                className="mobile-showcase-list"
                role="tablist"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {features.map((f, i) => {
                  const isActive = i === active;
                  return (
                    <li key={f.src}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`mobile-showcase-list-item ${isActive ? 'is-active' : ''}`}
                        onClick={() => setActive(i)}
                        onMouseEnter={() => setActive(i)}
                      >
                        <span className="mobile-showcase-list-icon" aria-hidden="true">{f.icon}</span>
                        <div className="mobile-showcase-list-text">
                          <strong>{f.title}</strong>
                          <span>{f.desc}</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Link href="/b2c" className="btn btn-primary mobile-showcase-cta-btn">{t('cta')}</Link>
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <div className="mobile-showcase-phone-wrap">
              <div className="mobile-showcase-phone" aria-hidden="true">
                <div className="mobile-showcase-phone-notch" />
                <div
                  className="mobile-showcase-phone-strip"
                  style={{ transform: `translateX(-${active * 100}%)` }}
                >
                  {features.map((f, i) => (
                    <div key={f.src} className="mobile-showcase-phone-screen">
                      <Image
                        src={f.src}
                        alt={f.title}
                        width={500}
                        height={1083}
                        sizes="(max-width: 960px) 80vw, 320px"
                        priority={i === 0}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
