'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import CoverageMap from './CoverageMap';

/**
 * Map-first homepage hero — a faithful replica of the go-electra station app
 * first screen: a full-screen interactive map with a floating search bar at the
 * top (menu button + address pill + yellow search button) and a floating action
 * card at the bottom. The marketing sections still scroll into view below it.
 *
 * The map uses the shared <CoverageMap/> with scroll-zoom disabled so the wheel
 * keeps scrolling the page past the hero, and its zoom controls moved to the
 * bottom-right (lifted above the card via CSS).
 */
export default function MapHero() {
  const t = useTranslations('heroMap');
  const tHero = useTranslations('hero');

  const scrollToContent = () => {
    const next = document.querySelector('.hero-map')?.nextElementSibling;
    next?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero hero-with-video hero-map" aria-label="GCSS">
      {/* Keep a real h1 for SEO / a11y even though the hero is a map */}
      <h1 className="sr-only">
        {tHero('title1')} {tHero('title2')}
      </h1>

      <div className="hero-map-canvas">
        <CoverageMap scrollZoom={false} controlPosition="bottom-right" />
      </div>

      {/* Floating search bar */}
      <div className="hero-map-search">
        <button
          type="button"
          className="hero-map-menu"
          aria-label={t('menu')}
          onClick={scrollToContent}
        >
          <span />
          <span />
          <span />
        </button>
        <form className="hero-map-searchbar" role="search" onSubmit={(e) => e.preventDefault()}>
          <svg
            className="hero-map-search-ic"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            className="hero-map-search-input"
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
          />
          <button type="submit" className="hero-map-search-btn">
            {t('search')}
          </button>
        </form>
      </div>

      {/* Floating action card */}
      <Link href="/b2c" className="hero-map-card">
        <span className="hero-map-card-icon" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z" />
          </svg>
        </span>
        <span className="hero-map-card-text">
          <span className="hero-map-card-title">{t('smartCharging')}</span>
          <span className="hero-map-card-sub">{t('smartChargingDesc')}</span>
        </span>
        <svg
          className="hero-map-card-arrow"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </Link>
    </section>
  );
}
