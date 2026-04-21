'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import ScrollAnimation from '@/components/effects/ScrollAnimation';
import MarkdownEditor from '@/components/ui/MarkdownEditor';
import { Link, useRouter } from '@/i18n/navigation';
import { apiMe, getAuthToken, isAuthApiEnabled, setAuthToken, type AuthUser } from '@/lib/api/authApi';
import {
    apiCreateForumTopic,
    apiListForumCategories,
    apiUploadImage,
    type ApiForumCategory,
} from '@/lib/api/contentApi';
import { listStaticForumCategories } from '@/lib/content/staticContent';

function uniqLower(tags: string[]) {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const t of tags) {
        const k = t.trim().toLowerCase();
        if (!k) continue;
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(k);
    }
    return out;
}

export default function NewTopicPage() {
    const locale = useLocale();
    const t = useTranslations();
    const router = useRouter();

    const allowPost = ['1', 'true', 'yes'].includes((process.env.NEXT_PUBLIC_FORMS_API || '').toLowerCase());
    const authEnabled = isAuthApiEnabled();

    const [authLoading, setAuthLoading] = useState(authEnabled);
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

    const [categories, setCategories] = useState<ApiForumCategory[]>(() => listStaticForumCategories(locale));
    const [loadingCats, setLoadingCats] = useState(false);

    const [categorySlug, setCategorySlug] = useState('');
    const [topicType, setTopicType] = useState<'question' | 'discussion' | 'announcement'>('discussion');
    const [title, setTitle] = useState('');
    const [bodyMd, setBodyMd] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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

    useEffect(() => {
        let cancelled = false;
        async function run() {
            setLoadingCats(true);
            try {
                const data = await apiListForumCategories(locale);
                if (!cancelled) setCategories(data);
            } catch {
                if (!cancelled) setCategories(listStaticForumCategories(locale));
            } finally {
                if (!cancelled) setLoadingCats(false);
            }
        }
        void run();
        return () => {
            cancelled = true;
        };
    }, [locale]);

    useEffect(() => {
        if (categorySlug) return;
        if (categories.length) setCategorySlug(categories[0]?.slug || '');
    }, [categories, categorySlug]);

    const canSubmit = useMemo(() => {
        if (!allowPost) return false;
        if (submitting) return false;
        if (authEnabled && (authLoading || !currentUser)) return false;
        if (!categorySlug.trim()) return false;
        if (!title.trim()) return false;
        if (!bodyMd.trim()) return false;
        return true;
    }, [allowPost, submitting, authEnabled, authLoading, currentUser, categorySlug, title, bodyMd]);

    function addTagsFromInput() {
        const raw = tagInput
            .split(/[,\n]/g)
            .map((x) => x.trim())
            .filter(Boolean);
        if (!raw.length) return;
        setTags((prev) => uniqLower([...prev, ...raw]));
        setTagInput('');
    }

    function removeTag(tag: string) {
        setTags((prev) => prev.filter((x) => x !== tag));
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!allowPost) return;
        setError(null);
        setSuccess(null);

        if (authEnabled && !currentUser) {
            setError(t('forum.new.loginToPost'));
            return;
        }

        setSubmitting(true);
        try {
            const res = await apiCreateForumTopic({
                locale,
                categorySlug,
                title: title.trim(),
                bodyMd: bodyMd.trim(),
                topicType,
                tags,
            });

            setSuccess(t('forum.new.created'));
            // Navigate to a stable, export-friendly thread view
            router.push(`/forum/thread?c=${encodeURIComponent(res.topic.categorySlug)}&t=${encodeURIComponent(res.topic.slug)}`);
        } catch (e2) {
            setError(e2 instanceof Error ? e2.message : t('forum.new.failed'));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <section className="forum-hero">
                <div className="forum-topic-inner">
                    <ScrollAnimation>
                        <h1 className="forum-topic-title">{t('forum.new.title')}</h1>
                        <p className="forum-topic-subtitle">{t('forum.new.subtitle')}</p>
                    </ScrollAnimation>
                </div>
            </section>

            <div className="forum-container">
                <div className="forum-main forum-topic-main">
                    <div className="forum-topic-inner">
                        <div className="forum-topic-back">
                            <Link href="/forum" className="read-more">
                                <span className="blog-post-back-arrow">←</span>
                                <span>{t('forum.new.back')}</span>
                            </Link>
                        </div>

                        <div className="discussion-item forum-newtopic">
                            <div className="discussion-content">
                                <form className="forum-newtopic-form" onSubmit={submit}>
                                    <div className="forum-newtopic-row">
                                        <div className="form-group forum-newtopic-compact">
                                            <label className="form-label" htmlFor="newtopic-category">{t('forum.new.category')}</label>
                                            <select
                                                id="newtopic-category"
                                                className="form-input"
                                                value={categorySlug}
                                                onChange={(e) => setCategorySlug(e.target.value)}
                                                disabled={loadingCats || submitting}
                                            >
                                                {categories.map((c) => (
                                                    <option key={c.slug} value={c.slug}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group forum-newtopic-compact">
                                            <label className="form-label" htmlFor="newtopic-type">{t('forum.new.type')}</label>
                                            <select
                                                id="newtopic-type"
                                                className="form-input"
                                                value={topicType}
                                                onChange={(e) => setTopicType(e.target.value as any)}
                                                disabled={submitting}
                                            >
                                                <option value="discussion">{t('forum.new.typeOptions.discussion')}</option>
                                                <option value="question">{t('forum.new.typeOptions.question')}</option>
                                                <option value="announcement">{t('forum.new.typeOptions.announcement')}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="newtopic-title">{t('forum.new.topicTitle')}</label>
                                        <input
                                            id="newtopic-title"
                                            className="form-input"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder={t('forum.new.titlePlaceholder')}
                                            disabled={submitting}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="newtopic-labels">{t('forum.new.labels')}</label>
                                        <div className="forum-newtopic-tags">
                                            {tags.map((tag) => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    className="forum-newtopic-tag"
                                                    onClick={() => removeTag(tag)}
                                                    title={t('forum.new.removeLabel')}
                                                >
                                                    <span>#{tag}</span>
                                                    <span className="forum-newtopic-tag-x">×</span>
                                                </button>
                                            ))}
                                            <input
                                                id="newtopic-labels"
                                                className="forum-newtopic-tag-input"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ',') {
                                                        e.preventDefault();
                                                        addTagsFromInput();
                                                    }
                                                }}
                                                placeholder={t('forum.new.labelsPlaceholder')}
                                                disabled={submitting}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-secondary forum-newtopic-addtag"
                                                onClick={addTagsFromInput}
                                                disabled={submitting || !tagInput.trim()}
                                            >
                                                {t('forum.new.addLabel')}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{t('forum.new.body')}</label>
                                        <MarkdownEditor
                                            id="newtopic-body"
                                            value={bodyMd}
                                            onChange={setBodyMd}
                                            placeholder={t('forum.new.bodyPlaceholder')}
                                            disabled={submitting || (authEnabled && !currentUser)}
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
                                    </div>

                                    {authEnabled && !currentUser ? (
                                        <div className="forum-newtopic-auth">
                                            {authLoading ? (
                                                <span className="muted">{t('forum.topic.authLoading')}</span>
                                            ) : (
                                                <span className="muted">
                                                    {t('forum.new.loginToPost')}{' '}
                                                    <Link href="/login" className="forum-composer-login-link">
                                                        {t('forum.topic.login')}
                                                    </Link>
                                                </span>
                                            )}
                                        </div>
                                    ) : null}

                                    {error ? <div className="forum-topic-error">{error}</div> : null}
                                    {success ? <div className="forum-newtopic-success">{success}</div> : null}

                                    <div className="forum-newtopic-actions">
                                        <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
                                            {submitting ? t('forum.new.creating') : t('forum.new.create')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
