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

- 2026-05-15 (b2c hero illustration: replace 4-card dashboard stack with single monitor mockup): user pasted two screenshots and said "这里的插图，更换成…". Confirmed via AskUserQuestion that they wanted **single image, remove stack** (other options: replace only the front card, or remake all 4 in the new monitor style — user chose the first/destructive option). The b2c hero (`/[locale]/b2c` page id `#overview` — verified the screenshot's "OCPP CPMS Independent Operator Mode (B2C)" copy lives at `src/app/[locale]/b2c/page.tsx:61` with title `t('product.title2')` + `<span className="hero-title-b2c">(B2C)</span>`) previously rendered `<HeroShotStack />` on the right side of `.hero-content.hero-split` — that client component (`src/components/sections/b2c/HeroShotStack.tsx`, now deleted) showed 4 flat dashboard PNGs (`/images/dashboard-home.png`, `dashboard-merchants.png`, `dashboard-home-alt.png`, `dashboard-stations.png`) fanned bottom-left-pivot with rotations 0/2.5°/5°/7.5°/10°, and clicking a back card brought it to front (interaction was a real feature). **CHANGES**: (1) New asset `public/images/b2c-hero-monitor.png` (~725KB, copied from user paste `/tmp/claude-paste-1778838195514-31309bd3.png`) — note this PNG already has its own monitor frame + transparent background, so it does NOT need the white card-bg / inset-shadow / border that the old `.hero-shot-front` wrapper applied. (2) `src/app/[locale]/b2c/page.tsx:21`: dropped `import HeroShotStack from '@/components/sections/b2c/HeroShotStack'`. (3) `src/app/[locale]/b2c/page.tsx:75` (`<HeroShotStack />`): replaced with inline `<div className="hero-shot"><Image src="/images/b2c-hero-monitor.png" alt={t('product.title2')} width={1200} height={900} priority sizes="(max-width: 960px) 100vw, 560px" style={{ width: '100%', height: 'auto', display: 'block' }} /></div>`. Reused the existing `.hero-shot` wrapper class (lines ~1417 in sections.css) since it only sets `position: relative; width: 100%; isolation: isolate` — no decorations that would clash with the monitor PNG's built-in frame. `priority` flag kept (was on the old front card too) — this is above-the-fold LCP image. (4) Deleted `src/components/sections/b2c/HeroShotStack.tsx` entirely (verified via grep it was only imported on the b2c page). (5) `src/app/styles/sections.css` cleanup: removed dead classes `.hero-shot-front` (lines 1429-1439) + its dark-theme variant (1441-1447) + animation rule (1553-1555) + `@keyframes heroShotFrontIn` (1557-1560); removed entire stack-deck system: `.hero-shot-deck` (1451-1454) + `.hero-shot-back` base + focus + img + dark (1456-1491) + `.hero-shot-back--1..4` (1496-1536) + hover variants under `@media (hover: hover)` (1540-1550); collapsed the mobile `@media (max-width: 960px)` block (1562-1576) — kept `.hero-with-shot .hero-split` grid override (centers single column at 720px) but removed the now-redundant `.hero-shot { margin-top: 8px }` (an identical `.hero-with-shot .hero-shot { margin-top: 8px }` already exists at line 1294) and removed the `.hero-shot-deck { display: none }` mobile-hide (dead — class no longer exists). Net: ~155 CSS lines removed. (6) `npx tsc --noEmit` clean (HeroShotStack was only consumer of these classes — verified by `grep -rn "hero-shot-front\|hero-shot-back\|hero-shot-deck\|heroShotFrontIn"` finding hits only inside sections.css itself). **WHAT'S KEPT**: `.hero-with-shot .hero-split` (parent grid 1fr/580px) at line 1282-1287 and `.hero-with-shot .hero-shot { margin-top: clamp(16px, 8vh, 120px) }` at line 1289-1291 — these still govern layout. Base `.hero-shot` (1417-1421) and `.hero-shot img` (1423-1427) remain — wrap the new single image. NO i18n changes (alt text reuses existing `t('product.title2')`). NO commits yet for this change — about to commit + push to fork per workflow. NOTE TO FUTURE CLAUDE: if the user wants the monitor-image WITH a card frame / drop shadow underneath, add styling on `.hero-shot` directly (not `.hero-shot-front` which is now deleted) — but the monitor PNG already has visual depth from its built-in display bezel, so adding shadow would likely look redundant. If user wants the 4-card stack effect BACK (says "I miss the old stack"), restore `HeroShotStack.tsx` from git (`git show HEAD:website/frontend/src/components/sections/b2c/HeroShotStack.tsx`) AND restore the CSS block (`git show HEAD:website/frontend/src/app/styles/sections.css | sed -n '1429,1576p'`) — both files committed in this turn's revert-base. If user wants to keep the single-image approach but show different illustration for B2B vs B2C, the analogous file is `src/app/[locale]/b2b/page.tsx` (different page, may not use HeroShotStack — check first). The new asset filename `b2c-hero-monitor.png` is descriptive; if user later wants to swap it again, just overwrite that file or update the `src=` path. PRIOR (different sessions): home header yellow + same-yellow children invert to white (commit `cf26228`); home hero compress for marquee visibility (`c46845b`); home hero stats re-add + dashboard fade (`7352711`).
