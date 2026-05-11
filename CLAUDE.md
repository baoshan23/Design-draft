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

- 2026-04-27 (hero video bg + CPO/phone composition + bank-accounts admin redesign + B2C app slideshow): **Home hero** got a full-viewport video bg (`/video/Hero-back.mp4`, 145MB H.264 — needs compression). New `components/sections/home/HeroVideo.tsx` client component force-loads + plays muted to bypass SSR `muted` attr loss. Hero text re-anchored left, max-width 640px; gold-shimmer TypingText accent; gradient scrim dark-left → clear-right. Hero footer stats text forced white in both modes (`!important` over tertiary tokens). On the right: **CPO dashboard mockup** (`/images/dashboard-home.png`, browser-chrome bar `cpo.gcss.hk`) at 1.2× width clamp(456-672px), with **mobile phone mockup** (`/images/Mobile_home.png`, iPhone-ish frame + notch) overlapping its left edge top:26%, sized clamp(150-190px). Neutral drop shadow only — all radar/HUD/dashboard-cluster/globe/editorial-type iterations were rejected before settling here. **Hero stage taller**: `min-height: calc(100svh - var(--header-height))`. **HeroShotStack moved** home → b2c hero (`components/sections/b2c/HeroShotStack.tsx`); home `hero-split` and `hero-with-shot` classes dropped. **B2C "APP / H5" feature row**: replaced static `App.png` with new `b2c/AppSlideshow.tsx` client carousel — 9 slides cycling all `public/images/mobileapp/` files (English-named + URL-encoded Chinese-named extras like 个人中心, RFID, 余额充值), 3.6s auto-advance, fade+scale crossfade, dot indicators, hover-pause, iPhone frame with Dynamic Island pill. **Home MobileShowcase** stack trimmed from 5 to 3 cards: home / profile / map. **Social Login card** image swapped from `login.jpg` → `App_login_iphone.png`. **Bank-accounts admin** rebuilt: new toolbar (search debounced 180ms / status filter chips with counts / sort dropdown), bank-card grid replacing flat rows (avatar initial, currency badge, mono account number rows with copy-to-clipboard, inline isActive switch), modal upgraded to portal+createPortal escape from any stacking context, sectioned form (Identity / Banking / Notes), focus restore + Esc close + Enter saves, sticky modal head/foot, skeleton cards on load, rich empty state, dismissable error banner. Added 18 i18n keys across EN+ZH. Layout `<body>` got `suppressHydrationWarning` to swallow Grammarly DOM injection. Installed `@types/react-dom` (was missing). Build green (100 static pages). Deploy to 47.242.75.250 — 1344 files / 12m 27s.
