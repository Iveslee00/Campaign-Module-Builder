import { readFileSync } from 'node:fs';

const app = readFileSync('app/page.tsx', 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(app.includes("type WorkspaceSection = 'home' | 'assets' | 'settings'"), 'Workspace should have home, assets, and settings sections.');
assert(app.includes('workspaceCopy'), 'Workspace should centralize copy for language switching.');
assert(app.includes("type WorkspaceLanguage = 'zh' | 'en' | 'ja'"), 'Workspace should support zh, en, and ja language options.');
assert(app.includes("NEXORA_WORKSPACE_LANGUAGE_KEY"), 'Language choice should be remembered locally.');
assert(app.includes('Demo Assets'), 'Assets section should expose demo assets content.');
assert(app.includes('清潔用品商品頁素材'), 'Assets demo should target the current cleaning-product use case.');
assert(app.includes('1000 x 1000'), 'Assets demo should mention product PNG image specification.');
assert(app.includes('project.cmb'), 'Settings should explain portable .cmb project packages.');
assert(app.includes('Local Project Mode'), 'Settings should explain the current local project storage mode.');
assert(app.includes('繁體中文') && app.includes('English') && app.includes('日本語'), 'Settings should expose zh/en/ja language choices.');
assert(app.includes('目前設定') && app.includes('Current Settings') && app.includes('現在の設定'), 'Settings copy should have translated headings.');
assert(app.includes('Campaign Builder'), 'Home should keep Campaign Builder as the current tool name.');
assert(app.includes('素材包會逐步整理成可重複使用的品牌資產'), 'Assets section should explain future asset library direction.');

console.log('Workspace content verified.');
