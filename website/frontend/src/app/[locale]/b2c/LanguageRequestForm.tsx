'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function LanguageRequestForm() {
  const t = useTranslations();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const useApi = (process.env.NEXT_PUBLIC_FORMS_API || '').toLowerCase();
    if (useApi !== '1' && useApi !== 'true' && useApi !== 'yes') {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3500);
      e.currentTarget.reset();
      setSubmitting(false);
      return;
    }

    try {
      const form = e.currentTarget;
      const fd = new FormData(form);
      const payload = {
        name: String(fd.get('name') || '').trim(),
        email: String(fd.get('email') || '').trim(),
      };

      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiBase}/requests/language`, {
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
      setError(t('product.langreq.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card lang-request-card">
      <h4 className="lang-request-title">{t('product.langreq.title')}</h4>
      <p className="lang-request-desc">{t('product.langreq.desc')}</p>

      {error && (
        <div className="form-banner form-banner--error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('product.langreq.name')}</label>
            <input type="text" name="name" className="form-input" placeholder="e.g. Hindi" required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('product.langreq.email')}</label>
            <input type="email" name="email" className="form-input" placeholder="email@example.com" required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting || submitted}>
          {submitted ? t('product.langreq.submitted') : (submitting ? t('product.langreq.submitting') : t('product.langreq.submit'))}
        </button>
      </form>
    </div>
  );
}
