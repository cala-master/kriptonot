export interface NoteRecord {
  id: string;
  title: string;
  body: string;
  fragmentIds: string[];
}

export interface FragmentRecord {
  id: string;
  cipherText: string;
  previewMask: string;
}
