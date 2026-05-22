import test from "node:test";
import assert from "node:assert/strict";
import {
  createInMemorySliceStore,
  saveNoteWithFragments,
  loadNoteWithFragments
} from "../../packages/storage-sqlite/src/index.ts";

test("saveNoteWithFragments and loadNoteWithFragments preserve note and fragment linkage", async () => {
  const store = createInMemorySliceStore();

  await saveNoteWithFragments(store, {
    note: {
      id: "note-1",
      title: "Personal note",
      body: "Normal text before [[masked:fragment-1]] normal text after.",
      fragmentIds: ["fragment-1"],
      createdAt: "2026-05-22T10:00:00.000Z",
      updatedAt: "2026-05-22T10:00:00.000Z"
    },
    fragments: [
      {
        id: "fragment-1",
        noteId: "note-1",
        cipherText: "cipher-fragment-1",
        maskedValue: "ฏซฉฮ"
      }
    ]
  });

  const result = await loadNoteWithFragments(store, "note-1");

  assert.equal(result.note.id, "note-1");
  assert.deepEqual(result.note.fragmentIds, ["fragment-1"]);
  assert.equal(result.fragments[0].noteId, "note-1");
  assert.equal(result.fragments[0].maskedValue, "ฏซฉฮ");
});

test("saveNoteWithFragments snapshots persisted state from later caller mutations", async () => {
  const store = createInMemorySliceStore();
  const note = {
    id: "note-2",
    title: "Original title",
    body: "Body with [[masked:fragment-2]].",
    fragmentIds: ["fragment-2"],
    createdAt: "2026-05-22T11:00:00.000Z",
    updatedAt: "2026-05-22T11:00:00.000Z"
  };
  const fragment = {
    id: "fragment-2",
    noteId: "note-2",
    cipherText: "cipher-fragment-2",
    maskedValue: "ฏซฉฮ"
  };

  await saveNoteWithFragments(store, {
    note,
    fragments: [fragment]
  });

  note.title = "Mutated title";
  note.fragmentIds.push("fragment-extra");
  fragment.maskedValue = "MUTATED";

  const result = await loadNoteWithFragments(store, "note-2");

  assert.equal(result.note.title, "Original title");
  assert.deepEqual(result.note.fragmentIds, ["fragment-2"]);
  assert.equal(result.fragments[0].maskedValue, "ฏซฉฮ");
});

test("loadNoteWithFragments fails explicitly when note fragment linkage is broken", async () => {
  const store = createInMemorySliceStore();

  await saveNoteWithFragments(store, {
    note: {
      id: "note-3",
      title: "Broken note",
      body: "Body with [[masked:fragment-3]].",
      fragmentIds: ["fragment-3"],
      createdAt: "2026-05-22T12:00:00.000Z",
      updatedAt: "2026-05-22T12:00:00.000Z"
    },
    fragments: []
  });

  await assert.rejects(
    loadNoteWithFragments(store, "note-3"),
    /fragment-not-found/
  );
});
