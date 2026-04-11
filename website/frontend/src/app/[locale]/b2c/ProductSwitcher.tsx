'use client';

import { useState, createContext, useContext, ReactNode } from 'react';

type ProductType = 'b2c' | 'b2b';

const ProductContext = createContext<ProductType>('b2c');

export function useProductType() {
  return useContext(ProductContext);
}

export function ProductVisible({ type, children }: { type: ProductType | 'both'; children: ReactNode }) {
  const active = useContext(ProductContext);
  if (type !== 'both' && type !== active) return null;
  return <>{children}</>;
}

export default function ProductSwitcher({ children }: { children: ReactNode }) {
  const [activeProduct, setActiveProduct] = useState<ProductType>('b2c');

  return (
    <ProductContext.Provider value={activeProduct}>
      <div className="product-switcher-wrapper">
        <div className="product-switcher-tabs">
          <button
            className={`product-tab${activeProduct === 'b2c' ? ' active' : ''}`}
            onClick={() => setActiveProduct('b2c')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <div>
              <span className="product-tab-title">B2C Enterprise</span>
              <span className="product-tab-desc">Independent Deployment for Operators</span>
            </div>
          </button>
          <button
            className={`product-tab${activeProduct === 'b2b' ? ' active' : ''}`}
            onClick={() => setActiveProduct('b2b')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            <div>
              <span className="product-tab-title">B2B2C Platform</span>
              <span className="product-tab-desc">Multi-Tenant SaaS Charging Platform</span>
            </div>
          </button>
        </div>
      </div>
      {children}
    </ProductContext.Provider>
  );
}
