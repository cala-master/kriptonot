import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const validMarkerPattern = /^\[\[masked:[a-z0-9-]+\]\]$/;

test("marker documentation and note fixture use the approved marker format", () => {
  const markerDoc = readFileSync("docs/validation/marker-format.md", "utf8");
  const noteFixture = JSON.parse(readFileSync("tests/fixtures/notes/basic-note.json", "utf8"));
  const match = noteFixture.body.match(/\[\[masked:[a-z0-9-]+\]\]/);

  assert.ok(markerDoc.includes("[[masked:fragment-id]]"));
  assert.ok(match);
  assert.ok(validMarkerPattern.test(match[0]));
});

test("malformed marker fixtures are rejected by the approved marker regex", () => {
  const malformedMarker = readFileSync("tests/fixtures/malformed-inputs/invalid-marker.txt", "utf8").trim();

  assert.equal(validMarkerPattern.test(malformedMarker), false);
});
