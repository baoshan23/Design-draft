import type { Plan, Addon } from '@/lib/api/billingApi';

export type AddonChoice = { key: string; quantity: number };

export type Cart = {
    planKey: string;
    billingMode: 'monthly' | 'yearly' | 'one_time';
    years: number;
    months: number; // monthly customweb term length, 1..12
    chargers: number;
    withHosting: boolean;
    addons: AddonChoice[];
};

export type LineItem = { label: string; detail?: string; amountCents: number };

export function formatUSD(cents: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100);
}

export function pickLabel(locale: string, en: string, zh: string): string {
    return locale === 'zh' && zh ? zh : en;
}

// Mirror of backend store.PriceFor — kept in sync so the on-page total
// matches what the server will charge. Server is still authoritative.
export function computePrice(plan: Plan, cart: Cart, addons: Addon[]): number {
    const years = Math.min(Math.max(cart.years || 1, 1), 6);
    const months = Math.min(Math.max(cart.months || 1, 1), 12);
    let subtotal = 0;
    switch (plan.key) {
        case 'saas':
            subtotal = Math.max(cart.chargers || 1, 1) * plan.recurringCents * years;
            break;
        case 'customweb':
            subtotal = cart.billingMode === 'yearly'
                ? plan.basePriceCents + plan.yearlyCents * years
                : plan.basePriceCents + plan.recurringCents * months;
            break;
        case 'appent':
        case 'webplat':
        case 'appplat':
            subtotal = plan.basePriceCents;
            if (cart.withHosting) subtotal += plan.optionalHostingCents * years;
            break;
    }
    const addonByKey = new Map(addons.map((a) => [a.key, a]));
    for (const a of cart.addons) {
        const ad = addonByKey.get(a.key);
        if (!ad || a.quantity < 1) continue;
        subtotal += ad.priceCents * a.quantity;
    }
    return subtotal;
}

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

export function buildLineItems(
    plan: Plan,
    cart: Cart,
    addons: Addon[],
    locale: string,
    t: TranslateFn,
): LineItem[] {
    const items: LineItem[] = [];
    const years = Math.min(Math.max(cart.years || 1, 1), 6);
    const months = Math.min(Math.max(cart.months || 1, 1), 12);
    const planLabel = pickLabel(locale, plan.labelEn, plan.labelZh);

    switch (plan.key) {
        case 'saas': {
            const chargers = Math.max(cart.chargers || 1, 1);
            items.push({
                label: `${planLabel} — ${t('lineSaasCharging')}`,
                detail: `${chargers} × ${years}${t('yearShort')} × ${formatUSD(plan.recurringCents)}/${t('perYearShort')}`,
                amountCents: chargers * plan.recurringCents * years,
            });
            break;
        }
        case 'customweb': {
            items.push({
                label: t('lineSetup'),
                detail: t('lineOneTime'),
                amountCents: plan.basePriceCents,
            });
            if (cart.billingMode === 'yearly') {
                items.push({
                    label: t('lineHostingAnnual'),
                    detail: `${years} × ${formatUSD(plan.yearlyCents)}/${t('perYearShort')}`,
                    amountCents: plan.yearlyCents * years,
                });
            } else {
                items.push({
                    label: t('lineHostingMonthly'),
                    detail: `${months} × ${formatUSD(plan.recurringCents)}/${t('perMonthShort')}`,
                    amountCents: plan.recurringCents * months,
                });
            }
            break;
        }
        case 'appent':
        case 'webplat':
        case 'appplat': {
            items.push({
                label: `${planLabel} — ${t('lineLicense')}`,
                detail: t('lineOneTime'),
                amountCents: plan.basePriceCents,
            });
            if (cart.withHosting) {
                items.push({
                    label: t('lineServerHosting'),
                    detail: `${years} × ${formatUSD(plan.optionalHostingCents)}/${t('perYearShort')}`,
                    amountCents: plan.optionalHostingCents * years,
                });
            }
            break;
        }
    }

    const addonByKey = new Map(addons.map((a) => [a.key, a]));
    for (const choice of cart.addons) {
        const ad = addonByKey.get(choice.key);
        if (!ad || choice.quantity < 1) continue;
        items.push({
            label: pickLabel(locale, ad.labelEn, ad.labelZh),
            detail: `${choice.quantity} × ${formatUSD(ad.priceCents)}${ad.priceModel === 'per_day' ? '/' + t('perDay') : ''}`,
            amountCents: ad.priceCents * choice.quantity,
        });
    }

    return items;
}

export function buildMetaRows(
    plan: Plan,
    cart: Cart,
    locale: string,
    t: TranslateFn,
): { label: string; value: string }[] {
    const rows: { label: string; value: string }[] = [
        { label: t('summary.plan'), value: pickLabel(locale, plan.labelEn, plan.labelZh) },
        { label: t('summary.deployment'), value: t(plan.family === 'hosted' ? 'familyHosted' : 'familyPrivate') },
    ];
    const isOneTime = !plan.hasMonthly && !plan.hasYearly;
    if (!isOneTime) {
        rows.push({
            label: t('summary.billing'),
            value: cart.billingMode === 'yearly' ? t('billingYearly') : t('billingMonthly'),
        });
        if (cart.billingMode === 'monthly') {
            const m = Math.min(Math.max(cart.months || 1, 1), 12);
            rows.push({
                label: t('summary.term'),
                value: `${m} ${m === 1 ? t('monthOne') : t('monthMany')}`,
            });
        } else {
            rows.push({
                label: t('summary.term'),
                value: `${cart.years} ${cart.years === 1 ? t('yearOne') : t('yearMany')}`,
            });
        }
    } else {
        rows.push({ label: t('summary.billing'), value: t('oneTime') });
        if (cart.withHosting) {
            rows.push({
                label: t('summary.hostingTerm'),
                value: `${cart.years} ${cart.years === 1 ? t('yearOne') : t('yearMany')}`,
            });
        }
    }
    if (plan.key === 'saas') {
        rows.push({ label: t('summary.chargers'), value: String(Math.max(cart.chargers || 1, 1)) });
    }
    const activeAddons = cart.addons.filter((a) => a.quantity > 0).length;
    if (activeAddons > 0) {
        rows.push({ label: t('summary.addonsCount'), value: String(activeAddons) });
    }
    return rows;
}
