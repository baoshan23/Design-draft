'use client';

import { useState } from 'react';
import Image from 'next/image';

type Phone = { src: string; label: string };

/**
 * Product gallery: a row of four phone mockups. One phone is "featured"
 * (larger, slightly tilted, lifted) at any given time; hovering or focusing
 * another phone hands the spotlight to that one.
 */
export default function Gallery3D({ phones }: { phones: Phone[] }) {
    const [active, setActive] = useState(1);

    return (
        <div className="gallery-row" onMouseLeave={() => setActive(1)}>
            {phones.slice(0, 4).map((p, i) => (
                <div
                    key={p.src}
                    className={`g3d-phone${active === i ? ' is-active' : ''}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
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
                                sizes="(max-width: 760px) 45vw, 220px"
                            />
                        </div>
                        <span className="g3d-notch" aria-hidden />
                    </div>
                </div>
            ))}
        </div>
    );
}
