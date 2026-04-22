'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { getAuthToken } from '@/lib/api/authApi';
import {
    apiAdminListServers,
    apiAdminUpdateServer,
    apiAdminRegenerateServerKey,
    type UserServer,
} from '@/lib/api/billingApi';

const STATUSES = ['provisioning', 'active', 'degraded', 'suspended'];

export default function AdminServersClient() {
    const t = useTranslations('admin.servers');
    const tCommon = useTranslations('admin');
    const router = useRouter();
    const { user, loading } = useAuth();

    const [servers, setServers] = useState<UserServer[] | null>(null);
    const [error, setError] = useState('');
    const [busyId, setBusyId] = useState<number | null>(null);
    const [regenResult, setRegenResult] = useState<{ id: number; key: string } | null>(null);

    const token = typeof window !== 'undefined' ? getAuthToken() : null;

    const reload = useCallback(async () => {
        if (!token) return;
        setError('');
        try {
            setServers(await apiAdminListServers(token));
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

    const update = async (srv: UserServer, patch: Partial<UserServer>) => {
        if (!token) return;
        setBusyId(srv.id);
        try {
            await apiAdminUpdateServer(token, srv.id, { ...srv, ...patch });
            await reload();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed');
        } finally {
            setBusyId(null);
        }
    };

    const regenKey = async (srv: UserServer) => {
        if (!confirm(t('regenConfirm'))) return;
        if (!token) return;
        setBusyId(srv.id);
        try {
            const res = await apiAdminRegenerateServerKey(token, srv.id);
            setRegenResult({ id: srv.id, key: res.apiKey });
            await reload();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Regen failed');
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-bg" />
            <div className="container">
                <header className="admin-header">
                    <div className="admin-meta">
                        <span className="admin-chip admin-chip-gold">GCSS Admin</span>
                    </div>
                    <h1 className="admin-title">{t('title')}</h1>
                    <p className="admin-subtitle">{t('subtitle')}</p>
                    <nav className="admin-nav-grid" style={{ marginTop: 16 }}>
                        <Link href="/admin" className="admin-quicklink">← {tCommon('backToOverview')}</Link>
                    </nav>
                </header>

                {error && <div className="admin-alert admin-alert-error" role="alert">{error}</div>}

                {!servers ? (
                    <div className="admin-loading">{tCommon('loading')}</div>
                ) : servers.length === 0 ? (
                    <div className="admin-settings-group">
                        <p className="admin-settings-help">{t('empty')}</p>
                    </div>
                ) : (
                    servers.map((srv) => (
                        <section key={srv.id} className="admin-settings-group">
                            <div className="admin-settings-group-head">
                                <h2>#{srv.id} — user {srv.userId} (order {srv.orderId || '—'})</h2>
                                <p>{t('createdAt')}: {new Date(srv.createdAt).toLocaleString()}</p>
                            </div>

                            {regenResult && regenResult.id === srv.id && (
                                <div className="form-banner form-banner--info" style={{ marginBottom: 16 }}>
                                    <div style={{ fontWeight: 700, marginBottom: 6 }}>{t('regenResult')}</div>
                                    <code className="server-key-reveal">{regenResult.key}</code>
                                </div>
                            )}

                            <div className="admin-settings-fields">
                                <div className="admin-settings-field">
                                    <div className="admin-settings-label">{t('region')}</div>
                                    <input className="form-input" defaultValue={srv.region} onBlur={(e) => update(srv, { region: e.target.value })} />
                                </div>
                                <div className="admin-settings-field">
                                    <div className="admin-settings-label">{t('apiBase')}</div>
                                    <input className="form-input" defaultValue={srv.apiBaseUrl} onBlur={(e) => update(srv, { apiBaseUrl: e.target.value })} />
                                </div>
                                <div className="admin-settings-field">
                                    <div className="admin-settings-label">{t('ocpp')}</div>
                                    <input className="form-input" defaultValue={srv.ocppEndpoint} onBlur={(e) => update(srv, { ocppEndpoint: e.target.value })} />
                                </div>
                                <div className="admin-settings-field">
                                    <div className="admin-settings-label">{t('webhook')}</div>
                                    <input className="form-input" defaultValue={srv.webhookUrl} onBlur={(e) => update(srv, { webhookUrl: e.target.value })} />
                                </div>
                                <div className="admin-settings-field">
                                    <div className="admin-settings-label">{t('status')}</div>
                                    <select
                                        className="form-input"
                                        defaultValue={srv.status}
                                        disabled={busyId === srv.id}
                                        onChange={(e) => update(srv, { status: e.target.value as UserServer['status'] })}
                                    >
                                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="admin-settings-field">
                                    <div className="admin-settings-label">{t('uptime')}</div>
                                    <input className="form-input" type="number" step="0.01" defaultValue={srv.uptimePct} onBlur={(e) => update(srv, { uptimePct: parseFloat(e.target.value || '0') })} />
                                </div>
                                <div className="admin-settings-field">
                                    <div className="admin-settings-label">{t('chargers')}</div>
                                    <input className="form-input" type="number" defaultValue={srv.connectedChargers} onBlur={(e) => update(srv, { connectedChargers: parseInt(e.target.value || '0', 10) })} />
                                </div>
                                <div className="admin-settings-field">
                                    <div className="admin-settings-label">{t('maxChargers')}</div>
                                    <input className="form-input" type="number" defaultValue={srv.maxChargers} onBlur={(e) => update(srv, { maxChargers: parseInt(e.target.value || '0', 10) })} />
                                </div>
                                <div className="admin-settings-field">
                                    <div className="admin-settings-label">{t('lastBackup')}</div>
                                    <input className="form-input" type="datetime-local" defaultValue={srv.lastBackupAt ? new Date(srv.lastBackupAt).toISOString().slice(0, 16) : ''} onBlur={(e) => update(srv, { lastBackupAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })} />
                                </div>
                                <div className="admin-settings-field">
                                    <div className="admin-settings-label">{t('notes')}</div>
                                    <textarea className="form-textarea" rows={3} defaultValue={srv.notes} onBlur={(e) => update(srv, { notes: e.target.value })} />
                                </div>
                            </div>

                            <div className="admin-settings-actions" style={{ marginTop: 16 }}>
                                <button
                                    type="button"
                                    className={`btn btn-secondary btn-sm${busyId === srv.id ? ' btn-loading' : ''}`}
                                    disabled={busyId === srv.id}
                                    onClick={() => regenKey(srv)}
                                >
                                    {t('regenerateKey')}
                                </button>
                                <span className="admin-settings-updated">
                                    {t('apiKey')}: <code>gcss_••••{srv.apiKeyLast4}</code>
                                </span>
                            </div>
                        </section>
                    ))
                )}
            </div>
        </div>
    );
}
