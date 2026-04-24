package main

import (
	"log"
	"net/http"
	"strconv"
	"strings"

	"gcss-backend/internal/store"
)

// ── Public: list active bank accounts ─────────────────────────────────

func (s *server) handlePublicBankAccounts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	items, err := s.store.ListBankAccounts(r.Context(), true)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"accounts": items})
}

// ── Admin: bank account CRUD ──────────────────────────────────────────

func (s *server) handleAdminBankAccounts(w http.ResponseWriter, r *http.Request) {
	if _, ok := s.requireAdmin(w, r); !ok {
		return
	}
	ctx := r.Context()
	switch r.Method {
	case http.MethodGet:
		items, err := s.store.ListBankAccounts(ctx, false)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		writeJSON(w, http.StatusOK, map[string]interface{}{"accounts": items})
	case http.MethodPost:
		var b store.BankAccount
		if err := decodeJSON(r, &b); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
		saved, err := s.store.UpsertBankAccount(ctx, b)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
		writeJSON(w, http.StatusOK, map[string]interface{}{"account": saved})
	default:
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
	}
}

func (s *server) handleAdminBankAccountItem(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/admin/bank-accounts/")
	idStr = strings.Trim(idStr, "/")
	id, _ := strconv.ParseInt(idStr, 10, 64)
	if id <= 0 {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "not found"})
		return
	}
	if _, ok := s.requireAdmin(w, r); !ok {
		return
	}
	ctx := r.Context()
	switch r.Method {
	case http.MethodPut, http.MethodPost:
		var b store.BankAccount
		if err := decodeJSON(r, &b); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
		b.ID = id
		saved, err := s.store.UpsertBankAccount(ctx, b)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
		writeJSON(w, http.StatusOK, map[string]interface{}{"account": saved})
	case http.MethodDelete:
		if err := s.store.DeleteBankAccount(ctx, id); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
	default:
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
	}
}

// ── Customer: upload a bank slip for an order ─────────────────────────

func (s *server) handleUploadBankSlip(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	user, ok := s.requireAuth(w, r)
	if !ok {
		return
	}
	var req struct {
		OrderNumber   string `json:"orderNumber"`
		Kind          string `json:"kind"` // deposit | balance | full
		AmountCents   int64  `json:"amountCents"`
		BankName      string `json:"bankName"`
		ReferenceNote string `json:"referenceNote"`
		SlipURL       string `json:"slipUrl"`
	}
	if err := decodeJSON(r, &req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if req.OrderNumber == "" || req.SlipURL == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "orderNumber and slipUrl are required"})
		return
	}
	// Slip URL must be a local /uploads/ path — prevents the form from
	// being abused as a relay for arbitrary external URLs.
	if !strings.HasPrefix(req.SlipURL, "/uploads/") {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "slip URL must be a local /uploads/ path"})
		return
	}
	order, err := s.store.GetOrderByNumberForUser(r.Context(), user.ID, req.OrderNumber)
	if err != nil || order == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "order not found"})
		return
	}
	slip, err := s.store.CreateBankSlip(r.Context(), store.NewBankSlipInput{
		OrderID:       order.ID,
		UserID:        user.ID,
		Kind:          req.Kind,
		AmountCents:   req.AmountCents,
		Currency:      order.Currency,
		BankName:      req.BankName,
		ReferenceNote: req.ReferenceNote,
		SlipURL:       req.SlipURL,
	})
	if err != nil {
		log.Printf("CreateBankSlip error: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to record slip"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"slip": slip})
}

// ── Customer: list their own slips for an order ───────────────────────

func (s *server) handleUserOrderSlips(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	user, ok := s.requireAuth(w, r)
	if !ok {
		return
	}
	// /api/user/orders/{number}/slips
	rest := strings.TrimPrefix(r.URL.Path, "/api/user/orders/")
	rest = strings.TrimSuffix(rest, "/slips")
	rest = strings.Trim(rest, "/")
	if rest == "" {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "order number required"})
		return
	}
	order, err := s.store.GetOrderByNumberForUser(r.Context(), user.ID, rest)
	if err != nil || order == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "order not found"})
		return
	}
	slips, err := s.store.ListBankSlipsForOrder(r.Context(), order.ID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"slips": slips})
}

// ── Admin: list / approve / reject bank slips ─────────────────────────

func (s *server) handleAdminBankSlips(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	if _, ok := s.requireAdmin(w, r); !ok {
		return
	}
	status := r.URL.Query().Get("status")
	limit := parseIntDefault(r.URL.Query().Get("limit"), 100)
	items, err := s.store.ListBankSlips(r.Context(), status, limit)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"slips": items})
}

func (s *server) handleAdminBankSlipItem(w http.ResponseWriter, r *http.Request) {
	// POST /api/admin/bank-slips/{id}/approve
	// POST /api/admin/bank-slips/{id}/reject
	rest := strings.TrimPrefix(r.URL.Path, "/api/admin/bank-slips/")
	rest = strings.Trim(rest, "/")
	parts := strings.Split(rest, "/")
	if len(parts) < 2 {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "not found"})
		return
	}
	idStr, action := parts[0], parts[1]
	id, _ := strconv.ParseInt(idStr, 10, 64)
	if id <= 0 {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "not found"})
		return
	}
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	admin, ok := s.requireAdmin(w, r)
	if !ok {
		return
	}
	var req struct {
		Notes string `json:"notes"`
	}
	_ = decodeJSON(r, &req)

	switch action {
	case "approve":
		if err := s.store.ApproveBankSlip(r.Context(), id, admin.ID, req.Notes); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
	case "reject":
		if err := s.store.RejectBankSlip(r.Context(), id, admin.ID, req.Notes); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
	default:
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "unknown action"})
		return
	}
	slip, _ := s.store.GetBankSlip(r.Context(), id)
	writeJSON(w, http.StatusOK, map[string]interface{}{"slip": slip})
}
