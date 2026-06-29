import { readFileSync } from 'node:fs';

const files = {
  featuresForm: readFileSync('modules/forms/ProductFeaturesForm.tsx', 'utf8'),
  showcaseForm: readFileSync('modules/forms/ProductShowcaseForm.tsx', 'utf8'),
  infoForm: readFileSync('modules/forms/ProductInfoForm.tsx', 'utf8'),
  advancedForms: readFileSync('modules/forms/ProductAdvancedForms.tsx', 'utf8'),
  advancedPreview: readFileSync('modules/preview/ProductAdvancedPreview.tsx', 'utf8'),
  advancedExporter: readFileSync('modules/exporters/productAdvancedExporter.ts', 'utf8'),
  infoPreview: readFileSync('modules/preview/ProductInfoPreview.tsx', 'utf8'),
  infoExporter: readFileSync('modules/exporters/productInfoExporter.ts', 'utf8'),
  featuresPreview: readFileSync('modules/preview/ProductFeaturesPreview.tsx', 'utf8'),
  css: readFileSync('lib/export/cssGenerator.ts', 'utf8'),
};

const required = [
  [files.featuresForm, '四宮格：適合 4 個核心特色', 'features form should explain grid-4 usage'],
  [files.featuresForm, '卡片式：適合較長文字', 'features form should explain cards usage'],
  [files.showcaseForm, '左右分欄：電商資訊導購', 'showcase form should explain split usage'],
  [files.showcaseForm, '精品展示：玻璃文字卡', 'showcase form should explain luxury usage'],
  [files.infoForm, '成分：用 3 欄重點卡呈現', 'info form should explain ingredients usage'],
  [files.infoForm, '技術：用深色科技感規格板呈現', 'info form should explain technology usage'],
  [files.infoForm, '規格：標準 key-value 表格', 'info form should explain specs usage'],
  [files.infoForm, '內容物：用包裝清單呈現', 'info form should explain contents usage'],
  [files.advancedForms, '推薦組合：主推成套購買', 'purchase form should explain bundle usage'],
  [files.advancedForms, '相關商品：同系列延伸推薦', 'purchase form should explain related usage'],
  [files.advancedPreview, '一般商品', 'mobile comparison preview should expose before column title'],
  [files.advancedPreview, '使用本商品', 'mobile comparison preview should expose after column title'],
  [files.advancedExporter, 'data-label=', 'comparison export should add mobile data labels'],
  [files.css, '.cb-product-comparison__cell::before', 'comparison mobile CSS should display data labels'],
  [files.advancedPreview, 'reviewStars', 'reviews proof style should be visually distinct'],
  [files.advancedPreview, 'guaranteeSeal', 'guarantee proof style should be visually distinct'],
  [files.advancedPreview, 'certificationGrid', 'certification proof style should be visually distinct'],
  [files.css, '.cb-product-proof--certifications', 'certification proof CSS should be distinct'],
  [files.advancedPreview, 'bundleHeroCard', 'bundle purchase style should be visually distinct'],
  [files.advancedPreview, 'relatedCompactCard', 'related purchase style should be visually distinct'],
  [files.css, '.cb-product-purchase--bundle', 'bundle purchase CSS should be distinct'],
  [files.css, '.cb-product-purchase--related', 'related purchase CSS should be distinct'],
  [files.css, '.cb-product-showcase--luxury .cb-product-showcase__content', 'luxury showcase should not reuse split layout'],
  [files.css, 'position: absolute; left: 24px; top: 50%', 'luxury showcase should use a floating content card'],
  [files.css, '.cb-product-info--contents .cb-product-info__table { counter-reset: cb-contents; }', 'contents info should use numbered package list'],
  [files.css, '.cb-product-features--cards .cb-product-features__grid { grid-template-columns: repeat(2', 'feature cards should not reuse four-column grid'],
];

for (const [source, token, message] of required) {
  if (!source.includes(token)) {
    throw new Error(message);
  }
}

console.log('Product style distinction verification passed.');
