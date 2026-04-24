'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { getAuthToken } from '@/lib/api/authApi';
import { apiUploadFile } from '@/lib/api/adminApi';
import {
    apiGetOrderByNumber,
    apiListBankAccounts,
    apiListOrderSlips,
    apiUploadBankSlip,
    type BankAccount,
    type BankSlip,
    type Order,
} from '@/lib/api/billingApi';

function formatUSD(cents: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100);
}

function CopyBtn({ value }: { value: string }) {
    const t = useTranslations('bankTransfer');
    const [copied, setCopied] = useState(false);
    if (!value) return null;
    return (
        <button
            type="button"
            className="bt-copy"
            aria-label={t('copy')}
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(value);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                } catch {
                    /* noop */
                }
            }}
        >
            {copied ? t('copied') : t('copy')}
        </button>
    );
}

export default function BankTransferClient() {
    const t = useTranslations('bankTransfer');
    const params = useSearchParams();
    const orderNumber = params?.get('order') || '';
    const { user, loading: authLoading } = useAuth();

    const [order, setOrder] = useState<Order | null>(null);
    const [banks, setBanks] = useState<BankAccount[]>([]);
    const [slips, setSlips] = useState<BankSlip[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [file, setFile] = useState<File | null>(null);
    const [selectedBank, setSelectedBank] = useState('');
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user) return;
        const token = getAuthToken();
        if (!token || !orderNumber) {
            setLoadError(t('noOrder'));
            setLoading(false);
            return;
        }
        Promise.all([
            apiGetOrderByNumber(token, orderNumber).catch(() => null),
            apiListBankAccounts().catch(() => [] as BankAccount[]),
            apiListOrderSlips(token, orderNumber).catch(() => [] as BankSlip[]),
        ])
            .then(([o, b, s]) => {
                if (!o) {
                    setLoadError(t('notFound'));
                } else {
                    setOrder(o);
                }
                setBanks(b);
                setSlips(s);
            })
            .catch((err) => setLoadError(err instanceof Error ? err.message : String(err)))
            .finally(() => setLoading(false));
    }, [user, authLoading, orderNumber, t]);

    const hasDeposit = order ? order.depositCents > 0 : false;
    const balance = order ? (order.balanceCents > 0 ? order.balanceCents : order.totalCents) : 0;

    const reload = async () => {
        const token = getAuthToken();
        if (!token) return;
        try {
            const s = await apiListOrderSlips(token, orderNumber);
            setSlips(s);
            const o = await apiGetOrderByNumber(token, orderNumber);
            if (o) setOrder(o);
        } catch {
            /* noop */
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');
        if (!file) {
            setSubmitError(t('selectFile'));
            return;
        }
        const token = getAuthToken();
        if (!token || !order) return;

        setSubmitting(true);
        try {
            const uploadedUrl = await apiUploadFile(token, file);
            // Kind defaults to "balance" — but if no deposit was ever paid,
            // this slip represents the full payment.
            const kind: 'deposit' | 'balance' | 'full' = hasDeposit ? 'balance' : 'full';
            await apiUploadBankSlip(token, {
                orderNumber,
                kind,
                amountCents: balance,
                bankName: selectedBank,
                referenceNote: note,
                slipUrl: uploadedUrl,
            });
            setSubmitted(true);
            setFile(null);
            setSelectedBank('');
            setNote('');
            await reload();
            setTimeout(() => setSubmitted(false), 4000);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : t('uploadFailed'));
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loading) {
        return (
            <section className="section container">
                <div className="dashboard-loading"><div className="dashboard-loading-spinner" /><p>{t('loading')}</p></div>
            </section>
        );
    }

    if (!user) {
        return (
            <section className="section container">
                <div className="form-banner form-banner--error" role="alert">{t('mustLogin')}</div>
            </section>
        );
    }

    if (loadError || !order) {
        return (
            <section className="section container">
                <div className="form-banner form-banner--error" role="alert">{loadError || t('notFound')}</div>
                <div style={{ marginTop: 20 }}>
                    <Link href="/dashboard/payments" className="btn btn-secondary">{t('backToPayments')}</Link>
                </div>
            </section>
        );
    }

    // Allow retry on rejected slips; otherwise a pending review blocks new uploads.
    const activeSlip = slips.find((s) => s.status === 'review' || s.status === 'approved');
    const canUpload = !activeSlip;

    return (
        <section className="section">
            <div className="container bt-layout">
                <header className="bt-header">
                    <span className="section-label">{t('label')}</span>
                    <h1 className="bt-title">{t('title')}</h1>
                    <p className="bt-subtitle">{t('subtitle', { amount: formatUSD(balance) })}</p>
                </header>

                <div className="bt-grid">
                    <div className="bt-main">
                        {/* Order summary */}
                        <div className="bt-card">
                            <h2 className="bt-card-title">{t('orderSummary')}</h2>
                            <div className="bt-meta">
                                <div className="bt-meta-row">
                                    <span className="bt-meta-k">{t('orderNumber')}</span>
                                    <span className="bt-meta-v"><code>{order.orderNumber}</code> <CopyBtn value={order.orderNumber} /></span>
                                </div>
                                <div className="bt-meta-row">
                                    <span className="bt-meta-k">{t('product')}</span>
                                    <span className="bt-meta-v">{order.productLabel}</span>
                                </div>
                                <div className="bt-meta-row">
                                    <span className="bt-meta-k">{t('totalOrder')}</span>
                                    <span className="bt-meta-v">{formatUSD(order.totalCents)}</span>
                                </div>
                                {hasDeposit && (
                                    <div className="bt-meta-row">
                                        <span className="bt-meta-k">{t('depositPaid')}</span>
                                        <span className="bt-meta-v">−{formatUSD(order.depositCents)}</span>
                                    </div>
                                )}
                                <div className="bt-meta-row bt-meta-row--accent">
                                    <span className="bt-meta-k">{t('balanceDue')}</span>
                                    <span className="bt-meta-v">{formatUSD(balance)}</span>
                                </div>
                                <div className="bt-meta-row">
                                    <span className="bt-meta-k">{t('status')}</span>
                                    <span className="bt-meta-v"><StatusPill status={order.status} /></span>
                                </div>
                            </div>
                        </div>

                        {/* Bank accounts */}
                        <div className="bt-card">
                            <h2 className="bt-card-title">{t('bankAccounts')}</h2>
                            {banks.length === 0 ? (
                                <p className="bt-empty">{t('noBanks')}</p>
                            ) : (
                                <div className="bt-banks">
                                    {banks.map((b) => (
                                        <div key={b.id} className="bt-bank">
                                            <div className="bt-bank-head">
                                                <h3 className="bt-bank-name">{b.label || b.bankName}</h3>
                                                <span className="bt-bank-currency">{b.currency}</span>
                                            </div>
                                            <dl className="bt-bank-dl">
                                                <BankField label={t('fieldBank')} value={b.bankName} />
                                                <BankField label={t('fieldAccountName')} value={b.accountName} />
                                                <BankField label={t('fieldAccountNumber')} value={b.accountNumber} copyable />
                                                {b.swiftCode && <BankField label={t('fieldSwift')} value={b.swiftCode} copyable />}
                                                {b.iban && <BankField label={t('fieldIban')} value={b.iban} copyable />}
                                                {b.bankAddress && <BankField label={t('fieldBankAddress')} value={b.bankAddress} />}
                                                {b.notes && <BankField label={t('fieldNotes')} value={b.notes} />}
                                            </dl>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="bt-notice">
                                <strong>{t('referenceLabel')}</strong>
                                <div className="bt-notice-body">
                                    <code>{order.orderNumber}</code>
                                    <CopyBtn value={order.orderNumber} />
                                </div>
                                <p className="bt-notice-help">{t('referenceHelp')}</p>
                            </div>
                        </div>

                        {/* Upload slip */}
                        <div className="bt-card">
                            <h2 className="bt-card-title">{t('uploadTitle')}</h2>
                            <p className="bt-card-desc">{t('uploadHelp')}</p>

                            {submitted && (
                                <div className="form-banner form-banner--success" role="status">{t('uploadSuccess')}</div>
                            )}
                            {submitError && (
                                <div className="form-banner form-banner--error" role="alert">{submitError}</div>
                            )}

                            {canUpload ? (
                                <form onSubmit={handleSubmit} className="bt-form">
                                    <div className="form-group">
                                        <label htmlFor="bt-bank-select" className="form-label">{t('formBank')}</label>
                                        <select
                                            id="bt-bank-select"
                                            className="form-input"
                                            value={selectedBank}
                                            onChange={(e) => setSelectedBank(e.target.value)}
                                        >
                                            <option value="">{t('formBankPlaceholder')}</option>
                                            {banks.map((b) => (
                                                <option key={b.id} value={b.bankName || b.label}>{b.label || b.bankName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="bt-note" className="form-label">{t('formNote')}</label>
                                        <input
                                            id="bt-note"
                                            type="text"
                                            className="form-input"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder={t('formNotePlaceholder')}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="bt-file" className="form-label">{t('formFile')}</label>
                                        <input
                                            id="bt-file"
                                            type="file"
                                            className="form-input"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            required
                                        />
                                        <p className="bt-field-help">{t('formFileHelp')}</p>
                                    </div>
                                    <button
                                        type="submit"
                                        className={`btn btn-primary btn-lg${submitting ? ' btn-loading' : ''}`}
                                        disabled={submitting || !file}
                                    >
                                        {submitting ? t('submitBusy') : t('submit')}
                                    </button>
                                </form>
                            ) : (
                                <div className="form-banner form-banner--info" role="status">{t('alreadyUploaded')}</div>
                            )}
                        </div>

                        {/* Existing slips */}
                        {slips.length > 0 && (
                            <div className="bt-card">
                                <h2 className="bt-card-title">{t('slipsHistory')}</h2>
                                <div className="bt-slips">
                                    {slips.map((s) => (
                                        <div key={s.id} className="bt-slip">
                                            <div className="bt-slip-head">
                                                <span className="bt-slip-kind">{t('slipKind.' + (s.kind || 'balance'))}</span>
                                                <StatusPill status={s.status} />
                                            </div>
                                            <div className="bt-slip-meta">
                                                <span>{formatUSD(s.amountCents)}</span>
                                                {s.bankName && <span>· {s.bankName}</span>}
                                                <span>· {new Date(s.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            {s.referenceNote && <p className="bt-slip-note">{s.referenceNote}</p>}
                                            {s.adminNotes && <p className="bt-slip-admin"><strong>{t('adminNote')}:</strong> {s.adminNotes}</p>}
                                            {s.slipUrl && (
                                                <a href={s.slipUrl} target="_blank" rel="noopener noreferrer" className="bt-slip-link">{t('viewSlip')}</a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function BankField({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
    return (
        <>
            <dt>{label}</dt>
            <dd>
                <span className="bt-bank-v">{value}</span>
                {copyable && <CopyBtn value={value} />}
            </dd>
        </>
    );
}

function StatusPill({ status }: { status: string }) {
    const t = useTranslations('bankTransfer');
    const map: Record<string, { label: string; cls: string }> = {
        review: { label: t('statusReview'), cls: 'review' },
        approved: { label: t('statusApproved'), cls: 'approved' },
        rejected: { label: t('statusRejected'), cls: 'rejected' },
        pending: { label: t('statusPending'), cls: 'pending' },
        awaiting_transfer: { label: t('statusAwaiting'), cls: 'pending' },
        deposit_paid: { label: t('statusDepositPaid'), cls: 'review' },
        paid: { label: t('statusPaid'), cls: 'approved' },
    };
    const m = map[status] || { label: status, cls: 'pending' };
    return <span className={`bt-pill bt-pill--${m.cls}`}>{m.label}</span>;
}
