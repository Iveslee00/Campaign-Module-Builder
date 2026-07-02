import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const pkg = JSON.parse(read('package.json'));
const types = read('types/modules.ts');
const previewRenderer = read('modules/preview/ModulePreviewRenderer.tsx');
const previewCanvas = read('components/editor/PreviewCanvas.tsx');
const previewModal = read('components/editor/PreviewModal.tsx');
const registry = read('lib/modules/moduleRegistry.ts');

assert(
  pkg.scripts['verify:shared-module-rendering'] === 'node --no-warnings scripts/verify-shared-module-rendering.mjs',
  'package.json should expose verify:shared-module-rendering'
);

const moduleTypeBlock = types.match(/export type ModuleType =([\s\S]*?);/);
assert(moduleTypeBlock, 'ModuleType union should be readable');
const moduleTypes = [...moduleTypeBlock[1].matchAll(/\|\s*'([^']+)'/g)].map((match) => match[1]);
assert(moduleTypes.length > 0, 'ModuleType union should include module names');

assert(existsSync('modules/renderers/types.ts'), 'Shared renderer types should exist');
assert(existsSync('modules/renderers/SharedModuleView.tsx'), 'SharedModuleView should exist');
assert(existsSync('components/editor/CampaignExportStyles.tsx'), 'CampaignExportStyles bridge should exist');

const rendererTypes = read('modules/renderers/types.ts');
const sharedView = read('modules/renderers/SharedModuleView.tsx');
const exportStylesBridge = read('components/editor/CampaignExportStyles.tsx');

assert(rendererTypes.includes("export type ModuleRuntimeMode = 'canvas' | 'preview' | 'export'"), 'Shared renderer should define canvas/preview/export runtime modes');
assert(rendererTypes.includes('export type ModuleRenderMode = ModuleRuntimeMode'), 'Shared renderer should keep ModuleRenderMode alias for compatibility');
assert(rendererTypes.includes('ModuleViewProps'), 'Shared renderer should define ModuleViewProps');
assert(sharedView.includes('renderModuleExportHTML'), 'SharedModuleView should render through module registry/export HTML');
assert(sharedView.includes('resolveLocalImageUrl'), 'SharedModuleView should resolve local-image refs before injecting preview HTML');
assert(sharedView.includes('revokeResolvedLocalImageUrl'), 'SharedModuleView should revoke resolved local image object URLs');
assert(sharedView.includes('dangerouslySetInnerHTML'), 'SharedModuleView should own the static markup bridge');
assert(sharedView.includes('data-nexora-runtime-mode'), 'SharedModuleView should expose runtime mode for diagnostics');
assert(sharedView.includes('data-nexora-render-mode'), 'SharedModuleView should expose render mode for diagnostics');

assert(previewRenderer.includes('SharedModuleView'), 'ModulePreviewRenderer should use SharedModuleView');
assert(!/import\s+\{[^}]*Preview[^}]*\}\s+from\s+'\.\//.test(previewRenderer), 'ModulePreviewRenderer should not import per-module preview components');
for (const type of moduleTypes) {
  assert(previewRenderer.includes(`'${type}'`), `Preview renderer should still register module type: ${type}`);
  assert(registry.includes(`'${type}'`), `Module registry should still register module type: ${type}`);
}

assert(exportStylesBridge.includes('generatePageCSS'), 'CampaignExportStyles should use the same export CSS generator');
assert(exportStylesBridge.includes('resolveLocalImageUrl'), 'CampaignExportStyles should resolve local background image refs for preview CSS');
assert(exportStylesBridge.includes('revokeResolvedLocalImageUrl'), 'CampaignExportStyles should revoke resolved background object URLs');
assert(exportStylesBridge.includes('data-nexora-export-preview-css'), 'CampaignExportStyles should mark injected export CSS');
assert(exportStylesBridge.includes('nexora-preview-mobile-scope'), 'CampaignExportStyles should provide scoped forced mobile rules');
assert(exportStylesBridge.includes('extractForcedMobileCSS'), 'CampaignExportStyles should extract mobile media rules for mobile preview');
assert(previewCanvas.includes('CampaignExportStyles'), 'PreviewCanvas should inject export CSS for builder canvas');
assert(previewModal.includes('CampaignExportStyles'), 'PreviewModal should inject export CSS for preview modal');
assert(previewCanvas.includes('buttonTextColor'), 'PreviewCanvas should pass button text color into export CSS');
assert(previewModal.includes('buttonTextColor'), 'PreviewModal should pass button text color into export CSS');
assert(previewCanvas.includes('forceMobile={isMobile}'), 'PreviewCanvas should force mobile CSS in mobile device mode');
assert(previewModal.includes('forceMobile={isMobile}'), 'PreviewModal should force mobile CSS in mobile device mode');
assert(previewCanvas.includes('nexora-preview-mobile-scope'), 'PreviewCanvas should scope forced mobile CSS to mobile preview');
assert(previewModal.includes('nexora-preview-mobile-scope'), 'PreviewModal should scope forced mobile CSS to mobile preview');

console.log('Shared module rendering bridge verified.');
