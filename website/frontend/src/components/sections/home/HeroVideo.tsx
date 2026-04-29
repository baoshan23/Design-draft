'use client';

import { useEffect, useRef } from 'react';

export default function HeroVideo({ src, poster }: { src: string; poster?: string }) {
    const ref = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const v = ref.current;
        if (!v) return;
        v.muted = true;
        v.defaultMuted = true;
        v.playsInline = true;
        const tryPlay = () => {
            const p = v.play();
            if (p && typeof p.catch === 'function') {
                p.catch((err) => console.warn('[HeroVideo] play() blocked:', err?.name || err));
            }
        };
        // Force load + play after mount (autoPlay attr alone can fail in some Next/HMR cases)
        try { v.load(); } catch { /* noop */ }
        tryPlay();
        const onCanPlay = () => tryPlay();
        v.addEventListener('canplay', onCanPlay);
        v.addEventListener('loadeddata', onCanPlay);
        const onErr = () => console.warn('[HeroVideo] error', v.error);
        v.addEventListener('error', onErr);
        return () => {
            v.removeEventListener('canplay', onCanPlay);
            v.removeEventListener('loadeddata', onCanPlay);
            v.removeEventListener('error', onErr);
        };
    }, [src]);

    return (
        <>
            {/*
              Hero background video. Source: Pexels — "Aerial Shot Of A Moving Car"
              https://www.pexels.com/video/aerial-shot-of-a-moving-car-6438320/
              License: Pexels Free License (free to use, attribution appreciated).
            */}
            <video
                ref={ref}
                className="hero-bg-video"
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                controls={false}
                aria-hidden="true"
                tabIndex={-1}
            >
                <source src={src} type="video/mp4" />
            </video>
        </>
    );
}
