'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { apiLogout, apiMe, getAuthToken, setAuthToken, type AuthUser } from '@/lib/api/authApi';
import { apiAdminOverview, type AdminOverview } from '@/lib/api/adminApi';

function formatNumber(n: number | undefined) {
    if (typeof n !== 'number' || Number.isNaN(n)) return '—';
    return n.toLocaleString();
}

export default function AdminPageClient() {
    const t = useTranslations();
    const router = useRouter();

    const [me, setMe] = useState<AuthUser | null>(null);
    const [overview, setOverview] = useState<AdminOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const kpis = useMemo(() => {
        return [
            { key: 'users', label: t('admin.kpis.users'), value: formatNumber(overview?.usersTotal) },
            { key: 'admins', label: t('admin.kpis.admins'), value: formatNumber(overview?.adminsTotal) },
            { key: 'sessions', label: t('admin.kpis.sessions'), value: formatNumber(overview?.sessionsActive) },
            { key: 'forms', label: t('admin.kpis.formRequests'), value: formatNumber(overview?.formRequestsTotal) },
            { key: 'blog', label: t('admin.kpis.blogPosts'), value: formatNumber(overview?.blogPostsTotal) },
            { key: 'topics', label: t('admin.kpis.forumTopics'), value: formatNumber(overview?.forumTopicsTotal) },
            { key: 'posts', label: t('admin.kpis.forumPosts'), value: formatNumber(overview?.forumPostsTotal) },
        ];
    }, [overview, t]);

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.replace('/login');
            return;
        }

        const authToken = token;

        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError('');

                const meResp = await apiMe(authToken);
                if (cancelled) return;

                const role = (meResp.user?.role || '').toLowerCase();
                if (role !== 'admin') {
                    router.replace('/demo');
                    return;
                }

                setMe(meResp.user);

                const overviewResp = await apiAdminOverview(authToken);
                if (cancelled) return;
                setOverview(overviewResp.overview);
            } catch {
                if (cancelled) return;
                setAuthToken(null);
                setError(t('admin.errors.unauthorized'));
                router.replace('/login');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, [router, t]);

    const onLogout = async () => {
        const token = getAuthToken();
        setAuthToken(null);
        try {
            if (token) await apiLogout(token);
        } catch {
            // ignore
        }
        router.replace('/login');
    };

    return (
        <section className="admin-page">
            <div className="admin-bg" aria-hidden="true" />

            <div className="container">
                <div className="admin-header">
                    <div>
                        <h1 className="admin-title">{t('admin.title')}</h1>
                        <p className="admin-subtitle">{t('admin.subtitle')}</p>
                        {me && (
                            <div className="admin-meta">
                                <span className="admin-chip">{t('admin.signedInAs', { username: me.username })}</span>
                                <span className="admin-chip admin-chip-gold">{(me.role || 'admin').toUpperCase()}</span>
                            </div>
                        )}
                    </div>

                    <div className="admin-actions">
                        <Link className="btn btn-outline" href="/">
                            {t('admin.actions.backToSite')}
                        </Link>
                        <button type="button" className="btn btn-secondary" onClick={onLogout}>
                            {t('admin.actions.logout')}
                        </button>
                    </div>
                </div>

                {error && <div className="admin-alert admin-alert-error">{error}</div>}

                {loading ? (
                    <div className="admin-loading glass-card">{t('admin.loading')}</div>
                ) : (
                    <>
                        <div className="admin-kpi-grid">
                            {kpis.map((k) => (
                                <div key={k.key} className="glass-card admin-kpi">
                                    <div className="admin-kpi-label">{k.label}</div>
                                    <div className="admin-kpi-value">{k.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="glass-card admin-note">
                            <h2 className="admin-note-title">{t('admin.nextSteps.title')}</h2>
                            <ul className="admin-note-list">
                                <li>{t('admin.nextSteps.item1')}</li>
                                <li>{t('admin.nextSteps.item2')}</li>
                                <li>{t('admin.nextSteps.item3')}</li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
