# Package Boundaries

- `apps/desktop`: composition layer only
- `packages/note-model`: note and fragment domain records
- `packages/marker-parser`: masked marker parsing and formatting contracts
- `packages/fragment-store`: fragment lifecycle and lookup contracts
- `packages/crypto-fragments`: fragment-only crypto boundary
- `packages/storage-sqlite`: persistence contracts and SQLite adapter boundary
- `packages/ui-contracts`: non-rendering UI interaction contracts
- `packages/validation-schemas`: schemas and fixture ownership
- `packages/test-kit`: shared fixture/helper ownership
