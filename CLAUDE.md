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

- 2026-05-21 — **b2c (`/[locale]/b2c`) `#gallery` "Product Gallery": replaced the flat 4-phone screenshot row with an interactive 3D perspective phone cluster** (new file `Gallery3D.tsx` + `b2c/page.tsx` + `polish.css`; `tsc` 0). User pasted a before-screenshot (4 flat phone screenshots in a `grid grid-4` row) and a 3D angled-mockup reference, asked to convert to that style + add interaction. Via AskUserQuestion the user chose: **keep all 4 screenshots** in a 3D cluster (2 back standing + 2 front leaning) and **both** interactions (mouse parallax + hover pop).
  - **New client component** `src/app/[locale]/b2c/Gallery3D.tsx` — props `phones: {src,label}[]`. Renders `.gallery-3d` (`perspective:2000px`) → `.gallery-3d-stage` (`preserve-3d`, gets inline `rotateX/rotateY` from `onMouseMove`) → 4 `.g3d-phone` each `.g3d-slot-{bl,fl,fr,br}`. Each phone = `.g3d-device` (dark CSS iPhone bezel) › `.g3d-screen` (overflow-hidden) › next/`Image`, plus `.g3d-notch` (dynamic-island pill) and `.g3d-label` (caption). Parallax: cursor offset → `setTilt({rx:py*6, ry:-px*9})` (cluster leans toward cursor); disabled under reduced-motion and when `innerWidth<=760`. Phones are `tabIndex=0 role="img" aria-label={label}`, image `alt=""`.
  - **`b2c/page.tsx`** — replaced the `<div className="grid grid-4 gallery-grid">` (4 `.gallery-phone` Images) with `<Gallery3D phones={[home,charging,map,payment]}/>`; added `import Gallery3D from './Gallery3D'`. Slot mapping by array order: home→back-left, charging→front-left, map→front-right, payment→back-right. i18n unchanged (`product.gallery.*` already in EN+ZH).
  - **`polish.css`** — removed the old `.gallery-grid` / `.gallery-phone` / `.gallery-label` rules + `@keyframes gallery-float`; added the `.gallery-3d` / `.g3d-*` block (right where the old one was, ~line 572). Slot base transforms: back pair `translateZ(-90px) rotateX(7) rotateY(±31) rotateZ(∓6)` width `17.5%`; front pair `translateZ(70px) rotateX(11) rotateY(±23) rotateZ(∓6)` width `20%`; positioned with `left`/`top` % + `translate(-50%,-50%)`. `:hover,:focus-visible` → straighten (all rotate 0) + `translateZ(240px)` + gold `0 0 0 3px` ring on `.g3d-device` + caption fades in. `.gallery-3d::after` = soft floor contact shadow. `@media(max-width:760px)` collapses the stage to a flat 2-col grid (`transform:none !important`, captions always visible). Also removed the now-stale `.gallery-phone` from the reduced-motion `animation:none` list (~line 902).
  - VERIFIED: `npx tsc --noEmit` PASSES; served dev CSS (`/_next/static/chunks/src_app_*.css`) contains `.g3d-phone`/`.gallery-3d` and `gallery-float` is gone; page HTML emits all `g3d-*`/`gallery-3d` classes. **NOT VISUALLY VERIFIED in-browser** (autodebug needs the user to open the preview + enable debug). Tune knobs: slot geometry → `polish.css` `.g3d-slot-*`; parallax strength → `Gallery3D.tsx` `setTilt` multipliers; if the cluster overflows vertically lower the front `top:58%` or shrink the `width` %s. Revert: delete `Gallery3D.tsx`, restore the old `grid grid-4 gallery-grid` block in `page.tsx` and the old `.gallery-*` CSS block in `polish.css`.

  **PUSH POLICY (settled):** push every commit with `git push fork main:design-draft-local`. Local `main` → fork branch `design-draft-local`. NEVER force-push or touch fork `main` (it holds 54 security-pin/contact-page commits that diverged from local at `8a4d15c` on 2026-05-11; local-only design work is the 400+ commits). `origin` = `anindya127/Design-draft` also diverged — don't push there.

  **Older still-relevant flags (do NOT reapply unless asked):** b2c `#features` section 4 has an `AppSlideshow` carousel — a separate phone slideshow in a `4/3` `.feature-image-placeholder:has(.app-slideshow)` card (do not confuse with the new `Gallery3D` `#gallery` cluster). homepage hero `.hero.hero-centered .hero-centered-inner` uses `url('/images/hero-grid-bg.png') cover` — a CSS dot-grid was tried then REVERTED (`6ed2f2b`). b2c `.product-hero::before` light-mode dot field IS live (`d692ec4`, gold `rgba(214,158,0,0.55)` 2.5px/24px; pale-yellow on `#F1F2F4` ≈ invisible — use darker gold ≥0.4 alpha for texture on that bg); same selector also styles the b2b hero. Homepage yellow nav bar was reverted (`bcbd0aa`); `logo-globe.png` recoverable via `git show 8fef934`. b2c `.product-hero` is `min-height:calc(100svh - 42px)` flex-column with `.hero-footer-bar{margin-top:auto}` pinning the 3 stats to the fold (b2b shares `.product-hero` — verify if touching). The running `next dev` on :8000 can develop a dead file-watcher (container inotify limit) and serve a stale CSS bundle — if an edit doesn't show, kill it, `rm -rf .next`, restart `npm run dev`.
