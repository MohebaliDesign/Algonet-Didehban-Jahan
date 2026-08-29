# Codex guidance

- Read `PROJECT_CONTEXT.md` completely before any product-facing change. Treat it as the canonical product source and never silently resolve items marked **Open**.
- Keep the prototype Persian-first and RTL-native. Preserve complete English/LTR support and direction-safe technical strings.
- Use the design-system sources in `inputs/design-system/` and the mapping in `docs/design-system/`. Mark any missing value as a placeholder; do not invent brand decisions.
- Keep viewer, organization-admin, and data-manager experiences separate in models, navigation, mock data, and future screens.
- Keep changes small, reviewable, and limited to the local prototype. Do not add production authentication, APIs, databases, AI providers, crawling, deployment, or security infrastructure without explicit approval.
- Never store real secrets. Use typed mock data until a real integration is explicitly approved.
- Before handoff, run formatting, linting, type checking, unit tests, a production build, and visual checks relevant to the change.
- Report changed files and verification results. Update documentation whenever a product or architecture decision changes.

## shadcn component-library contract

- Use shadcn/ui as the default component library for application UI.
- Before creating a new interactive control, search the shadcn registry through the shadcn MCP server or CLI.
- Add missing primitives with `npm run shadcn:add -- <component>`.
- Do not create raw `button`, `input`, `select`, `textarea`, `table`, `dialog`, or `progress` elements outside `src/components/ui`.
- Product-specific compositions belong in `src/components/product` or feature folders and must compose primitives from `@/components/ui`.
- Highcharts remains the visualization engine. Do not replace charts or maps with shadcn components.

### Project design-system overrides

- Preserve the project semantic tokens in `src/styles/tokens.css`.
- Never replace project brand colors, typography, spacing tokens, radii, or theme variables with shadcn demo values.
- Components should consume semantic tokens such as `background`, `foreground`, `primary`, `muted`, `accent`, `border`, `input`, `ring`, and their foreground pairs.
- Avoid hard-coded brand colors inside components when a token exists.
- The existing Iconsax-based `Icon` wrapper is a project-level visual-system override. Keep icon usage consistent with the wrapper unless an explicit icon migration is approved.

### Persian, RTL, and localization

- Persian is a first-class layout mode, not a text-only translation.
- Keep `components.json` RTL support enabled and use the existing `DirectionProvider` for runtime `rtl`/`ltr` switching.
- Prefer logical direction utilities and properties (`start/end`, `ps/pe`) instead of physical left/right values in reusable UI primitives.
- Mirror directional icons when required. Keep inherently LTR content such as URLs, IDs, coordinates, timestamps, tickers, and code readable with explicit direction.
- Write natural Persian product copy; do not translate English UI wording literally.

### shadcn ownership model

- `src/components/ui`: shadcn primitives and narrowly scoped project adaptations.
- `src/components/product`: reusable Didehban Jahan compositions built from shadcn primitives.
- `src/features`: page/feature composition; no duplicate primitive implementations.
- Do not install the entire registry pre-emptively. Add only components required by product behavior.
- When a generated shadcn file is customized, preserve accessibility behavior, states, data attributes, and Radix/Base UI semantics unless there is a documented product reason to change them.

### Verification

Run the shadcn integration checks before merging UI changes:

```bash
npm run shadcn:info
npm run check:shadcn
```

The repository-wide formatting, type checking, full unit suite, build, and visual checks remain required by the general handoff rules above. Do not hide pre-existing failures by weakening those project-level rules or by bundling unrelated fixes into a component-library change.

The Vitest shadcn guardrail must remain passing. If a native primitive is genuinely necessary, implement or wrap it in `src/components/ui` rather than bypassing the guardrail in a feature file.
