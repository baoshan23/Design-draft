import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import TypingText from '@/components/effects/TypingText';
import CounterAnimation from '@/components/effects/CounterAnimation';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import { Link } from '@/i18n/navigation';
import BusinessModelsSection from '@/components/sections/home/BusinessModelsSection';
import MobileShowcase from '@/components/sections/home/MobileShowcase';
import MobileHeroTabs from '@/components/sections/home/MobileHeroTabs';
import { DiagramModalProvider } from '@/components/sections/home/DiagramModal';
import GlobeVisualization from '@/components/sections/home/GlobeVisualization';
import PaymentRequestForm from '@/components/sections/home/PaymentRequestForm';
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

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#E6A817">
    <path d="M8 0l2.5 5 5.5.8-4 3.9.9 5.3L8 12.5 3.1 15l.9-5.3-4-3.9L5.5 5z" />
  </svg>
);

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <DiagramModalProvider>
      {/* Hero Section */}
      <section className="hero hero-with-video">
        <Image
          src="/images/hero-bg-charger.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-bg-video"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />

        <div className="container hero-with-video-grid">
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

              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="hero-stat-value"><CounterAnimation target={9999} suffix="" /></div>
                  <div className="hero-stat-meta">
                    <Image src="/assets/icons/hero-stats/downloads.svg" alt="" width={16} height={16} className="hero-stat-icon" />
                    <span className="hero-stat-label">{t('hero.stat1')}</span>
                  </div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value"><CounterAnimation target={1069} suffix="+" /></div>
                  <div className="hero-stat-meta">
                    <Image src="/assets/icons/hero-stats/chargers.svg" alt="" width={16} height={16} className="hero-stat-icon" />
                    <span className="hero-stat-label">{t('hero.stat2')}</span>
                  </div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value"><CounterAnimation target={100} suffix="+" /></div>
                  <div className="hero-stat-meta">
                    <Image src="/assets/icons/hero-stats/countries.svg" alt="" width={16} height={16} className="hero-stat-icon" />
                    <span className="hero-stat-label">{t('hero.stat3')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* EV Charger Manufacturers Bar */}
      <section className="trusted-bar">
        <div className="container">
          <p className="trusted-label">{t('manufacturers.label')}</p>
          <div className="marquee">
            <div className="marquee-track marquee-track-reverse">
              {['TiTans', 'Daoer', 'winline', 'yes', 'jingyi', 'shiyou', 'xundao', 'Fullwatt', 'TOPSTAR', 'UNIT', 'Xupernova', 'wolun', 'Willdigits', 'lingao', 'diangshanjia', 'LV C-CHONG', 'Lifud', 'Delixi', 'Evcity', 'bomern'].map((name) => (
                <span key={name} className="marquee-item">{name}</span>
              ))}
              {['TiTans', 'Daoer', 'winline', 'yes', 'jingyi', 'shiyou', 'xundao', 'Fullwatt', 'TOPSTAR', 'UNIT', 'Xupernova', 'wolun', 'Willdigits', 'lingao', 'diangshanjia', 'LV C-CHONG', 'Lifud', 'Delixi', 'Evcity', 'bomern'].map((name) => (
                <span key={`${name}-dup`} className="marquee-item">{name}</span>
              ))}
            </div>
          </div>
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
                <div className="matrix-column">
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
              </ScrollAnimation>
              <ScrollAnimation>
                <div className="matrix-column">
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
              </ScrollAnimation>
            </div>
            <div className="matrix-row matrix-row-bottom">
              <ScrollAnimation>
                <div className="matrix-column">
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
              </ScrollAnimation>
              <div className="matrix-illustration" aria-hidden="true" />
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
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <div className="language-cloud">
              <span style={{ fontSize: '2.8rem' }}>你好</span>
              <span style={{ fontSize: '2rem' }}>Hello</span>
              <span style={{ fontSize: '1.5rem' }}>Xin chào</span>
              <span style={{ fontSize: '2.2rem' }}>Привет</span>
              <span style={{ fontSize: '1.5rem' }}>Apa kabar</span>
              <span style={{ fontSize: '1.8rem' }}>Hai</span>
              <span style={{ fontSize: '1.7rem' }}>สวัสดี</span>
              <span style={{ fontSize: '2.4rem' }}>හෙලෝ</span>
              <span style={{ fontSize: '1.4rem' }}>مرحبا</span>
              <span style={{ fontSize: '2rem' }}>Bonjour</span>
              <span style={{ fontSize: '1.6rem' }}>Hola</span>
              <span style={{ fontSize: '1.5rem' }}>Ciao</span>
              <span style={{ fontSize: '1.8rem' }}>こんにちは</span>
              <span style={{ fontSize: '1.6rem' }}>안녕하세요</span>
              <span style={{ fontSize: '1.4rem' }}>Hallo</span>
              <span style={{ fontSize: '1.7rem' }}>Olá</span>
              <span style={{ fontSize: '1.3rem' }}>Merhaba</span>
              <span style={{ fontSize: '1.5rem' }}>Γεια σας</span>
              <span style={{ fontSize: '1.6rem' }}>नमस्ते</span>
              <span style={{ fontSize: '1.4rem' }}>Habari</span>
              <span style={{ fontSize: '1.8rem' }}>ជំរាបសួរ</span>
              <span style={{ fontSize: '1.3rem' }}>Kamusta</span>
              <span style={{ fontSize: '1.5rem' }}>سلام</span>
              <span style={{ fontSize: '1.6rem' }}>Hej</span>
              <span style={{ fontSize: '1.4rem' }}>Selamat</span>
              <span style={{ fontSize: '1.7rem' }}>Сайн уу</span>
              <span style={{ fontSize: '1.3rem' }}>Saluton</span>
              <span style={{ fontSize: '1.5rem' }}>Witam</span>
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link href={{ pathname: '/b2c', hash: 'multilingual' }} className="btn btn-secondary">{t('lang.viewMore')}</Link>
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
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <div className="payment-logos">
              {PAYMENT_METHODS_FLAT.map((name) => (
                <div key={name} className="payment-logo" title={name} aria-label={name}>
                  {PAYMENT_ICONS[name]}
                </div>
              ))}
            </div>
          </ScrollAnimation>
          <ScrollAnimation style={{ transitionDelay: '0.15s' }}>
            <PaymentRequestForm />
          </ScrollAnimation>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section" id="testimonials">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('testimonials.label')}</span>
              <h2>{t('testimonials.title')}</h2>
              <p>{t('testimonials.desc')}</p>
            </div>
          </ScrollAnimation>
          <div className="grid grid-3">
            <ScrollAnimation>
              <div className="testimonial-card">
                <div className="testimonial-video">
                  <div className="testimonial-video-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="11" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                      <polygon points="10,8 17,12 10,16" fill="rgba(255,255,255,0.7)" />
                    </svg>
                  </div>
                </div>
                <div className="testimonial-stars">
                  <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                </div>
                <p className="testimonial-text">{t('testimonials.t1.text')}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">ST</div>
                  <div>
                    <div className="testimonial-name">{t('testimonials.t1.name')}</div>
                    <div className="testimonial-role">{t('testimonials.t1.role')}</div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation>
              <div className="testimonial-card">
                <div className="testimonial-video">
                  <div className="testimonial-video-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="11" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                      <polygon points="10,8 17,12 10,16" fill="rgba(255,255,255,0.7)" />
                    </svg>
                  </div>
                </div>
                <div className="testimonial-stars">
                  <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                </div>
                <p className="testimonial-text">{t('testimonials.t2.text')}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">ML</div>
                  <div>
                    <div className="testimonial-name">{t('testimonials.t2.name')}</div>
                    <div className="testimonial-role">{t('testimonials.t2.role')}</div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation>
              <div className="testimonial-card">
                <div className="testimonial-video">
                  <div className="testimonial-video-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="11" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                      <polygon points="10,8 17,12 10,16" fill="rgba(255,255,255,0.7)" />
                    </svg>
                  </div>
                </div>
                <div className="testimonial-stars">
                  <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                </div>
                
                <p className="testimonial-text">{t('testimonials.t3.text')}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">AK</div>
                  <div>
                    <div className="testimonial-name">{t('testimonials.t3.name')}</div>
                    <div className="testimonial-role">{t('testimonials.t3.role')}</div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

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
