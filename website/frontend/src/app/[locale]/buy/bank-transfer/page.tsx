import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageClient from './PageClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations();
    return {
        title: `${t('bankTransfer.title')} - GCSS`,
        description: t('bankTransfer.description'),
    };
}

export default async function BankTransferPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return (
        <Suspense fallback={null}>
            <PageClient />
        </Suspense>
    );
}
