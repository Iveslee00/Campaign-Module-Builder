import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const imageSpecs = read('lib/assets/imageSpecs.ts');
const moduleLibrary = read('components/editor/ModuleLibrary.tsx');
const cssGenerator = read('lib/export/cssGenerator.ts');
const sizeSpecTable = read('lib/assets/sizeSpecTable.ts');
const previewCanvas = read('components/editor/PreviewCanvas.tsx');
const previewModal = read('components/editor/PreviewModal.tsx');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(
  imageSpecs.includes('pageBackground: { width: 1920, height: 1200 }'),
  'IMAGE_SPECS should define pageBackground as 1920 x 1200.'
);

assert(
  moduleLibrary.includes('ImageField') && moduleLibrary.includes('IMAGE_SPECS.pageBackground'),
  'Global settings should use ImageField with IMAGE_SPECS.pageBackground.'
);

assert(
  moduleLibrary.includes('M 版使用同一張 PC 背景圖置中裁切'),
  'Global settings should explain mobile uses the PC background crop.'
);

assert(
  cssGenerator.includes('background-repeat: repeat-y') &&
    cssGenerator.includes('background-size: 100% auto') &&
    cssGenerator.includes('background-size: auto 100%'),
  'Generated CSS should support desktop repeat-y and mobile centered crop.'
);

assert(
  previewCanvas.includes("backgroundSize: isMobile ? 'auto 100%' : '100% auto'") &&
    previewModal.includes("backgroundSize: isMobile ? 'auto 100%' : '100% auto'"),
  'Editor preview and modal preview should match background crop behavior.'
);

assert(
  sizeSpecTable.includes('背景圖（repeat-y）') &&
    sizeSpecTable.includes('1920 x 1200') &&
    sizeSpecTable.includes('使用 PC 圖置中裁切'),
  'Size spec table should document global background image specs.'
);

console.log('Global background upload/spec verification passed.');
