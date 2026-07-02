'use client';

import type React from 'react';
import { ModuleType, PageModule } from '@/types/modules';
import { SharedModuleView } from '@/modules/renderers/SharedModuleView';
import type { ModuleRuntimeMode } from '@/modules/renderers/types';

type PreviewRegistryRenderer = (module: PageModule, modules: PageModule[], runtimeMode: ModuleRuntimeMode) => React.ReactNode;

const renderSharedPreview: PreviewRegistryRenderer = (module, modules, runtimeMode) => (
  <SharedModuleView module={module} modules={modules} runtimeMode={runtimeMode} />
);

export const previewRegistry: Record<ModuleType, PreviewRegistryRenderer> = {
  'title': renderSharedPreview,
  'hero': renderSharedPreview,
  'split-section': renderSharedPreview,
  'product-grid': renderSharedPreview,
  'banner-products': renderSharedPreview,
  'product-banner': renderSharedPreview,
  'product-carousel': renderSharedPreview,
  'logo-wall': renderSharedPreview,
  'cta': renderSharedPreview,
  'faq': renderSharedPreview,
  'sticky-sidebar': renderSharedPreview,
  'article-text': renderSharedPreview,
  'article-image': renderSharedPreview,
  'hero-carousel': renderSharedPreview,
  'bank-promo': renderSharedPreview,
  'anchor-nav': renderSharedPreview,
  'product-features': renderSharedPreview,
  'product-showcase': renderSharedPreview,
  'product-scenes': renderSharedPreview,
  'product-info': renderSharedPreview,
  'product-benefits': renderSharedPreview,
  'product-steps': renderSharedPreview,
  'product-comparison': renderSharedPreview,
  'product-proof': renderSharedPreview,
  'product-purchase': renderSharedPreview,
};

export function ModulePreviewRenderer({
  module,
  modules = [],
  runtimeMode = 'canvas',
}: {
  module: PageModule;
  modules?: PageModule[];
  runtimeMode?: ModuleRuntimeMode;
}) {
  return previewRegistry[module.type]?.(module, modules, runtimeMode) ?? null;
}
