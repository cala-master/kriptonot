# Local Runbook

## Prerequisites

- Node.js 26+
- pnpm 11+

## Commands

```bash
pnpm validate
pnpm test
pnpm manual:bootstrap
pnpm app:typecheck
pnpm app:build
pnpm app:tauri:dev
```

## Expected Results

- validation reports all checks passed
- contract and integration tests pass
- manual bootstrap command prints the bootstrap checklist path
- app typecheck and web build succeed
- Tauri dev opens a window that reports bootstrap readiness
