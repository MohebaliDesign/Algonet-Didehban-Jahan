# Prototype architecture foundation

## Purpose

The foundation supports a high-fidelity local prototype while keeping production complexity out of scope. It must make Persian RTL, English LTR, theming, reusable components, role boundaries, mock data, and future integrations easy to validate.

## Runtime shape

```text
Browser
└── React application
    ├── Preferences provider (locale, direction, theme)
    ├── Router (prototype routes)
    ├── Product shell (navigation, top bar, filters, search)
    ├── Workspace provider (prototype role, filters, Inspector, feedback)
    ├── Feature modules (seven product routes)
    ├── Local SVG map and chart contracts
    ├── Foundation diagnostic (preserved at /foundation)
    ├── shadcn-style UI primitives
    ├── CSS-variable design-token layer
    └── Repository service interface
        └── Mock implementation (current)
            └── Typed, small fixtures
```

The user interface does not know how a future API works. It talks to a repository interface. Phase 1 provides a mock repository; a later approved phase can add a real adapter behind the same boundary.

## Cross-cutting rules

- Persian is the default locale and sets the document root to RTL.
- English changes the document root to LTR.
- Technical strings use isolated LTR direction inside either interface direction.
- Themes are selected with `data-theme` on the root element.
- Components consume semantic variables such as `--background` and `--primary`, not raw hex values.
- Viewer, org-admin, and data-manager are separate prototype role types; no real authorization is implemented.
- Data-state names are stable. Status colors remain temporary until design guidance arrives.
- Visualization semantics remain isolated under `--temp-viz-*` and are documented separately.
- Product, locale, role, and layout preferences are local prototype state only.

## Visual MVP route shape

`/world` is the default route. The shell also hosts `/developments`, `/security`, `/markets`, `/countries`, `/reports`, and `/data`. `/foundation` intentionally sits outside the product shell so it remains a clean diagnostic route.

The Inspector is a shared contextual surface. In RTL it opens from the left, opposite the right-side navigation; in LTR both positions mirror. Search and visual selections populate the same Inspector contract.

## Integration boundary

`IntelligenceRepository` is intentionally small. Feature code can request a snapshot or an event without depending on HTTP, authentication, endpoints, or vendor SDKs. Abort signals are included now so future loading can be safely cancelled.

## Accessibility foundation

- Native buttons and headings preserve semantic behavior.
- Focus is visible in both themes.
- Icons are decorative when a visible text label exists.
- State is communicated with text and shape, not color alone.
- Reduced-motion preferences are honored.
- Mixed-direction content uses language and direction attributes.
