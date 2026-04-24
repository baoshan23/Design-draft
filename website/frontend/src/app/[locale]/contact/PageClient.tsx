'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import RelatedPages from '@/components/sections/RelatedPages';

// Country + ITU-T E.164 calling code. When the customer picks a country,
// the phone-code prefix auto-fills to the matching code — but they can
// still override it (e.g. HK resident registering with a US-issued line).
const COUNTRIES: { name: string; code: string }[] = [
    { name: 'Hong Kong', code: '+852' },
    { name: 'China', code: '+86' },
    { name: 'United States', code: '+1' },
    { name: 'Canada', code: '+1' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'Germany', code: '+49' },
    { name: 'France', code: '+33' },
    { name: 'Spain', code: '+34' },
    { name: 'Italy', code: '+39' },
    { name: 'Netherlands', code: '+31' },
    { name: 'Japan', code: '+81' },
    { name: 'South Korea', code: '+82' },
    { name: 'Taiwan', code: '+886' },
    { name: 'Australia', code: '+61' },
    { name: 'New Zealand', code: '+64' },
    { name: 'Singapore', code: '+65' },
    { name: 'Thailand', code: '+66' },
    { name: 'Vietnam', code: '+84' },
    { name: 'Indonesia', code: '+62' },
    { name: 'Malaysia', code: '+60' },
    { name: 'Philippines', code: '+63' },
    { name: 'India', code: '+91' },
    { name: 'UAE', code: '+971' },
    { name: 'Saudi Arabia', code: '+966' },
    { name: 'Brazil', code: '+55' },
    { name: 'Mexico', code: '+52' },
    { name: 'Other', code: '' },
];

// Unique, sorted list of codes for the standalone code selector.
const PHONE_CODES: string[] = Array.from(
    new Set(COUNTRIES.map((c) => c.code).filter(Boolean)),
).sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));

export default function ContactPage() {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '+852',
    phone: '',
    country: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auto-sync phoneCode whenever the country changes. The user can still
  // override the code afterwards — we only push a new prefix on country
  // change, not on every render.
  useEffect(() => {
    const match = COUNTRIES.find((c) => c.name === formData.country);
    if (match && match.code) {
      setFormData((prev) => (prev.phoneCode === match.code ? prev : { ...prev, phoneCode: match.code }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.country]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    const useApi = (process.env.NEXT_PUBLIC_FORMS_API || '').toLowerCase();
    if (useApi !== '1' && useApi !== 'true' && useApi !== 'yes') {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setSubmitting(false);
      return;
    }

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiBase}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Request failed (${res.status})`);
      }

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneCode: '+852',
        phone: '',
        country: '',
        message: '',
      });
    } catch {
      setSubmitError(t('contact.form.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const QrPlaceholder = () => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
      <rect x="6" y="6" width="14" height="14" rx="2" />
      <rect x="9" y="9" width="8" height="8" rx="1" />
      <rect x="28" y="6" width="14" height="14" rx="2" />
      <rect x="31" y="9" width="8" height="8" rx="1" />
      <rect x="6" y="28" width="14" height="14" rx="2" />
      <rect x="9" y="31" width="8" height="8" rx="1" />
      <rect x="28" y="28" width="14" height="14" rx="2" />
    </svg>
  );

  return (
    <>
      {/* Hero */}
      <section className="contact-hero mesh-bg particles-bg">
        <ScrollAnimation>
          <div className="container">
            <span className="section-label">{t('contact.label')}</span>
            <h1>
              <span>{t('contact.title1')}</span><br />
              <span className="gradient-text-animated">{t('contact.title2')}</span>
            </h1>
            <p>{t('contact.desc')}</p>
          </div>
        </ScrollAnimation>
      </section>

      {/* Contact Methods */}
      <section className="section-sm">
        <div className="container">
          <ScrollAnimation>
            <div className="contact-methods">

              {/* Business Communication */}
              <div className="contact-method-card">
                <div className="method-icon icon-gradient--gold">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                </div>
                <h3>{t('contact.business.title')}</h3>
                <p>{t('contact.business.desc')}</p>
                <div className="qr-row">
                  <div className="qr-item">
                    <div className="qr-box"><QrPlaceholder /></div>
                    <span>WeChat</span>
                  </div>
                  <div className="qr-item">
                    <div className="qr-box"><QrPlaceholder /></div>
                    <span>WhatsApp</span>
                  </div>
                  <div className="qr-item">
                    <div className="qr-box"><QrPlaceholder /></div>
                    <span>Telegram</span>
                  </div>
                </div>
              </div>

              {/* Technical Support */}
              <div className="contact-method-card">
                <div className="method-icon icon-gradient--green">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
                </div>
                <h3>{t('contact.tech.title')}</h3>
                <p>{t('contact.tech.desc')}</p>
                <div className="qr-row">
                  <div className="qr-item">
                    <div className="qr-box"><QrPlaceholder /></div>
                    <span>WeChat</span>
                  </div>
                  <div className="qr-item">
                    <div className="qr-box"><QrPlaceholder /></div>
                    <span>WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* Quick Connect */}
              <div className="contact-method-card">
                <div className="method-icon icon-gradient--amber">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <h3>{t('contact.quick.title')}</h3>
                <p>{t('contact.quick.desc')}</p>
                <div className="contact-quick-actions">
                  <a href="mailto:support@gcss.hk" className="btn btn-primary btn-sm contact-quick-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    <span>{t('contact.quick.email')}</span>
                  </a>
                  <Link href="/forum" className="btn btn-secondary btn-sm contact-quick-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                    <span>{t('contact.quick.forum')}</span>
                  </Link>
                </div>
              </div>

            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Contact Form + Info Section */}
      <section className="section">
        <div className="container">
          <ScrollAnimation>
            <div className="contact-form-section">

              {/* Left: Info */}
              <div className="form-info">
                <h2>
                  <span>{t('contact.form.title')}</span>
                  <span className="text-gradient">{t('contact.form.title2')}</span>
                </h2>
                <p>{t('contact.form.desc')}</p>

                <div className="info-item">
                  <div className="info-icon icon-gradient--gold">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                  </div>
                  <div>
                    <h4>Phone</h4>
                    <p>+852 XXXX XXXX<br />{t('contact.form.phone.hours')}</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon icon-gradient--green">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  </div>
                  <div>
                    <h4>{t('contact.form.email')}</h4>
                    <p>support@gcss.hk<br />sales@gcss.hk</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon icon-gradient--amber">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <div>
                    <h4>Office</h4>
                    <p>{t('contact.form.office.hk')}<br />{t('contact.form.office.cn')}</p>
                  </div>
                </div>

                <div className="contact-info-image">
                  <ImagePlaceholder variant="team" aspectRatio="16/9" label={t('contact.office.title')} />
                </div>
              </div>

              {/* Right: Form */}
              <div className="contact-form-card">
                <h3>{t('contact.form.card.title')}</h3>

                {submitted && (
                  <div className="form-banner form-banner--success">
                    {t('contact.form.success')}
                  </div>
                )}

                {submitError && (
                  <div className="form-banner form-banner--error">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="contact-firstName"><span>{t('contact.form.firstname')}</span><span className="required-asterisk">*</span></label>
                      <input id="contact-firstName" type="text" name="firstName" placeholder="John" required value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-lastName"><span>{t('contact.form.lastname')}</span><span className="required-asterisk">*</span></label>
                      <input id="contact-lastName" type="text" name="lastName" placeholder="Doe" required value={formData.lastName} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email"><span>{t('contact.form.workemail')}</span><span className="required-asterisk">*</span></label>
                    <input id="contact-email" type="email" name="email" placeholder="john@company.com" required value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-country"><span>{t('contact.form.country.label')}</span><span className="required-asterisk">*</span></label>
                    <select id="contact-country" name="country" required value={formData.country} onChange={handleChange}>
                      <option value="">{t('contact.form.country.select')}</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-phone"><span>{t('contact.form.phonenum')}</span><span className="required-asterisk">*</span></label>
                    <div className="phone-field">
                      <label htmlFor="contact-phone-code" className="visually-hidden">{t('contact.form.phoneCodeLabel')}</label>
                      <select
                        id="contact-phone-code"
                        name="phoneCode"
                        className="code code-select"
                        value={formData.phoneCode}
                        onChange={handleChange}
                      >
                        {PHONE_CODES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input id="contact-phone" type="tel" name="phone" placeholder="1234 5678" required value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-message">{t('contact.form.help.label')}</label>
                    <textarea id="contact-message" name="message" placeholder={t('contact.form.help.placeholder')} value={formData.message} onChange={handleChange} />
                  </div>
                  <button type="submit" className="submit-btn">
                    <span>{submitting ? t('contact.form.submitting') : t('contact.form.submit')}</span>
                    <svg className="contact-submit-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                  </button>
                </form>
              </div>

            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Office Locations */}
      <section className="section section-alt">
        <div className="container">
          <ScrollAnimation>
            <div className="offices-section">
              <span className="section-label">{t('contact.office.label')}</span>
              <h2>{t('contact.office.title')}</h2>
              <p className="contact-office-desc">{t('contact.office.desc')}</p>

              <div className="offices-grid">
                <div className="office-card">
                  <div className="office-img">
                    <ImagePlaceholder variant="office" aspectRatio="16/10" label={t('contact.office.hk.title')} />
                  </div>
                  <div className="office-info">
                    <h4>{t('contact.office.hk.title')}</h4>
                    <p>{t('contact.office.hk.desc')}</p>
                  </div>
                </div>
                <div className="office-card">
                  <div className="office-img">
                    <ImagePlaceholder variant="office" aspectRatio="16/10" label={t('contact.office.cn.title')} />
                  </div>
                  <div className="office-info">
                    <h4>{t('contact.office.cn.title')}</h4>
                    <p>{t('contact.office.cn.desc')}</p>
                  </div>
                </div>
                <div className="office-card">
                  <div className="office-img">
                    <ImagePlaceholder variant="office" aspectRatio="16/10" label={t('contact.office.sea.title')} />
                  </div>
                  <div className="office-info">
                    <h4>{t('contact.office.sea.title')}</h4>
                    <p>{t('contact.office.sea.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section mesh-bg">
        <ScrollAnimation>
          <div className="container">
            <h2>{t('contact.cta.title')}</h2>
            <p className="contact-cta-desc">{t('contact.cta.desc')}</p>
            <div className="cta-buttons">
              <Link href="/pricing" className="btn btn-primary btn-lg">{t('contact.cta.btn1')}</Link>
              <Link href={{ pathname: '/b2c', hash: 'demo' }} className="btn btn-secondary btn-lg">{t('contact.cta.btn2')}</Link>
            </div>
          </div>
        </ScrollAnimation>
      </section>

      <RelatedPages items={['faq', 'docs', 'forum', 'blog']} />
    </>
  );
}
