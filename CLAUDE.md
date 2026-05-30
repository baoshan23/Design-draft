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

- 2026-05-30 — Two threads, both pushed fork `design-draft-local`.
  - `7af5764` — **Homepage `#models` "Flexible Operating Models" section background → white** (`pages.css` 3167, CSS-only). The Business-Models band (between the manufacturer logo strip and the "Native iOS & Android app" block) rendered on `var(--dark)`=`#F1F2F4` from the generic `.section-alt{background:var(--dark)}` rule at `pages.css` 1247. Same file already had an override `#how-it-works.section-alt, #features.section-alt{background:#fff}` at line 3167 — added `#models.section-alt` to that selector list, no new rule. Markup unchanged. Revert: drop `#models.section-alt` from the comma-list.
  - `9506399` — **b2c (`/[locale]/b2c`) `#gallery` "产品展示" relayout: 3D cluster → row-of-4 with hover-to-feature** (`Gallery3D.tsx` rewrite + `polish.css` ~572-690 replaced). User wanted the reference-image pattern: four phones in a horizontal row, one phone "featured" (larger + slight tilt + lift) at a time, hover/focus hands the spotlight to that phone. **Old**: `Gallery3D` rendered `.gallery-3d > .gallery-3d-stage > 4×.g3d-phone` absolute-positioned into 4 `.g3d-slot-{bl,br,fl,fr}` slots (back-pair tilted away, front-pair leaned in, mouse parallax scene-tilt). **New**: `.gallery-row` flex container, four `.g3d-phone`s in source order, `useState(1)` tracks the active index (default index 1 ≈ second phone matches the reference), `onMouseEnter`/`onFocus` set active, `onMouseLeave` on the container restores default `1`. CSS: `.gallery-row{display:flex;justify-content:center;align-items:center;gap:32px;padding:80px 16px 60px}` (top padding leaves room for the lifted phone), `.g3d-phone{width:180px;transform-origin:50% 70%;filter:drop-shadow(0 18px 24px rgba(0,0,0,.18));transition:transform .55s cubic-bezier(.22,1,.36,1),filter .55s}`, `.g3d-phone.is-active{transform:scale(1.4) translateY(-22px) rotate(-3deg);z-index:5;filter:drop-shadow(0 36px 44px rgba(0,0,0,.32))}`. Kept the graphite `.g3d-device` body + metallic `::before` rim + `.g3d-screen` + `.g3d-notch` mockup intact (only removed the absolute-positioning shadow that was redundant with the per-phone drop-shadow filter). Mobile (`max-width:760px`): `.gallery-row` becomes a 2-col grid, `.g3d-phone.is-active` is just a small `translateY(-6px)` (no scale). `prefers-reduced-motion` zeros the transition. `tsc` 0. Revert: restore the old `Gallery3D.tsx` (4 absolute slots + scene-tilt useState) and the old `.gallery-3d`/`.gallery-3d-stage`/`.g3d-slot-*` CSS block.

  **PUSH POLICY (settled):** push every commit with `git push fork main:design-draft-local`. Local `main` → fork branch `design-draft-local`. NEVER force-push or touch fork `main` (it holds 54 security-pin/contact-page commits that diverged from local at `8a4d15c` on 2026-05-11; local-only design work is the 400+ commits). `origin` = `anindya127/Design-draft` also diverged — don't push there.

  **Older still-relevant flags (do NOT reapply unless asked):** b2c `#features` section 4 has an `AppSlideshow` carousel — a separate phone slideshow in a `4/3` `.feature-image-placeholder:has(.app-slideshow)` card (do not confuse with the `Gallery3D` `#gallery` cluster). homepage hero `.hero.hero-centered .hero-centered-inner` uses `url('/images/hero-grid-bg.png') cover` — a CSS dot-grid was tried then REVERTED (`6ed2f2b`). b2c `.product-hero::before` light-mode dot field IS live (`d692ec4`, gold `rgba(214,158,0,0.55)` 2.5px/24px; pale-yellow on `#F1F2F4` ≈ invisible — use darker gold ≥0.4 alpha for texture on that bg); same selector also styles the b2b hero. Homepage yellow nav bar was reverted (`bcbd0aa`); `logo-globe.png` recoverable via `git show 8fef934`. b2c `.product-hero` is `min-height:calc(100svh - 42px)` flex-column with `.hero-footer-bar{margin-top:auto}` pinning the 3 stats to the fold (b2b shares `.product-hero` — verify if touching). The running `next dev` on :8000 can develop a dead file-watcher (container inotify limit) and serve a stale CSS bundle — if an edit doesn't show, kill it, `rm -rf .next`, restart `npm run dev`.
