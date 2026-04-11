'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import ScrollAnimation from '@/components/effects/ScrollAnimation';

const FAQ_IDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const;
const CATEGORIES = ['all', 'general', 'technical', 'billing', 'integration'] as const;

export default function FaqPage() {
  const t = useTranslations('faq');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const items = FAQ_IDS.map((id) => ({
    id,
    q: t(`items.q${id}`),
    a: t(`items.a${id}`),
    category: t(`items.c${id}`),
  }));

  const filtered = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      !search ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Hero */}
      <section className="section mesh-bg" style={{ paddingTop: 140, paddingBottom: 60, textAlign: 'center' }}>
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('label')}</span>
              <h1>
                {t('title')} <span className="gradient-text">{t('title2')}</span>
              </h1>
              <p>{t('desc')}</p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 20 }}>
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
          <ScrollAnimation>
            <div style={{ marginBottom: 24 }}>
              <input
                type="text"
                className="faq-search"
                placeholder={t('search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="faq-categories">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`faq-cat-btn${activeCategory === cat ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {t(`categories.${cat}`)}
                </button>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 60 }}>
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.6 }}>{t('noResults')}</p>
          ) : (
            <div className="faq-list">
              {filtered.map((item) => (
                <ScrollAnimation key={item.id}>
                  <div
                    className={`faq-item${openId === item.id ? ' open' : ''}`}
                    onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  >
                    <div className="faq-question">
                      <span>{item.q}</span>
                      <svg
                        className="faq-chevron"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    <div className="faq-answer">
                      <p>{item.a}</p>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section mesh-bg" style={{ paddingTop: 60, paddingBottom: 80, textAlign: 'center' }}>
        <div className="container">
          <ScrollAnimation>
            <h2>{t('cta.title')}</h2>
            <p style={{ marginBottom: 32, opacity: 0.8 }}>{t('cta.desc')}</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary">{t('cta.btn1')}</Link>
              <Link href="/forum" className="btn btn-secondary">{t('cta.btn2')}</Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </>
  );
}
