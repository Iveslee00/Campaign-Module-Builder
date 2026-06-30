# Full Module Shared Renderer Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild NEXORA Builder modules so Builder canvas, Preview modal, CMS paste export, and ZIP export use the same module rendering source instead of separate preview JSX and export HTML strings.

**Architecture:** Keep the existing `{ id, type, data }` project format for compatibility, but introduce a shared ModuleView layer per module. Preview wrappers and export generation must call the same ModuleView. CSS moves from one large `lib/export/cssGenerator.ts` toward module-scoped CSS fragments collected through the registry.

**Tech Stack:** Next.js 14, React 18, TypeScript, `react-dom/server`, existing `PageModule` types, scoped `.cb-*` CSS, custom verification scripts.

---

## Scope

This is a deep module architecture refactor. It covers all current `ModuleType` entries:

### General

- `title`
- `anchor-nav`
- `hero`
- `hero-carousel`
- `split-section`
- `article-text`
- `article-image`
- `faq`
- `logo-wall`
- `sticky-sidebar`
- `cta`

### Campaign

- `bank-promo`
- `product-grid`
- `product-carousel`
- `banner-products`
- `product-banner`

### Product

- `product-features`
- `product-showcase`
- `product-scenes`
- `product-info`
- `product-benefits`
- `product-steps`
- `product-comparison`
- `product-proof`
- `product-purchase`

## Non-Scope

- Do not change Neon schema.
- Do not change login/session behavior.
- Do not change `.cmb` project file format.
- Do not remove existing localStorage compatibility.
- Do not redesign the whole editor shell.
- Do not add new public modules during this refactor.
- Do not rename existing `ModuleType` values.
- Do not break existing saved projects.

## Target Architecture

```text
PageModule
  ↓
moduleRegistry[type]
  ↓
ModuleView
  ├─ mode="builder"
  ├─ mode="preview"
  └─ mode="export"
  ↓
Preview: React render
Export: renderToStaticMarkup
  ↓
collect module CSS fragments
  ↓
final HTML / CSS / JS / assets
```

## New File Structure

- Create `modules/renderers/types.ts`
  - Owns `ModuleRenderMode`, `ModuleViewProps`, `ModuleCssFragment`, and shared render context types.
- Create `modules/renderers/shared/SectionShell.tsx`
  - Shared section wrapper for `.cb-section`, background, anchor id, and safe container behavior.
- Create `modules/renderers/shared/ModuleHead.tsx`
  - Shared eyebrow/title/subtitle markup for product and article style modules.
- Create `modules/renderers/shared/NexoraButton.tsx`
  - Shared CTA button markup and color defaults.
- Create `modules/renderers/shared/NexoraPicture.tsx`
  - Shared PC/M image rendering with mobile fallback.
- Create `modules/renderers/shared/ProductCardView.tsx`
  - Shared product card used by product list, carousel, banner products, and purchase modules.
- Create `modules/renderers/index.ts`
  - Exports shared renderers and typed registry helpers.
- Create `lib/export/renderStaticModule.tsx`
  - Converts a `PageModule` to static markup using `react-dom/server`.
- Create `lib/export/moduleCssCollector.ts`
  - Collects base CSS and module CSS fragments from registry.
- Modify `lib/modules/moduleRegistry.ts`
  - Add `component`, `css`, `legacyExporterAllowed` fields during migration.
- Modify `modules/preview/ModulePreviewRenderer.tsx`
  - Route migrated modules through shared ModuleView.
- Modify `lib/export/htmlGenerator.ts`
  - Route migrated modules through `renderStaticModule`.
- Modify `lib/export/cssGenerator.ts`
  - Keep base CSS initially; remove module CSS section-by-section as fragments migrate.
- Modify `scripts/verify-module-export-parity.mjs`
  - Track migrated modules and fail if migrated modules still use legacy exporter-only output.
- Create `scripts/verify-shared-module-renderers.mjs`
  - Ensures every migrated module has component + CSS fragment + preview + export registration.
- Create `scripts/verify-module-css-fragments.mjs`
  - Ensures CSS fragments are scoped and no generic selectors are introduced.

## Migration Strategy

Use a two-list system in `moduleRegistry` during migration:

```ts
sharedRendererModules = new Set<ModuleType>([
  // grows every task
]);

legacyExporterAllowed = new Set<ModuleType>([
  // shrinks every task
]);
```

Rule:

- A module can be in legacy only before its migration task starts.
- Once migrated, preview and export must both use the shared ModuleView.
- A migrated module must not call its old `generate*HTML` exporter.
- Old exporter files can remain until all modules in that group are migrated, then delete them in cleanup tasks.

## Phase A：Foundation

### Task A1：Create Shared Renderer Types

**Goal:** Add the typed render contract used by every module.

**Files:**

- Create `modules/renderers/types.ts`
- Modify `lib/modules/moduleRegistry.ts`
- Modify `package.json`
- Create `scripts/verify-shared-module-renderers.mjs`

**Acceptance:**

- `ModuleRenderMode = 'builder' | 'preview' | 'export'`.
- `ModuleViewProps<T>` includes `module`, `data`, `mode`, `modules`.
- `moduleRegistry` can store either `component` or temporary `renderExport`.
- `npm run verify:shared-module-renderers` exists and passes.
- Existing `npm run verify:module-export-parity` still passes.

### Task A2：Create Shared Primitives

**Goal:** Centralize markup that currently repeats across preview and export.

**Files:**

- Create `modules/renderers/shared/SectionShell.tsx`
- Create `modules/renderers/shared/ModuleHead.tsx`
- Create `modules/renderers/shared/NexoraButton.tsx`
- Create `modules/renderers/shared/NexoraPicture.tsx`
- Create `modules/renderers/shared/ProductCardView.tsx`
- Create `modules/renderers/shared/index.ts`
- Create `scripts/verify-shared-render-primitives.mjs`

**Acceptance:**

- Shared primitives do not import `useDevice`.
- Shared primitives do not import editor-only components.
- Shared primitives output `.cb-*` classes only.
- `NexoraPicture` supports `image`, `mobileImage`, `alt`, `className`.
- `ProductCardView` supports product badges, sale tags, image, price, and link.

### Task A3：Add Static Render Path

**Goal:** Allow export to render React ModuleViews to HTML.

**Files:**

- Create `lib/export/renderStaticModule.tsx`
- Modify `lib/export/htmlGenerator.ts`
- Create `scripts/verify-static-module-rendering.mjs`

**Acceptance:**

- Static rendering uses `renderToStaticMarkup`.
- Migrated module output is wrapped in the same root class as preview.
- Non-migrated modules continue using current exporter path.
- Builder-only classes are not emitted in export mode.

### Task A4：Add CSS Fragment Collector

**Goal:** Start moving module CSS out of `cssGenerator.ts`.

**Files:**

- Create `lib/export/moduleCssCollector.ts`
- Create `modules/renderers/baseCss.ts`
- Modify `lib/export/cssGenerator.ts`
- Create `scripts/verify-module-css-fragments.mjs`

**Acceptance:**

- Base reset/layout CSS still exports.
- Migrated modules can provide scoped CSS fragments.
- CSS collector dedupes fragments by module type.
- Generic selectors `.title`, `.image`, `.button`, `.container` remain forbidden.

## Phase B：Product Modules First

Product modules are highest risk because they have the most style variants and are used by 快速建立.

### Task B1：Migrate `product-features`

**Files:**

- Create `modules/renderers/product/ProductFeaturesView.tsx`
- Create `modules/renderers/product/productFeaturesCss.ts`
- Modify `modules/preview/ProductFeaturesPreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`
- Modify `scripts/verify-product-export-parity.mjs`
- Modify `scripts/verify-product-style-distinction.mjs`

**Acceptance:**

- `grid-4`, `grid-6`, `icon-text`, `cards` use one component.
- Export no longer calls `generateProductFeaturesHTML`.
- Icon-text keeps icon + content wrapper in both preview and export.
- Mobile one-column behavior remains.

### Task B2：Migrate `product-showcase`

**Files:**

- Create `modules/renderers/product/ProductShowcaseView.tsx`
- Create `modules/renderers/product/productShowcaseCss.ts`
- Modify `modules/preview/ProductShowcasePreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`
- Modify `scripts/verify-product-export-hotfixes.mjs`
- Modify `scripts/verify-product-page-visual-upgrade.mjs`

**Acceptance:**

- `spacious`, `split`, `luxury` use one component.
- `full-bleed` legacy data still normalizes to `spacious`.
- Split text card has padding, rounded corners, and no edge-sticking.
- Spacious media is constrained and not oversized.
- Export no longer calls `generateProductShowcaseHTML`.

### Task B3：Migrate `product-scenes`

**Files:**

- Create `modules/renderers/product/ProductScenesView.tsx`
- Create `modules/renderers/product/productScenesCss.ts`
- Modify `modules/preview/ProductScenesPreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`
- Modify `scripts/verify-product-style-distinction.mjs`

**Acceptance:**

- `left-image`, `right-image`, `full-bleed`, `double-image` use one component.
- `right-image` order matches preview and export.
- `double-image` displays the same item count in preview and export.
- Mobile always stacks cleanly.

### Task B4：Migrate `product-info`

**Files:**

- Create `modules/renderers/product/ProductInfoView.tsx`
- Create `modules/renderers/product/productInfoCss.ts`
- Modify `modules/preview/ProductInfoPreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`
- Modify `scripts/verify-product-style-distinction.mjs`

**Acceptance:**

- `ingredients`, `technology`, `specs`, `contents` use one component.
- Each style has a visibly different layout.
- Mobile does not overflow.
- Export no longer calls `generateProductInfoHTML`.

### Task B5：Migrate `product-benefits`

**Files:**

- Create `modules/renderers/product/ProductBenefitsView.tsx`
- Create `modules/renderers/product/productBenefitsCss.ts`
- Modify `modules/preview/ProductAdvancedPreview.tsx`
- Modify `modules/exporters/productAdvancedExporter.ts`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- `metric-cards`, `pain-solution`, `stacked` use one component.
- Stacked layout does not split metric/title/body into mismatched grid children.
- Export no longer calls `generateProductBenefitsHTML`.

### Task B6：Migrate `product-steps`

**Files:**

- Create `modules/renderers/product/ProductStepsView.tsx`
- Create `modules/renderers/product/productStepsCss.ts`
- Modify `modules/preview/ProductAdvancedPreview.tsx`
- Modify `modules/exporters/productAdvancedExporter.ts`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- `numbered`, `timeline`, `image-cards` use one component.
- Timeline line is decorative only and disappears on mobile.
- Image-cards image size matches preview/export.
- Export no longer calls `generateProductStepsHTML`.

### Task B7：Migrate `product-comparison`

**Files:**

- Create `modules/renderers/product/ProductComparisonView.tsx`
- Create `modules/renderers/product/productComparisonCss.ts`
- Modify `modules/preview/ProductAdvancedPreview.tsx`
- Modify `modules/exporters/productAdvancedExporter.ts`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- `before-after` and `product-table` use one component.
- Mobile cells show `一般商品` and `使用本商品` through `data-label`.
- Export no longer calls `generateProductComparisonHTML`.

### Task B8：Migrate `product-proof`

**Files:**

- Create `modules/renderers/product/ProductProofView.tsx`
- Create `modules/renderers/product/productProofCss.ts`
- Modify `modules/preview/ProductAdvancedPreview.tsx`
- Modify `modules/exporters/productAdvancedExporter.ts`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- `reviews`, `guarantee`, `certifications` use one component.
- Three styles remain visibly distinct.
- Export no longer calls `generateProductProofHTML`.

### Task B9：Migrate `product-purchase`

**Files:**

- Create `modules/renderers/product/ProductPurchaseView.tsx`
- Create `modules/renderers/product/productPurchaseCss.ts`
- Modify `modules/preview/ProductAdvancedPreview.tsx`
- Modify `modules/exporters/productAdvancedExporter.ts`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- `cta`, `bundle`, `related` use one component.
- Bundle preview/export both render exactly first 3 products.
- Related preview/export both render compact cards.
- Export no longer calls `generateProductPurchaseHTML`.

## Phase C：Campaign Modules

### Task C1：Migrate Product Card Shared Usage

**Files:**

- Modify `modules/renderers/shared/ProductCardView.tsx`
- Modify `modules/preview/ProductGridPreview.tsx`
- Modify `modules/preview/ProductCarouselPreview.tsx`
- Modify `modules/preview/BannerProductsPreview.tsx`
- Modify `modules/preview/ProductBannerPreview.tsx`
- Modify `modules/exporters/productGridExporter.ts`
- Modify `modules/exporters/productCarouselExporter.ts`
- Modify `modules/exporters/bannerProductsExporter.ts`
- Modify `modules/exporters/productBannerExporter.ts`

**Acceptance:**

- All campaign product cards share the same image, badge, special tag, price, and button markup.
- Sale tag and limited tag layout is consistent.
- Product image stays 1:1 without crop unless explicitly designed.

### Task C2：Migrate `product-grid`

**Files:**

- Create `modules/renderers/campaign/ProductGridView.tsx`
- Create `modules/renderers/campaign/productGridCss.ts`
- Modify `modules/preview/ProductGridPreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- Product list preview/export use same component.
- Desktop/tablet/mobile columns match.
- Export no longer calls `generateProductGridHTML`.

### Task C3：Migrate `product-carousel`

**Files:**

- Create `modules/renderers/campaign/ProductCarouselView.tsx`
- Create `modules/renderers/campaign/productCarouselCss.ts`
- Modify `modules/preview/ProductCarouselPreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- Carousel card markup matches product-grid card markup.
- JS behavior still initializes in export.
- Export no longer calls `generateProductCarouselHTML`.

### Task C4：Migrate `banner-products`

**Files:**

- Create `modules/renderers/campaign/BannerProductsView.tsx`
- Create `modules/renderers/campaign/bannerProductsCss.ts`
- Modify `modules/preview/BannerProductsPreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- 2/3/4 product versions keep exact product count.
- Desktop banner width logic remains by product count.
- Mobile banner + products stack correctly.
- Export no longer calls `generateBannerProductsHTML`.

### Task C5：Migrate `product-banner`

**Files:**

- Create `modules/renderers/campaign/ProductBannerView.tsx`
- Create `modules/renderers/campaign/productBannerCss.ts`
- Modify `modules/preview/ProductBannerPreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- S/M/L image ratios match existing specs.
- Mobile always image first, text second.
- Export no longer calls `generateProductBannerHTML`.

### Task C6：Migrate `bank-promo`

**Files:**

- Create `modules/renderers/campaign/BankPromoView.tsx`
- Create `modules/renderers/campaign/bankPromoCss.ts`
- Modify `modules/preview/BankPromoPreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- Bank card count and grid match preview/export.
- Logo sizing remains fixed and uncropped.
- Export no longer calls `generateBankPromoHTML`.

## Phase D：General Modules

### Task D1：Migrate `hero`

**Files:**

- Create `modules/renderers/general/HeroView.tsx`
- Create `modules/renderers/general/heroCss.ts`
- Modify `modules/preview/HeroPreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- KV black gradient overlay is not reintroduced.
- Pure banner still supports external link.
- Text-on-image and image-only states use same component.
- Export no longer calls `generateHeroHTML`.

### Task D2：Migrate `hero-carousel`

**Files:**

- Create `modules/renderers/general/HeroCarouselView.tsx`
- Create `modules/renderers/general/heroCarouselCss.ts`
- Modify `modules/preview/HeroCarouselPreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- Slides use same markup in preview/export.
- Image-only slides still clickable.
- Carousel JS still binds to exported markup.
- Export no longer calls `generateHeroCarouselHTML`.

### Task D3：Migrate `title`

**Files:**

- Create `modules/renderers/general/TitleView.tsx`
- Create `modules/renderers/general/titleCss.ts`
- Modify `modules/preview/TitlePreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- Alignment left/center/right matches preview/export.
- Vertical spacing stays compact.
- Export no longer calls `generateTitleHTML`.

### Task D4：Migrate `anchor-nav`

**Files:**

- Create `modules/renderers/general/AnchorNavView.tsx`
- Create `modules/renderers/general/anchorNavCss.ts`
- Modify `modules/preview/AnchorNavPreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- Hidden targets are respected.
- Buttons center on second row.
- Button color and text color match export.
- Export no longer calls `generateAnchorNavHTML`.

### Task D5：Migrate `split-section`

**Files:**

- Create `modules/renderers/general/SplitSectionView.tsx`
- Create `modules/renderers/general/splitSectionCss.ts`
- Modify `modules/preview/SplitSectionPreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- Reverse order only affects desktop.
- Mobile remains image above text.
- CTA button width matches text content.
- Export no longer calls `generateSplitSectionHTML`.

### Task D6：Migrate Article Modules

**Files:**

- Create `modules/renderers/general/ArticleTextView.tsx`
- Create `modules/renderers/general/ArticleImageView.tsx`
- Create `modules/renderers/general/articleCss.ts`
- Modify `modules/preview/ArticleTextPreview.tsx`
- Modify `modules/preview/ArticleImagePreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- Article text alignment affects title and body consistently.
- Article image left/right/top positions match preview/export.
- Mobile spacing between image and text is not oversized.
- Export no longer calls `generateArticleTextHTML` or `generateArticleImageHTML`.

### Task D7：Migrate Utility General Modules

**Files:**

- Create `modules/renderers/general/FaqView.tsx`
- Create `modules/renderers/general/LogoWallView.tsx`
- Create `modules/renderers/general/CtaView.tsx`
- Create `modules/renderers/general/StickySidebarView.tsx`
- Create `modules/renderers/general/utilityCss.ts`
- Modify `modules/preview/FaqPreview.tsx`
- Modify `modules/preview/LogoWallPreview.tsx`
- Modify `modules/preview/CtaPreview.tsx`
- Modify `modules/preview/StickySidebarPreview.tsx`
- Modify `lib/modules/moduleRegistry.ts`

**Acceptance:**

- FAQ details still open in exported HTML.
- Logo Wall does not crop or add grayscale filter.
- CTA button defaults to dark background and white text unless set.
- Sticky sidebar does not affect layout flow.
- Export no longer calls the legacy utility exporters.

## Phase E：Cleanup And Enforcement

### Task E1：Delete Legacy Exporters

**Files:**

- Delete migrated files in `modules/exporters/*`
- Modify `lib/modules/moduleRegistry.ts`
- Modify `scripts/verify-module-export-parity.mjs`
- Modify `scripts/verify-shared-module-renderers.mjs`

**Acceptance:**

- `legacyExporterAllowed` is empty.
- `lib/modules/moduleRegistry.ts` has no imports from `modules/exporters/*`.
- `lib/export/htmlGenerator.ts` only uses static React rendering for modules.

### Task E2：Split `cssGenerator.ts`

**Files:**

- Modify `lib/export/cssGenerator.ts`
- Modify all `modules/renderers/**/*.ts`
- Modify `lib/export/moduleCssCollector.ts`
- Modify `scripts/verify-module-css-fragments.mjs`

**Acceptance:**

- `cssGenerator.ts` owns only base reset, page settings, and collector call.
- Module CSS lives beside its ModuleView.
- No module CSS fragment uses generic selectors.

### Task E3：Update Docs And Architecture Diagram

**Files:**

- Modify `docs/module-rendering-export-architecture.md`
- Modify `docs/module-development-standard.md`
- Modify `docs/site-architecture.md`
- Modify `docs/module-taxonomy.md`

**Acceptance:**

- Docs state shared renderer is complete.
- Docs explain how to add a new module using ModuleView + CSS fragment.
- Docs include the final registry flow.

### Task E4：Final Full Verification

**Commands:**

```bash
npm run verify:module-export-parity
npm run verify:shared-module-renderers
npm run verify:module-css-fragments
npm run verify:full-module-export-stability
npm run verify:module-rendering-architecture
npm run verify:product-export-parity
npm run verify:product-style-distinction
npm run verify:product-page-visual-upgrade
npm run verify:general-campaign-visual-upgrade
npm run verify:cms-consistency
npm run verify:visual-safety
npm run verify:export-preflight
npm run typecheck
npm run build
```

**Acceptance:**

- All commands pass.
- Exported HTML opens standalone.
- Existing saved project data still loads.
- ZIP export still places uploaded images under `images/`.

## Execution Order

1. Phase A：Foundation.
2. Phase B：Product modules.
3. Phase C：Campaign modules.
4. Phase D：General modules.
5. Phase E：Cleanup.

## Commit Strategy

Use one commit per task or per small task group:

- `refactor: add shared module renderer foundation`
- `refactor: migrate product features renderer`
- `refactor: migrate product showcase renderer`
- `refactor: migrate product advanced renderers`
- `refactor: migrate campaign product renderers`
- `refactor: migrate general renderers`
- `refactor: remove legacy module exporters`
- `docs: update shared module rendering architecture`

## Risk Controls

- Do not migrate more than one module family before running targeted verification.
- Keep legacy exporters until the matching shared ModuleView passes preview/export verification.
- If a module fails export parity, stop that task and fix the shared component before moving to the next module.
- Do not merge to main until Phase E verification passes.

## Current Starting State

- Branch: `codex/phase-2-3-module-rendering`.
- Current guardrails already exist:
  - `verify:module-export-parity`
  - `verify:product-export-parity`
  - `verify:product-style-distinction`
  - `verify:full-module-export-stability`
- Untracked folders `output/` and `tmp/` are local artifacts and should not be committed.
