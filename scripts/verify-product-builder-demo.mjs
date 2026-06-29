import fs from 'node:fs';

const requiredFiles = [
  'lib/productBuilder/productPageBuilder.ts',
  'components/editor/ProductBuildModal.tsx',
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing product builder demo file: ${file}`);
  }
}

const builder = fs.readFileSync('lib/productBuilder/productPageBuilder.ts', 'utf8');
const modal = fs.readFileSync('components/editor/ProductBuildModal.tsx', 'utf8');
const page = fs.readFileSync('app/page.tsx', 'utf8');
const library = fs.readFileSync('components/editor/ModuleLibrary.tsx', 'utf8');

[
  'createProductLandingModules',
  'buildProductPageModules',
  'resolveProductPageRecipe',
  'freshClean',
  'luxury',
  'promo',
  'minimalCommerce',
  'product-showcase',
  'product-benefits',
  'product-features',
  'product-info',
  'product-purchase',
  'faq',
  'anchor-nav',
  'Quick Builder',
  '快速建立',
  '清潔用品',
  '美妝保養',
  '電商綜合',
].forEach((token) => {
  if (!builder.includes(token) && !modal.includes(token)) {
    throw new Error(`Product builder starter missing token: ${token}`);
  }
});

if (!page.includes('ProductBuildModal') || !page.includes('handleCreateFromProduct')) {
  throw new Error('Editor page does not wire the product builder modal.');
}

if (!library.includes('Product') || !library.includes('商品頁')) {
  throw new Error('Module library does not include the product page category.');
}

[
  "type: 'product-banner'",
  "type: 'split-section'",
  "type: 'article-text'",
  "type: 'product-grid'",
].forEach((legacyToken) => {
  if (builder.includes(legacyToken)) {
    throw new Error(`Product builder starter should not use campaign/content legacy module: ${legacyToken}`);
  }
});

console.log('Product builder starter verification passed.');
