export type AdminOverview = {
    usersTotal: number;
    adminsTotal: number;
    sessionsActive: number;
    formRequestsTotal: number;
    blogPostsTotal: number;
    forumTopicsTotal: number;
    forumPostsTotal: number;
};

function getApiBase(): string {
    return process.env.NEXT_PUBLIC_API_URL || '/api';
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...init,
        headers: {
            Accept: 'application/json',
            ...(init?.headers || {}),
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Request failed (${res.status})`);
    }

    return (await res.json()) as T;
}

export async function apiAdminOverview(token: string): Promise<{ overview: AdminOverview }> {
    const apiBase = getApiBase();
    return await fetchJson<{ overview: AdminOverview }>(`${apiBase}/admin/overview`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
}
