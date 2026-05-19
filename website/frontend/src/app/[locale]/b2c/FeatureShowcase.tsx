'use client';

import { useState, useRef, type ReactNode, type KeyboardEvent } from 'react';

type Panel = { id: string; label: string; node: ReactNode };

/**
 * b2c #features — the four product blocks (Stunning UI / Your Brand /
 * APP-H5 / Smart Ops) collapsed into a single full-screen switchable
 * area: a full-bleed soft-gradient band holding a white card with a
 * vertical tab rail on the left and the active panel on the right.
 * All panels are rendered (SSR-friendly) and toggled via `hidden` so
 * the marketing copy stays crawlable. The rail is an ARIA vertical
 * tablist with roving Up/Down (and Left/Right) arrow navigation.
 */
export default function FeatureShowcase({ panels }: { panels: Panel[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const fwd = e.key === 'ArrowDown' || e.key === 'ArrowRight';
    const back = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    if (!fwd && !back) return;
    e.preventDefault();
    const next = (active + (fwd ? 1 : -1) + panels.length) % panels.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="b2c-showcase">
      <div className="b2c-showcase-inner">
        <div className="b2c-showcase-card">
          <div
            className="b2c-showcase-nav"
            role="tablist"
            aria-orientation="vertical"
            aria-label="Product features"
          >
            {panels.map((p, i) => (
              <button
                key={p.id}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                role="tab"
                id={`b2c-sc-tab-${p.id}`}
                aria-selected={active === i}
                aria-controls={`b2c-sc-panel-${p.id}`}
                tabIndex={active === i ? 0 : -1}
                className={`b2c-showcase-tab${active === i ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown}
              >
                <span className="b2c-showcase-tab-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="b2c-showcase-tab-label">{p.label}</span>
              </button>
            ))}
          </div>

          <div className="b2c-showcase-stage">
            {panels.map((p, i) => (
              <div
                key={p.id}
                role="tabpanel"
                id={`b2c-sc-panel-${p.id}`}
                aria-labelledby={`b2c-sc-tab-${p.id}`}
                hidden={active !== i}
                className="b2c-showcase-panel"
              >
                {p.node}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
