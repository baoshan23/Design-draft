'use client';

import { useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import { Link } from '@/i18n/navigation';

export default function PrivacyPageClient() {
    const t = useTranslations('privacyPage');

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
                                <Link href="/contact" className="btn btn-primary btn-lg">
                                    {t('cta')}
                                </Link>
                                <Link href="/terms" className="btn btn-secondary btn-lg">
                                    {t('secondaryCta')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <ScrollAnimation>
                        <div className="card glass-card simple-page-card narrow">
                            <div className="docs-content">
                                <p>{t('effective')}</p>

                                <h2>{t('sections.collect.title')}</h2>
                                <p>{t('sections.collect.p1')}</p>
                                <ul>
                                    <li>{t('sections.collect.li1')}</li>
                                    <li>{t('sections.collect.li2')}</li>
                                    <li>{t('sections.collect.li3')}</li>
                                </ul>

                                <h2>{t('sections.use.title')}</h2>
                                <p>{t('sections.use.p1')}</p>
                                <ul>
                                    <li>{t('sections.use.li1')}</li>
                                    <li>{t('sections.use.li2')}</li>
                                    <li>{t('sections.use.li3')}</li>
                                </ul>

                                <h2>{t('sections.security.title')}</h2>
                                <p>{t('sections.security.p1')}</p>

                                <h2>{t('sections.cookies.title')}</h2>
                                <p>{t('sections.cookies.p1')}</p>

                                <h2>{t('sections.rights.title')}</h2>
                                <p>{t('sections.rights.p1')}</p>

                                <h2>{t('sections.contact.title')}</h2>
                                <p>{t('sections.contact.p1')}</p>

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
        </>
    );
}
