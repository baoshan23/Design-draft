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

- 2026-05-16 (REVERT home/header yellow nav bar → restore previous colors): user said "帮我把首页的顶部导航栏恢复之前的颜色，包括logo，"GCSS"，按钮，按钮上的文字" (restore the homepage top nav bar to its previous colors — logo, "GCSS", buttons, button text). The yellow nav bar had been built up over a 5-commit stack: `cf26228` (yellow bar + invert same-yellow active-link/btn-buy collisions to white), `3469e01` (btn-buy text → gold, active nav weight 700→800), `92ffabc` (.logo span "GCSS" → white), `8fef934` (globe-with-GCSS logo.png swap on home + Header.tsx renders 2nd `<Image>` w/ logo-default/logo-yellow classes + adds `public/assets/logo-globe.png`), `1b7ee8d` (scroll-progress bar → white). These 5 are interleaved in linear history with unrelated commits (`43e5e01` b2c sections, `0381f0f`/`9787d47` pricing sections.css, `7821fee` docs, `7bae975` next-env) which touch DIFFERENT files, so `git revert --no-commit 1b7ee8d 8fef934 92ffabc 3469e01 cf26228` (newest→oldest) applied with ZERO conflicts. Result committed as single `bcbd0aa revert(home/header): restore pre-yellow nav bar`. VERIFIED: `git diff cf26228^ -- components.css Header.tsx` is EMPTY → both files byte-identical to the pre-yellow state; `logo-globe.png` deleted. Homepage header is back to: white bar unscrolled / frosted-glass `rgba(255,255,255,0.32)` blur(32px) when `.scrolled`, dark-grey nav text, `.nav a.active`/dropdown-trigger → `var(--primary)` gold text+underline (NOT white), gold `var(--primary)`-bg `.btn-buy` with dark text, gold "GCSS" `.logo span`, default `logo.png` icon (single `<Image>` in Header.tsx, no logo-default/logo-yellow classes), scroll-progress bar back to gold `var(--primary)`. Header rules live in `website/frontend/src/app/styles/components.css` ~lines 116-215 under the `body:has(.hero-with-video) .header` selectors (`.hero-with-video` = homepage marker); Header.tsx logo block at ~line 119. NO i18n changes (none needed). `npx tsc --noEmit` NOT re-run — pure revert to a previously-shipped compiling state (Header.tsx change only REMOVES a 2nd `<Image>`). NOTE TO FUTURE CLAUDE: if the user wants the yellow nav bar BACK, the 5 reverted commits' diffs are recoverable via `git show <sha>` for each of cf26228/3469e01/92ffabc/8fef934/1b7ee8d (or `git revert bcbd0aa`), but `logo-globe.png` (66943-byte binary, was at `public/assets/logo-globe.png`) is also restorable from `git show 8fef934 -- ...:logo-globe.png` history. The demo page (`/[locale]` is home; demo is a separate page) has its OWN yellow-hero header rules further down in components.css (`body:has(.demo-hero)` or similar — search "Demo page (yellow hero)") which were UNTOUCHED by this revert. PRIOR (different sessions): pricing Optional Extensions gold→yellow + taller cards (`0381f0f`/`9787d47`); b2c hero illustration 4-card stack → single monitor (`43e5e01`); home hero compress for marquee visibility (`c46845b`).

