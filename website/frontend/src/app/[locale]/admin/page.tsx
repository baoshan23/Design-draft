import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageClient from './PageClient';
import './admin-page.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations();

    return {
        title: `${t('admin.meta.title')} - GCSS`,
        description: t('admin.meta.description'),
    };
}

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <PageClient />;
}
