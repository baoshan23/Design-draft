'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import './BusinessDiagram3D.css';

// Simple SVG Icons
const Icons = {
  CreditCard: () => <span className="icon-svg">💳</span>,
  Smartphone: () => <span className="icon-svg">📱</span>,
  Server: () => <span className="icon-svg">🖥️</span>,
  QrCode: () => <span className="icon-svg">📲</span>,
  Zap: () => <span className="icon-svg">⚡</span>,
  Users: () => <span className="icon-svg">👥</span>,
  Monitor: () => <span className="icon-svg">💻</span>,
};

export default function BusinessDiagram3D() {
  const [tab, setTab] = useState<'B2C' | 'B2B'>('B2C');
  const t = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
      className="architecture-container"
    >
      {/* Tab Navigation */}
      <div className="diagram-tabs">
        <button
          onClick={() => setTab('B2C')}
          className={`tab-button ${tab === 'B2C' ? 'active' : ''}`}
        >
          <span>B2C Model</span>
        </button>
        <button
          onClick={() => setTab('B2B')}
          className={`tab-button ${tab === 'B2B' ? 'active' : ''}`}
        >
          <span>B2B Enterprise Network</span>
        </button>
      </div>

      {/* Diagram Content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="diagram-content"
      >
        {tab === 'B2C' ? <B2CDiagram /> : <B2BDiagram />}
      </motion.div>

      {/* Detailed Explanation */}
      <motion.div
        key={`explain-${tab}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="diagram-explanation"
      >
        <div className="explanation-header">
          <h3>{t(`models.${tab === 'B2C' ? 'b2c' : 'b2b'}.detail`)}</h3>
        </div>
        <div className="explanation-flow">
          {t.rich(`models.${tab === 'B2C' ? 'b2c' : 'b2b'}.flow`, {
            li: (chunks) => <p key={Math.random()}>{chunks}</p>,
          })}
        </div>
        <div className="explanation-summary">
          <p>{t(`models.${tab === 'B2C' ? 'b2c' : 'b2b'}.summary`)}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** B2C Simple Architecture */
function B2CDiagram() {
  return (
    <div className="diagram-grid b2c-grid">
      {/* Top Section: User Payment */}
      <div className="diagram-section top-section">
        <div className="payment-box">
          <Icons.CreditCard />
          <span>Card Payment</span>
        </div>
        <div className="arrow down" />
        <div className="payment-box">
          <Icons.Smartphone />
          <span>Mobile Payment</span>
        </div>
      </div>

      {/* Middle Section: Server & QR */}
      <div className="diagram-section middle-section">
        <div className="flow-item">
          <div className="box server-box">
            <Icons.Server />
            <span>Server</span>
          </div>
          <div className="arrow right" />
        </div>

        <div className="flow-item">
          <div className="box qr-box">
            <Icons.QrCode />
            <span>QR Code</span>
          </div>
          <div className="arrow right" />
        </div>

        <div className="flow-item">
          <div className="box charger-box">
            <Icons.Zap />
            <span>Charger</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Driver & CPO */}
      <div className="diagram-section bottom-section">
        <div className="actor-box">
          <Icons.Users />
          <span>Driver</span>
        </div>
        <div className="arrow right" />
        <div className="cpo-box">
          <Icons.Monitor />
          <span>CPO Dashboard</span>
        </div>
      </div>
    </div>
  );
}

/** B2B Enterprise Architecture */
function B2BDiagram() {
  return (
    <div className="diagram-grid b2b-grid">
      {/* Top: Payment Input */}
      <div className="diagram-section payment-section">
        <div className="payment-input">
          <Icons.CreditCard />
          <span>Payment</span>
        </div>
        <div className="payment-input">
          <Icons.Smartphone />
          <span>Mobile</span>
        </div>
      </div>

      {/* Middle: Server Gateway */}
      <div className="diagram-section gateway-section">
        <div className="gateway-box">
          <Icons.Server />
          <span className="label">Central Server</span>
          <span className="sublabel">Transaction Hub</span>
        </div>
      </div>

      {/* QR & Chargers */}
      <div className="diagram-section hardware-section">
        <div className="hardware-item">
          <Icons.QrCode />
          <span>QR Codes</span>
        </div>
        <div className="divider" />
        <div className="hardware-item">
          <Icons.Zap />
          <span>Chargers</span>
        </div>
      </div>

      {/* Multiple CPO Network */}
      <div className="diagram-section cpo-section">
        <div className="cpo-network-title">Multi-CPO Network</div>
        <div className="cpo-grid">
          <div className="cpo-item">
            <Icons.Monitor />
            <span>CPO 1</span>
          </div>
          <div className="cpo-item">
            <Icons.Monitor />
            <span>CPO 2</span>
          </div>
          <div className="cpo-item">
            <Icons.Monitor />
            <span>CPO 3</span>
          </div>
        </div>
      </div>

      {/* Admin Dashboard */}
      <div className="diagram-section admin-section">
        <div className="admin-box">
          <Icons.Monitor />
          <span>CPO Manager</span>
          <span className="sublabel">Central Management</span>
        </div>
      </div>

      {/* Data Flows */}
      <div className="data-flows">
        <div className="flow-label">
          <span className="flow-dot blue" />
          Data Flow
        </div>
        <div className="flow-label">
          <span className="flow-dot green" />
          Transaction Flow
        </div>
      </div>
    </div>
  );
}
