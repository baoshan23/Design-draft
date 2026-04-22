import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import PageClient from './PageClient';

export default async function OrderDetailsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return (
        <Suspense fallback={null}>
            <PageClient />
        </Suspense>
    );
}
