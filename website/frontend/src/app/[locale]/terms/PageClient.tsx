'use client';

import { useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import { Link } from '@/i18n/navigation';

export default function TermsPageClient() {
    const t = useTranslations('termsPage');

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
                                <Link href="/privacy" className="btn btn-secondary btn-lg">{t('secondaryCta')}</Link>
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

                                <h2>{t('sections.accept.title')}</h2>
                                <p>{t('sections.accept.p1')}</p>

                                <h2>{t('sections.accounts.title')}</h2>
                                <p>{t('sections.accounts.p1')}</p>
                                <ul>
                                    <li>{t('sections.accounts.li1')}</li>
                                    <li>{t('sections.accounts.li2')}</li>
                                    <li>{t('sections.accounts.li3')}</li>
                                </ul>

                                <h2>{t('sections.license.title')}</h2>
                                <p>{t('sections.license.p1')}</p>

                                <h2>{t('sections.use.title')}</h2>
                                <p>{t('sections.use.p1')}</p>
                                <ul>
                                    <li>{t('sections.use.li1')}</li>
                                    <li>{t('sections.use.li2')}</li>
                                    <li>{t('sections.use.li3')}</li>
                                </ul>

                                <h2>{t('sections.availability.title')}</h2>
                                <p>{t('sections.availability.p1')}</p>

                                <h2>{t('sections.liability.title')}</h2>
                                <p>{t('sections.liability.p1')}</p>

                                <h2>{t('sections.contact.title')}</h2>
                                <p>{t('sections.contact.p1')}</p>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </section>
        </>
    );
}
