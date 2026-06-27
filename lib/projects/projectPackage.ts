import { createZip } from '@/lib/export/zipGenerator';
import { getLocalImage, isLocalImageRef, storeLocalImageBlob } from '@/lib/assets/localImageStore';
import type { CampaignBuilderProject } from '@/types/project';
import { parseProjectFile } from './localProjectStorage';

export const PROJECT_PACKAGE_MANIFEST_FILE = 'project.json';
const PACKAGE_FILE_TYPE = 'nexora-project-package';
const PACKAGE_VERSION = 1;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const localImagePattern = /local-image:\/\/[a-zA-Z0-9_-]+/g;

interface ZipEntry {
  name: string;
  bytes: Uint8Array;
}

interface ProjectPackagePayload {
  fileType: typeof PACKAGE_FILE_TYPE;
  version: typeof PACKAGE_VERSION;
  exportedAt: string;
  project: CampaignBuilderProject;
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function safeFileName(value: string, fallback: string) {
  const cleaned = value.trim().replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-');
  return cleaned || fallback;
}

function getMimeType(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

function collectLocalImageRefs(value: unknown, refs = new Set<string>()) {
  if (typeof value === 'string') {
    const matches = value.match(localImagePattern);
    matches?.forEach((ref) => refs.add(ref));
    return refs;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectLocalImageRefs(item, refs));
    return refs;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectLocalImageRefs(item, refs));
  }

  return refs;
}

function replaceImageRefs<T>(value: T, replacements: Map<string, string>): T {
  if (typeof value === 'string') {
    let nextValue: string = value;
    replacements.forEach((replacement, ref) => {
      nextValue = nextValue.replaceAll(ref, replacement);
    });
    return nextValue as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceImageRefs(item, replacements)) as T;
  }

  if (value && typeof value === 'object') {
    const nextValue: Record<string, unknown> = {};
    Object.entries(value).forEach(([key, item]) => {
      nextValue[key] = replaceImageRefs(item, replacements);
    });
    return nextValue as T;
  }

  return value;
}

export const replaceLocalImageRefs = replaceImageRefs;

async function bytesFromBlob(blob: Blob) {
  return new Uint8Array(await blob.arrayBuffer());
}

function isZipBytes(bytes: Uint8Array) {
  return bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;
}

function readUint16(view: DataView, offset: number) {
  return view.getUint16(offset, true);
}

function readUint32(view: DataView, offset: number) {
  return view.getUint32(offset, true);
}

function parseStoredZip(bytes: Uint8Array) {
  const files = new Map<string, Uint8Array>();
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 0;

  while (offset + 30 <= bytes.length) {
    const signature = readUint32(view, offset);
    if (signature === 0x02014b50 || signature === 0x06054b50) break;
    if (signature !== 0x04034b50) throw new Error('invalid-project-package');

    const method = readUint16(view, offset + 8);
    if (method !== 0) throw new Error('unsupported-project-package');

    const compressedSize = readUint32(view, offset + 18);
    const fileNameLength = readUint16(view, offset + 26);
    const extraLength = readUint16(view, offset + 28);
    const nameStart = offset + 30;
    const dataStart = nameStart + fileNameLength + extraLength;
    const dataEnd = dataStart + compressedSize;

    if (dataEnd > bytes.length) throw new Error('invalid-project-package');

    const name = decoder.decode(bytes.slice(nameStart, nameStart + fileNameLength));
    files.set(name, bytes.slice(dataStart, dataEnd));
    offset = dataEnd;
  }

  return files;
}

function arrayBufferFromBytes(bytes: Uint8Array) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function getProjectFromManifest(raw: string) {
  const parsed = JSON.parse(raw) as unknown;
  if (parsed && typeof parsed === 'object') {
    const payload = parsed as Partial<ProjectPackagePayload>;
    if (payload.fileType === PACKAGE_FILE_TYPE && payload.version === PACKAGE_VERSION && payload.project) {
      return payload.project;
    }
  }

  return parseProjectFile(raw);
}

export async function createProjectPackage(project: CampaignBuilderProject): Promise<Blob> {
  const projectForPackage = clone(project);
  const refs = Array.from(collectLocalImageRefs(projectForPackage));
  const replacements = new Map<string, string>();
  const imageFiles: ZipEntry[] = [];

  for (const ref of refs) {
    if (!isLocalImageRef(ref)) continue;
    const record = await getLocalImage(ref);
    if (!record) {
      replacements.set(ref, '');
      continue;
    }

    const fileName = safeFileName(record.fileName, `${record.id}.png`);
    const path = `images/${String(imageFiles.length + 1).padStart(2, '0')}-${fileName}`;
    replacements.set(ref, path);
    imageFiles.push({
      name: path,
      bytes: await bytesFromBlob(record.blob),
    });
  }

  const payload: ProjectPackagePayload = {
    fileType: PACKAGE_FILE_TYPE,
    version: PACKAGE_VERSION,
    exportedAt: new Date().toISOString(),
    project: replaceImageRefs(projectForPackage, replacements),
  };

  return createZip([
    { name: PROJECT_PACKAGE_MANIFEST_FILE, bytes: encoder.encode(JSON.stringify(payload, null, 2)) },
    ...imageFiles,
  ]);
}

export async function parseProjectPackage(file: File): Promise<CampaignBuilderProject> {
  const bytes = new Uint8Array(await file.arrayBuffer());

  if (!isZipBytes(bytes)) {
    return parseProjectFile(decoder.decode(bytes));
  }

  const files = parseStoredZip(bytes);
  const manifest = files.get(PROJECT_PACKAGE_MANIFEST_FILE);
  if (!manifest) throw new Error('invalid-project-package');

  const project = getProjectFromManifest(decoder.decode(manifest));
  const replacements = new Map<string, string>();

  for (const [name, fileBytes] of Array.from(files.entries())) {
    if (!name.startsWith('images/')) continue;
    const blob = new Blob([arrayBufferFromBytes(fileBytes)], { type: getMimeType(name) });
    const stored = await storeLocalImageBlob(blob, name.split('/').pop() || name, { mimeType: blob.type });
    replacements.set(name, stored.ref);
  }

  return replaceImageRefs(project, replacements);
}
