import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const campaignSources = [
  'data/moduleSchemas.ts',
  'modules/forms/ProductGridForm.tsx',
  'modules/forms/ProductCarouselForm.tsx',
  'modules/forms/LogoWallForm.tsx',
];

for (const file of campaignSources) {
  const source = readFileSync(file, 'utf8');
  assert.equal(source.includes('placehold.co'), false, `${file} should not seed demo image URLs`);
}

const previewSources = [
  'modules/preview/HeroPreview.tsx',
  'modules/preview/HeroCarouselPreview.tsx',
  'modules/preview/SplitSectionPreview.tsx',
  'modules/preview/ProductGridPreview.tsx',
  'modules/preview/ProductCarouselPreview.tsx',
  'modules/preview/BannerProductsPreview.tsx',
  'modules/preview/ProductBannerPreview.tsx',
  'modules/preview/LogoWallPreview.tsx',
  'modules/preview/ArticleImagePreview.tsx',
];

for (const file of previewSources) {
  const source = readFileSync(file, 'utf8');
  assert.match(source, /PreviewImage|ImagePlaceholder/, `${file} should render generated placeholders`);
}

console.log('preview placeholders verified');
