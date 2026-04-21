import { Suspense } from 'react';
import PageClient from './PageClient';

export const metadata = {
    title: 'Forum Thread - GCSS',
};

export default function Page() {
    return (
        <Suspense fallback={<div className="muted">Loading…</div>}>
            <PageClient />
        </Suspense>
    );
}
