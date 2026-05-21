import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const requiredDocs = [
  "AGENTS.md",
  "CONSTITUTION.md",
  "docs/product/requirements.md",
  "docs/architecture/initial-design.md",
  "docs/decisions/0001-monorepo-stack.md",
  "docs/agent-workflows/kilo-code.md",
  "docs/process/feature-delivery-standard.md",
  "docs/process/testing-standard.md",
  "docs/process/validation-standard.md",
  "docs/process/manual-validation-standard.md",
  "docs/process/milestone-readiness.md",
  "docs/validation/repository-rules.md",
  "docs/validation/package-boundaries.md",
  "docs/validation/marker-format.md",
  "docs/validation/acceptance-checklist.md",
  "docs/manual-validation/bootstrap-checklist.md",
  "docs/manual-validation/local-runbook.md",
  "docs/manual-validation/milestone-01-repo-bootstrap.md",
  "docs/manual-validation/milestone-02-domain-contracts.md",
  "docs/manual-validation/milestone-03-storage-flow.md",
  "docs/manual-validation/milestone-04-masked-reveal-flow.md",
  "docs/manual-validation/milestone-05-empty-shell.md"
];

for (const docPath of requiredDocs) {
  const content = readFileSync(docPath, "utf8").trim();
  assert.ok(content.length > 0, `Document is empty: ${docPath}`);
}

const constitution = readFileSync("CONSTITUTION.md", "utf8");
const requirements = readFileSync("docs/product/requirements.md", "utf8");

for (const expectedPhrase of [
  "local-first",
  "desktop-only",
  "Whole notes are not encrypted",
  "accounts",
  "sync",
  "cloud",
  "AI",
  "collaboration"
]) {
  assert.ok(
    constitution.includes(expectedPhrase) || requirements.includes(expectedPhrase),
    `Missing required documented phrase: ${expectedPhrase}`
  );
}

console.log("verify-doc-coverage: ok");
