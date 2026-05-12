'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import { Link } from '@/i18n/navigation';

type Feature = {
  src: string;
  title: string;
  desc: string;
};

export default function MobileShowcase() {
  const t = useTranslations('mobileShowcase');

  const features: Feature[] = [
    { src: '/images/mobile-features/feature-home.webp',     title: t('b1Title'), desc: t('b1') },
    { src: '/images/mobile-features/feature-map.webp',      title: t('b2Title'), desc: t('b2') },
    { src: '/images/mobile-features/feature-charging.webp', title: t('b3Title'), desc: t('b3') },
    { src: '/images/mobile-features/feature-orders.webp',   title: t('b4Title'), desc: t('b4') },
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
                <h3>{f.title}</h3>
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
