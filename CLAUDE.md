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


- 2026-05-18 — **b2c "强大功能" (`#features`) restyled to mirror getmoss.com's feature grid** (user gave a Moss screenshot + the yellow-box screenshot as the target for "这一屏的样式 / 黄色框的布局内容和样式"). Two files, CSS-only + one className: (1) `b2c/page.tsx` — the features `<div className="section-header">` got the extra class `b2c-feature-head` (no other JSX change; the 6 cells keep DOM order `icon, h3, p`). (2) `sections.css` `.b2c-feature-cell` block rewritten: cell is now `display:flex; flex-direction:column`; the visual order is reflowed via flex `order` WITHOUT touching JSX — `h3{order:1}` (Moss title: 1.05rem/600/#181818, **green `+` `::before` removed**), `p{order:2}` (Moss body: 0.9rem/400, normal-case, line-1.6, #6c717a — was tiny uppercase stat caption), `.feature-card-icon{order:3}` turned into the bottom "product visual" tile (`margin-top:28px; min-height:168px; flex-center; border-radius:14px; bg linear-gradient(150deg, rgba(254,191,29,.10), rgba(0,0,0,.03)); 1px rgba(0,0,0,.05) border; inner svg 64×64`). Cell pad 52→48. Added dark mirrors for h3/p/visual + new `.b2c-feature-head` rule (left-aligns the header — `text-align:left; max-width:820px; margin:0 0 44px`; h2 `clamp(2rem,3.4vw,2.9rem)/700/lh1.15`; p 1.05rem/max-560; label mb 18). All scoped `.b2c-feature-*`/`.b2c-feature-head` — b2c-only, no cross-route bleed. `npx tsc --noEmit` CLEAN. **NOT VISUALLY VERIFIED** (autodebug needs user preview). To revert the Moss look: restore the prior `.b2c-feature-cell` block (stat-band: `.feature-card-icon` was a 14px-margin top icon, h3 had green `+` `::before`, p was 0.72rem uppercase) and drop the `b2c-feature-head` class+rule. NOTE: the cell SVGs are now decorative tiles, not topic icons — if real product screenshots are wanted later, swap the `<svg>` inside `.feature-card-icon` for `<Image>`. ───── PRIOR: **REVERTED** the sticky stacking-card experiment (`git revert` of `735c46b`; working tree now identical to `0ea06c7`). User asked to undo it. Removed: `b2c/StackCards.tsx` (deleted), the `<StackCards>`/`<article className="b2c-stack-card">` wrapper in `b2c/page.tsx` (four `product.ui|brand|app|ops.*` highlights are back to their original `<ScrollAnimation>`-wrapped `feature-row`/`feature-row reverse` rows ~260-408), and the `.b2c-stack*` CSS block in `sections.css`. `npx tsc --noEmit` CLEAN. DO NOT reapply the stacking deck unless asked again — if revisited, the approach was: pure-CSS `position:sticky` pile + a tiny rAF JS shrink/dim of the pinned card as the next rises (progressive enhancement, ≤900px/reduced-motion no-op) — see `git show 735c46b` for the full impl. PRIOR `0ea06c7`: removed the b2c "强大功能" band top/bottom gradient bands (user read them as a shadow) — `.b2c-feature-lined` now plain `border-top`/`border-bottom: 1px solid rgba(0,0,0,0.09)` (dark mirror .1), no `::before/::after` bands. PRIOR `4b099b4`: b2c "强大功能" cells → Moss stat-band look (CSS-only in `sections.css` `.b2c-feature-cell`: `.feature-card-icon{display:none}` — SVG kept in `b2c/page.tsx` for revert; `h3` big `clamp(1.9rem,2.6vw,2.5rem)` weight-500 w/ green `::before "+"` #3fae59; `p` tiny uppercase 0.72rem/600/0.09em `--text-tertiary`; cell pad 44→52). PRIOR `91f0b4e`/`8abb264`/`d045cde`: b2c "强大功能" made full-bleed lined-grid (100vw escape + 2×`.b2c-feature-row`, padding-inline content re-align; KNOWN RISK: 100vw may add a horizontal scrollbar if body lacks overflow-x:clip — unverified) / earlier restyled `grid grid-3` cards → hairline lined grid / removed the UI-custom + zero-config two-card block (`product.uicustom.*`/`product.zeroconfig.*` i18n left intact, unused). `.b2c-feature-*` is b2c-only. PRIOR (context): b2c "系统演示" section restyled to mirror the /demo platform-editions shell (`b2c/DemoTabs.tsx` rewritten + `.b2c-demo-*`/`.b2c-qr` replica in `sections.css`, `.b2c-demo-stage` max-width 800→1100 in `pages.css`; reused existing i18n only, EN/ZH in sync; b2c-only, no cross-route bleed). NOT VISUALLY VERIFIED across these (autodebug needs user preview+debug); robust-by-construction.

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
