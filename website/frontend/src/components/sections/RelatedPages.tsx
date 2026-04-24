'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/**
 * Targets supported by <RelatedPages>. Each maps to a path + a pair of
 * translation keys under the `related` namespace (related.<key>.title /
 * related.<key>.desc). Adding a new destination is three lines: add the
 * key here, the path below, and the translations in en.json + zh.json.
 */
export type RelatedTarget =
    | 'home'
    | 'b2b'
    | 'b2c'
    | 'pricing'
    | 'buy'
    | 'demo'
    | 'contact'
    | 'docs'
    | 'faq'
    | 'forum'
    | 'blog'
    | 'about'
    | 'careers'
    | 'partners';

const PATH: Record<RelatedTarget, string> = {
    home: '/',
    b2b: '/b2b',
    b2c: '/b2c',
    pricing: '/pricing',
    buy: '/buy',
    demo: '/demo',
    contact: '/contact',
    docs: '/docs',
    faq: '/faq',
    forum: '/forum',
    blog: '/blog',
    about: '/about',
    careers: '/careers',
    partners: '/partners',
};

export default function RelatedPages({ items }: { items: RelatedTarget[] }) {
    const t = useTranslations('related');

    return (
        <section className="related-pages">
            <div className="container">
                <div className="related-pages-header">
                    <span className="related-pages-eyebrow">{t('eyebrow')}</span>
                    <h2 className="related-pages-title">{t('title')}</h2>
                    <p className="related-pages-subtitle">{t('subtitle')}</p>
                </div>
                <div className="related-pages-grid">
                    {items.map((key) => (
                        <Link key={key} href={PATH[key]} className="related-pages-card">
                            <span className="related-pages-card-title">{t(`${key}.title`)}</span>
                            <span className="related-pages-card-desc">{t(`${key}.desc`)}</span>
                            <span className="related-pages-card-arrow" aria-hidden="true">→</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
