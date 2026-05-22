import type { FragmentRecord, NoteRecord } from "@kriptonot/note-model";

export interface PersistedNoteShape {
  noteId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersistedFragmentShape {
  fragmentId: string;
  noteId: string;
  cipherText: string;
  maskedValue: string;
}

export interface SliceStore {
  notes: Map<string, NoteRecord>;
  fragments: Map<string, FragmentRecord>;
}

export function createInMemorySliceStore(): SliceStore {
  return {
    notes: new Map(),
    fragments: new Map()
  };
}

function cloneNoteRecord(note: NoteRecord): NoteRecord {
  return {
    ...note,
    fragmentIds: [...note.fragmentIds]
  };
}

function cloneFragmentRecord(fragment: FragmentRecord): FragmentRecord {
  return {
    ...fragment
  };
}

export async function saveNoteWithFragments(
  store: SliceStore,
  input: { note: NoteRecord; fragments: FragmentRecord[] }
): Promise<void> {
  store.notes.set(input.note.id, cloneNoteRecord(input.note));

  for (const fragment of input.fragments) {
    store.fragments.set(fragment.id, cloneFragmentRecord(fragment));
  }
}

export async function loadNoteWithFragments(
  store: SliceStore,
  noteId: string
): Promise<{ note: NoteRecord; fragments: FragmentRecord[] }> {
  const note = store.notes.get(noteId);

  if (!note) {
    throw new Error("note-not-found");
  }

  const fragments = note.fragmentIds.map((fragmentId) => {
    const fragment = store.fragments.get(fragmentId);

    if (!fragment) {
      throw new Error("fragment-not-found");
    }

    return cloneFragmentRecord(fragment);
  });

  return {
    note: cloneNoteRecord(note),
    fragments
  };
}
