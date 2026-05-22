export interface MaskedFragmentViewState {
  fragmentId: string;
  isLocked: true;
  displayValue: string;
}

export interface NoteEditorSnapshot {
  noteId: string;
  title: string;
  body: string;
  fragments: MaskedFragmentViewState[];
}
