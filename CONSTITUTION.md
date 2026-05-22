# Cryptonote Constitution

- selected fragments are encrypted
- visible text is obfuscated
- full note content is not encrypted unless explicitly added later

Documentation, UI, and agent-generated text must explain this honestly.


## Product Principles

- The product is local-first and desktop-only in the MVP.
- The MVP excludes accounts, sync, cloud features, AI features, collaboration, mobile clients, images, and rich text.
- Only transformed fragments are encrypted in the MVP.
- Whole notes are not encrypted in the MVP.
- Masked fragments are revealed only after explicit user action.

## Engineering Principles

- Repository structure, validation, and testability are part of the product baseline.
- Every future feature requires automated validation coverage.
- Every future feature requires documented manual validation steps.
- Every milestone must be runnable locally by a human reviewer.
- Standards are documented first and may become enforced later.


## Local-first architecture

Cryptonote should work as a local desktop app.

The MVP should not depend on external services to create, store, mask, or reveal notes.

## Clear module boundaries

Core masking logic, storage, and UI must be separated.
The UI should not own encryption/masking rules.
The storage layer should not own product behavior.
The core package should be testable without the desktop app.

## Agent accountability

Coding agents must:

- keep changes small
- update documentation when behavior changes
- write tests for domain logic
- avoid logging sensitive values
- ask before changing architecture or security assumptions

## Human approval for irreversible decisions

Human approval is required before changing:

- storage format
- encryption approach
- password/key derivation approach
- desktop framework
- monorepo structure
- MVP scope
