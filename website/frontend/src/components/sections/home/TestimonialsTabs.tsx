'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Testimonial = {
  key: 't1' | 't2' | 't3';
  initials: string;
  video?: string;
  poster?: string;
  gradient: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    key: 't1',
    initials: 'ST',
    video: '/videos/testimonial-1.mp4',
    poster: '/images/testimonial-1.jpg',
    gradient: 'linear-gradient(135deg, #1F2A44 0%, #3B5278 60%, #5C7AA8 100%)',
  },
  {
    key: 't2',
    initials: 'ML',
    video: '/videos/testimonial-2.mp4',
    poster: '/images/testimonial-2.jpg',
    gradient: 'linear-gradient(135deg, #2B1F3D 0%, #4F3A6E 55%, #7A5CA8 100%)',
  },
  {
    key: 't3',
    initials: 'AK',
    video: '/videos/testimonial-3.mp4',
    poster: '/images/testimonial-3.jpg',
    gradient: 'linear-gradient(135deg, #1F2D2A 0%, #345E54 55%, #4F8C7C 100%)',
  },
];

export default function TestimonialsTabs() {
  const t = useTranslations('testimonials');
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = TESTIMONIALS[active];

  return (
    <section className="section" id="testimonials">
      <div className="container">
        <div className="testimonials-head">
          <span className="section-label">{t('label')}</span>
          <h2 className="testimonials-title">{t('title')}</h2>
          <p className="testimonials-desc">{t('desc')}</p>
          <div className="testimonial-tabs" role="tablist" aria-label={t('title')}>
            {TESTIMONIALS.map((item, idx) => (
              <button
                key={item.key}
                role="tab"
                type="button"
                aria-selected={active === idx}
                aria-controls="testimonial-panel"
                className={`testimonial-tab ${active === idx ? 'active' : ''}`}
                onClick={() => {
                  setActive(idx);
                  setPlaying(false);
                }}
              >
                {t(`${item.key}.tab`)}
              </button>
            ))}
          </div>
        </div>

        <div
          id="testimonial-panel"
          role="tabpanel"
          className="testimonial-feature"
        >
          <div className="testimonial-feature-text">
            <div className="testimonial-quote-mark" aria-hidden="true">&ldquo;</div>
            <p className="testimonial-feature-quote">{t(`${current.key}.text`)}</p>
            <div className="testimonial-feature-author">
              <div className="testimonial-feature-avatar">{current.initials}</div>
              <div>
                <div className="testimonial-feature-name">{t(`${current.key}.name`)}</div>
                <div className="testimonial-feature-role">{t(`${current.key}.role`)}</div>
              </div>
            </div>
          </div>

          <div
            className="testimonial-feature-video"
            style={{ background: current.gradient }}
          >
            {playing && current.video ? (
              <video
                key={current.key}
                className="testimonial-feature-player"
                src={current.video}
                poster={current.poster}
                controls
                autoPlay
                preload="metadata"
              />
            ) : (
              <button
                type="button"
                className="testimonial-feature-play"
                aria-label={t(`${current.key}.name`)}
                onClick={() => setPlaying(true)}
              >
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                  <circle cx="36" cy="36" r="34" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                  <circle cx="36" cy="36" r="28" fill="rgba(255,255,255,0.12)" />
                  <polygon points="30,24 52,36 30,48" fill="rgba(255,255,255,0.95)" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
