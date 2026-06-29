import { readFileSync } from 'node:fs';

const files = {
  packageJson: readFileSync('package.json', 'utf8'),
  formField: readFileSync('components/ui/FormField.tsx', 'utf8'),
  formRenderer: readFileSync('modules/forms/FormRenderer.tsx', 'utf8'),
  heroForm: readFileSync('modules/forms/HeroForm.tsx', 'utf8'),
  heroCarouselForm: readFileSync('modules/forms/HeroCarouselForm.tsx', 'utf8'),
  productGridForm: readFileSync('modules/forms/ProductGridForm.tsx', 'utf8'),
  productCarouselForm: readFileSync('modules/forms/ProductCarouselForm.tsx', 'utf8'),
  bannerProductsForm: readFileSync('modules/forms/BannerProductsForm.tsx', 'utf8'),
  productBannerForm: readFileSync('modules/forms/ProductBannerForm.tsx', 'utf8'),
  productInfoForm: readFileSync('modules/forms/ProductInfoForm.tsx', 'utf8'),
  productAdvancedForms: readFileSync('modules/forms/ProductAdvancedForms.tsx', 'utf8'),
  inspectorIa: readFileSync('docs/builder-inspector-ia.md', 'utf8'),
  sprintSpec: readFileSync('docs/superpowers/specs/2026-06-30-builder-quality-sprint-design.md', 'utf8'),
};

const checks = [
  [files.packageJson, '"verify:builder-inspector-ia"', 'package.json should expose verify:builder-inspector-ia'],
  [files.formField, 'export function FormSection', 'FormField should export a reusable FormSection'],
  [files.formRenderer, 'FormSection title="進階設定"', 'FormRenderer should move anchor name into Advanced section'],
  [files.formRenderer, 'FormSection title="檢查"', 'FormRenderer should reserve a Check section shell'],
  [files.heroForm, 'FormSection title="內容"', 'HeroForm should group text fields as Content'],
  [files.heroForm, 'FormSection title="圖片"', 'HeroForm should group image fields as Images'],
  [files.heroForm, 'FormSection title="樣式"', 'HeroForm should group height/color as Style'],
  [files.heroForm, 'FormSection title="行動"', 'HeroForm should group link/button as Action'],
  [files.heroCarouselForm, 'FormSection title="內容"', 'HeroCarouselForm should group slide content'],
  [files.heroCarouselForm, 'FormSection title="圖片"', 'HeroCarouselForm should group slide images'],
  [files.productGridForm, 'FormSection title="內容"', 'ProductGridForm should group product copy'],
  [files.productCarouselForm, 'FormSection title="內容"', 'ProductCarouselForm should group product copy'],
  [files.bannerProductsForm, 'FormSection title="內容"', 'BannerProductsForm should group banner and product copy'],
  [files.bannerProductsForm, 'FormSection title="圖片"', 'BannerProductsForm should group banner images'],
  [files.productBannerForm, 'FormSection title="內容"', 'ProductBannerForm should group product highlight copy'],
  [files.productBannerForm, 'FormSection title="圖片"', 'ProductBannerForm should group product highlight images'],
  [files.productInfoForm, 'FormSection title="內容"', 'ProductInfoForm should group info rows'],
  [files.productInfoForm, 'FormSection title="樣式"', 'ProductInfoForm should group style controls'],
  [files.productAdvancedForms, 'FormSection title="內容"', 'ProductAdvancedForms should group shared section copy'],
  [files.productAdvancedForms, 'FormSection title="行動"', 'ProductPurchaseForm should group CTA fields'],
  [files.sprintSpec, 'Status：完成於 `docs/builder-inspector-ia.md`', 'Sprint spec should mark BQ-002 complete'],
];

for (const [source, token, message] of checks) {
  if (!source.includes(token)) {
    throw new Error(message);
  }
}

console.log('Builder inspector IA verification passed.');
