import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const helper = readFileSync('modules/exporters/productCardLabels.ts', 'utf8');
assert.match(helper, /cb-product-card__labels/);
assert.match(helper, /cb-product-card__label--badge/);
assert.match(helper, /cb-product-card__label--special/);
assert.ok(
  helper.indexOf('product.showBadge') < helper.indexOf('product.showSpecialTag'),
  'badge should be declared before special tag so stacked labels render in the requested order',
);
assert.match(helper, /return labels\.length \?[\s\S]+: '';/);

const removedBodyTagSources = [
  'modules/exporters/productGridExporter.ts',
  'modules/exporters/productCarouselExporter.ts',
  'modules/exporters/bannerProductsExporter.ts',
  'modules/preview/ProductGridPreview.tsx',
  'modules/preview/ProductCarouselPreview.tsx',
  'modules/preview/BannerProductsPreview.tsx',
];

for (const file of removedBodyTagSources) {
  const source = readFileSync(file, 'utf8');
  assert.doesNotMatch(source, /cb-product-card__special-tag|特標/, `${file} should not render body special tags`);
}

const css = readFileSync('lib/export/cssGenerator.ts', 'utf8');
assert.match(css, /cb-product-card__labels/);
assert.doesNotMatch(css, /cb-product-card__special-tag/);

console.log('product labels verified');
