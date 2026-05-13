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

- 2026-05-13 (typography tweaks + GLOBAL container max-width 1200→1440): THREE edits this session. (1) `.hiw-card h3` (`pages.css` ~line 2872) `font-size: 1.05rem` → `18px`. `.hiw-card p` was already 14px. Targets the 3 stacked "How It Works / 3 步快速上线" cards. (2) `.mobile-feature-text p` (`sections.css` line 3913) `font-size: 18px` → `14px`. Targets the 4 captions under the phone mockups in the "原生 iOS 与安卓 App" MobileShowcase section — "扫码 + 点击支付…" etc. Titles `.mobile-feature-text h3` (line 3893) left untouched per the user's red-box screenshot which only highlighted descriptions. (3) GLOBAL CONTAINER WIDTH BUMP — user said "整个网站的主体内容设置宽度为1200px内，现在太窄了，然后内容宽度你帮我调适配一下"; via AskUserQuestion they chose **expand to 1440px** (other options were 1280/1320/keep-1200). Four coordinated edits: (a) `tokens.css:88` `--max-width: 1200px → 1440px` — this is the master token consumed by `.container { max-width: var(--max-width) }` in `base.css:146` and `.hero-mobile-content { max-width: var(--max-width) }` in `sections.css:3424`, so EVERY `.container` site-wide widens to 1440. (b) `pages-extracted.css:656` `.forum-container` 1100 → 1280 (two-column forum layout, subordinate to .container). (c) `pages.css:5274` `.forum-topic-inner` 1100 → 1280 (forum topic reading layout). (d) `sections.css:2482` `.language-map` 1100 → 1280 (homepage world-map visualization). (e) `pages.css:5136` `.blog-article-related-inner` 1000 → 1280 (related-posts card strip below blog articles). NOTE — left INTENTIONALLY UNTOUCHED (reading-width layouts where wider hurts legibility, per standard line-length-for-reading guidance ~70-80ch ≈ 900-1000px): `.docs-main` 860, `.blog-article-layout` 1000, `.blog-post-container` 900, `.vg-article-cover` 960, `.simple-page-card` 980 / `.narrow` 900 (auth/forms), `.dashboard-inner` 900, `.bt-layout` 960. The `.b2b-arch-diagram` 1320 (`pages.css:1289`) was previously clamped by the 1200 container (effective ~1152 inside 24px padding) and now becomes properly visible inside the wider 1440 container (~1392 available); no edit needed but expect that diagram to look noticeably wider on the b2b page. Mobile media-query overrides at `pages-extracted.css:557` (`@media (max-width: 1200px)`) and various per-section breakpoints are untouched — they fire below the new 1440 threshold on narrower viewports as before. PUSH TO FORK STILL BLOCKED: `git push fork main` failed all 3 times this session with `could not read Username for 'https://github.com'` — `fork` remote (`baoshan23/Design-draft`) has no credentials on this machine. Local commits `12e50ca` (hiw title), `98a47b0` (mobile caption), `d4551e5` (container 1440 + inner widths) landed but cannot reach the fork until auth is configured. To fix: credential helper, SSH remote (`git remote set-url fork git@github.com:baoshan23/Design-draft.git`), or PAT-in-URL. NOTE TO FUTURE CLAUDE: if user later complains the homepage hero/footer-stat-bar feels too sparse at 1440 (more whitespace between the 3 stat blocks since `.hero-footer-stat` padding is `0 56px` from 2026-05-12 change 23, and the bar now spans 1440 instead of 1200) — they may want a narrower hero-specific override or wider stat padding. If user wants the WHOLE thing wider still (e.g. 1536/1600), just edit the `--max-width` token; the .container rule will follow. If user wants the WHOLE thing narrower (e.g. back to 1200), same one-line revert. The site has no `.container-narrow` / `.container-wide` modifier classes — width variance is via component-specific `max-width` rules, not a container modifier system. The user consistently passes absolute pixel values for sizing ("字号改成18", "改成1440px") so use px not rem on size requests.
