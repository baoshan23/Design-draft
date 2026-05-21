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

- 2026-05-21 — **Pricing page (`/[locale]/pricing`) `#plans` "价格方案" section: image backdrop with bottom fade** (`67bf2b0`, pushed fork `design-draft-local`). User pasted a light-blue abstract 3D-plate render + a screenshot of the pricing section, asked to use the render as the section background, fade it out at the bottom, and change the old fill to white.
  - New asset `website/frontend/public/images/pricing-plans-bg.png` (the pasted render, 2560×1440).
  - `pricing/page.tsx` — the `#plans` section's inline style `background:'#F1F2F4'` → `background:'#fff'` (only change; `paddingTop:128` kept).
  - `sections.css` — new block just above `.pricing-tabs-switch` (~line 4093): `.pricing-section--tabs{position:relative;isolation:isolate}` + `.pricing-section--tabs::before` — `position:absolute;inset:0;z-index:-1`, `background:url('/images/pricing-plans-bg.png') center top/cover no-repeat`, and a `mask-image`/`-webkit-mask-image` `linear-gradient(to bottom,#000 0%,#000 52%,transparent 95%)` so the image dissolves into the white section bg toward the bottom. The `::before` paints over the section's own white background and under the in-flow content; `isolation:isolate` keeps the `z-index:-1` from escaping behind ancestors.
  - Tune knobs: fade range → the `52%`/`95%` mask stops; image framing → the `center top/cover` shorthand. Revert: restore `background:'#F1F2F4'` in `page.tsx`, delete the `.pricing-section--tabs` + `::before` block, delete the PNG. `tsc` 0. **NOT screenshot-verified** (autodebug needs the user to open the preview).

  ───── EARLIER (concurrent threads, all committed & pushed `design-draft-local`): (1) b2c `#multilingual` `.b2c-lang-aside .lang-request-card` (~3087): `5dfccb8` added `backdrop-filter:none;-webkit-backdrop-filter:none` to kill ghosted/double-rendered form text (global `.card` filter forced a render-surface inside a clipped+composited layer); then `border-radius:0` (structural, visually invisible — card is transparent/borderless). (2) b2c `#gallery` `Gallery3D.tsx` + `polish.css` `.gallery-3d`/`.g3d-*` (~line 572): replaced the flat 4-phone `grid grid-4` row with a 3D perspective phone-mockup cluster (`.g3d-device` graphite bezel via `::before` gradient-border trick, mouse-parallax + hover-pop, no gold ring, no caption pills, `@media(max-width:760px)` flattens to 2-col). Revert: delete `Gallery3D.tsx`, restore old `grid grid-4 gallery-grid` block + `.gallery-*` CSS. (3) Pricing comparison-table `<thead>` polish: `7765016` sticky header ≥1040px, `725253a` th `padding-bottom:33px`, `42b84c7` header text centred + table-wrap top corners squared, `c247b10` `功能` header cell left-aligned with the feature-name column.

  **PUSH POLICY (settled):** push every commit with `git push fork main:design-draft-local`. Local `main` → fork branch `design-draft-local`. NEVER force-push or touch fork `main` (it holds 54 security-pin/contact-page commits that diverged from local at `8a4d15c` on 2026-05-11; local-only design work is the 400+ commits). `origin` = `anindya127/Design-draft` also diverged — don't push there.

  **Older still-relevant flags (do NOT reapply unless asked):** b2c `#features` section 4 has an `AppSlideshow` carousel — a separate phone slideshow in a `4/3` `.feature-image-placeholder:has(.app-slideshow)` card (do not confuse with the `Gallery3D` `#gallery` cluster). homepage hero `.hero.hero-centered .hero-centered-inner` uses `url('/images/hero-grid-bg.png') cover` — a CSS dot-grid was tried then REVERTED (`6ed2f2b`). b2c `.product-hero::before` light-mode dot field IS live (`d692ec4`, gold `rgba(214,158,0,0.55)` 2.5px/24px; pale-yellow on `#F1F2F4` ≈ invisible — use darker gold ≥0.4 alpha for texture on that bg); same selector also styles the b2b hero. Homepage yellow nav bar was reverted (`bcbd0aa`); `logo-globe.png` recoverable via `git show 8fef934`. b2c `.product-hero` is `min-height:calc(100svh - 42px)` flex-column with `.hero-footer-bar{margin-top:auto}` pinning the 3 stats to the fold (b2b shares `.product-hero` — verify if touching). The running `next dev` on :8000 can develop a dead file-watcher (container inotify limit) and serve a stale CSS bundle — if an edit doesn't show, kill it, `rm -rf .next`, restart `npm run dev`.
