# kriptonot

Documentation-first bootstrap for a local desktop notes application built around `Tauri + React + TypeScript + SQLite`.

This repository currently contains the approved architecture, governance, validation scaffolding, and test scaffolding for the project. Application feature code is intentionally out of scope for this phase.

## Current Scope

- Domain-rich monorepo layout
- Governance and engineering standards
- Repository validation scripts
- Contract and integration test scaffolding
- Manual validation runbooks

Not included yet:

- Tauri shell implementation
- React screens
- SQLite runtime integration
- Fragment encryption implementation

## Repository Layout

```text
apps/desktop                Desktop composition boundary
packages/*                  Domain and shared packages
tests/                      Contract and integration scaffolding
docs/                       Product, architecture, process, and runbooks
scripts/validation          Repository validation entrypoints
```

## Local Commands

```bash
pnpm validate
pnpm test
pnpm test:contracts
pnpm test:integration
pnpm manual:bootstrap
```

## Legacy Files

The original Python starter files remain in the repository for now, but they are not part of the intended long-term project structure and are ignored by the bootstrap validation rules.

