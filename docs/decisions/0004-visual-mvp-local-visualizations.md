# ADR 0004: Local SVG visualizations and prototype workspace state

- Status: Accepted for the Visual MVP
- Date: 2026-08-24

## Decision

Build the Phase 2 map and charts with repository-owned SVG and semantic CSS. Use browser `localStorage` for theme, locale, development role, and page/role layout preferences. Do not add a map, chart, drag-grid, or state-management dependency.

## Why

- The prototype must run without map tokens, network tiles, APIs, or backend services.
- The current visual questions can be tested with a lightweight local world surface, event markers, timeline, layer controls, line/bar/matrix charts, and accessible data alternatives.
- Explicit move, resize, collapse, expand, and reset controls are clearer for keyboard review than a large drag-grid dependency. Layout affordances appear only in Edit Layout mode.
- One small React context is enough for prototype role, filters, Inspector, search, and honest local feedback.

## Trade-offs

The map is a schematic local operating surface, not a geographic engine. It does not provide accurate projection, pan gestures, tile detail, geocoding, or production clustering. Module resizing cycles through documented grid sizes rather than offering free-pixel resizing. These are appropriate MVP constraints and should be reconsidered only after the product structure is approved.
