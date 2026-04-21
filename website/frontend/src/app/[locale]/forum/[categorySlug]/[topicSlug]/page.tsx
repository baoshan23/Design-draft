import PageClient from './PageClient';
import { routing } from '@/i18n/routing';
import { staticForumParams } from '@/lib/content/staticContent';

export const metadata = {
    title: 'Forum - GCSS',
};

export function generateStaticParams() {
    return routing.locales.flatMap((locale) =>
        staticForumParams.map((p) => ({ locale, categorySlug: p.categorySlug, topicSlug: p.topicSlug })),
    );
}

export default async function Page({
    params,
}: {
    params: Promise<{ locale: string; categorySlug: string; topicSlug: string }>;
}) {
    const { categorySlug, topicSlug } = await params;
    return <PageClient categorySlug={categorySlug} topicSlug={topicSlug} />;
}
