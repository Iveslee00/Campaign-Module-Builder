import { existsSync, readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const files = {
  builder: 'lib/productBuilder/productPageBuilder.ts',
  html: 'lib/export/htmlGenerator.ts',
  registry: 'lib/modules/moduleRegistry.ts',
  highRiskDefinitions: 'modules/definitions/highRiskModuleDefinitions.ts',
  css: 'lib/export/cssGenerator.ts',
  packageGenerator: 'lib/export/packageGenerator.ts',
  projectPackage: 'lib/projects/projectPackage.ts',
  sanitizer: 'lib/export/pasteCodeSanitizer.ts',
  exportModal: 'components/editor/ExportModal.tsx',
  localImageStore: 'lib/assets/localImageStore.ts',
};

Object.values(files).forEach((file) => {
  assert(existsSync(file), `Missing required file: ${file}`);
});

const builder = readFileSync(files.builder, 'utf8');
const html = readFileSync(files.html, 'utf8');
const registry = readFileSync(files.registry, 'utf8');
const highRiskDefinitions = readFileSync(files.highRiskDefinitions, 'utf8');
const css = readFileSync(files.css, 'utf8');
const packageGenerator = readFileSync(files.packageGenerator, 'utf8');
const projectPackage = readFileSync(files.projectPackage, 'utf8');
const sanitizer = readFileSync(files.sanitizer, 'utf8');
const exportModal = readFileSync(files.exportModal, 'utf8');
const localImageStore = readFileSync(files.localImageStore, 'utf8');

[
  "'cleaning'",
  "'beauty'",
  "'ecommerce'",
  'mainImage: string;',
  'mobileImage: string;',
  'backgroundImage: string;',
  'buildProductPageModules',
  'defaultInputForIndustry',
  'input.backgroundImage || input.mainImage',
  'image: input.mainImage',
  'mobileImage: input.mobileImage || input.mainImage',
].forEach((token) => {
  assert(builder.includes(token), `Product Starter builder missing export/image token: ${token}`);
});

[
  "from '@/lib/modules/moduleRegistry'",
  'renderModuleExportHTML',
].forEach((token) => {
  assert(html.includes(token), `HTML exporter should route through module registry: ${token}`);
});

[
  'generateProductScenesHTML',
  'generateProductInfoHTML',
  'generateProductBenefitsHTML',
  'generateProductComparisonHTML',
  'generateProductProofHTML',
  'generateProductStepsHTML',
].forEach((token) => {
  assert(registry.includes(token), `Module registry missing Product Starter exporter support: ${token}`);
});

[
  'generateProductFeaturesHTML',
  'generateProductShowcaseHTML',
  'generateProductPurchaseHTML',
  "'product-features'",
  "'product-showcase'",
  "'product-purchase'",
  'cssFragment',
].forEach((token) => {
  assert(highRiskDefinitions.includes(token), `High-risk definitions missing Product Starter support: ${token}`);
});

[
  'getHighRiskModuleDefinition',
  'renderHighRiskModuleHTML',
].forEach((token) => {
  assert(registry.includes(token), `Module registry should route high-risk Product Starter modules through definitions: ${token}`);
});

[
  "'product-features'",
  "'product-showcase'",
  "'product-scenes'",
  "'product-info'",
  "'product-benefits'",
  "'product-steps'",
  "'product-comparison'",
  "'product-proof'",
  "'product-purchase'",
].forEach((token) => {
  assert(registry.includes(token), `Module registry missing Product Starter module type: ${token}`);
});

[
  '.cb-product-showcase',
  '.cb-product-features',
  '.cb-product-scenes',
  '.cb-product-info',
  '.cb-product-comparison',
  '.cb-product-proof',
  '.cb-product-purchase',
].forEach((token) => {
  assert(css.includes(token), `Generated CSS missing Product Starter selector: ${token}`);
});

[
  'rewriteDataImages',
  'rewriteLocalImages',
  'dataUrlPattern',
  'localImagePattern',
  'images/image-',
  'images/${String(imageFiles.length + 1)',
  "index.html",
  "css/style.css",
  "js/campaign.js",
  'collectRemoteImages',
].forEach((token) => {
  assert(packageGenerator.includes(token), `ZIP package generator missing image/package rule: ${token}`);
});

[
  "PROJECT_PACKAGE_MANIFEST_FILE = 'project.json'",
  'collectLocalImageRefs',
  'replaceLocalImageRefs',
  'createProjectPackage',
  'parseProjectPackage',
  'storeLocalImageBlob',
  'images/${String(imageFiles.length + 1)',
  'replaceImageRefs(projectForPackage, replacements)',
].forEach((token) => {
  assert(projectPackage.includes(token), `.cmb project package missing local image rule: ${token}`);
});

[
  'local-image://',
  'storeLocalImage',
  'storeLocalImageBlob',
  'getLocalImage',
  'indexedDB',
].forEach((token) => {
  assert(localImageStore.includes(token), `Local image store missing token: ${token}`);
});

[
  'stripDataImageUrlsForPaste',
  'dataImageUrlPattern',
  'localImageUrlPattern',
].forEach((token) => {
  assert(sanitizer.includes(token), `Paste sanitizer missing CMS-safe token: ${token}`);
});

[
  'stripDataImageUrlsForPaste(code.html)',
  'stripDataImageUrlsForPaste(code.css)',
  'hasUploadedImagesInPaste',
  '請改用圖片連結',
  '若要使用上傳圖片，請下載 ZIP',
  'generateCampaignPackage(code.html, code.css)',
  'HTML',
  'CSS',
  'JS',
  'ZIP',
].forEach((token) => {
  assert(exportModal.includes(token), `Export modal missing Product Starter export UX token: ${token}`);
});

assert(!sanitizer.includes('base64,') || sanitizer.includes('dataImageUrlPattern'), 'CMS paste path should strip data images instead of preserving base64 payloads.');

console.log('Product Starter export readiness verified.');
