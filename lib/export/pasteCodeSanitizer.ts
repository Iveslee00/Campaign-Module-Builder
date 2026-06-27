const dataImageUrlPattern = /data:image\/[^"')\s]+/g;
const localImageUrlPattern = /local-image:\/\/[a-zA-Z0-9_-]+/g;

export function stripDataImageUrlsForPaste(input: string) {
  return input
    .replace(dataImageUrlPattern, '')
    .replace(localImageUrlPattern, '');
}
