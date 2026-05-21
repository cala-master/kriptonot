# ADR 0001: Monorepo Stack

## Decision

Use a domain-rich monorepo with `Tauri + React + TypeScript + SQLite`.

## Why

- Tauri is a suitable desktop shell.
- TypeScript aligns with the intended application and package boundaries.
- SQLite is a strong local embedded database choice.
- A monorepo keeps validation, docs, and package contracts in one place.

## Consequence

The bootstrap repository is structured around packages and validation entrypoints before application logic is written.
