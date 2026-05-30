'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';

type Mode = 'b2c' | 'b2b';

const MODES: Mode[] = ['b2c', 'b2b'];

export default function BusinessModelsSection() {
    const t = useTranslations();
    const [active, setActive] = useState<Mode>('b2c');

    return (
        <section className="section section-alt" id="models">
            <div className="container">
                <div className="models-split">
                    <div className="models-left">
                        <ScrollAnimation>
                            <div className="models-header">
                                <span className="section-label">{t('models.label')}</span>
                                <h2>{t('models.title')}</h2>
                                <p>{t('models.desc')}</p>
                            </div>
                        </ScrollAnimation>
                        <ScrollAnimation>
                            <div className="models-illustration-card">
                                <div
                                    className="models-illustration-slot"
                                    data-mode={active}
                                    aria-live="polite"
                                >
                                    <span className="models-illustration-hint">
                                        {t(`models.${active}.title`)}
                                    </span>
                                </div>
                            </div>
                        </ScrollAnimation>
                    </div>

                    <div
                        className="models-right"
                        role="tablist"
                        aria-orientation="vertical"
                        aria-label={t('models.title')}
                    >
                        {MODES.map((mode) => {
                            const isActive = active === mode;
                            return (
                                <button
                                    key={mode}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    className={`models-item${isActive ? ' is-active' : ''}`}
                                    onClick={() => setActive(mode)}
                                >
                                    <span className="models-item-icon">
                                        {mode === 'b2c' ? (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                                <path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        ) : (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                                <path d="M1 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
                                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        )}
                                    </span>
                                    <span className="models-item-text">
                                        <span className="models-item-title">{t(`models.${mode}.title`)}</span>
                                        <span className="models-item-desc">{t(`models.${mode}.desc`)}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
