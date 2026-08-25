# shadcn component mapping

- Status: **Implemented for the Visual MVP**
- Configuration: `components.json` (`new-york`, TypeScript, CSS variables, RTL, Iconsax)
- Visual authority: Didehban semantic tokens; shadcn supplies component anatomy and interaction behavior.

## Final inventory

| Existing pattern                                             | Official shadcn replacement                         | Migrated files                                                       | Product composition                                        | Status / exception                                                                  |
| ------------------------------------------------------------ | --------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Raw action and icon buttons                                  | `Button`, `Tooltip`                                 | `AppShell`, `ModuleFrame`, `WorldMap`, all feature pages, Foundation | `TopbarIconButton`, module actions, map toolbar            | Complete                                                                            |
| Hand-built organization/profile menus and module action menu | `DropdownMenu`                                      | `AppShell`, `ModuleFrame`                                            | Organization, profile, and module menus                    | Complete                                                                            |
| Native text/search inputs                                    | `Input`, `CommandInput`                             | `AppShell`, `WorldMap`, `ProductPages`                               | Global Search, layer search, country/report/source filters | Complete                                                                            |
| Native selects                                               | `Select`                                            | `AppShell`, `ProductPages`                                           | Context filters, role switcher, report/data filters        | Complete                                                                            |
| Binary/segmented controls                                    | `ToggleGroup`                                       | `WorldMap`, `ProductPages`                                           | Map/list, timeline, forecast horizon, chart/table          | Complete                                                                            |
| Layer toggles                                                | `Checkbox`                                          | `WorldMap`                                                           | Searchable map-layer list                                  | Complete                                                                            |
| Hand-built search overlay                                    | `Command` + `Dialog`                                | `AppShell`                                                           | `GlobalSearch`                                             | Complete                                                                            |
| Hand-built Inspector and tabs                                | `Sheet` + `Tabs` + `ScrollArea`                     | `AppShell`                                                           | Event, evidence, AI, timeline, source Inspector            | Complete                                                                            |
| Application navigation controls                              | `Sidebar` composition + `Button` + `Tooltip`        | `AppShell`                                                           | RTL-aware persistent product rail                          | Complete; the semantic `<aside>` and React Router links remain product-owned        |
| Product panels                                               | `Card` + `Separator` + `Collapsible`                | `ModuleFrame`, `WorldMap`, Foundation                                | `ModuleFrame`, layer panel, legend                         | Complete                                                                            |
| Status chips                                                 | `Badge`                                             | shared and feature files                                             | Data state, source status, confidence metadata             | Complete                                                                            |
| Loading/error/empty/restricted surfaces                      | `Skeleton`, `Alert`, `Empty`, `Badge`               | `ProductPages`                                                       | `DataStateCard`, restricted Data Management                | Complete                                                                            |
| Ingestion completion                                         | `Progress`                                          | `ProductPages`                                                       | Bounded ingestion-job progress only                        | Complete                                                                            |
| Native tables                                                | `Table`                                             | `ProductPages`, `Charts`                                             | Dense operational tables and chart alternatives            | Complete                                                                            |
| Local feedback element                                       | `Sonner`                                            | `main`, `WorkspaceProvider`                                          | Honest prototype responses                                 | Complete                                                                            |
| Hand-authored line SVG                                       | shadcn `ChartContainer` + Recharts `LineChart`      | `Charts`                                                             | Observed, forecast, threshold, sparkline                   | Complete                                                                            |
| CSS analytical bars                                          | shadcn `ChartContainer` + Recharts `BarChart`       | `Charts`                                                             | Comparison and freshness charts                            | Complete                                                                            |
| CSS matrix points                                            | shadcn `ChartContainer` + Recharts `ScatterChart`   | `Charts`                                                             | Regional tension/risk matrix                               | Complete                                                                            |
| CSS conic risk gauge                                         | shadcn `ChartContainer` + Recharts `RadialBarChart` | `Charts`, `ProductPages`                                             | Country composite-risk KPI                                 | Complete                                                                            |
| Geographic drawing surface                                   | Local semantic SVG                                  | `WorldMap`                                                           | Map geometry, routes, clusters, and markers                | Documented exception: shadcn has no map engine; all surrounding controls use shadcn |

## Installed UI source

The repository owns the generated shadcn source under `src/components/ui/`: `Alert`, `Avatar`, `Badge`, `Button`, `Card`, `Chart`, `Checkbox`, `Collapsible`, `Command`, `Dialog`, `Direction`, `DropdownMenu`, `Empty`, `Input`, `Label`, `Progress`, `ScrollArea`, `Select`, `Separator`, `Sheet`, `Sidebar`, `Skeleton`, `Slider`, `Sonner`, `Table`, `Tabs`, `Toggle`, `ToggleGroup`, and `Tooltip`.

Only components required by current interfaces were added. `Calendar`, `DatePicker`, `Pagination`, `RadioGroup`, and other unused registry components were deliberately not installed.

## Chart architecture

- `recharts` is the geometry dependency required by the official shadcn Chart architecture.
- Every standard chart is wrapped by `ChartContainer` and declares a typed `ChartConfig`.
- Tooltips use `ChartTooltip` and `ChartTooltipContent`; multi-series charts use `ChartLegend` and `ChartLegendContent`.
- Recharts `accessibilityLayer` is enabled and important charts retain an expandable shadcn `Table` alternative.
- Series colors reference the isolated `--temp-viz-*` contract in `src/styles/visualization.css`; no route owns a palette.
- Observed/forecast meaning also uses solid/dashed geometry, so color is not the only distinction.

## Project adaptations

- Generated Lucide imports were replaced with the configured Iconsax wrapper while retaining accessible labels for icon-only controls.
- Generated dark selectors were changed from the stock `.dark` class to the existing `[data-theme='dark']` contract.
- Stock shadcn semantic variables map to Didehban variables in `tokens.css`; no parallel theme or stock chart palette was introduced.
- Sheet sides, dropdown alignment, layout mirroring, and technical-string direction follow the current locale without duplicated RTL/LTR trees.
- Buttons keep the approved readable typography and at least a 40px target; generated component structure does not override the previous accessibility refinement.

## Compliance evidence

The repository check searches for direct `<button>`, `<input>`, `<select>`, `<textarea>`, and `<table>` in `src` excluding `src/components/ui`. The final audit returns zero occurrences. Native elements inside official shadcn implementations are expected. The remaining product SVG is the documented world-map exception, not a standard data chart.
