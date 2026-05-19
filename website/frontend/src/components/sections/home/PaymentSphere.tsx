'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type Item = { name: string; icon: ReactNode };

// Ramp-style spherical logo cloud. Logos are distributed on a sphere via the
// Fibonacci lattice, the sphere auto-drifts slowly, and while the cursor is
// over the stage the rotation follows the pointer (offset from center sets
// the angular velocity, TagCanvas-style). Front logos are large & opaque,
// back logos shrink & fade. All per-frame work writes inline styles on cached
// DOM nodes — React never re-renders during animation.
export default function PaymentSphere({ items }: { items: Item[] }) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const N = items.length;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Base unit vectors on the sphere (Fibonacci lattice → even spread).
    const golden = Math.PI * (3 - Math.sqrt(5));
    const base = new Array(N);
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      base[i] = { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
    }

    // Stage geometry — recomputed on resize.
    let cx = 0;
    let cy = 0;
    let radius = 0;
    const measure = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      cx = w / 2;
      cy = h / 2;
      radius = Math.min(w, h) * 0.46;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);

    // Rotation state + angular velocity. Idle = gentle Y drift.
    let rotX = -0.35;
    let rotY = 0;
    const IDLE_VY = 0.0024;
    const IDLE_VX = 0;
    const MAX_SPEED = 0.05;
    let velX = IDLE_VX;
    let velY = IDLE_VY;
    let targetVX = IDLE_VX;
    let targetVY = IDLE_VY;
    let hovering = false;

    const render = () => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      for (let i = 0; i < N; i++) {
        const el = nodeRefs.current[i];
        if (!el) continue;
        const p = base[i];
        // rotate around Y, then around X
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y1 = p.y;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;
        const x2 = x1;

        const depth = (z2 + 1) / 2; // 0 = far, 1 = near
        const d2 = depth * depth; // squared → strong centre bias
        const scale = 0.34 + d2 * 0.98; // big in front, tiny at the rim/back
        const px = cx + x2 * radius;
        const py = cy + y2 * radius;
        el.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(0.1 + d2 * 0.9);
        el.style.zIndex = String(Math.round(depth * 100));
      }
    };

    if (reduceMotion) {
      // Static, readable sphere — no loop, no pointer reaction.
      rotY = 0.6;
      render();
      return () => ro.disconnect();
    }

    let raf = 0;
    const tick = () => {
      // ease velocity toward target
      velX += (targetVX - velX) * 0.08;
      velY += (targetVY - velY) * 0.08;
      rotX += velX;
      rotY += velY;
      // clamp X so the sphere never flips fully upside down
      if (rotX > 1.15) rotX = 1.15;
      if (rotX < -1.15) rotX = -1.15;
      render();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      hovering = true;
      targetVY = dx * MAX_SPEED;
      targetVX = -dy * MAX_SPEED;
    };
    const onLeave = () => {
      hovering = false;
      targetVX = IDLE_VX;
      targetVY = IDLE_VY;
    };
    const onBlurReset = () => {
      if (!hovering) {
        targetVX = IDLE_VX;
        targetVY = IDLE_VY;
      }
    };

    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onBlurReset);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onBlurReset);
    };
  }, [items]);

  return (
    <div
      ref={stageRef}
      className="payment-sphere"
      role="list"
      aria-label="Supported payment methods"
    >
      {items.map((it, i) => (
        <div
          key={it.name}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          className="payment-sphere-node"
          role="listitem"
          title={it.name}
          aria-label={it.name}
        >
          <div className="payment-sphere-tile">
            <div className="payment-sphere-inner">{it.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
