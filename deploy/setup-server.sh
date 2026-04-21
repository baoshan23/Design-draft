#!/usr/bin/env bash
#
# GCSS Production Server Setup (one-time)
# Run on the server: bash setup-server.sh
#
# What it does:
#   1. Installs nginx (if missing)
#   2. Creates backend directories
#   3. Installs nginx site config
#   4. Installs systemd service
#   5. Enables + starts everything
#   6. Optionally installs SSL via certbot
#
set -euo pipefail

DOMAIN="v3.gcss.hk"
BACKEND_DIR="/opt/gcss-backend"
FRONTEND_DIR="/var/www/gcss-website"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "================================================"
echo "  GCSS Server Setup — $DOMAIN"
echo "================================================"
echo ""

# ── Must be root ─────────────────────────────────────
if [ "$(id -u)" -ne 0 ]; then
  echo "Error: run as root (or with sudo)"
  exit 1
fi

# ── 1. Install nginx ────────────────────────────────
echo "[1/6] Checking nginx..."
if ! command -v nginx &>/dev/null; then
  echo "  Installing nginx..."
  apt-get update -qq
  apt-get install -y -qq nginx
  echo "  nginx installed."
else
  echo "  nginx already installed."
fi

# ── 2. Create directories ───────────────────────────
echo "[2/6] Creating directories..."
mkdir -p "$BACKEND_DIR/data/uploads"
mkdir -p "$FRONTEND_DIR"
chown -R www-data:www-data "$BACKEND_DIR"
chown -R www-data:www-data "$FRONTEND_DIR"
echo "  $BACKEND_DIR — created"
echo "  $FRONTEND_DIR — created"

# ── 3. Install nginx config ─────────────────────────
echo "[3/6] Installing nginx config..."
NGINX_CONF="$SCRIPT_DIR/nginx/$DOMAIN.conf"
if [ ! -f "$NGINX_CONF" ]; then
  echo "  Error: $NGINX_CONF not found"
  echo "  Copy deploy/nginx/$DOMAIN.conf to the server first."
  exit 1
fi

cp "$NGINX_CONF" "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"

# Remove default site if it exists (optional)
if [ -f /etc/nginx/sites-enabled/default ]; then
  echo "  Removing default nginx site..."
  rm -f /etc/nginx/sites-enabled/default
fi

nginx -t
echo "  nginx config installed and validated."

# ── 4. Install systemd service ──────────────────────
echo "[4/6] Installing systemd service..."
SYSTEMD_SRC="$SCRIPT_DIR/systemd/gcss-backend.service"
if [ ! -f "$SYSTEMD_SRC" ]; then
  echo "  Error: $SYSTEMD_SRC not found"
  echo "  Copy deploy/systemd/gcss-backend.service to the server first."
  exit 1
fi

cp "$SYSTEMD_SRC" /etc/systemd/system/gcss-backend.service
systemctl daemon-reload
systemctl enable gcss-backend
echo "  gcss-backend service installed and enabled."

# ── 5. Install backend .env (if not present) ────────
echo "[5/6] Checking backend .env..."
BACKEND_ENV="$SCRIPT_DIR/backend.env"
if [ ! -f "$BACKEND_DIR/.env" ]; then
  if [ -f "$BACKEND_ENV" ]; then
    cp "$BACKEND_ENV" "$BACKEND_DIR/.env"
    chown www-data:www-data "$BACKEND_DIR/.env"
    chmod 600 "$BACKEND_DIR/.env"
    echo "  .env installed (permissions: 600)."
  else
    echo "  Warning: no backend.env found. Create $BACKEND_DIR/.env manually."
  fi
else
  echo "  .env already exists, skipping."
fi

# ── 6. Start services ───────────────────────────────
echo "[6/6] Starting services..."
systemctl reload nginx
echo "  nginx reloaded."

if [ -f "$BACKEND_DIR/gcss-backend" ]; then
  systemctl restart gcss-backend
  sleep 2
  STATUS=$(systemctl is-active gcss-backend || true)
  echo "  gcss-backend: $STATUS"
else
  echo "  gcss-backend binary not found yet."
  echo "  Run 'node deploy/deploy-backend.js' to upload it."
fi

echo ""
echo "================================================"
echo "  Setup complete!"
echo ""
echo "  Frontend: $FRONTEND_DIR"
echo "  Backend:  $BACKEND_DIR"
echo "  Domain:   http://$DOMAIN"
echo ""
echo "  Next steps:"
echo "    1. Point DNS A record for $DOMAIN → $(hostname -I | awk '{print $1}')"
echo "    2. Deploy frontend: npm run deploy (from website/frontend/)"
echo "    3. Deploy backend:  node deploy/deploy-backend.js"
echo "    4. SSL: certbot --nginx -d $DOMAIN"
echo "================================================"
