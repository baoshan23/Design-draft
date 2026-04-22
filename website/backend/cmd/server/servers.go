package main

import (
	"log"
	"net/http"
	"strconv"
	"strings"

	"gcss-backend/internal/store"
)

// ── User: GET /api/user/server ─────────────────────────────────────────
// Returns the caller's server records. One per paid order.

func (s *server) handleUserServer(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	user, ok := s.requireAuth(w, r)
	if !ok {
		return
	}
	servers, err := s.store.ListUserServersForUser(r.Context(), user.ID)
	if err != nil {
		log.Printf("ListUserServersForUser error: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to load"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"servers": servers})
}

// ── User: POST /api/user/server/rotate ─────────────────────────────────
// body: { serverId: number } — rotates the API key and returns the new
// plaintext ONCE. Server only stores a SHA-256 hash + last 4 chars.

func (s *server) handleUserServerRotate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	user, ok := s.requireAuth(w, r)
	if !ok {
		return
	}
	var req struct {
		ServerID int64 `json:"serverId"`
	}
	if err := decodeJSON(r, &req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if req.ServerID <= 0 {
		// Fallback: if the user has exactly one server, rotate that one.
		servers, err := s.store.ListUserServersForUser(r.Context(), user.ID)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		if len(servers) != 1 {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "serverId is required when you have multiple servers"})
			return
		}
		req.ServerID = servers[0].ID
	}
	plaintext, err := s.store.RotateAPIKey(r.Context(), user.ID, req.ServerID)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	srv, _ := s.store.GetUserServerByID(r.Context(), req.ServerID)
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"apiKey":  plaintext, // shown to user ONCE — we never return this again
		"server":  srv,
		"message": "Copy this key now. It will not be shown again.",
	})
}

// ── Admin: GET /api/admin/servers ──────────────────────────────────────

func (s *server) handleAdminServers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	if _, ok := s.requireAdmin(w, r); !ok {
		return
	}
	limit := parseIntDefault(r.URL.Query().Get("limit"), 100)
	servers, err := s.store.ListAllUserServers(r.Context(), limit)
	if err != nil {
		log.Printf("ListAllUserServers error: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"servers": servers})
}

// ── Admin: PUT /api/admin/servers/{id} ─────────────────────────────────

func (s *server) handleAdminServerItem(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/admin/servers/")
	idStr = strings.Trim(idStr, "/")
	parts := strings.Split(idStr, "/")
	if len(parts) == 0 || parts[0] == "" {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "not found"})
		return
	}
	id, _ := strconv.ParseInt(parts[0], 10, 64)
	if id <= 0 {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "not found"})
		return
	}
	if _, ok := s.requireAdmin(w, r); !ok {
		return
	}

	// Subresource: /api/admin/servers/{id}/regenerate-key
	if len(parts) >= 2 && parts[1] == "regenerate-key" {
		if r.Method != http.MethodPost {
			writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
			return
		}
		srv, err := s.store.GetUserServerByID(r.Context(), id)
		if err != nil || srv == nil {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "server not found"})
			return
		}
		plaintext, err := s.store.RotateAPIKey(r.Context(), srv.UserID, id)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
		updated, _ := s.store.GetUserServerByID(r.Context(), id)
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"apiKey":  plaintext,
			"server":  updated,
			"message": "Share this key with the customer via a secure channel. Not returned again.",
		})
		return
	}

	if r.Method != http.MethodPut && r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	var in store.AdminServerUpdate
	if err := decodeJSON(r, &in); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	srv, err := s.store.AdminUpdateUserServer(r.Context(), id, in)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"server": srv})
}
