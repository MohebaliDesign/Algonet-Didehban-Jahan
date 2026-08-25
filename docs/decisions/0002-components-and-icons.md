# ADR 0002: shadcn-style components and Iconsax icons

- Status: Accepted for the MVP prototype
- Date: 2026-08-24

## Decision

Use shadcn’s code-owned component approach: component source stays in this repository and is adjusted through the organization’s tokens. Use the official `iconsax` web-component package for free icons. Do not use shadcn’s default icon choice.

## Why

- The designer asked for shadcn and Iconsax.
- Code-owned components can be adapted for Persian content and RTL instead of being hidden inside a third-party package.
- A small initial set—button, card, and badge—is enough for the diagnostic screen.
- Iconsax works without a React-specific wrapper and keeps its free icon data in the installed package.

## Rules

- Visible product copy is localized; Persian is the default.
- An icon never replaces a necessary text label.
- New components must use semantic CSS variables rather than inventing colors.
- Add components only when a prototype feature needs them.

## Verified guidance

- [shadcn/ui Vite installation](https://ui.shadcn.com/docs/installation/vite)
- [Iconsax npm web component](https://docs.iconsax.io/npm/web-component)
