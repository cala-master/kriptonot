import { accessSync, constants } from "node:fs";

const requiredPaths = [
  "apps/desktop/package.json",
  "apps/desktop/index.html",
  "apps/desktop/src/main.tsx",
  "apps/desktop/src/App.tsx",
  "apps/desktop/src-tauri/Cargo.toml",
  "apps/desktop/src-tauri/tauri.conf.json",
  "apps/desktop/src-tauri/capabilities/default.json",
  "apps/desktop/src-tauri/icons/icon.png",
  "apps/desktop/src-tauri/src/main.rs",
  "packages/note-model/package.json",
  "packages/marker-parser/package.json",
  "packages/fragment-store/package.json",
  "packages/crypto-fragments/package.json",
  "packages/storage-sqlite/package.json",
  "packages/ui-contracts/package.json",
  "packages/validation-schemas/package.json",
  "packages/test-kit/package.json",
  "docs/product/requirements.md",
  "docs/architecture/initial-design.md",
  "docs/decisions/0001-monorepo-stack.md",
  "docs/process/feature-delivery-standard.md",
  "docs/manual-validation/local-runbook.md",
  "docs/manual-validation/milestone-05-empty-shell.md",
  "tests/contract/marker-parser.contract.test.mjs",
  "tests/integration/note-fragment-lifecycle.integration.test.mjs",
  "tests/integration/desktop-shell-bootstrap.integration.test.mjs"
];

for (const requiredPath of requiredPaths) {
  accessSync(requiredPath, constants.F_OK);
}

console.log("verify-repo-structure: ok");
