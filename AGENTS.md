# Agent Instructions

## Source Of Truth

- Product and architecture intent starts in `docs/superpowers/specs/`.
- Execution plans live in `docs/superpowers/plans/`.
- Governance rules live in `CONSTITUTION.md` and `docs/process/`.

## Working Rules

- Respect the package boundaries defined in `docs/validation/package-boundaries.md`.
- Update product, architecture, validation, and manual-validation docs when feature scope changes.
- Do not add out-of-scope MVP capabilities without updating the constitution and requirements first.
- Keep milestones locally runnable with documented commands and manual checks.

## Completion Evidence

Before claiming work complete:

- run `pnpm validate`
- run the relevant `pnpm test*` command set
- update or add a manual validation runbook entry if behavior changed
- confirm any new package or command is reflected in the docs
