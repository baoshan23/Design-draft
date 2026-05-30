'use client';

import { useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import { useDiagramModal } from './DiagramModal';

export default function BusinessModelsSection() {
    const t = useTranslations();
    const { openDiagramModal } = useDiagramModal();

    return (
        <section className="section section-alt" id="models">
            <div className="container">
                <ScrollAnimation>
                    <div className="section-header">
                        <span className="section-label">{t('models.label')}</span>
                        <h2>{t('models.title')}</h2>
                        <p>{t('models.desc')}</p>
                    </div>
                </ScrollAnimation>
                <div className="grid grid-2">
                    <ScrollAnimation>
                        <div className="model-card model-card-b2c" style={{ height: '100%' }}>
                            <div className="model-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="7" r="4" stroke="#FEBF1D" strokeWidth="2" />
                                    <path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" stroke="#181818" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3>{t('models.b2c.title')}</h3>
                            <p>{t('models.b2c.desc')}</p>
                            <button
                                className="btn btn-accent"
                                onClick={() => openDiagramModal('B2C')}
                            >
                                <span>{t('models.learnmore')}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M7 17L17 7" />
                                    <path d="M7 7h10v10" />
                                </svg>
                            </button>
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation>
                        <div className="model-card model-card-b2b2c" style={{ height: '100%' }}>
                            <div className="model-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="7" r="4" stroke="#FEBF1D" strokeWidth="2" />
                                    <path d="M1 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="#181818" strokeWidth="2" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#181818" strokeWidth="2" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="#181818" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3>{t('models.b2b.title')}</h3>
                            <p>{t('models.b2b.desc')}</p>
                            <button
                                className="btn btn-accent"
                                onClick={() => openDiagramModal('B2B')}
                            >
                                <span>{t('models.learnmore')}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M7 17L17 7" />
                                    <path d="M7 7h10v10" />
                                </svg>
                            </button>
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    );
}
