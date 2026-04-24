'use client';

import { useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import { Link } from '@/i18n/navigation';
import RelatedPages from '@/components/sections/RelatedPages';

export default function CareersPageClient() {
    const t = useTranslations('careersPage');

    const roles = ['backend', 'frontend', 'mobile', 'product'] as const;
    const steps = ['apply', 'screen', 'interview', 'offer'] as const;

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
                                <Link href="/about" className="btn btn-secondary btn-lg">{t('secondaryCta')}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <ScrollAnimation>
                        <div className="section-header">
                            <span className="section-label">{t('sections.why.label')}</span>
                            <h2>{t('sections.why.title')}</h2>
                            <p>{t('sections.why.desc')}</p>
                        </div>
                    </ScrollAnimation>

                    <ScrollAnimation>
                        <div className="grid grid-3">
                            {['impact', 'craft', 'growth'].map((k) => (
                                <div key={k} className="card glass-card">
                                    <h3>{t(`perks.${k}.title`)}</h3>
                                    <p>{t(`perks.${k}.desc`)}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <ScrollAnimation>
                        <div className="section-header">
                            <span className="section-label">{t('sections.roles.label')}</span>
                            <h2>{t('sections.roles.title')}</h2>
                            <p>{t('sections.roles.desc')}</p>
                        </div>
                    </ScrollAnimation>

                    <ScrollAnimation>
                        <div className="grid grid-2">
                            {roles.map((r) => (
                                <div key={r} className="card glass-card">
                                    <h3>{t(`roles.${r}.title`)}</h3>
                                    <p>{t(`roles.${r}.desc`)}</p>
                                    <ul>
                                        <li>{t(`roles.${r}.li1`)}</li>
                                        <li>{t(`roles.${r}.li2`)}</li>
                                        <li>{t(`roles.${r}.li3`)}</li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <ScrollAnimation>
                        <div className="card glass-card simple-page-card">
                            <div className="docs-content">
                                <h2>{t('sections.process.title')}</h2>
                                <p>{t('sections.process.desc')}</p>
                                <ol>
                                    {steps.map((s) => (
                                        <li key={s}>{t(`process.${s}`)}</li>
                                    ))}
                                </ol>

                                <div className="docs-callout tip">
                                    <div className="docs-callout-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
                                            <path d="M12 16v-4" />
                                            <path d="M12 8h.01" />
                                        </svg>
                                    </div>
                                    <div>{t('callout')}</div>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            <RelatedPages items={['about', 'partners', 'blog', 'contact']} />
        </>
    );
}
