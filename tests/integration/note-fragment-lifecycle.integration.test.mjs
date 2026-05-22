import test from "node:test";
import assert from "node:assert/strict";
import { createNoteEditorModel } from "../../apps/desktop/src/note-editor-model.ts";
import { createSampleNoteWorkflow } from "../../apps/desktop/src/sample-note-workflow.ts";

test("sample workflow creates, masks, saves, and reloads a hidden fragment note", async () => {
  const workflow = createSampleNoteWorkflow();

  const created = await workflow.createNote();
  const edited = workflow.updateBody(created, "Keep my pin safe");
  const masked = workflow.applyMaskToSelection(edited, {
    selectionStart: 8,
    selectionEnd: 11
  });

  await workflow.save(masked);
  const reopened = await workflow.load(masked.note.id);

  assert.equal(reopened.note.body, "Keep my [[masked:fragment-1]] safe");
  assert.equal(reopened.fragments[0].maskedValue, "ฏซฉฮ");
  assert.equal(reopened.viewState[0].isLocked, true);
});

test("note editor model updates body and applies the first hidden-flow mask selection", async () => {
  const workflow = createSampleNoteWorkflow();
  const created = await workflow.createNote();
  const model = createNoteEditorModel(workflow, created);

  model.updateBody("Keep my pin safe");
  model.applyMaskToSelection({
    selectionStart: 8,
    selectionEnd: 11
  });

  const snapshot = model.getState();

  assert.equal(snapshot.note.body, "Keep my [[masked:fragment-1]] safe");
  assert.deepEqual(snapshot.note.fragmentIds, ["fragment-1"]);
  assert.equal(snapshot.fragments[0].maskedValue, "ฏซฉฮ");
});
