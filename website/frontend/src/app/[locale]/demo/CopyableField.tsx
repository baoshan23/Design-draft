'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CopyableField({ label, value }: { label: string; value: string }) {
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
    <div className="demo-cred-row">
      <span className="demo-cred-label">{label}</span>
      <code className="demo-cred-value">{value}</code>
      <button
        type="button"
        className="demo-cred-copy"
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
