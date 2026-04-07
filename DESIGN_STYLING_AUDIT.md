# GCSS Website - Design & Styling Audit (v3 - Fresh Pass)

**Date:** 2026-04-06
**Status:** Audit only - NO changes applied. Do not fix until instructed.
**Scope:** Design problems, Three.js/3D opportunities, ISO glass effects, interactive enhancements

---

## Previous Audit Items Already Fixed

The following issues from v1 audit have been resolved:
- Focus-visible styles added (`base.css:141-158`)
- `prefers-reduced-motion` support added (`globals.css:14-36`)
- CSS split from monolithic globals.css into 6 files
- `href="#"` placeholder links eliminated (0 remaining)
- Unsplash image URLs replaced with local images (0 remaining)
- Mobile nav class mismatch fixed + ARIA added (`Header.tsx:289-291`)
- Theme toggle has `aria-label` (`Header.tsx:236`)
- ScrollToTop button added (`ScrollToTop.tsx`)
- Cursor-following card glow activated (`useGlobalCardGlow.ts` + `GlobalEffects.tsx`)
- Magnetic button hook created (`useMagneticEffect.ts`)

---

## Table of Contents

1. [Critical Design Problems (Still Present)](#1-critical-design-problems-still-present)
2. [Visual & Aesthetic Issues](#2-visual--aesthetic-issues)
3. [Interaction & Animation Issues](#3-interaction--animation-issues)
4. [Responsive / Mobile Issues](#4-responsive--mobile-issues)
5. [Accessibility Issues (Remaining)](#5-accessibility-issues-remaining)
6. [Performance Concerns](#6-performance-concerns)
7. [Three.js / 3D Enhancement Opportunities](#7-threejs--3d-enhancement-opportunities)
8. [Glassmorphism (ISO Glass Effect) Enhancement Opportunities](#8-glassmorphism-iso-glass-effect-enhancement-opportunities)
9. [Other Interactive Tools & Effects](#9-other-interactive-tools--effects)
10. [Page-by-Page Audit](#10-page-by-page-audit)

---

## 1. Critical Design Problems (Still Present)

### 1.1 Confusing CSS Variable Names (Semantic Inversion)
- **File:** `tokens.css:9` - `--black: #ffffff` (white value in light mode)
- **File:** `tokens.css:19` - `--cream: #1c1917` (dark brown value named "cream")
- **File:** `tokens.css:74` - `--white: #ffffff` exists alongside `--black: #ffffff` (same value!)
- **File:** `tokens.css:116` (dark mode) - `--white: #0c0a09` (near-black named "white")
- **Impact:** High - developer confusion, maintenance nightmare.
- **Fix:** Rename to `--bg-base`, `--bg-surface`, `--fg-primary` etc.

### 1.2 Duplicate CSS Declarations Across Files
- `.glass-card` defined in `enhancements.css:31-38` AND `sections.css:486-493` with different values
- `.card` defined in `enhancements.css:49-53` AND `sections.css:486-493`
- `.btn-primary` defined in `components.css:19-24` AND `enhancements.css:254-258`
- `.pricing-card.featured` in `enhancements.css:358-363` AND `sections.css:813-815`
- `.cta-section::before` in `enhancements.css:523-529` AND `sections.css:753-759`
- `.hero-footer-icon color` in `sections.css:217` (with `!important`) AND inline styles in page.tsx
- **Impact:** High - unpredictable cascade, conflicting styles.

### 1.3 413 Inline Styles Across 13 Page Components
- **Worst offenders:**
  - `product/page.tsx` - 144 inline styles
  - `b2b/page.tsx` - 71 inline styles
  - `page.tsx (home)` - 41 inline styles
  - `forum/page.tsx` - 40 inline styles
  - `pricing/page.tsx` - 18 inline styles
  - `contact/page.tsx` - 14 inline styles
- **Examples of extractable patterns:**
  - `style={{ color: 'var(--primary)' }}` (repeated 3x in hero stats)
  - `style={{ marginTop: 12 }}` / `style={{ marginBottom: 16 }}` (spacing)
  - `style={{ border: '1px solid var(--border-light)' }}` (repeated 3x on matrix columns)
  - `style={{ fontSize: '2rem' }}` (12 language cloud spans with unique sizes)
  - `style={{ background: 'linear-gradient(135deg,#EB5A3C,#D4452A)' }}` (hardcoded gradient)
- **Impact:** High - can't be responsive (no media queries), can't be themed, hard to maintain.

### 1.4 `!important` Still Present (15 instances)
| File | Line(s) | Property |
|------|---------|----------|
| `components.css` | 225-227 | Nav dropdown padding, radius, font-size |
| `components.css` | 232-233 | Nav dropdown hover bg, color |
| `sections.css` | 217 | Hero footer icon color |
| `pages.css` | 1044-1045 | Dark mode background, border |
| `pages.css` | 1384 | Language cloud font size |
| `pages-extracted.css` | 4-8 | Product sub-nav positioning (5 props) |
| `enhancements.css` | 564 | Display block |
| `globals.css` | 18-20 | Reduced motion (acceptable usage) |
- **Note:** `globals.css:18-20` usage is acceptable (reduced-motion override). The other 12 are problematic.

### 1.5 Legacy/Redundant CSS Variables (14 aliases)
- **File:** `tokens.css:59-73` - 14 legacy aliases that just reference other variables:
  - `--primary-dark`, `--primary-light`, `--primary-bg`, `--accent`, `--accent-light`
  - `--dark-2`, `--dark-3`, `--gray-50` through `--gray-600`
- **Impact:** Medium - bloats token system, confusing which to use.

### 1.6 No Z-Index System
- Hardcoded z-index values scattered: `0`, `1`, `2`, `3`, `10`, `90`, `99`, `100`, `999`, `1000`, `10001`
- No CSS variables for z-index layers.
- **Impact:** Medium - z-index wars, stacking context bugs.

---

## 2. Visual & Aesthetic Issues

### 2.1 Monotone Gold Color Palette
- Every accent uses gold: `#E6A817`, `#FEBF1D`, `#D4890A`, `#F5B731`, `#F5C946`
- Even `--neon-blue` (`enhancements.css:18`) is gold: `rgba(230, 168, 23, 0.2)`
- Card icons are the only color variety (`enhancements.css:286-323`): blue, red, green, pink, purple - but only via `:nth-child` which is fragile
- **Impact:** Site feels monochromatic. No secondary brand color for variety.
- **Suggestion:** Add secondary accent (electric blue or teal) for info elements, links, secondary CTAs.

### 2.2 Trusted Brands Bar is Plain Text
- **File:** `page.tsx:140-145` - "ChargePoint", "EVBox", "Wallbox" etc. rendered as `<div className="trusted-logo">ChargePoint</div>`
- **Impact:** High - unprofessional, no credibility signal.
- **Suggestion:** Actual SVG/PNG logos, grayscale + hover color, infinite marquee scroll.

### 2.3 Hero Visual Area is Empty
- **File:** `page.tsx:74-99` - Right side has only 4 floating 52px icon boxes. No product visualization.
- **File:** `product/page.tsx:50-75` - Same pattern copied.
- **File:** `b2b/page.tsx:61+` - Same pattern again.
- **Impact:** Huge - hero is the first impression. Empty space = no product understanding.
- **Suggestion:** 3D EV charger model, dashboard mockup, or isometric illustration.

### 2.4 All Heroes Look Identical
- Home, Product, B2B, Pricing all use: `hero-badge` + `hero-title` + `hero-desc` + `hero-buttons` + `hero-split` + floating icons.
- **Impact:** Medium - pages lack individual identity. Users don't feel they've navigated.

### 2.5 Every Card is the Same
- Feature cards, model cards, pricing cards, product cards: same white/glass bg + subtle border + hover lift (`translateY(-4px)`).
- No gradient borders, colored tints, depth variations, or visual hierarchy.
- **Impact:** Medium - visual monotony.

### 2.6 Weak Section Separation
- Sections alternate between `var(--black)` and `var(--dark)` (white vs #F1F2F4 in light mode - barely visible difference).
- All use identical padding (100px), identical centered header pattern.
- **Impact:** Medium - sections blend together while scrolling.

### 2.7 Map Section is a Styled Placeholder
- **File:** `page.tsx:572-587` - Background gradient + world map image at 40% opacity + 5 pulsing dots at hardcoded positions.
- **Impact:** Medium - looks like a placeholder, not a real global presence visualization.

### 2.8 Footer Has No Visual Interest
- Just text links in columns. No social icons, no newsletter, no decorative elements, no glass treatment.
- **Impact:** Low-Medium.

### 2.9 Language Cloud Sizes Are All Inline
- **File:** `page.tsx:539-551` - 12 spans each with hardcoded `style={{ fontSize: 'X.Xrem' }}`.
- **Impact:** Low - could use CSS classes with size variants.

### 2.10 Hardcoded Colors in Gradients (Dark Mode Ignored)
- **File:** `enhancements.css:8-20` - All gradient definitions use hardcoded hex colors, no dark mode variants.
- **File:** `base.css:74` - `.text-gradient` uses hardcoded `#E6A817, #D4890A`.
- **File:** `page.tsx:510` - Matrix header gradient hardcoded: `#EB5A3C, #D4452A`.
- **File:** `page.tsx:572` - Map container gradient hardcoded: `#0B1120, #1a1a3e`.
- **Impact:** Medium - these don't adapt to theme changes.

### 2.11 No Data Visualization
- Stats are animated numbers only. No charts, progress bars, or infographics.
- Feature Matrix is text lists, not a visual comparison table.
- **Impact:** Medium - for B2B SaaS, data visualization builds trust.

---

## 3. Interaction & Animation Issues

### 3.1 No Stagger Animation on Card Grids
- Each `ScrollAnimation` wrapper triggers all children simultaneously.
- **Impact:** Low-Medium - staggered cascade entry feels much more polished.
- **Fix:** Add stagger delay via CSS `animation-delay` or GSAP stagger.

### 3.2 CSS Particles Are Fake
- **File:** `enhancements.css:177-205` - Fixed radial gradient dots with 20s translateY loop.
- **Impact:** Medium - static, no interaction, no mouse response.
- **Suggestion:** Replace with Three.js Points or tsParticles.

### 3.3 No Scroll Parallax
- All scroll animations are simple fade-up. No depth or speed variation.
- **Impact:** Medium - parallax adds premium depth.
- **Suggestion:** GSAP ScrollTrigger for layered motion.

### 3.4 Tilt Cards Still CSS-Only
- **File:** `enhancements.css:88-100` - Fixed rotation values on hover (1.5deg). Not mouse-tracking.
- **Note:** `useMagneticEffect.ts` exists but is NOT used on any cards - only created for buttons.
- **Impact:** Low-Medium - JS mouse-tracking tilt is much more engaging.

### 3.5 No Page Transition Animations
- Route changes are instant. Framer Motion is installed but unused.
- **Impact:** Medium - smooth transitions expected in modern SaaS.

### 3.6 Business Flow & Step Connectors Are Static
- **File:** `page.tsx:173-177, 278-280` - Plain SVG arrows and dashed lines.
- **Impact:** Low - could draw on scroll for storytelling effect.

### 3.7 useMagneticEffect Hook Created But Unused
- **File:** `src/hooks/useMagneticEffect.ts` - Fully implemented but not imported anywhere.
- **Impact:** Low - wasted code.

### 3.8 No Button Ripple/Click Feedback
- Buttons have hover states but no press/click visual response.
- **Impact:** Low.

### 3.9 15 Installed Packages Are Completely Unused
- **None of these are imported anywhere in `src/`:**
  - `gsap`, `@gsap/react` - animation library
  - `framer-motion` - animation library
  - `lottie-react` - animated icons
  - `tsparticles`, `@tsparticles/react`, `@tsparticles/slim` - particles
  - `canvas-confetti` - celebration effects
  - `react-fast-marquee` - infinite scroll
  - `embla-carousel-react`, `embla-carousel-autoplay` - carousel
  - `react-intersection-observer` - scroll observer
  - `react-use-measure` - element measuring
  - `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `three` - 3D
- **Impact:** Medium - adds ~2MB+ to node_modules, no benefit yet. All ready to use.

---

## 4. Responsive / Mobile Issues

### 4.1 Grid Classes Have NO Responsive Breakpoints
- **File:** `base.css:106-108`
  ```css
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-4 { grid-template-columns: repeat(4, 1fr); }
  ```
  No `@media` queries. 3-column grids remain 3-column on phones.
- **Impact:** Critical - layout broken on mobile/tablet.

### 4.2 Five Different Breakpoint Values
- 480px (`pages.css`, `pages-extracted.css`)
- 768px (`pages.css`, `pages-extracted.css`)
- 900px (`pages-extracted.css` only)
- 1024px (`pages.css`, `pages-extracted.css`)
- 1200px (`pages-extracted.css` only)
- **Impact:** High - no standard breakpoint system, inconsistent behavior.
- **Fix:** Standardize to 3-4 breakpoints with CSS variables or consistent values.

### 4.3 Hero Split No Tablet Breakpoint
- **File:** `sections.css:64-69` - `grid-template-columns: 1fr 1fr` with 60px gap, no collapse.
- **Impact:** High - squished on tablets.

### 4.4 Feature Row Uses `direction: rtl` Hack
- **File:** `sections.css:535-540` - Fragile, breaks RTL languages.
- **Fix:** Use `order` or `flex-direction: row-reverse`.

### 4.5 Forum/Docs Sidebar Fixed Width, No Mobile Collapse
- `pages.css:1-7` - Forum: `220px 1fr`
- `pages.css:118-125` - Docs: `250px 1fr`
- **Impact:** High on mobile - sidebar overflows or squishes content.

### 4.6 Hero Footer Bar No Wrapping
- **File:** `sections.css:191-195` - Flex with no `flex-wrap`, stats overflow on narrow screens.
- **Impact:** Medium - horizontal scrollbar on mobile.

### 4.7 Contact Grid Fixed 300px Column
- **File:** `pages.css:192-196` - `grid-template-columns: 300px 1fr`, no mobile fallback.
- **Impact:** Medium.

### 4.8 Typing Text Hardcoded Min-Widths
- **File:** `enhancements.css:148-168` - 380px/300px/240px/180px at breakpoints. May overflow with Chinese text.
- **Impact:** Low-Medium.

---

## 5. Accessibility Issues (Remaining)

### 5.1 Color Contrast Failures
| Variable | Value | On Background | Ratio | WCAG AA (4.5:1) |
|----------|-------|---------------|-------|-----------------|
| `--text-tertiary` (light) | `#757575` | `#ffffff` | ~4.6:1 | Borderline pass |
| `--text-muted` (light) | `#8a8a8a` | `#ffffff` | ~3.5:1 | FAIL |
| `--text-secondary` (dark) | `#a8a29e` | `#0c0a09` | ~4.2:1 | FAIL |
| `--text-tertiary` (dark) | `#78716c` | `#0c0a09` | ~3.0:1 | FAIL |
| `--text-muted` (dark) | `#57534e` | `#0c0a09` | ~2.0:1 | FAIL |
| `--primary` (light) | `#FEBF1D` | `#ffffff` | ~1.7:1 | FAIL (text) |

### 5.2 Nav Dropdowns Missing ARIA
- **File:** `Header.tsx` - No `aria-expanded` on dropdown triggers, no `aria-haspopup`, no keyboard trap management.
- Dropdowns open on `:hover` only - inaccessible to keyboard users.

### 5.3 Language Switcher No ARIA Labels
- **File:** `Header.tsx:219-230` - Language buttons have no `aria-label` (e.g., "Switch to Chinese").

### 5.4 SVG Icons Missing `aria-hidden`
- Decorative SVGs throughout all pages lack `aria-hidden="true"`.
- Screen readers announce meaningless path data.

### 5.5 Pricing "Popular" Badge is CSS-Only
- **File:** `sections.css:819-830` - `::before { content: 'Popular' }` not readable by screen readers, not translatable.

---

## 6. Performance Concerns

### 6.1 Excessive `backdrop-filter: blur()` Stacking
- Used on: header, sub-nav, glass cards, pricing cards, float badges, hero footer, nav dropdown, language switcher, scroll progress.
- **Impact:** GPU-intensive when stacked, causes jank on mobile.

### 6.2 Always-Running Infinite Animations
- `particlesDrift` (20s), `float3d` (6s), `gradientShift` (4s), `meshMove` (15s), `pulse-dot` (2s), `heroFooterGlow` (4s), `float` (3s), `blink` (0.7s)
- No viewport awareness - animate even when scrolled away.

### 6.3 Image Optimization Disabled
- `next.config.ts: images.unoptimized = true` - required for static export but means no auto WebP/AVIF, no resizing.

### 6.4 CSS File Size
- 7 CSS files totaling ~5,400+ lines with duplication.
- Could be reduced ~30% by deduplication alone.

### 6.5 Orb Blur Performance
- **File:** `enhancements.css:232` - `filter: blur(60px)` on decorative `.orb` elements. Heavy GPU cost.

---

## 7. Three.js / 3D Enhancement Opportunities

### 7.1 Hero Section - 3D EV Charger Model (Priority: P0)
- **Where:** Home hero visual area (`page.tsx:74-99`)
- **Current:** 4 empty floating icon boxes
- **Proposal:** Interactive 3D EV charging station with glass-like materials, slow auto-rotation, mouse-tracking rotation, glowing energy particles flowing through cables. Gold/amber lighting matching brand.
- **Tech:** `@react-three/fiber` + `@react-three/drei` (already installed)
- **Impact:** TRANSFORMATIVE - immediately shows what GCSS does, massive wow factor.

### 7.2 Interactive 3D Globe for Global Network (Priority: P0)
- **Where:** Map section (`page.tsx:572-587`)
- **Current:** Static image + CSS dots
- **Proposal:** Rotating globe with glowing city dots, animated arc connections between regions, particle trails. Click/hover for location details. Gold dots on dark globe matching brand palette.
- **Tech:** Three.js globe with custom shader
- **Impact:** High - dramatically visualizes global reach.

### 7.3 Product Page - 3D Dashboard Float (Priority: P1)
- **Where:** Product hero visual (`product/page.tsx:50-75`)
- **Current:** Copy of home page floating icons
- **Proposal:** 3D floating screen/dashboard with glass transparency, showing CPMS UI. Layers separate on hover revealing architecture depth.
- **Tech:** R3F + drei Html component

### 7.4 Background - Interactive 3D Particle Field (Priority: P1)
- **Where:** Replace CSS fake particles site-wide
- **Current:** `enhancements.css:177-205` - static radial gradients
- **Proposal:** Three.js Points system with mouse-reactive push/pull physics. Gold particles on dark, subtle on light.
- **Tech:** Three.js `Points` + `BufferGeometry` + custom vertex shader

### 7.5 B2B Page - 3D Network Topology (Priority: P1)
- **Where:** B2B architecture section
- **Current:** Text description only
- **Proposal:** 3D node graph: Super Admin node at top, operator nodes below, user nodes at bottom. Animated data particles flowing between connected nodes.
- **Tech:** d3-force-3d or custom Three.js

### 7.6 Feature Cards - 3D Mini Icons (Priority: P2)
- **Where:** Feature grids on home/product
- **Proposal:** Replace flat SVG icons with mini 3D objects (bolt, shield, globe, chart) that rotate subtly.
- **Tech:** R3F instances

### 7.7 Pricing - 3D Glass Tier Platforms (Priority: P2)
- **Where:** Pricing cards
- **Proposal:** Tiers as 3D glass platforms at different heights. Features float as glass tags. Enterprise tier elevated with bloom glow.
- **Tech:** R3F or CSS 3D transforms

### 7.8 Business Flow - 3D Isometric Pipeline (Priority: P2)
- **Where:** Business flow section (home)
- **Current:** Flat cards + arrow SVGs
- **Proposal:** 3D isometric blocks (User > Merchant > Charger) connected by glowing data tubes with flowing particles.

### 7.9 Loading/Page Transition - 3D Logo (Priority: P3)
- **Where:** Page transitions
- **Proposal:** 3D extruded "GCSS" text rotating into position during transitions.
- **Tech:** R3F + TextGeometry

### 7.10 Contact Page - 3D Animated Scene (Priority: P3)
- **Where:** Contact page visual
- **Proposal:** Low-poly 3D office scene or animated map pin.

---

## 8. Glassmorphism (ISO Glass Effect) Enhancement Opportunities

### 8.1 Hero Stats Bar - Multi-Layer Glass (Priority: P1)
- **Where:** `sections.css:166-179`
- **Current:** Basic `backdrop-filter: blur(20px)`
- **Proposal:**
  - Multiple glass layers at different blur levels
  - Rainbow prismatic edge refraction (CSS gradient borders)
  - Frosted inner glow (inset box-shadow with white)
  - Glass reflection gradient at top edge (linear-gradient overlay)
  - Inner shadow for depth sensation

### 8.2 Navigation Header - Premium Glass (Priority: P1)
- **Where:** `components.css:75-98`
- **Proposal:**
  - Multi-stop gradient border (white > transparent > white)
  - Subtle rainbow refraction on bottom edge
  - Active nav item rendered as frosted glass pill
  - Dropdown menus as layered glass panes with depth offset
  - Noise texture overlay for premium matte finish

### 8.3 Feature Cards - ISO Glass Treatment (Priority: P1)
- **Where:** All `.card` / `.glass-card` elements
- **Proposal:**
  - Stacked glass layers (card + offset shadow pane behind)
  - Edge highlight that shifts with mouse position (via `--mouse-x/--mouse-y`)
  - Interior frosted gradient (bright top > clear bottom)
  - Icon containers as glass circles with inner glow
  - On hover: glass brightens, edges get prismatic rainbow, glow intensifies
  - Glass "bloom" effect on interaction

### 8.4 Pricing Cards - Glass Tier Differentiation (Priority: P1)
- **Proposal:**
  - Free: Clear glass (high transparency, low blur)
  - Mid: Frosted glass (medium blur, subtle tint)
  - Enterprise: Gold-tinted glass with refraction + animated rainbow border
  - Each tier at different visual "depth" (shadow offset + blur intensity)
  - Featured card: pulsing glass glow + prismatic border animation

### 8.5 Section Dividers - Glass Separators (Priority: P2)
- **Where:** Between major sections
- **Current:** Barely visible bg color change
- **Proposal:** Thin horizontal frosted glass bars between sections with subtle border glow and blur. Clear visual breaks while maintaining glass aesthetic.

### 8.6 Form Fields - Glass Inputs (Priority: P2)
- **Where:** Contact, login, register, forgot-password, language request forms
- **Current:** Standard input styling
- **Proposal:**
  - Frosted glass input backgrounds
  - Luminous border on focus (glow outward)
  - Floating labels that rise above the glass field
  - Glass dropdown menus
  - Submit buttons with glass depth (layered effect)

### 8.7 Badges & Tags - Glass Pills (Priority: P2)
- **Where:** `.hero-badge`, `.section-label`, `.tag`
- **Current:** Solid `primary-dim` background
- **Proposal:**
  - Frosted glass background with blur
  - Thin luminous border with glow
  - Periodic light shimmer passing across surface
  - Subtle inner text-shadow for depth

### 8.8 Scroll Progress Bar - Glass Track (Priority: P3)
- **Where:** `enhancements.css:503-514`
- **Current:** Solid gold bar with box-shadow
- **Proposal:** Frosted glass track behind the gold fill. Progress bar itself has inner glow.

### 8.9 Footer - Glass Panel (Priority: P2)
- **Current:** Plain dark background
- **Proposal:**
  - Full-width frosted glass panel
  - Social icons as glass circles with hover glow
  - Newsletter input as glass field
  - Copyright bar as secondary glass layer with different opacity
  - Decorative mesh gradient visible through glass

### 8.10 Modal/Dialog - Glass Overlays (Priority: P3)
- **Where:** Future modals, tooltips, popups
- **Proposal:** Frosted backdrop, glass container border with refraction, content floating inside, glass circle close button.

### 8.11 Card Hover - Glass Bloom Effect (Priority: P1)
- **Where:** All interactive cards
- **Proposal:** On hover, frost intensifies, edges develop prismatic rainbow border, soft glow radiates outward through glass material. Transition duration ~0.4s with spring easing.

### 8.12 Navigation Dropdown - Layered Glass (Priority: P2)
- **Where:** `components.css:184-207`
- **Current:** Basic glass with opacity toggle
- **Proposal:** Glass pane that scales from 0.95 to 1.0 with blur, each menu item has subtle glass hover state, dividers as thin glass lines.

---

## 9. Other Interactive Tools & Effects

### 9.1 GSAP ScrollTrigger for Premium Scroll Effects (Priority: P0)
- **Package:** `gsap` + `@gsap/react` (installed, unused)
- **Where:** Replace current `IntersectionObserver`-based `ScrollAnimation`
- **Proposals:**
  - Pin hero section and animate elements out on scroll
  - Business flow items connect with SVG lines drawn progressively
  - Feature images parallax at different scroll speeds
  - Section headers with text split + stagger reveal
  - Cards cascade in with 3D rotation
  - Counter numbers trigger at precise scroll positions

### 9.2 Framer Motion Page Transitions (Priority: P0)
- **Package:** `framer-motion` (installed, unused)
- **Where:** Layout-level transitions
- **Proposals:**
  - `AnimatePresence` for route change animations
  - Page content fades/slides between routes
  - Shared layout animations for nav active state
  - Spring physics on card hover interactions
  - Exit animations on section scroll-away

### 9.3 Marquee for Trusted Brands (Priority: P1)
- **Package:** `react-fast-marquee` (installed, unused)
- **Where:** `page.tsx:136-148`
- **Proposal:** Infinite horizontal scroll with actual brand logos. Pause on hover. Gradient fade on edges.

### 9.4 tsParticles Interactive Background (Priority: P1)
- **Package:** `tsparticles` + `@tsparticles/react` + `@tsparticles/slim` (installed, unused)
- **Where:** Hero backgrounds, CTA sections
- **Proposal:** Gold particles that respond to mouse, connect with lines when nearby, gently drift. Much more engaging than current CSS dots.

### 9.5 Lottie Animated Icons (Priority: P2)
- **Package:** `lottie-react` (installed, unused)
- **Where:** Feature icons, section headers, loading states
- **Proposals:**
  - Charging bolt icon animates on scroll-in
  - Globe icon spins when section enters viewport
  - Shield icon assembles from particles
  - Chart draws data points progressively
  - Checkmarks animate on feature list reveal

### 9.6 Canvas Confetti on Key Actions (Priority: P3)
- **Package:** `canvas-confetti` (installed, unused)
- **Where:** Contact form success, pricing CTA click, demo request
- **Proposal:** Subtle gold confetti burst on successful user actions.

### 9.7 Embla Carousel for Testimonials/Screenshots (Priority: P2)
- **Package:** `embla-carousel-react` + autoplay (installed, unused)
- **Where:** Testimonials section, product screenshots, partner logos
- **Proposal:** Touch-friendly carousel with autoplay, dot indicators, swipe gestures.

### 9.8 Text Reveal / Split Animations (Priority: P1)
- **Using:** GSAP SplitText or custom
- **Where:** Section headings, hero titles
- **Proposals:**
  - Characters animate in with stagger delay
  - Clip-path reveal from bottom
  - Blur-to-sharp text entry
  - Word-by-word highlight effect

### 9.9 Magnetic Buttons (Priority: P2)
- **Hook:** `useMagneticEffect.ts` (created but not used anywhere)
- **Where:** Hero CTAs, pricing buttons, contact submit
- **Proposal:** Apply the existing magnetic hook to primary CTA buttons.

### 9.10 SVG Path Drawing on Scroll (Priority: P2)
- **Where:** Business flow arrows, step connectors, feature list checkmarks
- **Current:** Static SVGs
- **Proposal:** `stroke-dashoffset` animation triggered by scroll position.

### 9.11 Custom Cursor with Trailing Glow (Priority: P3)
- **Where:** Global
- **Proposal:** Gold dot cursor with trailing glow. Morphs larger on interactive elements.
- **Tech:** CSS custom cursor + JS tracking.

### 9.12 Noise/Grain Texture Overlay (Priority: P3)
- **Where:** Glass cards, hero backgrounds
- **Proposal:** Subtle SVG noise for premium matte finish on all glass elements.
- **Tech:** CSS `filter: url(#noise)` + inline SVG feTurbulence.

### 9.13 Odometer Number Counters (Priority: P3)
- **Where:** Hero stats, section counters
- **Current:** Basic eased increment via `CounterAnimation`
- **Proposal:** Each digit rolls independently like a mechanical counter.

### 9.14 Interactive Before/After Slider (Priority: P3)
- **Where:** Feature showcase, dashboard comparison
- **Proposal:** Draggable slider comparing old vs new, GCSS vs competitor.

### 9.15 Animated SVG Wave Section Dividers (Priority: P3)
- **Where:** Between sections
- **Proposal:** Animated SVG wave paths instead of flat color transitions.

---

## 10. Page-by-Page Audit

### Home Page (`/`)
| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | Hero visual area empty (just floating icons) | Critical | `page.tsx:74-99` |
| 2 | Trusted brands bar is plain text | High | `page.tsx:140-145` |
| 3 | 41 inline styles | High | Throughout |
| 4 | Business flow connectors are static SVGs | Medium | `page.tsx:173-177` |
| 5 | Feature matrix is plain text lists | Medium | `page.tsx:460-509` |
| 6 | Model cards (B2C/B2B) lack visual differentiation | Medium | `page.tsx:222-251` |
| 7 | Map section is styled placeholder | Medium | `page.tsx:572-587` |
| 8 | Language cloud uses 12 inline font-sizes | Low | `page.tsx:539-551` |
| 9 | Payment logos are text pills, not real logos | Medium | `page.tsx:604-607` |
| 10 | CTA section is generic text+button | Low | `page.tsx:676+` |
| 11 | Steps connectors are basic dashed lines | Low | `page.tsx:278-280` |
| 12 | All 6 feature cards visually identical | Medium | `page.tsx:325-400` |

### Product Page (`/product`)
| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | Hero visual copy-pasted from home | High | `product/page.tsx:50-75` |
| 2 | 144 inline styles (worst of all pages) | High | Throughout |
| 3 | Card icon colors hardcoded, ignore themes | Medium | `product/page.tsx:179-200` |
| 4 | Feature cards identical to home page | Medium | `product/page.tsx:80-124` |
| 5 | No actual product screenshots/UI previews | High | Missing |
| 6 | Sub-nav uses 5x `!important` | Low | `pages-extracted.css:4-8` |

### Pricing Page (`/pricing`)
| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | 18 inline styles | Medium | Throughout |
| 2 | All pricing cards visually identical | Medium | Cards all same size/style |
| 3 | No visual emphasis on price range ($0 vs $13,900) | Medium | Same card height |
| 4 | Feature lists text-only, no icons | Low | Plan features |
| 5 | "Popular" badge is CSS `::before` (not translatable, not accessible) | Medium | `sections.css:819` |

### B2B Page (`/b2b`)
| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | 71 inline styles | High | Throughout |
| 2 | Same hero pattern as all other pages | Medium | `b2b/page.tsx:61+` |
| 3 | Network architecture described in text only, no visualization | High | Missing |
| 4 | Revenue model could be interactive calculator | Medium | Static text |

### Contact Page (`/contact`)
| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | 14 inline styles | Medium | Throughout |
| 2 | Form submission is fake (state toggle) | High | `contact/page.tsx:27-29` |
| 3 | QR codes are placeholder SVGs | Medium | Placeholders |
| 4 | No map or location visual | Medium | Missing |

### Auth Pages (`/login`, `/register`, `/forgot-password`)
| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | Login: 6 inline styles, hardcoded alert colors | Medium | `login/page.tsx` |
| 2 | Register: 4 inline styles | Low | `register/page.tsx` |
| 3 | Forgot-password: 10 inline styles | Medium | `forgot-password/page.tsx` |
| 4 | Visual side is solid gradient, no illustration | Medium | All auth pages |

### Forum Page
| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | 40 inline styles | High | Throughout |
| 2 | Sidebar doesn't collapse on mobile | High | `pages.css:1-7` |
| 3 | All content is placeholder/demo data | Medium | Throughout |

### Docs Page
| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | Sidebar doesn't collapse on mobile | High | `pages.css:118-125` |
| 2 | No syntax highlighting | Low | Code blocks |
| 3 | No auto table of contents | Low | Missing |

### FAQ Page
| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | 10 inline styles | Medium | `faq/page.tsx` |
| 2 | Accordion animation is basic | Low | Simple toggle |

### Blog Page
| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | 7 inline styles | Low | `blog/page.tsx` |
| 2 | All posts are placeholder content | Medium | Demo data |

---

## Priority Implementation Order

### P0 - Critical (Do First)
1. Fix grid responsive breakpoints (`.grid-2/3/4` mobile collapse)
2. Fix hero split layout tablet breakpoint
3. Three.js 3D EV charger in hero (replaces empty visual)
4. Framer Motion page transitions (layout.tsx)
5. GSAP ScrollTrigger scroll animations (replace ScrollAnimation)
6. Marquee for trusted brands (replace plain text)
7. Fix color contrast (`--text-muted`, `--text-tertiary` in dark mode)

### P1 - High Impact
1. Three.js interactive globe (replace map placeholder)
2. Full ISO glass card treatment (all cards)
3. Glass navigation header enhancement
4. Pricing cards glass tier differentiation
5. tsParticles interactive background
6. Text reveal animations on headings
7. Stagger animations on card grids
8. Extract inline styles to CSS classes (413 instances)
9. Deduplicate CSS declarations
10. Hero stats bar multi-layer glass

### P2 - Medium Impact
1. Glass form fields (contact, auth pages)
2. Glass section dividers
3. Glass footer panel
4. Magnetic buttons on CTAs (use existing hook)
5. SVG path drawing on scroll
6. 3D network topology (B2B page)
7. 3D pricing tier platforms
8. Lottie animated icons
9. Embla carousel for testimonials
10. Glass nav dropdown

### P3 - Polish & Delight
1. Custom cursor with gold glow trail
2. Canvas confetti on form submission
3. Noise texture overlay on glass
4. Odometer number counters
5. 3D logo page transition animation
6. Animated SVG wave dividers
7. Before/after comparison slider
8. Glass scroll progress bar track

---

## Summary Stats

| Metric | Count |
|--------|-------|
| Total CSS lines | ~5,400+ |
| Inline styles across pages | 413 |
| `!important` instances | 15 (12 problematic) |
| Duplicate CSS declarations | 5 major sets |
| Unused installed packages | 15 |
| Missing responsive breakpoints | Grid system + hero + sidebars |
| WCAG contrast failures | 5 color combinations |
| Pages with identical hero pattern | 4 |
| Installed but unused packages | 15 |
