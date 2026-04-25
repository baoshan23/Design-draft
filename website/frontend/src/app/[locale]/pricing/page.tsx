import { Fragment, type ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import ScrollAnimation from '@/components/effects/ScrollAnimation';

export const metadata = {
    title: 'Pricing - GCSS | EV Charging Management Platform',
    description: 'Transparent pricing for GCSS EV charging management. Four tiers across B2C and B2B deployments. Custom-branded web/native apps and multi-operator platforms.',
};

type Plan = {
    keyBase: string;
    featureCount: number;
    featured?: boolean;
    popular?: boolean;
};

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations();

    const b2cPlans: Plan[] = [
        { keyBase: 'pricing.customweb', featureCount: 7, popular: true },
        { keyBase: 'pricing.appent', featureCount: 10 },
    ];

    const b2bPlans: Plan[] = [
        { keyBase: 'pricing.webplat', featureCount: 10 },
        { keyBase: 'pricing.appplat', featureCount: 11, featured: true },
    ];

    const renderCard = (plan: Plan) => {
        const planKey = plan.keyBase.replace(/^pricing\./, '');
        const cls = ['pricing-card', 'glass-card'];
        if (plan.featured) cls.push('featured');
        if (plan.popular) cls.push('popular');
        return (
            <div key={plan.keyBase} className={cls.join(' ')}>
                {plan.popular && <span className="pricing-card-ribbon">{t('pricing.popular')}</span>}
                {plan.featured && <span className="pricing-card-ribbon pricing-card-ribbon--featured">{t('pricing.featured')}</span>}
                <div className="plan-name">{t(`${plan.keyBase}.name` as any)}</div>
                <div className="plan-price">
                    <span>{t(`${plan.keyBase}.price` as any)}</span>
                    <span className="plan-price-unit">{t(`${plan.keyBase}.priceUnit` as any)}</span>
                </div>
                <div className="plan-price-note">{t(`${plan.keyBase}.priceNote` as any)}</div>
                <ul className="plan-features">
                    {Array.from({ length: plan.featureCount }).map((_, i) => (
                        <li key={i}>
                            <span className="check">&#10003;</span>
                            <span>{t(`${plan.keyBase}.f${i + 1}` as any)}</span>
                        </li>
                    ))}
                </ul>
                <div className="plan-actions">
                    <Link href={{ pathname: '/buy', query: { plan: planKey } }} className="btn btn-primary btn-full">{t('pricing.buynow')}</Link>
                    <Link href="/contact" className="btn btn-secondary btn-full">{t('pricing.contactsales')}</Link>
                </div>
            </div>
        );
    };

    // Add-on icons — 22×22 line style, currentColor stroke. One per add-on key.
    const addonIcons: Record<string, ReactNode> = {
        mobileLang: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="6" y="2" width="12" height="20" rx="2.5" />
                <path d="M9 6h6M11 18h2" />
                <circle cx="12" cy="12" r="3" />
                <path d="M9 12h6M12 9v6" />
            </svg>
        ),
        adminLang: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M3 9h18M7 13h4M16 13l3 0M7 13v2" />
            </svg>
        ),
        gateway: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="6" width="20" height="13" rx="2" />
                <path d="M2 11h20M6 16h3" />
            </svg>
        ),
        pos: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="3" width="16" height="14" rx="2" />
                <path d="M8 21h8M12 17v4M9 8h6M9 12h4" />
            </svg>
        ),
        custom: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 8l-5 4 5 4M15 8l5 4-5 4M14 4l-4 16" />
            </svg>
        ),
        store: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 6h18M5 6l1 14h12l1-14M9 11l3 3 3-3" />
            </svg>
        ),
    };

    const addons = [
        { key: 'mobileLang', priceKey: 'mobileLangPrice' },
        { key: 'adminLang', priceKey: 'adminLangPrice' },
        { key: 'gateway', priceKey: 'gatewayPrice' },
        { key: 'pos', priceKey: 'posPrice' },
        { key: 'custom', priceKey: 'customPrice' },
        { key: 'store', priceKey: 'storePrice' },
    ];

    type Cell = boolean | string;
    type TRow = { label: string; cells: Cell[] };
    type TSection = { title: string; rows: TRow[] };

    const tx = (k: string) => t(`pricing.table.${k}` as any);
    const Y: Cell = true;
    const N: Cell = false;
    const dash = '/';

    const tableSections: TSection[] = [
        {
            title: tx('fees'),
            rows: [
                { label: tx('hostingfee'), cells: [tx('price84'), tx('price200mo'), tx('price120mo'), tx('price1200opt'), tx('price1200opt'), tx('price1200opt')] },
                { label: tx('chargercount'), cells: [tx('perChargerBilling'), tx('unlimited'), tx('unlimited'), tx('unlimited'), tx('unlimited'), tx('unlimited')] },
                { label: tx('licensefee'), cells: [N, N, tx('price300once'), tx('price16900once'), tx('price21800once'), tx('price34200once')] },
                { label: tx('billcycle'), cells: [tx('annual'), tx('monthYear'), tx('monthYear'), dash, dash, dash] },
                { label: tx('annualdisc'), cells: [N, tx('price1500'), tx('fy1500then1200'), dash, dash, dash] },
            ],
        },
        {
            title: tx('baseservice'),
            rows: [
                { label: tx('driverapp'), cells: [tx('globalcharge'), tx('globalcharge'), tx('custom1Web'), tx('custom1App'), tx('custom3Web'), tx('custom3App')] },
                { label: tx('ocpp'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('gateway'), cells: [tx('selectExisting'), tx('custom1Type'), tx('custom1Type'), tx('custom2Type'), tx('custom3Type'), tx('custom3Type')] },
                { label: tx('mobilelang'), cells: [N, N, Y, Y, Y, Y] },
                { label: tx('apiaccess'), cells: [N, Y, Y, Y, Y, Y] },
                { label: tx('adminlang'), cells: [N, Y, Y, Y, Y, Y] },
                { label: tx('customlogo'), cells: [tx('logoOneTime'), tx('logoOneTime'), Y, Y, Y, Y] },
                { label: tx('appstores'), cells: [tx('logoOneTime'), tx('logoOneTime'), N, Y, N, Y] },
                { label: tx('customdomain'), cells: [N, Y, Y, Y, Y, Y] },
                { label: tx('server'), cells: [tx('saasHK'), tx('dedicatedRegion'), tx('leaseGcss'), tx('leaseGcss'), tx('leaseGcss'), tx('leaseGcss')] },
                { label: tx('dataowner'), cells: [tx('ownGcss'), tx('ownClient'), tx('ownClient'), tx('ownClient'), tx('ownClient'), tx('ownClient')] },
            ],
        },
        {
            title: tx('cpms'),
            rows: [
                { label: tx('dashboard'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('langswitch'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('chargermgmt'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('stationmgmt'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('rateset'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('ordermgmt'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('customexport'), cells: [N, tx('fmt1'), tx('fmt1'), tx('fmt2'), tx('fmt3'), tx('fmt3')] },
                { label: tx('faultnotify'), cells: [tx('emails1k'), tx('unlimited'), tx('unlimited'), tx('unlimited'), tx('unlimited'), tx('unlimited')] },
                { label: tx('faultformat'), cells: [N, Y, Y, Y, Y, Y] },
                { label: tx('subaccount'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('reservationmgmt'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('fleet'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('rfidcard'), cells: [Y, Y, Y, Y, Y, Y] },
            ],
        },
        {
            title: tx('drivermgmt'),
            rows: [
                { label: tx('balanceview'), cells: [N, Y, Y, Y, Y, Y] },
                { label: tx('balanceadjust'), cells: [N, Y, Y, Y, Y, Y] },
                { label: tx('userexport'), cells: [N, Y, Y, Y, Y, Y] },
                { label: tx('wallethist'), cells: [N, Y, Y, Y, Y, Y] },
            ],
        },
        {
            title: tx('b2b'),
            rows: [
                { label: tx('cpomgmt'), cells: [N, N, N, N, Y, Y] },
                { label: tx('gatewayconfig'), cells: [N, N, N, N, Y, Y] },
                { label: tx('cpocommission'), cells: [N, N, N, N, Y, Y] },
                { label: tx('cpohosted'), cells: [N, N, N, N, Y, Y] },
                { label: tx('cpoperms'), cells: [N, N, N, N, Y, Y] },
                { label: tx('cpoorders'), cells: [N, N, N, N, Y, Y] },
                { label: tx('cporevenue'), cells: [N, N, N, N, Y, Y] },
            ],
        },
        {
            title: tx('driverappFn'),
            rows: [
                { label: tx('qrcharge'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('tapcharge'), cells: [N, Y, N, Y, N, Y] },
                { label: tx('rfidcharge'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('mapnav'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('reservecharge'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('payment'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('ordertrack'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('langselect'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('loginmethods'), cells: [tx('loginsList'), tx('loginsList'), tx('loginsList'), tx('loginsList'), tx('loginsList'), tx('loginsList')] },
            ],
        },
        {
            title: tx('remote'),
            rows: [
                { label: tx('firmware'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('logdownload'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('remotecharge'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('ocppview'), cells: [tx('ocpp90d'), tx('unlimited'), tx('unlimited'), tx('unlimited'), tx('unlimited'), tx('unlimited')] },
                { label: tx('ocppdown'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('syscfg'), cells: [Y, Y, Y, Y, Y, Y] },
                { label: tx('remoteenable'), cells: [Y, Y, Y, Y, Y, Y] },
            ],
        },
    ].map((section) => ({
        ...section,
        // Cell layout per section: [SaaS, Dedicated, CustomWeb, APPEnt, WebPlat, APPPlat].
        // SaaS and Dedicated are no longer offered on the website — keep only
        // the four current tiers (indices 2..5).
        rows: section.rows.map((row) => ({ ...row, cells: row.cells.filter((_, i) => i >= 2) })),
    }));

    return (
        <>
            {/* Hero + audience picker */}
            <section className="section mesh-bg pricing-hero" style={{ paddingTop: 140, paddingBottom: 32, textAlign: 'center' }}>
                <div className="container">
                    <ScrollAnimation>
                        <div className="section-header">
                            <span className="section-label">{t('pricing.label')}</span>
                            <h1>{t('pricing.title')}</h1>
                            <p>{t('pricing.desc')}</p>
                        </div>
                    </ScrollAnimation>

                </div>
            </section>

            {/* B2C — single-operator deployments */}
            <section id="b2c" className="section pricing-section pricing-section--b2c" style={{ paddingTop: 56 }}>
                <div className="container">
                    <ScrollAnimation>
                        <div className="section-header" style={{ marginBottom: 32 }}>
                            <span className="section-label">{t('pricing.b2c.label')}</span>
                            <h2>{t('pricing.b2c.title')}</h2>
                            <p>{t('pricing.b2c.desc')}</p>
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation>
                        <div className="pricing-cards pricing-cards--2col">
                            {b2cPlans.map(renderCard)}
                        </div>
                    </ScrollAnimation>
                    <div className="pricing-crosslink">
                        <a href="#b2b">{t('pricing.jumpToB2b')} <span aria-hidden="true">&rarr;</span></a>
                    </div>
                </div>
            </section>

            {/* B2B — multi-operator network platforms (alt background, distinct mood) */}
            <section id="b2b" className="section section-alt pricing-section pricing-section--b2b">
                <div className="container">
                    <ScrollAnimation>
                        <div className="section-header" style={{ marginBottom: 32 }}>
                            <span className="section-label">{t('pricing.b2b.label')}</span>
                            <h2>{t('pricing.b2b.title')}</h2>
                            <p>{t('pricing.b2b.desc')}</p>
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation>
                        <div className="pricing-cards pricing-cards--2col">
                            {b2bPlans.map(renderCard)}
                        </div>
                    </ScrollAnimation>
                    <div className="pricing-crosslink">
                        <a href="#b2c">{t('pricing.jumpToB2c')} <span aria-hidden="true">&rarr;</span></a>
                    </div>
                </div>
            </section>

            {/* Add-ons */}
            <section className="section">
                <div className="container">
                    <ScrollAnimation>
                        <div className="section-header">
                            <span className="section-label">{t('pricing.addons.label')}</span>
                            <h2>{t('pricing.addons.title')}</h2>
                            <p>{t('pricing.addons.desc')}</p>
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation>
                        <div className="addons-grid">
                            {addons.map((a) => (
                                <div key={a.key} className="addon-card">
                                    <div className="addon-card-icon">{addonIcons[a.key]}</div>
                                    <div className="addon-card-body">
                                        <div className="addon-label">{t(`pricing.addons.${a.key}` as any)}</div>
                                        <div className="addon-price">{t(`pricing.addons.${a.priceKey}` as any)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            {/* Feature Comparison */}
            <section className="section">
                <div className="container">
                    <ScrollAnimation>
                        <div className="section-header">
                            <span className="section-label">{t('pricing.compare.label')}</span>
                            <h2>{t('pricing.compare.title')}</h2>
                            <p>{t('pricing.compare.desc')}</p>
                        </div>
                    </ScrollAnimation>

                    <ScrollAnimation>
                        <div className="comparison-table-wrap">
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>{t('pricing.table.feature')}</th>
                                        <th>
                                            <span className="comparison-plan-name">{t('pricing.customweb.name')}</span>
                                            <span className="comparison-plan-price">$300 + $120/mo</span>
                                        </th>
                                        <th>
                                            <span className="comparison-plan-name">{t('pricing.appent.name')}</span>
                                            <span className="comparison-plan-price">$16,900</span>
                                        </th>
                                        <th>
                                            <span className="comparison-plan-name">{t('pricing.webplat.name')}</span>
                                            <span className="comparison-plan-price">$21,800</span>
                                        </th>
                                        <th>
                                            <span className="comparison-plan-name">{t('pricing.appplat.name')}</span>
                                            <span className="comparison-plan-price">$68,000</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableSections.map((section) => (
                                        <Fragment key={section.title}>
                                            <tr className="category-row"><td colSpan={5}>{section.title}</td></tr>
                                            {section.rows.map((row) => (
                                                <tr key={row.label}>
                                                    <td>{row.label}</td>
                                                    {row.cells.map((cell, ci) => (
                                                        <td key={ci}>
                                                            {cell === true ? <span aria-label={t('pricing.table.aria.included')}>&#10003;</span>
                                                                : cell === false ? <span aria-label={t('pricing.table.aria.notIncluded')}>&#10005;</span>
                                                                : cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <ScrollAnimation>
                    <div className="container">
                        <h2>{t('cta.title')}</h2>
                        <p>{t('cta.desc')}</p>
                        <div className="cta-buttons">
                            <Link href="/buy" className="btn btn-primary btn-lg">{t('cta.btn1')}</Link>
                            <Link href="/contact" className="btn btn-secondary btn-lg">{t('pricing.contactsales')}</Link>
                        </div>
                    </div>
                </ScrollAnimation>
            </section>
        </>
    );
}
