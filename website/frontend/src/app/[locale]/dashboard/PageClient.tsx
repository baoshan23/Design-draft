'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/providers/AuthProvider';
import {
  getAuthToken,
  apiUserDashboard,
  apiUpdateProfile,
  apiChangePassword,
  type UserDashboardData,
} from '@/lib/api/authApi';

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

type Tab = 'overview' | 'profile' | 'security' | 'posts';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const { user, loading, logout, refresh } = useAuth();

  const [tab, setTab] = useState<Tab>('overview');
  const [dashData, setDashData] = useState<UserDashboardData | null>(null);

  // Profile
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '', company: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !user) return;
    let cancelled = false;
    apiUserDashboard(token)
      .then((res) => { if (!cancelled) setDashData(res.dashboard); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    if (user) {
      setProfileForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone, company: user.company || '' });
    }
  }, [user]);

  const handleLogout = async () => { await logout(); router.push('/login'); };

  const handleProfileSave = async () => {
    const token = getAuthToken();
    if (!token) return;
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await apiUpdateProfile(token, profileForm);
      await refresh();
      setProfileMsg({ type: 'success', text: t('profileUpdated') });
      setTimeout(() => setProfileMsg(null), 3000);
    } catch (err) {
      setProfileMsg({ type: 'error', text: err instanceof Error ? err.message : t('profileError') });
    } finally { setProfileSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwMsg({ type: 'error', text: t('passwordMismatch') }); return; }
    if (pwForm.newPassword.length < 8) { setPwMsg({ type: 'error', text: t('passwordTooShort') }); return; }
    const token = getAuthToken();
    if (!token) return;
    setPwSaving(true);
    setPwMsg(null);
    try {
      await apiChangePassword(token, { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwMsg({ type: 'success', text: t('passwordChanged') });
      setTimeout(() => setPwMsg(null), 3000);
    } catch (err) {
      setPwMsg({ type: 'error', text: err instanceof Error ? err.message : t('passwordError') });
    } finally { setPwSaving(false); }
  };

  if (loading) {
    return (
      <div className="dash-portal">
        <div className="dashboard-loading"><div className="dashboard-loading-spinner" /><p>{t('loading')}</p></div>
      </div>
    );
  }
  if (!user) return null;

  const initials = `${(user.firstName || '').charAt(0)}${(user.lastName || '').charAt(0)}`.toUpperCase() || user.username.charAt(0).toUpperCase();

  const navItems: { key: Tab; icon: React.ReactNode; label: string }[] = [
    { key: 'overview', label: t('nav.overview'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg> },
    { key: 'posts', label: t('nav.posts'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
    { key: 'profile', label: t('nav.profile'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
    { key: 'security', label: t('nav.security'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
  ];

  return (
    <div className="dash-portal">

      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-user">
          <div className="dash-sidebar-avatar">{initials}</div>
          <div className="dash-sidebar-name">{user.firstName} {user.lastName}</div>
          <div className="dash-sidebar-username">@{user.username}</div>
          <span className="dashboard-badge dashboard-badge--role">{user.role === 'admin' ? t('roleAdmin') : t('roleUser')}</span>
        </div>

        <nav className="dash-sidebar-nav">
          {navItems.map(item => (
            <button key={item.key} type="button" className={`dash-sidebar-btn${tab === item.key ? ' active' : ''}`} onClick={() => setTab(item.key)}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-bottom">
          {user.role === 'admin' && (
            <Link href="/admin" className="dash-sidebar-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
              <span>{t('adminPanel')}</span>
            </Link>
          )}
          <button type="button" className="dash-sidebar-btn dash-sidebar-btn--danger" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
            <span>{tNav('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dash-main">

        {/* ── Overview Tab ── */}
        {tab === 'overview' && (
          <div className="dash-content">
            <h1 className="dash-page-title">{t('welcomeBack', { name: user.firstName })}</h1>

            <div className="dashboard-stats-grid">
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon dashboard-stat-icon--amber">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                </div>
                <div className="dashboard-stat-info">
                  <div className="dashboard-stat-label">{t('stats.forumActivity')}</div>
                  <div className="dashboard-stat-value">{dashData ? `${dashData.forumTopics} ${t('stats.topics')}, ${dashData.forumPosts} ${t('stats.posts')}` : '—'}</div>
                </div>
              </div>
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon dashboard-stat-icon--purple">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <div className="dashboard-stat-info">
                  <div className="dashboard-stat-label">{t('stats.activeSessions')}</div>
                  <div className="dashboard-stat-value">{dashData ? dashData.activeSessions : '—'}</div>
                </div>
              </div>
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon dashboard-stat-icon--blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16M4 6h16M4 18h16" /></svg>
                </div>
                <div className="dashboard-stat-info">
                  <div className="dashboard-stat-label">{t('stats.email')}</div>
                  <div className="dashboard-stat-value">{user.email}</div>
                </div>
              </div>
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon dashboard-stat-icon--green">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                </div>
                <div className="dashboard-stat-info">
                  <div className="dashboard-stat-label">{t('stats.memberSince')}</div>
                  <div className="dashboard-stat-value">{formatDate(user.createdAt)}</div>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <h2 className="dash-section-title">{t('quickLinks.title')}</h2>
            <div className="dashboard-quicklinks-grid">
              <Link href="/forum" className="dashboard-quicklink">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                <span>{t('quickLinks.forum')}</span>
              </Link>
              <Link href="/blog" className="dashboard-quicklink">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                <span>{t('quickLinks.blog')}</span>
              </Link>
              <Link href="/docs" className="dashboard-quicklink">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                <span>{t('quickLinks.docs')}</span>
              </Link>
              <Link href="/contact" className="dashboard-quicklink">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <span>{t('quickLinks.contact')}</span>
              </Link>
            </div>
          </div>
        )}

        {/* ── My Posts Tab ── */}
        {tab === 'posts' && (
          <div className="dash-content">
            <div className="blog-admin-header">
              <h1 className="dash-page-title">{t('nav.posts')}</h1>
              <Link href="/forum/new" className="btn btn-primary btn-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
                {t('newTopic')}
              </Link>
            </div>

            <div className="blog-admin-table-wrap">
              {!dashData ? (
                <div className="dashboard-loading"><div className="dashboard-loading-spinner" /></div>
              ) : dashData.recentTopics.length === 0 ? (
                <div className="forum-empty-state">
                  <div className="forum-empty-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  </div>
                  <div className="forum-empty-title">{t('noPosts')}</div>
                  <div className="forum-empty-desc">{t('noPostsDesc')}</div>
                  <Link href="/forum/new" className="forum-empty-cta">{t('newTopic')}</Link>
                </div>
              ) : (
                <table className="blog-admin-table">
                  <thead>
                    <tr>
                      <th>{t('postCol.title')}</th>
                      <th>{t('postCol.replies')}</th>
                      <th>{t('postCol.date')}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashData.recentTopics.map(topic => (
                      <tr key={`${topic.categorySlug}/${topic.slug}`}>
                        <td>
                          <div className="blog-admin-post-title">{topic.title}</div>
                          <div className="blog-admin-post-slug">{topic.categorySlug}</div>
                        </td>
                        <td className="blog-admin-date">{topic.replyCount}</td>
                        <td className="blog-admin-date">{formatShortDate(topic.createdAt)}</td>
                        <td>
                          <Link href={`/forum/thread?c=${encodeURIComponent(topic.categorySlug)}&t=${encodeURIComponent(topic.slug)}`} className="btn btn-secondary btn-sm">
                            {t('postCol.view')}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── Profile Tab ── */}
        {tab === 'profile' && (
          <div className="dash-content">
            <h1 className="dash-page-title">{t('nav.profile')}</h1>

            {profileMsg && <div className={`form-banner form-banner--${profileMsg.type}`}>{profileMsg.text}</div>}

            <div className="dash-form-card">
              <div className="form-group">
                <label className="form-label">{t('fields.username')}</label>
                <input className="form-input" value={user.username} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">{t('fields.email')}</label>
                <input className="form-input" value={user.email} disabled />
              </div>
              <div className="auth-form-row">
                <div className="form-group">
                  <label className="form-label">{t('fields.firstName')}</label>
                  <input className="form-input" value={profileForm.firstName} onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('fields.lastName')}</label>
                  <input className="form-input" value={profileForm.lastName} onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })} />
                </div>
              </div>
              <div className="auth-form-row">
                <div className="form-group">
                  <label className="form-label">{t('fields.phone')}</label>
                  <input className="form-input" type="tel" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('fields.company')}</label>
                  <input className="form-input" value={profileForm.company} onChange={e => setProfileForm({ ...profileForm, company: e.target.value })} />
                </div>
              </div>
              <button type="button" className={`btn btn-primary${profileSaving ? ' btn-loading' : ''}`} disabled={profileSaving} onClick={handleProfileSave}>
                {t('saveProfile')}
              </button>
            </div>
          </div>
        )}

        {/* ── Security Tab ── */}
        {tab === 'security' && (
          <div className="dash-content">
            <h1 className="dash-page-title">{t('nav.security')}</h1>

            {pwMsg && <div className={`form-banner form-banner--${pwMsg.type}`}>{pwMsg.text}</div>}

            <div className="dash-form-card">
              <h2 className="dash-section-title">{t('security.changePassword')}</h2>
              <div className="form-group">
                <label className="form-label">{t('security.currentPassword')}</label>
                <input className="form-input" type="password" autoComplete="current-password" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
              </div>
              <div className="auth-form-row">
                <div className="form-group">
                  <label className="form-label">{t('security.newPassword')}</label>
                  <input className="form-input" type="password" autoComplete="new-password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('security.confirmPassword')}</label>
                  <input className="form-input" type="password" autoComplete="new-password" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
                </div>
              </div>
              <button type="button" className={`btn btn-primary${pwSaving ? ' btn-loading' : ''}`} disabled={pwSaving} onClick={handlePasswordChange}>
                {t('security.updatePassword')}
              </button>
            </div>

            <div className="dash-form-card" style={{ marginTop: 20 }}>
              <h2 className="dash-section-title">{t('security.sessionsTitle')}</h2>
              <p className="dash-section-desc">{t('security.sessionsDesc', { count: dashData?.activeSessions ?? 0 })}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
