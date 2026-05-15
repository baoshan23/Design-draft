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

- 2026-05-15 (home hero dotted-grid bg: swap to wider/shorter 2.4:1 variant, keep `cover` for non-distort): user re-pasted a new variant of the dotted-grid bg image (`/tmp/claude-paste-1778835643295-ad255688.png`, md5 `d6b49455ad2f3fce56952f9b764f46df`, dimensions **3840×1600** vs prior `b65691740...` at 3840×2430) asking 等比例替换不要拉变形. NO files changed by me this turn — the file `public/images/hero-grid-bg.png` was ALREADY at the new content (committed by parallel session in `37e5c84 style(demo): drop drop-shadow on QR-code frames` along with the demo work — surprising bundling but confirmed via `git ls-tree HEAD` blob sha `1eacfedc...` matches `git hash-object` of the new disk content). After user picked "保持 cover (铺满，两侧轻微裁切)" in the AskUserQuestion flow, I confirmed `background-size: cover` in `pages-extracted.css:2352` is preserved — cover scales the image uniformly to fully cover the container, NEVER distorts, but DOES crop overflow. With new 2.4:1 source on typical 1.6:1 hero container (e.g. 1440×860), image gets scaled to height-fit then sides crop ~17% off each edge (270px on a 1620px scaled width). The dotted pattern in the image is concentrated in the horizontal center, so the cropped portions are mostly empty edges + outer ring of dots — center pattern + dashboard-icon-like dot clusters all survive. ALTERNATIVES OFFERED but DECLINED: (a) `contain` — full image visible, empty band below (bg-color #f5f6f8 fills); (b) `100% auto` + top-anchor — width snaps to hero, height auto-scales, pattern at top fades into empty color below. Either alternative is a 1-line CSS swap (`background-size: cover` → `contain` / `100% auto`). Background-position `center top` and background-repeat `no-repeat` unchanged. Specificity selector `html:not([data-theme="dark"]) .hero.hero-centered, html[data-theme="dark"] .hero.hero-centered` (the fix from commit `6e9d788`) still load-bearing — without it polish.css `background: none` wins and the image vanishes. Dev server on port 8000 still running, served chunk `src_app_0by61.r._.css` still has the image url. NOTE TO FUTURE CLAUDE: if user later complains about cropped edges and wants full image visible, change `pages-extracted.css:2352` `background-size: cover` → `background-size: contain` (single keyword swap). If user later wants pattern STRONGER, the image content itself is faint — boost contrast on the source PNG (no CSS change needed) OR add a `::before` overlay with `background-blend-mode: multiply` and a slightly darker tint. PRIOR (different sessions): demo page edition-card shadow rework (commits `b4367d1` + `37e5c84`); home hero dotted-grid bg specificity fix (commit `6e9d788`).
