# Product Requirements — Cryptonote MVP

## Summary

Cryptonote is a desktop notes app for personal private notes. It is inspired by Apple Notes but starts with a much smaller scope.

The core feature is masking selected text fragments. Masked fragments are displayed as visually consistent but meaningless characters from rare real alphabets. The original text is encrypted and hidden until the user explicitly reveals it.

## Target user

A single user writing personal notes on their own desktop/notebook computer.

## Core use case

The user wants to write notes that may include sensitive fragments. They want the note to remain readable enough around those fragments, while the sensitive text appears meaningless to casual observers.

## MVP workflow

1. User opens desktop app.
2. User creates a note.
3. User writes plain text.
4. User selects a fragment of text.
5. User chooses `Mask selected text` from a context menu or command.
6. App replaces selected text visually with fake characters.
7. App stores the original selected text encrypted.
8. User saves/closes note.
9. User reopens note.
10. Masked fragment is still visible as fake characters.
11. User clicks masked fragment.
12. App shows reveal popup.
13. User unlocks with master password if needed.
14. App displays original text in the popup.

## Functional requirements

### Notes

- User can create a note.
- User can edit plain text note content.
- User can save a note locally.
- User can reopen saved notes.

### Masking

- User can select a text range.
- User can transform selected text into a masked fragment.
- Masked fragment appears as fake characters.
- Default fake characters use Thai and Georgian alphabets.
- The fake output is deterministic for the same text, key, and style.
- Masked fragments cannot be edited directly.

### Reveal

- User can click a masked fragment.
- App opens a popup.
- Popup can display original text after unlock.
- Original text is not shown inline by default.

### Password
- App requires a master password.
- Raw password must not be stored.
- If password is forgotten, encrypted fragments are unrecoverable.

### Storage

- App stores data locally.
- SQLite is the preferred storage for MVP.
- Cloud storage is not part of MVP.

## Non-functional requirements

- Desktop-first.
- TypeScript-first.
- Local-first.
- Simple UI.
- No network dependency for MVP workflows.
- Domain logic should be testable separately from UI.

## Explicit MVP exclusions

- Accounts
- Sync
- Mobile
- Images
- Collaboration
- AI features
- Cloud storage
- Markdown import/export
- Rich text formatting
- Headings
- Lists
- Bold
- Checkboxes
- Tables

## Open questions for later

- Exact data model for notes and fragments
- Whether note content stores fragment markers inline or uses separate ranges
- Exact password-based key derivation approach
- Exact encryption library/API
- Whether to use a plain textarea first or CodeMirror from the start
- Whether masked style definitions are stored in database or code for MVP