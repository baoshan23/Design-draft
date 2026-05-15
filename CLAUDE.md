# GCSS Website — Project Guide for Claude

## What this is

Full production website for **GCSS (Global Charger System Service)** — an EV charging management platform. Real users, real payments, real accounts. Not a demo. Design polish + correctness both matter.

## Stack & layout

- Frontend: `website/frontend/` — Next.js (App Router), TypeScript, static export.
- Pages under `website/frontend/src/app/[locale]/` — locale routing for EN/ZH.
- Shared styles in `website/frontend/src/app/styles/`.
- Backend: Go + SQLite in `website/backend/` with encrypted `app_secrets` store (AES-256-GCM).
- i18n: `messages/en.json` + `messages/zh.json`.

## Pages

index, product, pricing, buy, buy/review, buy/success, buy/bank-transfer, about, blog, docs, contact, forum, faq, careers, partners, b2b, login, register, forgot-password, dashboard (+ payments / server / orders), admin (+ blog / products / orders / servers / settings / bank-accounts / bank-slips), invoices.

## Deployment

Production server **47.242.75.250** (staging domain `v3.gcss.hk`; final will be `gcss.hk`).
Manual deploy (GitHub Actions secrets unset): from `website/frontend/` run
`SFTP_PASSWORD='Gcss123.' npm run deploy`.
Backend: `node deploy/deploy-backend.js` cross-compiles Go + SFTP + systemd restart.

**Current workflow (overrides prior "always deploy" rule):**
- **Do NOT deploy to the production server.** Skip `npm run deploy` and `deploy-backend.js`.
- **After every code change, push to fork:** `https://github.com/baoshan23/Design-draft` on `main`.
- **Log the change** by updating the "Last session" bullet at the bottom of this file.

## Current state (as of 2026-04-24)

- **Pricing**: 5 tiers from official PDF — SaaS Hosted ($84/yr/charger), Custom Web APP ($300 setup + $120/mo), APP Enterprise ($16,900), Web APP Platform ($21,800), APP Platform ($34,200). 5 add-ons. Dedicated plan removed.
- **Deposit**: $200 (const `DepositCents` / `DEPOSIT_CENTS`). Platform plans default to deposit-ON; balance paid via bank transfer. Charges > $1,500 are forced to bank transfer server-side.
- **Payments**: Stripe, PayPal (Orders v2), Ping++ (Alipay/WeChat, USD→CNY via `PINGXX_USD_TO_CNY_RATE` secret), and bank transfer with admin-reviewed slip upload.
- **Orders**: 5-stage steppers (order + server), printable invoices at `/invoices?n=`, admin overrides at `/admin/orders`.
- **User servers**: auto-provisioned on payment. API keys stored as sha256 + last4 only; plaintext shown once on rotation.
- **Admin secrets**: encrypted store with write-only values, masked last-four display, audit trail. Managed at `/admin/settings`.
- **Auth**: rate-limited, email-change with 6-digit code, avatar/cover uploads restricted to `/uploads/*`.
- **Visual**: golden orbs R3F canvas + frosted glass layer behind all pages; editorial typography; `--primary-text: #8C5F00` for AA contrast on light mode.
- **A11y**: skip-nav, ARIA stepper, focus-visible rings, autoComplete tokens on forms, labelled admin groups.

## Working agreements

- Focus on visual polish and completeness over new features.
- Keep EN/ZH translations in sync when editing copy.
- Prefer editing existing components/styles over creating new files.
- **Session log**: keep only the **latest** session entry below. When starting a new session, replace the previous bullet — do not append. This keeps CLAUDE.md lean.

## Last session

- 2026-05-15 (pricing Optional Extensions add-on cards → 2×3 grid + drop gold left-border): user requested in `/tmp/claude-paste-1778834498708-9f3ce9ad.png` ref. SINGLE file changed: `website/frontend/src/app/styles/sections.css`. (1) FIRST `.addon-card` def (~line 3141) — REMOVED `border-left: 3px solid var(--primary);` (was the gold accent stripe on the left edge of each card). Kept the rest of the base ruleset (`border: 1px solid var(--border-light)`, `border-radius: var(--radius-md)`, padding/flex). (2) SECOND `.addons-grid` override (~line 3563, in the "Add-on cards — icon + body row layout" block which IS the active rule due to later cascade order) — CHANGED `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` → `grid-template-columns: repeat(3, minmax(0, 1fr))` to lock 3 columns regardless of viewport width on desktop. With 6 addons (`mobileLang, adminLang, gateway, pos, custom, store` per `pricing/page.tsx:118-125`), 3 cols → exactly 2 rows × 3 cols matching the requested layout. Added two responsive breakpoints: `@media (max-width: 900px) { repeat(2, minmax(0, 1fr)) }` (tablets — 3 rows × 2 cols), and `@media (max-width: 560px) { 1fr }` (mobile — single column). FIRST `.addons-grid` def (~line 3134) with `repeat(auto-fit, minmax(240px, 1fr))` was LEFT in place since the second def already overrode it (later in source, same specificity); harmless dead rule. NO i18n changes, NO TSX changes. Commit `c419981` style(pricing): addon-cards → 2×3 grid, drop gold left-border. PUSH STATUS: `git push fork main` FAILED with `fatal: could not read Username for 'https://github.com'` — no credentials in this env. User needs to push manually. Dev server running in BG (task `b95t4pshv`) on port 8000 — Next.js 16.2.3 Turbopack, ready in 335ms, accessible at http://localhost:8000 and http://172.17.0.2:8000. NOTE TO FUTURE CLAUDE: if user wants the gold accent BACK in a different form (e.g., as a top border or icon-only), re-add `border-left` OR migrate the accent to `.addon-card-icon` background (already `var(--primary-dim)`). If user wants 3-col layout to PERSIST further down (e.g., to ~720px instead of 900px), drop the 900px breakpoint's minimum. If user adds a 7th addon, the 3-col grid will produce 2 rows × 3 + 1 orphan — switch back to `auto-fit` or accept the orphan. PRIOR (different session): homepage hero rebuilt as Arcadia-style centered layout, locked to first-fold fit — see commit `aba770b` and earlier hero work.
