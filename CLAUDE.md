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

- 2026-05-13 (homepage typography touchups on `.hiw-card` + `.mobile-feature-text` description): TWO sequential edits in one session, both pixel-value typography tweaks. (1) `.hiw-card h3` (`src/app/styles/pages.css` line ~2872) `font-size: 1.05rem` → `18px`. `.hiw-card p` was already `font-size: 14px` from the prior session, left as-is. Targets the 3 stacked "How It Works / 3 步快速上线" cards. User: "这里的卡片标题字号改成14"-style request previously, this session was "标题字号改成18，内容改成14". (2) `.mobile-feature-text p` (`src/app/styles/sections.css` line 3913) `font-size: 18px` → `14px`. Targets the 4 captions under the phone mockups in the "原生 iOS 与安卓 App" MobileShowcase section — descriptions like "扫码 + 点击支付，几秒启动充电" / "附近充电站地图，实时可用状态" / "充电过程中显示功率、电流、电压" / "订单费用、RFID 卡、余额充值、车辆资料". User: "红框的字体字号改成14" with a screenshot showing those 4 description lines outlined in red. The TITLES in that section (`.mobile-feature-text h3` at line 3893 — "扫码即充" / "附近充电站" / "充电监控" / "订单与账户") were intentionally LEFT UNTOUCHED since the screenshot only highlighted the description lines, not the titles. `.mobile-feature-text p` `padding-left: 28px` (sits flush under the title which has an icon prefix occupying ~28px) and `color: #6C717A` are unchanged. NOTE: this is the SAME selector pattern as change (18) of the 2026-05-12 session (`.mobile-showcase-bullets li`) which dropped a DIFFERENT MobileShowcase-internal list to 14px — but that selector targeted the bullet list on the side-by-side variant, NOT the per-phone captions. Both selectors now read at 14px so the section is typographically uniform. PUSH TO FORK STILL BLOCKED: `git push fork main` failed again with `could not read Username for 'https://github.com'` — `fork` remote (`baoshan23/Design-draft`) has no credentials on this machine; local commits `12e50ca` (hiw-card title) and `98a47b0` (mobile-feature-text p) landed but cannot reach the fork until auth is configured (same blocker noted in prior sessions). To fix push later: set up a credential helper, switch the remote to SSH (`git remote set-url fork git@github.com:baoshan23/Design-draft.git` with an SSH key in agent), or use a PAT-in-URL form. NOTE TO FUTURE CLAUDE: the user consistently passes absolute pixel values for typography ("字号改成18", "字号改成14", earlier "16px"/"36px"/"14px" in changes 15-18 of the 2026-05-12 entry) — don't switch to rem on these unless asked. Dark mode caveat persists — `#181818` text colors on the .hiw-card and `#6C717A` on `.mobile-feature-text p` are hardcoded with no `[data-theme="dark"]` overrides; in dark mode they'll have contrast issues if the user later opens that theme.
