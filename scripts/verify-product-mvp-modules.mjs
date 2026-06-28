import { readFileSync, existsSync } from 'node:fs';

const requiredFiles = [
  'modules/forms/ProductFeaturesForm.tsx',
  'modules/forms/ProductShowcaseForm.tsx',
  'modules/forms/ProductScenesForm.tsx',
  'modules/forms/ProductInfoForm.tsx',
  'modules/preview/ProductFeaturesPreview.tsx',
  'modules/preview/ProductShowcasePreview.tsx',
  'modules/preview/ProductScenesPreview.tsx',
  'modules/preview/ProductInfoPreview.tsx',
  'modules/exporters/productFeaturesExporter.ts',
  'modules/exporters/productShowcaseExporter.ts',
  'modules/exporters/productScenesExporter.ts',
  'modules/exporters/productInfoExporter.ts',
];

for (const file of requiredFiles) {
  if (!existsSync(file)) throw new Error(`Missing product MVP module file: ${file}`);
}

const types = readFileSync('types/modules.ts', 'utf8');
const schemas = readFileSync('data/moduleSchemas.ts', 'utf8');
const forms = readFileSync('modules/forms/FormRenderer.tsx', 'utf8');
const previews = readFileSync('modules/preview/ModulePreviewRenderer.tsx', 'utf8');
const html = readFileSync('lib/export/htmlGenerator.ts', 'utf8');
const css = readFileSync('lib/export/cssGenerator.ts', 'utf8');
const taxonomy = readFileSync('docs/module-taxonomy.md', 'utf8');

[
  'product-features',
  'product-showcase',
  'product-scenes',
  'product-info',
].forEach((type) => {
  if (!types.includes(`'${type}'`)) throw new Error(`Module type missing: ${type}`);
  if (!schemas.includes(`type: '${type}'`)) throw new Error(`Schema missing: ${type}`);
  if (!forms.includes(`case '${type}'`)) throw new Error(`Form renderer missing: ${type}`);
  if (!previews.includes(`case '${type}'`)) throw new Error(`Preview renderer missing: ${type}`);
  if (!html.includes(`case '${type}'`)) throw new Error(`HTML exporter missing: ${type}`);
});

[
  '商品特色',
  '大圖展示',
  '商品情境',
  '商品資訊',
  '四宮格',
  '精品風',
  '雙圖情境',
  '商品規格',
].forEach((token) => {
  if (!schemas.includes(token) && !taxonomy.includes(token)) {
    throw new Error(`Product MVP taxonomy token missing: ${token}`);
  }
});

[
  '.cb-product-features',
  '.cb-product-showcase',
  '.cb-product-scenes',
  '.cb-product-info',
].forEach((selector) => {
  if (!css.includes(selector)) throw new Error(`CSS selector missing: ${selector}`);
});

console.log('Product MVP modules verification passed.');
