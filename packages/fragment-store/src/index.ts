import type { FragmentRecord } from "@kriptonot/note-model";
import { formatMaskedMarker } from "../../marker-parser/src/index.ts";

export interface FragmentLookupRequest {
  fragmentId: string;
}

export interface FragmentStoreContract {
  getFragment(request: FragmentLookupRequest): Promise<unknown>;
}

export interface CreateMaskedFragmentDraftRequest {
  noteId: string;
  noteBody: string;
  selectionStart: number;
  selectionEnd: number;
  fragmentId: string;
  cipherText: string;
  maskedValue: string;
}

export interface CreateMaskedFragmentDraftResult {
  updatedBody: string;
  fragmentRecord: FragmentRecord;
}

function assertValidSelectionRange(noteBody: string, selectionStart: number, selectionEnd: number): void {
  if (!Number.isFinite(selectionStart) || !Number.isFinite(selectionEnd) || !Number.isInteger(selectionStart) || !Number.isInteger(selectionEnd)) {
    throw new RangeError("selection range must use finite integer indexes");
  }

  if (selectionStart > selectionEnd) {
    throw new RangeError("selectionStart must be less than or equal to selectionEnd");
  }

  if (selectionStart < 0 || selectionEnd > noteBody.length) {
    throw new RangeError("selection range must be within note body bounds");
  }
}

export function createMaskedFragmentDraft(
  request: CreateMaskedFragmentDraftRequest
): CreateMaskedFragmentDraftResult {
  assertValidSelectionRange(request.noteBody, request.selectionStart, request.selectionEnd);

  const before = request.noteBody.slice(0, request.selectionStart);
  const after = request.noteBody.slice(request.selectionEnd);
  const marker = formatMaskedMarker(request.fragmentId);

  return {
    updatedBody: `${before}${marker}${after}`,
    fragmentRecord: {
      id: request.fragmentId,
      noteId: request.noteId,
      cipherText: request.cipherText,
      maskedValue: request.maskedValue
    }
  };
}
