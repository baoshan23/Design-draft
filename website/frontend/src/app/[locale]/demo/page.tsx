import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import StickyEditionNav from './StickyEditionNav';
import CopyableField from './CopyableField';
import './demo-page.css';

export const metadata = {
  title: 'Live Demo - GCSS | Try B2C and B2B2C Editions',
  description: 'Experience both GCSS editions side by side. Try the B2C single-operator system and the B2B2C multi-tenant platform with admin, merchant, and mobile demo access.',
};

// Demo-only credentials displayed on the page so visitors can try the sandbox.
// Not real secrets — do not add production credentials here.
const DEMO_CREDS = {
  b2c: { account: 'test_merchant', pass: '123456' },
  b2bAdmin: { account: 'admin', pass: '123456' },
  b2bMerchant: { account: 'test_merchant', pass: '123456' },
};

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function QrFrame({ label }: { label: string }) {
  return (
    <div className="demo-qr">
      <div className="demo-qr-frame">
        <div className="demo-qr-corners">
          <span /><span /><span /><span />
        </div>
        <div className="demo-qr-placeholder">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
            {/* stylized QR placeholder */}
            {Array.from({ length: 9 }).map((_, r) =>
              Array.from({ length: 9 }).map((_, c) => {
                const on = (r * 3 + c * 5 + r * c) % 3 === 0;
                return on ? (
                  <rect
                    key={`${r}-${c}`}
                    x={r * 10 + 4}
                    y={c * 10 + 4}
                    width="8"
                    height="8"
                    rx="1.5"
                    fill="#FFD95A"
                    opacity={0.85}
                  />
                ) : null;
              })
            )}
            <rect x="4" y="4" width="22" height="22" rx="3" stroke="#FFD95A" strokeWidth="2" fill="none" />
            <rect x="70" y="4" width="22" height="22" rx="3" stroke="#FFD95A" strokeWidth="2" fill="none" />
            <rect x="4" y="70" width="22" height="22" rx="3" stroke="#FFD95A" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
      <span className="demo-qr-label">{label}</span>
    </div>
  );
}

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <StickyEditionNav />

      {/* ==================== Hero ==================== */}
      <section className="demo-hero" id="demo-hero">
        <div className="demo-hero-bg" aria-hidden="true">
          <div className="demo-hero-orb demo-hero-orb-1" />
          <div className="demo-hero-orb demo-hero-orb-2" />
          <div className="demo-hero-grid" />
        </div>
        <div className="container">
          <ScrollAnimation>
            <div className="demo-hero-content">
              <span className="demo-hero-eyebrow">
                <span className="demo-hero-dot" />
                {t('demo.page.liveNow')}
              </span>
              <h1 className="demo-hero-title">
                <span className="demo-hero-title-script">{t('demo.page.titleLead')}</span>
                <span className="demo-hero-title-main">{t('demo.page.titleMain')}</span>
              </h1>
              <p className="demo-hero-desc">{t('demo.page.desc')}</p>
              <div className="demo-hero-cta">
                <a href="#demo-b2c" className="btn btn-primary">
                  <span>{t('demo.page.jumpB2c')}</span>
                  <ArrowRight />
                </a>
                <a href="#demo-b2b" className="btn btn-secondary">
                  <span>{t('demo.page.jumpB2b')}</span>
                  <ArrowRight />
                </a>
              </div>
              <div className="demo-hero-stats">
                <div>
                  <span className="demo-hero-stat-num">2</span>
                  <span className="demo-hero-stat-label">{t('demo.page.stat1')}</span>
                </div>
                <div>
                  <span className="demo-hero-stat-num">&lt;60s</span>
                  <span className="demo-hero-stat-label">{t('demo.page.stat2')}</span>
                </div>
                <div>
                  <span className="demo-hero-stat-num">0$</span>
                  <span className="demo-hero-stat-label">{t('demo.page.stat3')}</span>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ==================== B2C Enterprise Demo ==================== */}
      <section className="section demo-section" id="demo-b2c">
        <div className="container">
          <ScrollAnimation>
            <div className="demo-section-head">
              <span className="demo-section-eyebrow">
                <span className="demo-section-dot" />
                {t('demo.page.editionOne')}
              </span>
              <h2 className="demo-section-title">{t('demo.page.b2cHeading')}</h2>
              <p className="demo-section-desc">{t('demo.page.b2cDesc')}</p>
            </div>
          </ScrollAnimation>

          <div className="demo-edition-grid">
            <ScrollAnimation>
              <div className="demo-edition-card glass-card">
                <div className="demo-edition-card-head">
                  <div className="demo-edition-card-icon demo-edition-card-icon-gold">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="12" rx="2" />
                      <line x1="8" y1="20" x2="16" y2="20" />
                      <line x1="12" y1="16" x2="12" y2="20" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="demo-edition-card-title">{t('demo.page.b2cCardTitle')}</h3>
                    <span className="demo-edition-card-tag">{t('demo.page.b2cCardTag')}</span>
                  </div>
                </div>
                <ul className="demo-edition-bullets">
                  <li>{t('demo.page.b2cBullet1')}</li>
                  <li>{t('demo.page.b2cBullet2')}</li>
                  <li>{t('demo.page.b2cBullet3')}</li>
                </ul>
                <div className="demo-cred-block">
                  <div className="demo-cred-header">{t('demo.page.credentials')}</div>
                  <CopyableField label={t('demo.page.account')} value={DEMO_CREDS.b2c.account} />
                  <CopyableField label={t('demo.page.password')} value={DEMO_CREDS.b2c.pass} />
                </div>
                <div className="demo-edition-actions">
                  <a href="https://demo-merchant.gcss.cloud" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <span>{t('demo.page.launchDemo')}</span>
                    <ArrowRight />
                  </a>
                  <Link href="/b2c" className="btn btn-outline">
                    {t('demo.page.viewB2cProduct')}
                  </Link>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation style={{ transitionDelay: '0.1s' }}>
              <div className="demo-edition-aside">
                <QrFrame label={t('demo.page.qrH5')} />
                <QrFrame label={t('demo.page.qrMobile')} />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ==================== B2B2C Platform Demo ==================== */}
      <section className="section section-alt demo-section" id="demo-b2b">
        <div className="container">
          <ScrollAnimation>
            <div className="demo-section-head">
              <span className="demo-section-eyebrow">
                <span className="demo-section-dot" />
                {t('demo.page.editionTwo')}
              </span>
              <h2 className="demo-section-title">{t('demo.page.b2bHeading')}</h2>
              <p className="demo-section-desc">{t('demo.page.b2bDesc')}</p>
            </div>
          </ScrollAnimation>

          <div className="demo-edition-grid">
            <ScrollAnimation>
              <div className="demo-edition-card glass-card">
                <div className="demo-edition-card-head">
                  <div className="demo-edition-card-icon demo-edition-card-icon-indigo">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="demo-edition-card-title">{t('b2b.demo.admin.title')}</h3>
                    <span className="demo-edition-card-tag">{t('b2b.demo.admin.subtitle')}</span>
                  </div>
                </div>
                <ul className="demo-edition-bullets">
                  <li>{t('demo.page.b2bAdminBullet1')}</li>
                  <li>{t('demo.page.b2bAdminBullet2')}</li>
                  <li>{t('demo.page.b2bAdminBullet3')}</li>
                </ul>
                <div className="demo-cred-block">
                  <div className="demo-cred-header">{t('demo.page.credentials')}</div>
                  <CopyableField label={t('demo.page.account')} value={DEMO_CREDS.b2bAdmin.account} />
                  <CopyableField label={t('demo.page.password')} value={DEMO_CREDS.b2bAdmin.pass} />
                </div>
                <div className="demo-edition-actions">
                  <button type="button" className="btn btn-primary">
                    <span>{t('demo.page.launchAdmin')}</span>
                    <ArrowRight />
                  </button>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation style={{ transitionDelay: '0.08s' }}>
              <div className="demo-edition-card glass-card">
                <div className="demo-edition-card-head">
                  <div className="demo-edition-card-icon demo-edition-card-icon-gold">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-6 9 6v11a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="demo-edition-card-title">{t('b2b.demo.merchant.title')}</h3>
                    <span className="demo-edition-card-tag">{t('b2b.demo.merchant.subtitle')}</span>
                  </div>
                </div>
                <ul className="demo-edition-bullets">
                  <li>{t('demo.page.b2bMerchantBullet1')}</li>
                  <li>{t('demo.page.b2bMerchantBullet2')}</li>
                  <li>{t('demo.page.b2bMerchantBullet3')}</li>
                </ul>
                <div className="demo-cred-block">
                  <div className="demo-cred-header">{t('demo.page.credentials')}</div>
                  <CopyableField label={t('demo.page.account')} value={DEMO_CREDS.b2bMerchant.account} />
                  <CopyableField label={t('demo.page.password')} value={DEMO_CREDS.b2bMerchant.pass} />
                </div>
                <div className="demo-edition-actions">
                  <button type="button" className="btn btn-primary">
                    <span>{t('demo.page.launchMerchant')}</span>
                    <ArrowRight />
                  </button>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          <ScrollAnimation style={{ transitionDelay: '0.15s' }}>
            <div className="demo-b2b-qr-row">
              <QrFrame label={t('b2b.demo.mobileDemo')} />
              <QrFrame label={t('b2b.demo.webDemo')} />
              <div className="demo-b2b-qr-link">
                <p>{t('demo.page.b2bQrDesc')}</p>
                <Link href="/b2b" className="btn btn-outline">
                  <span>{t('demo.page.viewB2bProduct')}</span>
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </>
  );
}
