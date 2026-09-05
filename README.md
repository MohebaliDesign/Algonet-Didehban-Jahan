# Didehban Jahan (دیده‌بان جهان)

**Evidence-Based Intelligence & Global Monitoring Platform** — a Persian-first, RTL-native intelligence workspace for monitoring global developments, combining multi-source data, AI-assisted analysis, maps, charts, timelines, reports, and source traceability in one coherent product experience.

Didehban Jahan is designed to answer three questions clearly:

- **What is happening now?** — important developments, risks, markets, countries, routes, and global signals.
- **Why does it matter?** — evidence-linked assessments, confidence, trends, and contextual analysis.
- **Where did this conclusion come from?** — source provenance, supporting evidence, timestamps, and data-quality states.

The intended product flow is:

```text
Source → Raw Item → Normalized Event → Evidence Cluster → Signal → Assessment → Report
```

> **Repository status:** this repository contains the interactive **Visual MVP / product prototype**. It is not production software and does not currently connect to real authentication, databases, production APIs, crawlers, AI providers, export services, or production security infrastructure. Intelligence content is local demonstration data unless explicitly documented otherwise.

---

## Product overview

Didehban Jahan is not intended to be a wall of unrelated dashboard widgets. The target experience is an **evidence-based intelligence workspace** that turns fragmented, multi-source information into a clear, current, and traceable view of the world.

The product is:

- **Persian-first and RTL-native**, with a complete English/LTR mode.
- Designed for **general report consumers**, not only trained intelligence analysts.
- Built around **live and multi-source monitoring**.
- AI-assisted, while keeping **evidence, uncertainty, confidence, and freshness visible**.
- Structured for future **multi-tenant organizations, roles, permissions, and customization**.
- Dense enough for serious monitoring while remaining calm, understandable, and progressively disclosed by default.

The canonical product definition, confirmed decisions, open questions, information architecture, user model, and future product boundaries live in [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md).

---

## Product areas and routes

| Route | Area | Purpose |
|---|---|---|
| `/world` | **World Monitor** | Global overview of important developments, map intelligence, priority events, and monitoring signals. |
| `/developments` | **Developments & Forecasts** | Emerging developments, event monitoring, forecasts, and signal-oriented analysis. |
| `/security` | **Security & Geopolitics** | Security risks, geopolitical developments, tension hotspots, and related assessments. |
| `/security/assessment` | **Security Assessment** | Focused internal detail view for a selected security assessment. |
| `/markets` | **Economy & Markets** | Market indicators, trends, comparisons, watchlists, and analytical charts. |
| `/countries` | **Countries & Routes** | Country monitoring, regional context, strategic corridors, and route-related risk. |
| `/reports` | **Reports & Analysis** | Generated reports, summaries, analysis outputs, and linked evidence. |
| `/data` | **Data Management** | Role-gated source selection, source health, and collection controls for authorized users. |
| `/details/:kind/:id` | **Intelligence Detail** | Dedicated drill-down page for events, countries, routes, sources, reports, and related entities. |
| `/foundation` | **Foundation Diagnostic** | Design-system, theme, direction, and implementation diagnostic surface. |

The root route (`/`) redirects to `/world`.

---

## Stack

| Concern | Choice |
|---|---|
| Application | **React 19** + **TypeScript 6** |
| Build tool | **Vite 8** |
| Routing | **React Router 7** |
| Styling | **Tailwind CSS 4** + project-owned CSS layers and semantic design tokens |
| Components | **shadcn/ui** primitives, code-owned under `src/components/ui` |
| Primitive layer | **Radix UI** |
| Icons | **Iconsax**, exposed through the project icon wrapper |
| Standard charts | **Recharts** through the project/shadcn chart contract |
| Maps | **Highcharts Maps** / `@highcharts/react` |
| Notifications | **Sonner** |
| Testing | **Vitest** + Testing Library + jsdom |
| Formatting | **Prettier** |
| Linting | **Oxlint** |

The shadcn configuration is defined in [`components.json`](components.json): `new-york` style, CSS variables, RTL enabled, and Iconsax as the icon library.

---

## Prerequisites

- **Node.js** compatible with the versions required by the current Vite/TypeScript toolchain.
- **npm**.

For the most predictable result, use a current Node.js LTS release and keep `package-lock.json` committed and in sync.

---

## Install and run

Clone the repository, then install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, typically:

```text
http://localhost:5173
```

The default route opens **World Monitor**. The prototype starts Persian-first and supports switching language and light/dark theme from the application shell.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Run TypeScript build checks and create a production-style Vite bundle. |
| `npm run preview` | Preview the latest local production build. |
| `npm run format` | Format code and documentation with Prettier. |
| `npm run format:check` | Check formatting without modifying files. |
| `npm run lint` | Run Oxlint across the project. |
| `npm run typecheck` | Run TypeScript project checks without a Vite build. |
| `npm run test` | Run the Vitest suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run check` | Run formatting, linting, type checking, tests, and build in sequence. |

Before handing off or merging a product-facing change, prefer:

```bash
npm run check
```

---

## Roles and access model

The prototype includes role-aware behavior so administration and data operations remain separated from general report consumption.

Current prototype roles include:

- **Viewer** — consumes reports, maps, charts, and intelligence outputs.
- **Organization Admin** — organization-level administrative access.
- **Data Manager** — source and data-management responsibilities.

The redesigned product is intended to support organization-level permissions and future multi-tenant delivery. Role behavior in the current repository is demonstrative rather than production authentication or authorization.

---

## Data and intelligence model

The product foundation separates source operations from intelligence consumption. Important AI-generated or analytical claims are intended to remain traceable to evidence, source, timestamp, and uncertainty.

The conceptual chain is:

```text
Source
  ↓
Raw Item
  ↓
Normalized Event
  ↓
Evidence Cluster
  ↓
Signal
  ↓
Assessment
  ↓
Report
```

Current prototype datasets are deliberately local and typed to resemble future product contracts. They cover areas such as events, sources, countries, corridors, markets, forecasts, and reports.

No real external data provider should be assumed unless an integration is explicitly documented and approved.

---

## Folder structure

```text
.
├── PROJECT_CONTEXT.md        # Canonical product context and confirmed/open decisions
├── AGENTS.md                 # AI-assisted development guidance
├── components.json           # shadcn configuration
├── docs/                     # Product, architecture, decisions, design-system, QA references
├── inputs/                   # Supplied source materials and design-system inputs
├── public/                   # Static assets, local fonts, map/topology assets
├── src/
│   ├── app/                  # App composition, preferences, and workspace state
│   ├── components/
│   │   ├── ui/               # shadcn primitives
│   │   └── product/          # Product-level shell, modules, maps, detail patterns, controls
│   ├── data/                 # Local mock and prototype datasets
│   ├── features/             # Route/domain-oriented feature implementations
│   │   ├── countries/
│   │   ├── data/
│   │   ├── details/
│   │   ├── foundation/
│   │   ├── markets/
│   │   ├── pages/
│   │   ├── security/
│   │   └── world/
│   ├── hooks/                # Shared React hooks
│   ├── lib/                  # Shared helpers and utilities
│   ├── localization/         # Product localization support
│   ├── services/             # Boundary between UI and future real integrations
│   ├── styles/               # Tokens, responsive rules, page and component style layers
│   ├── test/                 # Test setup and shared test utilities
│   ├── types/                # Shared domain and application contracts
│   └── main.tsx              # Application entry point
├── package.json
└── vite.config.*
```

---

## Design system

The organization’s supplied design-system sources are the visual source of truth.

Key rules in this repository:

- Use existing **shadcn/ui** primitives before creating custom equivalents.
- Keep UI components in `src/components/ui` code-owned and adaptable.
- Map supplied design tokens into semantic variables rather than hard-coding brand decisions.
- Preserve **Persian RTL** and **English LTR** behavior as first-class states.
- Persian typography uses the project’s **Vazir** family; English and technical Latin content use **Inter**.
- Light and dark themes must use the same semantic token system.
- Responsive behavior should preserve information and adapt layout before removing content.

Relevant documentation lives under `docs/design-system/`, including the design-system intake, token mapping, shadcn component mapping, and visualization semantics.

---

## Maps and visualization

Didehban Jahan uses two complementary visualization paths:

- **Recharts** for standard analytical charts through the project’s chart/component contracts.
- **Highcharts Maps** for global and country-level geographic exploration, including drill-down behavior where supported by the available topology.

Map and chart colors are semantic: they communicate states such as severity, risk, confidence, category, or data condition rather than acting as decoration.

---

## Localization, theme, and responsive behavior

The interface is designed around four first-class presentation states:

- Persian / RTL
- English / LTR
- Light theme
- Dark theme

The responsive system is intended to support large desktop monitors, laptops, tablets, and mobile screens without turning dense analytical modules into unreadable compressed layouts. On narrower screens, layouts stack, navigation progressively discloses, and tabular/two-dimensional surfaces keep scrolling local to the component rather than the page.

Theme, language, prototype role, and some layout preferences are stored only in the current browser for the prototype.

---

## Important project boundaries

This repository currently **does not** provide production implementations for:

- Authentication or identity management
- Real organization/tenant provisioning
- Production authorization enforcement
- Production databases
- Live API provider integrations
- Production crawlers or ingestion pipelines
- Production AI/model providers
- Export infrastructure
- Production observability or security controls

Do not add real secrets or credentials to the repository.

Do not silently convert open product decisions into implementation assumptions. Check [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) before product-facing changes.

---

## Key documentation

| Path | Purpose |
|---|---|
| [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) | Canonical product understanding, users, roles, IA, data model, AI behavior, requirements, and open decisions. |
| `docs/product/` | Product scope and prototype notes. |
| `docs/architecture/` | Technical architecture and implementation contracts. |
| `docs/decisions/` | Decision records for important technical/product choices. |
| `docs/design-system/` | Design-system intake, mapping, shadcn usage, and visualization semantics. |
| `inputs/design-system/` | Supplied design-system source materials and extracted token references. |
| `docs/assets/` | Preserved reference visuals used as evidence, not as target UI. |

---

## Verification and handoff

The repository includes automated formatting, linting, type checking, tests, and a production-style build command. Run the complete verification pipeline before handoff:

```bash
npm run check
```

A successful local run is the expected handoff baseline. This README does not claim a specific CI result unless one is available for the current commit.

---

## Working principles

1. Read `PROJECT_CONTEXT.md` before product-facing changes.
2. Preserve evidence traceability and uncertainty rather than hiding them behind AI output.
3. Keep viewer, organization-admin, and data-manager responsibilities distinct.
4. Reuse the project’s design system and shadcn primitives instead of introducing parallel UI patterns.
5. Treat Persian/RTL, English/LTR, light/dark, and responsive states as part of the feature — not follow-up polish.
6. Keep prototype data, production integrations, and unresolved product decisions clearly separated.
