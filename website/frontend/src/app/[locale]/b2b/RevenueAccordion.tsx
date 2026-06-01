'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const items = ['item1', 'item2', 'item3', 'item4'] as const;

const icons = [
  <svg key="coin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
  <svg key="bank" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="10" width="18" height="11" rx="1" /><path d="M12 3l9 7H3z" /><line x1="7" y1="14" x2="7" y2="17" /><line x1="12" y1="14" x2="12" y2="17" /><line x1="17" y1="14" x2="17" y2="17" /></svg>,
  <svg key="zap" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  <svg key="meg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
];

export default function RevenueAccordion() {
  const t = useTranslations();
  const [open, setOpen] = useState(0);

  return (
    <div className="revenue-accordion">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item} className={`revenue-acc-item${isOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="revenue-acc-head"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="revenue-acc-icon" aria-hidden>{icons[i]}</span>
              <span className="revenue-acc-title">{t(`b2b.revenue.${item}.title`)}</span>
              <span className="revenue-acc-toggle" aria-hidden />
            </button>
            <div className="revenue-acc-body">
              <div className="revenue-acc-body-inner">
                <p>{t(`b2b.revenue.${item}.desc`)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
