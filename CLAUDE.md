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

- 2026-05-13 (homepage "How It Works / 3 步快速上线" `.hiw-card` typography): bumped `.hiw-card h3` `font-size: 1.05rem` → `18px` in `src/app/styles/pages.css` (line ~2872). `.hiw-card p` was already `font-size: 14px` from prior session — verified, left as-is. No other selectors touched. User asked literally "这里的卡片标题字号改成18，内容改成14" — referring to the 3 stacked HIW cards just iterated on. PUSH TO FORK STILL BLOCKED: `git push fork main` failed again with `could not read Username for 'https://github.com'` — `fork` remote (`baoshan23/Design-draft`) has no credentials on this machine; local commit `12e50ca` landed but cannot reach the fork until auth is configured (same blocker noted in the prior session entry). If future sessions need to fix push: either set up a credential helper, switch the remote to SSH (`git remote set-url fork git@github.com:baoshan23/Design-draft.git` with an SSH key in agent), or use a PAT-in-URL form. NOTE TO FUTURE CLAUDE: `.hiw-card h3` is hardcoded `18px` not `1.125rem` — the user has been consistently passing absolute pixel values for typography ("字号改成18", "内容改成14", earlier "16px"/"36px"/"14px" in changes 15-18 of the 2026-05-12 entry) so the pattern is established: don't switch to rem on these unless asked. Mobile-breakpoint override `pages.css:3935` for `.section-header p`/heading is untouched (still uses smaller values for narrow viewports). Dark mode caveat from prior session still applies — `.hiw-card h3` color `#181818` is hardcoded with no `[data-theme="dark"]` override.
