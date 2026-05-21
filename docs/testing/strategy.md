# Testing Strategy

The bootstrap uses Node's built-in test runner for executable scaffolding so local validation works without installing a TypeScript runtime test stack.

Future implementation may migrate executable tests to a TypeScript-native toolchain, but the test categories and scenarios established here should remain stable.

The empty desktop shell milestone keeps repository-level validation and Node-based integration checks in place while adding app-local TypeScript build verification through `pnpm app:typecheck` and `pnpm app:build`.
