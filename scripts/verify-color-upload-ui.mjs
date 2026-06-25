import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const formField = readFileSync('components/ui/FormField.tsx', 'utf8');

assert(formField.includes('defaultPreviewColor'), 'Color fields should expose a default preview color');
assert(!formField.includes("const displayColor = isHex ? value : '#ffffff';"), 'Empty color fields should not preview as white by default');
assert(formField.includes('placeholder={placeholder}'), 'Color fields should keep explanatory placeholders');
assert(formField.includes("className=\"block h-32 w-full object-contain p-2\""), 'Uploaded image previews should use bounded contain preview');
assert(!formField.includes('max-h-32 w-full object-cover'), 'Uploaded image previews should not crop or visually expand with cover');

console.log('color and upload UI verified');
