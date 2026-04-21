'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import { Link } from '@/i18n/navigation';
import {
  apiListForumCategories,
  apiListForumTopics,
  type ApiForumCategory,
  type ApiForumTopic,
} from '@/lib/api/contentApi';
import { listStaticForumCategories, listStaticForumTopics } from '@/lib/content/staticContent';

const AVATAR_COLORS = ['avatar-amber', 'avatar-blue', 'avatar-emerald', 'avatar-violet', 'avatar-rose', 'avatar-cyan', 'avatar-orange', 'avatar-indigo'];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatShortDate(iso: string, locale: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

function truncateExcerpt(md: string, max = 120): string {
  const plain = md.replace(/[#*_~`>\[\]()!|]/g, '').replace(/\n+/g, ' ').trim();
  return plain.length > max ? plain.slice(0, max) + '...' : plain;
}

function LoadingSkeleton() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <li key={i} className="forum-skeleton" aria-hidden="true">
          <div className="forum-skeleton-avatar" />
          <div className="forum-skeleton-lines">
            <div className="forum-skeleton-line" />
            <div className="forum-skeleton-line" />
            <div className="forum-skeleton-line" />
          </div>
        </li>
      ))}
    </>
  );
}

function EmptyState({ t }: { t: (key: string) => string }) {
  return (
    <li>
      <div className="forum-empty-state">
        <div className="forum-empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div className="forum-empty-title">{t('forum.emptyTitle')}</div>
        <div className="forum-empty-desc">{t('forum.emptyDesc')}</div>
        <Link href="/forum/new" className="forum-empty-cta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
          {t('forum.newtopic')}
        </Link>
      </div>
    </li>
  );
}

export default function ForumPage() {
  const locale = useLocale();
  const t = useTranslations();
  const [activeSort, setActiveSort] = useState('latest');
  const [activeNav, setActiveNav] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [q, setQ] = useState('');
  const [qDebounced, setQDebounced] = useState('');

  const [categories, setCategories] = useState<ApiForumCategory[]>(() => listStaticForumCategories(locale));
  const [topics, setTopics] = useState<ApiForumTopic[]>(() => listStaticForumTopics(locale));
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => {
    const discussions = topics.length;
    const replies = topics.reduce((acc, x) => acc + (x.replyCount || 0), 0);
    return { discussions, replies };
  }, [topics]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const data = await apiListForumCategories(locale);
        if (!cancelled) setCategories(data);
      } catch {
        if (!cancelled) setCategories(listStaticForumCategories(locale));
      }
    }
    void run();
    return () => { cancelled = true; };
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const data = await apiListForumTopics(locale, {
          category: activeNav === 'all' ? undefined : activeNav,
          q: qDebounced.trim() ? qDebounced.trim() : undefined,
          sort: activeSort,
          limit: 50,
        });
        if (!cancelled) setTopics(data);
      } catch {
        if (!cancelled) setTopics(listStaticForumTopics(locale, activeNav));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => { cancelled = true; };
  }, [locale, activeNav, activeSort, qDebounced]);

  useEffect(() => {
    const handle = window.setTimeout(() => setQDebounced(q), 250);
    return () => window.clearTimeout(handle);
  }, [q]);

  return (
    <>
      {/* Forum Hero */}
      <section className="forum-hero">
        <div className="forum-topic-inner">
          <ScrollAnimation>
            <h1>{t('forum.hero.title')}</h1>
            <p>{t('forum.hero.desc')}</p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Mobile sidebar toggle (top) */}
      <div className="forum-mobile-toggle" style={{ paddingTop: 16 }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-controls="forum-sidebar"
          aria-expanded={sidebarOpen}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
          {sidebarOpen ? t('forum.sidebar.close') : t('forum.sidebar.open')}
        </button>
      </div>

      {/* Forum Layout */}
      <div className="forum-container">

        {/* Sidebar */}
        <aside className={`forum-sidebar${sidebarOpen ? ' open' : ''}`} id="forum-sidebar">
          <Link href="/forum/new" className="new-topic-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 6 }}><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
            {t('forum.newtopic')}
          </Link>

          <div className="forum-sidebar-label">{t('forum.sidebar.categories')}</div>
          <ul className="forum-sidebar-nav">
            <li>
              <button type="button" className={activeNav === 'all' ? 'active' : ''} onClick={() => setActiveNav('all')}>
                <span className="nav-icon nav-icon-gold">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </span>
                <span>{t('forum.sidebar.all')}</span>
                <span className="nav-count">{topics.length}</span>
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <button
                  type="button"
                  className={activeNav === c.slug ? 'active' : ''}
                  onClick={() => setActiveNav(c.slug)}
                  title={c.description}
                >
                  <span className="nav-icon nav-icon-blue">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                      <path d="M4 4.5A2.5 2.5 0 016.5 7H20" />
                      <path d="M20 22V2" />
                    </svg>
                  </span>
                  <span>{c.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="forum-sidebar-label">{t('forum.sidebar.stats')}</div>
          <div className="forum-sidebar-stats">
            <div>
              <strong>{stats.discussions}</strong> {t('forum.stats.discussions')}
            </div>
            <div>
              <strong>{stats.replies}</strong> {t('forum.stats.posts')}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="forum-main">

          {/* Toolbar */}
          <div className="forum-toolbar">
            <div className="forum-toolbar-left">
              {['latest', 'top', 'newest'].map((sort) => (
                <button
                  key={sort}
                  className={`forum-sort-btn${activeSort === sort ? ' active' : ''}`}
                  onClick={() => setActiveSort(sort)}
                >
                  {sort === 'latest' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
                  {sort === 'top' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>}
                  {sort === 'newest' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                  <span>{t(`forum.sort.${sort}`)}</span>
                </button>
              ))}
            </div>
            <div className="forum-toolbar-right">
              <div className="forum-search-mini" role="search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input
                  className="forum-search-input"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t('forum.searchPlaceholder')}
                  aria-label={t('forum.search')}
                />
                {q ? (
                  <button type="button" className="forum-search-clear" onClick={() => setQ('')} aria-label={t('forum.searchClear')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Discussion List */}
          <ul className="discussion-list">
            {loading ? (
              <LoadingSkeleton />
            ) : topics.length === 0 ? (
              <EmptyState t={t} />
            ) : (
              topics.map((topic) => {
                const authorName = topic.authorName || 'GCSS';
                const avatarClass = getAvatarColor(authorName);
                return (
                  <li className="discussion-item" key={`${topic.categorySlug}/${topic.slug}`}>
                    <div className={`discussion-avatar ${avatarClass}`}>
                      {authorName.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="discussion-content">
                      <div className="discussion-title">
                        {topic.tags?.[0] ? <span className="discussion-tag discussion-tag-soft">{topic.tags[0]}</span> : null}
                        <Link href={`/forum/thread?c=${encodeURIComponent(topic.categorySlug)}&t=${encodeURIComponent(topic.slug)}`}>{topic.title}</Link>
                      </div>
                      <div className="discussion-meta">
                        <span>
                          <span className="author">{authorName}</span> · {formatShortDate(topic.updatedAt || topic.createdAt, locale)}
                        </span>
                      </div>
                      <div className="discussion-excerpt">{truncateExcerpt(topic.bodyMd)}</div>
                    </div>
                    <div className="discussion-stats">
                      <span className="stat-count">{topic.replyCount}</span>
                      <span className="stat-label">{t('forum.replies')}</span>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

      </div>
    </>
  );
}
