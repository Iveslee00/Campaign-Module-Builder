import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const pkg = JSON.parse(read('package.json'));
assert(
  pkg.scripts['verify:phase3-shared-modules'] === 'node --no-warnings scripts/verify-phase3-shared-modules.mjs',
  'package.json should expose verify:phase3-shared-modules'
);

const requiredFiles = [
  'modules/definitions/moduleDefinition.ts',
  'modules/definitions/highRiskModuleDefinitions.ts',
  'modules/definitions/imagePlaceholder.ts',
];

for (const file of requiredFiles) {
  assert(existsSync(file), `${file} should exist`);
}

const definitionTypes = read('modules/definitions/moduleDefinition.ts');
const highRiskDefinitions = read('modules/definitions/highRiskModuleDefinitions.ts');
const imagePlaceholder = read('modules/definitions/imagePlaceholder.ts');
const registry = read('lib/modules/moduleRegistry.ts');
const cssGenerator = read('lib/export/cssGenerator.ts');

assert(definitionTypes.includes('ModuleDefinition'), 'Module definition contract should exist');
assert(definitionTypes.includes('cssFragment'), 'Module definition should include a scoped cssFragment');
assert(imagePlaceholder.includes('renderImagePlaceholder'), 'Image placeholder renderer should exist');
assert(imagePlaceholder.includes('data-image-placeholder'), 'Image placeholder should expose a stable marker');
assert(imagePlaceholder.includes('width') && imagePlaceholder.includes('height'), 'Image placeholder should render dimensions');

const highRiskTypes = [
  'hero',
  'hero-carousel',
  'banner-products',
  'product-features',
  'product-showcase',
  'product-purchase',
];

for (const type of highRiskTypes) {
  assert(highRiskDefinitions.includes(`'${type}'`), `High-risk module definition missing ${type}`);
  assert(highRiskDefinitions.includes(`type: '${type}'`), `High-risk module definition should declare type ${type}`);
}

assert(registry.includes('getHighRiskModuleDefinition'), 'Module registry should read high-risk module definitions');
assert(registry.includes('renderHighRiskModuleHTML'), 'Module registry should render high-risk modules through definitions');
assert(cssGenerator.includes('getHighRiskModuleCssFragments'), 'Export CSS should append high-risk module scoped CSS fragments');

const exporters = {
  hero: read('modules/exporters/heroExporter.ts'),
  heroCarousel: read('modules/exporters/heroCarouselExporter.ts'),
  bannerProducts: read('modules/exporters/bannerProductsExporter.ts'),
  productShowcase: read('modules/exporters/productShowcaseExporter.ts'),
  productAdvanced: read('modules/exporters/productAdvancedExporter.ts'),
};

assert(exporters.hero.includes('renderImagePlaceholder') && exporters.hero.includes('getKvImageSpecs'), 'Hero exporter should restore size placeholder by KV spec');
assert(exporters.heroCarousel.includes('renderImagePlaceholder') && exporters.heroCarousel.includes('getKvImageSpecs'), 'Hero carousel exporter should restore size placeholder by KV spec');
assert(exporters.bannerProducts.includes('renderImagePlaceholder') && exporters.bannerProducts.includes('getBannerProductsImageSpecs'), 'Banner products exporter should restore banner/product size placeholders');
assert(exporters.productShowcase.includes('renderImagePlaceholder') && exporters.productShowcase.includes('productShowcase'), 'Product showcase exporter should restore image size placeholder');
assert(exporters.productAdvanced.includes('renderImagePlaceholder') && exporters.productAdvanced.includes('IMAGE_SPECS.product'), 'Product purchase exporter should restore product image size placeholder');

console.log('Phase 3 shared module definitions verified.');
