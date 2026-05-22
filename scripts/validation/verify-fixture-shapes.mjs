import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const noteFixture = JSON.parse(readFileSync("tests/fixtures/notes/basic-note.json", "utf8"));
const fragmentFixture = JSON.parse(readFileSync("tests/fixtures/fragments/basic-fragment.json", "utf8"));
const malformedMarker = readFileSync("tests/fixtures/malformed-inputs/invalid-marker.txt", "utf8").trim();

assert.equal(typeof noteFixture.id, "string");
assert.equal(typeof noteFixture.title, "string");
assert.equal(typeof noteFixture.body, "string");
assert.ok(Array.isArray(noteFixture.fragmentIds));
assert.equal(typeof noteFixture.createdAt, "string");
assert.equal(typeof noteFixture.updatedAt, "string");
assert.ok(noteFixture.body.includes("[[masked:fragment-1]]"));

assert.equal(typeof fragmentFixture.id, "string");
assert.equal(typeof fragmentFixture.noteId, "string");
assert.equal(typeof fragmentFixture.cipherText, "string");
assert.equal(typeof fragmentFixture.maskedValue, "string");
assert.equal(fragmentFixture.noteId, noteFixture.id);
assert.ok(noteFixture.fragmentIds.includes(fragmentFixture.id));

assert.ok(!/^\[\[masked:[a-z0-9-]+\]\]$/.test(malformedMarker));

console.log("verify-fixture-shapes: ok");
