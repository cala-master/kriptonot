import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("note fixture, fragment fixture, and note-model contract form one lifecycle scaffold", () => {
  const noteFixture = JSON.parse(readFileSync("tests/fixtures/notes/basic-note.json", "utf8"));
  const fragmentFixture = JSON.parse(readFileSync("tests/fixtures/fragments/basic-fragment.json", "utf8"));
  const noteModelSource = readFileSync("packages/note-model/src/index.ts", "utf8");

  assert.equal(noteFixture.fragmentIds[0], fragmentFixture.id);
  assert.ok(noteModelSource.includes("NoteRecord"));
  assert.ok(noteModelSource.includes("FragmentRecord"));
});
