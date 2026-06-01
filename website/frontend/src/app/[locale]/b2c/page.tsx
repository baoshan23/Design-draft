import { getTranslations, setRequestLocale } from 'next-intl/server';
import QRCode from 'qrcode';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import CounterAnimation from '@/components/effects/CounterAnimation';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import SubNav from './SubNav';
import DemoTabs from './DemoTabs';
import ScrollResetOnLoad from '@/components/effects/ScrollResetOnLoad';

const QR_OPTS = {
  type: 'svg' as const,
  margin: 1,
  width: 144,
  color: { dark: '#1a1210', light: '#00000000' },
  errorCorrectionLevel: 'M' as const,
};
import LanguageRequestForm from './LanguageRequestForm';
import PaymentRequestForm from '@/components/sections/home/PaymentRequestForm';
import AppSlideshow from './AppSlideshow';
import Gallery3D from './Gallery3D';

export const metadata = {
  title: 'B2C Model - GCSS | Direct Operator EV Charging Platform',
  description: 'GCSS B2C solution for direct operators: real-time station management, automated billing, OCPP 1.6 support, and the complete toolkit to run your own charging network.',
};

/* Reusable check-mark SVG */
function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18, flexShrink: 0 }}>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
    </svg>
  );
}

export default async function B2CPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // QR codes pre-rendered server-side and passed to the (client) DemoTabs.
  const webAppQr = await QRCode.toString('https://app.gcss.hk/', QR_OPTS);
  const mobileAppQr = await QRCode.toString('https://app.gcss.hk/', QR_OPTS);

  return (
    <>
      <ScrollResetOnLoad />
      {/* ==================== Sub Navigation ==================== */}
      <SubNav />

      {/* ==================== Section 1: System Overview (Hero) ==================== */}
      <section className="hero mesh-bg product-hero hero-with-shot" id="overview">
        <div className="container">
          <div className="hero-content hero-split">
            <div className="hero-text">
              <div className="hero-badge">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--primary)"><path d="M7 0l1.76 5.24L14 7l-5.24 1.76L7 14l-1.76-5.24L0 7l5.24-1.76L7 0z" /></svg>
                <span>{t('product.badge')}</span>
              </div>
              <h1 className="hero-title">OCPP CPMS<br />{t('product.title2')}<br /><span className="hero-title-b2c">(B2C)</span></h1>
              <p className="hero-desc">{t('product.desc')}</p>
              <div className="hero-buttons">
                <a href="#demo" className="btn btn-primary btn-lg">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><path d="M7.5 4.5v9l6-4.5-6-4.5z" /></svg>
                  <span>{t('product.cta1')}</span>
                </a>
                <a href="#license" className="btn btn-secondary btn-lg">
                  <span>{t('product.cta2')}</span>
                </a>
              </div>
            </div>

            <div className="hero-shot">
              <Image
                src="/images/b2c-hero-illustration-3.png"
                alt={t('product.title2')}
                width={1160}
                height={910}
                priority
                sizes="(max-width: 960px) 100vw, 560px"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>

        {/* Hero Footer Stats Bar — full width */}
        <div className="hero-footer-bar">
          <div className="hero-footer-inner container">
            <div className="hero-footer-stat">
              <span className="hero-footer-icon" style={{ color: 'var(--primary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              </span>
              <span className="hero-footer-label">{t('product.stat1')}</span>
              <span className="hero-footer-value"><CounterAnimation target={1000} suffix="+" /></span>
            </div>
            <div className="hero-footer-divider" />
            <div className="hero-footer-stat">
              <span className="hero-footer-icon" style={{ color: 'var(--primary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
              </span>
              <span className="hero-footer-label">{t('product.stat2')}</span>
              <span className="hero-footer-value"><CounterAnimation target={100} suffix="+" /></span>
            </div>
            <div className="hero-footer-divider" />
            <div className="hero-footer-stat">
              <span className="hero-footer-icon" style={{ color: 'var(--primary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </span>
              <span className="hero-footer-label">{t('product.stat3')}</span>
              <span className="hero-footer-value"><CounterAnimation target={100} suffix="+" /></span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== Section 2: Feature Highlights ==================== */}
      <section className="section section-alt" id="features">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header b2c-feature-head">
              <span className="section-label">{t('product.features.label')}</span>
              <h2>{t('product.features.title')}</h2>
              <p>{t('product.features.desc')}</p>
            </div>
          </ScrollAnimation>

          {/* 6 Features — lined grid */}
          <ScrollAnimation>
            <div className="b2c-feature-lined">
              <div className="b2c-feature-row">
              <div className="b2c-feature-cell">
                <div className="feature-card-icon" aria-hidden="true">
                  <Image src="/images/b2c-feat-1.png" alt="" width={26} height={26} style={{ width: 26, height: 26 }} />
                </div>
                <h3>{t('product.ff1.title')}</h3>
                <p>{t('product.ff1.desc')}</p>
              </div>
              <div className="b2c-feature-cell">
                <div className="feature-card-icon" aria-hidden="true">
                  <Image src="/images/b2c-feat-2.png" alt="" width={26} height={26} style={{ width: 26, height: 26 }} />
                </div>
                <h3>{t('product.ff2.title')}</h3>
                <p>{t('product.ff2.desc')}</p>
              </div>
              <div className="b2c-feature-cell">
                <div className="feature-card-icon" aria-hidden="true">
                  <Image src="/images/b2c-feat-3.png" alt="" width={26} height={26} style={{ width: 26, height: 26 }} />
                </div>
                <h3>{t('product.ff3.title')}</h3>
                <p>{t('product.ff3.desc')}</p>
              </div>
              </div>
              <div className="b2c-feature-row">
              <div className="b2c-feature-cell">
                <div className="feature-card-icon" aria-hidden="true">
                  <Image src="/images/b2c-feat-4.png" alt="" width={26} height={26} style={{ width: 26, height: 26 }} />
                </div>
                <h3>{t('product.ff4.title')}</h3>
                <p>{t('product.ff4.desc')}</p>
              </div>
              <div className="b2c-feature-cell">
                <div className="feature-card-icon" aria-hidden="true">
                  <Image src="/images/b2c-feat-5.png" alt="" width={26} height={26} style={{ width: 26, height: 26 }} />
                </div>
                <h3>{t('product.ff5.title')}</h3>
                <p>{t('product.ff5.desc')}</p>
              </div>
              <div className="b2c-feature-cell">
                <div className="feature-card-icon" aria-hidden="true">
                  <Image src="/images/b2c-feat-6.png" alt="" width={26} height={26} style={{ width: 26, height: 26 }} />
                </div>
                <h3>{t('product.ff6.title')}</h3>
                <p>{t('product.ff6.desc')}</p>
              </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Stunning UI Design */}
          <ScrollAnimation>
            <div style={{ marginTop: 80 }}>
              <div className="feature-row">
                <div className="feature-image-placeholder">
                  <Image src="/images/ui-design-b2c-2.png" alt={t('product.ui.title')} width={1332} height={1000} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="feature-text">
                  <h3>{t('product.ui.title')}</h3>
                  <p>{t('product.ui.desc')}</p>
                  <ul className="feature-list">
                    <li>
                      <CheckIcon />
                      <span>{t('product.ui.li1')}</span>
                    </li>
                    <li>
                      <CheckIcon />
                      <span>{t('product.ui.li2')}</span>
                    </li>
                    <li>
                      <CheckIcon />
                      <span>{t('product.ui.li3')}</span>
                    </li>
                    <li>
                      <CheckIcon />
                      <span>{t('product.ui.li4')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Your Brand. Your Rules. */}
          <ScrollAnimation>
            <div style={{ marginTop: 40 }}>
              <div className="feature-row reverse b2c-feat-shift">
                <div className="feature-image-placeholder">
                  <Image src="/images/OEM.png" alt={t('product.brand.title')} width={1920} height={1080} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="feature-text">
                  <h3>{t('product.brand.title')}</h3>
                  <p>{t('product.brand.desc')}</p>
                  <ul className="feature-list">
                    <li>
                      <CheckIcon />
                      <span>{t('product.brand.li1')}</span>
                    </li>
                    <li>
                      <CheckIcon />
                      <span>{t('product.brand.li2')}</span>
                    </li>
                    <li>
                      <CheckIcon />
                      <span>{t('product.brand.li3')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* APP / H5 */}
          <ScrollAnimation>
            <div style={{ marginTop: 40 }}>
              <div className="feature-row">
                <div className="feature-image-placeholder">
                  <AppSlideshow alt={t('product.app.title')} />
                </div>
                <div className="feature-text">
                  <h3>{t('product.app.title')}</h3>
                  <p>{t('product.app.desc')}</p>
                  <ul className="feature-list">
                    <li>
                      <CheckIcon />
                      <span>{t('product.app.li1')}</span>
                    </li>
                    <li>
                      <CheckIcon />
                      <span>{t('product.app.li2')}</span>
                    </li>
                    <li>
                      <CheckIcon />
                      <span>{t('product.app.li3')}</span>
                    </li>
                    <li>
                      <CheckIcon />
                      <span>{t('product.app.li4')}</span>
                    </li>
                    <li>
                      <CheckIcon />
                      <span>{t('product.app.li5')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Smart Operations Center */}
          <ScrollAnimation>
            <div style={{ marginTop: 40 }}>
              <div className="feature-row reverse b2c-feat-shift">
                <div
                  className="feature-image-placeholder"
                  style={{
                    position: 'relative',
                    width: 666,
                    height: 500,
                    maxWidth: '100%',
                    aspectRatio: '666 / 500',
                    borderRadius: 20,
                    overflow: 'hidden',
                    isolation: 'isolate',
                    background: 'linear-gradient(180deg, #F1F2F4 0%, #FFFFFF 100%)',
                    boxShadow: 'none',
                  }}
                >
                  <Image
                    src="/images/smart-ops-dashboard-4.png"
                    alt={t('product.ops.title')}
                    fill
                    sizes="(max-width: 900px) 100vw, 560px"
                    style={{ objectFit: 'cover', objectPosition: 'center', borderRadius: 20 }}
                    priority={false}
                  />
                </div>
                <div className="feature-text">
                  <h3>{t('product.ops.title')}</h3>
                  <p>{t('product.ops.desc')}</p>
                  <ul className="feature-list">
                    <li>
                      <CheckIcon />
                      <span>{t('product.ops.li1')}</span>
                    </li>
                    <li>
                      <CheckIcon />
                      <span>{t('product.ops.li2')}</span>
                    </li>
                    <li>
                      <CheckIcon />
                      <span>{t('product.ops.li3')}</span>
                    </li>
                    <li>
                      <CheckIcon />
                      <span>{t('product.ops.li4')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Global Payment Matrix */}
          <ScrollAnimation>
            <div style={{ marginTop: 80 }}>
              <div className="section-header">
                <span className="section-label">{t('product.pay.label')}</span>
                <h2>{t('product.pay.title')}</h2>
                <p>{t('product.pay.desc')}</p>
              </div>

              <PaymentRequestForm />

              {(() => {
                const PAY_REGIONS = [
                  { name: t('product.pay.asia'), methods: ['Alipay', 'WeChat Pay', 'GrabPay', 'GCash', 'TrueMoney', 'DragonPay', 'Boost', 'JCB'] },
                  { name: t('product.pay.europe'), methods: ['Stripe', 'SEPA', 'TrustPay', 'Skrill', 'Neosurf'] },
                  { name: t('product.pay.oceania'), methods: ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay'] },
                  { name: t('product.pay.africa'), methods: ['M-PESA', 'PayPal'] },
                  { name: t('product.pay.southamerica'), methods: ['PIX', 'Visa', 'Mastercard'] },
                  { name: t('product.pay.northamerica'), methods: ['Stripe', 'Apple Pay', 'Google Pay', 'PayPal'] },
                ];
                // Row 2 uses a rotated region order so its cards never
                // line up with row 1 (交错不对齐).
                const PAY_ROWS = [PAY_REGIONS, [...PAY_REGIONS.slice(3), ...PAY_REGIONS.slice(0, 3)]];
                return (
                  <div className="b2c-pay-marquee" style={{ marginTop: 32 }}>
                    {PAY_ROWS.map((row, ri) => (
                      <div className={`b2c-pay-track b2c-pay-track--${ri + 1}`} key={ri}>
                        {[0, 1].flatMap((copy) =>
                          row.map((r) => (
                            <div
                              key={`${r.name}-${copy}`}
                              className="card b2c-pay-card"
                              style={{ textAlign: 'center' }}
                              aria-hidden={copy === 1 ? true : undefined}
                            >
                              <h4 style={{ marginBottom: 12 }}>{r.name}</h4>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                                {r.methods.map((m) => (
                                  <span key={m} className="tag">{m}</span>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </ScrollAnimation>

          {/* 20+ Global Languages */}
          <ScrollAnimation>
            <div id="multilingual" style={{ marginTop: 80, scrollMarginTop: 'calc(var(--header-height) + 16px)' }}>
              <div className="section-header">
                <span className="section-label">{t('product.lang.label')}</span>
                <h2>{t('product.lang.title')}</h2>
                <p>{t('product.lang.desc')}</p>
              </div>
              <div className="b2c-lang-panel">
              <div className="b2c-lang-aside">
                {/* Language Request Form — inside the yellow aside */}
                <LanguageRequestForm />
              </div>
              <div className="b2c-lang-grid" role="list" aria-label="Supported languages">
                <span role="listitem">English</span>
                <span role="listitem">中文</span>
                <span role="listitem">Francais</span>
                <span role="listitem">日本語</span>
                <span role="listitem">한국어</span>
                <span role="listitem">Espanol</span>
                <span role="listitem">Deutsch</span>
                <span role="listitem">Tieng Viet</span>
                <span role="listitem">ภาษาไทย</span>
                <span role="listitem">Bahasa</span>
                <span role="listitem">Русский</span>
                <span role="listitem">العربية</span>
                <span role="listitem">Portugues</span>
                <span role="listitem">සිංහල</span>
                <span role="listitem">Italiano</span>
                <span role="listitem">Nederlands</span>
                <span role="listitem">Polski</span>
                <span role="listitem">Türkçe</span>
                <span role="listitem">हिन्दी</span>
                <span role="listitem">Українська</span>
                <span role="listitem">Svenska</span>
                <span role="listitem">Filipino</span>
                <span role="listitem">Română</span>
                <span role="listitem">Čeština</span>
                <span role="listitem">Magyar</span>
                <span role="listitem">Ελληνικά</span>
              </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ==================== Section 5: Product Gallery ==================== */}
      <section className="section" id="gallery">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('product.gallery.label')}</span>
              <h2>{t('product.gallery.title')}</h2>
              <p>{t('product.gallery.desc')}</p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation>
            <Gallery3D
              phones={[
                { src: '/images/Mobile_home.png', label: t('product.gallery.home') },
                { src: '/images/mobile_ charge.png', label: t('product.gallery.charging') },
                { src: '/images/Mobile-Map.png', label: t('product.gallery.map') },
                { src: '/images/Mobile_payment.png', label: t('product.gallery.payment') },
              ]}
            />
          </ScrollAnimation>
        </div>
      </section>

      {/* ==================== Section 6: After-sales Service ==================== */}
      <section className="section section-alt" id="support">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('product.support.label')}</span>
              <h2>{t('product.support.title')}</h2>
              <p>{t('product.support.desc')}</p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation>
            <div className="support-bento">
              {/* Tall left — video tutorials */}
              <article className="support-bento-card support-bento-tall">
                <div className="support-bento-icon support-bento-icon--gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
                </div>
                <h3>{t('product.support.s1.title')}</h3>
                <p>{t('product.support.s1.desc')}</p>
                <ul className="support-bento-list" aria-hidden="true">
                  <li><span className="support-bento-list-dot" />01 · {t('product.support.bento.lesson1')}</li>
                  <li><span className="support-bento-list-dot support-bento-list-dot--active" />02 · {t('product.support.bento.lesson2')}</li>
                  <li><span className="support-bento-list-dot" />03 · {t('product.support.bento.lesson3')}</li>
                  <li><span className="support-bento-list-dot" />04 · {t('product.support.bento.lesson4')}</li>
                </ul>
              </article>

              {/* Wide top-right — technical docs */}
              <article className="support-bento-card support-bento-wide">
                <div className="support-bento-wide-text">
                  <div className="support-bento-icon support-bento-icon--ink">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                  </div>
                  <h3>{t('product.support.s2.title')}</h3>
                  <p>{t('product.support.s2.desc')}</p>
                </div>
                <div className="support-bento-docs" aria-hidden="true">
                  <div className="support-bento-doc">
                    <span className="support-bento-doc-tag">API</span>
                    <span className="support-bento-doc-line" style={{ width: '78%' }} />
                    <span className="support-bento-doc-line" style={{ width: '52%' }} />
                  </div>
                  <div className="support-bento-doc">
                    <span className="support-bento-doc-tag">SDK</span>
                    <span className="support-bento-doc-line" style={{ width: '64%' }} />
                    <span className="support-bento-doc-line" style={{ width: '42%' }} />
                  </div>
                </div>
              </article>

              {/* Small bottom-middle — community forum */}
              <article className="support-bento-card support-bento-small">
                <div className="support-bento-icon support-bento-icon--cream">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                </div>
                <h3>{t('product.support.s3.title')}</h3>
                <p>{t('product.support.s3.desc')}</p>
                <div className="support-bento-avatars" aria-hidden="true">
                  <span className="support-bento-avatar">L</span>
                  <span className="support-bento-avatar">M</span>
                  <span className="support-bento-avatar">W</span>
                  <span className="support-bento-avatar support-bento-avatar--more">+12</span>
                </div>
              </article>

              {/* Dark accent bottom-right — 1:1 technical support */}
              <article className="support-bento-card support-bento-accent">
                <div className="support-bento-accent-body">
                  <h3>{t('product.support.s4.title')}</h3>
                  <p>{t('product.support.s4.desc')}</p>
                </div>
                <div className="support-bento-accent-stat" aria-hidden="true">
                  <div className="support-bento-accent-number">1<span className="support-bento-accent-divider">:</span>1</div>
                  <div className="support-bento-accent-label">{t('product.support.bento.accentLabel')}</div>
                </div>
              </article>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ==================== Section 7: System Demo ==================== */}
      <section className="section b2c-demo-section" id="demo">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('product.demo.label')}</span>
              <h2>{t('product.demo.title')}</h2>
              <p>{t('product.demo.desc')}</p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation>
            <div className="b2c-demo-stage">
              <DemoTabs webAppQr={webAppQr} mobileAppQr={mobileAppQr} />

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

      {/* ==================== Section 8: Purchase & License ==================== */}
      <section className="section section-alt" id="license">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('product.license.label')}</span>
              <h2>{t('product.license.title')}</h2>
              <p>{t('product.license.desc')}</p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation>
            <div className="pricing-cards pricing-cards--2col">
              {/* Custom Web APP */}
              <div className="pricing-card featured glass-card tilt-card">
                <div className="plan-name">{t('product.plan2.name')}</div>
                <div className="plan-price"><span>$300</span></div>
                <div className="plan-price-note">{t('product.plan2.period')}</div>
                <div className="plan-actions">
                  <Link href={{ pathname: '/buy', query: { plan: 'customweb' } }} className="btn btn-primary btn-full">{t('product.plan2.btn')}</Link>
                </div>
                <ul className="plan-features">
                  <li><span className="check">&#10003;</span> <span>{t('product.plan2.f1')}</span></li>
                  <li><span className="check">&#10003;</span> <span>{t('product.plan2.f2')}</span></li>
                  <li><span className="check">&#10003;</span> <span>{t('product.plan2.f3')}</span></li>
                  <li><span className="check">&#10003;</span> <span>{t('product.plan2.f4')}</span></li>
                  <li><span className="check">&#10003;</span> <span>{t('product.plan2.f5')}</span></li>
                  <li><span className="check">&#10003;</span> <span>{t('product.plan2.f6')}</span></li>
                  <li><span className="check">&#10003;</span> <span>{t('product.plan2.f7')}</span></li>
                </ul>
              </div>

              {/* APP Enterprise — deposit-eligible */}
              <div className="pricing-card glass-card tilt-card">
                <div className="plan-name">{t('product.plan3.name')}</div>
                <div className="plan-price"><span>$16,900</span></div>
                <div className="plan-price-note">{t('product.plan3.period')}</div>
                <div className="plan-deposit-offer">
                  <span className="plan-deposit-offer-amount">$500</span>
                  <div className="plan-deposit-offer-text">
                    <strong>{t('pricing.depositOfferTitle')}</strong>
                    <span>{t('pricing.depositOfferDesc', { amount: '$500' })}</span>
                  </div>
                </div>
                <div className="plan-actions">
                  <Link href={{ pathname: '/buy', query: { plan: 'appent' } }} className="btn btn-accent btn-full">{t('product.plan3.btn')}</Link>
                </div>
                <ul className="plan-features">
                  <li><span className="check">&#10003;</span> <span>{t('product.plan3.f1')}</span></li>
                  <li><span className="check">&#10003;</span> <span>{t('product.plan3.f2')}</span></li>
                  <li><span className="check">&#10003;</span> <span>{t('product.plan3.f3')}</span></li>
                  <li><span className="check">&#10003;</span> <span>{t('product.plan3.f4')}</span></li>
                  <li><span className="check">&#10003;</span> <span>{t('product.plan3.f5')}</span></li>
                  <li><span className="check">&#10003;</span> <span>{t('product.plan3.f6')}</span></li>
                </ul>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ==================== CTA Section ==================== */}
      <section className="cta-section cta-banner">
        <ScrollAnimation>
          <div className="container">
            <div className="cta-banner-inner">
              <div className="cta-banner-media">
                <Image
                  src="/images/b2c-cta-phones.png"
                  alt=""
                  width={1141}
                  height={1301}
                  className="cta-banner-img"
                />
              </div>
              <div className="cta-banner-body">
                <h2>{t('product.cta.title')}</h2>
                <p>{t('product.cta.desc')}</p>
                <div className="cta-buttons">
                  <a href="#license" className="btn btn-primary btn-lg">{t('product.cta.btn1')}</a>
                  <Link href="/contact" className="btn btn-secondary btn-lg">{t('product.cta.btn2')}</Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* ==================== Changelog (always last on the page) ==================== */}
      <section className="section section-alt" id="changelog">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('product.changelog.label')}</span>
              <h2>{t('product.changelog.title')}</h2>
              <p>{t('product.changelog.desc')}</p>
            </div>
          </ScrollAnimation>

          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {([
              { key: 'r1', items: [['FIX', 'r1f1'], ['NEW', 'r1f2'], ['UPD', 'r1f3'], ['FIX', 'r1f4']] },
              { key: 'r2', items: [['NEW', 'r2f1'], ['NEW', 'r2f2'], ['NEW', 'r2f3'], ['NEW', 'r2f4'], ['UPD', 'r2f5'], ['UPD', 'r2f6']] },
            ] as const).map((rel, i, arr) => (
              <ScrollAnimation key={rel.key}>
                <div className="release-item" style={{ display: 'flex', gap: 20, marginBottom: 32, position: 'relative', paddingLeft: 32 }}>
                  <div style={{ position: 'absolute', left: 0, top: 6, width: 12, height: 12, borderRadius: '50%', background: i === 0 ? 'var(--primary)' : 'var(--border-medium)', boxShadow: i === 0 ? '0 0 12px rgba(230,168,23,0.4)' : 'none' }} />
                  {i < arr.length - 1 && <div style={{ position: 'absolute', left: 5, top: 20, width: 2, height: 'calc(100% + 12px)', background: 'var(--border-subtle)' }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{t(`product.changelog.${rel.key}title` as never)}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{t(`product.changelog.${rel.key}date` as never)}</span>
                      {i === 0 && <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 100, background: 'var(--primary-dim)', color: 'var(--primary)', fontWeight: 600 }}>{t('b2b.releases.latest')}</span>}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {rel.items.map(([type, fk]) => (
                        <li key={fk} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <span style={{ flexShrink: 0, minWidth: 30, fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.06em', color: type === 'NEW' ? 'var(--primary)' : 'var(--text-tertiary)' }}>{type}</span>
                          <span>{t(`product.changelog.${fk}` as never)}</span>
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
