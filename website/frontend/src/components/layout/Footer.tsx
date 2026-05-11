'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const SOCIALS = [
  {
    name: 'Facebook',
    brand: 'fb' as const,
    href: 'https://www.facebook.com/gcsstec',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    brand: 'ig' as const,
    href: 'https://www.instagram.com/gcss.hk/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    brand: 'li' as const,
    href: 'https://www.linkedin.com/company/gcsstec',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    brand: 'tt' as const,
    href: 'https://www.tiktok.com/@gcss801',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

const APPS = [
  {
    nameKey: 'googleplay' as const,
    href: 'https://play.google.com/store/apps/details?src=AppAgg.com&id=cc.evcity.v2.app',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#34A853" d="M3.6 2.5C3.2 2.8 3 3.3 3 4v16c0 .7.2 1.2.6 1.5l9-9-9-10z" />
        <path fill="#FBBC04" d="m17.4 12-3-3 .9-.5 4 2.3c.7.4.7 1.4 0 1.8l-4 2.3-.9-.6 3-2.3z" />
        <path fill="#EA4335" d="m12.6 12-9 9c.4.3 1 .3 1.7-.1l11.1-6.3-3.8-2.6z" />
        <path fill="#4285F4" d="M5.3 3.1C4.6 2.7 4 2.7 3.6 3l9 9 3.8-2.6L5.3 3.1z" />
      </svg>
    ),
  },
  {
    nameKey: 'appstore' as const,
    href: 'https://apps.apple.com/us/app/global-charge/id6695728171',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    ),
  },
  {
    nameKey: 'webapp' as const,
    href: 'https://app.gcss.hk/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const t = useTranslations('footer');

  const scrollTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-rule" aria-hidden="true" />

      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <Image
                src="/assets/logo.png"
                alt="GCSS"
                width={60}
                height={60}
                style={{ borderRadius: '6px' }}
              />
              G<span>CSS</span>
            </Link>
            <p className="footer-tagline">{t('tagline')}</p>

            <div className="footer-social-block">
              <span className="footer-social-label">{t('followus')}</span>
              <div className="footer-social">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className={`footer-social-link footer-social-${s.brand}`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-apps-block">
              <span className="footer-social-label">{t('getapp')}</span>
              <div className="footer-apps">
                {APPS.map((app) => (
                  <a
                    key={app.nameKey}
                    href={app.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-app-badge"
                  >
                    {app.icon}
                    <span>{t(app.nameKey)}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h4>{t('product')}</h4>
            <Link href="/b2c">{t('features')}</Link>
            <Link href="/pricing">{t('pricing')}</Link>
            <Link href="/buy">{t('buynow')}</Link>
            <Link href="/demo">{t('livedemo')}</Link>
            <Link href="/docs">{t('documentation')}</Link>
          </div>

          <div className="footer-col">
            <h4>{t('community')}</h4>
            <Link href="/forum">{t('forum')}</Link>
            <Link href="/faq">{t('helpcenter')}</Link>
            <Link href="/contact">{t('contactsales')}</Link>
            <a href="https://wa.me/85298013154" target="_blank" rel="noopener noreferrer">{t('whatsapp')}</a>
          </div>

          <div className="footer-col">
            <h4>{t('company')}</h4>
            <Link href="/about">{t('about')}</Link>
            <Link href="/careers">{t('careers')}</Link>
            <Link href="/partners">{t('partners')}</Link>
            <Link href="/blog">{t('blog')}</Link>
          </div>

          <div className="footer-col">
            <h4>{t('account')}</h4>
            <Link href="/login">{t('login')}</Link>
            <Link href="/register">{t('signup')}</Link>
            <Link href="/dashboard">{t('dashboard')}</Link>
            <Link href="/invoices">{t('invoices')}</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('copyright')}</p>
          <div className="footer-bottom-links">
            <Link href="/privacy">{t('privacy')}</Link>
            <Link href="/terms">{t('terms')}</Link>
            <button type="button" className="footer-back-top" onClick={scrollTop} aria-label={t('backtotop')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              <span>{t('backtotop')}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
