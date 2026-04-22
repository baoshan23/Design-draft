package store

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
	"time"
)

// UserServer represents one provisioned GCSS CPMS instance assigned to a user.
// The plaintext API key is NEVER stored — only its SHA-256 hash + last 4 chars.
type UserServer struct {
	ID                int64      `json:"id"`
	UserID            int64      `json:"userId"`
	OrderID           *int64     `json:"orderId,omitempty"`
	Region            string     `json:"region"`
	APIBaseURL        string     `json:"apiBaseUrl"`
	APIKeyLast4       string     `json:"apiKeyLast4"`
	OCPPEndpoint      string     `json:"ocppEndpoint"`
	WebhookURL        string     `json:"webhookUrl"`
	Status            string     `json:"status"`
	UptimePct         float64    `json:"uptimePct"`
	ConnectedChargers int        `json:"connectedChargers"`
	MaxChargers       int        `json:"maxChargers"`
	LastBackupAt      *time.Time `json:"lastBackupAt,omitempty"`
	Notes             string     `json:"notes"`
	CreatedAt         time.Time  `json:"createdAt"`
	UpdatedAt         time.Time  `json:"updatedAt"`
}

// generateAPIKey produces a 32-byte random token, base64url-encoded, prefixed
// with "gcss_" so it's self-identifying in logs. Returns (plaintext, sha256hash, last4).
func generateAPIKey() (plaintext, hashHex, last4 string, err error) {
	b := make([]byte, 32)
	if _, err = rand.Read(b); err != nil {
		return
	}
	plaintext = "gcss_" + base64.RawURLEncoding.EncodeToString(b)
	sum := sha256.Sum256([]byte(plaintext))
	hashHex = hex.EncodeToString(sum[:])
	if len(plaintext) >= 4 {
		last4 = plaintext[len(plaintext)-4:]
	}
	return
}

// EnsureUserServerForOrder creates a provisional server record for a paid
// order if one doesn't already exist. Returns (plaintextAPIKey, server, err).
// The plaintext key is returned ONCE at creation and never again.
func (s *Store) EnsureUserServerForOrder(ctx context.Context, userID, orderID int64, maxChargers int) (string, *UserServer, error) {
	// If a server is already linked to this order, reuse it (no new key).
	var existingID int64
	_ = s.db.QueryRowContext(ctx, `SELECT id FROM user_servers WHERE order_id = ? LIMIT 1;`, orderID).Scan(&existingID)
	if existingID > 0 {
		srv, err := s.GetUserServerByID(ctx, existingID)
		return "", srv, err
	}

	plaintext, hashHex, last4, err := generateAPIKey()
	if err != nil {
		return "", nil, err
	}
	now := time.Now().UTC().Format(time.RFC3339)

	// URLs are templated from order + server id; admin can override later.
	tenantID := fmt.Sprintf("cpo-%06d", orderID)
	apiBase := "https://api.gcss.hk/" + tenantID
	ocpp := "wss://ocpp.gcss.hk/" + tenantID
	webhook := "https://webhooks.gcss.hk/" + tenantID

	res, err := s.db.ExecContext(ctx, `
		INSERT INTO user_servers (user_id, order_id, region, api_base_url, api_key_hash, api_key_last4, ocpp_endpoint, webhook_url, status, max_chargers, created_at, updated_at)
		VALUES (?, ?, 'ap-southeast-1', ?, ?, ?, ?, ?, 'provisioning', ?, ?, ?);
	`, userID, orderID, apiBase, hashHex, last4, ocpp, webhook, maxChargers, now, now)
	if err != nil {
		return "", nil, err
	}
	id, _ := res.LastInsertId()
	srv, err := s.GetUserServerByID(ctx, id)
	if err != nil {
		return "", nil, err
	}
	return plaintext, srv, nil
}

func (s *Store) GetUserServerByID(ctx context.Context, id int64) (*UserServer, error) {
	row := s.db.QueryRowContext(ctx, `
		SELECT id, user_id, order_id, region, api_base_url, api_key_last4, ocpp_endpoint, webhook_url, status, uptime_pct, connected_chargers, max_chargers, last_backup_at, notes, created_at, updated_at
		FROM user_servers WHERE id = ?;
	`, id)
	return scanUserServer(row)
}

func (s *Store) ListUserServersForUser(ctx context.Context, userID int64) ([]UserServer, error) {
	rows, err := s.db.QueryContext(ctx, `
		SELECT id, user_id, order_id, region, api_base_url, api_key_last4, ocpp_endpoint, webhook_url, status, uptime_pct, connected_chargers, max_chargers, last_backup_at, notes, created_at, updated_at
		FROM user_servers WHERE user_id = ? ORDER BY created_at DESC;
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []UserServer
	for rows.Next() {
		srv, err := scanUserServer(rows)
		if err != nil {
			return nil, err
		}
		if srv != nil {
			out = append(out, *srv)
		}
	}
	return out, rows.Err()
}

func (s *Store) ListAllUserServers(ctx context.Context, limit int) ([]UserServer, error) {
	if limit <= 0 || limit > 500 {
		limit = 100
	}
	rows, err := s.db.QueryContext(ctx, `
		SELECT id, user_id, order_id, region, api_base_url, api_key_last4, ocpp_endpoint, webhook_url, status, uptime_pct, connected_chargers, max_chargers, last_backup_at, notes, created_at, updated_at
		FROM user_servers ORDER BY created_at DESC LIMIT ?;
	`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []UserServer
	for rows.Next() {
		srv, err := scanUserServer(rows)
		if err != nil {
			return nil, err
		}
		if srv != nil {
			out = append(out, *srv)
		}
	}
	return out, rows.Err()
}

func scanUserServer(row interface{ Scan(...interface{}) error }) (*UserServer, error) {
	var srv UserServer
	var orderID sql.NullInt64
	var lastBackup sql.NullString
	var createdAt, updatedAt string
	if err := row.Scan(&srv.ID, &srv.UserID, &orderID, &srv.Region, &srv.APIBaseURL, &srv.APIKeyLast4, &srv.OCPPEndpoint, &srv.WebhookURL, &srv.Status, &srv.UptimePct, &srv.ConnectedChargers, &srv.MaxChargers, &lastBackup, &srv.Notes, &createdAt, &updatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	if orderID.Valid {
		srv.OrderID = &orderID.Int64
	}
	if lastBackup.Valid && lastBackup.String != "" {
		t, _ := parseTimeRFC3339(lastBackup.String)
		srv.LastBackupAt = &t
	}
	srv.CreatedAt, _ = parseTimeRFC3339(createdAt)
	srv.UpdatedAt, _ = parseTimeRFC3339(updatedAt)
	return &srv, nil
}

// RotateAPIKey regenerates the API key for a server belonging to userID.
// Returns the new plaintext (shown to the user once).
func (s *Store) RotateAPIKey(ctx context.Context, userID, serverID int64) (string, error) {
	srv, err := s.GetUserServerByID(ctx, serverID)
	if err != nil {
		return "", err
	}
	if srv == nil || srv.UserID != userID {
		return "", errors.New("server not found")
	}
	plaintext, hashHex, last4, err := generateAPIKey()
	if err != nil {
		return "", err
	}
	now := time.Now().UTC().Format(time.RFC3339)
	_, err = s.db.ExecContext(ctx, `UPDATE user_servers SET api_key_hash = ?, api_key_last4 = ?, updated_at = ? WHERE id = ?;`, hashHex, last4, now, serverID)
	if err != nil {
		return "", err
	}
	return plaintext, nil
}

// AdminUpdateServer lets admins edit the mutable fields of a server record.
// The API key fields are not editable through this path — use RotateAPIKey.
type AdminServerUpdate struct {
	Region            string     `json:"region"`
	APIBaseURL        string     `json:"apiBaseUrl"`
	OCPPEndpoint      string     `json:"ocppEndpoint"`
	WebhookURL        string     `json:"webhookUrl"`
	Status            string     `json:"status"`
	UptimePct         float64    `json:"uptimePct"`
	ConnectedChargers int        `json:"connectedChargers"`
	MaxChargers       int        `json:"maxChargers"`
	LastBackupAt      *time.Time `json:"lastBackupAt,omitempty"`
	Notes             string     `json:"notes"`
}

var validServerStatuses = map[string]struct{}{
	"provisioning": {},
	"active":       {},
	"degraded":     {},
	"suspended":    {},
}

func (s *Store) AdminUpdateUserServer(ctx context.Context, serverID int64, in AdminServerUpdate) (*UserServer, error) {
	status := strings.TrimSpace(in.Status)
	if status == "" {
		status = "provisioning"
	}
	if _, ok := validServerStatuses[status]; !ok {
		return nil, fmt.Errorf("invalid status: %s", status)
	}
	var lastBackup interface{}
	if in.LastBackupAt != nil {
		lastBackup = in.LastBackupAt.UTC().Format(time.RFC3339)
	}
	now := time.Now().UTC().Format(time.RFC3339)
	_, err := s.db.ExecContext(ctx, `
		UPDATE user_servers SET region=?, api_base_url=?, ocpp_endpoint=?, webhook_url=?, status=?, uptime_pct=?, connected_chargers=?, max_chargers=?, last_backup_at=?, notes=?, updated_at=? WHERE id=?;
	`, in.Region, in.APIBaseURL, in.OCPPEndpoint, in.WebhookURL, status, in.UptimePct, in.ConnectedChargers, in.MaxChargers, lastBackup, in.Notes, now, serverID)
	if err != nil {
		return nil, err
	}
	return s.GetUserServerByID(ctx, serverID)
}
