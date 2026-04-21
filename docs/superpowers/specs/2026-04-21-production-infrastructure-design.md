# Production Infrastructure — v3.gcss.hk

## Overview

Connect the Next.js frontend and Go backend into a single production deployment on server `47.242.75.250`, served under `v3.gcss.hk`. Later cutover to `gcss.hk`.

## Architecture

```
                    v3.gcss.hk
                        │
                   ┌────▼────┐
                   │  nginx   │  :80 / :443
                   └────┬────┘
                        │
            ┌───────────┼───────────┐
            │                       │
    /api/* + /uploads/*        everything else
            │                       │
   ┌────────▼────────┐    ┌────────▼────────┐
   │  Go backend     │    │  static files   │
   │  localhost:8080  │    │  /var/www/       │
   │  (systemd)      │    │  gcss-website/   │
   └─────────────────┘    └─────────────────┘
```

**Single domain, no CORS needed in production.** Frontend calls `/api/...` (relative), nginx proxies to the Go backend.

## Components

### 1. nginx site config (`deploy/nginx/v3.gcss.hk.conf`)

- Listen on port 80 (SSL added later via certbot)
- `server_name v3.gcss.hk`
- `location /api/` → `proxy_pass http://127.0.0.1:8080/api/`
- `location /uploads/` → `proxy_pass http://127.0.0.1:8080/uploads/`
- `location /healthz` → `proxy_pass http://127.0.0.1:8080/healthz`
- `location /` → serve static files from `/var/www/gcss-website/` with `try_files $uri $uri/index.html $uri.html /index.html`
- Standard proxy headers: `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`, `Host`
- Gzip on for text/html, css, js, json, svg
- Client max body 10M (matches backend upload limit)

### 2. systemd service (`deploy/systemd/gcss-backend.service`)

- `ExecStart=/opt/gcss-backend/gcss-backend`
- `WorkingDirectory=/opt/gcss-backend`
- `Restart=always`, `RestartSec=5`
- Environment vars via `EnvironmentFile=/opt/gcss-backend/.env`
- `User=www-data` (same as nginx, for file permissions)
- Depends on `network.target`

### 3. Backend .env for production (`deploy/backend.env`)

```
PORT=8080
CORS_ORIGINS=https://v3.gcss.hk,https://gcss.hk,https://www.gcss.hk,http://localhost:3000
DB_PATH=/opt/gcss-backend/data/gcss.sqlite
DATA_FILE=/opt/gcss-backend/data/requests.jsonl
UPLOAD_DIR=/opt/gcss-backend/data/uploads
AUTH_RETURN_RESET_CODE=false
```

### 4. Backend deploy script (`deploy/deploy-backend.js`)

Uses the same SFTP approach as the existing frontend deploy:
1. Cross-compile Go binary: `GOOS=linux GOARCH=amd64 go build -o bin/gcss-backend ./cmd/server`
2. SFTP upload binary to `/opt/gcss-backend/gcss-backend`
3. SFTP upload `.env` to `/opt/gcss-backend/.env`
4. SSH command: `systemctl restart gcss-backend`

### 5. Frontend production env (`website/frontend/.env.production`)

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=https://v3.gcss.hk
NEXT_PUBLIC_AUTH_API=true
NEXT_PUBLIC_FORMS_API=true
```

`NEXT_PUBLIC_API_URL` is empty — the frontend `getApiBase()` defaults to `/api` (relative path). nginx handles the proxy. No CORS needed.

### 6. Server setup script (`deploy/setup-server.sh`)

One-time script to run on the server:
1. Install/verify nginx
2. Create `/opt/gcss-backend/data/` directories
3. Copy nginx config to `/etc/nginx/sites-available/`, symlink to `sites-enabled/`
4. Copy systemd service to `/etc/systemd/system/`
5. `systemctl daemon-reload && systemctl enable gcss-backend`
6. `nginx -t && systemctl reload nginx`
7. Optionally run certbot for SSL

### 7. Unified deploy command

Add to root `package.json` or as `deploy/deploy-all.js`:
1. Build + deploy frontend (existing flow)
2. Build + deploy backend (new flow)
3. Restart backend service on server

## File layout

```
deploy/
├── nginx/
│   └── v3.gcss.hk.conf
├── systemd/
│   └── gcss-backend.service
├── backend.env              # production backend env
├── deploy-backend.js        # backend deploy script
├── deploy-all.js            # unified deploy (frontend + backend)
└── setup-server.sh          # one-time server setup
```

## CORS strategy

- **Production**: Frontend and API on same domain (`v3.gcss.hk`) — no CORS needed
- **Development**: Frontend on `localhost:3000`, API on `localhost:8080` — CORS needed
- Backend CORS config updated to include `v3.gcss.hk` in allowlist

## Security notes

- `AUTH_RETURN_RESET_CODE=false` in production (no demo codes leaked)
- Backend runs as `www-data`, not root
- Upload limit enforced at both nginx (10M) and Go (10M)
- SQLite DB and uploads stored in `/opt/gcss-backend/data/` (outside web root)

## Cutover to gcss.hk

When ready:
1. Copy nginx config, change `server_name` to `gcss.hk www.gcss.hk`
2. Update `NEXT_PUBLIC_SITE_URL` to `https://gcss.hk`
3. Run certbot for the new domain
4. Rebuild + redeploy frontend
