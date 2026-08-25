# Provisional visualization semantics

- Status: **Prototype-only; requires design approval**
- Scope: Phase 2 Visual MVP
- Code location: `src/styles/visualization.css`

## Why this separate layer exists

The supplied design system defines brand, neutral, surface, action, typography, spacing, radius, and core semantic values. It does not define chart, map, confidence, severity, or operational data-state palettes. Phase 2 needs these meanings to test the product, so the prototype uses an isolated `--temp-viz-*` layer. These values do not modify or reinterpret approved source tokens.

Every use combines color with a label, icon, shape, line style, or table alternative. Replacing this file must not require feature-component changes.

## Token inventory

| Token                   | Light     | Dark      | Type                 | Purpose and current use                                                                                                              |
| ----------------------- | --------- | --------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `--temp-viz-blue`       | `#416DFF` | `#7193FF` | Categorical          | Observed primary series and selected visualization marks. Light aliases approved brand blue; dark is provisional for chart contrast. |
| `--temp-viz-cyan`       | `#0E7490` | `#5FC0D4` | Categorical          | Hazard/information differentiation and low-severity map events.                                                                      |
| `--temp-viz-violet`     | `#6D5BD0` | `#A598FF` | Categorical/semantic | AI-generated and forecast content, always with an AI label or dashed line.                                                           |
| `--temp-viz-teal`       | `#0F8B75` | `#58C6AD` | Semantic             | Positive/healthy movement, always accompanied by text or direction.                                                                  |
| `--temp-viz-amber`      | `#B46B0B` | `#E1A649` | Semantic             | Warning, degraded coverage, comparison threshold.                                                                                    |
| `--temp-viz-red`        | `#C33B42` | `#F07178` | Semantic             | Critical/error information; never decorative.                                                                                        |
| `--temp-viz-land`       | `#DCE5EF` | `#263341` | Map foundation       | Local SVG land surface.                                                                                                              |
| `--temp-viz-water`      | `#F5F8FB` | `#101820` | Map foundation       | Local SVG water/background surface.                                                                                                  |
| `--temp-viz-map-grid`   | `#CBD5E1` | `#334155` | Map foundation       | Geographic orientation grid.                                                                                                         |
| `--temp-viz-route`      | `#FF4000` | `#FF7446` | Map categorical      | Strategic corridor. The light value uses the supplied orange; dark is provisional.                                                   |
| `--temp-viz-confidence` | `#416DFF` | `#7193FF` | Semantic             | Analysis confidence marks; displayed with the numeric value.                                                                         |
| `--temp-viz-forecast`   | `#6D5BD0` | `#A598FF` | Semantic             | Forecast series, additionally distinguished with a dashed line and label.                                                            |
| `--temp-viz-low`        | `#0E7490` | `#5FC0D4` | Ordered severity     | Low severity; smallest map marker and text label.                                                                                    |
| `--temp-viz-medium`     | `#B46B0B` | `#E1A649` | Ordered severity     | Medium severity; marker size and label also communicate state.                                                                       |
| `--temp-viz-high`       | `#D05A31` | `#F08A60` | Ordered severity     | High severity.                                                                                                                       |
| `--temp-viz-critical`   | `#C33B42` | `#F07178` | Ordered severity     | Critical severity; largest marker plus text/icon.                                                                                    |

The existing `--temp-live`, `--temp-cached`, `--temp-stale`, `--temp-partial`, `--temp-no-data`, `--temp-error`, and `--temp-restricted` variables remain the provisional operational state contract from Phase 1.

## Accessibility rules used in the MVP

- Forecast and observed lines differ by both color and dash pattern.
- Map severity differs by size and is named in the legend and accessible list.
- Chart values use the shadcn tooltip/legend contract, Recharts accessibility layer, and expandable shadcn table alternatives.
- Matrices and maps provide textual alternatives.
- Live, cached, stale, partial, empty, error, and restricted states include visible words and icons.
- Color choices are intended for review, not claimed as final WCAG-approved pairs. Final contrast and color-vision testing is required after approval.

## Decisions still requiring approval

1. Final categorical, sequential, and diverging palettes and maximum category count.
2. Final map land, water, border, route, density, uncertainty, and selection values.
3. Final severity thresholds and whether high/critical should share the orange/red family.
4. Final confidence treatment and whether it should use brand blue.
5. Final AI/forecast identity and observed-versus-inferred visual rules.
6. Dark-theme map and chart contrast targets.
7. Approved meanings for live, cached, stale, partial, no-data, and restricted.
