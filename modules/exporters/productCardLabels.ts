import type { Product } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateProductCardLabels(product: Product): string {
  const labels = [
    product.showBadge && product.badgeText
      ? `<span class="cb-product-card__label cb-product-card__label--badge">${escapeHtml(product.badgeText)}</span>`
      : '',
    product.showSpecialTag && product.specialTag
      ? `<span class="cb-product-card__label cb-product-card__label--special">${escapeHtml(product.specialTag)}</span>`
      : '',
  ].filter(Boolean);

  return labels.length ? `\n          <div class="cb-product-card__labels">${labels.join('')}</div>` : '';
}
