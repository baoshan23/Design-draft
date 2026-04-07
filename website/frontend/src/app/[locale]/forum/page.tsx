'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ForumPage() {
  const t = useTranslations();
  const [activeSort, setActiveSort] = useState('latest');
  const [activeNav, setActiveNav] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Forum Hero */}
      <section className="forum-hero">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h1>{t('forum.hero.title')}</h1>
          <p>{t('forum.hero.desc')}</p>
        </div>
      </section>

      {/* Forum Layout */}
      <div className="forum-container">

        {/* Sidebar */}
        <aside className={`forum-sidebar${sidebarOpen ? ' open' : ''}`} id="forum-sidebar">
          <button type="button" className="new-topic-btn">{t('forum.newtopic')}</button>

          <ul className="forum-sidebar-nav">
            <li>
              <button type="button" className={activeNav === 'all' ? 'active' : ''} onClick={() => setActiveNav('all')}>
                <span className="nav-icon" style={{ background: 'rgba(230,168,23,0.12)', color: '#E6A817' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                </span>
                <span>{t('forum.sidebar.all')}</span>
                <span className="nav-count">247</span>
              </button>
            </li>
            <li>
              <button type="button" className={activeNav === 'following' ? 'active' : ''} onClick={() => setActiveNav('following')}>
                <span className="nav-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                <span>{t('forum.sidebar.following')}</span>
                <span className="nav-count">12</span>
              </button>
            </li>
            <li>
              <button type="button" className={activeNav === 'myposts' ? 'active' : ''} onClick={() => setActiveNav('myposts')}>
                <span className="nav-icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </span>
                <span>{t('forum.sidebar.myposts')}</span>
                <span className="nav-count">5</span>
              </button>
            </li>
          </ul>

          <div className="forum-sidebar-label">{t('forum.sidebar.tags')}</div>
          <ul className="forum-tag-list">
            <li><button type="button"><span className="tag-dot" style={{ background: '#E6A817' }}></span> <span>{t('forum.tag.announce')}</span></button></li>
            <li><button type="button"><span className="tag-dot" style={{ background: '#3B82F6' }}></span> <span>{t('forum.tag.general')}</span></button></li>
            <li><button type="button"><span className="tag-dot" style={{ background: '#10B981' }}></span> <span>{t('forum.tag.install')}</span></button></li>
            <li><button type="button"><span className="tag-dot" style={{ background: '#8B5CF6' }}></span> <span>{t('forum.tag.feature')}</span></button></li>
            <li><button type="button"><span className="tag-dot" style={{ background: '#EF4444' }}></span> <span>{t('forum.tag.bug')}</span></button></li>
            <li><button type="button"><span className="tag-dot" style={{ background: '#F59E0B' }}></span> <span>{t('forum.tag.usage')}</span></button></li>
            <li><button type="button"><span className="tag-dot" style={{ background: '#06B6D4' }}></span> <span>{t('forum.tag.ocpp')}</span></button></li>
            <li><button type="button"><span className="tag-dot" style={{ background: '#EC4899' }}></span> <span>{t('forum.tag.payment')}</span></button></li>
          </ul>

          <div className="forum-sidebar-label">{t('forum.sidebar.stats')}</div>
          <div style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-tertiary)', lineHeight: 2 }}>
            <div><strong style={{ color: 'var(--text-primary)' }}>247</strong> {t('forum.stats.discussions')}</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>1,842</strong> {t('forum.stats.posts')}</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>536</strong> {t('forum.stats.members')}</div>
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
              <button className="forum-search-mini">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <span>{t('forum.search')}</span>
              </button>
            </div>
          </div>

          {/* Discussion List */}
          <ul className="discussion-list">

            {/* Pinned: Official Announcement */}
            <li className="discussion-item pinned unread">
              <div className="discussion-avatar" style={{ background: 'linear-gradient(135deg,#E6A817,#D4890A)' }}>G</div>
              <div className="discussion-content">
                <div className="discussion-title">
                  <svg className="pin-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" /></svg>
                  <span className="discussion-tag" style={{ background: '#FEF3C7', color: '#92400E' }}>{t('forum.tag.announce')}</span>
                  <a href="/forum">{t('forum.post1.title')}</a>
                </div>
                <div className="discussion-meta">
                  <span><span className="author">GCSS Team</span> · 2025.11.25</span>
                </div>
                <div className="discussion-excerpt">{t('forum.post1.excerpt')}</div>
              </div>
              <div className="discussion-stats">
                <span className="stat-count">100</span>
                <span className="stat-label">{t('forum.replies')}</span>
                <div className="last-reply">
                  <span className="last-reply-avatar" style={{ background: '#10B981' }}>M</span>
                </div>
              </div>
            </li>

            {/* Discussion 2 */}
            <li className="discussion-item unread">
              <div className="discussion-avatar" style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}>J</div>
              <div className="discussion-content">
                <div className="discussion-title">
                  <span className="discussion-tag" style={{ background: '#DBEAFE', color: '#1E40AF' }}>{t('forum.tag.general')}</span>
                  <a href="/forum">{t('forum.post6.title')}</a>
                </div>
                <div className="discussion-meta">
                  <span><span className="author">John_CPO</span> · 3h ago</span>
                </div>
                <div className="discussion-excerpt">I&apos;ve been running 50 chargers in Thailand and wanted to share my experience with time-of-use pricing configurations...</div>
              </div>
              <div className="discussion-stats">
                <span className="stat-count">45</span>
                <span className="stat-label">{t('forum.replies')}</span>
                <div className="last-reply">
                  <span className="last-reply-avatar" style={{ background: '#F59E0B' }}>K</span>
                </div>
              </div>
            </li>

            {/* Discussion 3 */}
            <li className="discussion-item unread">
              <div className="discussion-avatar" style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' }}>A</div>
              <div className="discussion-content">
                <div className="discussion-title">
                  <span className="discussion-tag" style={{ background: '#EDE9FE', color: '#5B21B6' }}>{t('forum.tag.feature')}</span>
                  <a href="/forum">{t('forum.post3.title')}</a>
                </div>
                <div className="discussion-meta">
                  <span><span className="author">Alex_Dev</span> · 6h ago</span>
                </div>
                <div className="discussion-excerpt">With OCPP 2.0.1 gaining traction, it would be great to see GCSS add support for the new protocol features like ISO 15118...</div>
              </div>
              <div className="discussion-stats">
                <span className="stat-count">23</span>
                <span className="stat-label">{t('forum.replies')}</span>
                <div className="last-reply">
                  <span className="last-reply-avatar" style={{ background: '#E6A817' }}>G</span>
                </div>
              </div>
            </li>

            {/* Discussion 4 */}
            <li className="discussion-item">
              <div className="discussion-avatar" style={{ background: 'linear-gradient(135deg,#EF4444,#DC2626)' }}>B</div>
              <div className="discussion-content">
                <div className="discussion-title">
                  <span className="discussion-tag" style={{ background: '#FEE2E2', color: '#991B1B' }}>{t('forum.tag.bug')}</span>
                  <a href="/forum">{t('forum.post4.title')}</a>
                </div>
                <div className="discussion-meta">
                  <span><span className="author">Bob_QA</span> · 1d ago</span>
                </div>
                <div className="discussion-excerpt">After updating to Safari 17, the analytics dashboard charts fail to render. Console shows WebGL context errors...</div>
              </div>
              <div className="discussion-stats">
                <span className="stat-count">12</span>
                <span className="stat-label">{t('forum.replies')}</span>
                <div className="last-reply">
                  <span className="last-reply-avatar" style={{ background: '#3B82F6' }}>S</span>
                </div>
              </div>
            </li>

            {/* Discussion 5 */}
            <li className="discussion-item">
              <div className="discussion-avatar" style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>D</div>
              <div className="discussion-content">
                <div className="discussion-title">
                  <span className="discussion-tag" style={{ background: '#D1FAE5', color: '#065F46' }}>{t('forum.tag.install')}</span>
                  <a href="/forum">{t('forum.post5.title')}</a>
                </div>
                <div className="discussion-meta">
                  <span><span className="author">David_Ops</span> · 2d ago</span>
                </div>
                <div className="discussion-excerpt">I wrote up a detailed guide for installing GCSS on a fresh Ubuntu 22.04 server with Docker, including SSL setup and Nginx reverse proxy...</div>
              </div>
              <div className="discussion-stats">
                <span className="stat-count">67</span>
                <span className="stat-label">{t('forum.replies')}</span>
                <div className="last-reply">
                  <span className="last-reply-avatar" style={{ background: '#8B5CF6' }}>L</span>
                </div>
              </div>
            </li>

            {/* Discussion 6 */}
            <li className="discussion-item">
              <div className="discussion-avatar" style={{ background: 'linear-gradient(135deg,#06B6D4,#0891B2)' }}>T</div>
              <div className="discussion-content">
                <div className="discussion-title">
                  <span className="discussion-tag" style={{ background: '#CFFAFE', color: '#155E75' }}>{t('forum.tag.ocpp')}</span>
                  <a href="/forum">OCPP 1.6 RemoteStartTransaction not working with certain chargers</a>
                </div>
                <div className="discussion-meta">
                  <span><span className="author">Tom_OCPP</span> · 3d ago</span>
                </div>
                <div className="discussion-excerpt">I&apos;m having trouble with RemoteStartTransaction on Wallbox Pulsar Plus chargers. The command times out after 30s...</div>
              </div>
              <div className="discussion-stats">
                <span className="stat-count">18</span>
                <span className="stat-label">{t('forum.replies')}</span>
                <div className="last-reply">
                  <span className="last-reply-avatar" style={{ background: '#EF4444' }}>R</span>
                </div>
              </div>
            </li>

            {/* Discussion 7 */}
            <li className="discussion-item">
              <div className="discussion-avatar" style={{ background: 'linear-gradient(135deg,#EC4899,#DB2777)' }}>S</div>
              <div className="discussion-content">
                <div className="discussion-title">
                  <span className="discussion-tag" style={{ background: '#FCE7F3', color: '#9D174D' }}>{t('forum.tag.payment')}</span>
                  <a href="/forum">Integrating M-PESA for East African markets — step by step</a>
                </div>
                <div className="discussion-meta">
                  <span><span className="author">Sarah_Pay</span> · 4d ago</span>
                </div>
                <div className="discussion-excerpt">I successfully integrated M-PESA for our charging network in Kenya. Here&apos;s the complete walkthrough including API setup...</div>
              </div>
              <div className="discussion-stats">
                <span className="stat-count">31</span>
                <span className="stat-label">{t('forum.replies')}</span>
                <div className="last-reply">
                  <span className="last-reply-avatar" style={{ background: '#10B981' }}>P</span>
                </div>
              </div>
            </li>

            {/* Discussion 8 */}
            <li className="discussion-item">
              <div className="discussion-avatar" style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)' }}>U</div>
              <div className="discussion-content">
                <div className="discussion-title">
                  <span className="discussion-tag" style={{ background: '#FEF3C7', color: '#92400E' }}>{t('forum.tag.usage')}</span>
                  <a href="/forum">How I scaled from 10 to 500 chargers using GCSS B2C platform</a>
                </div>
                <div className="discussion-meta">
                  <span><span className="author">Uma_Scale</span> · 5d ago</span>
                </div>
                <div className="discussion-excerpt">Sharing our journey of scaling our charging network in Bangkok from a small pilot to a profitable 500-charger operation...</div>
              </div>
              <div className="discussion-stats">
                <span className="stat-count">89</span>
                <span className="stat-label">{t('forum.replies')}</span>
                <div className="last-reply">
                  <span className="last-reply-avatar" style={{ background: '#3B82F6' }}>W</span>
                </div>
              </div>
            </li>

          </ul>

          {/* Load More */}
          <div className="forum-load-more">
            <button>{t('forum.loadmore')}</button>
          </div>
        </div>

      </div>

      {/* Mobile sidebar toggle */}
      <button
        className="forum-mobile-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>
      {sidebarOpen && (
        <div className="forum-sidebar-overlay open" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  );
}
