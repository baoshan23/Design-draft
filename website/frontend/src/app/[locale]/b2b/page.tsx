import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Building2, User } from 'lucide-react';
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

  // Two-tone line icons: base strokes = black (currentColor), accent element = gold (.mode-ic-accent).
  const modeIcons = [
    <svg key="net" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="2" width="6" height="6" rx="1" /><path d="M12 8v4M5 16v-3a1 1 0 011-1h12a1 1 0 011 1v3" /><rect className="mode-ic-accent" x="2" y="16" width="6" height="6" rx="1" /><rect className="mode-ic-accent" x="16" y="16" width="6" height="6" rx="1" /></svg>,
    <svg key="bld" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="3" width="14" height="18" rx="1" /><path className="mode-ic-accent" d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1" /></svg>,
    <svg key="link" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path className="mode-ic-accent" d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>,
    <svg key="ref" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56" /><polyline className="mode-ic-accent" points="21 3 21 9 15 9" /></svg>,
  ];

  const modes = ['mode1', 'mode2', 'mode3', 'mode4'] as const;
  const feats = ['feat1', 'feat2', 'feat3'] as const;
  // After-sales support — orbital diagram. Each item maps to a card + a node
  // on the rings. pos drives absolute placement (tl/tr/bl/br).
  // Option A: uniform gradient-circle ring nodes, each with its own line glyph.
  const supportCards: { key: string; pos: string }[] = [
    { key: 'item1', pos: 'tl' }, // 视频部署指南
    { key: 'item3', pos: 'tr' }, // 官方社区论坛
    { key: 'item2', pos: 'bl' }, // 全方位知识库
    { key: 'item4', pos: 'br' }, // 专业技术团队
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
            <div className="b2b-hub" aria-label={t('b2b.overview.title')}>
              {/* connector lines (behind cards) — core → platform / operators / users */}
              <svg className="b2b-hub-links" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
                <path className="b2b-hub-link" d="M50 32 V17" />
                <path className="b2b-hub-link" d="M41 40 H26" />
                <path className="b2b-hub-link" d="M59 40 H74" />
              </svg>

              {/* ---- top: platform side ---- */}
              <article className="b2b-hub-card b2b-hub-platform">
                <span className="b2b-hub-card-title">{t('b2b.overview.platform')}</span>
                <div className="b2b-hub-tags b2b-hub-tags--grid">
                  {rawList('b2b.overview.platformItems').map((item, i) => (
                    <span key={i} className="b2b-hub-tag">{item}</span>
                  ))}
                </div>
              </article>

              {/* ---- left: operators ---- */}
              <article className="b2b-hub-card b2b-hub-operators">
                <span className="b2b-hub-card-title">{t('b2b.overview.operator')}</span>
                <div className="b2b-hub-avatars">
                  {['A', 'B', 'C'].map((letter) => (
                    <div key={letter} className="b2b-hub-avatar">
                      <span className="b2b-hub-avatar-ic" aria-hidden="true">
                        <Building2 size={18} strokeWidth={2} />
                      </span>
                      <span className="b2b-hub-avatar-label">{t('b2b.overview.operator')} {letter}</span>
                    </div>
                  ))}
                </div>
                <div className="b2b-hub-tags b2b-hub-tags--grid">
                  {rawList('b2b.overview.operatorItems').map((item, i) => (
                    <span key={i} className="b2b-hub-tag">{item}</span>
                  ))}
                </div>
              </article>

              {/* ---- center: core system ---- */}
              <div className="b2b-hub-core" aria-label={t('b2b.overview.center')}>
                <span className="b2b-hub-core-eyebrow">{t('b2b.overview.coreLabel')}</span>
                <span className="b2b-hub-core-title">{t('b2b.overview.center')}</span>
                <span className="b2b-hub-core-pill">{t('b2b.overview.model')}</span>
              </div>

              {/* ---- right: users ---- */}
              <article className="b2b-hub-card b2b-hub-users">
                <span className="b2b-hub-card-title">{t('b2b.overview.user')}</span>
                <div className="b2b-hub-avatars">
                  {['A', 'B', 'C'].map((letter) => (
                    <div key={letter} className="b2b-hub-avatar">
                      <span className="b2b-hub-avatar-ic" aria-hidden="true">
                        <User size={18} strokeWidth={2} />
                      </span>
                      <span className="b2b-hub-avatar-label">{t('b2b.overview.user')} {letter}</span>
                    </div>
                  ))}
                </div>
                <div className="b2b-hub-tags b2b-hub-tags--grid">
                  {rawList('b2b.overview.userItems').map((item, i) => (
                    <span key={i} className="b2b-hub-tag">{item}</span>
                  ))}
                </div>
              </article>
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
                <article
                  className="mode-bento-card"
                  style={{ backgroundImage: `url(/images/b2b-modes/mode-${i + 1}.png)` }}
                >
                  <div className="mode-bento-icon">{modeIcons[i]}</div>
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
          <div className="b2b-revenue-panel">
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
              {feats.map((feat, i) => {
                const top = i === 0;
                return (
                <ScrollAnimation key={feat} style={{ transitionDelay: `${i * 0.1}s`, ...(top ? { gridColumn: '1 / -1' } : {}) }}>
                  <article className={`b2b-hiw-card${top ? ' b2b-hiw-card--top' : ' b2b-hiw-card--half'}`}>
                    <div className="b2b-hiw-content">
                      <span className="b2b-hiw-step">{t('b2b.features.step')} {i + 1}</span>
                      <h3>{t(`b2b.features.${feat}.title`)}</h3>
                      <p>{t(`b2b.features.${feat}.desc`)}</p>
                    </div>
                    <div className={`b2b-hiw-visual${top ? ' b2b-hiw-visual--img' : ''}`} aria-hidden="true">
                      {top ? (
                        <Image
                          src="/images/b2b-features-step1.png"
                          alt=""
                          width={1108}
                          height={736}
                          sizes="(max-width: 760px) 90vw, 420px"
                          style={{ position: 'absolute', top: 0, bottom: 0, right: 0, height: '100%', width: 'auto', objectFit: 'contain' }}
                        />
                      ) : (
                        <span className="b2b-hiw-bignum">0{i + 1}</span>
                      )}
                    </div>
                  </article>
                </ScrollAnimation>
                );
              })}
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
      <section className="section b2b-support" id="aftersales">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('b2b.nav.aftersales')}</span>
              <h2>{t('b2b.aftersales.title')}</h2>
              <p>{t('b2b.aftersales.desc')}</p>
            </div>
          </ScrollAnimation>
          <div className="b2b-support-stage">
            {/* orbital diagram (rings + globe + nodes baked into one graphic) */}
            <Image
              className="b2b-support-orbit-img"
              src="/images/b2b-support/orbit-diagram.png"
              alt=""
              width={1282}
              height={1160}
              aria-hidden="true"
            />
            {/* floating cards spread + staggered around the orbit */}
            {supportCards.map((c, i) => (
              <article
                key={c.key}
                className={`b2b-support-card b2b-support-card--${c.pos}`}
                style={{ ['--i' as string]: i }}
              >
                <span className="b2b-support-card-ic b2b-support-card-ic--img" aria-hidden="true">
                  <Image src="/images/b2b-support/card-badge.png" alt="" width={40} height={40} />
                </span>
                <div className="b2b-support-card-body">
                  <h3>{t(`b2b.aftersales.${c.key}.title`)}</h3>
                  <p>{t(`b2b.aftersales.${c.key}.desc`)}</p>
                </div>
              </article>
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
