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


- 2026-05-18 — `8abb264`: restyled the b2c "现代化 EV 充电的强大功能" 6-feature section from `grid grid-3` of `card glass-card tilt-card` boxes into a minimal hairline lined grid. `b2c/page.tsx` ~177-252: wrapper class `grid grid-3`→`b2c-feature-lined-grid`, each cell `card glass-card tilt-card`→`b2c-feature-cell` (kept feature-card-icon + h3 + p). New scoped CSS in `sections.css` just above the `.b2c-demo-grid` block (~375): 3-col grid, hairlines via container border-top/left + cell border-right/bottom (rgba 0,0,0,0.09; dark mirror 255,255,255,0.1), 44/40 padding, faint hover bg, h3 1.25rem, p --text-secondary; responsive 3→2 (≤900)→1 (≤600). `.b2c-feature-*` is b2c-only (no bleed). tsc clean. PRIOR `d045cde`: removed the b2c product page "专属 UI 定制服务 / 极简部署" two-card grid-2 block (was `b2c/page.tsx` ~355-373, between APP/H5 and Global Payment Matrix) per user red-box request; `product.uicustom.*`/`product.zeroconfig.*` i18n keys left intact (unused now). tsc clean, pushed to fork `design-draft-local`. PRIOR same day (unify b2c "系统演示" section style w/ /demo platform-editions): commit `8600a5b` (pushed to fork `design-draft-local` per PUSH POLICY below — clean fast-forward). Earlier same session: `7fb32cb`/`0318b04` swapped `public/images/OEM.png` (b2c "Your Brand. Your Rules." section, `b2c/page.tsx:294`) to a user-pasted "Scan & Charge" PNG; `f00dc5e` was prior b2c APP/H5 phone-frame slideshow polish. THIS task: user pasted 2 screenshots — red box on the b2c product page's "系统演示" section (`b2c/page.tsx:610-645` + `b2c/DemoTabs.tsx`, msg keys `product.demo.*`) + target = standalone `/demo` page's "多租户平台版本" section (`demo/page.tsx` #demo-b2b; `.demo-edition-card`/`.demo-cred-block`/`.demo-b2b-qr-row` in route-scoped `demo/demo-page.css`). AskUserQuestion → user chose **"Match shell, keep content"** (restyle to target look, keep CPO/demo-account/H5+APP/status-pill content, NO invented feature bullets — the other option "full restructure w/ bullets" was explicitly NOT chosen; if wanted later it adds `product.demo.*.b1/b2/b3` i18n + a 2-wide-plan-card layout). FIX (3 files, all b2c-scoped — `.demo-*` classes are route-scoped to `demo/demo-page.css`, NOT loaded on /b2c, so the look was REPLICATED onto `.b2c-demo-*` classes, not shared, to avoid cross-route bleed): (a) **rewrote `b2c/DemoTabs.tsx`**: was a 2×2 grid of 4 plain centered cards. Now a fragment: `.b2c-demo-grid` (2 cards — CPO: icon-badge head + title + mono host tag `admin.demo.gcss.hk` + desc + `打开 CPO 后台` btn-primary; 演示账户: head + tag `app.gcss.hk` + `.b2c-demo-creds` block w/ header + 2 `CredRow`s) THEN full-width `.b2c-demo-qr-row` (H5 QR + APP QR + text/link col: `product.demo.desc` + btn-outline → APP_URL). Added internal `CredRow` client subcomponent (useState copied, navigator.clipboard, 1.6s reset; mirrors `demo/CopyableField.tsx` but emits `.b2c-demo-cred-*`). i18n: REUSED existing global keys only (`demo.page.copy|copied|credentials|launchDemo` + existing `product.demo.*`) — ZERO new/changed strings, EN/ZH in sync. (b) **`sections.css` ~374-471**: replaced the whole old `.b2c-demo-*` block with a shell mirroring `.demo-edition-card`+`.demo-cred-block`+`.demo-b2b-qr-row` token-for-token (`.b2c-demo-card-icon` 48px gold #FEBF1D glow; `.b2c-demo-creds` #F1F2F4 radius12; `.b2c-demo-qr-row` grid auto/auto/1fr; `.b2c-qr` 160px #F1F2F4 radius20; each block has a `[data-theme="dark"]` mirror). OLD `.b2c-demo-card-foot` rule DELETED (now-unused). (c) **`pages.css:2765` `.b2c-demo-stage` max-width 800→1100** (would otherwise clamp the 1100-wide grid; status-bar pills `.b2c-demo-pill` UNTOUCHED — already matched). `npx tsc --noEmit` CLEAN; /en/b2c HTTP 200 on pre-existing dev server :8000 w/ new classes in served HTML. **NOT VISUALLY VERIFIED** (autodebug needs user preview+debug); robust-by-construction. If revisiting: top 2 cards have unequal content height (CPO desc+btn vs 演示账户 creds) — `height:100%`+`margin-top:auto` keeps CTAs aligned; `.b2c-qr` 160px vs /demo's 180px (bump for exact parity if asked); QR-row 3rd-col btn = `DemoTabs.tsx` last `<a>`. `.b2c-demo-*`/`.b2c-qr` are b2c-only (b2b=`.b2b-demo-*`, /demo=`.demo-*`) — no bleed. PRIOR (kept for context): b2c APP/H5 slideshow polish (commit `f00dc5e`, on fork branch `design-draft-local`).

  **PUSH POLICY (settled):** push every commit with `git push fork main:design-draft-local`. Local `main` → fork branch `design-draft-local`. NEVER force-push or touch fork `main` (it holds 54 security-pin/contact-page commits that diverged from local at `8a4d15c` on 2026-05-11; local-only design work is the 400+ commits). `origin` = `anindya127/Design-draft` also diverged — don't push there.

  **Current b2c `/[locale]/b2c` state (3 same-day changes, all live):**
  1. `a1d0d59` — moved the `{/* APP / H5 */}` ScrollAnimation block to sit right after the "Your Brand"/`product.brand` `feature-row reverse` block and before `{/* Exclusive UI Customization & Zero-Touch Config */}`; its wrapper `marginTop` is `40`. Section order in Section 4 `.container`: ui → brand(reverse) → APP/H5 → uicustom/zeroconfig grid-2 → Payment Matrix → 20+ Languages(#multilingual) → Smart Ops.
  2. `385ca3a` — sized the slideshow box to match the brand image above: `src/app/styles/sections.css` `.feature-image-placeholder:has(.app-slideshow)` now `aspect-ratio:4/3` (was `aspect-ratio:auto; min-height:520px`), plus phone-fit sub-rules `.app-slideshow{container-type:size; padding:8px 0}`, `.app-slideshow-track{width:auto; height:calc(100cqh - 36px)}` (cqh-responsive, derives width from base `aspect-ratio:9/19.5`), `.app-slideshow-dots{margin-top:10px}`. If phone too small → bump `100cqh - 36px` toward `- 20px` (don't change the 4/3 — it intentionally matches the row above).
  3. `28f1535` — (a) same `:has(.app-slideshow)` rule `background:transparent` → `#F1F2F4` (rounded card matching the OEM "Your Brand" row above). (b) Slide mechanic changed from cross-fade to a real horizontal carousel: added `.app-slideshow-screen{position:absolute;inset:10px;border-radius:40px;overflow:hidden;z-index:1}` (clip box inside the phone bezel — the `.app-slideshow-track` bezel keeps `overflow:visible` so its `::after` dynamic-island notch at z-index:3 stays over the screen) + `.app-slideshow-rail{display:flex;width/height:100%;transition:transform 600ms cubic-bezier(.16,1,.3,1)}`; `.app-slideshow-slide` is now `flex:0 0 100%` (no more absolute/opacity); reduced-motion now kills `.app-slideshow-rail` transition. `AppSlideshow.tsx`: slides wrapped in `<div class="app-slideshow-screen"><div class="app-slideshow-rail" style={{transform:translateX(-index*100%)}}>…</div></div>`, no per-slide `is-active` class. Auto-advance 2000ms + dots unchanged. `npx tsc --noEmit` PASSES.
  4. `035c84c` — fixed the wrap quirk: `AppSlideshow.tsx` now appends a clone of `SLIDES[0]` after the 9 real slides (`CLONE_INDEX = SLIDES.length`); `index` increments without modulo (`advance` = `i+1`), and an `onTransitionEnd` on the rail detects `index === CLONE_INDEX` → sets `animate=false` + `index=0` (rail jumps back to slide 0 with `transition:'none'` so it's invisible), then a double-`requestAnimationFrame` effect re-enables `animate` for the next move. Dots use `realIndex = index % SLIDES.length`. Result: loop slides forward seamlessly, no backward sweep. `npx tsc --noEmit` PASSES.
  5. `f00dc5e` — scaled the iPhone frame to the shrunken phone (fixed px bezel/radius/island looked oversized in the 4:3 box). Added scoped overrides in the `:has(.app-slideshow)` block using `cqh` (1% of `.app-slideshow` box height ≈ phone height): `.app-slideshow-track{border:0.3cqh solid #2a2a2a;border-radius:7.5cqh;padding:1.3cqh}`, `.app-slideshow-screen{inset:1.3cqh;border-radius:6.2cqh}` (inset must equal track padding so screen sits flush in bezel), `.app-slideshow-track::after{top:2.2cqh;width:13cqh;height:4cqh}` (island; border-radius stays 999px pill). Base px rules at sections.css ~486-518 untouched (fallback). To tune: thinner bezel→lower the two `1.3cqh`; less round→lower `7.5cqh`/`6.2cqh`; smaller island→lower `13cqh`/`4cqh`. Pure CSS.

  6. `4ed922d` — (HOMEPAGE `/[locale]`, not b2c) user asked to move the hero text block (label/title/desc/buttons/stats) up a bit. `pages-extracted.css`: `.hero.hero-centered` top padding extra `clamp(6px,1.2vh,20px)` → `clamp(2px,0.5vh,8px)` (the `72px +` fixed-header buffer KEPT), and `.hero-centered-inner` top padding `clamp(14px,2.4vh,36px)` → `clamp(4px,0.8vh,12px)`. Net ≈ 20–36px higher. Mobile/short-vh overrides at ~2565/2589 unchanged. Pure CSS; if user wants it higher still, trim those two clamps further (don't touch the `72px`).

  7. `004c425` — (HOMEPAGE) widened the gap between the 3 hero stats and the dashboard illustration below: `pages-extracted.css` `.hero-dashboard-mock` top margin `clamp(4px,0.8vh,14px)` → `clamp(12px,2vh,26px)` (~+8–12px). The total stats↔mock spacing also includes `.hero-centered-inner{gap:clamp(10px,1.6vh,20px)}` — bump that too if more is wanted. Pure CSS.

  8. `75eae7c` — (b2c) moved the `{/* Smart Operations Center */}` block (`product.ops.*`, `feature-row reverse`, `smart-ops-dashboard.png`, `marginTop:40`) from the END of Section 4 (it was after the `20+ Global Languages`/#multilingual block, last before `</div></section>`) to right AFTER the `{/* APP / H5 */}` block and before `{/* Global Payment Matrix */}`. New Section-4 order: ui → brand(reverse) → APP/H5(feature-row) → Smart Ops(feature-row reverse) → Payment Matrix → 20+ Languages(#multilingual). Pure JSX reorder, no i18n/CSS change; `npx tsc --noEmit` PASSES. To undo: move the same block back to just before the Section-4 closing `</div>`.

  **NOT VISUALLY VERIFIED** (autodebug needs user to open preview + enable debug) — all changes are robust-by-construction but unconfirmed in-browser.

  **Older still-relevant flags (do NOT reapply unless asked):** homepage hero `.hero.hero-centered .hero-centered-inner` uses `url('/images/hero-grid-bg.png') cover` — a CSS dot-grid was tried then REVERTED (`6ed2f2b`). b2c `.product-hero::before` light-mode dot field IS live (`d692ec4`, gold `rgba(214,158,0,0.55)` 2.5px/24px; pale-yellow on `#F1F2F4` ≈ invisible — use darker gold ≥0.4 alpha for texture on that bg); same selector also styles the b2b hero. Homepage yellow nav bar was reverted (`bcbd0aa`); `logo-globe.png` recoverable via `git show 8fef934`. b2c `.product-hero` is `min-height:calc(100svh - 42px)` flex-column with `.hero-footer-bar{margin-top:auto}` pinning the 3 stats to the fold (b2b shares `.product-hero` — verify if touching).
