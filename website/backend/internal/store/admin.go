package store

import (
	"context"
	"time"
)

type AdminOverview struct {
	UsersTotal        int `json:"usersTotal"`
	AdminsTotal       int `json:"adminsTotal"`
	SessionsActive    int `json:"sessionsActive"`
	FormRequestsTotal int `json:"formRequestsTotal"`
	BlogPostsTotal    int `json:"blogPostsTotal"`
	ForumTopicsTotal  int `json:"forumTopicsTotal"`
	ForumPostsTotal   int `json:"forumPostsTotal"`
}

func (s *Store) GetAdminOverview(ctx context.Context) (AdminOverview, error) {
	var out AdminOverview
	if s == nil || s.db == nil {
		return out, ErrUnauthorized
	}

	now := time.Now().UTC().Format(time.RFC3339)

	if err := s.db.QueryRowContext(ctx, `SELECT COUNT(1) FROM users;`).Scan(&out.UsersTotal); err != nil {
		return out, err
	}
	if err := s.db.QueryRowContext(ctx, `SELECT COUNT(1) FROM users WHERE role = 'admin';`).Scan(&out.AdminsTotal); err != nil {
		return out, err
	}
	if err := s.db.QueryRowContext(ctx, `
		SELECT COUNT(1)
		FROM sessions
		WHERE revoked_at IS NULL
		  AND expires_at > ?;
	`, now).Scan(&out.SessionsActive); err != nil {
		return out, err
	}
	if err := s.db.QueryRowContext(ctx, `SELECT COUNT(1) FROM form_requests;`).Scan(&out.FormRequestsTotal); err != nil {
		return out, err
	}
	if err := s.db.QueryRowContext(ctx, `SELECT COUNT(1) FROM blog_posts;`).Scan(&out.BlogPostsTotal); err != nil {
		return out, err
	}
	if err := s.db.QueryRowContext(ctx, `SELECT COUNT(1) FROM forum_topics;`).Scan(&out.ForumTopicsTotal); err != nil {
		return out, err
	}
	if err := s.db.QueryRowContext(ctx, `SELECT COUNT(1) FROM forum_posts;`).Scan(&out.ForumPostsTotal); err != nil {
		return out, err
	}

	return out, nil
}
