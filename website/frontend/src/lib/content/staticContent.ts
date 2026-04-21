import type { ApiBlogPost, ApiForumCategory, ApiForumPost, ApiForumTopic } from '@/lib/api/contentApi';

type Locale = 'en' | 'zh';

function normLocale(locale: string): Locale {
    const l = (locale || '').toLowerCase();
    return l.startsWith('zh') ? 'zh' : 'en';
}

type Localized<T> = { en: T; zh: T };

const blogSeed: Array<{
    slug: string;
    authorName: string;
    publishedAt: string;
    tags: string[];
    i18n: Localized<{ title: string; excerpt: string; contentMd: string }>;
}> = [
        {
            slug: 'gcss-v2-operations-stack',
            authorName: 'GCSS Team',
            publishedAt: '2026-04-01T09:00:00Z',
            tags: ['product', 'operations'],
            i18n: {
                en: {
                    title: 'GCSS v2: A Smarter EV Charging Operations Stack',
                    excerpt: "From multi-tenant dashboards to payments—what’s new in v2 and why operators care.",
                    contentMd:
                        "## Highlights\n\n- Faster operator workflows\n- Cleaner alerting\n- A more flexible partner layer\n\n## Why it matters\n\nOperators don’t need *more* screens — they need fewer clicks and clearer answers. GCSS v2 focuses on operational clarity: better device health visibility, smarter ticket triage, and a data model that scales across tenants.\n\n## What’s next\n\nWe’re expanding integrations (OCPP 1.6/2.0.1), adding payment partners, and continuing to polish the UI for field teams.",
                },
                zh: {
                    title: 'GCSS v2：更智能的充电运营系统',
                    excerpt: '从多租户管理到支付合作伙伴——v2 的关键升级与运营价值。',
                    contentMd:
                        '## 关键升级\n\n- 运营流程更快\n- 告警更清晰\n- 合作伙伴能力更灵活\n\n## 为什么重要\n\n运营团队不需要*更多*页面，而是更少的点击与更明确的答案。GCSS v2 聚焦运营清晰度：设备健康更可见、工单分流更智能、数据模型可扩展到多租户。\n\n## 接下来\n\n我们将继续扩展集成（OCPP 1.6/2.0.1）、新增支付合作伙伴，并持续打磨面向现场团队的体验。',
                },
            },
        },
        {
            slug: 'ocpp-diagnostics-playbook',
            authorName: 'Operations',
            publishedAt: '2026-04-06T09:00:00Z',
            tags: ['ocpp', 'diagnostics'],
            i18n: {
                en: {
                    title: 'OCPP Diagnostics Playbook: From Noise to Signal',
                    excerpt: 'A practical checklist for reducing false alarms while catching the real failures.',
                    contentMd:
                        "## The problem\n\nMany networks drown in alerts. A connector flaps, a modem resets, and suddenly your ops team is firefighting all day.\n\n## A simple approach\n\n1. **Group** by site and charger model\n2. **Deduplicate** repeated faults within a time window\n3. **Escalate** only when *impact* is proven (sessions failing, payments failing)\n\n## Metrics to track\n\n- Mean time to acknowledge (MTTA)\n- Mean time to repair (MTTR)\n- Alert-to-incident ratio\n",
                },
                zh: {
                    title: 'OCPP 诊断手册：从噪声到信号',
                    excerpt: '用一套可执行的清单，减少误报，同时抓住真正的故障。',
                    contentMd:
                        '## 问题\n\n很多网络被告警淹没：枪口抖动、通讯重连、重复故障……运营团队整天在救火。\n\n## 一个简单方法\n\n1. 按站点与设备型号**分组**\n2. 在时间窗内对重复故障**去重**\n3. 只有当影响被验证（充电失败、支付失败）时才**升级**\n\n## 建议指标\n\n- 平均响应时间（MTTA）\n- 平均修复时间（MTTR）\n- 告警/事件比例\n',
                },
            },
        },
        {
            slug: 'payments-partners-expansion',
            authorName: 'Partnerships',
            publishedAt: '2026-04-11T09:00:00Z',
            tags: ['payments', 'partners'],
            i18n: {
                en: {
                    title: 'Expanding Payment Partners: What to Ask Before You Integrate',
                    excerpt: 'A short list of questions that save weeks during rollout.',
                    contentMd:
                        "## Before you integrate\n\nAsk these early:\n\n- Does the provider support **tokenization**?\n- What are the **settlement** timelines per region?\n- How do you handle **refunds** and partial captures?\n\n## GCSS approach\n\nWe treat payments as a partner layer so operators can add new methods without rebuilding the core platform.",
                },
                zh: {
                    title: '支付合作伙伴扩展：集成前先问清这几件事',
                    excerpt: '一些关键问题，可以在上线时省下数周时间。',
                    contentMd:
                        '## 集成前\n\n建议尽早确认：\n\n- 是否支持**Token 化**？\n- 各地区的**结算**周期？\n- **退款**与部分扣款如何处理？\n\n## GCSS 的方式\n\n我们把支付当作合作伙伴层来处理，运营商可以更轻松地新增支付方式，而不需要重建核心平台。',
                },
            },
        },
    ];

const forumCategoriesSeed: Array<{ slug: string; i18n: Localized<{ name: string; description: string }> }> = [
    {
        slug: 'operations',
        i18n: {
            en: { name: 'Operations', description: 'Runbooks, alerts, uptime, and field workflows.' },
            zh: { name: '运营', description: '运维手册、告警、可用性与现场流程。' },
        },
    },
    {
        slug: 'integrations',
        i18n: {
            en: { name: 'Integrations', description: 'OCPP, payments, roaming, and partner APIs.' },
            zh: { name: '集成', description: 'OCPP、支付、漫游与合作伙伴 API。' },
        },
    },
];

const forumTopicsSeed: Array<{
    categorySlug: string;
    slug: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    i18n: Localized<{ title: string; bodyMd: string }>;
    posts: Array<{
        id: number;
        authorName: string;
        createdAt: string;
        likeCount: number;
        parentId?: number;
        i18n: Localized<{ bodyMd: string }>;
    }>;
}> = [
        {
            categorySlug: 'operations',
            slug: 'reducing-alert-noise',
            authorName: 'NOC',
            createdAt: '2026-04-06T10:00:00Z',
            updatedAt: '2026-04-06T12:00:00Z',
            tags: ['alerts', 'uptime'],
            i18n: {
                en: {
                    title: 'How do you reduce alert noise without missing real outages?',
                    bodyMd:
                        'We’re seeing repeated connector faults and transient modem drops. What rules do you apply for dedupe and escalation?',
                },
                zh: {
                    title: '如何降低告警噪声，同时不漏掉真实故障？',
                    bodyMd: '我们遇到大量重复的枪口故障与短暂的通信掉线。大家通常如何做去重与升级规则？',
                },
            },
            posts: [
                {
                    id: 1,
                    authorName: 'NOC',
                    createdAt: '2026-04-06T10:00:00Z',
                    likeCount: 3,
                    i18n: {
                        en: {
                            bodyMd:
                                'We currently group by **site + charger model** and dedupe within 15 minutes. Still noisy. Any better patterns?',
                        },
                        zh: { bodyMd: '我们目前按**站点 + 设备型号**分组，在 15 分钟内去重，但依然很吵。有没有更好的做法？' },
                    },
                },
                {
                    id: 2,
                    authorName: 'Ops Lead',
                    createdAt: '2026-04-06T12:00:00Z',
                    likeCount: 5,
                    parentId: 1,
                    i18n: {
                        en: { bodyMd: 'We only page when **sessions fail** (impact-based). Everything else becomes a ticket with a daily triage.' },
                        zh: { bodyMd: '我们只在**充电会话失败**（有明确影响）时触发值班通知，其余告警转工单，每日统一分诊。' },
                    },
                },
            ],
        },
        {
            categorySlug: 'integrations',
            slug: 'ocpp-2-0-1-migration',
            authorName: 'Integrations',
            createdAt: '2026-04-07T10:00:00Z',
            updatedAt: '2026-04-07T10:00:00Z',
            tags: ['ocpp', 'roadmap'],
            i18n: {
                en: {
                    title: 'OCPP 2.0.1 migration strategy for mixed fleets',
                    bodyMd: 'If your network has both 1.6 and 2.0.1 devices, what’s your rollout strategy?',
                },
                zh: { title: '混合车队下的 OCPP 2.0.1 迁移策略', bodyMd: '当网络同时有 1.6 与 2.0.1 设备时，大家通常如何制定上线策略？' },
            },
            posts: [
                {
                    id: 3,
                    authorName: 'Integrations',
                    createdAt: '2026-04-07T10:00:00Z',
                    likeCount: 2,
                    i18n: {
                        en: { bodyMd: 'We’re considering per-model enablement and shadow-mode monitoring. Curious how others do it.' },
                        zh: { bodyMd: '我们考虑按型号逐步启用，并先做影子模式监控。想听听其他人的经验。' },
                    },
                },
            ],
        },
    ];

export const staticBlogSlugs = blogSeed.map((p) => p.slug);
export const staticForumParams = forumTopicsSeed.map((t) => ({ categorySlug: t.categorySlug, topicSlug: t.slug }));

export function listStaticBlogPosts(locale: string): ApiBlogPost[] {
    const l = normLocale(locale);
    return blogSeed
        .map((p) => ({
            slug: p.slug,
            title: p.i18n[l].title,
            excerpt: p.i18n[l].excerpt,
            contentMd: p.i18n[l].contentMd,
            authorName: p.authorName,
            publishedAt: p.publishedAt,
            tags: p.tags,
        }))
        .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getStaticBlogPost(locale: string, slug: string): ApiBlogPost | null {
    const l = normLocale(locale);
    const p = blogSeed.find((x) => x.slug === slug);
    if (!p) return null;
    return {
        slug: p.slug,
        title: p.i18n[l].title,
        excerpt: p.i18n[l].excerpt,
        contentMd: p.i18n[l].contentMd,
        authorName: p.authorName,
        publishedAt: p.publishedAt,
        tags: p.tags,
    };
}

export function listStaticForumCategories(locale: string): ApiForumCategory[] {
    const l = normLocale(locale);
    return forumCategoriesSeed.map((c) => ({ slug: c.slug, name: c.i18n[l].name, description: c.i18n[l].description }));
}

export function listStaticForumTopics(locale: string, category?: string): ApiForumTopic[] {
    const l = normLocale(locale);
    const topics = forumTopicsSeed
        .filter((t) => (!category || category === 'all' ? true : t.categorySlug === category))
        .map((t) => ({
            categorySlug: t.categorySlug,
            slug: t.slug,
            title: t.i18n[l].title,
            bodyMd: t.i18n[l].bodyMd,
            authorName: t.authorName,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            tags: t.tags,
            replyCount: Math.max(0, t.posts.length - 1),
        }));
    return topics.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getStaticForumTopic(locale: string, categorySlug: string, topicSlug: string): { topic: ApiForumTopic; posts: ApiForumPost[] } | null {
    const l = normLocale(locale);
    const t = forumTopicsSeed.find((x) => x.categorySlug === categorySlug && x.slug === topicSlug);
    if (!t) return null;
    const topic: ApiForumTopic = {
        categorySlug: t.categorySlug,
        slug: t.slug,
        title: t.i18n[l].title,
        bodyMd: t.i18n[l].bodyMd,
        authorName: t.authorName,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        tags: t.tags,
        replyCount: Math.max(0, t.posts.length - 1),
    };
    const posts: ApiForumPost[] = t.posts.map((p) => ({
        id: p.id,
        authorName: p.authorName,
        createdAt: p.createdAt,
        bodyMd: p.i18n[l].bodyMd,
        likeCount: p.likeCount,
        parentId: p.parentId,
    }));
    return { topic, posts };
}
