import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Building2, User, Smartphone, Server as ServerIcon, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import Image from 'next/image';
import SubNav from './SubNav';
import ScrollResetOnLoad from '@/components/effects/ScrollResetOnLoad';
import B2BDemoCredCard from './B2BDemoCredCard';
import RevenueAccordion from './RevenueAccordion';

const DEMO_QR_URLS = {
  mobile: 'https://app.gcss.hk/',
  web: 'https://app.gcss.hk/admin',
};

async function generateQrSvg(data: string): Promise<string> {
  return QRCode.toString(data, {
    type: 'svg',
    margin: 1,
    width: 200,
    color: { dark: '#0F172A', light: '#FFFFFF00' },
    errorCorrectionLevel: 'M',
  });
}

export const metadata = {
  title: 'B2B Platform - GCSS | EV Charging SaaS Solution',
  description: 'Build your own EV charging SaaS platform with GCSS B2B solution. Multi-tenant, unlimited operators, automated billing, Super Admin control.',
};

// Demo-only credentials displayed on the page so visitors can try the sandbox.
// Not real secrets — do not add production credentials here.
const DEMO_CREDS = {
  admin: { account: 'admin', pass: '123456' },
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }}>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
    </svg>
  );
}

export default async function B2BPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const [mobileQr, webQr] = await Promise.all([
    generateQrSvg(DEMO_QR_URLS.mobile),
    generateQrSvg(DEMO_QR_URLS.web),
  ]);

  const rawList = (key: string): string[] => {
    const v = t.raw(key);
    return Array.isArray(v) ? (v as string[]) : [];
  };

  const modes = ['mode1', 'mode2', 'mode3', 'mode4'] as const;
  const feats = ['feat1', 'feat2', 'feat3'] as const;
  const aftersalesItems = ['item1', 'item2', 'item3', 'item4'] as const;
  const aftersalesIcons = [
    <svg key="vid" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>,
    <svg key="book" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>,
    <svg key="chat" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
    <svg key="target" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
  ];

  return (
    <>
      <ScrollResetOnLoad />
      <SubNav />

      {/* ==================== Section 1: Hero ==================== */}
      <section className="hero mesh-bg product-hero particles-bg" id="overview">
        <div className="container">
          <div className="hero-content hero-split">
            <div className="hero-text">
              <div className="hero-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                </svg>
                <span>{t('b2b.label')}</span>
              </div>
              <h1 className="hero-title">
                {t('b2b.hero.title')}<span className="hero-title-tag">(B2B2C)</span>
              </h1>
              <p className="hero-desc">{t('b2b.hero.desc')}</p>
              <div className="hero-buttons">
                <Link href="/contact" className="btn btn-primary btn-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                  </svg>
                  <span>{t('b2b.hero.cta1')}</span>
                </Link>
                <Link href="/contact" className="btn btn-secondary btn-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <span>{t('b2b.hero.cta2')}</span>
                </Link>
              </div>
            </div>

            <div className="hero-video-wrap hero-media-bare">
              <Image
                src="/images/b2b-hero-illustration.webp"
                alt={t('b2b.hero.title')}
                width={1200}
                height={675}
                priority
                sizes="(max-width: 960px) 100vw, 600px"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== Section 2: Architecture ==================== */}
      <section className="section" id="architecture">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('b2b.nav.overview')}</span>
              <h2>{t('b2b.overview.title')}</h2>
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <div className="b2b-flow" aria-label={t('b2b.overview.title')}>
              {/* ---- left tier: operators (flow inward) ---- */}
              <div className="b2b-flow-nodes b2b-flow-nodes--op">
                {['A', 'B', 'N'].map((letter, i) => (
                  <div key={letter} className="b2b-flow-node" style={{ ['--i' as string]: i }}>
                    <span className="b2b-flow-node-ic" aria-hidden="true">
                      <Building2 size={20} strokeWidth={2} />
                    </span>
                    <span className="b2b-flow-node-label">{t('b2b.overview.operator')} {letter}</span>
                  </div>
                ))}
              </div>

              {/* left rail: bezier connector — 3 operators fan into the tier pill, one line out to core */}
              <div className="b2b-flow-rail b2b-flow-rail--l">
                <svg className="b2b-flow-wire" viewBox="0 0 160 284" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="b2b-wire-l" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="160" y2="0">
                      <stop offset="0" stopColor="#E6A23C" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#E6A23C" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path className="connector-line" stroke="url(#b2b-wire-l)" d="M0 47 C34 47 68 95 68 142 M0 142 H68 M0 236 C34 236 68 189 68 142 M92 142 H160" />
                </svg>
                <span className="b2b-flow-tier" data-role="operator">{t('b2b.overview.operator')}</span>
              </div>

              {/* ---- center: platform core card ---- */}
              <div className="b2b-flow-core" aria-label={t('b2b.overview.platform')}>
                <div className="b2b-flow-core-badge" aria-label={t('b2b.overview.center')}>
                  <span><Smartphone size={14} strokeWidth={2.2} /> APP</span>
                  <span><ServerIcon size={14} strokeWidth={2.2} /> CPMS</span>
                  <span><ShieldCheck size={14} strokeWidth={2.2} /> ADMIN</span>
                </div>
                <div className="b2b-flow-core-title">{t('b2b.overview.platform')}</div>
                <div className="b2b-flow-core-pills">
                  {rawList('b2b.overview.platformItems').map((item, i) => (
                    <span key={i} className="b2b-flow-pill" style={{ ['--i' as string]: i }}>{item}</span>
                  ))}
                </div>
                <div className="b2b-flow-core-caption">{t('b2b.overview.model')}</div>
              </div>

              {/* right rail: bezier connector — core → tier pill, fans out to 3 users */}
              <div className="b2b-flow-rail b2b-flow-rail--r">
                <svg className="b2b-flow-wire" viewBox="0 0 160 284" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="b2b-wire-r" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="160" y2="0">
                      <stop offset="0" stopColor="#E6A23C" stopOpacity="1" />
                      <stop offset="1" stopColor="#E6A23C" stopOpacity="0.45" />
                    </linearGradient>
                  </defs>
                  <path className="connector-line" stroke="url(#b2b-wire-r)" d="M0 142 H68 M160 47 C126 47 92 95 92 142 M160 142 H92 M160 236 C126 236 92 189 92 142" />
                </svg>
                <span className="b2b-flow-tier" data-role="user">{t('b2b.overview.user')}</span>
              </div>

              {/* ---- right tier: users (flow outward) ---- */}
              <div className="b2b-flow-nodes b2b-flow-nodes--user">
                {['A', 'B', 'N'].map((letter, i) => (
                  <div key={letter} className="b2b-flow-node" style={{ ['--i' as string]: i }}>
                    <span className="b2b-flow-node-ic" aria-hidden="true">
                      <User size={20} strokeWidth={2} />
                    </span>
                    <span className="b2b-flow-node-label">{t('b2b.overview.user')} {letter}</span>
                  </div>
                ))}
              </div>

              {/* ---- tier capability chips (row 2 under each side) ---- */}
              <div className="b2b-flow-chips b2b-flow-chips--op">
                {rawList('b2b.overview.operatorItems').map((item, i) => (
                  <span key={i} className="b2b-flow-chip" style={{ ['--i' as string]: i }}>{item}</span>
                ))}
              </div>
              <div className="b2b-flow-chips b2b-flow-chips--user">
                {rawList('b2b.overview.userItems').map((item, i) => (
                  <span key={i} className="b2b-flow-chip" style={{ ['--i' as string]: i }}>{item}</span>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ==================== Section 3: Operation Modes ==================== */}
      <section className="section section-alt" id="modes">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('b2b.nav.modes')}</span>
              <h2>{t('b2b.modes.title')}</h2>
              <p>{t('b2b.modes.desc')}</p>
            </div>
          </ScrollAnimation>
          <div className="modes-bento-grid">
            {modes.map((mode, i) => (
              <ScrollAnimation key={mode} style={{ transitionDelay: `${i * 0.1}s` }}>
                <article className="mode-bento-card">
                  <div
                    className="mode-bento-visual"
                    style={{ backgroundImage: `url(/images/b2b-modes/mode-${i + 1}.png)` }}
                  />
                  <div className="mode-bento-body">
                    <h3>{t(`b2b.modes.${mode}.title`)}</h3>
                    <p>{t(`b2b.modes.${mode}.desc`)}</p>
                  </div>
                </article>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== Section 4: Revenue Sources ==================== */}
      <section className="section" id="revenue">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('b2b.nav.revenue')}</span>
              <h2>{t('b2b.revenue.title')}</h2>
              <p>{t('b2b.revenue.desc')}</p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <RevenueAccordion />
          </ScrollAnimation>
        </div>
      </section>

      {/* ==================== Section 5: Key Features ==================== */}
      <section className="section section-alt" id="features">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('b2b.nav.features')}</span>
              <h2>{t('b2b.features.title')}</h2>
            </div>
          </ScrollAnimation>
          <div className="b2b-hiw">
            <div className="b2b-hiw-grid">
              {feats.map((feat, i) => (
                <ScrollAnimation key={feat} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <article className={`b2b-hiw-card${i === 0 ? ' b2b-hiw-card--wide' : ''}`}>
                    <div className="b2b-hiw-content">
                      <span className="b2b-hiw-step">{t('b2b.features.step')} {i + 1}</span>
                      <h3>{t(`b2b.features.${feat}.title`)}</h3>
                      <p>{t(`b2b.features.${feat}.desc`)}</p>
                    </div>
                    {i === 0 ? (
                      <div className="b2b-hiw-visual" aria-hidden="true">
                        <span className="b2b-hiw-bignum">0{i + 1}</span>
                      </div>
                    ) : (
                      <span className="b2b-hiw-num" aria-hidden="true">{i + 1}</span>
                    )}
                  </article>
                </ScrollAnimation>
              ))}
            </div>
            <ScrollAnimation style={{ transitionDelay: `${feats.length * 0.1}s` }}>
              <div className="b2b-hiw-bar">
                <span className="b2b-hiw-bar-kicker">{t('b2b.advantages.paymentTitle')}</span>
                <div className="b2b-hiw-bar-steps" role="list">
                  {[t('b2b.advantages.payment1'), t('b2b.advantages.payment2'), t('b2b.advantages.payment3')].map((step, i, arr) => (
                    <div key={i} className="b2b-hiw-bar-step" role="listitem">
                      <span className="b2b-hiw-bar-num">{i + 1}</span>
                      <span className="b2b-hiw-bar-text">{step}</span>
                      {i < arr.length - 1 && <span className="b2b-hiw-bar-arrow" aria-hidden="true">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ==================== Section 8: Feature Support Matrix ==================== */}
      <section className="section" id="support">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('b2b.nav.support')}</span>
              <h2>{t('b2b.support.title')}</h2>
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <div className="support-matrix">
              {/* APP / H5 column */}
              <div className="support-col" data-accent="rose">
                <div className="support-col-header">
                  <div className="support-col-icon" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2.5" />
                      <line x1="12" y1="18" x2="12" y2="18" />
                    </svg>
                  </div>
                  <div className="support-col-title">{t('b2b.support.app')}</div>
                </div>
                <ul className="support-col-list">
                  {rawList('b2b.support.appFeatures').map((f, i) => (
                    <li key={i} style={{ ['--i' as string]: i }}>
                      <span className="support-row-dot" aria-hidden="true" />
                      <span className="support-row-text">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CPMS column */}
              <div className="support-col" data-accent="gold">
                <div className="support-col-header">
                  <div className="support-col-icon" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                      <rect x="9" y="9" width="6" height="6" />
                      <line x1="9" y1="1" x2="9" y2="4" />
                      <line x1="15" y1="1" x2="15" y2="4" />
                      <line x1="9" y1="20" x2="9" y2="23" />
                      <line x1="15" y1="20" x2="15" y2="23" />
                      <line x1="20" y1="9" x2="23" y2="9" />
                      <line x1="20" y1="14" x2="23" y2="14" />
                      <line x1="1" y1="9" x2="4" y2="9" />
                      <line x1="1" y1="14" x2="4" y2="14" />
                    </svg>
                  </div>
                  <div className="support-col-title">{t('b2b.support.cpms')}</div>
                </div>
                <ul className="support-col-list">
                  {rawList('b2b.support.cpmsFeatures').map((f, i) => (
                    <li key={i} style={{ ['--i' as string]: i }}>
                      <span className="support-row-dot" aria-hidden="true" />
                      <span className="support-row-text">{f}</span>
                    </li>
                  ))}
                  {rawList('b2b.support.cpmsFeatures2').map((f, i) => {
                    const idx = i + 8;
                    return (
                      <li key={`2-${i}`} style={{ ['--i' as string]: idx }}>
                        <span className="support-row-dot" aria-hidden="true" />
                        <span className="support-row-text">{f}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Platform Management column */}
              <div className="support-col" data-accent="emerald">
                <div className="support-col-header">
                  <div className="support-col-icon" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="support-col-title">{t('b2b.support.admin')}</div>
                </div>
                <ul className="support-col-list">
                  {rawList('b2b.support.adminFeatures').map((f, i) => (
                    <li key={i} style={{ ['--i' as string]: i }}>
                      <span className="support-row-dot" aria-hidden="true" />
                      <span className="support-row-text">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ==================== Section 10: After-Sales ==================== */}
      <section className="section" id="aftersales">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('b2b.nav.aftersales')}</span>
              <h2>{t('b2b.aftersales.title')}</h2>
              <p>{t('b2b.aftersales.desc')}</p>
            </div>
          </ScrollAnimation>
          <div className="grid-2">
            {aftersalesItems.map((item, i) => (
              <ScrollAnimation key={item} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="card glass-card" style={{ height: '100%' }}>
                  <div className="card-icon">{aftersalesIcons[i]}</div>
                  <h3>{t(`b2b.aftersales.${item}.title`)}</h3>
                  <p>{t(`b2b.aftersales.${item}.desc`)}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== Section 12: System Demo ==================== */}
      <section className="section section-alt b2b-demo-section" id="demo">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('b2b.nav.demo')}</span>
              <h2>{t('b2b.demo.title')}</h2>
            </div>
          </ScrollAnimation>
          <div className="b2b-demo-grid">
            <ScrollAnimation>
              <B2BDemoCredCard
                account={DEMO_CREDS.admin.account}
                password={DEMO_CREDS.admin.pass}
              />
            </ScrollAnimation>
            <ScrollAnimation style={{ transitionDelay: '0.15s' }}>
              <div className="b2b-demo-qr-card">
                <div className="b2b-demo-qrs">
                  <a
                    className="b2c-demo-qr"
                    href={DEMO_QR_URLS.mobile}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('b2b.demo.mobileDemo')}
                  >
                    <div className="b2c-qr" dangerouslySetInnerHTML={{ __html: mobileQr }} />
                    <span className="b2c-demo-qr-label">{t('b2b.demo.mobileDemo')}</span>
                  </a>
                  <a
                    className="b2c-demo-qr"
                    href={DEMO_QR_URLS.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('b2b.demo.webDemo')}
                  >
                    <div className="b2c-qr" dangerouslySetInnerHTML={{ __html: webQr }} />
                    <span className="b2c-demo-qr-label">{t('b2b.demo.webDemo')}</span>
                  </a>
                </div>
                <div className="b2b-demo-qr-cta">
                  <p>{t('b2b.demo.desc')}</p>
                  <a
                    href={DEMO_QR_URLS.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    {t('b2b.demo.launchOnline')}
                  </a>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ==================== Section 13: Pricing ==================== */}
      <section className="section" id="pricing">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('b2b.nav.pricing')}</span>
              <h2>{t('b2b.pricing.title')}</h2>
              <p>{t('b2b.pricing.desc')}</p>
            </div>
          </ScrollAnimation>
          <div className="pricing-cards pricing-cards--2col">
            <ScrollAnimation>
              <div className="pricing-card glass-card">
                <div className="plan-name">{t('b2b.pricing.standard.title')}</div>
                <div className="plan-price">
                  <span>{t('b2b.pricing.standard.price')}</span>
                </div>
                <div className="plan-price-note">&nbsp;</div>
                <div className="plan-actions">
                  <Link href="/contact" className="btn btn-primary btn-full">{t('b2b.pricing.cta')}</Link>
                </div>
                <ul className="plan-features">
                  {rawList('b2b.pricing.standard.features').map((f, i) => (
                    <li key={i}><span className="check">&#10003;</span><span>{f}</span></li>
                  ))}
                </ul>
              </div>
            </ScrollAnimation>
            <ScrollAnimation style={{ transitionDelay: '0.1s' }}>
              <div className="pricing-card glass-card featured">
                <div className="plan-name">{t('b2b.pricing.enhanced.title')}</div>
                <div className="plan-price">
                  <span>{t('b2b.pricing.enhanced.price')}</span>
                </div>
                <div className="plan-price-note">&nbsp;</div>
                <div className="plan-actions">
                  <Link href="/contact" className="btn btn-primary btn-full">{t('b2b.pricing.cta')}</Link>
                </div>
                <ul className="plan-features">
                  {rawList('b2b.pricing.enhanced.features').map((f, i) => (
                    <li key={i}><span className="check">&#10003;</span><span>{f}</span></li>
                  ))}
                </ul>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ==================== Section 14: Release History (end of page) ==================== */}
      <section className="section section-alt" id="releases">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('b2b.releases.label')}</span>
              <h2>{t('b2b.releases.title')}</h2>
              <p>{t('b2b.releases.desc')}</p>
            </div>
          </ScrollAnimation>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {(['v3_2', 'v3_1', 'v3_0', 'v2_5', 'v2_0'] as const).map((ver, i) => (
              <ScrollAnimation key={ver}>
                <div className="release-item" style={{ display: 'flex', gap: 20, marginBottom: 32, position: 'relative', paddingLeft: 32 }}>
                  <div style={{ position: 'absolute', left: 0, top: 6, width: 12, height: 12, borderRadius: '50%', background: i === 0 ? 'var(--primary)' : 'var(--border-medium)', boxShadow: i === 0 ? '0 0 12px rgba(230,168,23,0.4)' : 'none' }} />
                  {i < 4 && <div style={{ position: 'absolute', left: 5, top: 20, width: 2, height: 'calc(100% + 12px)', background: 'var(--border-subtle)' }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{t(`b2b.releases.${ver}.version`)}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{t(`b2b.releases.${ver}.date`)}</span>
                      {i === 0 && <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 100, background: 'var(--primary-dim)', color: 'var(--primary)', fontWeight: 600 }}>{t('b2b.releases.latest')}</span>}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{t(`b2b.releases.${ver}.summary`)}</p>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {([1, 2, 3] as const).map((n) => (
                        <li key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <CheckIcon />
                          <span>{t(`b2b.releases.${ver}.f${n}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
