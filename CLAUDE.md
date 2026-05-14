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

- 2026-05-14 (multi-language section: scattered cloud → bordered grid + sweeping highlight): user attached `/tmp/claude-paste-1778729803926-13178870.png` (current 多语言 section with 28 greetings as a scattered "language cloud" at varying font sizes) and `/tmp/claude-paste-1778729830292-8afd2986.png` (Alibaba Cloud "AI 赋能千行百业" hero — a uniform 8-col grid of company logos in bordered cells on a soft grey/cream panel) and said "这一屏的布局和动态效果，改成这种" — replaced the scattered cloud with a structured 7×4 grid of bordered cells. THREE coordinated edits: (1) JSX (`src/app/[locale]/page.tsx` ~lines 456-485): replaced `<div className="language-cloud">` with `<div className="language-grid" role="list" aria-label="Supported languages">`. All 28 `<span style={{ fontSize: '...' }}>` entries collapsed to plain `<span role="listitem">` — inline font-size styles REMOVED entirely since the grid uses a uniform 1.25rem. Greetings order preserved exactly (你好, Hello, Xin chào, Привет, Apa kabar, Hai, สวัสดี, හෙලෝ, مرحبا, Bonjour, Hola, Ciao, こんにちは, 안녕하세요, Hallo, Olá, Merhaba, Γεια σας, नमस्ते, Habari, ជំរាបសួរ, Kamusta, سلام, Hej, Selamat, Сайн уу, Saluton, Witam — 28 items at 7 cols = 4 rows exactly). (2) CSS (`sections.css` ~lines 2582-2680, inserted right after the legacy `.language-cloud` block which is now ONLY used by `/b2c#multilingual`): added a new `.language-grid` rule set. KEY rules: `.language-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; max-width: 1100px; background: rgba(192,127,0,0.12); border: 1px solid rgba(192,127,0,0.14); border-radius: 18px; overflow: hidden; box-shadow: 0 8px 28px rgba(140,95,0,0.06); isolation: isolate }` — the `gap: 1px` over a `background: rgba(192,127,0,0.12)` gives the thin cream-tone dividers between cells without needing per-cell borders (cells' own backgrounds occlude everything except the 1px gap, which shows the container bg through). `.language-grid > span { min-height: 92px; font-size: 1.25rem; font-weight: 600; background: linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,251,240,0.82) 100%); ... }` — uniform cell sizing replaces the variable fontSize per cell. Hover: `transform: scale(1.03)` + `color: var(--primary-text)` + a `::before` cream-gold gradient overlay fades in (`linear-gradient(135deg, rgba(254,191,29,0.22) 0%, rgba(192,127,0,0.08) 100%)`). DYNAMIC EFFECT: `.language-grid::after` is a 240%-wide diagonal gradient (`linear-gradient(115deg, transparent 0%, transparent 38%, rgba(254,191,29,0.20) 50%, transparent 62%, transparent 100%)`) with `mix-blend-mode: multiply` that sweeps from `background-position: 120% 0` → `-20% 0` over 7s (the `languageGridSweep` keyframe holds at -20% for the latter 45% of the cycle, giving a "sweep + pause" rhythm rather than continuous motion — feels more deliberate than a metronome sweep). `prefers-reduced-motion` query disables the sweep + hover transform. Dark-mode override: container bg → `rgba(255,255,255,0.08)`, cells → translucent dark warm-brown gradient. (3) MOBILE (`pages.css` ~line 4279, inside the existing `@media (max-width: 768px)` block, added immediately after the kept `.language-cloud` mobile rules): `.language-grid { grid-template-columns: repeat(4, 1fr); border-radius: 14px; margin-top: 28px }` + `.language-grid > span { min-height: 64px; font-size: 0.95rem; padding: 10px 8px }`. 28 items at 4 cols = 7 rows on mobile — last row has 0 leftover (clean rectangle). LEGACY `.language-cloud` class kept fully intact in CSS (sections.css ~2516-2580) because `/b2c/page.tsx:357` still uses it. POLISH.CSS `.language-cloud::before` glow + its light-mode disabler at 1018 untouched — they only apply to b2c now. PUSH STATE: `page.tsx` edit was auto-committed mid-session (likely by a watcher; the git index already had the language-grid version before I ran `git add`); CSS edits remain to be committed in this turn along with CLAUDE.md. NOTE TO FUTURE CLAUDE: if user wants the sweep FASTER/SLOWER, tune `animation: languageGridSweep 7s` duration. If user wants CONTINUOUS sweep (no pause), set keyframe `100% { background-position: -20% 0; }` → `100% { background-position: -240% 0; }` or remove the 55% stop and use linear `0%→100%`. If user wants the sweep BRIGHTER, bump the middle stop's `rgba(254,191,29,0.20)` to 0.32+. If user wants a SAGE/COOL tint instead of warm gold (the reference is cooler), change the gradient + background tokens from `192,127,0` → e.g. `100,120,100` family. If user wants 6 cols (more square cells) or 8 cols (tighter), change `repeat(7, 1fr)` — 28 ÷ 6 = 4.67 (last row would be partial: 4 items), 28 ÷ 8 = 3.5 (last row would be 4 items). 7 cols was chosen because it divides 28 evenly. If user adds/removes greetings, update both the spans and re-verify the grid-template-columns divides evenly OR accept the partial last row (cells in the partial row still render correctly but visually break the rectangle).

