'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
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

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tNav = useTranslations('nav');
  const router = useRouter();
  const { user, loading, logout, refresh } = useAuth();

  const [dashData, setDashData] = useState<UserDashboardData | null>(null);

  // Edit profile state
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '', company: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Change password state
  const [showPwChange, setShowPwChange] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // Fetch dashboard data
  useEffect(() => {
    const token = getAuthToken();
    if (!token || !user) return;
    let cancelled = false;
    apiUserDashboard(token)
      .then((res) => { if (!cancelled) setDashData(res.dashboard); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [user]);

  // Init profile form when user loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        company: user.company || '',
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleProfileSave = async () => {
    const token = getAuthToken();
    if (!token) return;
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await apiUpdateProfile(token, profileForm);
      await refresh();
      setEditing(false);
      setProfileMsg({ type: 'success', text: t('profileUpdated') });
      setTimeout(() => setProfileMsg(null), 3000);
    } catch (err) {
      setProfileMsg({ type: 'error', text: err instanceof Error ? err.message : t('profileError') });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: t('passwordMismatch') });
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwMsg({ type: 'error', text: t('passwordTooShort') });
      return;
    }
    const token = getAuthToken();
    if (!token) return;
    setPwSaving(true);
    setPwMsg(null);
    try {
      await apiChangePassword(token, {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPwChange(false);
      setPwMsg({ type: 'success', text: t('passwordChanged') });
      setTimeout(() => setPwMsg(null), 3000);
    } catch (err) {
      setPwMsg({ type: 'error', text: err instanceof Error ? err.message : t('passwordError') });
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-loading-spinner" />
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = `${(user.firstName || '').charAt(0)}${(user.lastName || '').charAt(0)}`.toUpperCase() || user.username.charAt(0).toUpperCase();

  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">

        {/* Profile Card */}
        <section className="dashboard-profile-card">
          <div className="dashboard-profile-top">
            <div className="dashboard-avatar-lg">{initials}</div>
            <div className="dashboard-profile-info">
              <h1 className="dashboard-profile-name">{user.firstName} {user.lastName}</h1>
              <p className="dashboard-profile-username">@{user.username}</p>
              <div className="dashboard-profile-badges">
                <span className="dashboard-badge dashboard-badge--role">
                  {user.role === 'admin' ? t('roleAdmin') : t('roleUser')}
                </span>
                {user.company && (
                  <span className="dashboard-badge dashboard-badge--company">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /></svg>
                    {user.company}
                  </span>
                )}
              </div>
            </div>
            <div className="dashboard-profile-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(!editing)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                {t('editProfile')}
              </button>
              {user.role === 'admin' && (
                <Link href="/admin" className="btn btn-secondary btn-sm">
                  {t('adminPanel')}
                </Link>
              )}
              <button type="button" className="btn btn-secondary btn-sm btn-danger-outline" onClick={handleLogout}>
                {tNav('logout')}
              </button>
            </div>
          </div>

          {/* Profile messages */}
          {profileMsg && (
            <div className={`form-banner form-banner--${profileMsg.type}`} style={{ marginTop: 16 }}>
              {profileMsg.text}
            </div>
          )}

          {/* Edit profile form */}
          {editing && (
            <div className="dashboard-edit-form">
              <div className="auth-form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-fn">{t('fields.firstName')}</label>
                  <input id="edit-fn" className="form-input" value={profileForm.firstName} onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-ln">{t('fields.lastName')}</label>
                  <input id="edit-ln" className="form-input" value={profileForm.lastName} onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })} />
                </div>
              </div>
              <div className="auth-form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-phone">{t('fields.phone')}</label>
                  <input id="edit-phone" className="form-input" type="tel" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-company">{t('fields.company')}</label>
                  <input id="edit-company" className="form-input" value={profileForm.company} onChange={e => setProfileForm({ ...profileForm, company: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className={`btn btn-primary btn-sm${profileSaving ? ' btn-loading' : ''}`} disabled={profileSaving} onClick={handleProfileSave}>
                  {t('saveProfile')}
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Stats Grid */}
        <section className="dashboard-stats-grid">
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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-label">{t('stats.forumActivity')}</div>
              <div className="dashboard-stat-value">
                {dashData ? `${dashData.forumTopics} ${t('stats.topics')}, ${dashData.forumPosts} ${t('stats.posts')}` : '—'}
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon dashboard-stat-icon--amber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-label">{t('stats.memberSince')}</div>
              <div className="dashboard-stat-value">{formatDate(user.createdAt)}</div>
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
        </section>

        {/* Change Password */}
        <section className="dashboard-profile-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="dashboard-section-title" style={{ margin: 0 }}>{t('security.title')}</h2>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowPwChange(!showPwChange)}>
              {t('security.changePassword')}
            </button>
          </div>

          {pwMsg && (
            <div className={`form-banner form-banner--${pwMsg.type}`} style={{ marginTop: 16 }}>
              {pwMsg.text}
            </div>
          )}

          {showPwChange && (
            <div className="dashboard-edit-form">
              <div className="form-group">
                <label className="form-label" htmlFor="pw-current">{t('security.currentPassword')}</label>
                <input id="pw-current" className="form-input" type="password" autoComplete="current-password" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
              </div>
              <div className="auth-form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="pw-new">{t('security.newPassword')}</label>
                  <input id="pw-new" className="form-input" type="password" autoComplete="new-password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="pw-confirm">{t('security.confirmPassword')}</label>
                  <input id="pw-confirm" className="form-input" type="password" autoComplete="new-password" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
                </div>
              </div>
              <button type="button" className={`btn btn-primary btn-sm${pwSaving ? ' btn-loading' : ''}`} disabled={pwSaving} onClick={handlePasswordChange}>
                {t('security.updatePassword')}
              </button>
            </div>
          )}
        </section>

        {/* Quick Links */}
        <section className="dashboard-quicklinks">
          <h2 className="dashboard-section-title">{t('quickLinks.title')}</h2>
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
        </section>

      </div>
    </div>
  );
}
