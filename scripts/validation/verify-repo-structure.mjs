import { accessSync, constants } from "node:fs";

const requiredPaths = [
  "apps/desktop/package.json",
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
  "tests/contract/marker-parser.contract.test.mjs",
  "tests/integration/note-fragment-lifecycle.integration.test.mjs"
];

for (const requiredPath of requiredPaths) {
  accessSync(requiredPath, constants.F_OK);
}

console.log("verify-repo-structure: ok");
