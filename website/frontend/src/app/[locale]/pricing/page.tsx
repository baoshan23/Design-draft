import { Fragment, type ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import PricingTabs from '@/components/sections/pricing/PricingTabs';

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

    const PLANS_WITH_DEPOSIT_OFFER = new Set(['pricing.appent', 'pricing.webplat', 'pricing.appplat']);

    const renderCard = (plan: Plan) => {
        const planKey = plan.keyBase.replace(/^pricing\./, '');
        const cls = ['pricing-card', 'glass-card'];
        if (plan.featured) cls.push('featured');
        if (plan.popular) cls.push('popular');
        const showDeposit = PLANS_WITH_DEPOSIT_OFFER.has(plan.keyBase);
        const discountAmount = showDeposit ? t(`${plan.keyBase}.discountAmount` as any) : '';
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
                {showDeposit && (
                    <div className="plan-deposit-offer">
                        <span className="plan-deposit-offer-amount">{discountAmount}</span>
                        <div className="plan-deposit-offer-text">
                            <strong>{t('pricing.depositOfferTitle')}</strong>
                            <span>{t('pricing.depositOfferDesc', { amount: discountAmount })}</span>
                        </div>
                    </div>
                )}
                <div className="plan-actions">
                    <Link href={{ pathname: '/buy', query: { plan: planKey } }} className="btn btn-primary btn-full">{t('pricing.buynow')}</Link>
                    <Link href="/contact" className="btn btn-secondary btn-full">{t('pricing.contactsales')}</Link>
                </div>
                <ul className="plan-features">
                    {Array.from({ length: plan.featureCount }).map((_, i) => (
                        <li key={i}>
                            <span className="check">&#10003;</span>
                            <span>{t(`${plan.keyBase}.f${i + 1}` as any)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // Add-on icons — 22×22 line style, currentColor stroke. One per add-on key.
    const addonIcons: Record<string, ReactNode> = {
        mobileLang: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M7 1h10a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm0 3v14h10V4H7zm3 16h4v-1h-4v1z" />
            </svg>
        ),
        adminLang: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.87 15.07l-2.54-2.51.03-.03A17.5 17.5 0 0 0 14.07 6H17V4h-7V2H8v2H1v1.99h11.17A14.4 14.4 0 0 1 9 11.35 14.6 14.6 0 0 1 6.69 8h-2a16.7 16.7 0 0 0 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
            </svg>
        ),
        gateway: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4a2 2 0 0 0-1.99 2L2 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
            </svg>
        ),
        pos: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 4h-4V2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h.4l1.42 9.21A2 2 0 0 0 7.78 22h8.44a2 2 0 0 0 1.96-1.79L19.6 11H20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM10 2h4v2h-4V2zm6.22 18H7.78l-1.4-9h11.24l-1.4 9zM20 9H4V6h16v3z" />
            </svg>
        ),
        custom: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
            </svg>
        ),
        store: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21.9 8.89l-1.05-4.37A1.99 1.99 0 0 0 18.91 3H5.12a2 2 0 0 0-1.94 1.52L2.13 8.89c-.24 1.02-.02 2.06.62 2.88.08.11.19.19.28.29V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6.94c.09-.09.2-.18.28-.28.64-.82.87-1.87.61-2.89zM6 19v-6.03c.08.01.16.03.24.03.87 0 1.66-.36 2.24-.95.6.6 1.4.95 2.31.95.87 0 1.65-.36 2.23-.93.59.57 1.39.93 2.29.93.84 0 1.64-.35 2.24-.95.58.59 1.37.95 2.24.95.08 0 .16-.02.24-.03V19H6z" />
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
            {/* Plans — B2C / B2B tabbed switcher */}
            <section id="plans" className="section pricing-section pricing-section--tabs" style={{ paddingTop: 128, background: '#fff' }}>
                <div className="container">
                    <ScrollAnimation>
                        <PricingTabs
                            b2c={{
                                label: t('pricing.b2c.label'),
                                title: t('pricing.b2c.title'),
                                desc: t('pricing.b2c.desc'),
                                cards: <>{b2cPlans.map(renderCard)}</>,
                            }}
                            b2b={{
                                label: t('pricing.b2b.label'),
                                title: t('pricing.b2b.title'),
                                desc: t('pricing.b2b.desc'),
                                cards: <>{b2bPlans.map(renderCard)}</>,
                            }}
                        />
                    </ScrollAnimation>
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
