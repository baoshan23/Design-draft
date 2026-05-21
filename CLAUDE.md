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

- 2026-05-21 — **b2c (`/[locale]/b2c`) `#multilingual` "20+ 种全球语言" yellow form panel** (`sections.css`, CSS-only, pushed fork `design-draft-local`). Six changes, all touching `.b2c-lang-aside` / its `.lang-request-card` (~3087) / the `.b2c-lang-panel` grid:
  - `5dfccb8` — **killed ghosted / double-rendered form title text.** User red-boxed a faint smaller offset copy of the `需要我们尚未支持的语言？` title. Root cause: the form is `<div class="card lang-request-card">` and global `.card` (~`sections.css` 2376) applies `backdrop-filter:blur(20px) saturate(1.2)`; the `.b2c-lang-aside` override made the card chromeless (transparent/no border/no shadow/no padding) but LEFT the filter → it forces the card onto its own filter render-surface, and nested inside `.b2c-lang-panel`'s rounded `overflow:hidden` clip + the transform-composited `.animate-on-scroll` layer Chrome double-rasterized the text. PROOF it's the filter not a container clip: the right-side `.b2c-lang-grid` uses the SAME `overflow:hidden + border-radius:20px + isolation:isolate` recipe yet renders perfectly clean (it just isn't a `.card`). Fix: added `backdrop-filter:none;-webkit-backdrop-filter:none`.
  - `6421230` — user "把表单里的圆角改成直角,不要影响到控件和黄色卡片" → added `border-radius:0` to the same rule. Squares only the form-card wrapper; the yellow `.b2c-lang-panel` frame and inner `.form-input`/`.btn` controls keep their radii. Visually invisible (the card is transparent/borderless/shadowless) — structural only.
  - `fe030e2` — user "黄色的区域宽度小一点" → narrowed the yellow aside: `.b2c-lang-panel` `grid-template-columns: minmax(400px,1fr) 1.25fr` → `minmax(400px,1fr) 1.6fr` (yellow aside share ~44% → ~38% of the panel; the language grid takes the wider remainder). Revert: `1.6fr` → `1.25fr`.
  - `e6870f9` — user red-boxed a thin white line across the form title. It was the global `.card::after` "glass edge highlight" (a 1px `linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent)` line at `top:0` of every `.card`) — fine on a dark glass card, an unwanted white streak on this transparent card over flat yellow. Fix: new rule `.b2c-lang-aside .lang-request-card::after{display:none}`. Revert: drop that rule.
  - `769cc0b` — user "鼠标光标移到表单时,无动态交互" (no hover feedback on the form controls). Cause: the aside's higher-specificity base rules (`.b2c-lang-aside .lang-request-card .form-input`) silently overrode the global `.form-input:hover`, and the button hover was only `#181818→#000` (invisible black-on-black). Fix: new `.b2c-lang-aside .lang-request-card .form-input:hover` (brighten frosted input → `rgba(255,255,255,.8)` bg + solid-white border; placed before `:focus` so focus wins when both apply) + extended `.btn-primary:hover` with `transform:translateY(-2px)` + `box-shadow` and a new `.btn-primary:active` press-down. Revert: drop the `:hover`/`:active` additions.
  - latest — user "鼠标移到整个表单上不需要动态,只有输入框和按钮才有交互". The form card carries `class="card"`, so the global `.card:hover{transform:translateY(-4px)}` lifted the WHOLE form on hover (the `.card:hover` border-color/box-shadow were already suppressed by the higher-specificity aside base rule, but `transform` leaked through since nothing overrode it). Fix: new `.b2c-lang-aside .lang-request-card:hover{transform:none}` — hovering the form area is now static; only `.form-input`/`.btn` react. Revert: drop that rule.
  - VERIFIED in served dev CSS (`/_next/static/chunks/src_app_*.css`). NOT screenshot-verified (autodebug needs the user to open the preview + enable debug mode).

  ───── EARLIER (concurrent threads, all committed & pushed `design-draft-local`): (1) Pricing `/[locale]/pricing` `#plans` "价格方案": image backdrop with bottom fade — asset `public/images/pricing-plans-bg.png` (pale-blue 3D-plate render, `129540c` swapped for a softer one), `pricing/page.tsx` `#plans` bg `#F1F2F4`→`#fff`, `sections.css` new `.pricing-section--tabs{position:relative;isolation:isolate}` + `::before` (`inset:0;z-index:-1`, `url(...)/cover`, `mask-image:linear-gradient(to bottom,#000 0%,#000 52%,transparent 95%)`) ~line 4093 (`67bf2b0`). (2) b2c `#gallery` `Gallery3D.tsx` + `polish.css` `.gallery-3d`/`.g3d-*` (~line 572): replaced the flat 4-phone `grid grid-4` row with a 3D perspective phone-mockup cluster (`.g3d-device` graphite bezel via `::before` gradient-border trick, mouse-parallax + hover-pop, no gold ring, no caption pills, `@media(max-width:760px)` flattens to 2-col) (`7431a0c`). Revert: delete `Gallery3D.tsx`, restore old `grid grid-4 gallery-grid` block + `.gallery-*` CSS. (3) Pricing comparison-table `<thead>` polish: `7765016` sticky header ≥1040px, `725253a` th `padding-bottom:33px`, `42b84c7` header text centred + table-wrap top corners squared, `c247b10` `功能` header cell left-aligned with the feature-name column. (4) `d751230` — pricing cards given a `1px solid #e5e5e5` hairline border: the unified `.pricing-card.glass-card` frame (`sections.css` ~4022, base + `:hover`) was `border:0 !important` → now `border:1px solid #e5e5e5 !important`; this one rule covers every pricing card — the `/pricing` B2C+B2B tabs, the `/b2b` page, and the `/b2c` page (all share `.pricing-card.glass-card`). Revert: set both back to `border:0 !important`. (5) `f61557b` — pricing `/[locale]/pricing` "可选扩展" add-on cards (`.addon-card` / `.addon-card-icon`) restyled to match the b2c `#features` cards (`.b2c-feature-cell` / `.feature-card-icon`): icon tile `.addon-card-icon` now 52×52 `border-radius:14px` `background:var(--primary)` + `box-shadow:0 0 20px rgba(254,191,29,.35)` glow + `color:#181818` black icons (was 40px `--primary-dim` dim tile with gold icon), new `.addon-card-icon svg{26×26}`; `.addon-card` transition→`transform/box-shadow .25s`, `:hover` now `translateY(-4px)+var(--shadow-md)` (was `-2px`); removed the `.addon-card:hover .addon-card-icon` colour-swap rule (icon is now permanently gold). Revert: restore the old `.addon-card-icon` (40px/`--radius`/`--primary-dim`/`color:var(--primary)`), `:hover` `translateY(-2px)`, and the hover colour-swap rule. (5) `90ccc56` — pricing `#addons` "可选扩展" cards: user "图标移到小标题上面，黄色字字号加大" → `sections.css` `.addon-card` (override ~4280) `flex-direction: row → column` (icon now stacked above the label/price body instead of beside it; `align-items:flex-start` keeps it top-left, gap 14px) + `.addon-price` (~3850) `font-size: 1rem → 1.2rem` (the yellow price text). Revert: `flex-direction` back to `row`, `.addon-price` back to `1rem`. (6) `e0996a6` — blog `/[locale]/blog`: user "将切换移到红框、底下页面切换移到黄框" → merged the category-filter tabs and the pagination into ONE toolbar row above the post list. `PageClient.tsx`: wrapped `.blog-filters` + the `.pagination` block in a new `.blog-toolbar` div (inside the existing first `<ScrollAnimation>`), and deleted the standalone `{/* Pagination */}` block that sat at the bottom (after `.blog-grid`). `pages-extracted.css`: new `.blog-toolbar{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:48px}` (filters left, pagination right) added before `.blog-filters`; removed `margin-bottom:48px` from `.blog-filters` and `margin-top:48px` from `.pagination` (the toolbar owns the spacing now). `tsc` 0. Revert: unwrap the toolbar — move `.blog-filters` back to its own ScrollAnimation, re-add the bottom `.pagination` block, delete `.blog-toolbar` CSS + restore the two margins.

  **PUSH POLICY (settled):** push every commit with `git push fork main:design-draft-local`. Local `main` → fork branch `design-draft-local`. NEVER force-push or touch fork `main` (it holds 54 security-pin/contact-page commits that diverged from local at `8a4d15c` on 2026-05-11; local-only design work is the 400+ commits). `origin` = `anindya127/Design-draft` also diverged — don't push there.

  **Older still-relevant flags (do NOT reapply unless asked):** b2c `#features` section 4 has an `AppSlideshow` carousel — a separate phone slideshow in a `4/3` `.feature-image-placeholder:has(.app-slideshow)` card (do not confuse with the `Gallery3D` `#gallery` cluster). homepage hero `.hero.hero-centered .hero-centered-inner` uses `url('/images/hero-grid-bg.png') cover` — a CSS dot-grid was tried then REVERTED (`6ed2f2b`). b2c `.product-hero::before` light-mode dot field IS live (`d692ec4`, gold `rgba(214,158,0,0.55)` 2.5px/24px; pale-yellow on `#F1F2F4` ≈ invisible — use darker gold ≥0.4 alpha for texture on that bg); same selector also styles the b2b hero. Homepage yellow nav bar was reverted (`bcbd0aa`); `logo-globe.png` recoverable via `git show 8fef934`. b2c `.product-hero` is `min-height:calc(100svh - 42px)` flex-column with `.hero-footer-bar{margin-top:auto}` pinning the 3 stats to the fold (b2b shares `.product-hero` — verify if touching). The running `next dev` on :8000 can develop a dead file-watcher (container inotify limit) and serve a stale CSS bundle — if an edit doesn't show, kill it, `rm -rf .next`, restart `npm run dev`.
