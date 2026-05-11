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

- 2026-05-11 (remove home section dividers + frosted-glass header + home-hero header variant + laptop+phone hero composition): (1) Deleted the global `.section + .section::before` / `.section + .section-alt::before` / `.section-alt + .section::before` "Glass Section Dividers" rule from `website/frontend/src/app/styles/sections.css` (~lines 3440-3455). It drew a 1px gradient hairline (transparent → border-light → primary-dim → border-light → transparent) at the top of every section that followed another section — visible most prominently on the homepage above the `使用流程` / "3-step onboarding" header, and between all home sections. Removed globally; affects every page that stacks sectioned content. (2) Header background opacity lowered (~95%+) for the proper frosted-glass look (`components.css` `.header`): default unscrolled `rgba(255,255,255,0.85)` → `0.04` with `backdrop-filter: blur(40px) saturate(200%)`; scrolled `0.95` → `0.10` with `blur(28px) saturate(180%)`; dark counterparts `rgba(12,10,9,0.85)/0.95` → `0.04/0.10`. Bottom border switched from `var(--border-subtle)` to faint white (`rgba(255,255,255,0.10)`-ish) so it reads as a glass edge highlight rather than a hard line over the hero video. Scrolled shadow softened from `0.06` → `0.04`. (3) Added a homepage-hero-scoped override `body:has(.hero-with-video) .header` (covers BOTH unscrolled and scrolled states): unscrolled is dark glass at `rgba(0,0,0,0.08)` + `blur(44px) saturate(180%)`; scrolled deepens to `rgba(0,0,0,0.32)` + `blur(32px) saturate(180%)` with a stronger drop shadow `0 4px 18px rgba(0,0,0,0.18)` so the bar stays defined when it travels over white sections after the hero. Non-home pages keep the white-glass variant. (4) In the same `:has(.hero-with-video) .header` scope (no `:not(.scrolled)` — applies in both states), switched nav text/icons to white: `.logo`, `.btn-login`, `.settings-trigger` to `#ffffff`; `.nav a` and `.nav-dropdown-trigger` idle at `rgba(255,255,255,0.82)`; hover/active variants (`.nav a:hover/.active`, `.nav-dropdown-trigger:hover/.active`, `.btn-login:hover`, `.settings-trigger:hover/[aria-expanded="true"]`) to `#ffffff`. The dropdown triggers (`产品`, `社区`) and settings gear are `<button>`s (not `.nav a`) so they need explicit selectors. Settings-trigger border softened to `rgba(255,255,255,0.18)`. SVG chevrons follow `currentColor` automatically. The user explicitly wanted the bar/text to read as white glass throughout home scrolling, not just over the hero — `.scrolled` fires at scrollY>20 so the bar would otherwise flip to dark-on-white before the hero is even out of view. (5) Hero composition reworked from "browser-chrome dashboard card + phone overlapping LEFT edge" to "laptop frame + phone overlapping LOWER-RIGHT corner" (reference: Figma → Webflow promo image). JSX: replaced `.hero-mock-cpo` (with traffic-light bar + `cpo.gcss.hk` URL chip) with `.hero-mock-laptop` containing `.hero-mock-laptop-screen` (thin black bezel hugging the dashboard image) and `.hero-mock-laptop-base` (a 14px wedge 12% wider than the screen via negative margins, gradient `#34302c → #1c1916 → #100e0c`, with a centered hinge notch via `::before`). Phone repositioned from `top:16% left:-10%` → `top:36% right:-10%` (left:auto), width tightened from 36% → 30%. `.hero-mock` width clamp bumped slightly (260-500 → 280-540) to keep the laptop legible at common viewports. Old `.hero-mock-cpo*` selectors deleted.
