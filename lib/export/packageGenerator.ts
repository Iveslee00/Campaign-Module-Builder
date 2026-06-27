import { createZip } from './zipGenerator';
import { getLocalImage, isLocalImageRef } from '@/lib/assets/localImageStore';

const encoder = new TextEncoder();
const dataUrlPattern = /data:([^;]+);base64,([A-Za-z0-9+/=]+)/g;
const localImagePattern = /local-image:\/\/[a-zA-Z0-9_-]+/g;
const remoteImagePattern = /https?:\/\/[^"')\s]+\.(?:png|jpe?g|gif|webp|svg)(?:\?[^"')\s]*)?/gi;

const extensionByMime: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

function bytesFromBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function bytesFromBlob(blob: Blob) {
  return new Uint8Array(await blob.arrayBuffer());
}

function safeFileName(value: string, fallback: string) {
  const cleaned = value.trim().replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-');
  return cleaned || fallback;
}

function extractScripts(html: string) {
  const scripts: string[] = [];
  const body = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (_match, script) => {
    scripts.push(script.trim());
    return '';
  });

  return {
    html: body.trim(),
    js: scripts.filter(Boolean).join('\n\n'),
  };
}

function rewriteDataImages(input: string, imageFiles: { name: string; bytes: Uint8Array }[]) {
  const seen = new Map<string, string>();
  return input.replace(dataUrlPattern, (full, mime: string, base64: string) => {
    if (seen.has(full)) return seen.get(full)!;

    const ext = extensionByMime[mime] ?? 'bin';
    const path = `images/image-${String(imageFiles.length + 1).padStart(2, '0')}.${ext}`;
    imageFiles.push({ name: path, bytes: bytesFromBase64(base64) });
    seen.set(full, path);
    return path;
  });
}

async function rewriteLocalImages(input: string, imageFiles: { name: string; bytes: Uint8Array }[]) {
  const refs = Array.from(new Set(input.match(localImagePattern) ?? []));
  let output = input;

  for (const ref of refs) {
    if (!isLocalImageRef(ref)) continue;
    const record = await getLocalImage(ref);
    if (!record) {
      output = output.replaceAll(ref, '');
      continue;
    }

    const fallbackExt = extensionByMime[record.mimeType] ?? 'bin';
    const fileName = safeFileName(record.fileName, `${record.id}.${fallbackExt}`);
    const path = `images/${String(imageFiles.length + 1).padStart(2, '0')}-${fileName}`;
    imageFiles.push({ name: path, bytes: await bytesFromBlob(record.blob) });
    output = output.replaceAll(ref, path);
  }

  return output;
}

function collectRemoteImages(...sources: string[]) {
  const urls = new Set<string>();
  for (const source of sources) {
    remoteImagePattern.lastIndex = 0;
    let match = remoteImagePattern.exec(source);
    while (match) {
      urls.add(match[0]);
      match = remoteImagePattern.exec(source);
    }
  }
  return Array.from(urls);
}

export interface CampaignPackageResult {
  blob: Blob;
  remoteImages: string[];
  fileCount: number;
}

export async function generateCampaignPackage(html: string, css: string): Promise<CampaignPackageResult> {
  const imageFiles: { name: string; bytes: Uint8Array }[] = [];
  const extracted = extractScripts(html);
  const htmlWithDataImages = rewriteDataImages(extracted.html, imageFiles);
  const cssWithDataImages = rewriteDataImages(css, imageFiles);
  const htmlWithLocalImages = await rewriteLocalImages(htmlWithDataImages, imageFiles);
  const cssWithLocalImages = await rewriteLocalImages(cssWithDataImages, imageFiles);
  const remoteImages = collectRemoteImages(htmlWithLocalImages, cssWithLocalImages);

  const indexHtml = `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Campaign Page</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
${htmlWithLocalImages}
  <script src="js/campaign.js"></script>
</body>
</html>
`;

  const files = [
    { name: 'index.html', bytes: encoder.encode(indexHtml) },
    { name: 'css/style.css', bytes: encoder.encode(cssWithLocalImages) },
    { name: 'js/campaign.js', bytes: encoder.encode(extracted.js || '/* No page scripts generated. */\n') },
    ...imageFiles,
  ];

  return {
    blob: createZip(files),
    remoteImages,
    fileCount: files.length,
  };
}
