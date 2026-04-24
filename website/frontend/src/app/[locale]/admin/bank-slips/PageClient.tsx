'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { apiMe, getAuthToken } from '@/lib/api/authApi';
import { apiAdminListBankSlips, apiAdminReviewBankSlip, type BankSlip } from '@/lib/api/billingApi';

function formatUSD(cents: number, currency = 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(cents / 100);
}

type Filter = 'review' | 'approved' | 'rejected' | 'all';

export default function AdminBankSlipsClient() {
    const t = useTranslations('admin.bankSlips');
    const router = useRouter();
    const [items, setItems] = useState<BankSlip[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>('review');
    const [error, setError] = useState('');
    const [reviewing, setReviewing] = useState<{ slip: BankSlip; action: 'approve' | 'reject' } | null>(null);
    const [reviewNotes, setReviewNotes] = useState('');
    const [busy, setBusy] = useState(false);

    const load = async (f: Filter) => {
        const token = getAuthToken();
        if (!token) return;
        setLoading(true);
        try {
            const list = await apiAdminListBankSlips(token, f === 'all' ? undefined : f);
            setItems(list);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('loadError'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.replace('/login');
            return;
        }
        apiMe(token)
            .then((m) => {
                if (m.user?.role !== 'admin') {
                    router.replace('/demo');
                    return;
                }
                return load(filter);
            })
            .catch(() => setError(t('loadError')));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        void load(filter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const submitReview = async () => {
        if (!reviewing) return;
        const token = getAuthToken();
        if (!token) return;
        setBusy(true);
        try {
            await apiAdminReviewBankSlip(token, reviewing.slip.id, reviewing.action, reviewNotes);
            setReviewing(null);
            setReviewNotes('');
            await load(filter);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('actionError'));
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="section">
            <div className="container">
                <div className="admin-page-head">
                    <div>
                        <Link href="/admin" className="admin-back-link">← {t('back')}</Link>
                        <h1>{t('title')}</h1>
                        <p>{t('subtitle')}</p>
                    </div>
                </div>

                <div className="admin-filter-row" role="tablist">
                    {(['review', 'approved', 'rejected', 'all'] as Filter[]).map((f) => (
                        <button
                            key={f}
                            role="tab"
                            aria-selected={filter === f}
                            className={`admin-filter-tab${filter === f ? ' admin-filter-tab--active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {t('filter.' + f)}
                        </button>
                    ))}
                </div>

                {error && <div className="form-banner form-banner--error" role="alert">{error}</div>}

                {loading ? (
                    <div className="dashboard-loading"><div className="dashboard-loading-spinner" /><p>{t('loading')}</p></div>
                ) : items.length === 0 ? (
                    <p className="admin-empty">{t('empty')}</p>
                ) : (
                    <div className="admin-list">
                        {items.map((s) => (
                            <div key={s.id} className="admin-row admin-row--slip">
                                <div className="admin-row-body">
                                    <div className="admin-row-head">
                                        <h3>
                                            {s.orderNumber || `#${s.orderId}`}
                                            <span className="admin-row-sub">{s.userEmail}</span>
                                        </h3>
                                        <span className={`bt-pill bt-pill--${s.status === 'approved' ? 'approved' : s.status === 'rejected' ? 'rejected' : 'review'}`}>
                                            {t('status.' + s.status)}
                                        </span>
                                    </div>
                                    <div className="admin-row-meta">
                                        <span>{formatUSD(s.amountCents, s.currency || 'USD')}</span>
                                        <span>· {t('kind.' + (s.kind || 'balance'))}</span>
                                        {s.bankName && <span>· {s.bankName}</span>}
                                        <span>· {new Date(s.createdAt).toLocaleString()}</span>
                                    </div>
                                    {s.productLabel && <p className="admin-row-product">{s.productLabel}</p>}
                                    {s.referenceNote && <p className="admin-row-note"><strong>{t('customerNote')}:</strong> {s.referenceNote}</p>}
                                    {s.adminNotes && <p className="admin-row-note admin-row-note--admin"><strong>{t('adminNote')}:</strong> {s.adminNotes}</p>}
                                    <div className="admin-row-actions" style={{ marginTop: 8 }}>
                                        {s.slipUrl && (
                                            <a href={s.slipUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">{t('viewSlip')}</a>
                                        )}
                                    </div>
                                </div>
                                {s.status === 'review' && (
                                    <div className="admin-row-actions">
                                        <button type="button" className="btn btn-primary btn-sm" onClick={() => { setReviewing({ slip: s, action: 'approve' }); setReviewNotes(''); }}>{t('approve')}</button>
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => { setReviewing({ slip: s, action: 'reject' }); setReviewNotes(''); }}>{t('reject')}</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {reviewing && (
                    <div className="admin-modal" role="dialog" aria-modal="true">
                        <div className="admin-modal-body">
                            <h2>{reviewing.action === 'approve' ? t('approveTitle') : t('rejectTitle')}</h2>
                            <p>
                                {t('confirmReview', { number: reviewing.slip.orderNumber || `#${reviewing.slip.orderId}`, amount: formatUSD(reviewing.slip.amountCents, reviewing.slip.currency || 'USD') })}
                            </p>
                            <div className="form-group">
                                <label className="form-label">{t('notesLabel')}</label>
                                <textarea
                                    className="form-input"
                                    rows={4}
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                    placeholder={reviewing.action === 'reject' ? t('notesRejectPlaceholder') : t('notesPlaceholder')}
                                />
                            </div>
                            <div className="admin-modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setReviewing(null)} disabled={busy}>{t('cancel')}</button>
                                <button
                                    type="button"
                                    className={`btn ${reviewing.action === 'approve' ? 'btn-primary' : 'btn-danger'}${busy ? ' btn-loading' : ''}`}
                                    onClick={submitReview}
                                    disabled={busy}
                                >
                                    {busy ? t('submitting') : reviewing.action === 'approve' ? t('approve') : t('reject')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
