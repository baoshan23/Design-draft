# Frontend-Specific Gemini CLI Mandates

This document provides localized instructions for frontend development in the GCSS project.

## Development Lifecycle

1. **Locales First:** Any new UI text MUST be added to `messages/en.json` (English) and `messages/zh.json` (Simplified Chinese) simultaneously.
2. **Modular CSS:** Do NOT add inline styles (except for dynamic values with `framer-motion` or `gsap`).
   - Global tokens: `src/app/styles/tokens.css`
   - Common components: `src/app/styles/components.css`
   - Page-specific styles: `src/app/styles/pages.css` or `src/app/styles/sections.css`
3. **Animations:**
   - Use `framer-motion` for layout and scroll animations.
   - Use `gsap` for complex, high-performance timeline-based animations.
   - All animations MUST respect `prefers-reduced-motion` using the classes defined in `globals.css`.

## Coding Style

- **Functional Components:** Use arrow functions for React components.
- **Strict Typing:** Always define interfaces/types for props. Avoid using `any` or `object`.
- **Hooks:** 
  - Use `useTranslations` for i18n.
  - Use `useTheme` for theme-specific logic (not just styling).
- **Imports:** Use absolute path aliases defined in `tsconfig.json` (e.g., `@/components`, `@/hooks`).

## Deployment Safety

- Before running `npm run deploy`, ensure that `scripts/deploy.js` is correctly configured with current environment variables (see `ENV_VARIABLES.md`).
- NEVER commit sensitive data or environment secrets.

## UI/UX Quality

- All buttons must have hover and active states.
- All cards should implement the "Fluid Glass" effect (glass-card class).
- Maintain the futuristic/modern "Charger System" theme.
