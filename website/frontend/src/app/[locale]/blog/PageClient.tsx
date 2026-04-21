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

  return (
    <>
      {/* Blog Hero */}
      <section className="blog-hero mesh-bg">
        <ScrollAnimation>
          <div className="container">
            <span className="section-label">{t('blog.label')}</span>
            <h1>{t('blog.title')}</h1>
            <p>{t('blog.desc')}</p>
          </div>
        </ScrollAnimation>
      </section>

      {/* Filters */}
      <section className="section-sm">
        <div className="container">
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

          {/* Featured Post */}
          <ScrollAnimation>
            <div className="featured-post">
              <div className="featured-img">
                <ImagePlaceholder variant="hero" aspectRatio="16/9" label={t('blog.featured.cat')} />
              </div>
              <div className="featured-content">
                <span className="post-category">{filteredPosts[0]?.tags?.[0] ?? t('blog.featured.cat')}</span>
                <h2>
                  {filteredPosts[0] ? (
                    <Link href={`/blog/${filteredPosts[0].slug}`}>{filteredPosts[0].title}</Link>
                  ) : (
                    <span>{t('blog.featured.title')}</span>
                  )}
                </h2>
                <p>{filteredPosts[0]?.excerpt ?? t('blog.featured.desc')}</p>
                <div className="post-meta">
                  <div className="author">
                    <div className="author-avatar">G</div>
                    <span>{filteredPosts[0]?.authorName ?? t('blog.featured.team')}</span>
                  </div>
                  <span>{filteredPosts[0]?.publishedAt ? new Date(filteredPosts[0].publishedAt).toLocaleDateString(locale) : '—'}</span>
                  <span>{filteredPosts[0]?.tags?.length ? `${filteredPosts[0].tags.length} tags` : '—'}</span>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Blog Grid */}
          <ScrollAnimation>
            <div className="blog-grid">

              {loading ? (
                <div className="muted">{t('blog.post.loading')}</div>
              ) : filteredPosts.length === 0 ? (
                <div className="muted">{t('blog.post.none')}</div>
              ) : (
                filteredPosts.slice(1).map((p, idx) => (
                  <div className="blog-card" key={p.slug}>
                    <div className="blog-card-img">
                      <ImagePlaceholder
                        variant={idx % 2 === 0 ? 'dashboard' : 'api'}
                        aspectRatio="16/9"
                        label={(p.tags?.[0] || 'blog').toUpperCase()}
                      />
                    </div>
                    <div className="blog-card-body">
                      <span className="post-category cat-guide">{p.tags?.[0] ?? 'Blog'}</span>
                      <h3>
                        <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                      </h3>
                      <p>{p.excerpt}</p>
                      <div className="post-meta blog-post-meta-tight">
                        <span>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString(locale) : '—'}</span>
                        <span>{p.tags?.length ? `${p.tags.length} tags` : '—'}</span>
                      </div>
                      <Link href={`/blog/${p.slug}`} className="read-more">
                        <span>{t('blog.readmore')}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))
              )}

            </div>
          </ScrollAnimation>

          {/* Pagination */}
          <div className="pagination">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn" aria-label={t('blog.pagination.next')} title={t('blog.pagination.next')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
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
