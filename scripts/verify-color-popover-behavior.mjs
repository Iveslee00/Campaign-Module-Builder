import { readFileSync } from 'node:fs';

const formField = readFileSync('components/ui/FormField.tsx', 'utf8');

[
  'COLOR_POPOVER_OPEN_EVENT',
  'window.dispatchEvent(new CustomEvent',
  'window.addEventListener(COLOR_POPOVER_OPEN_EVENT',
  'document.addEventListener',
  'pointerdown',
  'popoverRef',
  'buttonRef.current?.contains',
  'popoverRef.current?.contains',
  'rect.right + gap',
  'rect.left - width - gap',
  "Escape",
].forEach((token) => {
  if (!formField.includes(token)) {
    throw new Error(`Color popover behavior missing token: ${token}`);
  }
});

if (formField.includes('setOpen((current) => !current)')) {
  throw new Error('Color popover still toggles without notifying sibling popovers.');
}

console.log('Color popover behavior verification passed.');
