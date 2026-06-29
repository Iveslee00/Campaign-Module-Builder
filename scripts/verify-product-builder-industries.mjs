import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const packageJson = read('package.json');
const builder = read('lib/productBuilder/productPageBuilder.ts');
const modal = read('components/editor/ProductBuildModal.tsx');
const sprintSpec = read('docs/superpowers/specs/2026-06-30-builder-quality-sprint-design.md');

const required = [
  [packageJson, '"verify:product-builder-industries"', 'package.json should expose verify:product-builder-industries'],
  [builder, "'food'", 'ProductIndustry should include food'],
  [builder, "'electronics'", 'ProductIndustry should include electronics'],
  [builder, "'fashion'", 'ProductIndustry should include fashion'],
  [builder, '食品飲料', 'Builder copy should include food and beverage'],
  [builder, '3C 家電', 'Builder copy should include 3C/home appliance'],
  [builder, '服飾配件', 'Builder copy should include fashion/accessories'],
  [builder, 'industryRecipeBoosts', 'Builder should include industry-specific recipe boosts'],
  [builder, 'input.industry ? industryRecipeBoosts[input.industry]', 'Recipe resolver should apply industry-specific module priority'],
  [builder, "industry === 'electronics'", 'Default theme logic should distinguish electronics'],
  [builder, "industry === 'fashion'", 'Default theme logic should distinguish fashion'],
  [builder, "industry === 'food'", 'Default theme logic should distinguish food'],
  [modal, "{ value: 'food'", 'ProductBuildModal should show food option'],
  [modal, "{ value: 'electronics'", 'ProductBuildModal should show electronics option'],
  [modal, "{ value: 'fashion'", 'ProductBuildModal should show fashion option'],
  [sprintSpec, 'Status：完成第一階段。快速建立已新增食品飲料、3C 家電、服飾配件', 'Sprint spec should mark BQ-007 first phase complete'],
];

for (const [source, token, message] of required) {
  if (!source.includes(token)) {
    throw new Error(message);
  }
}

console.log('Product builder industry expansion verification passed.');
