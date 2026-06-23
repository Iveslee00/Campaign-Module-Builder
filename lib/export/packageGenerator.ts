import { createZip } from './zipGenerator';

const encoder = new TextEncoder();
const dataUrlPattern = /data:([^;]+);base64,([A-Za-z0-9+/=]+)/g;
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

export function generateCampaignPackage(html: string, css: string): CampaignPackageResult {
  const imageFiles: { name: string; bytes: Uint8Array }[] = [];
  const extracted = extractScripts(html);
  const htmlWithLocalImages = rewriteDataImages(extracted.html, imageFiles);
  const cssWithLocalImages = rewriteDataImages(css, imageFiles);
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
