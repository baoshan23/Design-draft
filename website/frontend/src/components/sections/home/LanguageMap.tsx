'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';

const WORLD_ATLAS_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Greetings positioned at the country/region centroid where the language is
// commonly spoken. Sizes vary slightly so the map reads as a visual hierarchy
// rather than a uniform grid.
const GREETINGS: { text: string; lat: number; lng: number; size: number }[] = [
  { text: '你好',     lat: 35.86,  lng: 104.20, size: 22 },
  { text: 'Hello',    lat: 54.00,  lng:  -2.00, size: 18 },
  { text: 'Xin chào', lat: 14.06,  lng: 108.28, size: 14 },
  { text: 'Привет',   lat: 61.52,  lng:  90.00, size: 18 },
  { text: 'Apa kabar',lat: -2.50,  lng: 118.00, size: 13 },
  { text: 'สวัสดี',     lat: 15.87,  lng: 100.99, size: 16 },
  { text: 'හෙලෝ',     lat:  7.87,  lng:  80.77, size: 18 },
  { text: 'مرحبا',     lat: 23.89,  lng:  45.08, size: 16 },
  { text: 'Bonjour',  lat: 46.23,  lng:   2.21, size: 18 },
  { text: 'Hola',     lat: 40.46,  lng:  -3.75, size: 16 },
  { text: 'Ciao',     lat: 41.87,  lng:  12.57, size: 15 },
  { text: 'こんにちは',  lat: 36.20,  lng: 138.25, size: 16 },
  { text: '안녕하세요', lat: 35.91,  lng: 127.77, size: 14 },
  { text: 'Hallo',    lat: 51.16,  lng:  10.45, size: 14 },
  { text: 'Olá',      lat:-14.24,  lng: -51.93, size: 16 },
  { text: 'Merhaba',  lat: 38.96,  lng:  35.24, size: 14 },
  { text: 'Γεια σας', lat: 39.07,  lng:  21.82, size: 13 },
  { text: 'नमस्ते',     lat: 23.00,  lng:  78.96, size: 16 },
  { text: 'Habari',   lat: -6.37,  lng:  34.89, size: 13 },
  { text: 'ជំរាបសួរ',   lat: 12.57,  lng: 104.99, size: 14 },
  { text: 'Kamusta',  lat: 12.88,  lng: 121.77, size: 13 },
  { text: 'سلام',      lat: 32.43,  lng:  53.69, size: 14 },
  { text: 'Hej',      lat: 60.13,  lng:  18.64, size: 14 },
  { text: 'Сайн уу',  lat: 46.86,  lng: 103.85, size: 13 },
  { text: 'Witam',    lat: 51.92,  lng:  19.15, size: 13 },
  { text: 'Hello',    lat: 39.50,  lng: -98.35, size: 18 }, // United States
];

export default function LanguageMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 1000, h: 520 });
  const [worldData, setWorldData] = useState<FeatureCollection<Geometry> | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (wrapperRef.current) obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const resize = () => {
      if (wrapperRef.current) {
        setDims({
          w: wrapperRef.current.clientWidth,
          h: Math.max(420, Math.round(wrapperRef.current.clientWidth * 0.5)),
        });
      }
    };
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let mounted = true;
    d3.json(WORLD_ATLAS_URL)
      .then((data: any) => {
        if (!mounted) return;
        const countries = topojson.feature(data, data.objects.countries) as unknown as FeatureCollection<Geometry>;
        setWorldData(countries);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, [isVisible]);

  useEffect(() => {
    if (!worldData || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { w, h } = dims;
    const projection = d3.geoNaturalEarth1().fitExtent([[16, 16], [w - 16, h - 16]], worldData);
    const path = d3.geoPath().projection(projection);

    const defs = svg.append('defs');
    const oceanGrad = defs.append('linearGradient')
      .attr('id', 'lm-ocean')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    oceanGrad.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(61, 48, 48, 0.55)');
    oceanGrad.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(36, 26, 26, 0.65)');

    const labelGlow = defs.append('filter')
      .attr('id', 'lm-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    labelGlow.append('feGaussianBlur').attr('stdDeviation', '2').attr('result', 'b');
    const merge = labelGlow.append('feMerge');
    merge.append('feMergeNode').attr('in', 'b');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    const root = svg.append('g');

    root.append('rect')
      .attr('width', w).attr('height', h)
      .attr('fill', 'url(#lm-ocean)')
      .attr('rx', 16);

    // Graticule
    root.append('path')
      .datum(d3.geoGraticule().step([20, 20])())
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', '#C07F00')
      .attr('stroke-width', 0.3)
      .attr('stroke-opacity', 0.1);

    // Countries
    root.selectAll('.lm-country')
      .data(worldData.features)
      .enter().append('path')
      .attr('class', 'lm-country')
      .attr('d', path as any)
      .attr('fill', '#4a3a2a')
      .attr('stroke', '#FFD95A')
      .attr('stroke-width', 0.35)
      .attr('stroke-opacity', 0.3)
      .style('opacity', 0.65);

    // Greeting labels
    const labels = root.append('g').attr('class', 'lm-greetings')
      .selectAll('g')
      .data(GREETINGS)
      .enter().append('g')
      .attr('transform', (d) => {
        const p = projection([d.lng, d.lat]);
        return p ? `translate(${p[0]},${p[1]})` : '';
      });

    // Pulse dot anchor at coordinate
    labels.append('circle')
      .attr('r', 3)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('fill', '#FFD95A')
      .attr('opacity', 0.85)
      .style('filter', 'url(#lm-glow)');

    labels.append('text')
      .text((d) => d.text)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'baseline')
      .attr('y', -8)
      .attr('font-size', (d) => d.size)
      .attr('font-weight', '700')
      .attr('fill', '#FFD95A')
      .attr('paint-order', 'stroke')
      .attr('stroke', 'rgba(0, 0, 0, 0.7)')
      .attr('stroke-width', 3.5)
      .attr('stroke-linejoin', 'round')
      .attr('letter-spacing', '0.01em')
      .style('filter', 'url(#lm-glow)');
  }, [worldData, dims]);

  return (
    <div ref={wrapperRef} className="language-map" aria-label="Languages spoken across regions">
      <svg ref={svgRef} width={dims.w} height={dims.h} role="img" />
    </div>
  );
}
