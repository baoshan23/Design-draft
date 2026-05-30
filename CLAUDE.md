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

- 2026-05-30 — **b2c (`/[locale]/b2c`) `#gallery` "产品展示" → static evenly-distributed row, no interaction** (`Gallery3D.tsx` + `polish.css` ~572-620, commit `429c11c` pushed fork `design-draft-local`). Prior turn this session shipped a hover-to-feature row (one phone in `is-active` scaled+tilted, `useState`+`onMouseEnter`/`onFocus`/`onMouseLeave`); user then asked for a fully static layout (`静态展示时，对齐分布，无交互`). **Now**: `Gallery3D.tsx` is a pure render — no `useState`, no hover handlers, no `'use client'` directive needed (kept the file as a plain component; `aria-label` and the `g3d-device`/`g3d-screen`/`g3d-notch` mockup unchanged). CSS: `.gallery-row{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:40px 16px}` (was `justify-content:center;gap:32px;padding:80px 16px 60px` — the larger top padding existed to leave room for the lifted active phone). `.g3d-phone{flex:1 1 0;min-width:0;max-width:220px;filter:drop-shadow(0 18px 24px rgba(0,0,0,.18))}` — flex-grow distributes the four phones evenly across the container width, `max-width:220px` caps individual size on wide screens; removed all `transform`/`transition`/`:hover`/`.is-active`/`:focus-visible` rules and the `cursor:pointer`. `prefers-reduced-motion` block removed (nothing animates). Mobile (`max-width:760px`) still drops to a 2-col grid, just with `max-width:none` on the phones instead of overriding the (now-absent) transforms. `tsc` 0. Revert: restore the prior `Gallery3D.tsx` with `useState(1)` + the `.is-active` CSS rule.

- 2026-05-30 — **Pricing `#addons` "可选扩展" cards restyle: editorial-stat layout, yellow icon tile + black line icon** (`sections.css` 4283-4329, commits `3e23bcb` + `619440d` pushed fork `design-draft-local`). Two-step this turn: (1) `3e23bcb` shipped the editorial-stat layout (centered, icon on top, big bold price under it, small grey label below) AND flipped the icon to black-bg + yellow-icon with no shadow, mirroring the "12-24 hours / 2 seconds / 40% faster" reference. (2) `619440d` flipped the icon palette back: user wanted yellow background + black icon (the original brand pairing) while keeping the no-shadow flat treatment and the new centered editorial layout. Old cards rendered as left-aligned chips with `.addon-card{background:var(--dark-card);border:1px solid var(--border-light);border-radius:var(--radius-md);padding:28px 20px;flex-direction:column;align-items:flex-start;gap:14px;...:hover{translateY(-4px);box-shadow:var(--shadow-md)}}` (from the original block 3818-3858) plus the override at 4283 which only set `flex-direction:column;align-items:flex-start;gap:14px`, and `.addon-card-icon` was a 52px solid-gold tile with `background:var(--primary)`, `color:#181818`, `box-shadow:0 0 20px rgba(254,191,29,.35)` (the gold glow). **Now** (overrides at 4283-4329, originals at 3818-3858 left intact — overrides win by cascade): `.addon-card{background:transparent;border:none;border-radius:0;padding:24px 16px;align-items:center;text-align:center;gap:18px;box-shadow:none;transition:none}` + a fresh `.addon-card:hover{transform:none;box-shadow:none}` that kills the lift. `.addon-card-icon` → **56px, `background:var(--primary,#febf1d)`, `color:#181818`, `box-shadow:none`** (yellow bg, black icon, no glow — the 619440d state). `.addon-card-body{flex-direction:column-reverse;align-items:center;text-align:center;gap:8px}` — DOM order stays label→price (a11y-friendly: what-it-is read before how-much), `column-reverse` flips visual order so price renders directly under the icon as the big stat and label sits below as the description. New scoped overrides `.addon-card .addon-label{font-size:.92rem;font-weight:500;color:var(--text-secondary,#555);line-height:1.45}` and `.addon-card .addon-price{font-size:1.6rem;font-weight:800;color:var(--primary);line-height:1.1;letter-spacing:-.01em}`. Markup unchanged (`pricing/page.tsx` 271-281 still renders `.addons-grid > .addon-card > .addon-card-icon + .addon-card-body > .addon-label + .addon-price`). Revert: restore the original 4283-4329 block from before `3e23bcb`.

  **PUSH POLICY (settled):** push every commit with `git push fork main:design-draft-local`. Local `main` → fork branch `design-draft-local`. NEVER force-push or touch fork `main` (it holds 54 security-pin/contact-page commits that diverged from local at `8a4d15c` on 2026-05-11; local-only design work is the 400+ commits). `origin` = `anindya127/Design-draft` also diverged — don't push there.

  **Older still-relevant flags (do NOT reapply unless asked):** b2c `#features` section 4 has an `AppSlideshow` carousel — a separate phone slideshow in a `4/3` `.feature-image-placeholder:has(.app-slideshow)` card (do not confuse with the `Gallery3D` `#gallery` cluster). homepage hero `.hero.hero-centered .hero-centered-inner` uses `url('/images/hero-grid-bg.png') cover` — a CSS dot-grid was tried then REVERTED (`6ed2f2b`). b2c `.product-hero::before` light-mode dot field IS live (`d692ec4`, gold `rgba(214,158,0,0.55)` 2.5px/24px; pale-yellow on `#F1F2F4` ≈ invisible — use darker gold ≥0.4 alpha for texture on that bg); same selector also styles the b2b hero. Homepage yellow nav bar was reverted (`bcbd0aa`); `logo-globe.png` recoverable via `git show 8fef934`. b2c `.product-hero` is `min-height:calc(100svh - 42px)` flex-column with `.hero-footer-bar{margin-top:auto}` pinning the 3 stats to the fold (b2b shares `.product-hero` — verify if touching). The running `next dev` on :8000 can develop a dead file-watcher (container inotify limit) and serve a stale CSS bundle — if an edit doesn't show, kill it, `rm -rf .next`, restart `npm run dev`.
