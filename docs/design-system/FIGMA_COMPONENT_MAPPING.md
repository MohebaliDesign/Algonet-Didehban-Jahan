# Figma component mapping

## Source inspected

- File: [Pattern Design System](https://www.figma.com/design/mNk7rdbqggfjpx9eZoICqL/Pattern-Design-System?node-id=842-52080)
- Supplied parent: `842:52080` (`📏 Style Guide`)
- Design context inspected: `842:52081` (`Changelog`), including its screenshot, variable references, typography, spacing, and annotations.
- Library searched: `Pattern Design System`, updated 2026-08-23 in the connected Figma account.

The inspected Figma context references Vazir FD-WOL, 14px paragraph text with 21px line height, 24px Heading 3 with 36px line height, semantic color variables, and a 48px Heading 1 source token. The last value is intentionally capped at 40px in product semantics per the explicit product-owner requirement.

Code Connect could not be queried because the Figma organization/plan rejected Code Connect access even though the connected user has a Full seat. No Code Connect mapping was invented. The mapping below therefore uses Figma library component identity, local token exports, component annotations, and existing code semantics.

## Component mapping

| Figma component     | Figma key                 | Code mapping                                | Alignment decision                                                                                                      |
| ------------------- | ------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Button              | `a853c589…`               | `src/components/ui/button.tsx`              | Existing code-owned variants retained; 14px/500 control role and 40px minimum height                                    |
| Icon Button         | `4f529eb1…`               | `.icon-button` and shared module controls   | 40px square, explicit accessible name, hover/focus/disabled behavior                                                    |
| Input               | `9d2fd01c…`               | Search and `.inline-search` patterns        | 14–16px text, 40px minimum height, semantic border/background/focus                                                     |
| Command             | `95770125…`               | `GlobalSearch`                              | Existing search palette retained; 16px result title and keyboard-operable results                                       |
| Select & Combobox   | `c72adfc9…`               | Context, report, and data toolbar selects   | Native select semantics retained; 14px/500 control role and 40px minimum height                                         |
| Checkbox            | `5c887c7e…`               | Current map-layer toggle semantics          | Existing button-based toggle remains because it opens layer behavior; selected state has icon and text, not color alone |
| Switch              | `e702b684…`               | Theme/language prototype controls           | Existing explicit buttons retained; production switch primitive is not introduced without a product need                |
| Tabs                | `343d8fe6…`               | Inspector tabs and segmented controls       | 14px/500 labels, 40–48px height, selected border plus text color                                                        |
| Badge               | `dce97846…`               | `src/components/ui/badge.tsx`, state badges | 14px caption role, 28px minimum height, text + dot/icon state                                                           |
| Tooltip             | `062acc20…`               | Native `title` plus visible labels          | No tooltip dependency added; icon-only controls also receive `aria-label`                                               |
| Menu Item           | `49920f98…`               | Module overflow menu                        | 14px control role, 40px row, semantic hover/focus surface                                                               |
| Card                | `c80f813e…`               | `src/components/ui/card.tsx`, `ModuleFrame` | Existing surfaces/radii/borders preserved; widget title now uses semantic role                                          |
| Table Header / Cell | `12829a57…` / `2f63f06e…` | Dense and chart-alternative tables          | 14px minimum text, 44–48px rows, intentional overflow container                                                         |
| Pagination          | `0ffe6f7d…`               | No current product pagination control       | Documented for future use; no unused primitive added                                                                    |
| Dialog              | `61c6a65a…`               | Global search modal                         | Existing modal semantics retained; larger text and controls applied                                                     |
| Drawer              | `09fd052f…`               | Inspector                                   | Existing RTL-left/LTR-right product behavior retained; width increased for readable text                                |
| Empty               | `32ce60a9…`               | Empty/state surfaces                        | Existing state contract retained with semantic text, icon, and action                                                   |

## Product-specific patterns

Navigation items, the global top bar, context filters, module headers, map controls, the Inspector, AI analysis, and data-state surfaces are product compositions rather than replacements for the core Figma primitives. They continue to consume the same semantic colors, spacing, radii, typography, focus behavior, and Iconsax system.

## Remaining mismatches and approval needs

- Figma source Heading 1 is 48px; product Display is approved at 40px.
- Source tokens call for DemiBold but the supplied Vazir archive has no DemiBold file; product 600 remains mapped to Medium.
- Code Connect is unavailable under the current Figma plan.
- Final tooltip, pagination, checkbox, and switch product usage remains dependent on future feature requirements.
- Final chart/map semantic colors remain provisional and isolated in `visualization.css` as already documented.
