# ADR 0002: Official shadcn components and Iconsax icons

- Status: Accepted for the MVP prototype
- Date: 2026-08-24

## Decision

Use shadcn’s code-owned component approach: component source stays in this repository and is adjusted through the organization’s tokens. Use the official `iconsax` web-component package for free icons. Do not use shadcn’s default icon choice.

## Why

- The designer asked for shadcn and Iconsax.
- Code-owned components can be adapted for Persian content and RTL instead of being hidden inside a third-party package.
- Product controls use the official registry source needed by the current interfaces; product-specific patterns compose those primitives.
- Iconsax works without a React-specific wrapper and keeps its free icon data in the installed package.

## Rules

- Visible product copy is localized; Persian is the default.
- An icon never replaces a necessary text label.
- New components must use semantic CSS variables rather than inventing colors.
- Add components only when a prototype feature needs them.
- Generated icon imports are adapted to the configured Iconsax wrapper rather than adding a competing icon system.

## Verified guidance

- [shadcn/ui Vite installation](https://ui.shadcn.com/docs/installation/vite)
- [Iconsax npm web component](https://docs.iconsax.io/npm/web-component)
