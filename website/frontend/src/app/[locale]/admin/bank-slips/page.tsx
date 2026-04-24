import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageClient from './PageClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations();
    return {
        title: `${t('admin.bankSlips.title')} - GCSS Admin`,
    };
}

export default async function AdminBankSlipsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <PageClient />;
}
