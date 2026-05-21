import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("ui contracts preserve explicit reveal interactions", () => {
  const uiContractsSource = readFileSync("packages/ui-contracts/src/index.ts", "utf8");

  assert.ok(uiContractsSource.includes('"click" | "unlock"'));
  assert.ok(uiContractsSource.includes("RevealMaskedFragmentAction"));
});

test("constitution and milestone docs require explicit reveal behavior", () => {
  const constitution = readFileSync("CONSTITUTION.md", "utf8");
  const milestone = readFileSync("docs/manual-validation/milestone-04-masked-reveal-flow.md", "utf8");

  assert.ok(constitution.includes("explicit user action"));
  assert.ok(milestone.includes("explicit click or unlock"));
});
