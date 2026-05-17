# Cryptonote Bootstrap Design

## Summary

This document defines the bootstrap design for `kriptonot` as a documentation-first, domain-rich monorepo for a local desktop notes application built with Tauri, React, TypeScript, and SQLite.

The scope of this bootstrap is intentionally limited. It does not include application feature code. It defines the target repository structure, package boundaries, validation model, testing model, project governance documents, and manual validation expectations so future implementation can proceed with clear rules and runnable milestones.

The current Python starter is treated as temporary and outside the intended target repository shape.

## Product And Architecture Constraints

The bootstrap and future implementation must preserve these baseline constraints:

- The application is local-first and desktop-only.
- There are no accounts, sync, cloud features, AI features, collaboration features, mobile clients, image handling, or rich text in the MVP.
- Only transformed fragments are encrypted.
- Whole notes are not encrypted in the MVP.
- Masked fragments are revealed only after an explicit user action such as click or unlock.
- Marker-based note content is the baseline content model for the MVP.

The initial content strategy uses marker placeholders in note text:

```text
Normal text before [[masked:fragment-id]] normal text after.
```

This design is preferred over text-range tracking because marker-based references are more resilient to note edits and easier to validate across parsing, storage, and rendering boundaries.

## Target Repository Structure

The target repository should be organized as a domain-rich monorepo with clear boundaries between desktop composition, domain logic, validation, and test support.

```text
kriptonot/
├── AGENTS.md
├── README.md
├── CONSTITUTION.md
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── turbo.json
├── .editorconfig
├── .gitignore
├── apps/
│   └── desktop/
├── packages/
│   ├── note-model/
│   ├── marker-parser/
│   ├── fragment-store/
│   ├── crypto-fragments/
│   ├── storage-sqlite/
│   ├── ui-contracts/
│   ├── validation-schemas/
│   └── test-kit/
├── tests/
│   ├── contract/
│   ├── integration/
│   ├── e2e-spec/
│   └── fixtures/
├── docs/
│   ├── product/
│   ├── architecture/
│   ├── decisions/
│   ├── validation/
│   ├── testing/
│   ├── process/
│   ├── manual-validation/
│   ├── agent-workflows/
│   └── superpowers/specs/
└── scripts/
    └── validation/
```

## Package Responsibilities

Each package should have one clear purpose and stable consumer-facing contracts.

- `apps/desktop` owns Tauri wiring, React composition, desktop entrypoints, and assembly of domain packages.
- `packages/note-model` owns note entities, fragment entities, and domain-level types shared across packages.
- `packages/marker-parser` owns parsing and formatting rules for masked fragment markers and related content transformations.
- `packages/fragment-store` owns fragment lifecycle rules, lookup behavior, and fragment-oriented application services.
- `packages/crypto-fragments` owns encryption and decryption behavior for masked fragments only.
- `packages/storage-sqlite` owns persistence contracts and the SQLite adapter boundary.
- `packages/ui-contracts` owns view models, interaction contracts, and non-rendering UI behavior agreements.
- `packages/validation-schemas` owns shared schemas for config, fixtures, contracts, and validation inputs.
- `packages/test-kit` owns shared test fixtures, factories, helpers, and testing utilities used across packages and root suites.

## Bootstrap Documentation Set

The bootstrap should create a durable documentation layer that explains both product intent and engineering operating rules.

Required root and documentation files:

- `AGENTS.md`
- `README.md`
- `CONSTITUTION.md`
- `docs/product/requirements.md`
- `docs/architecture/initial-design.md`
- `docs/decisions/0001-monorepo-stack.md`
- `docs/agent-workflows/kilo-code.md`

Required process and validation documents:

- `docs/process/feature-delivery-standard.md`
- `docs/process/testing-standard.md`
- `docs/process/validation-standard.md`
- `docs/process/manual-validation-standard.md`
- `docs/process/milestone-readiness.md`
- `docs/validation/repository-rules.md`
- `docs/validation/package-boundaries.md`
- `docs/validation/marker-format.md`
- `docs/validation/acceptance-checklist.md`

Required manual validation documents:

- `docs/manual-validation/bootstrap-checklist.md`
- `docs/manual-validation/local-runbook.md`
- `docs/manual-validation/milestone-01-repo-bootstrap.md`
- `docs/manual-validation/milestone-02-domain-contracts.md`
- `docs/manual-validation/milestone-03-storage-flow.md`
- `docs/manual-validation/milestone-04-masked-reveal-flow.md`

## Governance Standards

The repository should define standards first and defer strict enforcement until later phases.

### Constitution

`CONSTITUTION.md` should define the non-negotiable project principles:

- local-first, desktop-only scope
- MVP exclusions
- fragment-only encryption rule
- requirement that future features include automated validation
- requirement that future features include human-readable manual validation steps
- requirement that milestones be runnable locally

### Agent Instructions

`AGENTS.md` should define how human contributors and coding agents work in the repository:

- where feature specs live
- how plans are written
- how package boundaries are respected
- what validation is expected before work is considered complete
- which documentation must be updated when feature scope changes

### Process Standards

The process documents should describe expected behavior without failing builds if they are temporarily missing from a feature branch.

- `feature-delivery-standard.md` should describe the path from design to plan to implementation to validation.
- `testing-standard.md` should define required test categories, naming conventions, fixture patterns, and negative-case coverage expectations.
- `validation-standard.md` should define automated validation expectations and local command conventions.
- `manual-validation-standard.md` should define how human test flows are documented and executed locally.
- `milestone-readiness.md` should define the minimum evidence needed for a milestone to be considered locally reviewable.

## Validation Design

Validation should begin at bootstrap and cover the repository itself, not only future application logic.

Three validation layers are required:

1. Repository structure validation
2. Contract and schema validation
3. Documentation-to-structure validation

Recommended validation scripts:

```text
scripts/validation/
├── verify-repo-structure.ts
├── verify-workspace-links.ts
├── verify-doc-coverage.ts
└── verify-fixture-shapes.ts
```

Validation goals:

- confirm required folders and placeholder files exist
- confirm workspace manifests point to expected apps and packages
- confirm documented packages and architecture decisions match the actual repository layout
- confirm fixtures and schema examples match their declared shapes

## Testing Design

Testing should be broad from the beginning, even if many tests begin as scaffolds or specification-style suites.

### Package-Level Tests

Each package should have space for local unit or contract-oriented tests once implementation begins.

Coverage expectations should include:

- marker parsing behavior
- fragment lifecycle behavior
- fragment-only crypto boundaries
- SQLite adapter behavior
- UI interaction contracts
- domain schema validation

### Root Test Suites

The root `tests` directory should cover behavior that crosses package boundaries or represents product-level scenarios.

```text
tests/
├── contract/
│   ├── marker-parser.contract.test.ts
│   ├── fragment-store.contract.test.ts
│   └── ui-contracts.contract.test.ts
├── integration/
│   ├── note-fragment-lifecycle.integration.test.ts
│   ├── storage-roundtrip.integration.test.ts
│   └── masked-reveal-flow.integration.test.ts
├── e2e-spec/
│   ├── mvp-boundaries.spec.md
│   ├── masked-fragment-behavior.spec.md
│   └── failure-modes.spec.md
└── fixtures/
    ├── notes/
    ├── fragments/
    └── malformed-inputs/
```

### Required Scenario Coverage

The initial test design should reserve space for these scenarios:

- note content containing plain text and masked markers
- parsing valid and invalid marker syntax
- fragment lookup success and failure
- persistence of notes and fragments through storage boundaries
- masked fragment reveal flows
- explicit confirmation that whole-note encryption is not part of the MVP
- explicit confirmation that out-of-scope capabilities are not introduced into MVP requirements

## Manual Validation Design

Manual validation is a first-class deliverable for this project because trust depends on observable local behavior, not only passing automation.

Each milestone should include:

- prerequisites
- exact local commands
- expected output or observable result
- manual step-by-step verification
- edge cases to try by hand
- a simple pass or fail sign-off section

The local developer experience should prioritize a small set of memorable commands. The exact command names can change during implementation planning, but the bootstrap should reserve command concepts such as:

- `pnpm validate`
- `pnpm test`
- `pnpm test:contracts`
- `pnpm test:integration`
- `pnpm manual:bootstrap`

These command concepts should support both automated checks and human-run milestone verification.

## Milestone Shape

Milestones should be locally runnable and progressively validate the architecture.

- Milestone 1: repository bootstrap and documentation baseline
- Milestone 2: domain package contracts and fixtures
- Milestone 3: storage and persistence contract validation
- Milestone 4: masked fragment parsing and reveal flow validation

Each milestone should have both automated validation and manual validation instructions.

## Implementation Defaults And Assumptions

- The implementation plan should target a pnpm workspace monorepo.
- The desktop client is the only application target in the initial architecture.
- Package boundaries are intentionally explicit even before implementation code exists.
- Standards are documented first and may become enforced later.
- Bootstrap work is limited to repository structure, templates, documentation, validation scaffolding, and test scaffolding.
- The Python starter files are not part of the desired long-term repository shape.

## Out Of Scope For This Bootstrap

The following are intentionally excluded from this bootstrap phase:

- implementing application behavior
- building the Tauri shell
- building React screens
- implementing SQLite persistence logic
- implementing fragment encryption logic
- implementing synchronization, cloud, account, AI, collaboration, image, mobile, or rich text functionality

