'use client';

import { useTranslations } from 'next-intl';

const ADMIN_DEMO_URL = 'https://admin.demo.gcss.hk/';
const APP_URL = 'https://app.gcss.hk/';
const DEMO_USER = 'demo';
const DEMO_PASS = '123456';

export default function DemoTabs({ webAppQr, mobileAppQr }: { webAppQr: string; mobileAppQr: string }) {
  const t = useTranslations();

  return (
    <div className="b2c-demo-grid">
      {/* Top row */}
      <div className="b2c-demo-card">
        <div className="card-icon" style={{ margin: '0 auto 16px', background: '#FEF3C7', color: '#D4890A' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="8" y1="20" x2="16" y2="20" />
          </svg>
        </div>
        <h4 className="b2c-demo-card-title">{t('product.demo.cpo.title')}</h4>
        <p className="b2c-demo-card-desc">{t('product.demo.cpo.desc')}</p>
        <a href={ADMIN_DEMO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm" style={{ marginTop: 16 }}>
          {t('product.demo.cpo.btn')}
        </a>
      </div>

      <div className="b2c-demo-card">
        <div className="card-icon" style={{ margin: '0 auto 16px', background: '#E0E7FF', color: '#4338CA' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h4 className="b2c-demo-card-title">{t('product.demo.h5.title')}</h4>
        <div className="b2c-demo-creds">
          <div className="b2c-demo-cred-row">
            <span className="b2c-demo-cred-key">{t('product.demo.cred.username')}</span>
            <code>{DEMO_USER}</code>
          </div>
          <div className="b2c-demo-cred-row">
            <span className="b2c-demo-cred-key">{t('product.demo.cred.password')}</span>
            <code>{DEMO_PASS}</code>
          </div>
        </div>
      </div>

      {/* Bottom row: QR codes */}
      <div className="b2c-demo-card">
        <h4 className="b2c-demo-card-title">{t('product.demo.qrH5.title')}</h4>
        <div className="b2c-qr" dangerouslySetInnerHTML={{ __html: webAppQr }} />
        <p className="b2c-demo-card-foot">{t('product.demo.qrH5.desc')}</p>
      </div>

      <div className="b2c-demo-card">
        <h4 className="b2c-demo-card-title">{t('product.demo.qrApp.title')}</h4>
        <div className="b2c-qr" dangerouslySetInnerHTML={{ __html: mobileAppQr }} />
        <p className="b2c-demo-card-foot">{t('product.demo.qrApp.desc')}</p>
      </div>
    </div>
  );
}
