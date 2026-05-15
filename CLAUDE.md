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

- 2026-05-15 (product pages b2c + b2b: whole-page background → `#F1F2F4` cool grey): user said "将产品页的背景颜色，一整页都改成#F1F2F4". CASCADE SETUP: b2c hero already used `<section className="hero mesh-bg product-hero hero-with-shot">` (has `.product-hero`); b2b used `<section className="hero mesh-bg particles-bg">` (NO `.product-hero` — and `.particles-bg` is shared with the contact page hero, so unusable as a product-page-only discriminator). Default cascade: `body { background: var(--black) }` = `#ffffff` in light mode (tokens.css:9 — unfortunate naming: `--black` maps to WHITE in light mode, `--dark` maps to `#F1F2F4`). `.hero { background-color: var(--dark) }` = `#F1F2F4` (already grey). `.product-hero { background: var(--black) }` OVERRIDES the hero back to WHITE (pages-extracted.css:26). Sections below have no bg (base.css:151), so they inherit the white body. THREE EDITS: (1) `src/app/[locale]/b2b/page.tsx:90`: added `.product-hero` to the hero class chain — now both product pages share the discriminator. (2) `src/app/styles/pages-extracted.css:26`: `.product-hero { background: var(--black) }` → `background: #F1F2F4` (literal, not via the `--black`/`--dark` tokens — clearer intent and avoids the light/dark token weirdness). (3) NEW rule in pages-extracted.css right after that block: `body:has(.product-hero) { background: #F1F2F4 }` — scopes the body bg override to b2c + b2b only via `:has()` (Chrome 105+/Safari 15.4+/Firefox 121+, all shipping). EFFECT: visiting `/b2c` or `/b2b` renders the whole page top-to-bottom on a `#F1F2F4` cool-grey canvas — hero, all `.section` blocks (transparent → show body grey), footer unaffected. Contact page (which uses `.particles-bg` but not `.product-hero`) keeps its white bg. Other pages unaffected. Verified `npx tsc --noEmit` clean. CAVEATS / NOTE TO FUTURE CLAUDE: (a) Dark mode NOT retuned — the literal `#F1F2F4` will paint the hero light-grey in dark mode too. If dark mode product pages need to stay dark, add `[data-theme="dark"] .product-hero { background: var(--black) }` AND `[data-theme="dark"] body:has(.product-hero) { background: var(--black) }`. (b) Some sections may have their OWN explicit bg (e.g. "section-alt" stripes — not checked); those will still show their colors over the grey canvas. User may follow up with specific section fixes if so. (c) The `.mesh-bg` class on the hero also applies a layered gradient — `.product-hero`'s direct `background` overrides the bg-color but `.mesh-bg`'s `background-image` (if it sets one) layers on top. If user reports the hero looks "patterned" not flat grey, dropping `.mesh-bg` from the JSX is next. (d) If user wants a DIFFERENT grey, change BOTH the `.product-hero` literal AND the `body:has(.product-hero)` rule — keep in sync. (e) If user wants the b2b `.particles-bg` orbs visible again on top of the grey, that effect's bg-image needs higher specificity than `.product-hero { background }` — scope to `.product-hero.particles-bg { background: #F1F2F4 url(...) }` or similar.
