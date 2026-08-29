# shadcn/ui component library — Didehban Jahan

This project uses shadcn/ui as the default source for UI primitives while preserving Didehban Jahan's own semantic design tokens, typography, localization, and product-specific compositions.

## Current project configuration

The repository is already initialized for shadcn/ui through `components.json`:

- Style: `new-york`
- TypeScript: enabled
- Tailwind CSS v4: enabled
- CSS variables: enabled
- UI alias: `@/components/ui`
- RTL: enabled
- Runtime direction: controlled by the existing `DirectionProvider`

Do not re-run `init` over the project unless the configuration is intentionally being rebuilt. The style is an initialization-level choice and should not be switched casually in an existing customized codebase.

## MCP

VS Code project-level MCP configuration is committed at `.vscode/mcp.json` and starts the official shadcn MCP server with:

```bash
npx shadcn@latest mcp
```

For Codex, add the server to the user-level `~/.codex/config.toml` because that configuration is not repository-scoped:

```toml
[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]
```

After restarting the editor/assistant, use the shadcn MCP server to search the registry, inspect component implementations, and add the appropriate primitive before writing a custom control.

## CLI workflow

Inspect the current setup:

```bash
npm run shadcn:info
```

Add a component only when the product needs it:

```bash
npm run shadcn:add -- dialog
npm run shadcn:add -- combobox
npm run shadcn:add -- form
```

Run the MCP server manually if needed:

```bash
npm run shadcn:mcp
```

Do not install the full registry pre-emptively. shadcn/ui is source-distributed; the project should own only the primitives it actually uses.

## Architecture contract

### `src/components/ui`

Owns shadcn primitives and narrowly scoped project adaptations. Accessibility semantics, focus behavior, keyboard behavior, state attributes, and primitive composition should remain aligned with shadcn/Radix behavior.

### `src/components/product`

Owns reusable Didehban Jahan compositions such as the application shell, module frames, page headers, map details, and dashboard patterns. These components compose primitives from `@/components/ui`.

### `src/features`

Owns feature/page composition. Feature code must not recreate primitive controls with raw HTML when a shadcn primitive exists.

### Data visualization

Highcharts remains the visualization engine for charts and maps. shadcn is responsible for the surrounding interface controls, panels, tabs, filters, dialogs, tables, states, and other UI primitives.

## Design tokens and visual language

`src/styles/tokens.css` is the project source of truth for Didehban Jahan visual tokens.

Keep these mappings project-owned:

- brand colors
- semantic surface and foreground colors
- `primary`, `secondary`, `accent`, `muted`, `destructive`
- borders, inputs, rings, cards, popovers, sidebar tokens
- typography and Persian/English font families
- radius, spacing, and elevation tokens
- light/dark theme values

Generated shadcn demo values must never overwrite approved project tokens. Prefer semantic classes and CSS variables in UI components instead of hard-coded brand values.

## Persian and RTL

- Persian is the primary RTL mode.
- Keep `rtl: true` in `components.json`.
- Keep the locale-driven `DirectionProvider` around the application.
- Prefer logical utilities/properties such as `start`, `end`, `ps`, and `pe` in reusable primitives.
- Mirror directional arrows/chevrons only when direction changes meaning.
- Use explicit LTR direction for URLs, source IDs, timestamps, coordinates, code, market tickers, and similar technical strings.
- Persian UX copy should be natural Persian rather than a literal translation of English component examples.

## Icon exception

The project currently uses an Iconsax-based `Icon` wrapper as part of its established visual language. The official shadcn icon migration currently supports Lucide, Tabler, Hugeicons, Phosphor, Remix Icon, and legacy Radix icons, so do not run a bulk icon migration against Iconsax without a separate approved migration plan.

When a newly added shadcn component contains icons, normalize those icons to the project `Icon` wrapper while preserving the component's behavior and accessibility.

## Guardrail

`src/test/shadcn-usage.test.ts` prevents native interactive primitives from being introduced outside `src/components/ui`. If a low-level primitive is genuinely required, wrap or implement it in the UI layer rather than bypassing the rule in feature code.

## Required shadcn verification before merge

```bash
npm run shadcn:info
npm run check:shadcn
```

The repository-wide `npm run check` remains the broader project quality command. At the time this integration branch was created, `main` already contained unrelated Prettier and Highcharts TypeScript failures; those should be resolved in their own scoped change rather than silently bundled into the component-library migration.

Also visually verify both Persian RTL and English LTR modes, keyboard focus, dialogs/popovers, long localized content, dark/light themes, and responsive states affected by the change.
