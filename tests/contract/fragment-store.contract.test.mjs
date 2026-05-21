import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("note and fragment fixtures agree on fragment references", () => {
  const noteFixture = JSON.parse(readFileSync("tests/fixtures/notes/basic-note.json", "utf8"));
  const fragmentFixture = JSON.parse(readFileSync("tests/fixtures/fragments/basic-fragment.json", "utf8"));

  assert.deepEqual(noteFixture.fragmentIds, [fragmentFixture.id]);
});

test("fragment-store package documents fragment lifecycle ownership", () => {
  const packageReadme = readFileSync("packages/fragment-store/README.md", "utf8");
  const packageSource = readFileSync("packages/fragment-store/src/index.ts", "utf8");

  assert.ok(packageReadme.includes("fragment lifecycle"));
  assert.ok(packageSource.includes("FragmentStoreContract"));
});
