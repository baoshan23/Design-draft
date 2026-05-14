'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

export default function PaymentRequestForm() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) triggerRef.current?.focus();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const useApi = (process.env.NEXT_PUBLIC_FORMS_API || '').toLowerCase();
    if (useApi !== '1' && useApi !== 'true' && useApi !== 'yes') {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setOpen(false);
      }, 1800);
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
      setTimeout(() => {
        setSubmitted(false);
        setOpen(false);
      }, 1800);
      form.reset();
    } catch {
      setError(t('payment.request.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const modal = open && typeof document !== 'undefined' ? createPortal(
    <div
      className="payment-request-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-request-modal-title"
    >
      <div className="payment-request-modal">
        <button
          ref={closeRef}
          type="button"
          className="payment-request-modal-close"
          onClick={() => setOpen(false)}
          aria-label={t('payment.request.close')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h4 id="payment-request-modal-title" className="payment-request-title">{t('payment.request.title')}</h4>
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
                autoFocus
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
    </div>,
    document.body,
  ) : null;

  return (
    <>
      <div className="payment-request-cta">
        <button
          ref={triggerRef}
          type="button"
          className="btn btn-primary btn-lg payment-request-cta-btn"
          onClick={() => setOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>{t('payment.request.openCta')}</span>
        </button>
      </div>
      {modal}
    </>
  );
}
