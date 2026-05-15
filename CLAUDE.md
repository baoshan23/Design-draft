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

- 2026-05-15 (hero TypingText "CSMS Platform": kill the gold gradient, render as solid pure yellow `#FEBF1D`): user attached `/tmp/claude-paste-1778824122592-bc4e1e17.png` (Chinese-locale homepage hero with red box around the typewriter accent "CSMS Platform" — currently rendering with a `linear-gradient(120deg, #FEBF1D 0%, #FFD56B 45%, #FEBF1D 100%)` clipped to text, so the phrase shows a subtle gradient sheen where the middle stop `#FFD56B` is a lighter, paler yellow than the brand-primary `#FEBF1D` at the start/end stops) and said "红框这里的字体颜色，改成纯黄色，不要有渐变" — replace the gradient with a flat, uniform brand-primary yellow. ROOT CAUSE: in `src/app/styles/sections.css:123-131` the rule `.hero-with-video .hero-title .typing-text, .hero-with-video .hero-title .text-gradient` used `background: linear-gradient(120deg, #FEBF1D 0%, #FFD56B 45%, #FEBF1D 100%)` combined with `-webkit-background-clip: text` + `-webkit-text-fill-color: transparent` to paint the text with a 3-stop gold gradient (the `#FFD56B` middle stop is what gave the visible color shift across the text width). The TypingText component (`src/components/effects/TypingText.tsx:99`) ALSO applies a `.gradient-text-animated` class which has its own `linear-gradient(90deg, #E6A817, #D4890A, #F5C946, #E6A817)` + `animation: gradientShift 4s ease infinite` defined in `enhancements.css:135-142` — but the sections.css selector `.hero-with-video .hero-title .typing-text` (specificity 0,3,0) overrides `.gradient-text-animated` (0,1,0) cleanly via cascade, so only the sections.css rule needed editing. ONE FILE EDITED: `src/app/styles/sections.css`. ONE rule (`.hero-with-video .hero-title .typing-text, .hero-with-video .hero-title .text-gradient`) modified. FIVE prop changes: (1) `background: linear-gradient(120deg, #FEBF1D 0%, #FFD56B 45%, #FEBF1D 100%)` → `background: none` — kills the 3-stop gradient entirely. (2) `-webkit-background-clip: text; background-clip: text` → `-webkit-background-clip: initial; background-clip: initial` — resets clip so the text fill applies normally (otherwise a transparent fill on text-clipped-bg with no bg = invisible text). (3) `-webkit-text-fill-color: transparent` → `-webkit-text-fill-color: #FEBF1D` — paints the text with brand-primary bright yellow, the exact same color as the start/end stops of the OLD gradient and the same color used by `.btn-primary` hero CTAs, active sub-nav tabs, and matrix CTA buttons site-wide. (4) `color: transparent` → `color: #FEBF1D` — fallback for browsers that don't honor `-webkit-text-fill-color` (older Firefox), they'll use the `color` prop. (5) `text-shadow: 0 2px 18px rgba(254, 191, 29, 0.35)` UNCHANGED — preserves the subtle gold glow halo behind the text. EFFECT: "CSMS Platform" now renders as a single uniform `#FEBF1D` across the entire phrase, no visible color transitions. The cursor `|` blink from `.typing-text::after` (enhancements.css:151-154) has no explicit color rule so it inherits `color` from the parent — now blinks as `#FEBF1D` bright yellow too. The `animation: gradientShift 4s ease infinite` from `.gradient-text-animated` still runs but is visually inert since `background: none` means there's no `background-position` to animate. The `min-height: 1.2em; min-width: 380px` typing-text layout sizing (enhancements.css:145-150) untouched — still prevents layout shift when the text content swaps between the 4 rotating phrases ('CSMS Platform', '管理系统', 'Charge Hub', '充电平台'). NOTE TO FUTURE CLAUDE: if user wants the SHADOW removed too (currently a subtle gold glow `text-shadow: 0 2px 18px rgba(254,191,29,0.35)`), drop the text-shadow line — "纯黄色" could be interpreted as "pure yellow no other effects"; I kept the shadow because it's subtle and gives depth, user didn't explicitly call it out. If user wants the cursor `|` a DIFFERENT color than the text (e.g. dark cursor on yellow text), add `.hero-with-video .hero-title .typing-text::after { color: var(--text-primary); -webkit-text-fill-color: var(--text-primary) }`. If user wants the yellow to be a DIFFERENT SHADE (darker `#E6A817` matching polish.css's `--primary-dark`, or brighter `#FFCC33`), swap BOTH `-webkit-text-fill-color` AND `color` to the new value — keep them in sync. If user wants the gradient BACK but with different/slower stops, restore `background: linear-gradient(...)` + `background-clip: text` + transparent fills — all five props need to flip together. The `.contact` page (`src/app/[locale]/contact/PageClient.tsx:142`) ALSO uses `gradient-text-animated` for its title but is UNAFFECTED by this fix because the `.hero-with-video` ancestor selector doesn't match there — that page still shows the animated 4-stop gradient. The TypingText also appears in `/b2c` and `/b2b` hero pages; those DO use `.hero-with-video` so they share this fix (their rotating brand phrases now also render as flat `#FEBF1D`). PRIOR (different session): 2026-05-15 (diagram modal: float title above modal frame + enlarge illustration 1000→1280px) — moved title via position:absolute top:-56px, widened modal to 1280px, relaxed overflow:visible on modal-content; details in commit ff0b0cf.
