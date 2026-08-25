# ADR 0003: Root locale, direction, and theme attributes

- Status: Accepted for the MVP prototype
- Date: 2026-08-24

## Decision

Set `lang`, `dir`, and `data-theme` on the root `<html>` element. Persian (`fa-IR`, RTL) is the default. English (`en`, LTR) is secondary. Use CSS variables for both themes and `Intl` for future dates and times.

## Why

Root attributes allow native browser behavior, component layout, accessibility tools, and CSS to agree about language and direction. Direction-safe technical strings opt into LTR locally, so a URL or coordinate is not accidentally reversed inside Persian text.

## Current boundary

The diagnostic controls only prove that switching works. They are not the final language or theme controls, and preferences are not yet stored as a product feature.
