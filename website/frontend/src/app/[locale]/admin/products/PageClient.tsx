'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { getAuthToken } from '@/lib/api/authApi';
import {
    apiAdminListPlans,
    apiAdminSavePlan,
    apiAdminDeletePlan,
    apiAdminListAddons,
    apiAdminSaveAddon,
    apiAdminDeleteAddon,
    apiAdminListPromoCodes,
    apiAdminSavePromoCode,
    apiAdminDeletePromoCode,
    type Plan,
    type Addon,
    type PromoCode,
} from '@/lib/api/billingApi';

function centsInput(v: number) {
    return (v / 100).toFixed(2);
}
function inputCents(s: string) {
    return Math.round(parseFloat(s || '0') * 100);
}

export default function AdminProductsClient() {
    const t = useTranslations('admin.products');
    const tCommon = useTranslations('admin');
    const router = useRouter();
    const { user, loading } = useAuth();

    const [plans, setPlans] = useState<Plan[] | null>(null);
    const [addons, setAddons] = useState<Addon[] | null>(null);
    const [promos, setPromos] = useState<PromoCode[] | null>(null);
    const [error, setError] = useState('');

    const token = typeof window !== 'undefined' ? getAuthToken() : null;

    const reload = useCallback(async () => {
        if (!token) return;
        setError('');
        try {
            const [pl, ad, pr] = await Promise.all([
                apiAdminListPlans(token),
                apiAdminListAddons(token),
                apiAdminListPromoCodes(token),
            ]);
            setPlans(pl);
            setAddons(ad);
            setPromos(pr);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load');
        }
    }, [token]);

    useEffect(() => {
        if (!loading && !user) router.push('/login');
        if (user && user.role !== 'admin') router.push('/dashboard');
    }, [loading, user, router]);

    useEffect(() => {
        if (user?.role === 'admin') void reload();
    }, [user, reload]);

    if (loading || !user || user.role !== 'admin') return null;

    const ready = plans && addons && promos;

    return (
        <div className="admin-page">
            <div className="admin-bg" />
            <div className="container">
                <Link href="/admin" className="admin-quicklink admin-quicklink--back">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                    {tCommon('backToOverview')}
                </Link>
                <header className="admin-header">
                    <div className="admin-meta">
                        <span className="admin-chip admin-chip-gold">GCSS Admin</span>
                    </div>
                    <h1 className="admin-title">{t('title')}</h1>
                    <p className="admin-subtitle">{t('subtitle')}</p>
                </header>

                {error && <div className="admin-alert admin-alert-error" role="alert">{error}</div>}

                {ready ? (
                    <>
                        <PlansTable token={token!} items={plans!} reload={reload} t={t} />
                        <AddonsTable token={token!} items={addons!} reload={reload} t={t} />
                        <PromoCodesTable token={token!} items={promos!} reload={reload} t={t} />
                    </>
                ) : (
                    <div className="admin-loading">{tCommon('loading')}</div>
                )}
            </div>
        </div>
    );
}

// ── Plans (editable) ─────────────────────────────────────────────────

function emptyPlan(): Partial<Plan> {
    return { key: '', labelEn: '', labelZh: '', descriptionEn: '', descriptionZh: '', family: 'private', basePriceCents: 0, recurringCents: 0, recurringUnit: '', yearlyCents: 0, optionalHostingCents: 0, hasMonthly: false, hasYearly: false, unlimitedChargers: false, isActive: true, sortOrder: 99 };
}

function PlansTable({ token, items, reload, t }: { token: string; items: Plan[]; reload: () => void; t: ReturnType<typeof useTranslations> }) {
    const [draft, setDraft] = useState<Partial<Plan>>(emptyPlan());
    const save = async (p: Partial<Plan>) => {
        try { await apiAdminSavePlan(token, p); await reload(); } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
    };
    const del = async (id: number) => {
        if (!confirm(t('confirmDelete'))) return;
        try { await apiAdminDeletePlan(token, id); await reload(); } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
    };

    return (
        <section className="admin-settings-group">
            <div className="admin-settings-group-head">
                <h2>{t('plans.title')}</h2>
                <p>{t('plans.desc')}</p>
            </div>
            <div className="admin-table-wrap">
                <table className="dash-table">
                    <thead>
                        <tr>
                            <th>{t('plans.key')}</th>
                            <th>{t('plans.label')} (EN)</th>
                            <th>{t('plans.label')} (ZH)</th>
                            <th>{t('plans.family')}</th>
                            <th>{t('plans.base')}</th>
                            <th>{t('plans.recurring')}</th>
                            <th>{t('plans.recurringUnit')}</th>
                            <th>{t('plans.yearly')}</th>
                            <th>{t('plans.hosting')}</th>
                            <th title={t('plans.billingMonthly')}>M</th>
                            <th title={t('plans.billingYearly')}>Y</th>
                            <th title={t('plans.unlimited')}>∞</th>
                            <th>{t('common.active')}</th>
                            <th>{t('common.sort')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...items].sort((a, b) => a.sortOrder - b.sortOrder).map((p) => (
                            <tr key={p.id}>
                                <td><input className="form-input form-input--inline form-input--narrow" defaultValue={p.key} onBlur={(e) => save({ ...p, key: e.target.value })} /></td>
                                <td><input className="form-input form-input--inline" defaultValue={p.labelEn} onBlur={(e) => save({ ...p, labelEn: e.target.value })} /></td>
                                <td><input className="form-input form-input--inline" defaultValue={p.labelZh} onBlur={(e) => save({ ...p, labelZh: e.target.value })} /></td>
                                <td>
                                    <select className="form-input form-input--inline" defaultValue={p.family} onChange={(e) => save({ ...p, family: e.target.value as 'hosted' | 'private' })}>
                                        <option value="hosted">hosted</option>
                                        <option value="private">private</option>
                                    </select>
                                </td>
                                <td><input className="form-input form-input--inline form-input--narrow" type="number" step="0.01" defaultValue={centsInput(p.basePriceCents)} onBlur={(e) => save({ ...p, basePriceCents: inputCents(e.target.value) })} /></td>
                                <td><input className="form-input form-input--inline form-input--narrow" type="number" step="0.01" defaultValue={centsInput(p.recurringCents)} onBlur={(e) => save({ ...p, recurringCents: inputCents(e.target.value) })} /></td>
                                <td>
                                    <select className="form-input form-input--inline" defaultValue={p.recurringUnit} onChange={(e) => save({ ...p, recurringUnit: e.target.value as Plan['recurringUnit'] })}>
                                        <option value="">—</option>
                                        <option value="month">month</option>
                                        <option value="year">year</option>
                                        <option value="year_per_charger">year_per_charger</option>
                                    </select>
                                </td>
                                <td><input className="form-input form-input--inline form-input--narrow" type="number" step="0.01" defaultValue={centsInput(p.yearlyCents)} onBlur={(e) => save({ ...p, yearlyCents: inputCents(e.target.value) })} /></td>
                                <td><input className="form-input form-input--inline form-input--narrow" type="number" step="0.01" defaultValue={centsInput(p.optionalHostingCents)} onBlur={(e) => save({ ...p, optionalHostingCents: inputCents(e.target.value) })} /></td>
                                <td><input type="checkbox" defaultChecked={p.hasMonthly} onChange={(e) => save({ ...p, hasMonthly: e.target.checked })} /></td>
                                <td><input type="checkbox" defaultChecked={p.hasYearly} onChange={(e) => save({ ...p, hasYearly: e.target.checked })} /></td>
                                <td><input type="checkbox" defaultChecked={p.unlimitedChargers} onChange={(e) => save({ ...p, unlimitedChargers: e.target.checked })} /></td>
                                <td><input type="checkbox" defaultChecked={p.isActive} onChange={(e) => save({ ...p, isActive: e.target.checked })} /></td>
                                <td><input className="form-input form-input--inline form-input--narrow" type="number" defaultValue={p.sortOrder} onBlur={(e) => save({ ...p, sortOrder: parseInt(e.target.value || '0', 10) })} /></td>
                                <td><button className="btn btn-secondary btn-sm" onClick={() => del(p.id)}>{t('common.delete')}</button></td>
                            </tr>
                        ))}
                        <tr className="admin-new-row">
                            <td><input className="form-input form-input--inline form-input--narrow" placeholder="key" value={draft.key || ''} onChange={(e) => setDraft({ ...draft, key: e.target.value })} /></td>
                            <td><input className="form-input form-input--inline" placeholder="Label (EN)" value={draft.labelEn || ''} onChange={(e) => setDraft({ ...draft, labelEn: e.target.value })} /></td>
                            <td><input className="form-input form-input--inline" placeholder="标签 (ZH)" value={draft.labelZh || ''} onChange={(e) => setDraft({ ...draft, labelZh: e.target.value })} /></td>
                            <td>
                                <select className="form-input form-input--inline" value={draft.family || 'private'} onChange={(e) => setDraft({ ...draft, family: e.target.value as 'hosted' | 'private' })}>
                                    <option value="hosted">hosted</option>
                                    <option value="private">private</option>
                                </select>
                            </td>
                            <td><input className="form-input form-input--inline form-input--narrow" type="number" step="0.01" value={centsInput(draft.basePriceCents || 0)} onChange={(e) => setDraft({ ...draft, basePriceCents: inputCents(e.target.value) })} /></td>
                            <td><input className="form-input form-input--inline form-input--narrow" type="number" step="0.01" value={centsInput(draft.recurringCents || 0)} onChange={(e) => setDraft({ ...draft, recurringCents: inputCents(e.target.value) })} /></td>
                            <td>
                                <select className="form-input form-input--inline" value={draft.recurringUnit || ''} onChange={(e) => setDraft({ ...draft, recurringUnit: e.target.value as Plan['recurringUnit'] })}>
                                    <option value="">—</option>
                                    <option value="month">month</option>
                                    <option value="year">year</option>
                                    <option value="year_per_charger">year_per_charger</option>
                                </select>
                            </td>
                            <td><input className="form-input form-input--inline form-input--narrow" type="number" step="0.01" value={centsInput(draft.yearlyCents || 0)} onChange={(e) => setDraft({ ...draft, yearlyCents: inputCents(e.target.value) })} /></td>
                            <td><input className="form-input form-input--inline form-input--narrow" type="number" step="0.01" value={centsInput(draft.optionalHostingCents || 0)} onChange={(e) => setDraft({ ...draft, optionalHostingCents: inputCents(e.target.value) })} /></td>
                            <td><input type="checkbox" checked={!!draft.hasMonthly} onChange={(e) => setDraft({ ...draft, hasMonthly: e.target.checked })} /></td>
                            <td><input type="checkbox" checked={!!draft.hasYearly} onChange={(e) => setDraft({ ...draft, hasYearly: e.target.checked })} /></td>
                            <td><input type="checkbox" checked={!!draft.unlimitedChargers} onChange={(e) => setDraft({ ...draft, unlimitedChargers: e.target.checked })} /></td>
                            <td><input type="checkbox" checked={!!draft.isActive} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} /></td>
                            <td><input className="form-input form-input--inline form-input--narrow" type="number" value={draft.sortOrder ?? 99} onChange={(e) => setDraft({ ...draft, sortOrder: parseInt(e.target.value || '0', 10) })} /></td>
                            <td><button className="btn btn-primary btn-sm" onClick={async () => { await save(draft); setDraft(emptyPlan()); }}>{t('common.add')}</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
}

// ── Add-ons (editable) ───────────────────────────────────────────────

function emptyAddon(): Partial<Addon> {
    return { key: '', labelEn: '', labelZh: '', priceCents: 0, priceModel: 'per_unit', unitNoteEn: '', unitNoteZh: '', isActive: true, sortOrder: 99 };
}

function AddonsTable({ token, items, reload, t }: { token: string; items: Addon[]; reload: () => void; t: ReturnType<typeof useTranslations> }) {
    const [draft, setDraft] = useState<Partial<Addon>>(emptyAddon());
    const save = async (a: Partial<Addon>) => {
        try { await apiAdminSaveAddon(token, a); await reload(); } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
    };
    const del = async (id: number) => {
        if (!confirm(t('confirmDelete'))) return;
        try { await apiAdminDeleteAddon(token, id); await reload(); } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
    };
    return (
        <section className="admin-settings-group">
            <div className="admin-settings-group-head">
                <h2>{t('addons.title')}</h2>
                <p>{t('addons.desc')}</p>
            </div>
            <div className="admin-table-wrap">
                <table className="dash-table">
                    <thead>
                        <tr>
                            <th>{t('addons.key')}</th>
                            <th>{t('addons.label')} (EN)</th>
                            <th>{t('addons.label')} (ZH)</th>
                            <th>{t('addons.price')}</th>
                            <th>{t('addons.model')}</th>
                            <th>{t('addons.unit')} (EN)</th>
                            <th>{t('addons.unit')} (ZH)</th>
                            <th>{t('common.active')}</th>
                            <th>{t('common.sort')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...items].sort((a, b) => a.sortOrder - b.sortOrder).map((a) => (
                            <tr key={a.id}>
                                <td><input className="form-input form-input--inline form-input--narrow" defaultValue={a.key} onBlur={(e) => save({ ...a, key: e.target.value })} /></td>
                                <td><input className="form-input form-input--inline" defaultValue={a.labelEn} onBlur={(e) => save({ ...a, labelEn: e.target.value })} /></td>
                                <td><input className="form-input form-input--inline" defaultValue={a.labelZh} onBlur={(e) => save({ ...a, labelZh: e.target.value })} /></td>
                                <td><input className="form-input form-input--inline form-input--narrow" type="number" step="0.01" defaultValue={centsInput(a.priceCents)} onBlur={(e) => save({ ...a, priceCents: inputCents(e.target.value) })} /></td>
                                <td>
                                    <select className="form-input form-input--inline" defaultValue={a.priceModel} onChange={(e) => save({ ...a, priceModel: e.target.value as 'per_unit' | 'per_day' })}>
                                        <option value="per_unit">per_unit</option>
                                        <option value="per_day">per_day</option>
                                    </select>
                                </td>
                                <td><input className="form-input form-input--inline" defaultValue={a.unitNoteEn} onBlur={(e) => save({ ...a, unitNoteEn: e.target.value })} /></td>
                                <td><input className="form-input form-input--inline" defaultValue={a.unitNoteZh} onBlur={(e) => save({ ...a, unitNoteZh: e.target.value })} /></td>
                                <td><input type="checkbox" defaultChecked={a.isActive} onChange={(e) => save({ ...a, isActive: e.target.checked })} /></td>
                                <td><input className="form-input form-input--inline form-input--narrow" type="number" defaultValue={a.sortOrder} onBlur={(e) => save({ ...a, sortOrder: parseInt(e.target.value || '0', 10) })} /></td>
                                <td><button className="btn btn-secondary btn-sm" onClick={() => del(a.id)}>{t('common.delete')}</button></td>
                            </tr>
                        ))}
                        <tr className="admin-new-row">
                            <td><input className="form-input form-input--inline form-input--narrow" placeholder="key" value={draft.key || ''} onChange={(e) => setDraft({ ...draft, key: e.target.value })} /></td>
                            <td><input className="form-input form-input--inline" placeholder="Label (EN)" value={draft.labelEn || ''} onChange={(e) => setDraft({ ...draft, labelEn: e.target.value })} /></td>
                            <td><input className="form-input form-input--inline" placeholder="标签 (ZH)" value={draft.labelZh || ''} onChange={(e) => setDraft({ ...draft, labelZh: e.target.value })} /></td>
                            <td><input className="form-input form-input--inline form-input--narrow" type="number" step="0.01" value={centsInput(draft.priceCents || 0)} onChange={(e) => setDraft({ ...draft, priceCents: inputCents(e.target.value) })} /></td>
                            <td>
                                <select className="form-input form-input--inline" value={draft.priceModel || 'per_unit'} onChange={(e) => setDraft({ ...draft, priceModel: e.target.value as 'per_unit' | 'per_day' })}>
                                    <option value="per_unit">per_unit</option>
                                    <option value="per_day">per_day</option>
                                </select>
                            </td>
                            <td><input className="form-input form-input--inline" placeholder="per language" value={draft.unitNoteEn || ''} onChange={(e) => setDraft({ ...draft, unitNoteEn: e.target.value })} /></td>
                            <td><input className="form-input form-input--inline" placeholder="每种" value={draft.unitNoteZh || ''} onChange={(e) => setDraft({ ...draft, unitNoteZh: e.target.value })} /></td>
                            <td><input type="checkbox" checked={!!draft.isActive} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} /></td>
                            <td><input className="form-input form-input--inline form-input--narrow" type="number" value={draft.sortOrder ?? 99} onChange={(e) => setDraft({ ...draft, sortOrder: parseInt(e.target.value || '0', 10) })} /></td>
                            <td><button className="btn btn-primary btn-sm" onClick={async () => { await save(draft); setDraft(emptyAddon()); }}>{t('common.add')}</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
}

// ── Promo codes ──────────────────────────────────────────────────────

function PromoCodesTable({ token, items, reload, t }: { token: string; items: PromoCode[]; reload: () => void; t: ReturnType<typeof useTranslations> }) {
    const [draft, setDraft] = useState<Partial<PromoCode>>({ code: '', discountType: 'percent', discountValue: 10, isActive: true, maxRedemptions: 0 });
    const save = async (p: Partial<PromoCode>) => {
        try { await apiAdminSavePromoCode(token, p); await reload(); } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
    };
    const del = async (id: number) => {
        if (!confirm(t('confirmDelete'))) return;
        try { await apiAdminDeletePromoCode(token, id); await reload(); } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
    };
    return (
        <section className="admin-settings-group">
            <div className="admin-settings-group-head">
                <h2>{t('promoCodes.title')}</h2>
                <p>{t('promoCodes.desc')}</p>
            </div>
            <table className="dash-table">
                <thead>
                    <tr>
                        <th>{t('promoCodes.code')}</th>
                        <th>{t('promoCodes.type')}</th>
                        <th>{t('promoCodes.value')}</th>
                        <th>{t('promoCodes.maxRedemptions')}</th>
                        <th>{t('promoCodes.redeemed')}</th>
                        <th>{t('common.active')}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((p) => (
                        <tr key={p.id}>
                            <td><code>{p.code}</code></td>
                            <td>{p.discountType}</td>
                            <td>{p.discountType === 'percent' ? `${p.discountValue}%` : `$${(p.discountValue / 100).toFixed(2)}`}</td>
                            <td>{p.maxRedemptions || '∞'}</td>
                            <td>{p.redeemedCount}</td>
                            <td><input type="checkbox" defaultChecked={p.isActive} onChange={(e) => save({ ...p, isActive: e.target.checked })} /></td>
                            <td><button className="btn btn-secondary btn-sm" onClick={() => del(p.id)}>{t('common.delete')}</button></td>
                        </tr>
                    ))}
                    <tr className="admin-new-row">
                        <td><input className="form-input form-input--inline" placeholder="SAVE10" value={draft.code || ''} onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })} /></td>
                        <td>
                            <select className="form-input form-input--inline" value={draft.discountType || 'percent'} onChange={(e) => setDraft({ ...draft, discountType: e.target.value as 'percent' | 'fixed' })}>
                                <option value="percent">percent</option>
                                <option value="fixed">fixed (cents)</option>
                            </select>
                        </td>
                        <td><input className="form-input form-input--inline form-input--narrow" type="number" value={draft.discountValue ?? 0} onChange={(e) => setDraft({ ...draft, discountValue: parseInt(e.target.value || '0', 10) })} /></td>
                        <td><input className="form-input form-input--inline form-input--narrow" type="number" value={draft.maxRedemptions ?? 0} onChange={(e) => setDraft({ ...draft, maxRedemptions: parseInt(e.target.value || '0', 10) })} /></td>
                        <td>—</td>
                        <td><input type="checkbox" checked={!!draft.isActive} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} /></td>
                        <td><button className="btn btn-primary btn-sm" onClick={async () => { await save(draft); setDraft({ code: '', discountType: 'percent', discountValue: 10, isActive: true, maxRedemptions: 0 }); }}>{t('common.add')}</button></td>
                    </tr>
                </tbody>
            </table>
        </section>
    );
}
