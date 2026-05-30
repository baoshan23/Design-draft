'use client';

import { useState } from 'react';
import Image from 'next/image';

type Phone = { src: string; label: string };

/**
 * Product gallery: four phone mockups in an evenly-distributed row, all
 * the same size in the static state. Clicking a phone enlarges it; clicking
 * the same phone (or another phone) toggles / switches the focus.
 */
export default function Gallery3D({ phones }: { phones: Phone[] }) {
    const [active, setActive] = useState<number | null>(null);

    return (
        <div className="gallery-row">
            {phones.slice(0, 4).map((p, i) => (
                <button
                    key={p.src}
                    type="button"
                    className={`g3d-phone${active === i ? ' is-active' : ''}`}
                    onClick={() => setActive((curr) => (curr === i ? null : i))}
                    aria-pressed={active === i}
                    aria-label={p.label}
                >
                    <div className="g3d-device">
                        <div className="g3d-screen">
                            <Image
                                src={p.src}
                                alt=""
                                width={390}
                                height={844}
                                sizes="(max-width: 760px) 45vw, 260px"
                            />
                        </div>
                        <span className="g3d-notch" aria-hidden />
                    </div>
                </button>
            ))}
        </div>
    );
}
