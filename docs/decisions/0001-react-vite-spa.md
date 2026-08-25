# ADR 0001: React, TypeScript, and Vite SPA

- Status: Accepted for the MVP prototype
- Date: 2026-08-24

## Decision

Use a client-only React and TypeScript application built with Vite. Use React Router in its simple declarative mode. Do not add a server-rendering framework in Phase 1.

## Why

- The deliverable is a local interactive prototype, not a production website.
- Vite provides fast startup and refresh with a small amount of setup.
- TypeScript gives future developers clear data and service contracts.
- React Router provides routing without adding server infrastructure.
- This approach keeps the prototype easy to inspect and hand off.

## Trade-off

This scaffold does not provide server rendering, production data loading, or backend conventions. Those are intentionally outside the MVP prototype boundary and can be reconsidered for production.

## Verified guidance

- [React: Build a React app from scratch](https://react.dev/learn/build-a-react-app-from-scratch)
- [Vite: Getting Started](https://vite.dev/guide/)
- [React Router: Declarative installation](https://reactrouter.com/start/declarative/installation)
