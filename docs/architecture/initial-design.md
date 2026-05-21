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

## Rationale

Marker references are safer than text ranges because they remain stable when surrounding note text changes.
