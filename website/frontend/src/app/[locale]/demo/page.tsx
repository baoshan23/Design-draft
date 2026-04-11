import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import DemoTabs from '../b2c/DemoTabs';

export const metadata = {
  title: 'Live Demo - GCSS | Try B2C and B2B2C Editions',
  description: 'Experience both GCSS editions side by side. Try the B2C single-operator system and the B2B2C multi-tenant platform with admin, merchant, and mobile demo access.',
};

// Demo-only credentials displayed on the page so visitors can try the sandbox.
// Not real secrets — do not add production credentials here.
const DEMO_CREDS = {
  admin: { account: 'admin', pass: '123456' },
  merchant: { account: 'test_merchant', pass: '123456' },
};

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      {/* Hero */}
      <section className="hero hero-themed-bg" style={{ paddingTop: 80, paddingBottom: 60, minHeight: 'auto' }}>
        <div className="container">
          <ScrollAnimation>
            <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
              <span className="hero-badge">
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('product.demo.label')}</span>
              </span>
              <h1 style={{ marginTop: 16, marginBottom: 16 }}>{t('demo.page.title')}</h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {t('demo.page.desc')}
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
                <a href="#demo-b2c" className="btn btn-primary">{t('demo.page.jumpB2c')}</a>
                <a href="#demo-b2b" className="btn btn-secondary">{t('demo.page.jumpB2b')}</a>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* B2C Enterprise Demo */}
      <section className="section" id="demo-b2c">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('product.demo.b2c.title')}</span>
              <h2>{t('demo.page.b2cHeading')}</h2>
              <p>{t('product.demo.b2c.desc')}</p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
              <DemoTabs />
            </div>
          </ScrollAnimation>
          <ScrollAnimation style={{ transitionDelay: '0.15s' }}>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link href="/b2c" className="btn btn-outline">
                <span>{t('demo.page.viewB2cProduct')}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* B2B2C Platform Demo */}
      <section className="section section-alt" id="demo-b2b">
        <div className="container">
          <ScrollAnimation>
            <div className="section-header">
              <span className="section-label">{t('product.demo.b2b.title')}</span>
              <h2>{t('demo.page.b2bHeading')}</h2>
              <p>{t('product.demo.b2b.desc')}</p>
            </div>
          </ScrollAnimation>
          <div className="grid-2" style={{ gap: 32, alignItems: 'start' }}>
            <ScrollAnimation>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="glass-card" style={{ padding: 28, borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{t('b2b.demo.admin.title')}</h3>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: 16 }}>{t('b2b.demo.admin.subtitle')}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: 10 }}>{t('b2b.demo.demoAccount')}</div>
                  <div className="b2b-demo-field"><span>{t('b2b.demo.account')}:</span><code>{DEMO_CREDS.admin.account}</code></div>
                  <div className="b2b-demo-field"><span>{t('b2b.demo.password')}:</span><code>{DEMO_CREDS.admin.pass}</code></div>
                  <button type="button" className="btn btn-secondary" style={{ marginTop: 16 }}>{t('b2b.demo.launch')}</button>
                </div>
                <div className="glass-card" style={{ padding: 28, borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{t('b2b.demo.merchant.title')}</h3>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: 16 }}>{t('b2b.demo.merchant.subtitle')}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: 10 }}>{t('b2b.demo.demoAccount')}</div>
                  <div className="b2b-demo-field"><span>{t('b2b.demo.account')}:</span><code>{DEMO_CREDS.merchant.account}</code></div>
                  <div className="b2b-demo-field"><span>{t('b2b.demo.password')}:</span><code>{DEMO_CREDS.merchant.pass}</code></div>
                  <button type="button" className="btn btn-secondary" style={{ marginTop: 16 }}>{t('b2b.demo.launch')}</button>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation style={{ transitionDelay: '0.15s' }}>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="glass-card" style={{ width: 'clamp(120px, 20vw, 160px)', height: 'clamp(120px, 20vw, 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)', marginBottom: 10 }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>QR Code</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('b2b.demo.mobileDemo')}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="glass-card" style={{ width: 'clamp(120px, 20vw, 160px)', height: 'clamp(120px, 20vw, 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)', marginBottom: 10 }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>QR Code</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('b2b.demo.webDemo')}</div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
          <ScrollAnimation style={{ transitionDelay: '0.2s' }}>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link href="/b2b" className="btn btn-outline">
                <span>{t('demo.page.viewB2bProduct')}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </>
  );
}
