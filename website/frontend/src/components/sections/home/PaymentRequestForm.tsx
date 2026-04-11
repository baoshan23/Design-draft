'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function PaymentRequestForm() {
  const t = useTranslations();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <div className="card glass-card" style={{ maxWidth: 620, margin: '40px auto 0', padding: 32, borderRadius: 'var(--radius-lg)' }}>
      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>
        {t('payment.request.title')}
      </h4>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 22 }}>
        {t('payment.request.desc')}
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('payment.request.method')}</label>
            <input
              type="text"
              className="form-input"
              placeholder={t('payment.request.methodPlaceholder')}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('payment.request.country')}</label>
            <input
              type="text"
              className="form-input"
              placeholder={t('payment.request.countryPlaceholder')}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t('payment.request.email')}</label>
          <input
            type="email"
            className="form-input"
            placeholder="email@example.com"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitted}>
          {submitted ? t('payment.request.submitted') : t('payment.request.submit')}
        </button>
      </form>
    </div>
  );
}
