# Milestone 05: Empty Desktop Shell

## Commands

```bash
pnpm app:typecheck
pnpm app:build
pnpm app:tauri:dev
```

## Manual Checks

- confirm the Tauri window opens with the title `kriptonot`
- confirm the UI shows the app title, startup status, and placeholder panel
- confirm the startup status transitions from `starting` to `ready`
- confirm the status detail mentions successful SQLite bootstrap
- confirm a local `kriptonot-bootstrap.sqlite3` file is created in the app data directory
- confirm no note, fragment, editor, or reveal business features appear in the shell
