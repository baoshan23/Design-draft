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

- 2026-05-15 (b2c features section: add a yellow + black two-tone line icon to each of the 6 cards): user attached `/tmp/claude-paste-1778831786877-e450d5c0.png` (b2c page features grid in red box — 6 cards: 扫码即充 / 智能健康监测 / 跨渠道登录 / 数据可视化核心 / OCPP 可视化命令 / 跨平台矩阵) and said "这一屏的卡片内容，分别适配一个黄黑色组合的线性图标". The 6 cards before this change had only `<h3>` + `<p>` — no icon. User wants each card to gain a topic-appropriate two-tone line icon (black main strokes + yellow accent). DESIGN APPROACH: each icon is an inline SVG, 40×40 rendered at a 48×48 viewBox, strokes only (no fills — true line-icon style per "线性图标"), with TWO color groups: `stroke="#181818"` for the main outline and `stroke="#FEBF1D"` for one accent element per icon. Main strokes `strokeWidth="2"`; yellow accent `2.5` (slightly thicker so the yellow reads as "highlighted" rather than equal-weight). All use `strokeLinecap="round"` + `strokeLinejoin="round"`. Per-card icon designs: (1) **扫码即充** — 3 black QR-corner rounded squares (top-left, top-right, bottom-left) + yellow lightning bolt cutting through the bottom-right quadrant. (2) **智能健康监测** — black heart outline + yellow ECG pulse waveform across the heart's middle. (3) **跨渠道登录** — black user silhouette (circle head + shoulders curve) on the left + yellow padlock-key combo (small key with circular bow + teeth) on the lower-right. (4) **数据可视化核心** — black L-shaped chart axis + 3 black bar-chart outlines of ascending height + yellow trend line going up from bottom-left, ending in a yellow circle marker ("you are here" indicator). (5) **OCPP 可视化命令** — black terminal-window rectangle outline + black `< >` brackets centered + yellow underscore cursor below the brackets. (6) **跨平台矩阵** — black laptop outline (rect + base bar) on the left + yellow phone outline (taller portrait rect with small circular home-button dot) overlapping on the right. TWO FILES EDITED: (1) `src/app/[locale]/b2c/page.tsx` lines 168-195 — kept the existing `<div className="card glass-card tilt-card">` x6 structure intact, just inserted a `<div className="feature-card-icon" aria-hidden="true"><svg>...</svg></div>` BEFORE the `<h3>` in each card. The `aria-hidden="true"` keeps screen readers from announcing the decorative SVG (title `<h3>` already conveys the semantic meaning). (2) `src/app/styles/pages-extracted.css` (appended at the very end of the file): NEW rule block `.feature-card-icon { display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px }` + `.feature-card-icon svg { width: 40px; height: 40px; display: block }`. Just sizing + spacing — colors come from the inline SVG `stroke` attributes so they survive any CSS resets. INTENTIONAL DESIGN DECISIONS: (a) Inline SVG not an icon library — the 6 icons are bespoke (e.g. QR + bolt, OCPP brackets) so no off-the-shelf set matches. (b) Hardcoded `#181818` near-black + `#FEBF1D` brand yellow as SVG attributes (not `currentColor` / CSS vars) so they stay consistent regardless of parent text-color or theme. If dark-mode versions are needed later, swap the hex codes inline. (c) ONE yellow accent per icon — strict 2-tone matches "黄黑色组合"; more yellow would clutter at 40px. (d) Stroke widths 2/2.5 are balanced for 40px rendering. The 48×48 viewBox gives internal padding so strokes don't clip at edges. CASCADE: `.feature-card-icon` class has zero existing usages (grep-verified) so no naming conflicts. `margin-bottom: 16px` puts the icon ~16px above the H3 title for clean visual rhythm. Verified `npx tsc --noEmit` clean. NOTE TO FUTURE CLAUDE: if user wants the icons BIGGER, bump `.feature-card-icon svg { width: 40px; height: 40px }` → 48-56px (viewBox stays 48×48; SVG content scales proportionally). If user wants a colored CHIP behind each icon (yellow square bg), add to `.feature-card-icon`: `width: 56px; height: 56px; border-radius: 12px; background: rgba(254,191,29,0.12)`. If user wants the icons CENTERED in the card (currently left-aligned via `inline-flex`), change `.feature-card-icon { display: flex; justify-content: center }`. If user wants DIFFERENT icons for specific cards, edit the SVGs inline — each lives in its own card div above the matching `t('product.ff#.title')`. If the B2B page's feature section should also get icons, the b2b features at `b2b/page.tsx:266-311` uses a different layout (numbered list `b2b-feat-item` with `b2b-feat-num`, not a card grid) — a separate icon system would be needed. The EN locale at `messages/en.json` keys `product.ff1.title`..`ff6.title` already maps 1:1 to the same topics — icons stay identical across locales. If users browse with `prefers-reduced-motion`, the icons are static (no animation) so no media query needed. PRIOR (different session): pricing comparison-table category-row recolored from `var(--dark-surface)` light gray → brand yellow `#FEBF1D` with black `#111418` text (see sections.css:3684-3691); commit log has the chain.
