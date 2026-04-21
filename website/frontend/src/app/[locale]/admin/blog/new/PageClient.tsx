'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { getAuthToken } from '@/lib/api/authApi';
import { apiAdminCreateBlogPost } from '@/lib/api/adminApi';
import BlogEditor from '../BlogEditor';

export default function NewBlogPostPage() {
    const t = useTranslations('adminBlog');
    const defaultLocale = useLocale();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [locale, setLocale] = useState(defaultLocale);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    const handleSave = async (post: Parameters<typeof apiAdminCreateBlogPost>[1], publish: boolean) => {
        const token = getAuthToken();
        if (!token) return;
        setSaving(true);
        setMsg(null);
        try {
            post.status = publish ? 'published' : 'draft';
            const created = await apiAdminCreateBlogPost(token, post);
            setMsg({ type: 'success', text: publish ? t('postPublished') : t('draftSaved') });
            setTimeout(() => router.push(`/admin/blog/edit/${created.slug}`), 1000);
        } catch (err) {
            setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save' });
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || !user) return null;

    return (
        <div className="dashboard-page">
            <div className="dashboard-inner" style={{ maxWidth: 1100 }}>
                <Link href="/admin/blog" className="blog-article-back" style={{ marginBottom: 16 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                    {t('backToAdmin')}
                </Link>
                <h1 className="dashboard-profile-name">{t('newPost')}</h1>
                {msg && <div className={`form-banner form-banner--${msg.type}`}>{msg.text}</div>}
                <BlogEditor
                    locale={locale}
                    onLocaleChange={setLocale}
                    onSave={handleSave}
                    saving={saving}
                />
            </div>
        </div>
    );
}
