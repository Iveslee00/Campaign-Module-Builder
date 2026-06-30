import type { ImageSpec } from '@/lib/assets/imageSpecs';
import { escapeHtml } from '@/lib/utils';
import { formatImageSpec } from '@/lib/assets/imageSpecs';

export function renderImagePlaceholder(
  label: string,
  spec: ImageSpec,
  tone: 'light' | 'dark' = 'light'
) {
  const size = formatImageSpec(spec);

  return `<span class="cb-image-placeholder cb-image-placeholder--${tone}" data-image-placeholder="true" data-image-width="${spec.width}" data-image-height="${spec.height}" aria-label="${escapeHtml(label)} ${size}">
            <span class="cb-image-placeholder__label">${escapeHtml(label)}</span>
            <span class="cb-image-placeholder__size">${size}</span>
            <span class="cb-image-placeholder__hint">請上傳指定尺寸圖檔</span>
          </span>`;
}
