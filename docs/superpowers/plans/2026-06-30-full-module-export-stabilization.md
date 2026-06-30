# Full Module Export Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every NEXORA Builder module safer across Builder canvas, Preview, CMS paste export, and ZIP HTML export before the 2026-07-01 user trial.

**Architecture:** Keep the current Phase 1 registry architecture, then add full-module verification around every module type. Fix high-risk CSS/HTML parity issues in place without breaking existing local projects.

**Tech Stack:** Next.js 14, React 18, TypeScript, static HTML exporters, generated scoped `.cb-*` CSS, Node verifier scripts.

---

## Files

- Modify: `scripts/verify-module-rendering-architecture.mjs`
- Create: `scripts/verify-full-module-export-stability.mjs`
- Modify: `package.json`
- Modify: `lib/export/cssGenerator.ts`
- Modify: selected `modules/exporters/*`
- Modify: `docs/module-development-standard.md`
- Modify: `docs/module-rendering-export-architecture.md`
- Modify: `docs/superpowers/plans/2026-06-30-full-module-export-stabilization.md`

## Task 1: Full Module Export Stability Verifier

- [x] Add `scripts/verify-full-module-export-stability.mjs`.
- [x] The verifier must read `types/modules.ts`, `lib/modules/moduleRegistry.ts`, `modules/preview/ModulePreviewRenderer.tsx`, and `lib/export/cssGenerator.ts`.
- [x] It must assert every `ModuleType` exists in both `moduleRegistry` and `previewRegistry`.
- [x] It must assert every module has a matching top-level `.cb-*` export CSS scope.
- [x] It must assert high-risk modules have mobile CSS rules.
- [x] It must assert Builder-only classes are absent from export CSS.
- [x] Run `npm run verify:full-module-export-stability` and confirm it fails before implementation is complete.

## Task 2: Patch High-Risk Export Layouts

- [x] Fix product showcase split/luxury/spacious CSS so text cards do not clip and images do not cover text.
- [x] Fix product purchase bundle/related CSS so Preview and Export item counts and grid behavior match.
- [x] Fix product features CSS so all styles keep consistent grid/mobile rules.
- [x] Fix banner/products and product cards so card height does not stretch with empty lower space.
- [x] Fix hero and KV export styles so no black gradient filter is injected by default.

## Task 3: Run Required Verification

- [x] Run `npm run verify:full-module-export-stability`.
- [x] Run `npm run verify:module-rendering-architecture`.
- [x] Run `npm run verify:product-export-hotfixes`.
- [x] Run `npm run verify:visual-safety`.
- [x] Run `npm run verify:cms-consistency`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.

## Task 4: Documentation Sync

- [x] Update `docs/module-development-standard.md` with the new verifier.
- [x] Update `docs/module-rendering-export-architecture.md` with the new full-module stability gate.
- [x] Mark this plan status as completed when verification passes.

## Completion Definition

This task is not complete until the full verifier passes and the docs mention the verifier. Any future module change must keep this verifier green.
