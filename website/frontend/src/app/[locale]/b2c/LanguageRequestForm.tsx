'use client';

import { useTranslations } from 'next-intl';

export default function LanguageRequestForm() {
  const t = useTranslations();

  return (
    <div className="card" style={{ maxWidth: 600, margin: '32px auto 0', padding: 32 }}>
      <h4 style={{ marginBottom: 4 }}>{t('product.langreq.title')}</h4>
      <p style={{ fontSize: '0.9rem', marginBottom: 20 }}>{t('product.langreq.desc')}</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('product.langreq.name')}</label>
            <input type="text" className="form-input" placeholder="e.g. Hindi" />
          </div>
          <div className="form-group">
            <label className="form-label">{t('product.langreq.email')}</label>
            <input type="email" className="form-input" placeholder="email@example.com" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">{t('product.langreq.submit')}</button>
      </form>
    </div>
  );
}
