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

- 2026-05-15 (home hero dotted-grid bg: REAL fix — bump specificity to actually beat polish.css): user re-pasted the same dotted-grid bg image (`/tmp/claude-paste-1778834610039-b7133d9c.png`, md5 `b65691740bffe15aa75bde2e1fa4a40c`) asking "插入到首页首屏" — turns out the image was already on disk at `public/images/hero-grid-bg.png` (committed `aba770b`) and CSS already referenced it, BUT prior fix commit `36ece4d "bump hero-centered bg specificity so polish.css doesn't wipe it"` was INSUFFICIENT — `html .hero.hero-centered` (specificity 0,2,1) and polish.css's `html:not([data-theme="dark"]) .hero { background: none }` (also 0,2,1 because `:not()`'s argument `[data-theme="dark"]` contributes 0,1,0) TIED on specificity, and polish.css loads LATER in the bundle (line 20434 vs 19461 in compiled chunk `src_app_0by61.r._.css`) so `background: none` was winning the cascade. That's why the dotted-grid pattern wasn't visible in light mode — image was loaded but immediately wiped. SINGLE file changed: `website/frontend/src/app/styles/pages-extracted.css` (lines 2343-2349). Replaced selector `html .hero.hero-centered` with `html:not([data-theme="dark"]) .hero.hero-centered, html[data-theme="dark"] .hero.hero-centered` — mirrors polish.css's `:not` so light-mode selector is now (0,3,1) and beats polish (0,2,1) outright. Verified in compiled CSS: the new selector replaces the old one at the same byte location. The dark-mode selector `html[data-theme="dark"] .hero.hero-centered` was added so the rule still applies in dark mode (otherwise the grid bg would only paint in light mode); dark theme overrides for hero bg should be added separately if needed (none currently exist for `.hero-centered`). Image file UNCHANGED (already correct on disk, md5 matches user paste). Commit `6e9d788 fix(home): hero grid-bg now paints in light mode (beat polish.css)`. PUSH STATUS: `git push fork main` FAILED with `fatal: could not read Username for 'https://github.com'` — same auth issue as prior session, user must push manually. Dev server running on port 8000 (PID 3720700, next-server v16.2.3 Turbopack). NOTE TO FUTURE CLAUDE: if user reports the grid is BACK to invisible, check (a) polish.css hasn't been re-promoted (e.g., new `!important` added to its `background: none` rule), (b) `pages-extracted.css` still loads after `polish.css` in `app/globals.css` import order, (c) no new rule like `[data-theme="dark"] .hero { background: none }` exists to clobber dark-mode. If user wants the bg MORE visible (currently very subtle since the image itself has only faint dotted shapes on near-white #f5f6f8): bump `background-color` to slightly more saturated tint (e.g. `#eef0f3`) or add a tinted gradient overlay layer via `::before` (not `::after` — that's killed by `display: none !important` on line 2338). If user wants a DIFFERENT bg pattern, just swap `public/images/hero-grid-bg.png` (any 16:9-ish PNG/JPG works since `background-size: cover`). If user wants to remove the grid entirely, just delete the `background-image` line from the rule (or set to `none`). PRIOR (different session): pricing Optional Extensions add-on cards → 2×3 grid + drop gold left-border, commit `c419981`.
