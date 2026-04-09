import dynamic from 'next/dynamic';

// Lazy load heavy 3D diagram components
export const LazyBusinessDiagram3D = dynamic(
    () => import('@/components/sections/home/BusinessDiagram3D'),
    { ssr: false }
);

export const LazyGlobeVisualization = dynamic(
    () => import('@/components/sections/home/GlobeVisualization'),
    { ssr: false }
);
