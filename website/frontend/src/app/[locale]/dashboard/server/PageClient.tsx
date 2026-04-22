'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { getAuthToken } from '@/lib/api/authApi';
import { apiListUserServers, apiRotateUserServerKey, type UserServer } from '@/lib/api/billingApi';

function formatDate(iso?: string) {
    if (!iso) return '—';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
function formatDateTime(iso?: string) {
    if (!iso) return '—';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function CopyButton({ value, label }: { value: string; label: string }) {
    const [copied, setCopied] = useState(false);
    const t = useTranslations('dashboard.serverInfo');
    return (
        <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(value);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                } catch {
                    /* ignore */
                }
            }}
            aria-label={label}
        >
            {copied ? t('copied') : t('copy')}
        </button>
    );
}

export default function ServerInfoClient() {
    const t = useTranslations('dashboard.serverInfo');
    const { user, loading } = useAuth();

    const [servers, setServers] = useState<UserServer[] | null>(null);
    const [error, setError] = useState('');
    const [rotateBusy, setRotateBusy] = useState<number | null>(null);
    const [justRotatedKey, setJustRotatedKey] = useState<{ serverId: number; key: string } | null>(null);

    const load = async () => {
        const token = getAuthToken();
        if (!token) return;
        try {
            const s = await apiListUserServers(token);
            setServers(s);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load');
        }
    };

    useEffect(() => {
        if (!loading && user) void load();
    }, [loading, user]);

    const rotate = async (serverId: number) => {
        if (!confirm(t('rotateConfirm'))) return;
        const token = getAuthToken();
        if (!token) return;
        setRotateBusy(serverId);
        setError('');
        try {
            const res = await apiRotateUserServerKey(token, serverId);
            setJustRotatedKey({ serverId, key: res.apiKey });
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Rotate failed');
        } finally {
            setRotateBusy(null);
        }
    };

    if (loading || !user) return null;

    return (
        <>
            <h1 className="dash-page-title">{t('title')}</h1>

            {error && <div className="form-banner form-banner--error">{error}</div>}

            {!servers ? (
                <div className="dash-form-card">
                    <div className="dashboard-loading"><div className="dashboard-loading-spinner" /></div>
                </div>
            ) : servers.length === 0 ? (
                <div className="dash-form-card">
                    <div className="dash-empty-state">
                        <div className="dash-empty-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <rect width="20" height="8" x="2" y="2" rx="2" />
                                <rect width="20" height="8" x="2" y="14" rx="2" />
                                <line x1="6" x2="6.01" y1="6" y2="6" />
                                <line x1="6" x2="6.01" y1="18" y2="18" />
                            </svg>
                        </div>
                        <h3>{t('emptyTitle')}</h3>
                        <p>{t('emptyDesc')}</p>
                        <Link href="/buy" className="btn btn-primary" style={{ marginTop: 16 }}>
                            {t('browseProducts')}
                        </Link>
                    </div>
                </div>
            ) : (
                servers.map((srv) => (
                    <div key={srv.id} className="server-block">
                        {/* Credentials card */}
                        <div className="dash-form-card">
                            <div className="server-card-head">
                                <h2 className="dash-section-title">{t('credentials.title')}</h2>
                                <span className={`dash-status-pill dash-status-pill--${srv.status === 'active' ? 'paid' : srv.status === 'degraded' ? 'failed' : 'pending'}`}>
                                    {t(`statuses.${srv.status}` as any) || srv.status}
                                </span>
                            </div>
                            <p className="dash-section-desc">{t('credentials.desc')}</p>

                            {justRotatedKey && justRotatedKey.serverId === srv.id && (
                                <div className="form-banner form-banner--info" style={{ marginTop: 12 }}>
                                    <div style={{ fontWeight: 700, marginBottom: 6 }}>{t('newKeyTitle')}</div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <code className="server-key-reveal">{justRotatedKey.key}</code>
                                        <CopyButton value={justRotatedKey.key} label={t('copy')} />
                                    </div>
                                    <div style={{ marginTop: 6, fontSize: '0.82rem', opacity: 0.85 }}>{t('newKeyWarn')}</div>
                                </div>
                            )}

                            <dl className="server-cred-list">
                                <div className="server-cred-row">
                                    <dt>{t('credentials.apiBase')}</dt>
                                    <dd>
                                        <code>{srv.apiBaseUrl || '—'}</code>
                                        {srv.apiBaseUrl && <CopyButton value={srv.apiBaseUrl} label={t('copy')} />}
                                    </dd>
                                </div>
                                <div className="server-cred-row">
                                    <dt>{t('credentials.apiKey')}</dt>
                                    <dd>
                                        <code>gcss_••••••••••••{srv.apiKeyLast4 || '????'}</code>
                                        <button
                                            type="button"
                                            className={`btn btn-secondary btn-sm${rotateBusy === srv.id ? ' btn-loading' : ''}`}
                                            disabled={rotateBusy === srv.id}
                                            onClick={() => rotate(srv.id)}
                                        >
                                            {t('rotate')}
                                        </button>
                                    </dd>
                                </div>
                                <div className="server-cred-row">
                                    <dt>{t('credentials.ocpp')}</dt>
                                    <dd>
                                        <code>{srv.ocppEndpoint || '—'}</code>
                                        {srv.ocppEndpoint && <CopyButton value={srv.ocppEndpoint} label={t('copy')} />}
                                    </dd>
                                </div>
                                <div className="server-cred-row">
                                    <dt>{t('credentials.webhook')}</dt>
                                    <dd>
                                        <code>{srv.webhookUrl || '—'}</code>
                                        {srv.webhookUrl && <CopyButton value={srv.webhookUrl} label={t('copy')} />}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Status card */}
                        <div className="dash-form-card">
                            <h2 className="dash-section-title">{t('status.title')}</h2>
                            <p className="dash-section-desc">{t('status.desc')}</p>
                            <div className="server-status-grid">
                                <div className="server-status-cell">
                                    <div className="server-status-label">{t('status.region')}</div>
                                    <div className="server-status-value">{srv.region}</div>
                                </div>
                                <div className="server-status-cell">
                                    <div className="server-status-label">{t('status.uptime')}</div>
                                    <div className="server-status-value">{srv.uptimePct.toFixed(2)}%</div>
                                </div>
                                <div className="server-status-cell">
                                    <div className="server-status-label">{t('status.chargers')}</div>
                                    <div className="server-status-value">{srv.connectedChargers} / {srv.maxChargers || '∞'}</div>
                                </div>
                                <div className="server-status-cell">
                                    <div className="server-status-label">{t('status.lastBackup')}</div>
                                    <div className="server-status-value">{formatDateTime(srv.lastBackupAt)}</div>
                                </div>
                                <div className="server-status-cell">
                                    <div className="server-status-label">{t('status.created')}</div>
                                    <div className="server-status-value">{formatDate(srv.createdAt)}</div>
                                </div>
                            </div>
                            {srv.notes && (
                                <div style={{ marginTop: 16 }}>
                                    <div className="server-status-label">{t('status.notes')}</div>
                                    <div className="server-status-value">{srv.notes}</div>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </>
    );
}
