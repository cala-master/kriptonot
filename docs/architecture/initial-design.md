# Initial Architecture

## Stack

- Tauri
- React
- TypeScript
- SQLite

## Core Model

Notes store marker placeholders inside the note body:

```text
Normal text before [[masked:fragment-id]] normal text after.
```

Fragments are stored separately from note content. The marker parser, fragment store, crypto boundary, and UI contracts remain isolated as separate packages.

## Bootstrap Runtime

The first runnable milestone uses `apps/desktop` as the composition boundary for:

- the Tauri desktop shell
- the React + Vite frontend scaffold
- startup-only SQLite initialization in the Rust backend
- a one-way bootstrap status event emitted to the frontend when the app is ready or has failed startup

This milestone intentionally excludes note CRUD, fragment reveal workflows, schema migrations, and other business logic.

## Rationale

Marker references are safer than text ranges because they remain stable when surrounding note text changes.
