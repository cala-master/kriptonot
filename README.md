# Cryptonote

Cryptonote is a personal desktop notes app with a privacy-focused text masking feature.

It is inspired by simple notes apps such as Apple Notes, but adds a special workflow for hiding sensitive fragments inside otherwise normal plain-text notes.

## What The App Does

- Lets the user write normal plain-text notes.
- Lets the user select a fragment of text and transform it into fake visible characters.
- Uses rare real alphabets to make the visible text look consistent and meaningless instead of looking like raw encrypted code.
- Uses Thai and Georgian alphabets by default in the first version.
- Keeps the original fragment protected under the hood.
- Reveals the original fragment only after explicit user action.

## MVP Workflow

1. Create a note.
2. Type plain text.
3. Select part of the text.
4. Transform the selected text into fake characters.
5. Save the note locally.
6. Reopen the note later.
7. Click the transformed fragment.
8. Reveal the original text in a popup after unlock or password flow.

## What Is Included In The First Version

- Personal private notes
- Desktop-first experience
- Plain-text note editing
- Local note storage
- Fragment-level protection for transformed text
- Master password requirement
- Deterministic visible masking for the same original text, password or key, and style
- Thai and Georgian masking styles by default
- Popup-based reveal after explicit user action

## What Is Not Included

- Mobile app
- Rich text
- Images
- Markdown import or export
- Accounts
- Sync
- Cloud storage
- Collaboration
- AI features inside the app
- Whole-note encryption
- Password recovery
- Direct editing of transformed fragments
- Guaranteed copy and paste preservation between notes

## Future Direction

- Additional alphabet styles may be added later.
- Mobile may be considered later, but not in the current product scope.
- The app may grow carefully over time, but the core idea should stay focused on visually hiding sensitive fragments inside normal notes.

## Architecture Note

The technical architecture is still intentionally lightweight at this stage. The likely direction is a desktop-first TypeScript app, but the final structure and stack details will be decided later as implementation begins.
