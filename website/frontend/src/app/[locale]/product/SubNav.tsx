'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const sections = [
  { id: 'overview', key: 'product.subnav.overview' },
  { id: 'features', key: 'product.subnav.features' },
  { id: 'changelog', key: 'product.subnav.changelog' },
  { id: 'gallery', key: 'product.subnav.gallery' },
  { id: 'support', key: 'product.subnav.support' },
  { id: 'demo', key: 'product.subnav.demo' },
  { id: 'license', key: 'product.subnav.license' },
];

export default function SubNav() {
  const t = useTranslations();
  const [active, setActive] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const offset = 160;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.getBoundingClientRect().top <= offset) {
          setActive(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className="sub-nav product-sub-nav">
        <div className="sub-nav-inner">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={active === s.id ? 'active' : undefined}
            >
              {t(s.key)}
            </a>
          ))}
        </div>
      </nav>
      <div className="sub-nav-spacer" />
    </>
  );
}
