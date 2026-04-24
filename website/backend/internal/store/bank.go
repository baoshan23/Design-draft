package store

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

// BankAccount is a merchant bank account advertised to customers paying by
// wire transfer. Multiple rows are allowed; only is_active=1 rows are shown
// on the public endpoint.
type BankAccount struct {
	ID            int64  `json:"id"`
	Label         string `json:"label"`
	BankName      string `json:"bankName"`
	AccountName   string `json:"accountName"`
	AccountNumber string `json:"accountNumber"`
	SwiftCode     string `json:"swiftCode"`
	IBAN          string `json:"iban"`
	BankAddress   string `json:"bankAddress"`
	Currency      string `json:"currency"`
	Notes         string `json:"notes"`
	IsActive      bool   `json:"isActive"`
	SortOrder     int    `json:"sortOrder"`
	CreatedAt     string `json:"createdAt"`
	UpdatedAt     string `json:"updatedAt"`
}

func scanBankAccount(row interface{ Scan(...any) error }) (*BankAccount, error) {
	var b BankAccount
	var isActive int
	if err := row.Scan(&b.ID, &b.Label, &b.BankName, &b.AccountName, &b.AccountNumber, &b.SwiftCode, &b.IBAN, &b.BankAddress, &b.Currency, &b.Notes, &isActive, &b.SortOrder, &b.CreatedAt, &b.UpdatedAt); err != nil {
		return nil, err
	}
	b.IsActive = isActive == 1
	return &b, nil
}

func (s *Store) ListBankAccounts(ctx context.Context, activeOnly bool) ([]BankAccount, error) {
	query := `SELECT id, label, bank_name, account_name, account_number, swift_code, iban, bank_address, currency, notes, is_active, sort_order, created_at, updated_at FROM bank_accounts`
	if activeOnly {
		query += ` WHERE is_active = 1`
	}
	query += ` ORDER BY sort_order ASC, id ASC;`
	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []BankAccount
	for rows.Next() {
		b, err := scanBankAccount(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *b)
	}
	if out == nil {
		out = []BankAccount{}
	}
	return out, rows.Err()
}

func (s *Store) UpsertBankAccount(ctx context.Context, b BankAccount) (*BankAccount, error) {
	now := time.Now().UTC().Format(time.RFC3339)
	active := 0
	if b.IsActive {
		active = 1
	}
	if b.Currency == "" {
		b.Currency = "USD"
	}
	if b.ID == 0 {
		res, err := s.db.ExecContext(ctx, `
			INSERT INTO bank_accounts (label, bank_name, account_name, account_number, swift_code, iban, bank_address, currency, notes, is_active, sort_order, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
			b.Label, b.BankName, b.AccountName, b.AccountNumber, b.SwiftCode, b.IBAN, b.BankAddress, b.Currency, b.Notes, active, b.SortOrder, now, now)
		if err != nil {
			return nil, err
		}
		id, _ := res.LastInsertId()
		b.ID = id
		b.CreatedAt = now
	} else {
		if _, err := s.db.ExecContext(ctx, `
			UPDATE bank_accounts SET label=?, bank_name=?, account_name=?, account_number=?, swift_code=?, iban=?, bank_address=?, currency=?, notes=?, is_active=?, sort_order=?, updated_at=? WHERE id=?;`,
			b.Label, b.BankName, b.AccountName, b.AccountNumber, b.SwiftCode, b.IBAN, b.BankAddress, b.Currency, b.Notes, active, b.SortOrder, now, b.ID); err != nil {
			return nil, err
		}
	}
	b.UpdatedAt = now
	return &b, nil
}

func (s *Store) DeleteBankAccount(ctx context.Context, id int64) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	_, err := s.db.ExecContext(ctx, `DELETE FROM bank_accounts WHERE id = ?;`, id)
	return err
}

// BankSlip is a bank-transfer proof uploaded by a customer. Admin reviews
// these and either approves (order → paid) or rejects (with notes).
type BankSlip struct {
	ID            int64   `json:"id"`
	OrderID       int64   `json:"orderId"`
	UserID        int64   `json:"userId"`
	Kind          string  `json:"kind"` // "deposit" | "balance" | "full"
	AmountCents   int64   `json:"amountCents"`
	Currency      string  `json:"currency"`
	BankName      string  `json:"bankName"`
	ReferenceNote string  `json:"referenceNote"`
	SlipURL       string  `json:"slipUrl"`
	Status        string  `json:"status"` // review | approved | rejected
	AdminNotes    string  `json:"adminNotes"`
	ReviewedBy    *int64  `json:"reviewedBy,omitempty"`
	ReviewedAt    *string `json:"reviewedAt,omitempty"`
	CreatedAt     string  `json:"createdAt"`

	// Attached context for the admin review screen.
	OrderNumber  string `json:"orderNumber,omitempty"`
	ProductLabel string `json:"productLabel,omitempty"`
	UserEmail    string `json:"userEmail,omitempty"`
}

func scanBankSlip(row interface{ Scan(...any) error }) (*BankSlip, error) {
	var s BankSlip
	var reviewedBy sql.NullInt64
	var reviewedAt sql.NullString
	if err := row.Scan(&s.ID, &s.OrderID, &s.UserID, &s.Kind, &s.AmountCents, &s.Currency, &s.BankName, &s.ReferenceNote, &s.SlipURL, &s.Status, &s.AdminNotes, &reviewedBy, &reviewedAt, &s.CreatedAt); err != nil {
		return nil, err
	}
	if reviewedBy.Valid {
		id := reviewedBy.Int64
		s.ReviewedBy = &id
	}
	if reviewedAt.Valid {
		t := reviewedAt.String
		s.ReviewedAt = &t
	}
	return &s, nil
}

type NewBankSlipInput struct {
	OrderID       int64
	UserID        int64
	Kind          string
	AmountCents   int64
	Currency      string
	BankName      string
	ReferenceNote string
	SlipURL       string
}

func (s *Store) CreateBankSlip(ctx context.Context, in NewBankSlipInput) (*BankSlip, error) {
	if in.OrderID <= 0 || in.UserID <= 0 {
		return nil, errors.New("orderId and userId required")
	}
	if in.SlipURL == "" {
		return nil, errors.New("slip URL required")
	}
	if in.Kind == "" {
		in.Kind = "balance"
	}
	if in.Currency == "" {
		in.Currency = "USD"
	}
	now := time.Now().UTC().Format(time.RFC3339)
	res, err := s.db.ExecContext(ctx, `
		INSERT INTO bank_slips (order_id, user_id, kind, amount_cents, currency, bank_name, reference_note, slip_url, status, admin_notes, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'review', '', ?);`,
		in.OrderID, in.UserID, in.Kind, in.AmountCents, in.Currency, in.BankName, in.ReferenceNote, in.SlipURL, now)
	if err != nil {
		return nil, err
	}
	id, _ := res.LastInsertId()
	return s.GetBankSlip(ctx, id)
}

func (s *Store) GetBankSlip(ctx context.Context, id int64) (*BankSlip, error) {
	row := s.db.QueryRowContext(ctx, `
		SELECT id, order_id, user_id, kind, amount_cents, currency, bank_name, reference_note, slip_url, status, admin_notes, reviewed_by, reviewed_at, created_at
		FROM bank_slips WHERE id = ?;`, id)
	return scanBankSlip(row)
}

// ListBankSlips returns slips with the attached order + user email, for the
// admin review screen. If status is "", returns all.
func (s *Store) ListBankSlips(ctx context.Context, status string, limit int) ([]BankSlip, error) {
	if limit <= 0 {
		limit = 100
	}
	q := `SELECT bs.id, bs.order_id, bs.user_id, bs.kind, bs.amount_cents, bs.currency, bs.bank_name, bs.reference_note, bs.slip_url, bs.status, bs.admin_notes, bs.reviewed_by, bs.reviewed_at, bs.created_at,
		COALESCE(o.order_number, ''), COALESCE(o.product_label, ''), COALESCE(u.email, '')
		FROM bank_slips bs
		LEFT JOIN orders o ON o.id = bs.order_id
		LEFT JOIN users u ON u.id = bs.user_id`
	args := []any{}
	if status != "" {
		q += ` WHERE bs.status = ?`
		args = append(args, status)
	}
	q += ` ORDER BY bs.created_at DESC LIMIT ?;`
	args = append(args, limit)
	rows, err := s.db.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []BankSlip
	for rows.Next() {
		var slip BankSlip
		var reviewedBy sql.NullInt64
		var reviewedAt sql.NullString
		if err := rows.Scan(&slip.ID, &slip.OrderID, &slip.UserID, &slip.Kind, &slip.AmountCents, &slip.Currency, &slip.BankName, &slip.ReferenceNote, &slip.SlipURL, &slip.Status, &slip.AdminNotes, &reviewedBy, &reviewedAt, &slip.CreatedAt, &slip.OrderNumber, &slip.ProductLabel, &slip.UserEmail); err != nil {
			return nil, err
		}
		if reviewedBy.Valid {
			id := reviewedBy.Int64
			slip.ReviewedBy = &id
		}
		if reviewedAt.Valid {
			t := reviewedAt.String
			slip.ReviewedAt = &t
		}
		out = append(out, slip)
	}
	if out == nil {
		out = []BankSlip{}
	}
	return out, rows.Err()
}

// ListBankSlipsForOrder returns all slips for a single order (used by the
// customer-facing order page).
func (s *Store) ListBankSlipsForOrder(ctx context.Context, orderID int64) ([]BankSlip, error) {
	rows, err := s.db.QueryContext(ctx, `
		SELECT id, order_id, user_id, kind, amount_cents, currency, bank_name, reference_note, slip_url, status, admin_notes, reviewed_by, reviewed_at, created_at
		FROM bank_slips WHERE order_id = ? ORDER BY created_at DESC;`, orderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []BankSlip
	for rows.Next() {
		b, err := scanBankSlip(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *b)
	}
	if out == nil {
		out = []BankSlip{}
	}
	return out, rows.Err()
}

// ApproveBankSlip marks the slip as approved, records the reviewer, and
// flips the owning order to paid (if not already paid). Both writes happen
// in a transaction so the order status and slip status stay consistent.
func (s *Store) ApproveBankSlip(ctx context.Context, slipID, adminID int64, notes string) error {
	slip, err := s.GetBankSlip(ctx, slipID)
	if err != nil || slip == nil {
		return errors.New("slip not found")
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	now := time.Now().UTC().Format(time.RFC3339)
	if _, err := tx.ExecContext(ctx, `UPDATE bank_slips SET status='approved', admin_notes=?, reviewed_by=?, reviewed_at=? WHERE id=?;`, notes, adminID, now, slipID); err != nil {
		return err
	}
	// Mark the order paid only when the approved slip covers the balance or full amount.
	if slip.Kind == "balance" || slip.Kind == "full" {
		if _, err := tx.ExecContext(ctx, `UPDATE orders SET status='paid', paid_at=?, updated_at=?, order_stage='processing' WHERE id=? AND status != 'paid';`, now, now, slip.OrderID); err != nil {
			return err
		}
	} else if slip.Kind == "deposit" {
		// Deposit slip approved — order moves to awaiting_balance.
		if _, err := tx.ExecContext(ctx, `UPDATE orders SET status='deposit_paid', updated_at=? WHERE id=? AND status='pending';`, now, slip.OrderID); err != nil {
			return err
		}
	}
	return tx.Commit()
}

func (s *Store) RejectBankSlip(ctx context.Context, slipID, adminID int64, notes string) error {
	now := time.Now().UTC().Format(time.RFC3339)
	_, err := s.db.ExecContext(ctx, `UPDATE bank_slips SET status='rejected', admin_notes=?, reviewed_by=?, reviewed_at=? WHERE id=?;`, notes, adminID, now, slipID)
	return err
}
