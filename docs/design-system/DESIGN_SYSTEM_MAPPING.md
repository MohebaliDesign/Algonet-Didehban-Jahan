# Design-system mapping to prototype code

## Principle

Source token JSON is preserved under `inputs/design-system/source/`. Application code must not import Figma export structure directly. Instead, `src/styles/tokens.css` provides a small semantic layer with stable names. This lets the design team revise source values later without forcing every component to change.

```text
Supplied token JSON (preserved)
→ reviewed source values
→ semantic CSS variables
→ official code-owned shadcn component primitives
→ feature modules
```

## Source-to-code layers

| Layer                       | Purpose                                     | May feature code use it?                        |
| --------------------------- | ------------------------------------------- | ----------------------------------------------- |
| Source JSON                 | Exact Figma/export evidence                 | No. Read-only intake source.                    |
| Foundation variables        | Brand scales, spacing, radii, font families | Sparingly, mainly within token/component files. |
| Semantic variables          | Background, text, action, border, state     | Yes. This is the preferred component contract.  |
| Component variables/classes | Button, card, badge, future module shell    | Yes, through reusable primitives.               |

## Core semantic mapping

| Product concept       | Code token                 | Supplied source                                 | Status                                                                                           |
| --------------------- | -------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Background            | `--background`             | `semantic colors/general/background`            | Supplied, light and dark.                                                                        |
| Surface               | `--surface`                | `semantic colors/card/card`                     | Supplied, light and dark.                                                                        |
| Elevated surface      | `--surface-elevated`       | Currently aliases card                          | **Temporary alias**; elevation-specific surface not supplied.                                    |
| Primary action        | `--primary`                | `semantic colors/general/primary`               | Supplied, theme-specific.                                                                        |
| Primary action text   | `--primary-foreground`     | `general/primary foreground`                    | Supplied.                                                                                        |
| Secondary action      | `--secondary`              | `general/secondary`                             | Supplied, theme-specific.                                                                        |
| Secondary action text | `--secondary-foreground`   | `general/secondary foreground`                  | Supplied.                                                                                        |
| Text                  | `--foreground`             | `general/foreground`                            | Supplied.                                                                                        |
| Muted text            | `--muted-foreground`       | `general/muted foreground`                      | Supplied.                                                                                        |
| Border                | `--border`                 | `general/border`                                | Supplied.                                                                                        |
| Focus                 | `--ring`                   | `focus/ring`                                    | Supplied; global focus also uses brand blue for clear visibility pending accessibility approval. |
| Critical/error        | `--destructive`            | `general/destructive`                           | Supplied.                                                                                        |
| Informational         | future `--status-info`     | No approved semantic assignment                 | Missing.                                                                                         |
| Positive              | future `--status-positive` | No approved semantic assignment                 | Missing.                                                                                         |
| Warning               | future `--status-warning`  | No approved semantic assignment                 | Missing.                                                                                         |
| AI-generated state    | `--temp-ai`                | Temporary alias to brand 600                    | **Placeholder.**                                                                                 |
| Selected state        | `--temp-selected`          | Temporary alias to brand 600                    | **Placeholder.**                                                                                 |
| Live                  | `--temp-live`              | Raw color used only for diagnostic verification | **Placeholder.**                                                                                 |
| Cached                | `--temp-cached`            | Raw color used only for diagnostic verification | **Placeholder.**                                                                                 |
| Stale                 | `--temp-stale`             | Raw color used only for diagnostic verification | **Placeholder.**                                                                                 |
| Partial coverage      | `--temp-partial`           | Raw color used only for diagnostic verification | **Placeholder.**                                                                                 |
| No data               | `--temp-no-data`           | Neutral 500                                     | **Placeholder semantic assignment.**                                                             |
| Error                 | `--temp-error`             | Light destructive value                         | **Placeholder for data-state usage; destructive source exists.**                                 |
| Restricted access     | `--temp-restricted`        | Neutral 600                                     | **Placeholder semantic assignment.**                                                             |

Placeholder values must remain prefixed `--temp-` until the design owner approves the semantic mapping. They may be used only where a visible label also communicates the state.

## Theme mapping

The default `:root` block maps the supplied light semantic file. `:root[data-theme='dark']` maps the supplied dark semantic file. Components never choose a theme value themselves.

Notable source behavior kept without reinterpretation:

- Light primary is brand blue `#416DFF`.
- Light secondary is orange `#FF4000`.
- Dark primary is neutral `#F5F5F5` with dark foreground.
- Dark secondary is neutral `#262626`.

The dark action choices should be confirmed in Phase 2, but Phase 1 preserves the delivered source rather than silently replacing them with brand colors.

## Typography mapping

| Locale            | Root family  | Source                                           | Code behavior                                                                                      |
| ----------------- | ------------ | ------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Persian           | Vazir FD-WOL | Persian typography tokens and supplied TTF files | Default root font in `fa-IR`; 500 is also used for semibold because no DemiBold file was supplied. |
| English           | Inter        | English typography tokens and variable TTF files | Root font when `lang` starts with `en`; weight range 100–900.                                      |
| Technical strings | Inter        | No separate approved monospace file              | Direction-isolated LTR with Inter as a temporary practical choice.                                 |

Typography sizes remain available from the source package. The diagnostic screen uses only a small responsive subset; it is not a final product type scale implementation.

The Visual MVP now consumes the semantic roles in `src/styles/typography.css`; see `TYPOGRAPHY_USAGE.md`. The source 48px Heading 1 value remains preserved, while the explicit product-level Display maximum is 40px. No visible product text may be smaller than 12px.

## Spacing, radius, and elevation mapping

- CSS space variables use the supplied numeric steps: 4, 8, 12, 16, 20, 24, 32, 40, and 48 in the initial convenience subset.
- Radius variables map directly to supplied values 2, 4, 6, 8, 12, 16, and 24.
- Shadow variables preserve the supplied 5% black values. Components use elevation conservatively until dark-mode rules are approved.
- Logical CSS properties are required for RTL-safe layout.

## shadcn component mapping

`components.json` records the Vite, CSS-variable, RTL, and alias setup. Component source lives in `src/components/ui/` so it can be reviewed and adapted.

The completed route-by-route inventory, installed primitives, product compositions, and sole map exception are recorded in `SHADCN_COMPONENT_MAPPING.md`.

| shadcn concept              | Prototype implementation                             |
| --------------------------- | ---------------------------------------------------- |
| `background` / `foreground` | Supplied general semantic tokens.                    |
| `card`                      | `--surface` and `--foreground`.                      |
| `primary`                   | Supplied theme-specific primary pair.                |
| `secondary`                 | Supplied theme-specific secondary pair.              |
| `muted`                     | Supplied muted pair.                                 |
| `accent`                    | Supplied accent pair.                                |
| `border` / `input` / `ring` | Supplied semantic values.                            |
| Radius                      | Supplied radius aliases rather than shadcn defaults. |
| Icons                       | Iconsax wrapper; no Lucide dependency.               |

New primitives should be added only as features need them. Do not import large component packs preemptively.

## Localization and direction mapping

- Locale metadata lives in `src/localization/settings.ts`.
- Diagnostic copy lives in `src/localization/messages.ts`; future features should own or namespace their messages.
- The preference provider owns the root `lang`, `dir`, and `data-theme` attributes.
- URLs, IDs, tickers, coordinates, and ISO/UTC timestamps use `dir="ltr"` and Unicode isolation.
- `Intl.DateTimeFormat` is the future formatting boundary for Persian/Gregorian calendars and local/UTC time. Final product display rules remain open.

## Data-state mapping

TypeScript provides one stable state union:

```text
loading | fresh | cached | stale | partial | empty | error | restricted
```

Every future module state should include a text label, timestamp when relevant, and a next action when one exists. Color is supplementary. State thresholds and the final palette are configuration/design decisions for Phase 2.

## Missing mappings before final visual design

- Logos and customer co-branding.
- Full component specifications and state matrices.
- Approved chart and map palettes.
- Final data-state and AI-state semantics.
- Icon style, size, and RTL mirroring inventory.
- Numeral, date, calendar, timezone, and monospaced-string rules.
- Accessibility targets and contrast verification for every token pair.

## Phase 2 provisional visualization layer

Phase 2 adds `src/styles/visualization.css` as a separate, replaceable prototype layer. Feature components may consume only its `--temp-viz-*` semantic names, never its raw values. The complete purpose, light/dark values, accessibility safeguards, and approval backlog are recorded in `VISUALIZATION_SEMANTICS.md`. This layer does not change approved source JSON or the core semantic mappings above.
