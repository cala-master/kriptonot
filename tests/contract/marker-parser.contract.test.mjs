import test from "node:test";
import assert from "node:assert/strict";
import { parseMaskedMarkers, formatMaskedMarker } from "../../packages/marker-parser/src/index.ts";

test("parseMaskedMarkers preserves text and extracts marker references", () => {
  const body = "alpha [[masked:fragment-1]] omega";
  const result = parseMaskedMarkers(body);

  assert.deepEqual(result.references, [
    {
      fragmentId: "fragment-1",
      rawMarker: "[[masked:fragment-1]]",
      start: 6,
      end: 27
    }
  ]);
  assert.equal(result.plainText, body);
});

test("formatMaskedMarker creates the approved marker shape", () => {
  assert.equal(formatMaskedMarker("fragment-1"), "[[masked:fragment-1]]");
});

test("parseMaskedMarkers reports malformed content without deleting plain text", () => {
  const malformed = "alpha [[masked fragment-1]] omega";
  const result = parseMaskedMarkers(malformed);

  assert.equal(result.references.length, 0);
  assert.equal(result.errors.length, 1);
  assert.equal(result.plainText, malformed);
});

test("parseMaskedMarkers reports malformed marker-like content alongside valid markers", () => {
  const mixed = "alpha [[masked:fragment-1]] beta [[masked fragment-2]] omega";
  const result = parseMaskedMarkers(mixed);

  assert.equal(result.references.length, 1);
  assert.equal(result.errors.length, 1);
  assert.equal(result.plainText, mixed);
});
