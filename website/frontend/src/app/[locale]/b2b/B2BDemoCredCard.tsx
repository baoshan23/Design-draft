'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const ADMIN_DEMO_URL = 'https://app.gcss.hk/admin';

function CredRow({
  label,
  value,
  copyLabel,
  copiedLabel,
}: {
  label: string;
  value: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
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
        aria-label={copyLabel}
      >
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>{copiedLabel}</span>
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
            <span>{copyLabel}</span>
          </>
        )}
      </button>
    </div>
  );
}

export default function B2BDemoCredCard({
  account,
  password,
}: {
  account: string;
  password: string;
}) {
  const t = useTranslations();

  return (
    <div className="b2c-demo-card">
      <div className="b2c-demo-card-head">
        <div className="b2c-demo-card-icon">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="8" y1="20" x2="16" y2="20" />
          </svg>
        </div>
        <div>
          <h4 className="b2c-demo-card-title">{t('b2b.demo.admin.title')}</h4>
          <span className="b2c-demo-card-tag">{t('b2b.demo.admin.subtitle')}</span>
        </div>
      </div>
      <div className="b2c-demo-creds">
        <div className="b2c-demo-cred-header">{t('b2b.demo.demoAccount')}</div>
        <CredRow
          label={t('b2b.demo.account')}
          value={account}
          copyLabel={t('b2b.demo.copy')}
          copiedLabel={t('b2b.demo.copied')}
        />
        <CredRow
          label={t('b2b.demo.password')}
          value={password}
          copyLabel={t('b2b.demo.copy')}
          copiedLabel={t('b2b.demo.copied')}
        />
      </div>
      <div className="b2c-demo-card-actions">
        <a
          href={ADMIN_DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          {t('b2b.demo.launch')}
        </a>
      </div>
    </div>
  );
}
