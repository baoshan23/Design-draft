'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useThemeContext } from '@/providers/ThemeProvider';

export default function SettingsPopover() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname() || '/';
  const router = useRouter();
  const { toggleTheme } = useThemeContext();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const switchLocale = (next: string) => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const nextPath = pathname.match(/^\/(en|zh)(?=\/|$)/)
      ? pathname.replace(/^\/(en|zh)(?=\/|$)/, `/${next}`)
      : `/${next}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
    router.replace(nextPath + hash);
    setOpen(false);
  };

  return (
    <div className="settings-wrapper" ref={wrapRef}>
      <button
        type="button"
        className="settings-trigger"
        aria-label={t('settings')}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
      {open && (
        <div className="settings-popover" role="menu">
          <div className="settings-popover-section">
            <div className="settings-popover-label">{t('settingsLang')}</div>
            <div className="settings-popover-lang">
              <button
                type="button"
                className={`lang-btn${locale === 'en' ? ' active' : ''}`}
                onClick={() => switchLocale('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={`lang-btn${locale === 'zh' ? ' active' : ''}`}
                onClick={() => switchLocale('zh')}
              >
                中文
              </button>
            </div>
          </div>
          <div className="settings-popover-divider" />
          <div className="settings-popover-section">
            <div className="settings-popover-label">{t('settingsTheme')}</div>
            <button
              type="button"
              className="settings-popover-theme"
              onClick={() => { toggleTheme(); setOpen(false); }}
              aria-label="Toggle dark mode"
            >
              <svg className="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
              <svg className="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
