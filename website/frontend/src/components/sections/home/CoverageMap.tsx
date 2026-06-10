'use client';

import { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';

/**
 * Real geographic coverage map (go-electra style).
 *
 * Uses MapLibre GL JS for a true slippy map: drag-pan with inertia, scroll-zoom
 * toward the cursor, double-click / pinch zoom, +/- zoom controls — all native.
 * The basemap is OpenFreeMap (free vector tiles, NO API key / token / rate
 * limit). GCSS served locations are plotted as clustered pins with click popups.
 *
 * MapLibre is loaded from a CDN at runtime (not bundled) so the static export
 * build needs no extra dependency and there is no SSR `window` access.
 */

const MAPLIBRE_JS = 'https://cdn.jsdelivr.net/npm/maplibre-gl@5/dist/maplibre-gl.js';
const MAPLIBRE_CSS = 'https://cdn.jsdelivr.net/npm/maplibre-gl@5/dist/maplibre-gl.css';
// Free, no-key, no-rate-limit vector tiles. "positron" = clean light style that
// matches the site's white/light aesthetic.
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron';

let mapLibrePromise: Promise<any> | null = null;

function loadMapLibre(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  const w = window as any;
  if (w.maplibregl) return Promise.resolve(w.maplibregl);
  if (mapLibrePromise) return mapLibrePromise;

  mapLibrePromise = new Promise((resolve, reject) => {
    if (!document.querySelector('link[data-maplibre]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = MAPLIBRE_CSS;
      link.setAttribute('data-maplibre', '');
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.src = MAPLIBRE_JS;
    script.async = true;
    script.onload = () => resolve(w.maplibregl);
    script.onerror = () => reject(new Error('maplibre load failed'));
    document.head.appendChild(script);
  });
  return mapLibrePromise;
}

export default function CoverageMap() {
  const locale = useLocale();
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    let map: any;

    // Origin (Hong Kong) + the served countries, mirrored from the prior map.
    const points: { name: string; lng: number; lat: number; isOrigin: boolean }[] = [
      { name: t('map.countries.hongKong'), lng: 114.1694, lat: 22.3193, isOrigin: true },
      { name: t('map.countries.frenchPolynesia'), lng: -149.41, lat: -17.68, isOrigin: false },
      { name: t('map.countries.cambodia'), lng: 104.99, lat: 12.57, isOrigin: false },
      { name: t('map.countries.singapore'), lng: 103.82, lat: 1.35, isOrigin: false },
      { name: t('map.countries.belgium'), lng: 4.35, lat: 50.85, isOrigin: false },
      { name: t('map.countries.france'), lng: 2.21, lat: 46.23, isOrigin: false },
      { name: t('map.countries.italy'), lng: 12.57, lat: 41.87, isOrigin: false },
      { name: t('map.countries.russia'), lng: 105.32, lat: 61.52, isOrigin: false },
      { name: t('map.countries.brazil'), lng: -51.93, lat: -14.24, isOrigin: false },
      { name: t('map.countries.malaysia'), lng: 101.98, lat: 4.21, isOrigin: false },
      { name: t('map.countries.philippines'), lng: 121.77, lat: 12.88, isOrigin: false },
      { name: t('map.countries.vietnam'), lng: 108.28, lat: 14.06, isOrigin: false },
      { name: t('map.countries.uae'), lng: 53.85, lat: 23.42, isOrigin: false },
      { name: t('map.countries.saudiArabia'), lng: 45.08, lat: 23.89, isOrigin: false },
      { name: t('map.countries.thailand'), lng: 100.99, lat: 15.87, isOrigin: false },
      { name: t('map.countries.sriLanka'), lng: 80.77, lat: 7.87, isOrigin: false },
      { name: t('map.countries.india'), lng: 78.96, lat: 20.59, isOrigin: false },
      { name: t('map.countries.indonesia'), lng: 113.92, lat: -0.79, isOrigin: false },
      { name: t('map.countries.ethiopia'), lng: 40.4897, lat: 9.145, isOrigin: false },
    ];

    loadMapLibre()
      .then((maplibregl) => {
        if (cancelled || !containerRef.current) return;

        map = new maplibregl.Map({
          container: containerRef.current,
          style: MAP_STYLE,
          center: [55, 22],
          zoom: 1.3,
          minZoom: 1,
          maxZoom: 16,
          dragRotate: false,
          pitchWithRotate: false,
          touchPitch: false,
          // Don't tile/repeat the world horizontally — show a single globe.
          renderWorldCopies: false,
          attributionControl: { compact: true },
        });
        mapRef.current = map;
        map.touchZoomRotate.disableRotation();
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

        // Localise the basemap's own place/country labels to the site language.
        // OpenFreeMap (OpenMapTiles schema) exposes name:zh / name:en fields;
        // fall back to latin/native when a translation is missing.
        const localeName =
          locale === 'zh'
            ? ['coalesce', ['get', 'name:zh'], ['get', 'name:zh-Hans'], ['get', 'name:latin'], ['get', 'name']]
            : ['coalesce', ['get', 'name:en'], ['get', 'name:latin'], ['get', 'name']];
        const localizeLabels = () => {
          for (const layer of map.getStyle().layers || []) {
            if (layer.type !== 'symbol') continue;
            try {
              const tf = map.getLayoutProperty(layer.id, 'text-field');
              if (tf != null) map.setLayoutProperty(layer.id, 'text-field', localeName);
            } catch {
              /* layer without a text-field — skip */
            }
          }
        };
        map.on('load', localizeLabels);
        // Style can reload (e.g. on HMR) — re-apply on every styledata event too.
        map.on('styledata', localizeLabels);

        // Balloon map-pin markers: a rounded teardrop silhouette with a
        // lightning bolt, drawn as an SVG path so the shape is a real pin
        // (not a rotated square). The location name is labelled beneath it.
        const pinSvg =
          '<svg class="coverage-pin-svg" viewBox="0 0 40 50" aria-hidden="true">' +
          '<path class="coverage-pin-shape" d="M20 49C12 40 5 27 5 18A15 15 0 1 1 35 18C35 27 28 40 20 49Z"/>' +
          '<path class="coverage-pin-bolt" d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z" transform="translate(10.4 8.4) scale(0.8)"/>' +
          '</svg>';

        for (const p of points) {
          const el = document.createElement('div');
          el.className = 'coverage-pin' + (p.isOrigin ? ' coverage-pin--origin' : '');
          el.innerHTML = pinSvg + `<span class="coverage-pin-label">${p.name}</span>`;
          new maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([p.lng, p.lat])
            .addTo(map);
        }
      })
      .catch(() => {
        /* offline / CDN blocked — leave the empty container, no crash */
      });

    return () => {
      cancelled = true;
      if (map) map.remove();
      mapRef.current = null;
    };
  }, [locale, t]);

  // data-lenis-prevent: let the mouse wheel zoom the map instead of being
  // hijacked by the page's Lenis smooth-scroll.
  return (
    <div
      ref={containerRef}
      className="coverage-map"
      aria-label="GCSS global coverage map"
      data-lenis-prevent
    />
  );
}
