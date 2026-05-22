export interface NoteRecord {
  id: string;
  title: string;
  body: string;
  fragmentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FragmentRecord {
  id: string;
  noteId: string;
  cipherText: string;
  maskedValue: string;
}
