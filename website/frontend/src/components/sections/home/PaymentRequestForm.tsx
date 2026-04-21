'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function PaymentRequestForm() {
  const t = useTranslations();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const useApi = (process.env.NEXT_PUBLIC_FORMS_API || '').toLowerCase();
    if (useApi !== '1' && useApi !== 'true' && useApi !== 'yes') {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3500);
      (e.currentTarget as HTMLFormElement).reset();
      setSubmitting(false);
      return;
    }

    try {
      const form = e.currentTarget as HTMLFormElement;
      const fd = new FormData(form);
      const payload = {
        method: String(fd.get('method') || '').trim(),
        country: String(fd.get('country') || '').trim(),
        email: String(fd.get('email') || '').trim(),
      };

      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiBase}/requests/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3500);
      form.reset();
    } catch {
      setError(t('payment.request.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card glass-card payment-request-card">
      <h4 className="payment-request-title">{t('payment.request.title')}</h4>
      <p className="payment-request-desc">{t('payment.request.desc')}</p>

      {error && (
        <div className="payment-request-error">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('payment.request.method')}</label>
            <input
              type="text"
              name="method"
              className="form-input"
              placeholder={t('payment.request.methodPlaceholder')}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('payment.request.country')}</label>
            <input
              type="text"
              name="country"
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
            name="email"
            className="form-input"
            placeholder="email@example.com"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitted || submitting}>
          {submitted ? t('payment.request.submitted') : (submitting ? t('payment.request.submitting') : t('payment.request.submit'))}
        </button>
      </form>
    </div>
  );
}
