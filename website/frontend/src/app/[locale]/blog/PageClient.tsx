'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import { Link } from '@/i18n/navigation';
import { apiListBlogPosts, type ApiBlogPost } from '@/lib/api/contentApi';
import { listStaticBlogPosts } from '@/lib/content/staticContent';

export default function BlogPage() {
  const locale = useLocale();
  const t = useTranslations();
  const [activeFilter, setActiveFilter] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const [posts, setPosts] = useState<ApiBlogPost[]>(() => listStaticBlogPosts(locale));
  const [loading, setLoading] = useState(false);

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return posts;
    return posts.filter((p) => (p.tags || []).includes(activeFilter));
  }, [posts, activeFilter]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const data = await apiListBlogPosts(locale, activeFilter === 'all' ? undefined : activeFilter, 20);
        if (!cancelled) setPosts(data);
      } catch {
        // Fall back to static content.
        if (!cancelled) setPosts(listStaticBlogPosts(locale));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [locale, activeFilter]);

  const filters = [
    { key: 'all', label: t('blog.filter.all') },
    { key: 'product', label: t('blog.filter.product') },
    { key: 'operations', label: t('blog.filter.operations') },
    { key: 'ocpp', label: t('blog.filter.ocpp') },
    { key: 'payments', label: t('blog.filter.payments') },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 2000);
  };

  const featured = filteredPosts[0];
  const featuredStories = filteredPosts.slice(1, 4);
  const recentPosts = filteredPosts.slice(4);

  const fmtDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  const renderCard = (p: ApiBlogPost, idx: number) => (
    <article className="blog-card" key={p.slug}>
      <Link href={`/blog/${p.slug}`} className="blog-card-img">
        <ImagePlaceholder
          variant={idx % 3 === 0 ? 'dashboard' : idx % 3 === 1 ? 'api' : 'hero'}
          aspectRatio="16/10"
          label={(p.tags?.[0] || 'blog').toUpperCase()}
        />
      </Link>
      <div className="blog-card-body">
        <span className="post-category">{p.tags?.[0] ?? t('blog.label')}</span>
        <h3>
          <Link href={`/blog/${p.slug}`}>{p.title}</Link>
        </h3>
        <p>{p.excerpt}</p>
        <span className="blog-card-date">{fmtDate(p.publishedAt)}</span>
      </div>
    </article>
  );

  return (
    <>
      {/* Blog Hero */}
      <section className="blog-hero mesh-bg">
        <ScrollAnimation>
          <div className="container">
            <span className="section-label">{t('blog.label')}</span>
            <h1>{t('blog.title')} {t('blog.title2')}</h1>
            <p>{t('blog.desc')}</p>
          </div>
        </ScrollAnimation>
      </section>

      <section className="section-sm blog-main">
        <div className="container">
          {/* Category filter row */}
          <ScrollAnimation>
            <div className="blog-filters">
              {filters.map((f) => (
                <button
                  key={f.key}
                  className={`filter-btn${activeFilter === f.key ? ' active' : ''}`}
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </ScrollAnimation>

          {loading ? (
            <div className="muted blog-empty">{t('blog.post.loading')}</div>
          ) : filteredPosts.length === 0 ? (
            <div className="muted blog-empty">{t('blog.post.none')}</div>
          ) : (
            <>
              {/* Featured hero post */}
              {featured && (
                <ScrollAnimation>
                  <article className="featured-post">
                    <Link href={`/blog/${featured.slug}`} className="featured-img">
                      <ImagePlaceholder variant="hero" aspectRatio="16/10" label={(featured.tags?.[0] || 'blog').toUpperCase()} />
                    </Link>
                    <div className="featured-content">
                      <span className="post-category">{featured.tags?.[0] ?? t('blog.label')}</span>
                      <h2>
                        <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                      </h2>
                      <p>{featured.excerpt}</p>
                      <div className="featured-meta">
                        <span className="featured-author">
                          <span className="author-avatar">{(featured.authorName ?? 'G').charAt(0)}</span>
                          {featured.authorName ?? t('blog.featured.team')}
                        </span>
                        <span className="featured-dot" aria-hidden>·</span>
                        <span>{fmtDate(featured.publishedAt)}</span>
                      </div>
                    </div>
                  </article>
                </ScrollAnimation>
              )}

              {/* Featured stories */}
              {featuredStories.length > 0 && (
                <ScrollAnimation>
                  <div className="blog-section-head">
                    <h2>{t('blog.featuredStories')}</h2>
                  </div>
                  <div className="blog-grid">
                    {featuredStories.map((p, idx) => renderCard(p, idx))}
                  </div>
                </ScrollAnimation>
              )}

              {/* Recently published */}
              {recentPosts.length > 0 && (
                <ScrollAnimation>
                  <div className="blog-section-head">
                    <h2>{t('blog.recent')}</h2>
                  </div>
                  <div className="blog-grid">
                    {recentPosts.map((p, idx) => renderCard(p, idx))}
                  </div>
                </ScrollAnimation>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="section section-alt">
        <div className="container">
          <ScrollAnimation>
            <div className="newsletter">
              <span className="section-label">{t('blog.newsletter.label')}</span>
              <h2>{t('blog.newsletter.title')}</h2>
              <p className="blog-newsletter-desc">{t('blog.newsletter.desc')}</p>
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder={t('blog.newsletter.placeholder')}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  {subscribed ? 'Subscribed!' : t('blog.newsletter.btn')}
                </button>
              </form>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </>
  );
}
