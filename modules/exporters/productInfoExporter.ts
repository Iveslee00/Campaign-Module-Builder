import { ProductInfoData } from '@/types/modules';
import { escapeHtml } from '@/lib/utils';

export function generateProductInfoHTML(data: ProductInfoData): string {
  const bg = data.backgroundColor ? ` style="background: ${escapeHtml(data.backgroundColor)}"` : '';
  const titleStyle = data.titleColor ? ` style="color: ${escapeHtml(data.titleColor)}"` : '';
  const textStyle = data.textColor ? ` style="color: ${escapeHtml(data.textColor)}"` : '';
  const items = data.items.map((item) => `      <div class="cb-product-info__row">
        <p class="cb-product-info__label"${textStyle}>${escapeHtml(item.label)}</p>
        <div>
          <p class="cb-product-info__value"${titleStyle}>${escapeHtml(item.value)}</p>
          ${item.description ? `<p class="cb-product-info__desc"${textStyle}>${escapeHtml(item.description)}</p>` : ''}
        </div>
      </div>`).join('\n');

  return `<section class="cb-product-info cb-product-info--${escapeHtml(data.style)} cb-section"${bg}>
  <div class="cb-container">
    <div class="cb-product-block-head">
      ${data.eyebrow ? `<p class="cb-product-block-head__eyebrow"${textStyle}>${escapeHtml(data.eyebrow)}</p>` : ''}
      <h2 class="cb-product-block-head__title"${titleStyle}>${escapeHtml(data.title)}</h2>
      ${data.subtitle ? `<p class="cb-product-block-head__subtitle"${textStyle}>${escapeHtml(data.subtitle)}</p>` : ''}
    </div>
    <div class="cb-product-info__table">
${items}
    </div>
  </div>
</section>`;
}
