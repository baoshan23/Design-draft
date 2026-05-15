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

- 2026-05-15 (b2b hero "(B2B2C)" tag — swap from 4-stop gradient sweep to solid yellow + blinking cursor to match the homepage main title's visual): user said "参考首页首屏的主标题黄色的动态效果，（B2B2C）也要改成那种动态效果" then immediately followed with "颜色是纯黄色，不要渐变" — so the requested effect is the same one already on the homepage hero (.typing-text override in `sections.css:123-131` = solid `#FEBF1D` + gold-glow text-shadow + blinking `|` cursor via `::after`), explicitly NOT a multi-stop gradient sweep. CONTEXT: prior session had set the (B2B2C) tag to use `.hero-title-tag.gradient-text-animated` (the 4-stop `#E6A817 → #D4890A → #F5C946 → #E6A817` `gradientShift 4s` sweep) — that was visually a GRADIENT, which the user just rejected. Meanwhile a sibling-agent session ALSO updated the b2c page to drop its shimmer and use solid yellow + blinking cursor via `.hero-title-b2c` — so this change brings b2b into visual parity with b2c. TWO FILES EDITED: (1) `src/app/[locale]/b2b/page.tsx:101` — span class chain `hero-title-tag gradient-text-animated` → `hero-title-tag` (dropped `.gradient-text-animated`). The (B2B2C) span no longer references the homepage's gradient utility. (2) `src/app/styles/sections.css` `.hero-title-tag` rule REPLACED: removed the prior `display: inline-block; margin-left: 0.35em;` + reduced-motion gradient fallback block, replaced with `.hero-title-tag { display: inline-block; margin-left: 0.35em; color: #FEBF1D; -webkit-text-fill-color: #FEBF1D; text-shadow: 0 2px 18px rgba(254, 191, 29, 0.35) }` + `.hero-title-tag::after { content: '|'; margin-left: 4px; color: #FEBF1D; -webkit-text-fill-color: #FEBF1D; animation: blink 0.7s step-end infinite }` + reduced-motion block stripping only the cursor blink. REUSES the EXISTING `@keyframes blink` from `enhancements.css:157-159` (no new keyframe). MARGIN PRESERVED: kept `margin-left: 0.35em` because the b2b hero (UNLIKE the b2c page after its own redo) does NOT have a `<br />` between the phrase and the bracket tag — "(B2B2C)" sits inline AFTER "SaaS平台版运营模式" on the same line, so it needs horizontal spacing. If the user later wants a line break before "(B2B2C)" to match the b2c page exactly, add `<br />` before the span in `b2b/page.tsx:101` AND drop the `margin-left: 0.35em` from `.hero-title-tag`. EFFECT: b2b hero now reads "SaaS平台版运营模式 (B2B2C)|" — the phrase in default dark hero color, "(B2B2C)" in solid `#FEBF1D` brand yellow with a gold-glow halo, and a blinking yellow `|` cursor after it. Visually matches the homepage main title (solid yellow + glow + blink) AND visually matches the b2c page's redo. Verified `npx tsc --noEmit` clean. NOTE TO FUTURE CLAUDE: `.hero-title-tag` and `.hero-title-b2c` now have IDENTICAL styles (solid yellow + glow + blink cursor) — they're effectively duplicates with different class names. If user later asks for a refactor / DRY-up, consolidate them: rename `.hero-title-b2c` callers in b2c/page.tsx to use `.hero-title-tag` and delete the `.hero-title-b2c` rule block. Kept separate for now because: (a) the b2c page has `<br />` before its tag (no horizontal margin needed) while b2b is inline (needs `margin-left`) — merging would force one to override the other; (b) prior session's note explicitly anticipated this divergence ("If user wants UNIFIED animation across both, the simplest fix is to swap b2b's class chain to `<span className="hero-title-b2c">(B2B2C)</span>` matching this page's pattern") — so the current setup is the documented choice. If user wants the b2b cursor REMOVED (just solid glowing yellow, no blinking), delete the `.hero-title-tag::after` block. If user wants the glow STRONGER, bump `text-shadow: 0 2px 18px rgba(254,191,29,0.35)` → `0 0 32px rgba(254,191,29,0.55)`. The orphaned `gradient-text-animated` class on the homepage's `<TypingText>` is now unused for VISUAL effect (the `.typing-text` override blanks its gradient) but still exists as a utility class — it's referenced from `contact/PageClient.tsx:142` (contact-page title2 — still uses the multi-stop sweep, presumably intentionally) so DO NOT delete that class definition. PRIOR (sibling-agent session): contact page unified all 6 icon color-block backgrounds to brand-yellow `--gold`; b2c hero REDO switched (B2C) tag from shimmer to solid-yellow + blinking cursor — see commit log.
