import PageClient from './PageClient';
import { routing } from '@/i18n/routing';
import { staticBlogSlugs } from '@/lib/content/staticContent';

export const metadata = {
    title: 'Blog - GCSS',
};

export function generateStaticParams() {
    // Required for static export in production.
    return routing.locales.flatMap((locale) => staticBlogSlugs.map((slug) => ({ locale, slug })));
}

export default async function Page({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { slug } = await params;
    return <PageClient slug={slug} />;
}
