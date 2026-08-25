# Repository structure

```text
.
├── PROJECT_CONTEXT.md          Canonical product source
├── AGENTS.md                   Rules for future Codex work
├── docs/
│   ├── architecture/           Technical overview
│   ├── assets/v15/             Preserved reference images
│   ├── decisions/              Short architecture decisions
│   ├── design-system/          Intake and mapping
│   └── product/                Prototype scope notes
├── inputs/design-system/
│   ├── archives/               Exact supplied packages
│   └── source/                 Extracted, unmodified token JSON
├── public/
│   └── fonts/                  Local fonts used by the prototype
├── src/
│   ├── app/                    Root routing and preferences
│   ├── components/product/     Shell, modules, Inspector, map, and charts
│   ├── components/ui/          Editable shadcn-style primitives
│   ├── data/mock/              Small typed fixtures
│   ├── features/               Feature-owned UI and tests
│   ├── localization/           Locale, direction, and formatting foundation
│   ├── services/               Mock/real integration boundary
│   ├── styles/                 Fonts, source mapping, provisional visualization, product layout
│   ├── test/                   Shared test setup
│   └── types/                  Product contracts
└── tools/                      Preserved existing document tooling
```

Future product work should add one feature folder at a time. Shared components belong in `components/` only after more than one feature needs them. Large mock data dumps do not belong in the repository.
