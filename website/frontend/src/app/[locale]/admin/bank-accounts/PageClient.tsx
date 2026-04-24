'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { apiMe, getAuthToken } from '@/lib/api/authApi';
import {
    apiAdminListBankAccounts,
    apiAdminSaveBankAccount,
    apiAdminDeleteBankAccount,
    type BankAccount,
} from '@/lib/api/billingApi';

function emptyAccount(): BankAccount {
    return {
        id: 0,
        label: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
        swiftCode: '',
        iban: '',
        bankAddress: '',
        currency: 'USD',
        notes: '',
        isActive: true,
        sortOrder: 0,
        createdAt: '',
        updatedAt: '',
    };
}

export default function AdminBankAccountsClient() {
    const t = useTranslations('admin.bankAccounts');
    const router = useRouter();
    const [items, setItems] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [editing, setEditing] = useState<BankAccount | null>(null);
    const [saving, setSaving] = useState(false);

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
                    return null;
                }
                return apiAdminListBankAccounts(token);
            })
            .then((list) => {
                if (list) setItems(list);
            })
            .catch(() => setError(t('loadError')))
            .finally(() => setLoading(false));
    }, [router, t]);

    const handleSave = async () => {
        if (!editing) return;
        const token = getAuthToken();
        if (!token) return;
        setSaving(true);
        try {
            const saved = await apiAdminSaveBankAccount(token, editing);
            setItems((prev) => {
                const i = prev.findIndex((x) => x.id === saved.id);
                if (i >= 0) {
                    const copy = [...prev];
                    copy[i] = saved;
                    return copy;
                }
                return [...prev, saved];
            });
            setEditing(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('saveError'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(t('confirmDelete'))) return;
        const token = getAuthToken();
        if (!token) return;
        try {
            await apiAdminDeleteBankAccount(token, id);
            setItems((prev) => prev.filter((x) => x.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : t('deleteError'));
        }
    };

    if (loading) {
        return (
            <section className="section container">
                <div className="dashboard-loading"><div className="dashboard-loading-spinner" /><p>{t('loading')}</p></div>
            </section>
        );
    }

    return (
        <section className="section">
            <div className="container">
                <div className="admin-page-head">
                    <div>
                        <Link href="/admin" className="admin-back-link">← {t('back')}</Link>
                        <h1>{t('title')}</h1>
                        <p>{t('subtitle')}</p>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => setEditing(emptyAccount())}>
                        {t('add')}
                    </button>
                </div>

                {error && <div className="form-banner form-banner--error" role="alert">{error}</div>}

                {items.length === 0 ? (
                    <p className="admin-empty">{t('empty')}</p>
                ) : (
                    <div className="admin-list">
                        {items.map((b) => (
                            <div key={b.id} className="admin-row">
                                <div className="admin-row-body">
                                    <div className="admin-row-head">
                                        <h3>{b.label || b.bankName || '(unlabeled)'}</h3>
                                        <span className={`bt-pill bt-pill--${b.isActive ? 'approved' : 'pending'}`}>
                                            {b.isActive ? t('active') : t('inactive')}
                                        </span>
                                    </div>
                                    <div className="admin-row-meta">
                                        <span>{b.bankName}</span>
                                        {b.accountNumber && <span>· {b.accountNumber}</span>}
                                        {b.currency && <span>· {b.currency}</span>}
                                        {b.swiftCode && <span>· SWIFT: {b.swiftCode}</span>}
                                    </div>
                                </div>
                                <div className="admin-row-actions">
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing({ ...b })}>{t('edit')}</button>
                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>{t('delete')}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {editing && (
                    <div className="admin-modal" role="dialog" aria-modal="true">
                        <div className="admin-modal-body">
                            <h2>{editing.id ? t('editTitle') : t('addTitle')}</h2>

                            <div className="form-grid-2">
                                <Field label={t('fieldLabel')} value={editing.label} onChange={(v) => setEditing({ ...editing, label: v })} />
                                <Field label={t('fieldCurrency')} value={editing.currency} onChange={(v) => setEditing({ ...editing, currency: v })} />
                                <Field label={t('fieldBankName')} value={editing.bankName} onChange={(v) => setEditing({ ...editing, bankName: v })} />
                                <Field label={t('fieldAccountName')} value={editing.accountName} onChange={(v) => setEditing({ ...editing, accountName: v })} />
                                <Field label={t('fieldAccountNumber')} value={editing.accountNumber} onChange={(v) => setEditing({ ...editing, accountNumber: v })} />
                                <Field label={t('fieldSwift')} value={editing.swiftCode} onChange={(v) => setEditing({ ...editing, swiftCode: v })} />
                                <Field label={t('fieldIban')} value={editing.iban} onChange={(v) => setEditing({ ...editing, iban: v })} />
                                <Field label={t('fieldSortOrder')} type="number" value={String(editing.sortOrder)} onChange={(v) => setEditing({ ...editing, sortOrder: parseInt(v || '0', 10) || 0 })} />
                            </div>

                            <Field label={t('fieldBankAddress')} value={editing.bankAddress} onChange={(v) => setEditing({ ...editing, bankAddress: v })} />

                            <div className="form-group">
                                <label className="form-label">{t('fieldNotes')}</label>
                                <textarea
                                    className="form-input"
                                    value={editing.notes}
                                    onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <label className="form-check">
                                <input
                                    type="checkbox"
                                    checked={editing.isActive}
                                    onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                                />
                                <span>{t('fieldActive')}</span>
                            </label>

                            <div className="admin-modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)} disabled={saving}>{t('cancel')}</button>
                                <button type="button" className={`btn btn-primary${saving ? ' btn-loading' : ''}`} onClick={handleSave} disabled={saving}>
                                    {saving ? t('saving') : t('save')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function Field({ label, value, onChange, type }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
    return (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <input
                type={type || 'text'}
                className="form-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
