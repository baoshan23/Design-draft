import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import TypingText from '@/components/effects/TypingText';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import { Link } from '@/i18n/navigation';
import BusinessModelsSection from '@/components/sections/home/BusinessModelsSection';
import MobileShowcase from '@/components/sections/home/MobileShowcase';
import MobileHeroTabs from '@/components/sections/home/MobileHeroTabs';
import { DiagramModalProvider } from '@/components/sections/home/DiagramModal';
import GlobeVisualization from '@/components/sections/home/GlobeVisualization';
import PaymentRequestForm from '@/components/sections/home/PaymentRequestForm';
import TestimonialsTabs from '@/components/sections/home/TestimonialsTabs';
import ScrollResetOnLoad from '@/components/effects/ScrollResetOnLoad';
import { PAYMENT_ICONS, PAYMENT_METHODS_FLAT } from '@/components/sections/home/paymentIcons';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: 'GCSS - Global Charger System Service | EV Charging Management Platform',
    description: 'GCSS is the ultimate OCPP-compatible EV charging management platform. Free deployment, flexible scaling, full customization.',
  };
}

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="#10B981">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
  </svg>
);

// Positions for floating payment-method bubbles. Phone centerpiece removed so
// bubbles can spread across the full canvas. Perturbed-grid layout with sparse
// rows for an airy, well-dispersed cloud. 48 entries map 1:1 to PAYMENT_METHODS_FLAT.
const PAYMENT_BUBBLE_POSITIONS: { x: number; y: number; size: number; delay: number; duration: number }[] = [
  // 6 rows x 8 cols = 48 cells (matches PAYMENT_METHODS_FLAT length). Odd
  // rows shift +3 in x to break the rigid grid feel; per-bubble y jitter
  // adds further perturbation. Sizes 96-136 fit ~16% row spacing on a
  // 760px-tall orbit without overlap.
  { x:  5, y:  4, size:  96, delay:    0, duration: 5.4 },
  { x: 18, y:  8, size: 104, delay: -0.4, duration: 5.8 },
  { x: 31, y:  7, size: 112, delay: -0.8, duration: 6.2 },
  { x: 44, y:  4, size: 120, delay: -1.2, duration: 6.6 },
  { x: 57, y:  7, size: 128, delay: -1.6, duration: 7.0 },
  { x: 70, y:  8, size: 136, delay: -2.0, duration: 5.4 },
  { x: 83, y:  4, size: 112, delay: -2.4, duration: 5.8 },
  { x: 96, y:  8, size: 104, delay: -2.8, duration: 6.2 },
  { x:  8, y: 23, size: 120, delay:    0, duration: 5.6 },
  { x: 21, y: 24, size: 128, delay: -0.4, duration: 6.0 },
  { x: 34, y: 20, size: 136, delay: -0.8, duration: 6.4 },
  { x: 47, y: 24, size: 112, delay: -1.2, duration: 6.8 },
  { x: 60, y: 23, size: 104, delay: -1.6, duration: 7.2 },
  { x: 73, y: 20, size:  96, delay: -2.0, duration: 5.6 },
  { x: 86, y: 23, size: 104, delay: -2.4, duration: 6.0 },
  { x: 98, y: 24, size: 112, delay: -2.8, duration: 6.4 },
  { x:  5, y: 39, size:  96, delay:    0, duration: 5.8 },
  { x: 18, y: 36, size: 104, delay: -0.4, duration: 6.2 },
  { x: 31, y: 39, size: 112, delay: -0.8, duration: 6.6 },
  { x: 44, y: 40, size: 120, delay: -1.2, duration: 7.0 },
  { x: 57, y: 36, size: 128, delay: -1.6, duration: 5.4 },
  { x: 70, y: 40, size: 136, delay: -2.0, duration: 5.8 },
  { x: 83, y: 39, size: 112, delay: -2.4, duration: 6.2 },
  { x: 96, y: 36, size: 104, delay: -2.8, duration: 6.6 },
  { x:  8, y: 52, size: 120, delay:    0, duration: 6.0 },
  { x: 21, y: 56, size: 128, delay: -0.4, duration: 6.4 },
  { x: 34, y: 55, size: 136, delay: -0.8, duration: 6.8 },
  { x: 47, y: 52, size: 112, delay: -1.2, duration: 7.2 },
  { x: 60, y: 55, size: 104, delay: -1.6, duration: 5.6 },
  { x: 73, y: 56, size:  96, delay: -2.0, duration: 6.0 },
  { x: 86, y: 52, size: 104, delay: -2.4, duration: 6.4 },
  { x: 98, y: 56, size: 112, delay: -2.8, duration: 6.8 },
  { x:  5, y: 71, size:  96, delay:    0, duration: 6.2 },
  { x: 18, y: 72, size: 104, delay: -0.4, duration: 6.6 },
  { x: 31, y: 68, size: 112, delay: -0.8, duration: 7.0 },
  { x: 44, y: 72, size: 120, delay: -1.2, duration: 5.4 },
  { x: 57, y: 71, size: 128, delay: -1.6, duration: 5.8 },
  { x: 70, y: 68, size: 136, delay: -2.0, duration: 6.2 },
  { x: 83, y: 71, size: 112, delay: -2.4, duration: 6.6 },
  { x: 96, y: 72, size: 104, delay: -2.8, duration: 7.0 },
  { x:  8, y: 89, size: 120, delay:    0, duration: 6.4 },
  { x: 21, y: 86, size: 128, delay: -0.4, duration: 6.8 },
  { x: 34, y: 89, size: 136, delay: -0.8, duration: 7.2 },
  { x: 47, y: 90, size: 112, delay: -1.2, duration: 5.6 },
  { x: 60, y: 86, size: 104, delay: -1.6, duration: 6.0 },
  { x: 73, y: 90, size:  96, delay: -2.0, duration: 6.4 },
  { x: 86, y: 89, size: 104, delay: -2.4, duration: 6.8 },
  { x: 98, y: 86, size: 112, delay: -2.8, duration: 7.2 },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <DiagramModalProvider>
      <ScrollResetOnLoad />
      {/* Hero Section — centered text + dashboard mock below (Arcadia-style) */}
      <section className="hero hero-with-video hero-centered">
        <div className="container hero-centered-inner">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--primary)">
                  <path d="M7 0l1.76 5.24L14 7l-5.24 1.76L7 14l-1.76-5.24L0 7l5.24-1.76L7 0z" />
                </svg>
                <span>{t('hero.badge')}</span>
              </div>

              <h1 className="hero-title" style={{ marginBottom: 16 }}>
                <span>{t('hero.title1')}</span><br />
                <TypingText words={['CSMS Platform', '管理系统', 'Charge Hub', '充电平台']} />
              </h1>

              <p className="hero-desc">{t('hero.desc')}</p>

              <div className="hero-buttons">
                <Link href="/b2c" className="btn btn-primary btn-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>{t('hero.cta1')}</span>
                </Link>
                <Link href="/pricing" className="btn btn-secondary btn-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>{t('hero.cta2')}</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="hero-dashboard-mock" aria-hidden="true">
            <div className="hero-dashboard-frame">
              <Image
                src="/images/dashboard-hero.jpg"
                alt=""
                width={1920}
                height={1080}
                priority
                sizes="(max-width: 1200px) 92vw, 1120px"
                className="hero-dashboard-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* EV Charger Manufacturers Bar */}
      <section className="trusted-bar">
        <div className="container">
          <p className="trusted-label">{t('manufacturers.label')}</p>
          {(() => {
            const MANUFACTURER_LOGOS = [
              { name: 'Evcity', src: '/images/manufacturers/evcity.png' },
              { name: 'Delixi', src: '/images/manufacturers/delixi.png' },
              { name: 'Lifud', src: '/images/manufacturers/lifud.png' },
              { name: 'LV C-CHONG', src: '/images/manufacturers/lvcchong.png' },
              { name: 'Willdigits', src: '/images/manufacturers/willdigits.png' },
              { name: 'wolun', src: '/images/manufacturers/wolun.png' },
              { name: 'TOPSTAR', src: '/images/manufacturers/topstar.png' },
              { name: 'Fullwatt', src: '/images/manufacturers/fullwatt.png' },
              { name: 'Xupernova', src: '/images/manufacturers/xupernova.png' },
              { name: 'UNIT', src: '/images/manufacturers/unit.png' },
            ];
            return (
              <div className="marquee">
                <div className="marquee-track">
                  {[0, 1, 2, 3].flatMap((copy) =>
                    MANUFACTURER_LOGOS.map((logo) => (
                      <span key={`${logo.name}-${copy}`} className="marquee-item">
                        <Image src={logo.src} alt={logo.name} width={160} height={48} />
                      </span>
                    ))
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Business Models Section */}
      <BusinessModelsSection />

      {/* Mobile App Showcase */}
      <MobileShowcase />

      {/* How It Works Section */}
      <section className="section section-alt" id="how-it-works">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('steps.label')}</span>
              <h2>{t('steps.title')}</h2>
              <p>{t('steps.desc')}</p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <div className="hiw-cards">
                <div className="hiw-card">
                  <span className="hiw-card-index" aria-hidden="true">01</span>
                  <span className="hiw-card-divider" aria-hidden="true" />
                  <span className="hiw-card-icon" aria-hidden="true">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#FEBF1D" />
                      <polyline points="7 10 12 15 17 10" stroke="#181818" />
                      <line x1="12" y1="15" x2="12" y2="3" stroke="#181818" />
                    </svg>
                  </span>
                  <div className="hiw-card-text">
                    <h3>{t('steps.s1.title')}</h3>
                    <p>{t('steps.s1.desc')}</p>
                  </div>
                </div>
                <div className="hiw-card">
                  <span className="hiw-card-index" aria-hidden="true">02</span>
                  <span className="hiw-card-divider" aria-hidden="true" />
                  <span className="hiw-card-icon" aria-hidden="true">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#181818" />
                      <polyline points="8.5 12 11 14.5 15.5 10" stroke="#FEBF1D" />
                    </svg>
                  </span>
                  <div className="hiw-card-text">
                    <h3>{t('steps.s2.title')}</h3>
                    <p>{t('steps.s2.desc')}</p>
                  </div>
                </div>
                <div className="hiw-card">
                  <span className="hiw-card-index" aria-hidden="true">03</span>
                  <span className="hiw-card-divider" aria-hidden="true" />
                  <span className="hiw-card-icon" aria-hidden="true">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#FEBF1D" />
                      <polyline points="22 4 12 14.01 9 11.01" stroke="#181818" />
                    </svg>
                  </span>
                  <div className="hiw-card-text">
                    <h3>{t('steps.s3.title')}</h3>
                    <p>{t('steps.s3.desc')}</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="section section-alt" id="features">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('features.label')}</span>
              <h2>{t('features.title')}</h2>
              <p>{t('features.desc')}</p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-3">
            <ScrollAnimation>
              <div className="card card-with-img" style={{ height: '100%' }}>
                <div className="card-img-placeholder">
                  <Image src="/images/features/f1.jpg" alt={t('features.f1.title')} width={900} height={468} className="card-image" sizes="(max-width: 768px) 100vw, 400px" />
                </div>
                <h3>{t('features.f1.title')}</h3>
                <p>{t('features.f1.desc')}</p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation>
              <div className="card card-with-img" style={{ height: '100%' }}>
                <div className="card-img-placeholder">
                  <Image src="/images/features/f2.jpg" alt={t('features.f2.title')} width={900} height={468} className="card-image" sizes="(max-width: 768px) 100vw, 400px" />
                </div>
                <h3>{t('features.f2.title')}</h3>
                <p>{t('features.f2.desc')}</p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation>
              <div className="card card-with-img" style={{ height: '100%' }}>
                <div className="card-img-placeholder">
                  <Image src="/images/features/f3.jpg" alt={t('features.f3.title')} width={900} height={468} className="card-image" sizes="(max-width: 768px) 100vw, 400px" />
                </div>
                <h3>{t('features.f3.title')}</h3>
                <p>{t('features.f3.desc')}</p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation>
              <div className="card card-with-img" style={{ height: '100%' }}>
                <div className="card-img-placeholder">
                  <Image src="/images/features/f4.jpg" alt={t('features.f4.title')} width={900} height={468} className="card-image" sizes="(max-width: 768px) 100vw, 400px" />
                </div>
                <h3>{t('features.f4.title')}</h3>
                <p>{t('features.f4.desc')}</p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation>
              <div className="card card-with-img" style={{ height: '100%' }}>
                <div className="card-img-placeholder">
                  <Image src="/images/features/f5.jpg" alt={t('features.f5.title')} width={900} height={468} className="card-image" sizes="(max-width: 768px) 100vw, 400px" />
                </div>
                <h3>{t('features.f5.title')}</h3>
                <p>{t('features.f5.desc')}</p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation>
              <div className="card card-with-img" style={{ height: '100%' }}>
                <div className="card-img-placeholder">
                  <Image src="/images/features/f6.jpg" alt={t('features.f6.title')} width={900} height={468} className="card-image" sizes="(max-width: 768px) 100vw, 400px" />
                </div>
                <h3>{t('features.f6.title')}</h3>
                <p>{t('features.f6.desc')}</p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Mobile Feature Cards */}
      <section className="section">
        <div className="container">
          <MobileHeroTabs />
        </div>
      </section>

      {/* Feature Support Matrix */}
      <section className="section section-alt" id="matrix">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('matrix.label')}</span>
              <h2>{t('matrix.title')}</h2>
              <p>{t('matrix.desc')}</p>
            </div>
          </ScrollAnimation>
          <div className="matrix-section">
            <div className="matrix-row matrix-row-top">
              <ScrollAnimation>
                <div className="matrix-column matrix-column-app">
                  <div className="matrix-column-text">
                    <h3 className="matrix-header">{t('matrix.app.title')}</h3>
                    <div className="matrix-body">
                      <ul>
                        <li>{t('matrix.app.li1')}</li>
                        <li>{t('matrix.app.li2')}</li>
                        <li>{t('matrix.app.li3')}</li>
                        <li>{t('matrix.app.li4')}</li>
                        <li>{t('matrix.app.li5')}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="matrix-column-figure" aria-hidden="true">
                    <Image
                      src="/images/app-h5-mockup.png"
                      alt=""
                      width={1092}
                      height={651}
                      sizes="(max-width: 900px) 100vw, 500px"
                    />
                  </div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation>
                <div className="matrix-column matrix-column-app matrix-column-cpms">
                  <div className="matrix-column-text">
                    <h3 className="matrix-header">{t('matrix.cpms.title')}</h3>
                    <div className="matrix-body">
                      <ul>
                        <li>{t('matrix.cpms.li1')}</li>
                        <li>{t('matrix.cpms.li2')}</li>
                        <li>{t('matrix.cpms.li3')}</li>
                        <li>{t('matrix.cpms.li4')}</li>
                        <li>{t('matrix.cpms.li5')}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="matrix-column-figure" aria-hidden="true">
                    <Image
                      src="/images/cpms-dashboard.png"
                      alt=""
                      width={1253}
                      height={651}
                      sizes="(max-width: 900px) 100vw, 500px"
                    />
                  </div>
                </div>
              </ScrollAnimation>
            </div>
            <div className="matrix-row matrix-row-bottom">
              <ScrollAnimation>
                <div className="matrix-column matrix-column-platform">
                  <div className="matrix-column-text">
                    <h3 className="matrix-header">{t('matrix.platform.title')}</h3>
                    <div className="matrix-body">
                      <ul>
                        <li>{t('matrix.platform.li1')}</li>
                        <li>{t('matrix.platform.li2')}</li>
                        <li>{t('matrix.platform.li3')}</li>
                        <li>{t('matrix.platform.li4')}</li>
                        <li>{t('matrix.platform.li5')}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="matrix-column-figure" aria-hidden="true">
                    <Image
                      src="/images/platform-admin-list.png"
                      alt=""
                      width={1368}
                      height={651}
                      sizes="(max-width: 900px) 100vw, 640px"
                    />
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Global Map Section */}
      <section className="map-section">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('map.label')}</span>
              <h2>{t('map.title')}</h2>
              <p>{t('map.desc')}</p>
            </div>
          </ScrollAnimation>
        </div>
        <div className="map-fullbleed">
          <GlobeVisualization />
        </div>
      </section>

      {/* Multi-Language Section */}
      <section className="section">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('lang.label')}</span>
              <h2>{t('lang.title')}</h2>
              <p>{t('lang.desc')}</p>
              <div style={{ marginTop: 20 }}>
                <Link href={{ pathname: '/b2c', hash: 'multilingual' }} className="btn btn-primary btn-lg">{t('lang.viewMore')}</Link>
              </div>
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <div className="language-grid" role="list" aria-label="Supported languages">
              <span role="listitem">你好</span>
              <span role="listitem">Hello</span>
              <span role="listitem">Xin chào</span>
              <span role="listitem">Привет</span>
              <span role="listitem">Apa kabar</span>
              <span role="listitem">Hai</span>
              <span role="listitem">สวัสดี</span>
              <span role="listitem">හෙලෝ</span>
              <span role="listitem">مرحبا</span>
              <span role="listitem">Bonjour</span>
              <span role="listitem">Hola</span>
              <span role="listitem">Ciao</span>
              <span role="listitem">こんにちは</span>
              <span role="listitem">안녕하세요</span>
              <span role="listitem">Hallo</span>
              <span role="listitem">Olá</span>
              <span role="listitem">Merhaba</span>
              <span role="listitem">Γεια σας</span>
              <span role="listitem">नमस्ते</span>
              <span role="listitem">Habari</span>
              <span role="listitem">ជំរាបសួរ</span>
              <span role="listitem">Kamusta</span>
              <span role="listitem">سلام</span>
              <span role="listitem">Hej</span>
              <span role="listitem">Selamat</span>
              <span role="listitem">Сайн уу</span>
              <span role="listitem">Saluton</span>
              <span role="listitem">Witam</span>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Payment Partners Section */}
      <section className="section section-alt">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('payment.label')}</span>
              <h2>{t('payment.title')}</h2>
              <p>{t('payment.desc')}</p>
              <PaymentRequestForm />
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <div className="payment-orbit" role="list" aria-label="Supported payment methods">
              {PAYMENT_METHODS_FLAT.map((name, i) => {
                const pos = PAYMENT_BUBBLE_POSITIONS[i % PAYMENT_BUBBLE_POSITIONS.length];
                const style = {
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: `${pos.size}px`,
                  height: `${pos.size}px`,
                  animationDelay: `${pos.delay}s`,
                  animationDuration: `${pos.duration}s`,
                };
                return (
                  <div
                    key={name}
                    className={`payment-bubble payment-bubble-v${(i % 3) + 1}`}
                    role="listitem"
                    title={name}
                    aria-label={name}
                    style={style}
                  >
                    <div className="payment-bubble-inner">{PAYMENT_ICONS[name]}</div>
                  </div>
                );
              })}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsTabs />

      {/* CTA Section */}
      <section className="cta-section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <ScrollAnimation>
            <div className="hero-badge" style={{ marginBottom: 16 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--primary)">
                <path d="M7 0l1.76 5.24L14 7l-5.24 1.76L7 14l-1.76-5.24L0 7l5.24-1.76L7 0z" />
              </svg>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('cta.badge')}</span>
            </div>
            <h2>{t('cta.title')}</h2>
            <p>{t('cta.desc')}</p>
            <div className="cta-buttons">
              <Link href="/b2c" className="btn btn-primary btn-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>{t('cta.btn1')}</span>
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                <span>{t('cta.btn3')}</span>
              </Link>
            </div>
            <div className="cta-trust">
              <div className="cta-trust-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 4.5l-7 7L3 8" stroke="#10B981" strokeWidth="2" />
                </svg>
                <span>{t('cta.trust1')}</span>
              </div>
              <div className="cta-trust-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 4.5l-7 7L3 8" stroke="#10B981" strokeWidth="2" />
                </svg>
                <span>{t('cta.trust2')}</span>
              </div>
              <div className="cta-trust-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 4.5l-7 7L3 8" stroke="#10B981" strokeWidth="2" />
                </svg>
                <span>{t('cta.trust3')}</span>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

    </DiagramModalProvider>
  );
}
