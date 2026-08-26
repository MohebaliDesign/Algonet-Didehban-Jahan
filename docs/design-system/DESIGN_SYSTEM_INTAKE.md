# Design-system intake

- Intake date: 2026-08-24
- Scope: Phase 1 local MVP foundation
- Status: Core tokens, fonts, and attached Figma component library reviewed; visualization semantics remain provisional

## Available sources

| Source                          | Repository location                                                       | Intake result                                                                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DesignSystem DesignTokens.zip` | `inputs/design-system/archives/`                                          | Preserved; 11 nested token packages extracted to `inputs/design-system/source/`.                                                                              |
| `Vazir FD-WOL.rar`              | `inputs/design-system/archives/`                                          | Preserved; Thin, Light, Regular, Medium, and Bold TTF files available.                                                                                        |
| `Inter.zip`                     | `inputs/design-system/archives/`                                          | Preserved; variable regular/italic and static TTF families plus OFL license available.                                                                        |
| shadcn/ui                       | [Official component documentation](https://ui.shadcn.com/docs/components) | Selected code-owned component approach, aligned with the attached Figma Pattern Design System.                                                                |
| Pattern Design System (Figma)   | Attached node `842:52080` and connected library search                    | Node context, screenshot, variable references, annotations, and core component identities reviewed. Code Connect is unavailable under the current Figma plan. |
| Iconsax                         | [Iconsax](https://app.iconsax.io/) and the official npm package           | Selected free icon family. No project-specific subset or icon usage rules were supplied.                                                                      |
| V15 references                  | `docs/assets/v15/`                                                        | Reviewed as capability evidence, not target visual design.                                                                                                    |

## Token-package inventory

| Package                  | Available content                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Alpha                    | White and black alpha steps: 0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100.                                                   |
| Border radius (absolute) | Source radius values including 0, 2, 4, 6, 8, 10, 12, 16, 24, and infinite.                                                           |
| Border radius            | Semantic shadcn aliases from `rounded-none` through `rounded-full`; base radius is 10.                                                |
| Brand colors             | Neutral scale 50–950; blue brand scale 50–950; primary `#416DFF`; secondary `#FF4000`; white foregrounds.                             |
| Raw colors               | Broad raw color foundations in the supplied Figma token export. These are source values, not permission to assign new semantics.      |
| Semantic colors          | Separate `shadcn` light and `shadcn-dark` files covering general, card, popover, focus, sidebar, and several unofficial helper roles. |
| Shadows                  | 2xs through 3xl, with x/y, blur, spread, and 5% black.                                                                                |
| Spacing (absolute)       | Source spacing values.                                                                                                                |
| Spacing                  | Semantic scale: 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96.                                                    |
| Typography (Persian)     | Vazir FD-WOL, headings 48/30/24/20, paragraphs 20/18/16/14/12, captions and monospaced roles.                                         |
| Typography (English)     | Inter with the same size/line-height structure and English weight names.                                                              |

## Fonts

### Persian

- Family: Vazir FD-WOL.
- Files: Thin, Light, Regular, Medium, Bold.
- Token wording uses `DemiBold`, but the archive has no DemiBold file. Phase 1 maps semibold text to Medium and records this as a gap.
- The archive contains no license or version metadata. Production redistribution rights are **missing and must be confirmed**.

### English

- Family: Inter.
- Variable upright and italic files are used by the prototype.
- Static optical sizes and weights are preserved in the source archive.
- OFL license is present.

## Logos

- No approved Didehban Jahan or organization logo assets were supplied.
- The diagnostic screen uses a small Iconsax eye symbol and text lockup only as a technical placeholder.
- Required for Phase 2: approved logo files, clear space, minimum size, color variants, favicon/app icon, and co-branding rules.

## Icons

- Library: Iconsax free icons.
- Available styles include linear, outline, bold, broken, bulk, and twotone.
- Missing: approved default style, stroke rules, sizes, filled/selected behavior, RTL mirroring rules, and the product icon subset.

## Color foundations

- Brand blue scale: 50 `#EFF6FF` through 950 `#1D3173`; 600 is `#416DFF`.
- Secondary orange: `#FF4000`; hover helper is `#D93600` in the light semantic file.
- Neutral scale: 50 `#FAFAFA` through 950 `#0A0A0A`.
- Full raw palette is preserved but not semantically reassigned in Phase 1.

## Semantic colors

Received light/dark values include background, foreground, primary, primary foreground, secondary, secondary foreground, accent, muted, destructive, border, input, card, popover, focus, and sidebar roles.

Missing or not explicitly approved:

- Informational and positive system roles.
- AI-generated state.
- Selected geography/layer state.
- Live, cached, stale, partial coverage, no data, and restricted access roles.
- State interaction pairs for hover, pressed, disabled, and focus in every theme.

The prototype uses visibly documented temporary status mappings for technical verification only.

## Typography

Received:

- Headings: 48/72, 30/45, 24/36, and 20/30.
- Paragraphs: 20/27, 18/27, 16/24, 14/20, and 12/16.
- Caption: 14/21.
- Monospaced role: 16/24, although both token sets point it to the primary sans family.
- Letter spacing: 0 throughout.

Open typography questions:

- Should Persian numerals be the default in general UI and charts?
- What is the approved fallback stack?
- What is the production treatment for monospaced technical strings?
- How should mixed Persian/English bold weights be visually balanced?

## Spacing

- Available semantic steps run from 0 to 96.
- The scale is suitable for component padding and responsive layout.
- Missing: page gutters, maximum content widths, dense/comfortable modes, and module grid spacing rules.

## Radius

- Available roles: none, xs 2, sm 4, md 6, lg 8, base 10, xl 12, 2xl 16, 3xl 24, full 1000.
- Missing: component-by-component radius usage rules.

## Elevation

- Eight shadow roles are supplied, all using 5% black.
- The supplied `sm` shadow has a positive spread of 15, which is unusual and should be checked against the design source before broad use.
- Missing: dark-theme elevation treatment and a component elevation matrix.

## Component inventory

Received as a source choice, not as finished product specifications:

- shadcn component documentation.
- Official code-owned shadcn primitives required by the current Visual MVP; see `SHADCN_COMPONENT_MAPPING.md` for the final inventory.
- Iconsax icon component wrapper.

The MVP now implements application shell, navigation, filters, search, select/input, tabs, menus, Sheet Inspector, tooltip, toast, table, module, chart, map-control, alert, empty/restricted, loading, and edit-layout compositions from shadcn primitives. Final Figma specifications remain open for pagination (not currently needed), freeform resizing, and several product-specific state matrices.

## Component states

The token source contains some hover/focus/destructive helpers, but there is no complete approved state matrix. Required states:

- Default, hover, pressed, focus-visible, disabled, read-only, loading, selected, and invalid.
- RTL/LTR, light/dark, touch, keyboard, and reduced-motion behavior.
- Viewer, organization-admin, and data-manager permission variants where relevant.

## Chart colors

Not supplied. Required:

- Categorical palette and maximum category count.
- Sequential and diverging palettes.
- Forecast/estimate versus observed styling.
- Positive/negative and confidence-band treatment.
- Dark/light contrast and color-vision accessibility rules.

## Map colors

Not supplied. Required:

- Base map for light and dark modes.
- Land, water, borders, labels, selected geography, and disabled layers.
- Event severity, density/heat, clusters, routes, corridors, and uncertainty.
- Layer order, overlap, and accessible non-map alternatives.

## RTL rules

Confirmed product requirements:

- Persian defaults to root RTL; English uses root LTR.
- URLs, IDs, tickers, coordinates, and timestamps remain isolated LTR.
- Directional icons mirror only when their meaning is spatial; brand and universal symbols do not mirror automatically.
- Logical CSS properties (`inline-start`, `inline-end`) are preferred.

Missing: approved icon-mirroring inventory, numeral rules, chart-axis behavior, map-control placement, and bidi truncation examples.

## Dark/light rules

- Separate semantic light and dark token files are present.
- Dark mode is not treated as an automatic inversion.
- Missing: theme-specific chart/map palettes, elevation, imagery, focus contrast, and organization-brand override rules.

## Accessibility requirements

The design system still needs documented targets for:

- WCAG conformance level and contrast thresholds.
- Focus indicator size/contrast.
- Minimum pointer target size.
- Error and state communication beyond color.
- Reduced motion and animation timing.
- Screen-reader names for icons, charts, and maps.
- Keyboard patterns for drawers, menus, module grids, and edit-layout mode.

## Open questions for Phase 2

1. What are the approved logo and organization co-branding assets?
2. Is Vazir FD-WOL licensed for repository and production distribution?
3. Which Iconsax style and sizes are defaults, and which icons mirror in RTL?
4. Is the dark semantic primary intentionally neutral (`#F5F5F5`) rather than brand blue?
5. What are the approved informational, positive, warning, AI, live, cached, stale, partial, no-data, error, and restricted mappings?
6. What are the approved chart and map palettes in both themes?
7. What is the component/state library or Figma design-system file?
8. What are the typography rules for numerals, Solar Hijri/Gregorian dates, local/UTC time, and mixed scripts?
9. What accessibility target and testing process should the design system follow?
