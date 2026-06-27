import fs from 'node:fs';

const storage = fs.readFileSync('lib/projects/localProjectStorage.ts', 'utf8');
const app = fs.readFileSync('app/page.tsx', 'utf8');

if (!storage.includes('SaveProjectWorkspaceResult')) {
  throw new Error('saveProjectWorkspace should return a structured result.');
}

if (!storage.includes('quota-exceeded')) {
  throw new Error('saveProjectWorkspace should classify quota exceeded failures.');
}

if (!storage.includes('try') || !storage.includes('catch')) {
  throw new Error('saveProjectWorkspace should catch storage write failures.');
}

if (!app.includes('專案暫存空間不足')) {
  throw new Error('Editor should show a user-facing local storage quota message.');
}

console.log('Local storage quota handling verified.');
