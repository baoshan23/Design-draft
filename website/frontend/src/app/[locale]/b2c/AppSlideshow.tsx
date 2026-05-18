'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const SLIDES = [
    { src: '/images/mobileapp/mobile-home.png',     alt: 'App home' },
    { src: '/images/mobileapp/mobile-map.png',      alt: 'Station map' },
    { src: '/images/mobileapp/mobile-charger.png',  alt: 'Charger detail' },
    { src: '/images/mobileapp/mobile-charging.png', alt: 'Charging session' },
    { src: '/images/mobileapp/mobile-orders.png',   alt: 'Order history' },
    { src: '/images/mobileapp/mobile-profile.png',  alt: 'Account profile' },
    { src: '/images/mobileapp/' + encodeURIComponent('个人中心--my car.png'),                  alt: 'My car' },
    { src: '/images/mobileapp/' + encodeURIComponent('个人中心--id card--添加RFID卡.png'),     alt: 'Add RFID card' },
    { src: '/images/mobileapp/' + encodeURIComponent('余额充值--添加用户名称.png'),              alt: 'Account top-up' },
];

const INTERVAL_MS = 2000;
// One cloned first slide is appended after the real ones so the rail can keep
// sliding forward past the last slide; once that clone is reached we snap the
// rail back to the real first slide with the transition disabled — seamless loop.
const CLONE_INDEX = SLIDES.length;

export default function AppSlideshow({ alt }: { alt: string }) {
    const [index, setIndex] = useState(0);
    const [animate, setAnimate] = useState(true);
    const [paused, setPaused] = useState(false);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);

    const advance = useCallback(() => {
        setAnimate(true);
        setIndex((i) => i + 1); // can reach CLONE_INDEX; handled on transition end
    }, []);

    useEffect(() => {
        if (paused) return;
        timer.current = setInterval(advance, INTERVAL_MS);
        return () => {
            if (timer.current) clearInterval(timer.current);
        };
    }, [advance, paused]);

    // After the rail slides onto the cloned slide, jump back to the real first
    // slide with no transition so the next forward move continues seamlessly.
    useEffect(() => {
        if (animate) return;
        const raf = requestAnimationFrame(() =>
            requestAnimationFrame(() => setAnimate(true)),
        );
        return () => cancelAnimationFrame(raf);
    }, [animate]);

    const handleTransitionEnd = () => {
        if (index === CLONE_INDEX) {
            setAnimate(false);
            setIndex(0);
        }
    };

    const goto = (i: number) => {
        setAnimate(true);
        setIndex(i);
    };

    const realIndex = index % SLIDES.length;

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
                <div className="app-slideshow-screen">
                    <div
                        className="app-slideshow-rail"
                        style={{
                            transform: `translateX(-${index * 100}%)`,
                            transition: animate ? undefined : 'none',
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {SLIDES.map((s, i) => (
                            <div
                                key={s.src}
                                className="app-slideshow-slide"
                                aria-hidden={i !== index}
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
                        {/* Clone of the first slide for the seamless wrap */}
                        <div
                            key="clone"
                            className="app-slideshow-slide"
                            aria-hidden
                        >
                            <Image
                                src={SLIDES[0].src}
                                alt={SLIDES[0].alt}
                                width={1080}
                                height={2340}
                                sizes="(max-width: 900px) 100vw, 560px"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="app-slideshow-dots" role="tablist">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-selected={i === realIndex}
                        aria-label={`Slide ${i + 1}`}
                        className={`app-slideshow-dot${i === realIndex ? ' is-active' : ''}`}
                        onClick={() => goto(i)}
                    />
                ))}
            </div>
        </div>
    );
}
