# Cryptonote Agent Guide

## Project Purpose

Cryptonote is a personal desktop notes app with a privacy-focused masking feature.

The app lets a user write normal plain-text notes, select part of the text, and transform that fragment into visually meaningless characters from rare real alphabets. The goal is to hide sensitive text from casual viewers without turning the whole note into unreadable encrypted code.

## MVP Goal

The first version should support this basic flow:

1. Create a note.
2. Type plain text.
3. Select part of the text.
4. Transform the selected text into fake visible characters.
5. Save the note locally.
6. Reopen the note later.
7. Click the transformed fragment.
8. Reveal the original text in a popup after an unlock or password flow.

## Important Scope Boundaries

- Personal private notes only.
- Desktop app first.
- Plain text only.
- No rich text.
- No images.
- No markdown import or export.
- No accounts.
- No sync.
- No cloud storage.
- No collaboration.
- No AI features inside the app for now.
- Visual obfuscation is the main product goal.
- Only transformed fragments need protection in the MVP.
- Whole-note encryption is not required in the MVP.
- The app requires a master password.
- Forgotten master passwords must not be recoverable.
- Transformed fragments are not directly editable in the MVP.
- Copy and paste preservation between notes is not required in the MVP.

## Rules For Coding Agents

- Keep the product simple and MVP-focused.
- Prefer the smallest change that moves the app toward the MVP flow.
- Write plain, readable code and avoid clever abstractions unless clearly needed.
- Keep docs and code aligned when product scope changes.
- Treat the visible masking behavior as deterministic for the same original text, password or key, and alphabet style.
- Use Thai and Georgian alphabets as the default visual styles unless a human explicitly changes that direction.
- Preserve the rule that original text is hidden by default and only shown after explicit user action.
- Do not add heavy architecture, new platforms, or advanced workflows unless they are clearly required.

## Do Not Add Without Explicit Human Approval

- Mobile support
- Sync
- Cloud storage
- Accounts or user profiles
- Collaboration
- AI features
- Rich text editing
- Image support
- Markdown import or export
- Whole-note encryption
- Password recovery
- Direct editing of transformed fragments
- Copy and paste preservation guarantees across notes
- Additional obfuscation styles beyond the agreed defaults
- Large framework or architecture changes not needed for the MVP

## Privacy And Security Expectations

- Protect the original content of transformed fragments.
- Never show original text by default.
- Only reveal original text after an explicit user action and unlock flow.
- Treat the master password as sensitive at all times.
- Assume local device privacy matters even without cloud features.
- Prefer designs that reduce accidental exposure of sensitive text on screen.

## Keep It Simple

- Start with the smallest version that proves the core idea works.
- Do not over-engineer storage, UI flows, or internal abstractions early.
- Avoid building future-facing systems before the MVP behavior exists.
- If a decision is unclear, choose the simpler path and document the assumption.

## Logging And Debugging Safety

- Do not log original text.
- Do not log master passwords.
- Do not log decrypted fragments.
- Do not add debug output that exposes protected content in plaintext.
