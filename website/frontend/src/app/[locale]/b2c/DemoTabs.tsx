'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const ADMIN_DEMO_URL = 'https://admin.demo.gcss.hk/';
const APP_URL = 'https://app.gcss.hk/';
const ADMIN_HOST = 'admin.demo.gcss.hk';
const APP_HOST = 'app.gcss.hk';
const DEMO_USER = 'demo';
const DEMO_PASS = '123456';

function CredRow({ label, value }: { label: string; value: string }) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop — clipboard unavailable */
    }
  };

  return (
    <div className="b2c-demo-cred-row">
      <span className="b2c-demo-cred-key">{label}</span>
      <code className="b2c-demo-cred-value">{value}</code>
      <button
        type="button"
        className="b2c-demo-cred-copy"
        onClick={onCopy}
        aria-label={t('demo.page.copy')}
      >
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>{t('demo.page.copied')}</span>
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
            <span>{t('demo.page.copy')}</span>
          </>
        )}
      </button>
    </div>
  );
}

export default function DemoTabs({ webAppQr, mobileAppQr }: { webAppQr: string; mobileAppQr: string }) {
  const t = useTranslations();

  return (
    <>
      <div className="b2c-demo-grid">
        {/* CPO console */}
        <div className="b2c-demo-card">
          <div className="b2c-demo-card-head">
            <div className="b2c-demo-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="8" y1="20" x2="16" y2="20" />
              </svg>
            </div>
            <div>
              <h4 className="b2c-demo-card-title">{t('product.demo.cpo.title')}</h4>
              <span className="b2c-demo-card-tag">{ADMIN_HOST}</span>
            </div>
          </div>
          <p className="b2c-demo-card-desc">{t('product.demo.cpo.desc')}</p>
          <div className="b2c-demo-card-actions">
            <a href={ADMIN_DEMO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <span>{t('product.demo.cpo.btn')}</span>
            </a>
          </div>
        </div>

        {/* Demo account */}
        <div className="b2c-demo-card">
          <div className="b2c-demo-card-head">
            <div className="b2c-demo-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="9" r="4" />
                <path d="M2 21a7 7 0 0 1 14 0" />
                <path d="M16 8l5-5M19 5l2 2M21 3l-1.5 1.5" />
              </svg>
            </div>
            <div>
              <h4 className="b2c-demo-card-title">{t('product.demo.h5.title')}</h4>
              <span className="b2c-demo-card-tag">{APP_HOST}</span>
            </div>
          </div>
          <div className="b2c-demo-creds">
            <div className="b2c-demo-cred-header">{t('demo.page.credentials')}</div>
            <CredRow label={t('product.demo.cred.username')} value={DEMO_USER} />
            <CredRow label={t('product.demo.cred.password')} value={DEMO_PASS} />
          </div>
        </div>
      </div>

      {/* Bottom QR card */}
      <div className="b2c-demo-qr-row">
        <div className="b2c-demo-qr">
          <div className="b2c-qr" dangerouslySetInnerHTML={{ __html: webAppQr }} />
          <span className="b2c-demo-qr-label">{t('product.demo.qrH5.title')}</span>
        </div>
        <div className="b2c-demo-qr">
          <div className="b2c-qr" dangerouslySetInnerHTML={{ __html: mobileAppQr }} />
          <span className="b2c-demo-qr-label">{t('product.demo.qrApp.title')}</span>
        </div>
        <div className="b2c-demo-qr-link">
          <p>{t('product.demo.desc')}</p>
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <span>{t('demo.page.launchDemo')}</span>
          </a>
        </div>
      </div>
    </>
  );
}
