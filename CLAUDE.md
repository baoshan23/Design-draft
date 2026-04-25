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
**Always deploy after any edit.**

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

- 2026-04-25 (nav declutter + cross-link revert): **Header cleanup** per docs/superpowers/plans/2026-04-24-nav-cleanup.md — desktop right-cluster collapsed from 7 controls to 3: Buy Now (gold), Log in or user avatar, and a new gear-icon `SettingsPopover` holding EN/中文 switcher + theme toggle (click-outside + Escape close). Dropped the inline `.lang-switcher` pill, standalone `.theme-toggle`, `.btn-demo`, and `.auth-links .btn-signup` from desktop `.header-actions`; all four remain in the mobile drawer. **Mobile drawer CTA** rebuilt from a crammed 4-item flex row into a vertical stack: Buy Now (full-width gold) over Demo (full-width outlined) over a `.mobile-nav-cta-auth` 50/50 Login | Sign up pair, collapsing to a single full-width Log out when authenticated. All buttons share 48px min-height touch targets. New `components/layout/SettingsPopover.tsx`, CSS in `components.css` (lines 415-544), mobile CSS in `pages.css` (lines 2791-2881, small-phone override 3417-3428). i18n `nav.settings` / `settingsLang` / `settingsTheme` in EN + ZH. **Revert:** removed the `<RelatedPages>` "Keep exploring GCSS" grid from every page (Home, B2B, B2C, Pricing, Contact, FAQ, Forum, Blog list, Docs, About, Careers, Partners) — didn't earn its real estate. Deleted `components/sections/RelatedPages.tsx`, the 97 lines of `.related-pages*` CSS in polish.css, and the `related.*` i18n namespace in both locales. Build green both times (100 static pages). Two deploys to 47.242.75.250. (Left `next.config.ts` `allowedDevOrigins` for LAN HMR uncommitted — dev-only.)
