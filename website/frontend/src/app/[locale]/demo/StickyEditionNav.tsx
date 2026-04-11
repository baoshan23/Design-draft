'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function StickyEditionNav() {
  const t = useTranslations();
  const [active, setActive] = useState<'b2c' | 'b2b'>('b2c');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('demo-hero');
    const b2c = document.getElementById('demo-b2c');
    const b2b = document.getElementById('demo-b2b');

    const onScroll = () => {
      if (hero) {
        const heroBottom = hero.getBoundingClientRect().bottom;
        setVisible(heroBottom < 80);
      }
      const offset = 180;
      if (b2b && b2b.getBoundingClientRect().top <= offset) {
        setActive('b2b');
      } else if (b2c && b2c.getBoundingClientRect().top <= offset) {
        setActive('b2c');
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className={`demo-sticky-nav${visible ? ' visible' : ''}`} aria-hidden={!visible}>
      <div className="demo-sticky-nav-inner">
        <span className="demo-sticky-nav-label">{t('demo.page.stickyLabel')}</span>
        <div className="demo-sticky-nav-segments" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={active === 'b2c'}
            className={`demo-sticky-nav-seg${active === 'b2c' ? ' active' : ''}`}
            onClick={() => jump('demo-b2c')}
          >
            <span className="demo-sticky-nav-dot" />
            {t('demo.page.b2cShort')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={active === 'b2b'}
            className={`demo-sticky-nav-seg${active === 'b2b' ? ' active' : ''}`}
            onClick={() => jump('demo-b2b')}
          >
            <span className="demo-sticky-nav-dot" />
            {t('demo.page.b2bShort')}
          </button>
        </div>
      </div>
    </div>
  );
}
