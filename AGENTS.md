# Codex guidance

- Read `PROJECT_CONTEXT.md` completely before any product-facing change. Treat it as the canonical product source and never silently resolve items marked **Open**.
- Keep the prototype Persian-first and RTL-native. Preserve complete English/LTR support and direction-safe technical strings.
- Use the design-system sources in `inputs/design-system/` and the mapping in `docs/design-system/`. Mark any missing value as a placeholder; do not invent brand decisions.
- Keep viewer, organization-admin, and data-manager experiences separate in models, navigation, mock data, and future screens.
- Keep changes small, reviewable, and limited to the local prototype. Do not add production authentication, APIs, databases, AI providers, crawling, deployment, or security infrastructure without explicit approval.
- Never store real secrets. Use typed mock data until a real integration is explicitly approved.
- Before handoff, run formatting, linting, type checking, unit tests, a production build, and visual checks relevant to the change.
- Report changed files and verification results. Update documentation whenever a product or architecture decision changes.
