'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const SLIDES = [
    { src: '/images/mobileapp/mobile-home.png', alt: 'App home' },
    { src: '/images/mobileapp/mobile-map.png', alt: 'Station map' },
    { src: '/images/mobileapp/mobile-charger.png', alt: 'Charger detail' },
    { src: '/images/mobileapp/mobile-charging.png', alt: 'Charging session' },
    { src: '/images/mobileapp/mobile-orders.png', alt: 'Order history' },
    { src: '/images/mobileapp/mobile-profile.png', alt: 'Account profile' },
    { src: '/images/mobileapp/' + encodeURIComponent('个人中心--my car.png'), alt: 'My car' },
    { src: '/images/mobileapp/' + encodeURIComponent('个人中心--id card--添加RFID卡.png'), alt: 'Add RFID card' },
    { src: '/images/mobileapp/' + encodeURIComponent('余额充值--添加用户名称.png'), alt: 'Account top-up' },
];

const INTERVAL_MS = 2000;

export default function AppSlideshow({ alt }: { alt: string }) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);

    const advance = useCallback(() => {
        setIndex((i) => (i + 1) % SLIDES.length);
    }, []);

    useEffect(() => {
        if (paused) return;
        timer.current = setInterval(advance, INTERVAL_MS);
        return () => {
            if (timer.current) clearInterval(timer.current);
        };
    }, [advance, paused]);

    const goto = (i: number) => {
        setIndex(i);
    };

    return (
        <div
            className="app-slideshow"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            role="group"
            aria-roledescription="carousel"
            aria-label={alt}
        >
            <div className="app-slideshow-track">
                {SLIDES.map((s, i) => (
                    <div
                        key={s.src}
                        className={`app-slideshow-slide${i === index ? ' is-active' : ''}`}
                        aria-hidden={i !== index ? 'true' : 'false'}
                    >
                        <Image
                            src={s.src}
                            alt={s.alt}
                            width={1080}
                            height={2340}
                            sizes="(max-width: 900px) 100vw, 560px"
                            priority={i === 0}
                        />
                    </div>
                ))}
            </div>
            <div className="app-slideshow-dots" role="tablist">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-selected={i === index ? 'true' : 'false'}
                        aria-label={`Slide ${i + 1}`}
                        className={`app-slideshow-dot${i === index ? ' is-active' : ''}`}
                        onClick={() => goto(i)}
                    />
                ))}
            </div>
        </div>
    );
}
