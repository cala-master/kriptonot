import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("storage documentation preserves separate note and fragment persistence shapes", () => {
  const storageSource = readFileSync("packages/storage-sqlite/src/index.ts", "utf8");
  const storageRunbook = readFileSync("docs/manual-validation/milestone-03-storage-flow.md", "utf8");

  assert.ok(storageSource.includes("PersistedNoteShape"));
  assert.ok(storageSource.includes("PersistedFragmentShape"));
  assert.ok(storageRunbook.includes("note and fragment fixtures are separate"));
  assert.ok(storageRunbook.includes("whole-note encryption is not described as part of storage flow"));
});
