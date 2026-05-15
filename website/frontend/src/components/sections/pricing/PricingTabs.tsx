'use client';

import { useState, type ReactNode } from 'react';

type Group = {
    label: string;
    title: string;
    desc: string;
    cards: ReactNode;
};

export default function PricingTabs({ b2c, b2b }: { b2c: Group; b2b: Group }) {
    const [tab, setTab] = useState<'b2c' | 'b2b'>('b2c');
    const active = tab === 'b2c' ? b2c : b2b;

    return (
        <div className="pricing-tabs">
            <div className="pricing-tabs-switch" role="tablist" aria-label="Deployment type">
                <button
                    type="button"
                    role="tab"
                    id="pricing-tab-b2c"
                    aria-selected={tab === 'b2c'}
                    aria-controls="pricing-tabpanel"
                    className={`pricing-tabs-btn${tab === 'b2c' ? ' is-active' : ''}`}
                    onClick={() => setTab('b2c')}
                >
                    {b2c.label}
                </button>
                <button
                    type="button"
                    role="tab"
                    id="pricing-tab-b2b"
                    aria-selected={tab === 'b2b'}
                    aria-controls="pricing-tabpanel"
                    className={`pricing-tabs-btn${tab === 'b2b' ? ' is-active' : ''}`}
                    onClick={() => setTab('b2b')}
                >
                    {b2b.label}
                </button>
            </div>

            <div
                id="pricing-tabpanel"
                role="tabpanel"
                aria-labelledby={tab === 'b2c' ? 'pricing-tab-b2c' : 'pricing-tab-b2b'}
                className="pricing-tabs-panel"
            >
                <div className="section-header" style={{ marginBottom: 32 }}>
                    <h2>{active.title}</h2>
                    <p>{active.desc}</p>
                </div>
                <div className="pricing-cards pricing-cards--2col">{active.cards}</div>
            </div>
        </div>
    );
}
