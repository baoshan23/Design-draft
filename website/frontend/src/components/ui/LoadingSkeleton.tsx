'use client';

import './LoadingSkeleton.css';

interface LoadingSkeletonProps {
    width?: string | number;
    height?: string | number;
    count?: number;
    circle?: boolean;
    className?: string;
}

export default function LoadingSkeleton({
    width = '100%',
    height = 16,
    count = 1,
    circle = false,
    className,
}: LoadingSkeletonProps) {
    const skeletons = Array.from({ length: count });
    const widthValue = typeof width === 'number' ? `${width}px` : width;
    const heightValue = typeof height === 'number' ? `${height}px` : height;

    return (
        <div className={className}>
            {skeletons.map((_, i) => (
                <div
                    key={i}
                    className={`skeleton ${circle ? 'skeleton-circle' : ''}`}
                    data-width={widthValue}
                    data-height={heightValue}
                />
            ))}
        </div>
    );
}
