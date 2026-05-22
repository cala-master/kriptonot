import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function readInterfaceBody(source, interfaceName) {
  const match = source.match(new RegExp(`export interface ${interfaceName}\\s*{([\\s\\S]*?)}`, "m"));

  assert.ok(match, `expected export interface ${interfaceName} to exist`);

  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

test("note and fragment fixtures match the first vertical-slice contract", () => {
  const noteModelSource = readFileSync("packages/note-model/src/index.ts", "utf8");
  const noteFixture = JSON.parse(readFileSync("tests/fixtures/notes/basic-note.json", "utf8"));
  const fragmentFixture = JSON.parse(readFileSync("tests/fixtures/fragments/basic-fragment.json", "utf8"));
  const noteFixtureKeys = Object.keys(noteFixture).sort();
  const fragmentFixtureKeys = Object.keys(fragmentFixture).sort();

  assert.deepEqual(readInterfaceBody(noteModelSource, "NoteRecord"), [
    "id: string;",
    "title: string;",
    "body: string;",
    "fragmentIds: string[];",
    "createdAt: string;",
    "updatedAt: string;",
  ]);
  assert.deepEqual(readInterfaceBody(noteModelSource, "FragmentRecord"), [
    "id: string;",
    "noteId: string;",
    "cipherText: string;",
    "maskedValue: string;",
  ]);
  assert.deepEqual(noteFixtureKeys, [
    "body",
    "createdAt",
    "fragmentIds",
    "id",
    "title",
    "updatedAt",
  ]);
  assert.deepEqual(fragmentFixtureKeys, [
    "cipherText",
    "id",
    "maskedValue",
    "noteId",
  ]);

  assert.equal(typeof noteFixture.id, "string");
  assert.equal(typeof noteFixture.title, "string");
  assert.equal(typeof noteFixture.body, "string");
  assert.equal(typeof noteFixture.createdAt, "string");
  assert.equal(typeof noteFixture.updatedAt, "string");
  assert.equal(Array.isArray(noteFixture.fragmentIds), true);
  assert.equal(noteFixture.fragmentIds.every((fragmentId) => typeof fragmentId === "string"), true);
  assert.equal(typeof fragmentFixture.id, "string");
  assert.deepEqual(noteFixture.fragmentIds, [fragmentFixture.id]);

  assert.equal(fragmentFixture.noteId, noteFixture.id);
  assert.equal(typeof fragmentFixture.cipherText, "string");
  assert.equal(typeof fragmentFixture.maskedValue, "string");
});
