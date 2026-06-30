import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const preview = read('modules/preview/ProductFeaturesPreview.tsx');
const exporter = read('modules/exporters/productFeaturesExporter.ts');
const css = read('lib/export/cssGenerator.ts');

assert(
  /{item\.icon}<\/div>\s*<div>\s*<h3[\s\S]*?<p/.test(preview),
  'Product features preview should wrap item title and text in a content block after the icon'
);

assert(
  exporter.includes('cb-product-features__content'),
  'Product features exporter should wrap title and text in .cb-product-features__content to match preview DOM'
);

assert(
  exporter.indexOf('cb-product-features__icon') < exporter.indexOf('cb-product-features__content'),
  'Product features exporter should render icon before content wrapper'
);

assert(
  css.includes('.cb-product-features--icon-text .cb-product-features__item') &&
    css.includes('grid-template-columns: 52px 1fr'),
  'Product features icon-text export CSS should use icon + content grid columns'
);

assert(
  css.includes('.cb-product-features--icon-text .cb-product-features__icon') &&
    css.includes('margin-bottom: 0'),
  'Product features icon-text export CSS should remove icon bottom margin'
);

assert(
  css.includes('.cb-product-features__content'),
  'Product features export CSS should include the content wrapper scope'
);

console.log('Product export parity verified.');
