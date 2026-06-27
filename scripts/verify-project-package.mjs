import { readFileSync } from 'node:fs';

const packageFile = readFileSync(new URL('../lib/projects/projectPackage.ts', import.meta.url), 'utf8');
const storageFile = readFileSync(new URL('../lib/assets/localImageStore.ts', import.meta.url), 'utf8');
const appFile = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');

if (!packageFile.includes("PROJECT_PACKAGE_MANIFEST_FILE = 'project.json'")) {
  throw new Error('Project package should write project.json into the .cmb package.');
}

if (!packageFile.includes('images/')) {
  throw new Error('Project package should store local images in an images/ folder.');
}

if (!packageFile.includes('createProjectPackage')) {
  throw new Error('Project package should expose createProjectPackage for .cmb export.');
}

if (!packageFile.includes('parseProjectPackage')) {
  throw new Error('Project package should expose parseProjectPackage for .cmb import.');
}

if (!packageFile.includes('replaceLocalImageRefs')) {
  throw new Error('Project package should rebuild local-image refs when importing images.');
}

if (!storageFile.includes('storeLocalImageBlob')) {
  throw new Error('Local image store should support storing imported image blobs.');
}

if (!appFile.includes('createProjectPackage') || !appFile.includes('parseProjectPackage')) {
  throw new Error('App project import/export handlers should use the project package helpers.');
}

console.log('Project package verification passed.');
