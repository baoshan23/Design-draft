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

- 2026-05-15 (pricing Optional Extensions: gold → yellow + taller cards): user pasted screenshot of the "ADD-ONS / Optional Extensions" section and said "这里#8C5F00的图标和文字都改成黄色". The section lives at `src/app/[locale]/pricing/page.tsx:285-309` (`{/* Add-ons */}`), rendering a 3-col grid of `.addon-card`s, each with `.addon-card-icon` (icon in a 40×40 rounded square) + `.addon-label` (dark text title) + `.addon-price` (the "$100 one-time" style text). Color tokens in play: `--primary` = #FEBF1D (brand yellow), `--primary-text` = #8C5F00 (dark gold-brown for AA contrast — explicitly noted in CLAUDE.md's "Visual" bullet), `--primary-dim` = pale cream/yellow tint used as icon bg. SINGLE file changed: `src/app/styles/sections.css`. **CHANGES**: (1) `.addon-price` (line ~3023): `color: var(--primary-text)` → `var(--primary)`. (2) `.addon-card-icon` (line ~3434): `color: var(--primary-text)` → `var(--primary)`. The hover state `.addon-card:hover .addon-card-icon { background: var(--primary); color: var(--black) }` (line 3454) UNTOUCHED — resting state is now yellow-on-cream, hover inverts to black-on-yellow as before. NOT TOUCHED (already yellow): `.section-label` ("ADD-ONS" pill text) at sections.css:1947 already uses `color: var(--primary)`; the pill's pulsing dot `.section-label::before` at polish.css:261 already uses `var(--primary)`. The `.addon-label` (title text like "Mobile extra language translation (each)") is dark text — not gold — left alone (verified via grep — no color rule on `.addon-label` overrides it; inherits body text color). **A11Y NOTE**: `--primary-text` (#8C5F00) was specifically chosen for AA contrast on light backgrounds; switching to `--primary` (#FEBF1D) reduces contrast of the price text on the white card bg from ~7.1:1 to ~1.9:1 (fails WCAG AA 4.5:1 for normal text). Icons are decorative + paired with a text label so the icon contrast drop is less critical. User explicitly requested the change so honored it — if a future a11y audit flags the prices, options: (a) revert just `.addon-price` to `var(--primary-text)`, (b) bump the price font-weight further / add a tonal background, (c) introduce a darker amber like `var(--primary-hover)` (~#E6A817) which sits between the two and may pass AA. SCOPE: both classes are used ONLY in pricing's Optional Extensions section (verified by grep — only refs are sections.css definitions + the 2 usages in pricing/page.tsx), so changing the base rule is equivalent to a scoped override. NO JSX changes, NO i18n changes, NO new files. `npx tsc --noEmit` not re-run (CSS-only change). NOTE TO FUTURE CLAUDE: if user later says "the prices are unreadable now" or "make them darker again", revert just `.addon-price` color change (keep icons yellow). If user wants the entire section to flip to dark-on-yellow scheme (yellow background + black icons), swap `.addon-card-icon` background to `var(--primary)` and color to `var(--black)` (matches the hover state — would lose the hover affordance). The pricing page's main plan cards (`.pricing-card`) use different classes (`.pricing-price`, `.pricing-feature` etc.) which still use `--primary-text` — those are not touched. **FOLLOW-UP same turn**: user said "卡片的高度增高一点" → bumped `.addon-card` vertical padding `18px 20px` → `28px 20px` (sections.css:3004). Horizontal padding untouched. This increases each card's height by ~20px (10px top + 10px bottom). If user wants even taller, bump to 32-36px top/bottom; if too much air, drop to 22-24px. Could alternatively add `min-height: 84px` to the card to enforce uniform height regardless of label length (currently the 2nd row cards may grow if a label wraps to 2 lines — taller padding now makes single-line and 2-line cards visually similar). PRIOR (different sessions): b2c hero illustration: 4-card dashboard stack → single monitor mockup (commit `43e5e01`); home header yellow + same-yellow children invert to white (`cf26228`); home hero compress for marquee visibility (`c46845b`).
