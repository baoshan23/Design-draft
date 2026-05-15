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

- 2026-05-15 (home hero dotted-grid bg: switch `cover` → `contain` so full pattern is visible, no side crop): user said "要看完整图，两边不裁切" — flipping the prior session's `cover` decision. SINGLE CSS keyword change in `pages-extracted.css:2352`: `background-size: cover` → `background-size: contain`. With the 3840×1600 (2.4:1) source image on typical hero containers: (a) 1440×860 (1.67:1): contain scales to width-fit → image renders 1440×600, leaving ~260px of bg-color #f5f6f8 below the pattern (image is anchored `center top` so the gap is at bottom). (b) 1080×860 (1.26:1): scales to width-fit → image 1080×450, ~410px gap below. (c) 2560×860 ULTRA-WIDE (2.98:1, wider than image ratio): contain switches to height-fit → image 2064×860, leaving ~250px gaps on EACH side filled with bg-color. So on standard monitors the image is full-width and gap-below; only at viewport widths > 2064px (≈2.4× the typical hero height) do side gaps appear. The empty bottom band is a feature not a bug — the dashboard mockup sits visually anchored below the pattern instead of layered on top of it. Background-color #f5f6f8 is the same as the image's near-white field so seam should be invisible. Commit `71ec5e1` style(home): hero bg → contain. PUSH STATUS: will fail again (env auth missing); user pushes manually — accumulated unpushed commits: `6e9d788`, `d433dbc`, `71ec5e1`, plus this CLAUDE.md commit. Specificity fix from `6e9d788` and parallel-session demo commits (`b4367d1`, `37e5c84`, `bc22efa`, `0a1cacc`) also unpushed. NOTE TO FUTURE CLAUDE: if user later says the empty bottom band looks weird (e.g., wants pattern to reach bottom of hero), options are (a) revert to `cover` and accept side crop, (b) use `100% auto` with `center top` (functionally identical to contain on standard widths but overflows + crops on ultra-wide), (c) increase the source image height by adding bottom padding to the PNG itself so the natural 2.4:1 becomes ~1.6:1 — then `cover` would barely crop. If user wants the pattern more visually present despite the gap, add a soft gradient overlay via `::before` to blend the pattern edge into the bg-color (avoid `::after` — it's killed by `display: none !important` on line 2338). If user wants the side gaps GONE on ultra-wide screens, add `background-size: 100% auto` instead — that forces width=100% and lets height overflow + clip via `overflow: hidden`. PRIOR (different sessions): demo page edition-card shadow rework (commits `b4367d1` + `37e5c84`); home hero dotted-grid bg specificity fix (commit `6e9d788`). user re-pasted a new variant of the dotted-grid bg image (`/tmp/claude-paste-1778835643295-ad255688.png`, md5 `d6b49455ad2f3fce56952f9b764f46df`, dimensions **3840×1600** vs prior `b65691740...` at 3840×2430) asking 等比例替换不要拉变形. NO files changed by me this turn — the file `public/images/hero-grid-bg.png` was ALREADY at the new content (committed by parallel session in `37e5c84 style(demo): drop drop-shadow on QR-code frames` along with the demo work — surprising bundling but confirmed via `git ls-tree HEAD` blob sha `1eacfedc...` matches `git hash-object` of the new disk content). After user picked "保持 cover (铺满，两侧轻微裁切)" in the AskUserQuestion flow, I confirmed `background-size: cover` in `pages-extracted.css:2352` is preserved — cover scales the image uniformly to fully cover the container, NEVER distorts, but DOES crop overflow. With new 2.4:1 source on typical 1.6:1 hero container (e.g. 1440×860), image gets scaled to height-fit then sides crop ~17% off each edge (270px on a 1620px scaled width). The dotted pattern in the image is concentrated in the horizontal center, so the cropped portions are mostly empty edges + outer ring of dots — center pattern + dashboard-icon-like dot clusters all survive. ALTERNATIVES OFFERED but DECLINED: (a) `contain` — full image visible, empty band below (bg-color #f5f6f8 fills); (b) `100% auto` + top-anchor — width snaps to hero, height auto-scales, pattern at top fades into empty color below. Either alternative is a 1-line CSS swap (`background-size: cover` → `contain` / `100% auto`). Background-position `center top` and background-repeat `no-repeat` unchanged. Specificity selector `html:not([data-theme="dark"]) .hero.hero-centered, html[data-theme="dark"] .hero.hero-centered` (the fix from commit `6e9d788`) still load-bearing — without it polish.css `background: none` wins and the image vanishes. Dev server on port 8000 still running, served chunk `src_app_0by61.r._.css` still has the image url. NOTE TO FUTURE CLAUDE: if user later complains about cropped edges and wants full image visible, change `pages-extracted.css:2352` `background-size: cover` → `background-size: contain` (single keyword swap). If user later wants pattern STRONGER, the image content itself is faint — boost contrast on the source PNG (no CSS change needed) OR add a `::before` overlay with `background-blend-mode: multiply` and a slightly darker tint. PRIOR (different sessions): demo page edition-card shadow rework (commits `b4367d1` + `37e5c84`); home hero dotted-grid bg specificity fix (commit `6e9d788`).
