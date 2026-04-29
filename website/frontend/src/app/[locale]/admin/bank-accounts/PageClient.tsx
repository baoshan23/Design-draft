'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { apiMe, getAuthToken } from '@/lib/api/authApi';
import {
    apiAdminListBankAccounts,
    apiAdminSaveBankAccount,
    apiAdminDeleteBankAccount,
    type BankAccount,
} from '@/lib/api/billingApi';

type StatusFilter = 'all' | 'active' | 'inactive';
type SortKey = 'sortOrder' | 'label' | 'createdAt';

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
    const [busyId, setBusyId] = useState<number | null>(null);

    // Toolbar state
    const [search, setSearch] = useState('');
    const [debounced, setDebounced] = useState('');
    const [status, setStatus] = useState<StatusFilter>('all');
    const [sort, setSort] = useState<SortKey>('sortOrder');

    useEffect(() => {
        const id = setTimeout(() => setDebounced(search.trim().toLowerCase()), 180);
        return () => clearTimeout(id);
    }, [search]);

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

    const filtered = useMemo(() => {
        let out = items;
        if (status !== 'all') {
            const want = status === 'active';
            out = out.filter((b) => b.isActive === want);
        }
        if (debounced) {
            out = out.filter((b) =>
                [b.label, b.bankName, b.accountName, b.accountNumber, b.swiftCode, b.iban, b.currency]
                    .filter(Boolean)
                    .some((v) => String(v).toLowerCase().includes(debounced))
            );
        }
        const sorted = [...out];
        sorted.sort((a, b) => {
            if (sort === 'label') return (a.label || a.bankName).localeCompare(b.label || b.bankName);
            if (sort === 'createdAt') return (b.createdAt || '').localeCompare(a.createdAt || '');
            return (a.sortOrder - b.sortOrder) || (a.id - b.id);
        });
        return sorted;
    }, [items, debounced, status, sort]);

    const counts = useMemo(() => {
        const active = items.filter((b) => b.isActive).length;
        return { all: items.length, active, inactive: items.length - active };
    }, [items]);

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

    const handleDelete = useCallback(async (id: number) => {
        if (!confirm(t('confirmDelete'))) return;
        const token = getAuthToken();
        if (!token) return;
        try {
            await apiAdminDeleteBankAccount(token, id);
            setItems((prev) => prev.filter((x) => x.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : t('deleteError'));
        }
    }, [t]);

    const handleToggleActive = useCallback(async (b: BankAccount) => {
        const token = getAuthToken();
        if (!token) return;
        setBusyId(b.id);
        try {
            const saved = await apiAdminSaveBankAccount(token, { ...b, isActive: !b.isActive });
            setItems((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
        } catch (err) {
            setError(err instanceof Error ? err.message : t('saveError'));
        } finally {
            setBusyId(null);
        }
    }, [t]);

    if (loading) {
        return (
            <section className="section">
                <div className="container">
                    <div className="admin-page-head">
                        <div>
                            <Link href="/admin" className="admin-back-link" aria-disabled>
                                <BackIcon />
                                {t('back')}
                            </Link>
                            <h1>{t('title')}</h1>
                            <p>{t('subtitle')}</p>
                        </div>
                    </div>
                    <div className="bank-grid" aria-busy="true" aria-label={t('loading')}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bank-card bank-card--skeleton" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section">
            <div className="container">
                <div className="admin-page-head">
                    <div>
                        <Link href="/admin" className="admin-back-link">
                            <BackIcon />
                            {t('back')}
                        </Link>
                        <h1>{t('title')}</h1>
                        <p>{t('subtitle')}</p>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => setEditing(emptyAccount())}>
                        <span aria-hidden style={{ fontSize: '1.1em', marginRight: 6, lineHeight: 1 }}>+</span>
                        {t('add')}
                    </button>
                </div>

                {error && (
                    <div className="form-banner form-banner--error" role="alert">
                        {error}
                        <button type="button" className="form-banner-dismiss" aria-label="Dismiss" onClick={() => setError('')}>×</button>
                    </div>
                )}

                {items.length > 0 && (
                    <div className="admin-toolbar">
                        <div className="admin-toolbar-search">
                            <SearchIcon />
                            <input
                                type="search"
                                className="form-input"
                                placeholder={t('searchPlaceholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label={t('searchPlaceholder')}
                            />
                        </div>
                        <div className="admin-filter-row" role="tablist" aria-label={t('filterStatus')}>
                            {(['all', 'active', 'inactive'] as StatusFilter[]).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    role="tab"
                                    aria-selected={status === s}
                                    className={`admin-filter-tab${status === s ? ' admin-filter-tab--active' : ''}`}
                                    onClick={() => setStatus(s)}
                                >
                                    {t(`filter${s.charAt(0).toUpperCase()}${s.slice(1)}` as 'filterAll' | 'filterActive' | 'filterInactive')}
                                    <span className="admin-filter-count">{counts[s]}</span>
                                </button>
                            ))}
                        </div>
                        <label className="admin-toolbar-sort">
                            <span>{t('sortLabel')}</span>
                            <select
                                className="form-input"
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortKey)}
                            >
                                <option value="sortOrder">{t('sortBySortOrder')}</option>
                                <option value="label">{t('sortByLabel')}</option>
                                <option value="createdAt">{t('sortByNewest')}</option>
                            </select>
                        </label>
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="admin-empty admin-empty--rich">
                        <div className="admin-empty-icon" aria-hidden>
                            <BankIcon size={32} />
                        </div>
                        <p>{t('empty')}</p>
                        <button type="button" className="btn btn-primary" onClick={() => setEditing(emptyAccount())}>
                            {t('add')}
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <p className="admin-empty">{t('noMatches')}</p>
                ) : (
                    <div className="bank-grid">
                        {filtered.map((b) => (
                            <BankCard
                                key={b.id}
                                account={b}
                                busy={busyId === b.id}
                                onEdit={() => setEditing({ ...b })}
                                onDelete={() => handleDelete(b.id)}
                                onToggle={() => handleToggleActive(b)}
                                t={t}
                            />
                        ))}
                    </div>
                )}

                {editing && (
                    <EditModal
                        account={editing}
                        saving={saving}
                        onChange={setEditing}
                        onCancel={() => setEditing(null)}
                        onSave={handleSave}
                        t={t}
                    />
                )}
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────
// BankCard

type TFn = ReturnType<typeof useTranslations>;

function BankCard({
    account,
    busy,
    onEdit,
    onDelete,
    onToggle,
    t,
}: {
    account: BankAccount;
    busy: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onToggle: () => void;
    t: TFn;
}) {
    return (
        <article className={`bank-card${account.isActive ? '' : ' bank-card--muted'}`}>
            <header className="bank-card-head">
                <div className="bank-card-icon" aria-hidden>
                    {(account.label || account.bankName || '?').trim().charAt(0).toUpperCase()}
                </div>
                <div className="bank-card-title">
                    <h3>{account.label || account.bankName || t('unlabeled')}</h3>
                    <p>{[account.bankName, account.accountName].filter(Boolean).join(' · ')}</p>
                </div>
                {account.currency && <span className="bank-card-currency">{account.currency}</span>}
            </header>

            <div className="bank-card-fields">
                {account.accountNumber && (
                    <FieldRow label={t('fieldAccountNumber')} value={account.accountNumber} t={t} mono />
                )}
                {account.swiftCode && <FieldRow label={t('fieldSwift')} value={account.swiftCode} t={t} mono />}
                {account.iban && <FieldRow label={t('fieldIban')} value={account.iban} t={t} mono />}
            </div>

            <footer className="bank-card-foot">
                <label className={`switch${busy ? ' switch--busy' : ''}`}>
                    <input
                        type="checkbox"
                        checked={account.isActive}
                        onChange={onToggle}
                        disabled={busy}
                    />
                    <span className="switch-track" aria-hidden />
                    <span className="switch-label">{account.isActive ? t('active') : t('inactive')}</span>
                </label>
                <div className="bank-card-actions">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={onEdit}>{t('edit')}</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={onDelete}>{t('delete')}</button>
                </div>
            </footer>
        </article>
    );
}

function FieldRow({ label, value, t, mono }: { label: string; value: string; t: TFn; mono?: boolean }) {
    const [copied, setCopied] = useState(false);
    const onCopy = useCallback(() => {
        navigator.clipboard?.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        }).catch(() => { /* ignore */ });
    }, [value]);
    return (
        <div className="bank-field-row">
            <span className="bank-field-label">{label}</span>
            <span className={`bank-field-value${mono ? ' bank-field-value--mono' : ''}`} title={value}>{value}</span>
            <button
                type="button"
                className="bank-field-copy"
                onClick={onCopy}
                aria-label={copied ? t('copied') : t('copy')}
                title={copied ? t('copied') : t('copy')}
            >
                {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// Modal

function EditModal({
    account,
    saving,
    onChange,
    onCancel,
    onSave,
    t,
}: {
    account: BankAccount;
    saving: boolean;
    onChange: (a: BankAccount) => void;
    onCancel: () => void;
    onSave: () => void;
    t: TFn;
}) {
    const titleId = `bank-modal-title-${account.id || 'new'}`;
    const firstFieldRef = useRef<HTMLInputElement | null>(null);
    const restoreFocusRef = useRef<HTMLElement | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        restoreFocusRef.current = document.activeElement as HTMLElement | null;
        firstFieldRef.current?.focus();
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
            restoreFocusRef.current?.focus?.();
        };
    }, [onCancel]);

    const set = <K extends keyof BankAccount>(k: K, v: BankAccount[K]) => onChange({ ...account, [k]: v });

    if (!mounted) return null;

    return createPortal(
        <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <form
                className="admin-modal-body admin-modal-body--sectioned"
                onSubmit={(e) => { e.preventDefault(); if (!saving) onSave(); }}
            >
                <header className="admin-modal-head">
                    <h2 id={titleId}>{account.id ? t('editTitle') : t('addTitle')}</h2>
                    <button type="button" className="admin-modal-close" onClick={onCancel} aria-label={t('cancel')}>×</button>
                </header>

                <fieldset className="admin-modal-section">
                    <legend>{t('sectionIdentity')}</legend>
                    <div className="form-grid-2">
                        <Field
                            id="bk-label"
                            label={t('fieldLabel')}
                            value={account.label}
                            onChange={(v) => set('label', v)}
                            inputRef={firstFieldRef}
                            autoComplete="off"
                        />
                        <Field
                            id="bk-currency"
                            label={t('fieldCurrency')}
                            value={account.currency}
                            onChange={(v) => set('currency', v.toUpperCase().slice(0, 8))}
                            autoComplete="off"
                        />
                        <Field
                            id="bk-sort"
                            label={t('fieldSortOrder')}
                            type="number"
                            value={String(account.sortOrder)}
                            onChange={(v) => set('sortOrder', parseInt(v || '0', 10) || 0)}
                        />
                    </div>
                </fieldset>

                <fieldset className="admin-modal-section">
                    <legend>{t('sectionBanking')}</legend>
                    <div className="form-grid-2">
                        <Field id="bk-bank" label={t('fieldBankName')} value={account.bankName} onChange={(v) => set('bankName', v)} />
                        <Field id="bk-holder" label={t('fieldAccountName')} value={account.accountName} onChange={(v) => set('accountName', v)} />
                        <Field id="bk-acct" label={t('fieldAccountNumber')} value={account.accountNumber} onChange={(v) => set('accountNumber', v)} mono />
                        <Field id="bk-swift" label={t('fieldSwift')} value={account.swiftCode} onChange={(v) => set('swiftCode', v.toUpperCase())} mono />
                        <Field id="bk-iban" label={t('fieldIban')} value={account.iban} onChange={(v) => set('iban', v.toUpperCase())} mono />
                    </div>
                    <Field id="bk-addr" label={t('fieldBankAddress')} value={account.bankAddress} onChange={(v) => set('bankAddress', v)} />
                </fieldset>

                <fieldset className="admin-modal-section">
                    <legend>{t('sectionNotes')}</legend>
                    <div className="form-group">
                        <label className="form-label" htmlFor="bk-notes">{t('fieldNotes')}</label>
                        <textarea
                            id="bk-notes"
                            className="form-input"
                            value={account.notes}
                            onChange={(e) => set('notes', e.target.value)}
                            rows={3}
                            placeholder={t('notesPlaceholder')}
                        />
                    </div>
                    <label className="form-check">
                        <input
                            type="checkbox"
                            checked={account.isActive}
                            onChange={(e) => set('isActive', e.target.checked)}
                        />
                        <span>{t('fieldActive')}</span>
                    </label>
                </fieldset>

                <footer className="admin-modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>{t('cancel')}</button>
                    <button type="submit" className={`btn btn-primary${saving ? ' btn-loading' : ''}`} disabled={saving}>
                        {saving ? t('saving') : t('save')}
                    </button>
                </footer>
            </form>
        </div>,
        document.body
    );
}

function Field({
    id,
    label,
    value,
    onChange,
    type,
    mono,
    inputRef,
    autoComplete,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    mono?: boolean;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    autoComplete?: string;
}) {
    return (
        <div className="form-group">
            <label className="form-label" htmlFor={id}>{label}</label>
            <input
                id={id}
                ref={inputRef}
                type={type || 'text'}
                className={`form-input${mono ? ' form-input--mono' : ''}`}
                value={value}
                autoComplete={autoComplete ?? 'off'}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// Inline icons

function BackIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>;
}
function SearchIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
}
function CopyIcon() {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
}
function CheckIcon() {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>;
}
function BankIcon({ size = 24 }: { size?: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m3 10 9-7 9 7" /><path d="M5 10v9" /><path d="M19 10v9" /><path d="M3 21h18" /><path d="M9 21V13" /><path d="M15 21V13" /></svg>;
}
