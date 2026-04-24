'use client';

import { useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import { Link } from '@/i18n/navigation';
import RelatedPages from '@/components/sections/RelatedPages';

export default function PartnersPageClient() {
    const t = useTranslations('partnersPage');

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
                            {['oem', 'payments', 'integrators'].map((k) => (
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
                                <h2>{t('sections.benefits.title')}</h2>
                                <ul>
                                    <li>{t('sections.benefits.li1')}</li>
                                    <li>{t('sections.benefits.li2')}</li>
                                    <li>{t('sections.benefits.li3')}</li>
                                </ul>

                                <h2>{t('sections.getStarted.title')}</h2>
                                <p>{t('sections.getStarted.p1')}</p>

                                <div className="hero-buttons simple-page-buttons-tight">
                                    <Link href="/contact" className="btn btn-primary">{t('buttons.contact')}</Link>
                                    <Link href="/pricing" className="btn btn-secondary">{t('buttons.pricing')}</Link>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            <RelatedPages items={['about', 'careers', 'b2b', 'contact']} />
        </>
    );
}
