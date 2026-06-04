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

    const geojson = {
      type: 'FeatureCollection',
      features: points.map((p) => ({
        type: 'Feature',
        properties: { name: p.name, isOrigin: p.isOrigin },
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      })),
    };

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
          attributionControl: { compact: true },
        });
        mapRef.current = map;
        map.touchZoomRotate.disableRotation();
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

        map.on('load', () => {
          if (cancelled) return;
          // No clustering — every served country stays individually visible
          // and prominent at all zoom levels.
          map.addSource('coverage', {
            type: 'geojson',
            data: geojson,
          });

          // Soft glow halo behind each pin so the marked countries pop on the map
          map.addLayer({
            id: 'points-glow',
            type: 'circle',
            source: 'coverage',
            paint: {
              'circle-color': '#FEBF1D',
              'circle-radius': ['case', ['get', 'isOrigin'], 26, 20],
              'circle-blur': 0.9,
              'circle-opacity': 0.45,
            },
          });

          // Bold pins
          map.addLayer({
            id: 'points',
            type: 'circle',
            source: 'coverage',
            paint: {
              'circle-color': ['case', ['get', 'isOrigin'], '#F59E00', '#FEBF1D'],
              'circle-radius': ['case', ['get', 'isOrigin'], 13, 10],
              'circle-stroke-width': 3,
              'circle-stroke-color': '#ffffff',
            },
          });

          // Always-visible country-name labels — the key to "more obvious"
          map.addLayer({
            id: 'point-labels',
            type: 'symbol',
            source: 'coverage',
            layout: {
              'text-field': ['get', 'name'],
              'text-font': ['Noto Sans Bold', 'Noto Sans Regular'],
              'text-size': ['case', ['get', 'isOrigin'], 15, 13],
              'text-offset': [0, 1.3],
              'text-anchor': 'top',
              'text-allow-overlap': true,
              'text-padding': 2,
            },
            paint: {
              'text-color': '#1a1a1a',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2,
              'text-halo-blur': 0.5,
            },
          });

          // Click a pin → popup with the location name
          map.on('click', 'points', (e: any) => {
            const f = e.features?.[0];
            if (!f) return;
            const coords = f.geometry.coordinates.slice();
            new maplibregl.Popup({ closeButton: false, offset: 16 })
              .setLngLat(coords)
              .setHTML(`<div class="coverage-popup">${f.properties.name}</div>`)
              .addTo(map);
          });

          map.on('mouseenter', 'points', () => (map.getCanvas().style.cursor = 'pointer'));
          map.on('mouseleave', 'points', () => (map.getCanvas().style.cursor = ''));
        });
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

  return <div ref={containerRef} className="coverage-map" aria-label="GCSS global coverage map" />;
}
