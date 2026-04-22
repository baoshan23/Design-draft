'use client';

import Image from 'next/image';
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
                        <div className="model-card model-card--with-media" style={{ height: '100%' }}>
                            <div className="model-card-media">
                                <Image
                                    src="/images/B2C.png"
                                    alt={t('models.b2c.title')}
                                    width={600}
                                    height={340}
                                    sizes="(max-width: 768px) 100vw, 560px"
                                    priority={false}
                                />
                            </div>
                            <h3>{t('models.b2c.title')}</h3>
                            <p>{t('models.b2c.desc')}</p>
                            <button
                                className="btn btn-accent"
                                style={{ marginTop: 12 }}
                                onClick={() => openDiagramModal('B2C')}
                            >
                                {t('models.learnmore')}
                            </button>
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation>
                        <div className="model-card model-card--with-media" style={{ height: '100%' }}>
                            <div className="model-card-media">
                                <Image
                                    src="/images/B2B.png"
                                    alt={t('models.b2b.title')}
                                    width={600}
                                    height={340}
                                    sizes="(max-width: 768px) 100vw, 560px"
                                    priority={false}
                                />
                            </div>
                            <h3>{t('models.b2b.title')}</h3>
                            <p>{t('models.b2b.desc')}</p>
                            <button
                                className="btn btn-accent"
                                style={{ marginTop: 12 }}
                                onClick={() => openDiagramModal('B2B')}
                            >
                                {t('models.learnmore')}
                            </button>
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    );
}
