'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import { apiRequestPasswordReset, apiResetPassword, isAuthApiEnabled } from '@/lib/api/authApi';

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [vcode, setVcode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);

  const handleSendCode = async () => {
    setError('');
    setDemoCode(null);

    const useApi = isAuthApiEnabled();
    if (!useApi) {
      setCodeSent(true);
      setTimeout(() => setCodeSent(false), 3000);
      return;
    }

    try {
      const res = await apiRequestPasswordReset(email);
      if (res.demoCode) setDemoCode(res.demoCode);
      setCodeSent(true);
      setTimeout(() => setCodeSent(false), 3000);
    } catch {
      setError(t('forgot.errors.sendFailed'));
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep(2);
    setVcode(verificationCode);
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError(t('forgot.errors.passwordMismatch'));
      return;
    }

    const useApi = isAuthApiEnabled();
    if (!useApi) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      return;
    }

    try {
      await apiResetPassword({ email, code: vcode, newPassword });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
      setTimeout(() => router.push('/login'), 650);
    } catch {
      setError(t('forgot.errors.resetFailed'));
    }
  };

  return (
    <div className="auth-page">

      {/* Visual Side */}
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div style={{ width: '100%', maxWidth: 400 }}>
            <ImagePlaceholder variant="security" aspectRatio="4/3" label={t('forgot.visual.title')} />
          </div>
          <h2 style={{ marginTop: 24 }}>{t('forgot.visual.title')}</h2>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side glass">
        <div className="auth-form-container">

          {/* Step 1: Email Verification */}
          {step === 1 && (
            <div>
              <h1>{t('forgot.title')}</h1>
              <p className="auth-subtitle">{t('forgot.desc')}</p>

              {error && (
                <div className="form-banner form-banner--error" style={{ marginBottom: 12 }}>
                  {error}
                </div>
              )}
              {demoCode && (
                <div className="form-banner" style={{ marginBottom: 12 }}>
                  {t('forgot.demoCode', { code: demoCode })}
                </div>
              )}

              <form onSubmit={handleVerify}>
                <div className="form-group">
                  <label className="form-label">
                    <span>{t('forgot.emailLabel')}</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder={t('forgot.email.placeholder')}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={t('forgot.code.placeholder')}
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ whiteSpace: 'nowrap', padding: '10px 16px' }}
                    onClick={handleSendCode}
                    disabled={codeSent}
                  >
                    {codeSent ? t('forgot.sent') : t('forgot.sendcode')}
                  </button>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: 8 }}
                >
                  {t('forgot.verify')}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Set New Password */}
          {step === 2 && (
            <div>
              <h1>{t('forgot.newpwTitle')}</h1>
              <p className="auth-subtitle">{t('forgot.newpwDesc')}</p>

              {error && (
                <div className="form-banner form-banner--error" style={{ marginBottom: 12 }}>
                  {error}
                </div>
              )}

              {submitted && (
                <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid #10B981', borderRadius: 8, marginBottom: 16, color: '#065F46', fontWeight: 600, fontSize: '0.9rem' }}>
                  {t('forgot.success')}
                </div>
              )}

              <form onSubmit={handleSetPassword}>
                <div className="form-group">
                  <label className="form-label">
                    <span>{t('forgot.newpwLabel')}</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder={t('forgot.newpw.placeholder')}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <span>{t('forgot.confirmpwLabel')}</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder={t('forgot.confirmpw.placeholder')}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <span>{t('forgot.vcodeLabel')}</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={t('forgot.vcode.placeholder')}
                    required
                    value={vcode}
                    onChange={(e) => setVcode(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: 8 }}
                >
                  {t('forgot.setpw')}
                </button>
              </form>
            </div>
          )}

          <div className="auth-link" style={{ marginTop: 24 }}>
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}>
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>{t('forgot.back')}</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
