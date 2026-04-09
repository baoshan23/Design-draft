# GCSS Project - Gemini CLI Interaction Mandates

This document defines the foundational mandates and operational workflows for the GCSS (Global Charger System Service) project. These instructions take absolute precedence over general defaults.

## Project Structure & Scope

- **Frontend Development:** Located in `website/frontend/`. All website changes, features, and UI/UX improvements MUST be implemented here.
- **Design Assets:** Located in `Design/`. Contains reference material, 3D diagrams, and globe visualizations.
- **Documentation:** General project docs are in the root; SEO-specific prompts are in `SEO/`.

## Core Mandates

- **Internationalization (i18n):** The project uses `next-intl`. NEVER hardcode user-facing strings in JSX. Always use the `useTranslations` hook and add keys to `messages/en.json` and `messages/zh.json`.
- **Styling Architecture:** 
  - Prefer **Vanilla CSS** following the established modular structure in `website/frontend/src/app/styles/`.
  - Adhere to the design tokens in `tokens.css`.
  - Maintain the "Fluid Glass Design" aesthetic (glassmorphism, interactive feedback, smooth animations).
  - Use `framer-motion` or `gsap` for complex animations as per project usage.
- **Component Development:**
  - Follow the directory structure: `src/components/layout`, `src/components/ui`, `src/components/sections`, `src/components/effects`.
  - Always use TypeScript with strict typing. Avoid `any`.
- **Deployment & Server:**
  - Use existing scripts in `website/frontend/scripts/` for deployment tasks if necessary.
  - Follow `GITHUB_DEPLOYMENT_SETUP.md` for CI/CD related changes.

## Engineering Standards

- **Research First:** Before any modification, identify relevant CSS modules in `src/app/styles/` to ensure visual consistency.
- **Validation:** Always run `npm run build` in `website/frontend` to ensure type safety and build success before considering a task complete.
- **Sub-Agents:** Use the `frontend-auditor` custom agent instructions (if applicable) found in `.claude/agents/` when performing deep UI reviews.

## Proactive UI/UX
- When adding new sections or components, prioritize high visual impact. Include interactive states (hover, focus, active), smooth transitions, and accessibility features (e.g., `prefers-reduced-motion` support).
