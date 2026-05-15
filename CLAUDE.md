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

- 2026-05-15 (home hero: compress total height so trusted-bar marquee stays in first fold): user said "整体的高度再缩小一点，我需要在首屏的底部还要看到充电桩制造商的滚动效果". The new stats row + dashboard-with-margin-top + bigger panel padding pushed hero content past `min-height: calc(100svh - 221px)`, so the hero grew and shoved the 221px trusted-bar marquee off the bottom of the fold. TWO files changed: (1) `src/app/styles/pages.css:2856` `.trusted-bar { min-height: 221px → 180px }` — frees 41px of vertical real estate. (2) `src/app/styles/pages-extracted.css` MULTIPLE rules: (a) `.hero.hero-centered` outer (lines ~2360-2364): swapped `min-height: calc(100svh - 221px)` → `calc(100svh - 180px)` AND added `max-height: calc(100svh - 180px)` — the `max-height` is THE KEY DEFENSE: it caps the hero so content overflow can't push the marquee out (the dashboard's `flex: 1 1 auto` + `min-height: 0` lets it shrink to fit). Outer top-padding `calc(72px + clamp(24px, 4.5vh, 64px))` → `calc(72px + clamp(12px, 2.5vh, 40px))` — shaved 12-24px off top. Outer bottom-padding `clamp(20px, 2.5vh, 36px)` → `clamp(12px, 1.5vh, 24px)`. (b) `.hero-centered-inner` panel padding `clamp(48px, 7vh, 96px)` → `clamp(28px, 4vh, 60px)` (top), `gap: clamp(16px, 2.4vh, 28px)` → `clamp(10px, 1.6vh, 20px)`. (c) `.hero.hero-centered .hero-stats margin: clamp(8px, 1.5vh, 20px) 0 0` → `0` — let the flex `gap` handle spacing, drops 8-20px stacking duplication. Stats `gap: clamp(40px, 5vw, 72px)` → `clamp(36px, 5vw, 64px)` (microns tighter). (d) `.hero-dashboard-mock margin-top: clamp(16px, 3vh, 40px)` → `clamp(4px, 0.8vh, 14px)` (was the explicit "push down" from prior turn; now trimmed because we need the vertical space). `max-height: clamp(280px, 50vh, 540px)` → `clamp(200px, 36vh, 400px)` — caps dashboard 140px shorter at top end. Mask fade stop `#000 65%` → `#000 62%` for slightly more aggressive bottom dissolve to compensate for the shorter dashboard area. NEW MATH: hero + trusted-bar = (100svh - 180px) + 180px = 100svh EXACTLY. On 900px screen: hero=720, content budget after outer padding (~104) = 616 for panel; panel padding-top (~40 at 4vh) + text (~250) + gap (~14) + stats (~80) + gap (~14) + dashboard margin (~7) + dashboard (~324 at 36vh) = ~729 — STILL slightly over 616. The `max-height` cap + dashboard flex-shrink trim the dashboard further on cramped viewports to make it fit. The `mask-image` fade visually hides any hard truncation at the dashboard bottom. NO JSX changes this turn. NO mobile media-query changes (mobile uses `min-height: auto` already, no fold-fit concern). Short-laptop media query (`max-height: 820 and min-width: 721`) was NOT updated — its overrides still use the old paddings; should still work since trusted-bar is now shorter and the short-laptop targets cramped vertical real estate where the trusted-bar visibility is already a concern. If trusted-bar still gets pushed on 720-820px screens, the short-laptop media query at pages-extracted.css ~lines 2510-2525 needs identical compression treatment (top padding/gap/dashboard max-height reductions). Commit `c46845b style(home): compress hero so trusted-bar stays in first fold`. PUSH STATUS: unchanged — env auth missing, user pushes manually. Cumulative unpushed: `6e9d788, d433dbc, 71ec5e1, c002947, e0c6702, 156c895, 7352711, c46845b` + parallel-session demo work + this CLAUDE.md commit. NOTE TO FUTURE CLAUDE: if user wants trusted-bar EVEN SHORTER (e.g., logos can squeeze into 140px), drop `pages.css:2856` further AND update both `min-height: calc(100svh - X)` AND `max-height: calc(100svh - X)` on `.hero.hero-centered` (BOTH must track or fold-fit math breaks). If user wants the hero TALLER again (less compression), revert this commit OR change `max-height` to `none` — but be prepared for the marquee to fall below the fold on smaller screens. If the dashboard becomes too small to read (e.g., on 720px screens), the `max-height: clamp(200px, 36vh, 400px)` is the bottleneck — bump 200/36vh/400 up. If stats look too crammed against buttons or dashboard, add back a small `margin-top` on `.hero-stats` (e.g., `clamp(4px, 0.6vh, 10px)`). The mask fade percentage `62%` controls how much dashboard is solidly visible vs faded — lower % = more fade. PRIOR (different sessions): home hero re-add 3 stats counter row + push dashboard down + gradient-fade bottom (commit `7352711`); home hero → Arcadia-style rounded panel: white outer, 1440 panel w/ dotted-grid bg, 972 dashboard embedded; hero bg specificity fix (commit `6e9d788`); demo page card-shadow rework (`b4367d1`, `37e5c84`).
