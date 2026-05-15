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

- 2026-05-15 (home header → yellow, invert same-yellow children to white): user said "把首页的顶部导航栏背景改成黄色，如果遇到同样黄色的，反白处理即可". SINGLE file changed: `src/app/styles/components.css`. Homepage-scoped via `body:has(.hero-with-video)` (only the home page has `.hero-with-video` class on the hero `<section>` — verified at `src/app/[locale]/page.tsx:99`). **CHANGES**: (1) `body:has(.hero-with-video) .header:not(.scrolled)` rule (~lines 122-128): `background: #ffffff` → `var(--primary)` (#FEBF1D); `border-bottom-color: transparent` → `rgba(0,0,0,0.08)` (subtle 1px line for edge against same-tone content below). (2) `body:has(.hero-with-video) .header.scrolled` rule (~lines 132-138): `background: rgba(255,255,255,0.32)` → `var(--primary)`; dropped `backdrop-filter: blur(32px) saturate(180%)` (set to none — solid yellow doesn't need glass); `box-shadow` darkened slightly (0.09 → 0.08, irrelevant tweak); `border-bottom-color` adjusted to match unscrolled. (3) NEW invert rules block (~lines 141-162): `.nav a.active` and `.nav-dropdown-trigger.active` text → `#ffffff`, AND their `::after` underline `background → #ffffff`. (4) `.header-actions .btn-buy` (the gold CTA in header): `background → #ffffff`, `color: var(--black)` retained (was already black on gold, stays black on white — same text color), added `box-shadow: 0 0 0 1px rgba(0,0,0,0.08)` for definition against yellow bar. `:hover` keeps white bg + slightly heavier shadow. (5) Scrolled-state active link rule at line ~204 (the OLDER override `body:has(.hero-with-video) .header.scrolled .nav a.active { color: var(--primary) }`): edited in-place — `color: var(--primary)` → `#ffffff`, and added matching `::after { background: #ffffff }` block. This rule existed at higher specificity (0,5,2) than my new generic `.header` rule (0,4,2) so without editing it, scrolled state's active link would have remained gold. **NON-COLLISIONS LEFT AS-IS**: regular nav links use `--text-secondary` (medium grey), logo + btn-login use `--text-primary` (dark) — these read fine on yellow with ~AA contrast. Sub-nav rule at line ~165 (`body:has(.hero-with-video) .sub-nav`) untouched because homepage doesn't render a `.sub-nav` element — the rule is a no-op on home. Mobile menu CTA (.mobile-nav-cta .btn-buy) also gold; not touched because the mobile menu opens as a fullscreen drawer with its own bg (not over the header) — if user reports the mobile drawer CTA looks wrong, mirror the `.btn-buy` invert with `.mobile-nav-cta .btn-buy { background: #ffffff; ... }` at line ~520. Dark mode (`[data-theme="dark"]`) has separate rules at lines 110-116 that don't go through `:has(.hero-with-video)` — they stay glass/dark. If user toggles dark mode on home, the header reverts to standard dark glass (NOT yellow); ask if that's desired before chasing it. SPECIFICITY: `body:has(.hero-with-video) .header:not(.scrolled)` is (0,3,1) [body=0,0,1 + :has(.x)=0,1,0 + .header=0,1,0 + :not(.x)=0,1,0]; my new invert rules `body:has(.hero-with-video) .header .nav a.active` are (0,4,2) which is higher than the base `.nav a.active` (0,1,1). Commit `cf26228 style(home): yellow nav bar, invert same-yellow collisions to white`. PUSH STATUS: unchanged — env auth missing, user pushes manually. NOTE TO FUTURE CLAUDE: if user later says the yellow looks "too much" / wants it only on the unscrolled state (and frosted-white on scrolled), restore the scrolled rule to `rgba(255,255,255,0.32)` + `backdrop-filter: blur(32px)`. If user wants the BTN-BUY in HEADER to stay gold but a slightly DARKER gold so it doesn't fully merge (less drastic invert), change `.btn-buy bg: #ffffff` → `var(--primary-hover)` (the darker amber). If user wants a darker / less saturated yellow header (more brand-amber, less highlighter), swap `var(--primary)` → `var(--primary-hover)` (~`#E6A817`). If user wants the sub-nav to ALSO be yellow on home, update the `.sub-nav` rule at line ~165 — but they'd have to add a sub-nav to home first (none exists today). PRIOR (different sessions): home hero compress for marquee visibility (commit `c46845b`); hero stats re-add + dashboard fade (`7352711`); home hero → Arcadia-style rounded panel; hero bg specificity fix (commit `6e9d788`).
