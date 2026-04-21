'use client';

import { useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import { Link } from '@/i18n/navigation';

export default function AboutPageClient() {
    const t = useTranslations('aboutPage');

    return (
        <>
            <section className="hero mesh-bg">
                <div className="container">
                    <div className="hero-content">
                        <div>
                            <span className="section-label">{t('label')}</span>
                            <h1 className="hero-title">{t('title')}</h1>
                            <p className="hero-desc">{t('subtitle')}</p>
                            <div className="hero-buttons">
                                <Link href="/contact" className="btn btn-primary btn-lg">{t('cta')}</Link>
                                <Link href="/b2c" className="btn btn-secondary btn-lg">{t('secondaryCta')}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <ScrollAnimation>
                        <div className="grid grid-3">
                            {['mission', 'build', 'principles'].map((k) => (
                                <div key={k} className="card glass-card">
                                    <h3>{t(`cards.${k}.title`)}</h3>
                                    <p>{t(`cards.${k}.desc`)}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <ScrollAnimation>
                        <div className="card glass-card simple-page-card">
                            <div className="docs-content">
                                <h2>{t('sections.why.title')}</h2>
                                <p>{t('sections.why.p1')}</p>

                                <h2>{t('sections.values.title')}</h2>
                                <ul>
                                    <li>{t('sections.values.li1')}</li>
                                    <li>{t('sections.values.li2')}</li>
                                    <li>{t('sections.values.li3')}</li>
                                </ul>

                                <h2>{t('sections.global.title')}</h2>
                                <p>{t('sections.global.p1')}</p>

                                <div className="docs-callout info">
                                    <div className="docs-callout-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10a7 7 0 0 0-14 0v8a3 3 0 0 0 6 0V10" />
                                            <path d="M9 18h6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <strong>{t('callout.title')}</strong>
                                        <div>{t('callout.desc')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </section>
        </>
    );
}
