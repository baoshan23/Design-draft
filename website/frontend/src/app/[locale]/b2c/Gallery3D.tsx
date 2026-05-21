'use client';

import { useCallback, useState, type MouseEvent } from 'react';
import Image from 'next/image';

type Phone = { src: string; label: string };

/** Slot order matches the `phones` prop: back-left, front-left, front-right, back-right. */
const SLOTS = ['g3d-slot-bl', 'g3d-slot-fl', 'g3d-slot-fr', 'g3d-slot-br'] as const;

/**
 * Product gallery rendered as a 3D perspective cluster of phones.
 * Interaction: the whole stage parallax-tilts toward the cursor, and any
 * single phone straightens + floats forward (with its caption) on hover/focus.
 */
export default function Gallery3D({ phones }: { phones: Phone[] }) {
    const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

    const handleMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.innerWidth <= 760) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        // The cluster leans toward the cursor: subtle, scene-wide tilt.
        setTilt({ rx: py * 6, ry: -px * 9 });
    }, []);

    const reset = useCallback(() => setTilt({ rx: 0, ry: 0 }), []);

    return (
        <div className="gallery-3d" onMouseMove={handleMove} onMouseLeave={reset}>
            <div
                className="gallery-3d-stage"
                style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
            >
                {phones.slice(0, 4).map((p, i) => (
                    <div
                        key={p.src}
                        className={`g3d-phone ${SLOTS[i]}`}
                        tabIndex={0}
                        role="img"
                        aria-label={p.label}
                    >
                        <div className="g3d-device">
                            <div className="g3d-screen">
                                <Image
                                    src={p.src}
                                    alt=""
                                    width={390}
                                    height={844}
                                    sizes="(max-width: 760px) 45vw, 240px"
                                />
                            </div>
                            <span className="g3d-notch" aria-hidden />
                        </div>
                        <span className="g3d-label">{p.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
