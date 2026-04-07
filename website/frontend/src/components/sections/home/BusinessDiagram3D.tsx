'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import './BusinessDiagram3D.css';

export default function BusinessDiagram3D() {
  const t = useTranslations('businessFlow');
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sceneRef.current) observer.observe(sceneRef.current);
    return () => observer.disconnect();
  }, []);

  // Drag to rotate
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let currentRX = -25, currentRZ = 40;
    let startRX = currentRX, startRZ = currentRZ;

    const apply = () => {
      scene.style.transform = `rotateX(${currentRX}deg) rotateZ(${currentRZ}deg)`;
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startRX = currentRX;
      startRZ = currentRZ;
      scene.style.cursor = 'grabbing';
      scene.style.transition = 'none';
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      currentRZ = startRZ + (e.clientX - startX) * 0.3;
      currentRX = Math.max(-60, Math.min(-5, startRX + (e.clientY - startY) * 0.3));
      apply();
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      scene.style.cursor = 'grab';
      scene.style.transition = 'transform 0.3s ease';
    };

    scene.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      scene.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  return (
    <div className={`diagram3d-wrapper ${isVisible ? 'diagram3d-visible' : ''}`}>
      <div className="diagram3d-hint">{t('dragHint')}</div>

      {/* Legend */}
      <div className="diagram3d-legend">
        <div className="legend-item">
          <span className="legend-line legend-money"></span>
          <span>{t('money')}</span>
        </div>
        <div className="legend-item">
          <span className="legend-line legend-data"></span>
          <span>{t('data')}</span>
        </div>
      </div>

      <div className="diagram3d-viewport">
        <div
          ref={sceneRef}
          className="diagram3d-scene"
          style={{ transform: 'rotateX(-25deg) rotateZ(40deg)' }}
        >
          {/* === PLATFORM FLOOR (subtle grid) === */}
          <div className="diagram3d-floor" />

          {/* === CONNECTION LINES (behind nodes) === */}

          {/* Driver → EV Charger (money - green) */}
          <div className="conn conn-money conn-driver-charger">
            <div className="conn-flow conn-flow-money" />
          </div>

          {/* EV Charger → Server (data - blue) */}
          <div className="conn conn-data conn-charger-server">
            <div className="conn-flow conn-flow-data" />
          </div>

          {/* Server → CPO (data - blue) */}
          <div className="conn conn-data conn-server-cpo">
            <div className="conn-flow conn-flow-data" />
          </div>

          {/* CPO → GCSS (money - green) */}
          <div className="conn conn-money conn-cpo-gcss">
            <div className="conn-flow conn-flow-money" />
          </div>

          {/* Driver → Server (data - blue, dotted) */}
          <div className="conn conn-data conn-driver-server">
            <div className="conn-flow conn-flow-data" />
          </div>

          {/* === NODES === */}

          {/* Driver - Bottom Left */}
          <div className="d3-node d3-node-driver" style={{ '--delay': '0s' } as React.CSSProperties}>
            <div className="d3-node-card">
              <div className="d3-node-shadow" />
              <div className="d3-node-face d3-face-driver">
                <div className="d3-node-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="d3-node-label">{t('driver')}</div>
              </div>
            </div>
          </div>

          {/* EV Charger - Bottom Right */}
          <div className="d3-node d3-node-charger" style={{ '--delay': '0.1s' } as React.CSSProperties}>
            <div className="d3-node-card">
              <div className="d3-node-shadow" />
              <div className="d3-node-face d3-face-charger">
                <div className="d3-node-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <div className="d3-node-label">{t('charger')}</div>
              </div>
            </div>
          </div>

          {/* Server - Center Left */}
          <div className="d3-node d3-node-server" style={{ '--delay': '0.2s' } as React.CSSProperties}>
            <div className="d3-node-card">
              <div className="d3-node-shadow" />
              <div className="d3-node-face d3-face-server">
                <div className="d3-node-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="8" rx="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" />
                    <circle cx="6" cy="6" r="1" fill="currentColor" />
                    <circle cx="6" cy="18" r="1" fill="currentColor" />
                    <line x1="10" y1="6" x2="18" y2="6" />
                    <line x1="10" y1="18" x2="18" y2="18" />
                  </svg>
                </div>
                <div className="d3-node-label">{t('server')}</div>
              </div>
            </div>
          </div>

          {/* CPO - Center Right */}
          <div className="d3-node d3-node-cpo" style={{ '--delay': '0.3s' } as React.CSSProperties}>
            <div className="d3-node-card">
              <div className="d3-node-shadow" />
              <div className="d3-node-face d3-face-cpo">
                <div className="d3-node-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div className="d3-node-label">CPO</div>
              </div>
            </div>
          </div>

          {/* GCSS Platform - Top Center */}
          <div className="d3-node d3-node-gcss" style={{ '--delay': '0.4s' } as React.CSSProperties}>
            <div className="d3-node-card">
              <div className="d3-node-shadow d3-shadow-gcss" />
              <div className="d3-node-face d3-face-gcss">
                <div className="d3-node-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M9 10h6" />
                    <path d="M12 7v6" />
                  </svg>
                </div>
                <div className="d3-node-label">{t('gcss')}</div>
                <div className="d3-node-sub">CSMS Platform</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
