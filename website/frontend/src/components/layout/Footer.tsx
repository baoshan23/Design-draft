import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <Image
                src="/assets/logo.png"
                alt="GCSS"
                width={28}
                height={28}
                style={{ borderRadius: '6px' }}
              />
              G<span>CSS</span>
            </Link>
            <p>{t('desc')}</p>
          </div>

          <div className="footer-col">
            <h4>{t('product')}</h4>
            <Link href="/b2c">{t('features')}</Link>
            <Link href="/pricing">{t('pricing')}</Link>
            <Link href="/demo">{t('livedemo')}</Link>
            <Link href="/docs">{t('documentation')}</Link>
          </div>

          <div className="footer-col">
            <h4>{t('community')}</h4>
            <Link href="/forum">{t('forum')}</Link>
            <Link href="/docs">{t('helpcenter')}</Link>
            <Link href="/contact">{t('contactsales')}</Link>
            <a href="https://wa.me/85200000000" target="_blank" rel="noopener noreferrer">{t('whatsapp')}</a>
          </div>

          <div className="footer-col">
            <h4>{t('company')}</h4>
            <Link href="/about">{t('about')}</Link>
            <Link href="/careers">{t('careers')}</Link>
            <Link href="/partners">{t('partners')}</Link>
            <Link href="/blog">{t('blog')}</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('copyright')}</p>
          <div className="footer-bottom-links">
            <Link href="/privacy">{t('privacy')}</Link>
            <Link href="/terms">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
