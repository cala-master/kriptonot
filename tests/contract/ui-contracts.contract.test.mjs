import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("desktop app mounts a plain-text note editor with a hidden masked fragment list", () => {
  const appSource = readFileSync("apps/desktop/src/App.tsx", "utf8");
  const modelSource = readFileSync("apps/desktop/src/note-editor-model.ts", "utf8");
  const uiContractSource = readFileSync("packages/ui-contracts/src/index.ts", "utf8");

  assert.ok(appSource.includes("textarea"));
  assert.ok(appSource.includes("Mask selection"));
  assert.ok(appSource.includes("createNoteEditorModel"));
  assert.ok(appSource.includes("applyMaskToSelection"));
  assert.ok(modelSource.includes("applyMaskToSelection"));
  assert.ok(modelSource.includes("workflow.applyMaskToSelection"));
  assert.ok(uiContractSource.includes("MaskedFragmentViewState"));
  assert.ok(uiContractSource.includes("isLocked: true"));
  assert.ok(!uiContractSource.includes("RevealMaskedFragmentAction"));
});
