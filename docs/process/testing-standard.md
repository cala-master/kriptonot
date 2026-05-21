# Testing Standard

- Use package-local tests for package-specific logic.
- Use `tests/contract` for cross-package agreements.
- Use `tests/integration` for end-to-end domain flows.
- Preserve negative coverage for out-of-scope MVP behavior.
- Keep fixtures readable and colocated under `tests/fixtures`.
