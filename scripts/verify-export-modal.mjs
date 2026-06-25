import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const exportModal = readFileSync('components/editor/ExportModal.tsx', 'utf8');

assert(
  exportModal.includes('const codePanelClass ='),
  'Export modal should centralize code panel styling'
);
assert(
  exportModal.includes('const codePreClass ='),
  'Export modal should centralize code pre styling'
);
assert(
  exportModal.includes('whitespace-pre-wrap'),
  'Export code previews should preserve indentation while wrapping long lines'
);
assert(
  exportModal.includes('break-all'),
  'Export code previews should break long base64/data URL strings'
);
assert(
  !exportModal.includes('whitespace-pre overflow-x-auto'),
  'Export code previews should not rely on horizontal scrolling for long uploaded image URLs'
);

console.log('export modal verified');
