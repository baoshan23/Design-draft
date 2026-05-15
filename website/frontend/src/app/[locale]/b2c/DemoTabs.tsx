'use client';

import { useTranslations } from 'next-intl';

type DemoTabsProps = {
  webAppQr: string;
  userPortalQr: string;
  webAppUrl: string;
  userPortalUrl: string;
  adminUrl: string;
  adminAccount: string;
  adminPassword: string;
};

export default function DemoTabs({
  webAppQr,
  userPortalQr,
  webAppUrl,
  userPortalUrl,
  adminUrl,
  adminAccount,
  adminPassword,
}: DemoTabsProps) {
  const t = useTranslations();

  return (
    <div className="b2c-demo-grid">
      {/* Top row */}
      <div className="b2c-demo-card">
        <div className="card-icon b2c-demo-card-icon--cpo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h4 className="b2c-demo-card-title">{t('demo.page.cpo.title')}</h4>
        <p className="b2c-demo-card-desc">{t('demo.page.cpo.desc')}</p>
        <a href={adminUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary b2c-demo-card-link">
          {t('demo.page.cpo.btn')}
        </a>
      </div>

      <div className="b2c-demo-card">
        <div className="card-icon b2c-demo-card-icon--cpo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h4 className="b2c-demo-card-title">{t('demo.page.h5.title')}</h4>
        <p className="b2c-demo-card-desc">{t('demo.page.h5.desc')}</p>
        <div className="b2c-demo-creds">
          <div className="b2c-demo-cred-row">
            <span className="b2c-demo-cred-key">{t('demo.page.username')}</span>
            <code>{adminAccount}</code>
          </div>
          <div className="b2c-demo-cred-row">
            <span className="b2c-demo-cred-key">{t('demo.page.password')}</span>
            <code>{adminPassword}</code>
          </div>
        </div>
      </div>

      {/* Bottom row: QR codes */}
      <div className="b2c-demo-card">
        <h4 className="b2c-demo-card-title">{t('demo.page.qrH5')}</h4>
        <a className="b2b-demo-qr-block" href={webAppUrl} target="_blank" rel="noopener noreferrer" aria-label={t('demo.page.qrMobile')}>
          <div className="b2b-demo-qr glass-card" dangerouslySetInnerHTML={{ __html: webAppQr }} />
        </a>
        <p className="b2c-demo-card-foot">{t('demo.page.qrMobile')}</p>
      </div>

      <div className="b2c-demo-card">
        <h4 className="b2c-demo-card-title">{t('demo.page.qrUser.title')}</h4>
        <a className="b2b-demo-qr-block" href={userPortalUrl} target="_blank" rel="noopener noreferrer" aria-label={t('demo.page.qrUser.title')}>
          <div className="b2b-demo-qr glass-card" dangerouslySetInnerHTML={{ __html: userPortalQr }} />
        </a>
        <p className="b2c-demo-card-foot">{t('demo.page.h5.desc')}</p>
      </div>

    </div>
  );
}
