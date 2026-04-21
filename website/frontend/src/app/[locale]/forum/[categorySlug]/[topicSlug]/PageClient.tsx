'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLocale, useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import { Link } from '@/i18n/navigation';
import MarkdownEditor from '@/components/ui/MarkdownEditor';
import { apiMe, getAuthToken, isAuthApiEnabled, setAuthToken, type AuthUser } from '@/lib/api/authApi';
import {
    apiGetForumTopic,
    apiPostForumReply,
    apiUploadImage,
    apiVoteForumPost,
    type ApiForumPost,
    type ApiForumTopic,
} from '@/lib/api/contentApi';
import { getStaticForumTopic } from '@/lib/content/staticContent';

function formatDateTime(iso: string, locale: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function ForumTopicPage({
    categorySlug,
    topicSlug,
}: {
    categorySlug: string;
    topicSlug: string;
}) {
    const locale = useLocale();
    const t = useTranslations();

    const staticThread = useMemo(
        () => getStaticForumTopic(locale, categorySlug, topicSlug),
        [locale, categorySlug, topicSlug],
    );

    const [topic, setTopic] = useState<ApiForumTopic | null>(staticThread?.topic ?? null);
    const [posts, setPosts] = useState<ApiForumPost[]>(staticThread?.posts ?? []);
    const [loading, setLoading] = useState(!staticThread);
    const [error, setError] = useState<string | null>(null);

    const [replyBody, setReplyBody] = useState('');
    const [replying, setReplying] = useState(false);
    const [replyParent, setReplyParent] = useState<{ id: number; authorName: string } | null>(null);
    const [votingPostIds, setVotingPostIds] = useState<Set<number>>(() => new Set());
    const allowPost = ['1', 'true', 'yes'].includes((process.env.NEXT_PUBLIC_FORMS_API || '').toLowerCase());

    const authEnabled = isAuthApiEnabled();
    const [authLoading, setAuthLoading] = useState(authEnabled);
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadMe() {
            if (!authEnabled) {
                setAuthLoading(false);
                setCurrentUser(null);
                return;
            }

            const token = getAuthToken();
            if (!token) {
                setAuthLoading(false);
                setCurrentUser(null);
                return;
            }

            setAuthLoading(true);
            try {
                const { user } = await apiMe(token);
                if (!cancelled) setCurrentUser(user);
            } catch {
                // Token likely expired/invalid.
                setAuthToken(null);
                if (!cancelled) setCurrentUser(null);
            } finally {
                if (!cancelled) setAuthLoading(false);
            }
        }

        void loadMe();
        return () => {
            cancelled = true;
        };
    }, [authEnabled]);

    const effectiveAuthorName = currentUser?.username || (authEnabled ? '' : 'Guest');
    const canReply = allowPost && !replying && (!authEnabled || (!authLoading && !!currentUser));

    const postTree = useMemo(() => {
        const byId = new Map<number, ApiForumPost>();
        const children = new Map<number | null, ApiForumPost[]>();

        for (const p of posts) {
            byId.set(p.id, p);
            const parentKey = typeof p.parentId === 'number' ? p.parentId : null;
            const arr = children.get(parentKey) ?? [];
            arr.push(p);
            children.set(parentKey, arr);
        }

        for (const arr of children.values()) {
            arr.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
        }

        return { byId, children };
    }, [posts]);

    async function loadThread() {
        setLoading(true);
        setError(null);
        try {
            const data = await apiGetForumTopic(locale, categorySlug, topicSlug);
            setTopic(data.topic);
            setPosts(data.posts);
        } catch (e) {
            if (staticThread) {
                setTopic(staticThread.topic);
                setPosts(staticThread.posts);
            } else {
                setError(e instanceof Error ? e.message : 'Failed to load');
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadThread();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale, categorySlug, topicSlug]);

    async function submitReply(e: React.FormEvent) {
        e.preventDefault();
        if (!allowPost) return;
        if (authEnabled && !currentUser) {
            setError(t('forum.topic.loginToReply'));
            return;
        }
        if (!replyBody.trim()) return;

        setReplying(true);
        setError(null);
        try {
            await apiPostForumReply({
                locale,
                categorySlug,
                topicSlug,
                authorName: effectiveAuthorName || undefined,
                bodyMd: replyBody.trim(),
                parentId: replyParent?.id,
            });
            setReplyBody('');
            setReplyParent(null);
            await loadThread();
        } catch (e2) {
            setError(e2 instanceof Error ? e2.message : 'Failed to post');
        } finally {
            setReplying(false);
        }
    }

    function clearReply() {
        if (replying) return;
        setReplyBody('');
        setReplyParent(null);
        setError(null);
    }

    function beginReplyTo(p: ApiForumPost) {
        setReplyParent({ id: p.id, authorName: p.authorName || 'Guest' });
        // Best-effort focus
        setTimeout(() => {
            const el = document.getElementById('forum-reply-editor');
            if (el && 'focus' in el) (el as HTMLTextAreaElement).focus();
        }, 0);
    }

    async function votePost(postId: number, delta: 1 | -1) {
        if (votingPostIds.has(postId)) return;

        // Optimistic UI update
        setVotingPostIds((prev) => new Set(prev).add(postId));
        setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likeCount: Math.max(0, (p.likeCount || 0) + delta) } : p)));

        try {
            const res = await apiVoteForumPost(postId, delta);
            setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likeCount: res.likeCount } : p)));
        } catch (e2) {
            // revert on failure
            setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likeCount: Math.max(0, (p.likeCount || 0) - delta) } : p)));
            setError(e2 instanceof Error ? e2.message : 'Failed to vote');
        } finally {
            setVotingPostIds((prev) => {
                const next = new Set(prev);
                next.delete(postId);
                return next;
            });
        }
    }

    function renderComment(p: ApiForumPost, depth: number) {
        const kids = postTree.children.get(p.id) ?? [];

        return (
            <li key={p.id} className={`discussion-item forum-comment${depth > 0 ? ' is-child' : ''}`}>
                <div className="forum-vote" aria-label={t('forum.topic.vote')}>
                    <button
                        type="button"
                        className="forum-vote-btn"
                        onClick={() => votePost(p.id, 1)}
                        disabled={votingPostIds.has(p.id)}
                        aria-label={t('forum.topic.upvote')}
                    >
                        ▲
                    </button>
                    <div className="forum-vote-count" aria-label={t('forum.topic.score')}>
                        {p.likeCount}
                    </div>
                    <button
                        type="button"
                        className="forum-vote-btn"
                        onClick={() => votePost(p.id, -1)}
                        disabled={votingPostIds.has(p.id) || p.likeCount <= 0}
                        aria-label={t('forum.topic.downvote')}
                    >
                        ▼
                    </button>
                </div>

                <div className="discussion-avatar forum-avatar-blue forum-comment-avatar">
                    {p.authorName?.slice(0, 1)?.toUpperCase() || 'G'}
                </div>
                <div className="discussion-content">
                    <div className="discussion-meta forum-topic-meta">
                        <span>
                            <span className="author">{p.authorName}</span> · {formatDateTime(p.createdAt, locale)}
                        </span>
                    </div>
                    <div className="docs-content forum-topic-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.bodyMd}</ReactMarkdown>
                    </div>

                    <div className="forum-comment-actions">
                        <button type="button" className="forum-comment-action" onClick={() => beginReplyTo(p)}>
                            {t('forum.topic.reply')}
                        </button>
                    </div>

                    {kids.length ? <ul className="forum-comment-children">{kids.map((k) => renderComment(k, depth + 1))}</ul> : null}
                </div>
            </li>
        );
    }

    return (
        <>
            <section className="forum-hero">
                <div className="forum-topic-inner">
                    <ScrollAnimation>
                        <h1 className="forum-topic-title">{topic?.title ?? t('forum.topic.loading')}</h1>
                        <p className="forum-topic-subtitle">{t('forum.hero.desc')}</p>
                    </ScrollAnimation>
                </div>
            </section>

            <div className="forum-container">
                <div className="forum-main forum-topic-main">
                    <div className="forum-topic-inner">
                        <div className="forum-topic-back">
                            <Link href="/forum" className="read-more">
                                <span className="blog-post-back-arrow">←</span>
                                <span>{t('forum.topic.back')}</span>
                            </Link>
                        </div>

                        {loading ? (
                            <div className="muted">{t('forum.topic.loading')}</div>
                        ) : topic ? (
                            <div className="forum-topic-grid">
                                <div className="discussion-item forum-topic-op">
                                    <div className="discussion-avatar forum-avatar-gold">G</div>
                                    <div className="discussion-content">
                                        <div className="discussion-meta forum-topic-meta">
                                            <span>
                                                <span className="author">{topic.authorName}</span> · {formatDateTime(topic.createdAt, locale)}
                                            </span>
                                        </div>
                                        <div className="docs-content forum-topic-markdown">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{topic.bodyMd}</ReactMarkdown>
                                        </div>
                                    </div>
                                    <div className="discussion-stats">
                                        <span className="stat-count">{topic.replyCount}</span>
                                        <span className="stat-label">{t('forum.replies')}</span>
                                    </div>
                                </div>

                                <ul className="discussion-list forum-topic-posts">
                                    {(postTree.children.get(null) ?? posts.filter((p) => typeof p.parentId !== 'number')).map((p) => renderComment(p, 0))}
                                </ul>

                                {allowPost ? (
                                    <div className="discussion-item forum-composer" aria-label={t('forum.topic.reply')}>
                                        <div className="discussion-avatar forum-avatar-blue forum-composer-avatar">
                                            {(effectiveAuthorName.trim().slice(0, 1) || 'G').toUpperCase()}
                                        </div>

                                        <div className="discussion-content">
                                            <div className="forum-composer-header">
                                                <span className="section-label">{t('forum.topic.reply')}</span>
                                            </div>

                                            <form className="forum-composer-form" onSubmit={submitReply}>
                                                {replyParent ? (
                                                    <div className="forum-replying-to">
                                                        <span>
                                                            {t('forum.topic.replyingTo')} <strong>{replyParent.authorName}</strong>
                                                        </span>
                                                        <button type="button" className="forum-replying-cancel" onClick={() => setReplyParent(null)}>
                                                            {t('forum.topic.cancelReply')}
                                                        </button>
                                                    </div>
                                                ) : null}

                                                <div className="forum-composer-meta">
                                                    {authEnabled ? (
                                                        authLoading ? (
                                                            <span className="forum-composer-hint">{t('forum.topic.authLoading')}</span>
                                                        ) : currentUser ? (
                                                            <div className="forum-composer-posting-as">
                                                                <span className="forum-composer-posting-as-label">{t('forum.topic.postingAs')}</span>{' '}
                                                                <strong className="forum-composer-posting-as-user">@{currentUser.username}</strong>
                                                            </div>
                                                        ) : (
                                                            <div className="forum-composer-posting-as">
                                                                <span className="forum-composer-hint">{t('forum.topic.loginToReply')}</span>{' '}
                                                                <Link href="/login" className="forum-composer-login-link">
                                                                    {t('forum.topic.login')}
                                                                </Link>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div className="forum-composer-posting-as">
                                                            <span className="forum-composer-posting-as-label">{t('forum.topic.postingAs')}</span>{' '}
                                                            <strong className="forum-composer-posting-as-user">@Guest</strong>
                                                        </div>
                                                    )}
                                                    <span className="forum-composer-hint">{t('forum.topic.markdownHint')}</span>
                                                </div>

                                                <MarkdownEditor
                                                    id="forum-reply-editor"
                                                    value={replyBody}
                                                    onChange={setReplyBody}
                                                    placeholder={t('forum.topic.replyPlaceholder')}
                                                    disabled={replying || (authEnabled && !currentUser)}
                                                    textareaClassName="forum-topic-textarea forum-composer-editor"
                                                    previewClassName="forum-composer-preview docs-content forum-topic-markdown"
                                                    uploadImage={
                                                        allowPost
                                                            ? async (file) => {
                                                                const res = await apiUploadImage(file);
                                                                return res.url;
                                                            }
                                                            : undefined
                                                    }
                                                    labels={{
                                                        write: t('forum.topic.write'),
                                                        preview: t('forum.topic.preview'),
                                                        previewEmpty: t('forum.topic.previewEmpty'),
                                                        markdownGuide: t('forum.topic.markdownGuide'),
                                                        uploading: t('forum.editor.uploading'),
                                                        uploadFailed: t('forum.editor.uploadFailed'),
                                                        insertLink: t('forum.editor.insertLink'),
                                                        insertImage: t('forum.editor.insertImage'),
                                                        undo: t('forum.editor.undo'),
                                                        redo: t('forum.editor.redo'),
                                                        heading: t('forum.editor.heading'),
                                                        bold: t('forum.editor.bold'),
                                                        italic: t('forum.editor.italic'),
                                                        inlineCode: t('forum.editor.inlineCode'),
                                                        bulletList: t('forum.editor.bulletList'),
                                                        numberedList: t('forum.editor.numberedList'),
                                                        table: t('forum.editor.table'),
                                                        mention: t('forum.editor.mention'),
                                                    }}
                                                />

                                                <div className="forum-composer-actions">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={clearReply}
                                                        disabled={replying || !replyBody.trim()}
                                                    >
                                                        {t('forum.topic.clear')}
                                                    </button>
                                                    <button type="submit" className="btn btn-primary" disabled={!canReply || !replyBody.trim()}>
                                                        {replying ? t('forum.topic.replying') : t('forum.topic.replySubmit')}
                                                    </button>
                                                </div>

                                                {error ? <div className="forum-topic-error">{error}</div> : null}
                                            </form>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className="muted">
                                {t('forum.topic.notFound')}
                                {error ? <div className="blog-post-error">{error}</div> : null}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
