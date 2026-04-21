'use client';

import { useSearchParams } from 'next/navigation';
import TopicPageClient from '../[categorySlug]/[topicSlug]/PageClient';

export default function ForumThreadFromQuery() {
    const sp = useSearchParams();
    const categorySlug = sp.get('c') || '';
    const topicSlug = sp.get('t') || '';

    return <TopicPageClient categorySlug={categorySlug} topicSlug={topicSlug} />;
}
