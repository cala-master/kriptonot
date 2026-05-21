import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("requirements, constitution, and manual validation agree on masked reveal scope", () => {
  const requirements = readFileSync("docs/product/requirements.md", "utf8");
  const constitution = readFileSync("CONSTITUTION.md", "utf8");
  const runbook = readFileSync("docs/manual-validation/milestone-04-masked-reveal-flow.md", "utf8");

  assert.ok(requirements.includes("marker-based masked fragment references"));
  assert.ok(constitution.includes("Whole notes are not encrypted"));
  assert.ok(runbook.includes("explicit click or unlock"));
});
