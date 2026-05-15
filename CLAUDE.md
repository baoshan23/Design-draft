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

- 2026-05-15 (b2c hero title: "企业版 (B2C)" → "独立运营商模式" + animated yellow shimmer on the "(B2C)" tag): user attached `/tmp/claude-paste-1778826821268-663e8176.png` (the b2c product page hero showing "OCPP CPMS" in dark + "企业版 (B2C)" in solid yellow below — both inside a red box) and said "将这里的文字内容改成'独立运营商模式(B2C)'然后B2C做黄色的动效效果" — rename the localized portion AND make the bracketed "(B2C)" segment have an animated yellow effect (distinct from the flat-yellow "Independent Operator Mode" prefix). FOUR FILES EDITED: (1) `messages/zh.json:783`: `"title2": "企业版 (B2C)"` → `"独立运营商模式"` — the i18n string now holds JUST the localized phrase, with "(B2C)" stripped because it'll be rendered as a separate animated span in JSX. (2) `messages/en.json:783`: `"title2": "Enterprise Edition (B2C)"` → `"Independent Operator Mode"` — English parity. The product-page badge label `"badge": "Enterprise Edition"` / `"企业版"` is UNCHANGED (line 781 in each) — only the hero title shifts; the badge chip above the title still says 企业版 / Enterprise Edition. If user later wants the badge ALSO renamed to match, edit those two lines. (3) `src/app/[locale]/b2c/page.tsx:62`: `<h1 className="hero-title">OCPP CPMS<br /><span className="text-gradient">{t('product.title2')}</span></h1>` → `<h1 className="hero-title">OCPP CPMS<br /><span className="text-gradient">{t('product.title2')}</span><span className="hero-title-b2c">(B2C)</span></h1>`. The "(B2C)" string is HARDCODED in JSX (not from i18n) since the model abbreviation is brand-fixed and identical in all locales — no point making it translatable. (4) `src/app/styles/sections.css`: NEW rule block inserted right after the existing `.product-hero .hero-title .text-gradient` block (which was already overridden to render solid `#FEBF1D` in a prior session, killing the original `.text-gradient` warm-gold gradient). NEW CSS: `.hero-title-b2c { display: inline-block; margin-left: 0.35em; background: linear-gradient(90deg, #FEBF1D 0%, #FFE99A 50%, #FEBF1D 100%); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; animation: b2cShimmer 2.6s ease-in-out infinite }` PLUS the `@keyframes b2cShimmer { 0% { background-position: 100% 50%; } 100% { background-position: -100% 50%; } }` (animates the gradient position from right to left across the text — a brighter cream-yellow `#FFE99A` highlight band sweeps continuously across the brand-yellow `#FEBF1D` base, creating a "yellow polish/shine" effect that stays entirely within the yellow color family). PLUS `@media (prefers-reduced-motion: reduce) { .hero-title-b2c { animation: none; -webkit-text-fill-color: #FEBF1D; color: #FEBF1D } }` — respects accessibility preference; users who request reduced motion get a flat solid yellow `(B2C)` with NO movement, identical color to the surrounding "Independent Operator Mode" so the animation just disappears gracefully. The `margin-left: 0.35em` gives breathing room between the phrase and "(B2C)" — equivalent to the natural word space that was in the original `"企业版 (B2C)"` string. SCOPING NOTE: the prior session's choice to render `.text-gradient` as flat `#FEBF1D` (not a gradient) is INTENTIONAL and stays in place — that decision applied to the title PREFIX (the localized phrase "独立运营商模式"). The user's new request is specifically for the `(B2C)` SEGMENT to animate, which I implemented via the separate `.hero-title-b2c` class — so the two segments now look intentional: solid yellow text + shimmer-animated yellow tag. EFFECT: "OCPP CPMS" stays dark; "独立运营商模式" stays solid `#FEBF1D` yellow (no animation); "(B2C)" renders in the same yellow color family but with a moving brighter highlight sweeping right-to-left every 2.6 seconds — feels alive, draws the eye to the model abbreviation. Verified `npx tsc --noEmit` clean. NOTE TO FUTURE CLAUDE: if user wants the shimmer FASTER, drop `2.6s` → `1.8s` or `1.2s`; for SLOWER push to 3.5-4s. If user wants the shimmer DIRECTION REVERSED (left-to-right), flip the keyframe: `0% { background-position: -100% 50% } 100% { background-position: 100% 50% }`. If user wants the shimmer MORE CONTRASTY (brighter highlight against base), change the middle stop `#FFE99A` (light cream) to `#FFFFFF` (pure white) — though that may look too contrasty against the yellow base. If user wants the shimmer SUBTLER, push `#FFE99A` → `#FFD55A` (only slightly brighter than base). If user wants a DIFFERENT animation type (e.g. pulse-glow via text-shadow instead of shimmer-sweep), replace the keyframe with `@keyframes b2cPulse { 0%, 100% { text-shadow: 0 0 0 transparent } 50% { text-shadow: 0 0 18px rgba(254,191,29,0.65) } }` AND drop the background-clip approach in favor of `color: #FEBF1D` directly. If user wants the localized phrase ALSO animated (not just the (B2C) part), apply `.hero-title-b2c` styles + class to the `.text-gradient` span too, OR widen the selector. If user wants the brackets "()" excluded from the animation (only the letters "B2C" animate), split further: `<span className="hero-title-b2c">(<span className="hero-title-b2c-inner">B2C</span>)</span>` and move the animation to the inner span. The badge chip `<span>{t('product.badge')}</span>` above the title still says "企业版"/"Enterprise Edition" — user didn't ask to change it; if later they want full alignment, update the i18n badge values too. The B2B page (`/b2b`) has a similar hero structure with `{t('product.title2')}` for its OWN i18n (different key namespace) — that page is UNAFFECTED by this change; if user later asks for the same treatment on b2b, mirror the pattern: split the title, add `<span className="hero-title-b2c">(B2B)</span>` (or rename the class to something neutral like `.hero-title-tag` so it can be reused for both — current name is b2c-specific but the styling is content-agnostic).
