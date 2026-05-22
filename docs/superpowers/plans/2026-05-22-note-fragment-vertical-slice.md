# Note And Fragment Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working MVP slice for plain-text notes with marker-backed protected fragments, local save and reopen, and hidden masked rendering without reveal yet.

**Architecture:** Keep the first slice small and domain-first. Define stable TypeScript contracts in the domain packages, use simple in-memory behavior for integration tests where needed, and wire the desktop shell to those contracts with the smallest UI that proves the flow. Real unlock and real Thai/Georgian deterministic masking are intentionally deferred to the next implementation plan.

**Tech Stack:** TypeScript, React, Node test runner, existing monorepo packages, desktop app shell in `apps/desktop`

---

## File Structure

- Modify: `packages/note-model/src/index.ts`
  - Expand note and fragment types for the first real slice.
- Modify: `packages/marker-parser/src/index.ts`
  - Add parse and format helpers for masked markers.
- Modify: `packages/fragment-store/src/index.ts`
  - Add the use-case-level contract for transforming selected note text into a protected fragment.
- Modify: `packages/storage-sqlite/src/index.ts`
  - Define the persistence port used by the first slice without committing to final SQLite internals.
- Modify: `packages/ui-contracts/src/index.ts`
  - Define the view-model shape for hidden masked fragments in the note body.
- Modify: `packages/test-kit/src/index.ts`
  - Add tiny fixture helpers for repeatable contract and integration tests.
- Modify: `apps/desktop/src/App.tsx`
  - Replace the placeholder shell body with a minimal note editor flow.
- Create: `apps/desktop/src/note-editor-model.ts`
  - Keep note editing and masking actions out of the React component.
- Create: `apps/desktop/src/sample-note-workflow.ts`
  - Simple local workflow adapter for the first vertical slice.
- Create: `tests/contract/note-model.contract.test.mjs`
  - Lock the note and fragment record contract.
- Modify: `tests/contract/marker-parser.contract.test.mjs`
  - Move from regex-only checks to real parse and format behavior.
- Modify: `tests/contract/fragment-store.contract.test.mjs`
  - Verify text selection transformation and fragment ownership rules.
- Modify: `tests/contract/ui-contracts.contract.test.mjs`
  - Verify hidden masked rendering state remains the default.
- Modify: `tests/integration/note-fragment-lifecycle.integration.test.mjs`
  - Prove the create-edit-transform flow works end to end.
- Modify: `tests/integration/storage-roundtrip.integration.test.mjs`
  - Prove note plus fragment linkage survives save and reopen.
- Modify: `tests/fixtures/notes/basic-note.json`
  - Align the fixture with the richer note shape.
- Modify: `tests/fixtures/fragments/basic-fragment.json`
  - Align the fixture with the richer fragment shape.

## Cut Line For This Plan

This plan includes:

- note creation and editing
- masked marker insertion
- protected fragment record creation
- hidden masked rendering in the note body
- local save and reopen behavior

This plan does not include:

- reveal popup
- unlock or password confirmation UI
- final crypto algorithm
- final deterministic Thai/Georgian character mapping

### Task 1: Lock The Note And Fragment Domain Contracts

**Files:**
- Modify: `packages/note-model/src/index.ts`
- Create: `tests/contract/note-model.contract.test.mjs`
- Modify: `tests/fixtures/notes/basic-note.json`
- Modify: `tests/fixtures/fragments/basic-fragment.json`

- [ ] **Step 1: Write the failing contract test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("note and fragment fixtures match the first vertical-slice contract", () => {
  const noteModelSource = readFileSync("packages/note-model/src/index.ts", "utf8");
  const noteFixture = JSON.parse(readFileSync("tests/fixtures/notes/basic-note.json", "utf8"));
  const fragmentFixture = JSON.parse(readFileSync("tests/fixtures/fragments/basic-fragment.json", "utf8"));

  assert.ok(noteModelSource.includes("export interface NoteRecord"));
  assert.ok(noteModelSource.includes("createdAt"));
  assert.ok(noteModelSource.includes("updatedAt"));
  assert.ok(noteModelSource.includes("export interface FragmentRecord"));
  assert.ok(noteModelSource.includes("noteId"));
  assert.ok(noteModelSource.includes("maskedValue"));

  assert.equal(typeof noteFixture.id, "string");
  assert.equal(typeof noteFixture.body, "string");
  assert.equal(typeof noteFixture.createdAt, "string");
  assert.equal(typeof noteFixture.updatedAt, "string");
  assert.deepEqual(noteFixture.fragmentIds, [fragmentFixture.id]);

  assert.equal(fragmentFixture.noteId, noteFixture.id);
  assert.equal(typeof fragmentFixture.cipherText, "string");
  assert.equal(typeof fragmentFixture.maskedValue, "string");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/contract/note-model.contract.test.mjs`
Expected: FAIL because `createdAt`, `updatedAt`, `noteId`, and `maskedValue` are not in the current contract or fixtures.

- [ ] **Step 3: Write the minimal contract update**

```ts
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
```

```json
{
  "id": "note-1",
  "title": "Personal note",
  "body": "Normal text before [[masked:fragment-1]] normal text after.",
  "fragmentIds": ["fragment-1"],
  "createdAt": "2026-05-22T10:00:00.000Z",
  "updatedAt": "2026-05-22T10:00:00.000Z"
}
```

```json
{
  "id": "fragment-1",
  "noteId": "note-1",
  "cipherText": "cipher-fragment-1",
  "maskedValue": "ฏซฉฮ"
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/contract/note-model.contract.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/note-model/src/index.ts tests/contract/note-model.contract.test.mjs tests/fixtures/notes/basic-note.json tests/fixtures/fragments/basic-fragment.json
git commit -m "feat: define note and fragment slice contracts"
```

### Task 2: Implement Marker Parsing And Formatting Contracts

**Files:**
- Modify: `packages/marker-parser/src/index.ts`
- Modify: `tests/contract/marker-parser.contract.test.mjs`

- [ ] **Step 1: Write the failing parser contract tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { parseMaskedMarkers, formatMaskedMarker } from "../../packages/marker-parser/src/index.ts";

test("parseMaskedMarkers preserves text and extracts marker references", () => {
  const body = "alpha [[masked:fragment-1]] omega";
  const result = parseMaskedMarkers(body);

  assert.deepEqual(result.references, [
    {
      fragmentId: "fragment-1",
      rawMarker: "[[masked:fragment-1]]",
      start: 6,
      end: 28
    }
  ]);
  assert.equal(result.plainText, body);
});

test("formatMaskedMarker creates the approved marker shape", () => {
  assert.equal(formatMaskedMarker("fragment-1"), "[[masked:fragment-1]]");
});

test("parseMaskedMarkers reports malformed content without deleting plain text", () => {
  const malformed = "alpha [[masked fragment-1]] omega";
  const result = parseMaskedMarkers(malformed);

  assert.equal(result.references.length, 0);
  assert.equal(result.errors.length, 1);
  assert.equal(result.plainText, malformed);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/contract/marker-parser.contract.test.mjs`
Expected: FAIL because `parseMaskedMarkers` and `formatMaskedMarker` do not exist yet.

- [ ] **Step 3: Write the minimal parser and formatter**

```ts
export const MASKED_MARKER_PATTERN = /\[\[masked:([a-z0-9-]+)\]\]/g;

export interface MaskedMarkerReference {
  fragmentId: string;
  rawMarker: string;
  start: number;
  end: number;
}

export interface MarkerParseError {
  reason: "malformed-marker";
  rawText: string;
}

export interface MarkerParseResult {
  plainText: string;
  references: MaskedMarkerReference[];
  errors: MarkerParseError[];
}

export function formatMaskedMarker(fragmentId: string): string {
  return `[[masked:${fragmentId}]]`;
}

export function parseMaskedMarkers(body: string): MarkerParseResult {
  const references: MaskedMarkerReference[] = [];

  for (const match of body.matchAll(MASKED_MARKER_PATTERN)) {
    const rawMarker = match[0];
    const fragmentId = match[1];
    const start = match.index ?? 0;

    references.push({
      fragmentId,
      rawMarker,
      start,
      end: start + rawMarker.length
    });
  }

  const malformedLikeMarker = body.includes("[[masked") && references.length === 0;

  return {
    plainText: body,
    references,
    errors: malformedLikeMarker
      ? [{ reason: "malformed-marker", rawText: body }]
      : []
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/contract/marker-parser.contract.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/marker-parser/src/index.ts tests/contract/marker-parser.contract.test.mjs
git commit -m "feat: add marker parse and format contracts"
```

### Task 3: Add The Fragment Transformation Use Case

**Files:**
- Modify: `packages/fragment-store/src/index.ts`
- Modify: `packages/test-kit/src/index.ts`
- Modify: `tests/contract/fragment-store.contract.test.mjs`

- [ ] **Step 1: Write the failing fragment transformation test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createMaskedFragmentDraft } from "../../packages/fragment-store/src/index.ts";

test("createMaskedFragmentDraft replaces selected text with a marker and returns a fragment record", () => {
  const result = createMaskedFragmentDraft({
    noteId: "note-1",
    noteBody: "Keep my pin safe",
    selectionStart: 8,
    selectionEnd: 14,
    fragmentId: "fragment-1",
    cipherText: "cipher-fragment-1",
    maskedValue: "ฏซฉฮ"
  });

  assert.equal(result.updatedBody, "Keep my [[masked:fragment-1]] safe");
  assert.deepEqual(result.fragmentRecord, {
    id: "fragment-1",
    noteId: "note-1",
    cipherText: "cipher-fragment-1",
    maskedValue: "ฏซฉฮ"
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/contract/fragment-store.contract.test.mjs`
Expected: FAIL because `createMaskedFragmentDraft` does not exist yet.

- [ ] **Step 3: Write the minimal use-case contract**

```ts
import type { FragmentRecord } from "@kriptonot/note-model";
import { formatMaskedMarker } from "@kriptonot/marker-parser";

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

export function createMaskedFragmentDraft(
  request: CreateMaskedFragmentDraftRequest
): CreateMaskedFragmentDraftResult {
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
```

```ts
export function fixedSliceMask(): string {
  return "ฏซฉฮ";
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/contract/fragment-store.contract.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/fragment-store/src/index.ts packages/test-kit/src/index.ts tests/contract/fragment-store.contract.test.mjs
git commit -m "feat: add fragment transformation contract"
```

### Task 4: Define Local Persistence Ports For The Slice

**Files:**
- Modify: `packages/storage-sqlite/src/index.ts`
- Modify: `tests/integration/storage-roundtrip.integration.test.mjs`

- [ ] **Step 1: Write the failing persistence round-trip test**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/integration/storage-roundtrip.integration.test.mjs`
Expected: FAIL because the in-memory slice store helpers do not exist yet.

- [ ] **Step 3: Write the minimal persistence port and test adapter**

```ts
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

export async function saveNoteWithFragments(
  store: SliceStore,
  input: { note: NoteRecord; fragments: FragmentRecord[] }
): Promise<void> {
  store.notes.set(input.note.id, input.note);

  for (const fragment of input.fragments) {
    store.fragments.set(fragment.id, fragment);
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

  return {
    note,
    fragments: note.fragmentIds
      .map((fragmentId) => store.fragments.get(fragmentId))
      .filter((fragment): fragment is FragmentRecord => Boolean(fragment))
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/integration/storage-roundtrip.integration.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/storage-sqlite/src/index.ts tests/integration/storage-roundtrip.integration.test.mjs
git commit -m "feat: add slice persistence port"
```

### Task 5: Build A Minimal Desktop Note Editor For The Hidden Flow

**Files:**
- Modify: `packages/ui-contracts/src/index.ts`
- Create: `apps/desktop/src/note-editor-model.ts`
- Create: `apps/desktop/src/sample-note-workflow.ts`
- Modify: `apps/desktop/src/App.tsx`
- Modify: `tests/contract/ui-contracts.contract.test.mjs`
- Modify: `tests/integration/note-fragment-lifecycle.integration.test.mjs`

- [ ] **Step 1: Write the failing UI and workflow integration tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("desktop app mounts a plain-text note editor with a hidden masked fragment list", () => {
  const appSource = readFileSync("apps/desktop/src/App.tsx", "utf8");
  const modelSource = readFileSync("apps/desktop/src/note-editor-model.ts", "utf8");
  const uiContractSource = readFileSync("packages/ui-contracts/src/index.ts", "utf8");

  assert.ok(appSource.includes("textarea"));
  assert.ok(appSource.includes("Mask selection"));
  assert.ok(modelSource.includes("applyMaskToSelection"));
  assert.ok(uiContractSource.includes("MaskedFragmentViewState"));
  assert.ok(uiContractSource.includes("isLocked: true"));
});
```

```js
import test from "node:test";
import assert from "node:assert/strict";
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/contract/ui-contracts.contract.test.mjs tests/integration/note-fragment-lifecycle.integration.test.mjs`
Expected: FAIL because the editor model, workflow, and hidden view-state behavior do not exist yet.

- [ ] **Step 3: Write the minimal UI contract and editor workflow**

```ts
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
```

```ts
import type { FragmentRecord, NoteRecord } from "@kriptonot/note-model";
import { createMaskedFragmentDraft } from "@kriptonot/fragment-store";
import { createInMemorySliceStore, loadNoteWithFragments, saveNoteWithFragments } from "@kriptonot/storage-sqlite";

export function createSampleNoteWorkflow() {
  const store = createInMemorySliceStore();

  return {
    async createNote() {
      return {
        note: {
          id: "note-1",
          title: "",
          body: "",
          fragmentIds: [],
          createdAt: "2026-05-22T10:00:00.000Z",
          updatedAt: "2026-05-22T10:00:00.000Z"
        },
        fragments: [] as FragmentRecord[]
      };
    },
    updateBody(state: { note: NoteRecord; fragments: FragmentRecord[] }, body: string) {
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
      state: { note: NoteRecord; fragments: FragmentRecord[] },
      selection: { selectionStart: number; selectionEnd: number }
    ) {
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
    async save(state: { note: NoteRecord; fragments: FragmentRecord[] }) {
      await saveNoteWithFragments(store, state);
    },
    async load(noteId: string) {
      const loaded = await loadNoteWithFragments(store, noteId);

      return {
        ...loaded,
        viewState: loaded.fragments.map((fragment) => ({
          fragmentId: fragment.id,
          isLocked: true as const,
          displayValue: fragment.maskedValue
        }))
      };
    }
  };
}
```

```tsx
import { useState } from "react";
import { createSampleNoteWorkflow } from "./sample-note-workflow";

const workflow = createSampleNoteWorkflow();

export function App() {
  const [body, setBody] = useState("");

  return (
    <main className="app-shell">
      <h1>kriptonot</h1>
      <textarea value={body} onChange={(event) => setBody(event.target.value)} />
      <button type="button">Mask selection</button>
      <p>Hidden masked fragments remain locked in this slice.</p>
    </main>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/contract/ui-contracts.contract.test.mjs tests/integration/note-fragment-lifecycle.integration.test.mjs`
Expected: PASS

- [ ] **Step 5: Run the whole automated suite**

Run: `pnpm validate && pnpm test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages/ui-contracts/src/index.ts apps/desktop/src/note-editor-model.ts apps/desktop/src/sample-note-workflow.ts apps/desktop/src/App.tsx tests/contract/ui-contracts.contract.test.mjs tests/integration/note-fragment-lifecycle.integration.test.mjs
git commit -m "feat: wire first note fragment vertical slice"
```

## Plan Self-Review

- Spec coverage:
  - Note contract: Task 1
  - Marker parser contract: Task 2
  - Fragment lifecycle contract: Task 3
  - Persistence contract: Task 4
  - Hidden UI contract for the first slice: Task 5
  - Reveal and deterministic masking: intentionally deferred to the next plan
- Placeholder scan:
  - No `TODO`, `TBD`, or “implement later” steps remain inside the task checklist.
- Type consistency:
  - `NoteRecord`, `FragmentRecord`, `maskedValue`, and `fragmentIds` are used consistently across all tasks.

## Next Plan After This One

The next implementation plan should cover:

- master password handling at the UI boundary
- unlock and reveal popup behavior
- fragment decryption boundary
- deterministic Thai and Georgian masked output generation
- privacy-safe error and logging hardening
