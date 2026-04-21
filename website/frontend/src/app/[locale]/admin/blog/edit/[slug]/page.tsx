import { setRequestLocale } from 'next-intl/server';
import PageClient from './PageClient';
import { routing } from '@/i18n/routing';
import { staticBlogSlugs } from '@/lib/content/staticContent';

export const metadata = { title: 'Edit Blog Post - GCSS Admin' };

export function generateStaticParams() {
    // Pre-generate for known blog slugs; new posts created at runtime work via client-side routing
    return routing.locales.flatMap((locale) =>
        staticBlogSlugs.map((slug) => ({ locale, slug }))
    );
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    return <PageClient slug={slug} />;
}
