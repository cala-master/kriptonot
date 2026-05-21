# kriptonot

Bootstrap monorepo for a local desktop notes application built around `Tauri + React + TypeScript + SQLite`.

This repository now contains the approved architecture, governance, validation scaffolding, test scaffolding, and the first runnable empty desktop shell. Application feature code is still intentionally out of scope for this milestone.

## Current Scope

- Domain-rich monorepo layout
- Governance and engineering standards
- Repository validation scripts
- Contract and integration test scaffolding
- Manual validation runbooks
- Runnable empty Tauri + React desktop shell
- SQLite startup bootstrap wiring

Not included yet:

- Note editing workflows
- Fragment storage flows
- Fragment encryption implementation
- Business-domain UI behavior

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
pnpm app:dev
pnpm app:build
pnpm app:typecheck
pnpm app:tauri:dev
pnpm app:tauri:build
```

## Current App Milestone

The empty app milestone proves:

- the desktop window opens
- the React shell renders visible bootstrap chrome
- the Rust backend opens or creates a local SQLite database
- the frontend receives a one-way bootstrap status event

No note, fragment, parsing, crypto, or storage business logic is implemented yet.

## Legacy Files

The original Python starter files remain in the repository for now, but they are not part of the intended long-term project structure and are ignored by the bootstrap validation rules.
