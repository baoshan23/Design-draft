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

- 2026-05-15 (demo page edition-card shadow rework: hover-only, lighter, no gold edge): user wants `/demo` edition cards (`<div class="demo-edition-card glass-card">` at `src/app/[locale]/demo/page.tsx:112`) to match the calmer interaction model of other pages — no shadow at rest, light neutral lift on hover/click, and ZERO gold tint anywhere. SINGLE file changed: `src/app/[locale]/demo/demo-page.css` lines 329-380. THREE-PRONG fix because gold was layered from three places: (1) `.demo-edition-card::before` (was lines 352-363) painted a 135° linear-gradient gold edge using the mask-composite border trick — REPLACED with `.demo-edition-card::before { content: none; }`, killing the entire pseudo. (2) `.glass-card` base in `sections.css:2144` paints a static shadow `var(--shadow-sm), inset 0 1px 0 rgba(255,255,255,.08)` on every glass-card — ADDED override `.demo-edition-card.glass-card { box-shadow: none; border-color: var(--border-subtle); }`. (3) `polish.css:141-150` paints gold hover treatment on EVERY `.glass-card:hover` (`0 0 0 1px rgba(254,191,29,.22)` gold ring + `0 0 36px rgba(254,191,29,.14)` gold glow + `border-color: rgba(254,191,29,.3)`) — overridden by `.demo-edition-card.glass-card:hover, :focus-within, :active { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(0,0,0,.12); border-color: var(--border-light); }`. SPECIFICITY: `.demo-edition-card.glass-card` is (0,2,0) vs polish.css's `.glass-card` (0,1,0) — wins on specificity, no reliance on import order needed. New hover shadow `0 14px 40px rgba(0,0,0,.12)` is borrowed from `.audience-card:hover` drop component (`sections.css:3219`) sans its `0 0 0 1px rgba(254,191,29,.18)` gold ring (intentionally dropped). Added `:focus-within` and `:active` to the hover rule so keyboard nav + tap also trigger lift (user said "鼠标光标悬浮或者点击时"). Removed old hover `transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,.4), 0 0 32px rgba(192,127,0,.2)` — the 0.4 alpha black + gold glow was what user called too heavy. NO i18n changes, NO TSX changes. Commit `b4367d1`. PUSH STATUS: `git push fork main` not attempted (env credentials missing — user pushes manually). Dev server still running on port 8000. NOTE TO FUTURE CLAUDE: if user wants subtle gold accent BACK only on `focus-visible` for a11y, add `.demo-edition-card.glass-card:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }` (mirrors `sections.css:3224-3227`). If user wants the SAME shadow treatment site-wide (kill polish.css gold-hover everywhere), move the override into `polish.css`/`pages-extracted.css` targeting `.glass-card:hover` — but verify pricing/audience-picker don't depend on the gold signature (pricing has its own gold via `.pricing-card.featured` separate path). If user wants STRONGER hover, bump alpha 0.12 → 0.18 or 0.22. PRIOR (different sessions): home hero dotted-grid bg fix via `html:not([data-theme="dark"])` specificity bump (commit `6e9d788`); pricing addon cards 2×3 grid + drop gold left-border (commit `c419981`); pricing-card white top-edge highlight removed (commit `66d06c4`).
