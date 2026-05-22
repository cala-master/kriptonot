# Cryptonote Domain Contracts Design

## Summary

This document defines the first combined domain contracts for the Cryptonote MVP.

Its purpose is to lock the behavior of notes, masked markers, protected fragments, reveal flow, persistence, and deterministic masking before implementation starts. It stays product-focused and avoids choosing deep architecture, exact database schema, or final crypto details.

The contracts in this document are intended to guide the first implementation plan and the first TDD slices.

## Scope

This spec covers:

- note domain behavior
- marker parsing behavior
- fragment lifecycle behavior
- reveal and unlock behavior
- persistence expectations
- deterministic visible masking behavior
- privacy and failure expectations

This spec does not cover:

- full technical architecture
- exact database schema
- exact crypto algorithm choice
- final framework internals
- mobile or cloud features

## Product Rules Carried Into All Contracts

- The app is a personal desktop notes app.
- Notes are plain text only in the MVP.
- Visual obfuscation is the main product goal.
- Only transformed fragments require protection in the MVP.
- Whole-note encryption is out of scope in the MVP.
- The app requires a master password.
- Forgotten master passwords must not be recoverable.
- Original protected text must stay hidden by default.
- Revealing original text requires explicit user action and an unlock flow.
- Thai and Georgian are the default masking styles for the MVP.

## 1. Note Domain Contract

### Purpose

The note domain contract defines what a note is and which data belongs to it.

### Required Behavior

- A note has a stable identifier.
- A note has a plain-text body.
- A note may have a title.
- A note has created and updated timestamps.
- The visible note body is the source of truth for what the user sees in the editor.
- Protected fragments are represented inside the note body through masked markers, not through inline original text.
- A note must support create, edit, save, close, and reopen behavior in the MVP.

### Domain Rules

- Plain text outside masked markers remains directly editable.
- Masked fragments are treated as special protected units inside the note body.
- The note contract may expose fragment references derived from the body, but the body remains the canonical visible content.
- Empty note behavior is allowed in the MVP.
- Empty title behavior is allowed in the MVP.

### Invalid States

- A note body must not contain inline decrypted protected text as part of normal saved state.
- A note must not depend on text-range tracking as the canonical protected-fragment reference model for the MVP.

## 2. Marker Parser Contract

### Purpose

The marker parser contract defines how protected fragment markers are recognized and preserved inside plain-text note content.

### Marker Model

The baseline marker shape remains:

```text
[[masked:fragment-id]]
```

### Required Behavior

- The parser must detect valid masked markers in note text.
- The parser must extract fragment identifiers deterministically.
- The parser must preserve all surrounding plain text exactly.
- The parser must support parse behavior and format behavior that are stable across save and reopen flows.
- The parser must support round-trip expectations: valid content can be parsed, represented, and formatted back without changing meaning.

### Error Handling Rules

- Malformed markers must be detected predictably.
- Invalid marker syntax must not silently reveal protected text.
- Notes containing malformed markers must still remain loadable as plain text when possible.
- Broken or malformed marker content must surface as safe validation or rendering errors rather than destructive data rewriting.

### Identity Rules

- Marker identifiers must be stable across save and reopen.
- Duplicate references to the same fragment identifier are allowed only if implementation explicitly supports shared references later. For the MVP, the safer assumption is one marker maps to one fragment record instance in normal note editing flow.
- Orphaned markers and missing fragment references must be detectable by later validation and UI layers.

## 3. Fragment Lifecycle Contract

### Purpose

The fragment lifecycle contract defines what happens when a user transforms selected text into a protected fragment and later reveals it.

### Lifecycle States

A fragment moves through these logical states:

1. Plain selected text inside a note
2. Protected stored fragment linked from the note
3. Hidden masked fragment shown in the note body
4. Temporarily revealed fragment in a popup after unlock
5. Hidden again after popup close or session end

### Required Behavior

- Transforming selected text creates a protected fragment record.
- The original selected text is removed from normal visible note content and replaced with a marker-backed masked representation.
- A fragment has a stable identifier.
- A fragment remains linked to the note content through its marker.
- Reopening a saved note preserves the fragment identity and masked visible form.
- Protected fragments are not directly editable in the MVP.

### Deletion And Change Rules

- If a masked marker is removed from the note, the implementation must define fragment cleanup behavior explicitly during implementation planning.
- For the contract level, orphan detection is required even if cleanup timing is deferred.
- The MVP should favor simple and safe fragment ownership rules over reuse across notes.

## 4. Reveal And Unlock UI Contract

### Purpose

The reveal and unlock contract defines how original protected text may be shown to the user.

### Required Behavior

- Protected text is hidden by default.
- The user must explicitly interact with a masked fragment to begin reveal.
- Reveal requires unlock or password confirmation.
- The original text is shown in a popup, not inline inside the note body, in the MVP.
- Closing the popup returns the fragment to hidden state.
- Failed unlock attempts must not expose original text.

### UI Safety Rules

- The note view must continue showing only the masked visible representation unless the reveal popup is actively open.
- Reveal state must be temporary.
- The UI contract must support safe handling of canceled unlock flows.
- The UI contract must support a clear non-sensitive error state when reveal fails.

### Out Of Scope

- Inline permanent unmasking
- Direct editing of original protected text inside the popup
- Background reveal without user interaction

## 5. Persistence Contract

### Purpose

The persistence contract defines the minimum data durability rules for notes and protected fragments in the local MVP.

### Required Behavior

- Notes and protected fragments are stored separately.
- Saving a note must preserve the note body and its masked marker references.
- Saving a transformed fragment must preserve the link between marker identifier and protected fragment record.
- Reopening a saved note must restore the same visible masked content and the same reveal capability.
- Persistence is local only in the MVP.

### Failure Rules

- Missing fragment data must be detectable.
- Broken marker references must be detectable.
- Corrupted stored fragment data must fail safely.
- Safe failure means the app does not reveal original text accidentally and does not silently rewrite protected content into an inconsistent state.

### MVP Boundary

- The persistence contract does not require sync, cloud storage, accounts, or cross-device recovery.
- The persistence contract does not require copy and paste preservation between notes.

## 6. Deterministic Masking Contract

### Purpose

The deterministic masking contract defines the visible fake text behavior used to hide original protected text from casual viewers.

### Required Behavior

- The same original text, the same password or key context, and the same masking style must produce the same visible masked output.
- Different masking styles may produce different visible outputs for the same original text.
- Default supported styles for the MVP are Thai and Georgian.
- The masked output must look visually consistent and meaningless.
- The masked output must not look like obvious ciphertext formats such as hex or base64.
- The visible output must not directly expose the original text.

### Output Rules

- The visible output must be suitable for rendering inline inside a plain-text note view.
- The output format must be stable enough to survive save and reopen without changing appearance unexpectedly.
- Exact output length and character mapping details are implementation decisions, but they must be deterministic and testable.

### MVP Boundary

- Additional alphabet styles are out of scope unless explicitly approved by a human.
- The masking contract is about obfuscated visible output, not about making the note body itself unreadable through whole-note encryption.

## 7. Privacy And Failure Rules

### Privacy Expectations

- Original protected text must never be logged.
- Master passwords must never be logged.
- Decrypted fragment content must never be logged.
- Normal debugging output must not expose protected content.
- The system should prefer safe failure over convenience when protected data is unavailable or invalid.

### Failure Expectations

- Invalid data should fail with clear but non-sensitive errors.
- A reveal failure should not corrupt the note body.
- A malformed marker should not cause unrelated note text loss.
- A missing fragment should remain non-revealed and surface as a recoverable UI or validation problem.

## 8. Testing Expectations For The First Implementation Slice

The first implementation plan should convert these contracts into small TDD slices.

The first slice should prioritize:

- note body with masked marker representation
- marker parsing and validation
- fragment creation from selected text
- stable save and reopen behavior for note plus fragment linkage

Later slices should add:

- unlock and popup reveal flow
- deterministic Thai and Georgian masking behavior
- persistence and corruption edge cases
- privacy-safe logging and failure handling

## Recommended Next Step

The next document should be a short implementation plan for the first vertical slice.

That slice should prove the core loop:

1. Create a note
2. Write plain text
3. Transform selected text into a protected masked fragment
4. Save locally
5. Reopen the note
6. Confirm the masked fragment still exists and remains hidden
