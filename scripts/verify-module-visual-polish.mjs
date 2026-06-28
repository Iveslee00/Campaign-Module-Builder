import fs from 'node:fs';

const previewFiles = [
  'modules/preview/TitlePreview.tsx',
  'modules/preview/HeroPreview.tsx',
  'modules/preview/HeroCarouselPreview.tsx',
  'modules/preview/SplitSectionPreview.tsx',
  'modules/preview/ArticleTextPreview.tsx',
  'modules/preview/ArticleImagePreview.tsx',
  'modules/preview/FaqPreview.tsx',
  'modules/preview/LogoWallPreview.tsx',
  'modules/preview/AnchorNavPreview.tsx',
  'modules/preview/ProductGridPreview.tsx',
  'modules/preview/ProductCarouselPreview.tsx',
  'modules/preview/BannerProductsPreview.tsx',
  'modules/preview/ProductBannerPreview.tsx',
  'modules/preview/BankPromoPreview.tsx',
  'modules/preview/ProductFeaturesPreview.tsx',
  'modules/preview/ProductShowcasePreview.tsx',
  'modules/preview/ProductScenesPreview.tsx',
  'modules/preview/ProductInfoPreview.tsx',
  'modules/preview/ProductAdvancedPreview.tsx',
];

for (const file of previewFiles) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing preview module: ${file}`);
  }
}

const source = previewFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const css = fs.readFileSync('lib/export/cssGenerator.ts', 'utf8');

[
  'glassPanel',
  'premiumShadow',
  'softBorder',
  'moduleSurface',
  'productCardSurface',
  'hoverLift',
  'visualAccent',
].forEach((token) => {
  if (!source.includes(token)) {
    throw new Error(`Preview visual polish missing token: ${token}`);
  }
});

[
  '.cb-section',
  'backdrop-filter',
  'box-shadow: 0 22px 60px',
  'transition: transform 0.2s ease',
  'border: 1px solid rgba(15,23,42,0.08)',
  '.cb-product-card:hover',
  '.cb-faq__item:hover',
  '.cb-logo-wall__item',
  '.cb-bank-card:hover',
].forEach((token) => {
  if (!css.includes(token)) {
    throw new Error(`Export visual polish missing token: ${token}`);
  }
});

console.log('Module visual polish verification passed.');
