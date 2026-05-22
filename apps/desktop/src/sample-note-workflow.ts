import type { FragmentRecord, NoteRecord } from "../../../packages/note-model/src/index.ts";
import { createMaskedFragmentDraft } from "../../../packages/fragment-store/src/index.ts";
import {
  createInMemorySliceStore,
  loadNoteWithFragments,
  saveNoteWithFragments
} from "../../../packages/storage-sqlite/src/index.ts";
import type { MaskedFragmentViewState } from "../../../packages/ui-contracts/src/index.ts";

export interface NoteWorkflowState {
  note: NoteRecord;
  fragments: FragmentRecord[];
}

export interface LoadedNoteWorkflowState extends NoteWorkflowState {
  viewState: MaskedFragmentViewState[];
}

export function createSampleNoteWorkflow() {
  const store = createInMemorySliceStore();

  return {
    async createNote(): Promise<NoteWorkflowState> {
      return {
        note: {
          id: "note-1",
          title: "",
          body: "",
          fragmentIds: [],
          createdAt: "2026-05-22T10:00:00.000Z",
          updatedAt: "2026-05-22T10:00:00.000Z"
        },
        fragments: []
      };
    },
    updateBody(state: NoteWorkflowState, body: string): NoteWorkflowState {
      return {
        ...state,
        note: {
          ...state.note,
          body,
          updatedAt: "2026-05-22T10:05:00.000Z"
        }
      };
    },
    applyMaskToSelection(
      state: NoteWorkflowState,
      selection: { selectionStart: number; selectionEnd: number }
    ): NoteWorkflowState {
      const draft = createMaskedFragmentDraft({
        noteId: state.note.id,
        noteBody: state.note.body,
        selectionStart: selection.selectionStart,
        selectionEnd: selection.selectionEnd,
        fragmentId: "fragment-1",
        cipherText: "cipher-fragment-1",
        maskedValue: "ฏซฉฮ"
      });

      return {
        note: {
          ...state.note,
          body: draft.updatedBody,
          fragmentIds: [draft.fragmentRecord.id],
          updatedAt: "2026-05-22T10:06:00.000Z"
        },
        fragments: [draft.fragmentRecord]
      };
    },
    async save(state: NoteWorkflowState): Promise<void> {
      await saveNoteWithFragments(store, state);
    },
    async load(noteId: string): Promise<LoadedNoteWorkflowState> {
      const loaded = await loadNoteWithFragments(store, noteId);

      return {
        ...loaded,
        viewState: loaded.fragments.map((fragment) => ({
          fragmentId: fragment.id,
          isLocked: true,
          displayValue: fragment.maskedValue
        }))
      };
    }
  };
}
