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

- 2026-05-15 (b2c features icons REDO — redrew icon #1 扫码即充 and icon #5 OCPP 可视化命令 because user said they "looked weird"): user attached `/tmp/claude-paste-1778832681317-eb699735.png` (the 6-card grid with RED boxes around the #1 扫码即充 icon — showing 3 disconnected small QR-corner squares plus a tiny lightning bolt that read as visual clutter — and the #5 OCPP 可视化命令 icon — showing a thin rectangle with two tiny `< >` markers and an underscore that read as an empty box with stray glyphs). Said "红框的两个图标很奇怪，再调整下". ROOT CAUSE OF THE WEIRDNESS: (1) #1 had 3 SEPARATE hollow rounded squares forming a "QR-corner" pattern — they didn't visually connect into a single scan-able element, just looked like 3 random squares plus a disconnected lightning bolt in the empty corner. (2) #5 had a 38×28 rectangle (too narrow for a "terminal window" silhouette) with bare `< >` glyphs that read as `< >` symbols floating in empty space rather than a terminal prompt. Both icons failed the "instantly recognizable as the feature topic" test. REDESIGNS — ONE FILE EDITED: `src/app/[locale]/b2c/page.tsx`. (1) **扫码即充** (line 175): replaced 3-square pattern with a FOUR-CORNER VIEWFINDER bracket pattern — 4 black L-shaped paths at the 4 corners of an invisible square (top-left: `M6 16 V8 H14`, top-right: `M34 8 H42 V16`, bottom-right: `M42 32 V40 H34`, bottom-left: `M14 40 H6 V32`), each with `strokeWidth="2"` + `strokeLinecap="round" strokeLinejoin="round"`. This is the universal "scan area / camera viewfinder" symbol — instantly recognizable. The yellow lightning bolt CENTERED inside the viewfinder (path `M27 17 L20 27 L26 27 L22 35` with `strokeWidth="2.5"`). Reads as "scan + charge" cleanly. (2) **OCPP 可视化命令** (line 188): replaced the cramped 38×28 thin rectangle with a CLEAN TERMINAL WINDOW: outer rounded rect `x="4" y="8" width="40" height="32" rx="4"` (40×32, fills the icon canvas, reads as a proper terminal window). Added a black horizontal `<line>` at y=17 across the full width — visually creates a TITLE BAR separation between the chrome and the content area (classic terminal window appearance). Inside the content area: black `>` prompt arrow at left (`M11 25 L15 29 L11 33`) + yellow underscore cursor extending from the prompt (`M19 33 H32`). The `>` prompt with yellow cursor IS the standard "command line" iconography — much more recognizable than the prior `< >` bracket pair. Other icons (#2 heart-with-ECG, #3 user-with-key, #4 axis-with-bars-and-trend, #6 laptop+phone) UNCHANGED from the prior turn. Verified `npx tsc --noEmit` clean. NOTE TO FUTURE CLAUDE: if user reports #1 viewfinder corners still feel weak (e.g. "the corners are too tiny"), bump each corner-bracket path's coordinate offsets — change `M6 16 V8 H14` → `M5 18 V7 H16` (extends each L 2px deeper into the canvas). If user wants the lightning bolt to be MORE prominent, push `strokeWidth="2.5"` → `3` or extend the path further (current bolt occupies viewport y=17-35 height range; extending to y=14-38 makes it bigger). If user reports #5 terminal window still feels cramped/weird, the cleanest alternative is removing the title-bar line entirely and adding 3 small black `<circle>` window-controls (traffic-light dots) at top-left of the rect: `<circle cx="9" cy="14" r="1.2" stroke="#181818" strokeWidth="1.5"/>` x3 spaced 5px apart. That reads even MORE like a window. The viewBox is still 48×48 across all 6 icons; the rendered size 40×40 and the wrapper `.feature-card-icon` CSS (`pages-extracted.css` end) are UNCHANGED. ORIGINAL DESIGN APPROACH from the prior turn stands for the other 4 icons: each icon is inline SVG, 40×40 rendered at 48×48 viewBox, strokes only (no fills — true line-icon style per "线性图标"), TWO color groups: `stroke="#181818"` for main outline + `stroke="#FEBF1D"` for one accent element per icon. Main strokes `strokeWidth="2"`; yellow accent `2.5`. All use `strokeLinecap="round"` + `strokeLinejoin="round"`. TWO FILES EDITED: (1) `src/app/[locale]/b2c/page.tsx` lines 168-195 — kept the existing `<div className="card glass-card tilt-card">` x6 structure intact, just inserted a `<div className="feature-card-icon" aria-hidden="true"><svg>...</svg></div>` BEFORE the `<h3>` in each card. The `aria-hidden="true"` keeps screen readers from announcing the decorative SVG (title `<h3>` already conveys the semantic meaning). (2) `src/app/styles/pages-extracted.css` (appended at the very end of the file): NEW rule block `.feature-card-icon { display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px }` + `.feature-card-icon svg { width: 40px; height: 40px; display: block }`. Just sizing + spacing — colors come from the inline SVG `stroke` attributes so they survive any CSS resets. INTENTIONAL DESIGN DECISIONS: (a) Inline SVG not an icon library — the 6 icons are bespoke (e.g. QR + bolt, OCPP brackets) so no off-the-shelf set matches. (b) Hardcoded `#181818` near-black + `#FEBF1D` brand yellow as SVG attributes (not `currentColor` / CSS vars) so they stay consistent regardless of parent text-color or theme. If dark-mode versions are needed later, swap the hex codes inline. (c) ONE yellow accent per icon — strict 2-tone matches "黄黑色组合"; more yellow would clutter at 40px. (d) Stroke widths 2/2.5 are balanced for 40px rendering. The 48×48 viewBox gives internal padding so strokes don't clip at edges. CASCADE: `.feature-card-icon` class has zero existing usages (grep-verified) so no naming conflicts. `margin-bottom: 16px` puts the icon ~16px above the H3 title for clean visual rhythm. Verified `npx tsc --noEmit` clean. NOTE TO FUTURE CLAUDE: if user wants the icons BIGGER, bump `.feature-card-icon svg { width: 40px; height: 40px }` → 48-56px (viewBox stays 48×48; SVG content scales proportionally). If user wants a colored CHIP behind each icon (yellow square bg), add to `.feature-card-icon`: `width: 56px; height: 56px; border-radius: 12px; background: rgba(254,191,29,0.12)`. If user wants the icons CENTERED in the card (currently left-aligned via `inline-flex`), change `.feature-card-icon { display: flex; justify-content: center }`. If user wants DIFFERENT icons for specific cards, edit the SVGs inline — each lives in its own card div above the matching `t('product.ff#.title')`. If the B2B page's feature section should also get icons, the b2b features at `b2b/page.tsx:266-311` uses a different layout (numbered list `b2b-feat-item` with `b2b-feat-num`, not a card grid) — a separate icon system would be needed. The EN locale at `messages/en.json` keys `product.ff1.title`..`ff6.title` already maps 1:1 to the same topics — icons stay identical across locales. If users browse with `prefers-reduced-motion`, the icons are static (no animation) so no media query needed. PRIOR (different session): pricing comparison-table category-row recolored from `var(--dark-surface)` light gray → brand yellow `#FEBF1D` with black `#111418` text (see sections.css:3684-3691); commit log has the chain.
