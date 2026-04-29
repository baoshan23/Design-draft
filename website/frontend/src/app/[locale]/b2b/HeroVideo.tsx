'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HeroVideo() {
    const t = useTranslations('b2b.hero.video');
    const ref = useRef<HTMLVideoElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const [muted, setMuted] = useState(false);
    const [paused, setPaused] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        const onFsChange = () => {
            setFullscreen(document.fullscreenElement === wrapRef.current || document.fullscreenElement === ref.current);
        };
        document.addEventListener('fullscreenchange', onFsChange);
        return () => document.removeEventListener('fullscreenchange', onFsChange);
    }, []);

    const toggleFullscreen = async () => {
        const wrap = wrapRef.current;
        const el = ref.current;
        if (!wrap || !el) return;
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else if (wrap.requestFullscreen) {
                await wrap.requestFullscreen();
            } else if ((el as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen) {
                (el as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen!();
            }
        } catch {
            // Fullscreen denied (e.g. iOS Safari without user gesture); ignore.
        }
    };

    // Honor prefers-reduced-motion: pause autoplay until the user opts in.
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const apply = () => {
            setReducedMotion(mq.matches);
            const el = ref.current;
            if (!el) return;
            if (mq.matches) {
                el.pause();
                setPaused(true);
            }
        };
        apply();
        mq.addEventListener('change', apply);
        return () => mq.removeEventListener('change', apply);
    }, []);

    // Try unmuted autoplay on mount. Most browsers block this without a
    // prior user gesture, so we fall back to muted autoplay and surface
    // the Unmute button. A document-level pointer/keydown gesture re-tries
    // unmuted playback automatically.
    useEffect(() => {
        const el = ref.current;
        if (!el || reducedMotion) return;
        el.muted = false;
        const tryPlay = () => el.play();
        tryPlay()
            .then(() => setMuted(false))
            .catch(() => {
                el.muted = true;
                setMuted(true);
                el.play().catch(() => {});
                const onGesture = () => {
                    el.muted = false;
                    el.play()
                        .then(() => setMuted(false))
                        .catch(() => {});
                    window.removeEventListener('pointerdown', onGesture);
                    window.removeEventListener('keydown', onGesture);
                };
                window.addEventListener('pointerdown', onGesture, { once: true });
                window.addEventListener('keydown', onGesture, { once: true });
            });
    }, [reducedMotion]);

    const toggleMute = () => {
        const el = ref.current;
        if (!el) return;
        const next = !muted;
        el.muted = next;
        setMuted(next);
        // Browsers permit unmute only after a user gesture. The click here
        // satisfies that — re-attempt play in case autoplay was blocked.
        if (!next) void el.play().catch(() => {});
    };

    const togglePlay = () => {
        const el = ref.current;
        if (!el) return;
        if (el.paused) {
            void el.play().catch(() => {});
            setPaused(false);
        } else {
            el.pause();
            setPaused(true);
        }
    };

    return (
        <div className="hero-video-wrap" ref={wrapRef}>
            <video
                ref={ref}
                className="hero-video"
                src="/video/B2B-Back.mp4"
                autoPlay={!reducedMotion}
                loop
                playsInline
                preload="metadata"
                aria-label={t('label')}
                width={960}
                height={540}
                onPause={() => setPaused(true)}
                onPlay={() => setPaused(false)}
            />
            <div className="hero-video-controls">
                <button
                    type="button"
                    className="hero-video-btn"
                    onClick={togglePlay}
                    aria-label={paused ? t('play') : t('pause')}
                    aria-pressed={paused}
                >
                    {paused ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                        </svg>
                    )}
                </button>
                <button
                    type="button"
                    className="hero-video-btn hero-video-btn--mute"
                    onClick={toggleMute}
                    aria-label={muted ? t('unmute') : t('mute')}
                    aria-pressed={!muted}
                >
                    {muted ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M11 5L6 9H2v6h4l5 4z" fill="currentColor" />
                            <line x1="22" y1="9" x2="16" y2="15" />
                            <line x1="16" y1="9" x2="22" y2="15" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M11 5L6 9H2v6h4l5 4z" fill="currentColor" />
                            <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
                        </svg>
                    )}
                    {muted && <span className="hero-video-btn-label">{t('unmute')}</span>}
                </button>
                <button
                    type="button"
                    className="hero-video-btn"
                    onClick={toggleFullscreen}
                    aria-label={fullscreen ? t('exitFullscreen') : t('fullscreen')}
                    aria-pressed={fullscreen}
                >
                    {fullscreen ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}
