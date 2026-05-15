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

- 2026-05-15 (btn-secondary: site-wide — remove the yellow border on hover/click, keep neutral border + lift): user attached `/tmp/claude-paste-1778828360378-c1a2134d.png` (b2c hero with the "查看价格" secondary CTA in a red box — showing a yellow `#FEBF1D` border on hover) and said "红框这里的按钮，鼠标光标悬浮或者点击时，黄色边线去掉，后面其他页面这种效果的按钮，统一都是这样改" — remove the yellow border on hover/active for the secondary outline buttons site-wide. ROOT CAUSE: there are TWO `.btn-secondary:hover` rule blocks in the CSS — (a) `components.css:48-51` sets neutral `border-color: var(--border-medium)` (subtle grey), and (b) `polish.css:110-114` OVERRIDES it (later in cascade, same specificity) with `border-color: var(--primary)` = `#FEBF1D` plus a `transform: translateY(-2px)` lift and `box-shadow: 0 10px 28px rgba(0,0,0,0.08)` drop. The polish.css yellow-border override is what paints the unwanted yellow on hover. The HOMEPAGE hero has its own `.hero-with-video .btn-secondary:hover` rule (sections.css:212-217) that already keeps the border neutral `rgba(0, 0, 0, 0.10)` — the homepage was UNAFFECTED. But the b2c/b2b `.product-hero` doesn't match `.hero-with-video`, so polish.css's yellow override bleeds through. ONE FILE EDITED: `src/app/styles/polish.css`. ONE rule modified at line 110-114: removed the line `border-color: var(--primary);` from `.btn-secondary:hover`. The lift (`transform: translateY(-2px)`) and shadow (`box-shadow: 0 10px 28px rgba(0,0,0,0.08)`) are KEPT — buttons still feel responsive on hover, just without the yellow rim. With the polish.css override gone, the base `.btn-secondary:hover` rule from components.css:48-51 (`background: var(--glass-bg-hover); border-color: var(--border-medium)`) wins — neutral hover state. The `:active` (click) state has NO separate rule anywhere, so it inherits the hover state — also no yellow border on click. The keyboard `:focus-visible` outline (`polish.css:30-42` — yellow 2-3px outline OUTSIDE the button, not a border) is INTACT for a11y. Modern browsers distinguish `:focus-visible` (keyboard-only) from plain `:focus` (mouse-triggered) — so clicking with the mouse won't paint the yellow accessibility ring either. EFFECT: hovering or clicking ANY `.btn-secondary` site-wide (b2c "查看价格", b2b "查看价格", any other outline secondary CTA on pricing/demo/etc) no longer shows the yellow border — the border stays neutral grey while the button lifts 2px and gains a subtle drop shadow. Keyboard focus still shows the yellow outline ring for accessibility. SCOPE: the change is GLOBAL — `polish.css` `.btn-secondary:hover` rule has zero scope qualifiers, so the fix applies to every secondary button on every page. The user explicitly requested site-wide ("后面其他页面这种效果的按钮，统一都是这样改"). Verified `npx tsc --noEmit` clean. NOTE TO FUTURE CLAUDE: if user later reports a SPECIFIC button somewhere ELSE still showing yellow on hover, check for page-scoped overrides that add `border-color: var(--primary)` on hover (would be in the page's own CSS or a section.css selector chain like `.demo-hero .btn-secondary:hover`). If user wants the hover lift REMOVED too (some users find the translateY jarring), delete `transform: translateY(-2px)` from `polish.css:111`. If user wants the SHADOW removed, delete `box-shadow: 0 10px 28px rgba(0,0,0,0.08)` from `polish.css:112`. If user wants a DIFFERENT subtle hover indicator (e.g. only background change, no border/transform), strip everything from the hover rule and set just `background: var(--glass-bg-hover)`. If user EVER wants the yellow border BACK on a specific button (say a "Buy Now" outline CTA that needs to stand out), add a more-specific selector like `.btn-secondary.btn-emphasized:hover { border-color: var(--primary) }` and add the `.btn-emphasized` class to that specific button in JSX. The `:focus-visible` yellow ring is REQUIRED for WCAG 2.4.7 (focus visible) — DO NOT remove that even if user asks for "no yellow anywhere" without clarifying the accessibility tradeoff. PRIOR (different session): product pages b2c + b2b background → `#F1F2F4` cool grey via `body:has(.product-hero)` selector + `.product-hero` bg literal swap.
