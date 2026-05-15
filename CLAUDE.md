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

- 2026-05-15 (b2b hero title: "打造您的专属 EV 充电 SaaS 平台" → "SaaS平台版运营模式(B2B2C)" with animated yellow effect on "(B2B2C)" matching the home page main title): user attached `/tmp/claude-paste-1778827249786-b94cd010.png` (b2b page hero with the long product title in a red box) and said "这里红框的文字改成SaaS平台版运营模式(B2B2C)，然后B2B2C做黄色动效的效果，参考首页的主标题" — rename + add yellow animation on the (B2B2C) tag, explicitly REFERENCING the home page main title's animation (NOT the b2c page's shimmer). KEY DECISION: home page main title uses `.gradient-text-animated` (defined in `src/app/enhancements.css:135-142`) which is a 4-stop yellow gradient `linear-gradient(90deg, #E6A817, #D4890A, #F5C946, #E6A817)` with `background-size: 300% auto` and `animation: gradientShift 4s ease infinite` — the gradient color positions shift across the text in a 4s loop. This is DIFFERENT from the b2c page's `.hero-title-b2c` shimmer (which was a 3-stop sweep). User said "参考首页的主标题" so I reused the homepage class directly rather than creating a new shimmer. FOUR FILES EDITED: (1) `messages/zh.json:2157`: `"title": "打造您的专属 EV 充电 SaaS 平台"` → `"title": "SaaS平台版运营模式"` — i18n string holds JUST the localized phrase; "(B2B2C)" is rendered as a separate JSX span. (2) `messages/en.json:2157`: `"title": "Build Your Own EV Charging SaaS Platform"` → `"title": "SaaS Platform Operator Mode"` — English parity. NOTE: the old EN/ZH titles were quite different in meaning ("Build Your Own..." vs "打造您的专属..."); the new titles are both terse "SaaS Platform Operator Mode" / "SaaS平台版运营模式" so they read symmetrically across locales — user may or may not approve the EN wording; if they want a different EN phrasing (e.g. "SaaS Platform Edition Operations" or "SaaS Multi-Tenant Platform Mode"), only `messages/en.json:2157` needs to change. (3) `src/app/[locale]/b2b/page.tsx:100-102`: `<h1 className="hero-title">{t('b2b.hero.title')}</h1>` → `<h1 className="hero-title">{t('b2b.hero.title')}<span className="hero-title-tag gradient-text-animated">(B2B2C)</span></h1>`. The "(B2B2C)" is HARDCODED in JSX (brand-fixed, identical in all locales). It uses TWO classes: `.hero-title-tag` (NEW, generic positioning class — see below) + `.gradient-text-animated` (EXISTING homepage class, provides the shifting yellow gradient). (4) `src/app/styles/sections.css`: added NEW `.hero-title-tag` rule right after the existing `.hero-title-b2c` reduced-motion block (around line 165). The new rule is INTENTIONALLY MINIMAL: `.hero-title-tag { display: inline-block; margin-left: 0.35em; }` — just provides the breathing room between the phrase and the bracket tag, with `inline-block` so the gradient-background-clip works inside an inline parent. NO color/animation rules here — those come from `.gradient-text-animated`. ALSO added a `@media (prefers-reduced-motion: reduce)` block that strips the gradient/animation from `.hero-title-tag.gradient-text-animated` and falls back to a solid `#E6A817` yellow — matching the homepage's brand-yellow but flat. WHY THE NAME `hero-title-tag` AND NOT `hero-title-b2b`: deliberately generic so the same class can be reused if user later wants `(B2C)` or another bracket tag on other product pages. The previous session's `.hero-title-b2c` was b2c-specific (different shimmer); this new `.hero-title-tag` is the home-page-style animation, content-agnostic. EFFECT: in the b2b hero, "SaaS平台版运营模式" renders as default hero-title color (dark), and "(B2B2C)" renders with the yellow 4-stop gradient animating in a 4s loop — same exact animation as the home page hero's typing text. Verified `npx tsc --noEmit` clean. NOTE TO FUTURE CLAUDE: the b2c page's "(B2C)" tag still uses its own `.hero-title-b2c` shimmer (different animation, kept for continuity from prior session — was 2.6s shimmer-sweep, not the gradientShift). If user later wants the b2c page to ALSO use the home-page animation for consistency, swap `<span className="hero-title-b2c">(B2C)</span>` for `<span className="hero-title-tag gradient-text-animated">(B2C)</span>` in `src/app/[locale]/b2c/page.tsx:62`. If user wants the (B2B2C) animation FASTER, edit `enhancements.css:141` `animation: gradientShift 4s` → `2s` (BUT that affects the home page typing text too — to scope only the b2b tag, override on `.hero-title-tag.gradient-text-animated` with `animation-duration: 2s`). If user wants to KEEP the home page animation untouched but use a different gradient on the b2b tag, drop `.gradient-text-animated` from the span and inline new gradient styles into `.hero-title-tag` instead. If user wants the b2b BADGE chip (above the title, currently "B2B 平台") also updated, edit `messages/zh.json:332` and `messages/en.json:332` (the `b2b.label` key — user didn't ask, so left as-is). The original long title "打造您的专属 EV 充电 SaaS 平台" was DELETED entirely from i18n — if user wants to restore it elsewhere on the page (e.g. as a subtitle or secondary header), it would need to be re-added under a new key.
