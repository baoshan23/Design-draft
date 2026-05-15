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

- 2026-05-15 (Header nav dropdowns: auto-close on mouseleave — fix sticky-open state when clicking the trigger on b2c/b2b product pages): user said "产品页这里不管是打开B2B还是B2C，当鼠标光标移开顶部导航下拉菜单时，下来菜单就收起" — on b2c/b2b product pages, after CLICKING the "Product" trigger (which adds the `.open` class via React state `openDropdown`), the menu stayed visible even when the cursor left. User wants auto-close on mouse-exit. ROOT CAUSE: `.nav-dropdown` shows the menu via THREE conditions in `components.css:358-360`: `:hover`, `:focus-within`, and `.open`. The React state `openDropdown` controls `.open` — set via `toggleDropdown('product')` on click. NO `onMouseLeave` handler cleared the state — so once clicked-open, `.open` persisted, keeping the menu visible after the cursor left, until either the user clicked the trigger again OR focus blurred (onBlur with relatedTarget check). The pure-hover path worked fine via CSS `:hover` — the latching only happened after a click. On product pages the trigger has `.active` class (`Header.tsx:147` — `isActive('/b2c') || isActive('/b2b')` is true), so users may not realize the dropdown is in a click-latched vs hover-only state — felt like a bug. ONE FILE EDITED: `src/components/layout/Header.tsx`. TWO identical additions, one per dropdown wrapper. Product dropdown wrapper (line 144): appended `onMouseLeave={() => setOpenDropdown((prev) => (prev === 'product' ? null : prev))}` to the `<div className="nav-dropdown ...">`. Same for Community dropdown wrapper (line 201, guarded against 'community'). The `(prev === 'name' ? null : prev)` guard ensures only the specific dropdown is cleared — prevents a stray mouseleave on the product wrapper from accidentally affecting community state (defensive — both shouldn't be open simultaneously but safety). EFFECT: clicking either trigger opens the dropdown; mousing AWAY from the wrapper clears state → removes `.open` → CSS `:hover` no longer matches (cursor outside) → menu hides. All other behaviors preserved: hover open via CSS, click open/close toggle, focus open, blur close, trigger-click toggle. SPECIFICITY OF HIT AREA: the menu `<div id="product-dropdown-menu" className="nav-dropdown-menu">` is a JSX/DOM CHILD of the wrapper (Header.tsx:156, nested inside wrapper closing at line 187). Visually the menu uses `position: fixed; top: var(--header-height, 72px); left: 0; right: 0` (full-width panel anchored to header bottom), but React's onMouseLeave follows the DOM tree not the visual layout — so mouseleave fires only when the cursor exits the UNION of trigger box + fixed-positioned menu box. No "flashes closed before cursor reaches menu" issue. Verified `npx tsc --noEmit` clean. NOTE TO FUTURE CLAUDE: if user reports "the dropdown flashes closed when moving between trigger and menu" (would happen if React's mouseleave didn't follow DOM children for fixed-positioned descendants on some browser), fixes: (a) timeout debounce — `onMouseLeave={() => { closeTimer.current = setTimeout(() => setOpenDropdown(null), 100); }}` + `onMouseEnter={clearTimeout}` on both trigger and menu, gives 100ms grace; (b) re-opener `onMouseEnter={() => setOpenDropdown('product')}` on the menu itself. If user wants the dropdown to ONLY close on click-outside (desktop-app style, never on mouseleave), revert this commit. On mobile touch where mouseleave doesn't fire, no change needed — touch users tap outside or tap the trigger again to toggle. The locale-switcher dropdown (Header.tsx ~248+) uses a different pattern and is NOT affected — only the 2 main nav dropdowns (Product, Community) got this fix.
