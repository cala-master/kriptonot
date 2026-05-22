import test from "node:test";
import assert from "node:assert/strict";
import { createMaskedFragmentDraft } from "../../packages/fragment-store/src/index.ts";
import { fixedSliceMask } from "../../packages/test-kit/src/index.ts";

test("createMaskedFragmentDraft replaces selected text with a marker and returns a fragment record", () => {
  const result = createMaskedFragmentDraft({
    noteId: "note-1",
    noteBody: "Keep my pin safe",
    selectionStart: 8,
    selectionEnd: 11,
    fragmentId: "fragment-1",
    cipherText: "cipher-fragment-1",
    maskedValue: fixedSliceMask()
  });

  assert.equal(result.updatedBody, "Keep my [[masked:fragment-1]] safe");
  assert.deepEqual(result.fragmentRecord, {
    id: "fragment-1",
    noteId: "note-1",
    cipherText: "cipher-fragment-1",
    maskedValue: fixedSliceMask()
  });
});

test("createMaskedFragmentDraft rejects reversed selection ranges", () => {
  assert.throws(
    () =>
      createMaskedFragmentDraft({
        noteId: "note-1",
        noteBody: "Keep my pin safe",
        selectionStart: 11,
        selectionEnd: 8,
        fragmentId: "fragment-1",
        cipherText: "cipher-fragment-1",
        maskedValue: fixedSliceMask()
      }),
    {
      name: "RangeError",
      message: "selectionStart must be less than or equal to selectionEnd"
    }
  );
});

test("createMaskedFragmentDraft rejects out-of-bounds selection ranges", () => {
  assert.throws(
    () =>
      createMaskedFragmentDraft({
        noteId: "note-1",
        noteBody: "Keep my pin safe",
        selectionStart: 8,
        selectionEnd: 99,
        fragmentId: "fragment-1",
        cipherText: "cipher-fragment-1",
        maskedValue: fixedSliceMask()
      }),
    {
      name: "RangeError",
      message: "selection range must be within note body bounds"
    }
  );
});

test("createMaskedFragmentDraft rejects non-integer selection ranges", () => {
  assert.throws(
    () =>
      createMaskedFragmentDraft({
        noteId: "note-1",
        noteBody: "Keep my pin safe",
        selectionStart: 8.5,
        selectionEnd: 11,
        fragmentId: "fragment-1",
        cipherText: "cipher-fragment-1",
        maskedValue: fixedSliceMask()
      }),
    {
      name: "RangeError",
      message: "selection range must use finite integer indexes"
    }
  );
});
