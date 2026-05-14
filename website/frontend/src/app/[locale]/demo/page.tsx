import { getTranslations, setRequestLocale } from 'next-intl/server';
import QRCode from 'qrcode';
import { Link } from '@/i18n/navigation';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import DemoTabs from '../b2c/DemoTabs';
import StickyEditionNav from './StickyEditionNav';
import CopyableField from './CopyableField';
import './demo-page.css';

// Demo entry points used to generate QR codes. Update when real mobile-app
// download URL is available; until then both point at the web app.
const QR_TARGETS = {
  webApp: 'https://app.gcss.hk/',
  mobileApp: 'https://app.gcss.hk/',
};

const QR_OPTS = {
  type: 'svg' as const,
  margin: 1,
  width: 144,
  color: { dark: '#1a1210', light: '#00000000' },
  errorCorrectionLevel: 'M' as const,
};

const CPO_PANEL_URL = 'https://www.v3g.gcss.hk/admin/';
const CPO_PANEL_CREDS = {
  account: 'root',
  password: 'gcss123456',
} as const;

const B2B_DEMO_QR_URLS = {
  mobile: 'https://app.gcss.hk/',
  web: 'https://www.v3g.gcss.hk/user/',
};

const B2B_DEMO_CREDS = {
  account: 'admin',
  pass: '123456',
} as const;

export const metadata = {
  title: 'Live Demo - GCSS | Try Every Plan Edition',
  description: 'Hands-on sandbox for every GCSS plan tier. SaaS, Custom Web, APP Enterprise, Web APP Platform, APP Platform — try the real B2B2C admin or request a tour for your tier.',
};

// Real demo wired up. Other tiers route to /contact for a guided demo.
const ADMIN_DEMO_URL = 'https://admin.demo.gcss.hk/';
const ADMIN_DEMO_CREDS = { account: 'demo', pass: '123456' };

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

async function QrFrame({ label, value }: { label: string; value: string }) {
  const svg = await QRCode.toString(value, {
    type: 'svg',
    margin: 1,
    width: 144,
    color: { dark: '#1a1210', light: '#00000000' },
    errorCorrectionLevel: 'M',
  });
  return (
    <div className="demo-qr">
      <div className="demo-qr-frame">
        <div className="demo-qr-corners">
          <span /><span /><span /><span />
        </div>
        <div className="demo-qr-code" dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <span className="demo-qr-label">{label}</span>
      <a href={value} target="_blank" rel="noopener noreferrer" className="demo-qr-link">{value.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>
    </div>
  );
}

// Tiny per-plan icon. One SVG each, line style for visual cohesion.
function PlanIcon({ plan }: { plan: 'saas' | 'customweb' | 'appent' | 'webplat' | 'appplat' }) {
  const stroke = { stroke: 'currentColor', strokeWidth: 2 } as const;
  switch (plan) {
    case 'saas':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...stroke}>
          <path d="M4 17a4 4 0 0 1 1-7.9 6 6 0 0 1 11.7-1A4.5 4.5 0 0 1 19 17H5z" />
        </svg>
      );
    case 'customweb':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...stroke}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="8" y1="20" x2="16" y2="20" />
        </svg>
      );
    case 'appent':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...stroke}>
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      );
    case 'webplat':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...stroke}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        </svg>
      );
    case 'appplat':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...stroke}>
          <path d="M3 9l9-6 9 6v11a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z" />
        </svg>
      );
  }
}

type PlanKey = 'saas' | 'customweb' | 'appent' | 'webplat' | 'appplat';

type PlanCardProps = {
  planKey: PlanKey;
  hasLiveDemo: boolean;
  iconColor: 'gold' | 'indigo';
};

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [webAppQr, userPortalQr, b2bMobileQr, b2bWebQr] = await Promise.all([
    QRCode.toString(QR_TARGETS.webApp, QR_OPTS),
    QRCode.toString('https://www.v3g.gcss.hk/user/', QR_OPTS),
    QRCode.toString(B2B_DEMO_QR_URLS.mobile, {
      type: 'svg',
      margin: 1,
      width: 200,
      color: { dark: '#0F172A', light: '#FFFFFF00' },
      errorCorrectionLevel: 'M',
    }),
    QRCode.toString(B2B_DEMO_QR_URLS.web, {
      type: 'svg',
      margin: 1,
      width: 200,
      color: { dark: '#0F172A', light: '#FFFFFF00' },
      errorCorrectionLevel: 'M',
    }),
  ]);

  // Localized labels are server-side rendered. Each plan card uses
  // pricing.<plan>.name as title and demo.page.plans.<plan>.* for tag/bullets.
  const PlanCard = ({ planKey, hasLiveDemo, iconColor }: PlanCardProps) => (
    <div className="demo-edition-card glass-card">
      <div className="demo-edition-card-head">
        <div className={`demo-edition-card-icon demo-edition-card-icon-${iconColor}`}>
          <PlanIcon plan={planKey} />
        </div>
        <div>
          <h3 className="demo-edition-card-title">{t(`pricing.${planKey}.name` as never)}</h3>
          <span className="demo-edition-card-tag">{t(`demo.page.plans.${planKey}.tag` as never)}</span>
        </div>
      </div>
      <ul className="demo-edition-bullets">
        <li>{t(`demo.page.plans.${planKey}.b1` as never)}</li>
        <li>{t(`demo.page.plans.${planKey}.b2` as never)}</li>
        <li>{t(`demo.page.plans.${planKey}.b3` as never)}</li>
      </ul>
      {hasLiveDemo && (
        <div className="demo-cred-block">
          <div className="demo-cred-header">{t('demo.page.credentials')}</div>
          <CopyableField label={t('demo.page.account')} value={ADMIN_DEMO_CREDS.account} />
          <CopyableField label={t('demo.page.password')} value={ADMIN_DEMO_CREDS.pass} />
        </div>
      )}
      <div className="demo-edition-actions">
        {hasLiveDemo ? (
          <a href={ADMIN_DEMO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <span>{t('demo.page.launchDemo')}</span>
            <ArrowRight />
          </a>
        ) : (
          <Link href="/contact" className="btn btn-primary">
            <span>{t('demo.page.requestDemo')}</span>
            <ArrowRight />
          </Link>
        )}
        <Link href="/pricing" className="btn btn-outline">
          <span>{t('demo.page.viewPlanPricing')}</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <StickyEditionNav />

      {/* Hero */}
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
                  <span className="demo-hero-stat-num">5</span>
                  <span className="demo-hero-stat-label">{t('demo.page.stat1')}</span>
                </div>
                <div>
                  <span className="demo-hero-stat-num">&lt;60s</span>
                  <span className="demo-hero-stat-label">{t('demo.page.stat2')}</span>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Single-operator editions: SaaS / Custom Web / APP Enterprise */}
      <section className="section demo-section" id="demo-b2c">
        <div className="container">
          <ScrollAnimation>
            <div className="demo-section-head">
              <span className="demo-section-eyebrow">
                <span className="demo-section-dot" />
                {t('demo.page.editionOne')}
              </span>
              <h2 className="demo-section-title">{t('demo.page.edB2cHeading')}</h2>
              <p className="demo-section-desc">{t('demo.page.edB2cDesc')}</p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation>
            <div className="b2c-demo-stage">
              <DemoTabs
                webAppQr={webAppQr}
                userPortalQr={userPortalQr}
                adminUrl={CPO_PANEL_URL}
                adminAccount={CPO_PANEL_CREDS.account}
                adminPassword={CPO_PANEL_CREDS.password}
              />

              <div className="b2c-demo-status-bar">
                <div className="b2c-demo-pill" data-tone="success">
                  <span className="b2c-demo-pill-dot" aria-hidden="true"></span>
                  <span className="b2c-demo-pill-key">{t('product.demo.status.label')}</span>
                  <span className="b2c-demo-pill-val">{t('product.demo.status.online')}</span>
                </div>
                <div className="b2c-demo-pill" data-tone="gold">
                  <svg className="b2c-demo-pill-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="7" cy="7" r="5.5" /><path d="M7 4v3l2 1" /></svg>
                  <span className="b2c-demo-pill-key">{t('product.demo.latency')}</span>
                  <span className="b2c-demo-pill-val">24ms</span>
                </div>
                <div className="b2c-demo-pill" data-tone="teal">
                  <svg className="b2c-demo-pill-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 1v2M7 11v2M1 7h2M11 7h2" /><circle cx="7" cy="7" r="3" /></svg>
                  <span className="b2c-demo-pill-key">{t('product.demo.connection.label')}</span>
                  <span className="b2c-demo-pill-val">{t('product.demo.connection.secure')}</span>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Multi-tenant platform editions: Web APP Platform / APP Platform */}
      <section className="section section-alt demo-section" id="demo-b2b">
        <div className="container">
          <ScrollAnimation>
            <div className="demo-section-head">
              <span className="demo-section-eyebrow">
                <span className="demo-section-dot" />
                {t('demo.page.editionTwo')}
              </span>
              <h2 className="demo-section-title">{t('demo.page.edB2bHeading')}</h2>
              <p className="demo-section-desc">{t('demo.page.edB2bDesc')}</p>
            </div>
          </ScrollAnimation>

          <div className="b2b-demo-grid">
            <ScrollAnimation>
              <div className="b2b-demo-cards">
                <div className="b2b-demo-card glass-card" data-accent="blue">
                  <div className="b2b-demo-card-head">
                    <h3>{t('b2b.demo.admin.title')}</h3>
                    <span className="b2b-demo-card-sub">{t('b2b.demo.admin.subtitle')}</span>
                  </div>
                  <div className="b2b-demo-card-creds-label">{t('b2b.demo.demoAccount')}</div>
                  <div className="b2b-demo-field"><span>{t('b2b.demo.account')}:</span><code>{B2B_DEMO_CREDS.account}</code></div>
                  <div className="b2b-demo-field"><span>{t('b2b.demo.password')}:</span><code>{B2B_DEMO_CREDS.pass}</code></div>
                  <button type="button" className="btn btn-secondary b2b-demo-launch">{t('b2b.demo.launch')}</button>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation style={{ transitionDelay: '0.15s' }}>
              <div className="b2b-demo-qrs">
                <a className="b2b-demo-qr-block" href={B2B_DEMO_QR_URLS.mobile} target="_blank" rel="noopener noreferrer">
                  <div className="b2b-demo-qr glass-card" aria-label={t('b2b.demo.mobileDemo')} dangerouslySetInnerHTML={{ __html: b2bMobileQr }} />
                  <div className="b2b-demo-qr-label">{t('b2b.demo.mobileDemo')}</div>
                </a>
                <a className="b2b-demo-qr-block" href={B2B_DEMO_QR_URLS.web} target="_blank" rel="noopener noreferrer">
                  <div className="b2b-demo-qr glass-card" aria-label={t('b2b.demo.webDemo')} dangerouslySetInnerHTML={{ __html: b2bWebQr }} />
                  <div className="b2b-demo-qr-label">{t('b2b.demo.webDemo')}</div>
                </a>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </>
  );
}
