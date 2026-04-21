'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLocale, useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import { Link } from '@/i18n/navigation';
import { apiGetBlogPost, type ApiBlogPost } from '@/lib/api/contentApi';
import { getStaticBlogPost } from '@/lib/content/staticContent';

function formatDate(iso: string, locale: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function BlogPostPage({ slug }: { slug: string }) {
    const locale = useLocale();
    const t = useTranslations();

    const staticPost = useMemo(() => getStaticBlogPost(locale, slug), [locale, slug]);

    const [post, setPost] = useState<ApiBlogPost | null>(staticPost);
    const [loading, setLoading] = useState(!staticPost);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setLoading(true);
            setError(null);
            try {
                const p = await apiGetBlogPost(locale, slug);
                if (!cancelled) setPost(p);
            } catch (e) {
                if (!cancelled) {
                    if (staticPost) {
                        setPost(staticPost);
                    } else {
                        setError(e instanceof Error ? e.message : 'Failed to load');
                    }
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void run();
        return () => {
            cancelled = true;
        };
    }, [locale, slug, staticPost]);

    return (
        <>
            <section className="blog-hero mesh-bg blog-post-hero">
                <ScrollAnimation>
                    <div className="container">
                        <span className="section-label">{t('blog.label')}</span>
                        <h1 className="blog-post-title">{post?.title ?? t('blog.post.loading')}</h1>
                        {post?.excerpt ? <p>{post.excerpt}</p> : null}
                        <div className="post-meta blog-post-meta">
                            <div className="author">
                                <div className="author-avatar">G</div>
                                <span>{post?.authorName ?? 'GCSS'}</span>
                            </div>
                            {post?.publishedAt ? <span>{formatDate(post.publishedAt, locale)}</span> : null}
                            {post?.tags?.length ? <span>{post.tags.join(' · ')}</span> : null}
                        </div>
                    </div>
                </ScrollAnimation>
            </section>

            <section className="section-sm">
                <div className="container blog-post-container">
                    <div className="blog-post-back">
                        <Link href="/blog" className="read-more">
                            <span className="blog-post-back-arrow">←</span>
                            <span>{t('blog.post.back')}</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="muted">{t('blog.post.loading')}</div>
                    ) : post ? (
                        <div className="docs-content blog-post-content">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.contentMd}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="muted">
                            {t('blog.post.notFound')}
                            {error ? <div className="blog-post-error">{error}</div> : null}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
