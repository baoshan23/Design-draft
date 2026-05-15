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

- 2026-05-15 (product pages b2c + b2b: kill the feature-card box-shadows AND any nested icon shadow on these pages): user attached `/tmp/claude-paste-1778829854680-3e8f7188.png` (b2c page below hero, with a red rectangle drawn around the 3×2 grid of feature cards: 独立部署：双模式部署 / 多语言支持 / 30+ 国家支付 / 品牌定制 / 完整 OCPP 支持 / 完善文档) and said "这里的卡片投影去掉，卡片里面的图标投影也去掉". ROOT CAUSE: the 6 feature cards on b2c (and the structurally-equivalent cards on b2b) use class chain `card glass-card tilt-card`. SHADOW SOURCES (FOUR rule blocks, all need defeating): (a) `sections.css:2118-2125` base `.card, .glass-card { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06) }` (subtle drop). (b) `sections.css:2137-2147` premium glass `.card, .model-card, .glass-card { box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255,255,255,0.08) }` (sm shadow + inset highlight). (c) `sections.css:2129-2134` hover `.card:hover, .glass-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1) }`. (d) `sections.css:2150-2159` premium hover `.card:hover, .model-card:hover, .glass-card:hover { box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 30px rgba(254,191,29,0.06) }`. (e) `polish.css:141-149` ANOTHER hover `.card:hover, .glass-card:hover, .feature-card:hover { box-shadow: 0 22px 48px rgba(0,0,0,0.1), 0 0 0 1px rgba(254,191,29,0.22), 0 0 36px rgba(254,191,29,0.14); border-color: rgba(254,191,29,0.3) }`. All five layered shadows had to be defeated for the product pages without nuking shadows site-wide (homepage cards SHOULD keep their shadows). SCOPE DECISION: scoped the override to `body:has(.product-hero)` so it applies to BOTH b2c (which has `.product-hero`) AND b2b (got `.product-hero` added in a previous session) but NOT contact/home/pricing/etc. ONE FILE EDITED: appended to the END of `src/app/styles/pages-extracted.css` (line 2306+). NEW rule block: `body:has(.product-hero) .card, body:has(.product-hero) .glass-card, body:has(.product-hero) .model-card, body:has(.product-hero) .feature-card { box-shadow: none }` + identical-selector `:hover` variant also `{ box-shadow: none }` + a third rule covering nested SVG icons and any element with "icon" in its class name: `body:has(.product-hero) .card svg, ...glass-card svg, ...card [class*="icon"], ...glass-card [class*="icon"] { box-shadow: none; filter: none }`. The `filter: none` strip handles cases where shadows are implemented via `filter: drop-shadow(...)` rather than `box-shadow` — common for SVG icons (which can't take a true box-shadow on the SVG path, only on the wrapper). The `[class*="icon"]` attribute selector catches any class containing "icon" — `.card-icon`, `.feature-icon`, `.icon-gradient--gold`, etc. — broad coverage without needing to enumerate every icon class. SPECIFICITY: `body:has(.product-hero) .card` = (0,2,0) — same as the existing `.card:hover` rules — but my new rule is LATER in source order (`pages-extracted.css` loads after `sections.css` and `polish.css` per the global CSS import order in `app/globals.css`), so cascade gives it priority. For the hover override, `body:has(.product-hero) .card:hover` = (0,3,0) > all existing (0,2,0) hover rules — wins decisively. EFFECT: on b2c + b2b, the 6 feature cards (and any other `.card / .glass-card / .model-card / .feature-card` on those pages) render flat with no drop shadow, no inset highlight, and no glow. Hovering still triggers `transform: translateY(-4px)` and `border-color` change from the unchanged hover rules — so there's still tactile feedback, just no shadow. SVG icons + any "icon-*" element inside cards also lose any shadow/drop-shadow. Other pages (home, pricing, demo, contact, blog, docs, etc.) keep their card shadows UNAFFECTED. CAVEAT: if the b2c/b2b cards had been styled with a shadow that came from a NON-pseudo-`box-shadow` source (e.g. `outline: 2px var(--shadow-color)` or a bg-image gradient simulating depth), this rule wouldn't catch them. Quick scan of the existing rules didn't find any such case for `.card/.glass-card`. NOTE TO FUTURE CLAUDE: if user wants this kill-shadow treatment site-wide (NOT just on product pages), drop the `body:has(.product-hero)` scope prefix from all six selectors — but verify the homepage cards don't lose their visual depth as a result (the homepage feature cards in the matrix/showcase grid use shadows for spatial separation). If user wants the BORDER also removed from these flat cards (they may look "naked" without any visual edge), add `border: none` or `border-color: transparent` to the same rule. If user reports SOME element on b2c/b2b that SHOULD still cast a shadow (e.g. a sticky CTA bar or a tooltip), it won't — those would need a more-specific selector to restore. The hover `transform: translateY` and `border-color` from `polish.css:141-149` are KEPT — if user wants those gone too, append `transform: none` and `border-color: <original>` to the hover override. If user wants the SAME treatment on /demo or /pricing, add the appropriate `body:has(.demo-hero)` or `body:has(.pricing-section)` clause to the selector list. The orphaned `b2cShimmer` keyframe from earlier sessions remains in `sections.css` — unrelated cleanup opportunity. PRIOR (different session): demo page header opacity bumped from 0.04 → 0.92 white via `body:has(.demo-hero) .header` rule, so the nav reads against the yellow demo hero — see commit log.
