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
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const [posts, setPosts] = useState<ApiBlogPost[]>(() => listStaticBlogPosts(locale));
  const [loading, setLoading] = useState(false);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchFilter = activeFilter === 'all' || (p.tags || []).includes(activeFilter);
      const matchQuery =
        !q || p.title.toLowerCase().includes(q) || (p.excerpt || '').toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [posts, activeFilter, query]);

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

  const fmtDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  const renderCard = (p: ApiBlogPost, idx: number) => (
    <Link href={`/blog/${p.slug}`} className="blog-card" key={p.slug}>
      <span className="blog-card-img">
        <ImagePlaceholder
          variant={idx % 3 === 0 ? 'dashboard' : idx % 3 === 1 ? 'api' : 'hero'}
          aspectRatio="16/10"
          label={(p.tags?.[0] || 'blog').toUpperCase()}
        />
      </span>
      <span className="blog-card-body">
        <span className="post-category">{p.tags?.[0] ?? t('blog.label')}</span>
        <h3>{p.title}</h3>
        <p>{p.excerpt}</p>
        <span className="blog-card-date">{fmtDate(p.publishedAt)}</span>
      </span>
    </Link>
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
          <ScrollAnimation>
            <h2 className="blog-section-title">{t('blog.recent')}</h2>

            {/* Toolbar: filters left, search right */}
            <div className="blog-toolbar">
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
              <div className="blog-search">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('blog.searchPlaceholder')}
                  aria-label={t('blog.searchPlaceholder')}
                />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
          </ScrollAnimation>

          {loading ? (
            <div className="muted blog-empty">{t('blog.post.loading')}</div>
          ) : filteredPosts.length === 0 ? (
            <div className="muted blog-empty">{t('blog.post.none')}</div>
          ) : (
            <ScrollAnimation>
              <div className="blog-grid">{filteredPosts.map((p, idx) => renderCard(p, idx))}</div>
            </ScrollAnimation>
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
