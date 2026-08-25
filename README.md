# Didehban Jahan Visual MVP

This repository contains the local, interactive Visual MVP for **Didehban Jahan (دیده‌بان جهان)**. It tests the complete product structure, seven product areas, evidence-linked analysis, map/chart/table patterns, roles, RTL/LTR behavior, and the organization’s design system before approved screens are recreated in Figma.

This is **not production software**. It has no real sign-in, database, API, crawler, AI provider, export service, map provider, or production security system. All intelligence content is deterministic local demonstration data.

## Quick start

You need Node.js and npm. They are already available on the computer used to create this foundation.

1. Open a terminal in this folder.
2. Install the project’s packages once:

   ```powershell
   npm install
   ```

3. Start the local prototype:

   ```powershell
   npm run dev
   ```

4. Open the local address shown in the terminal, normally `http://localhost:5173`. The default route opens World Monitor.

The product starts in Persian, RTL, and light theme. The top bar can switch language and theme. The clearly labelled prototype role switch demonstrates `viewer`, `org-admin`, `data-manager`, and restricted states. The Phase 1 diagnostic remains available at `/foundation`.

## Product routes

- `/world` — World Monitor (default)
- `/developments` — Developments & Forecasts
- `/security` — Security & Geopolitics
- `/markets` — Economy & Markets
- `/countries` — Countries & Routes
- `/reports` — Reports & Analysis
- `/data` — Data Management; select the Data Manager prototype role to review authorized content
- `/foundation` — design-system, direction, and theme diagnostic

## Common commands

| Command                | What it does                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `npm run dev`          | Starts the local prototype and refreshes it when files change.                            |
| `npm run build`        | Checks that a production-style static bundle can be created. It does not deploy anything. |
| `npm run preview`      | Previews the most recent build locally.                                                   |
| `npm run format`       | Tidies code and documentation formatting.                                                 |
| `npm run format:check` | Checks formatting without changing files.                                                 |
| `npm run lint`         | Finds suspicious code patterns.                                                           |
| `npm run typecheck`    | Checks TypeScript contracts for mistakes.                                                 |
| `npm run test`         | Runs the automated foundation and product interaction tests once.                         |
| `npm run check`        | Runs every required quality check in sequence.                                            |

## Where things live

- `PROJECT_CONTEXT.md` — canonical product understanding and decisions.
- `docs/product/` — prototype scope and product notes.
- `docs/architecture/` — a plain-language map of the technical foundation.
- `docs/decisions/` — short records explaining important technical choices.
- `docs/design-system/` — design-system inventory, gaps, and code mapping.
- `docs/assets/v15/` — preserved V15 visual references. They are evidence, not target designs.
- `inputs/design-system/` — exact supplied token/font source archives and extracted token JSON.
- `src/components/ui/` — editable shadcn-style component primitives.
- `src/components/product/` — application shell, module, Inspector, chart, and map contracts.
- `src/data/mock/` — deliberately small fake datasets used by the prototype.
- `src/services/` — the boundary that keeps UI code independent from future real APIs.
- `public/fonts/` — the selected Vazir FD-WOL and Inter files used locally.

## Design system and mock data

Core light/dark colors, brand colors, spacing, radii, shadows, and typography come from the supplied design-system package. Missing chart, map, and data-state colors are isolated prototype values; see [DESIGN_SYSTEM_INTAKE.md](docs/design-system/DESIGN_SYSTEM_INTAKE.md), [DESIGN_SYSTEM_MAPPING.md](docs/design-system/DESIGN_SYSTEM_MAPPING.md), and [VISUALIZATION_SEMANTICS.md](docs/design-system/VISUALIZATION_SEMANTICS.md).

Mock data is typed like future product data but stays local. The current domains include events, sources, countries, corridors, markets, forecasts, and reports. Theme, language, prototype role, and module layouts are saved only in the current browser. Clear this site’s browser storage to restore defaults.

## Important boundaries

- Do not put real credentials in this repository.
- Do not treat the diagnostic screen or Visual MVP as production intelligence or a final Figma design.
- Do not add a real integration until it is explicitly approved.
- Do not alter `PROJECT_CONTEXT.md` or the V15 images casually.
- Do not push or deploy this repository without explicit permission.
