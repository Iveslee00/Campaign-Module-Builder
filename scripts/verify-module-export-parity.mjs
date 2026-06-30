import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const types = read('types/modules.ts');
const previewRenderer = read('modules/preview/ModulePreviewRenderer.tsx');
const registry = read('lib/modules/moduleRegistry.ts');
const css = read('lib/export/cssGenerator.ts');

const moduleTypeBlock = types.match(/export type ModuleType =([\s\S]*?);/);
assert(moduleTypeBlock, 'ModuleType union should be readable');
const moduleTypes = [...moduleTypeBlock[1].matchAll(/\|\s*'([^']+)'/g)].map((match) => match[1]);

const contracts = {
  'title': { preview: 'modules/preview/TitlePreview.tsx', exporter: 'modules/exporters/titleExporter.ts', root: 'cb-title-block' },
  'hero': { preview: 'modules/preview/HeroPreview.tsx', exporter: 'modules/exporters/heroExporter.ts', root: 'cb-hero' },
  'split-section': { preview: 'modules/preview/SplitSectionPreview.tsx', exporter: 'modules/exporters/splitSectionExporter.ts', root: 'cb-split' },
  'product-grid': { preview: 'modules/preview/ProductGridPreview.tsx', exporter: 'modules/exporters/productGridExporter.ts', root: 'cb-products' },
  'banner-products': { preview: 'modules/preview/BannerProductsPreview.tsx', exporter: 'modules/exporters/bannerProductsExporter.ts', root: 'cb-banner-products' },
  'product-banner': { preview: 'modules/preview/ProductBannerPreview.tsx', exporter: 'modules/exporters/productBannerExporter.ts', root: 'cb-product-banner' },
  'product-carousel': { preview: 'modules/preview/ProductCarouselPreview.tsx', exporter: 'modules/exporters/productCarouselExporter.ts', root: 'cb-carousel' },
  'logo-wall': { preview: 'modules/preview/LogoWallPreview.tsx', exporter: 'modules/exporters/logoWallExporter.ts', root: 'cb-logo-wall' },
  'cta': { preview: 'modules/preview/CtaPreview.tsx', exporter: 'modules/exporters/ctaExporter.ts', root: 'cb-cta' },
  'faq': { preview: 'modules/preview/FaqPreview.tsx', exporter: 'modules/exporters/faqExporter.ts', root: 'cb-faq' },
  'sticky-sidebar': { preview: 'modules/preview/StickySidebarPreview.tsx', exporter: 'modules/exporters/stickySidebarExporter.ts', root: 'cb-sticky-sidebar' },
  'article-text': { preview: 'modules/preview/ArticleTextPreview.tsx', exporter: 'modules/exporters/articleTextExporter.ts', root: 'cb-article-text' },
  'article-image': { preview: 'modules/preview/ArticleImagePreview.tsx', exporter: 'modules/exporters/articleImageExporter.ts', root: 'cb-article-image' },
  'hero-carousel': { preview: 'modules/preview/HeroCarouselPreview.tsx', exporter: 'modules/exporters/heroCarouselExporter.ts', root: 'cb-kv' },
  'bank-promo': { preview: 'modules/preview/BankPromoPreview.tsx', exporter: 'modules/exporters/bankPromoExporter.ts', root: 'cb-bank-promo' },
  'anchor-nav': { preview: 'modules/preview/AnchorNavPreview.tsx', exporter: 'modules/exporters/anchorNavExporter.ts', root: 'cb-anchor-nav' },
  'product-features': { preview: 'modules/preview/ProductFeaturesPreview.tsx', exporter: 'modules/exporters/productFeaturesExporter.ts', root: 'cb-product-features' },
  'product-showcase': { preview: 'modules/preview/ProductShowcasePreview.tsx', exporter: 'modules/exporters/productShowcaseExporter.ts', root: 'cb-product-showcase' },
  'product-scenes': { preview: 'modules/preview/ProductScenesPreview.tsx', exporter: 'modules/exporters/productScenesExporter.ts', root: 'cb-product-scenes' },
  'product-info': { preview: 'modules/preview/ProductInfoPreview.tsx', exporter: 'modules/exporters/productInfoExporter.ts', root: 'cb-product-info' },
  'product-benefits': { preview: 'modules/preview/ProductAdvancedPreview.tsx', exporter: 'modules/exporters/productAdvancedExporter.ts', root: 'cb-product-benefits' },
  'product-steps': { preview: 'modules/preview/ProductAdvancedPreview.tsx', exporter: 'modules/exporters/productAdvancedExporter.ts', root: 'cb-product-steps' },
  'product-comparison': { preview: 'modules/preview/ProductAdvancedPreview.tsx', exporter: 'modules/exporters/productAdvancedExporter.ts', root: 'cb-product-comparison' },
  'product-proof': { preview: 'modules/preview/ProductAdvancedPreview.tsx', exporter: 'modules/exporters/productAdvancedExporter.ts', root: 'cb-product-proof' },
  'product-purchase': { preview: 'modules/preview/ProductAdvancedPreview.tsx', exporter: 'modules/exporters/productAdvancedExporter.ts', root: 'cb-product-purchase' },
};

for (const type of moduleTypes) {
  const contract = contracts[type];
  assert(contract, `Missing module export parity contract for ${type}`);

  const preview = read(contract.preview);
  const exporter = read(contract.exporter);
  const rootSelector = `.${contract.root}`;

  assert(previewRenderer.includes(`'${type}'`), `Preview renderer missing ${type}`);
  assert(registry.includes(`'${type}'`), `Module registry missing ${type}`);
  assert(preview.includes('export function'), `Preview file for ${type} should export a React component`);
  assert(exporter.includes(contract.root), `Exporter for ${type} should output root class ${contract.root}`);
  assert(css.includes(rootSelector), `Export CSS for ${type} should include root selector ${rootSelector}`);
}

const productFeaturesExporter = read(contracts['product-features'].exporter);
assert(
  productFeaturesExporter.includes('cb-product-features__content'),
  'Product features exporter should wrap title and text in .cb-product-features__content to match preview DOM'
);
assert(
  productFeaturesExporter.indexOf('cb-product-features__icon') < productFeaturesExporter.indexOf('cb-product-features__content'),
  'Product features exporter should render icon before content wrapper'
);
assert(
  css.includes('.cb-product-features--icon-text .cb-product-features__item') &&
    css.includes('grid-template-columns: 52px 1fr'),
  'Product features icon-text CSS should use icon + content columns'
);
assert(
  css.includes('.cb-product-features--icon-text .cb-product-features__icon') &&
    css.includes('margin-bottom: 0'),
  'Product features icon-text CSS should remove icon bottom margin'
);
assert(css.includes('.cb-product-features__content'), 'Product features CSS should include content wrapper scope');

const heroCssStart = css.indexOf('.cb-hero {');
const splitCssStart = css.indexOf('/* ------------------------------------------------------------\n   5. SPLIT CONTENT MODULE');
assert(heroCssStart >= 0 && splitCssStart > heroCssStart, 'Hero export CSS block should be readable');
const heroCss = css.slice(heroCssStart, splitCssStart);
assert(!heroCss.includes('.cb-hero__media::after'), 'KV export CSS should not reintroduce a media overlay pseudo-element');
assert(!/rgba\(0,\s*0,\s*0,\s*0\.[3-9]\)/.test(heroCss), 'KV export CSS should not include a dark black overlay');

assert(
  css.includes('.cb-product-showcase--split .cb-product-showcase__content') &&
    css.includes('padding: 36px 38px') &&
    css.includes('border-radius: 32px'),
  'Product showcase split export should use a padded rounded text card'
);
assert(
  css.includes('.cb-product-showcase--spacious .cb-product-showcase__media { width: min(680px, 100%)'),
  'Product showcase spacious export should constrain image width'
);

const productAdvancedExporter = read(contracts['product-purchase'].exporter);
assert(
  productAdvancedExporter.includes("data.style === 'bundle' ? data.products.slice(0, 3)"),
  'Product purchase bundle exporter should only render three bundle cards'
);
assert(
  css.includes('.cb-product-purchase--bundle .cb-product-purchase__grid { grid-template-columns: repeat(3'),
  'Product purchase bundle export CSS should use three desktop columns'
);

const genericClassRegex = /(^|\n)\s*\.(title|image|button|container)\b/;
assert(!genericClassRegex.test(css), 'Export CSS should not define generic .title/.image/.button/.container classes');

console.log('Module export parity verified for all modules.');
