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

- 2026-05-15 (b2c hero REDO — prefix back to dark, line-break before "(B2C)", switch animation to homepage-style solid-yellow + blinking cursor): user said "改的不对，参考首页的主标题样式，重新改，独立运营商模式是黑色的，然后换行（B2C）做黄色动态效果，参考首页的主标题" — prior shimmer was wrong. User wants (a) "独立运营商模式" rendered in BLACK (not yellow), (b) line break before "(B2C)", (c) "(B2C)" animation matching the homepage main title visual (solid yellow + blinking cursor + gold glow halo, NOT a gradient shimmer). REFERENCE: homepage hero's `<TypingText>` renders as `class="gradient-text-animated typing-text"`. The `.typing-text` rule (`enhancements.css:145-156`) attaches a blinking `|` cursor via `::after` with `animation: blink 0.7s step-end infinite` + `@keyframes blink { 50% { opacity: 0 } }`. A PRIOR session overrode `.hero-with-video .hero-title .typing-text` in `sections.css:122-131` to render as flat `#FEBF1D` with `text-shadow: 0 2px 18px rgba(254, 191, 29, 0.35)` (gold glow) — so what the user actually SEES on the homepage is solid yellow text + glowing halo + blinking cursor. I mirrored that visual onto the b2c "(B2C)" tag. TWO FILES EDITED (this redo): (1) `src/app/[locale]/b2c/page.tsx:62` JSX: dropped `<span className="text-gradient">` around the prefix (without that class, "独立运营商模式" inherits the default `.hero-title` color, which is `var(--text-primary)` dark via cascade since `.hero-title` at sections.css:1599 has no explicit color rule). Added `<br />` between the prefix and the "(B2C)" span — puts the tag on its own line, mimicking homepage's `{t('hero.title1')}<br /><TypingText .../>` structure. Final JSX: `<h1 className="hero-title">OCPP CPMS<br />{t('product.title2')}<br /><span className="hero-title-b2c">(B2C)</span></h1>`. (2) `src/app/styles/sections.css` `.hero-title-b2c` rule: COMPLETELY REPLACED the prior shimmer implementation. OLD (prior turn — shimmer-sweep gradient): `linear-gradient(90deg, #FEBF1D 0%, #FFE99A 50%, #FEBF1D 100%); background-size: 200% 100%; animation: b2cShimmer 2.6s ease-in-out infinite` + the `@keyframes b2cShimmer`. NEW (this turn — solid yellow + blinking cursor matching homepage): `.hero-title-b2c { display: inline-block; color: #FEBF1D; -webkit-text-fill-color: #FEBF1D; text-shadow: 0 2px 18px rgba(254, 191, 29, 0.35) }` + `.hero-title-b2c::after { content: '|'; margin-left: 4px; color: #FEBF1D; -webkit-text-fill-color: #FEBF1D; animation: blink 0.7s step-end infinite }` + a reduced-motion media query stripping ONLY the cursor animation (keeps the cursor visible but stops the blink). REUSES the existing `@keyframes blink` at `enhancements.css:157-159` — no new keyframe needed. The `margin-left: 0.35em` from the prior implementation was REMOVED (the tag is on its own line now, no horizontal sibling to space from). `display: inline-block` is KEPT so the `text-shadow` glow and `::after` cursor render predictably. EFFECT: hero now reads as three visually-distinct lines — "OCPP CPMS" (dark) / "独立运营商模式" or "Independent Operator Mode" (dark) / "(B2C)|" (yellow with glowing halo + blinking yellow cursor). Visually 1:1 with the homepage main title style (dark phrase + line break + yellow accent with blinking cursor). The i18n string updates from the prior turn (`zh.json:783` → "独立运营商模式", `en.json:783` → "Independent Operator Mode") are UNCHANGED — only the rendering shifted. Verified `npx tsc --noEmit` clean. NOTE TO FUTURE CLAUDE: the b2b page (per a sibling-agent session) uses `.hero-title-tag.gradient-text-animated` class chain on its "(B2B2C)" tag — a DIFFERENT animation (4-stop gradient sweep over 4s, no blinking cursor). The two product pages are now visually DIVERGENT: b2c uses cursor-blink, b2b uses gradient-sweep. If user wants UNIFIED animation across both, the simplest fix is to swap b2b's class chain to `<span className="hero-title-b2c">(B2B2C)</span>` matching this page's pattern (consider renaming `.hero-title-b2c` to brand-neutral `.hero-title-tag-blink` to avoid the content-specific name). If user wants this b2c "(B2C)" to OMIT the cursor (just solid yellow text + glow, no animation), delete the `::after` block. If user wants the cursor BIGGER, prepend `font-weight: 100` or `transform: scaleY(1.2)` to `::after`. If user wants the GLOW STRONGER, bump `text-shadow: 0 2px 18px rgba(254,191,29,0.35)` → `0 0 32px rgba(254,191,29,0.55)`. The prior shimmer's `b2cShimmer` keyframe is now ORPHANED — harmless dead CSS; cleanup later. PRIOR (sibling-agent session): b2b hero rename "打造您的专属 EV 充电 SaaS 平台" → "SaaS平台版运营模式(B2B2C)" with `.hero-title-tag.gradient-text-animated` on the (B2B2C) tag (4s gradient sweep) — see commit log.
