import type { FragmentRecord, NoteRecord } from "../../../packages/note-model/src/index.ts";
import type { NoteWorkflowState } from "./sample-note-workflow";

export interface NoteEditorState {
  note: NoteRecord;
  fragments: FragmentRecord[];
}

export interface TextSelectionRange {
  selectionStart: number;
  selectionEnd: number;
}

export interface NoteEditorWorkflow {
  updateBody(state: NoteWorkflowState, body: string): NoteWorkflowState;
  applyMaskToSelection(
    state: NoteWorkflowState,
    selection: TextSelectionRange
  ): NoteWorkflowState;
}

export interface NoteEditorModel {
  getState(): NoteEditorState;
  updateBody(body: string): NoteEditorState;
  applyMaskToSelection(selection: TextSelectionRange): NoteEditorState;
}

export function applyMaskToSelection(
  workflow: NoteEditorWorkflow,
  state: NoteEditorState,
  selection: TextSelectionRange
): NoteEditorState {
  return workflow.applyMaskToSelection(state, selection);
}

export function createNoteEditorModel(
  workflow: NoteEditorWorkflow,
  initialState: NoteEditorState
): NoteEditorModel {
  let state = initialState;

  return {
    getState(): NoteEditorState {
      return state;
    },
    updateBody(body: string): NoteEditorState {
      state = workflow.updateBody(state, body);
      return state;
    },
    applyMaskToSelection(selection: TextSelectionRange): NoteEditorState {
      state = applyMaskToSelection(workflow, state, selection);
      return state;
    }
  };
}
