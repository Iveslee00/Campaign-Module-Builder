'use client';

import { Product } from '@/types/modules';

interface Props {
  product: Product;
  compact?: boolean;
}

export function ProductCardLabels({ product, compact = false }: Props) {
  const labels = [
    product.showBadge && product.badgeText ? { text: product.badgeText, variant: 'badge' } : null,
    product.showSpecialTag && product.specialTag ? { text: product.specialTag, variant: 'special' } : null,
  ].filter(Boolean) as Array<{ text: string; variant: 'badge' | 'special' }>;

  if (labels.length === 0) return null;

  return (
    <div style={{ position: 'absolute', top: compact ? '8px' : '10px', left: compact ? '8px' : '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px', zIndex: 2, maxWidth: 'calc(100% - 16px)' }}>
      {labels.map((label) => (
        <span
          key={label.variant}
          style={{
            maxWidth: '100%',
            padding: compact ? '2px 6px' : '3px 8px',
            borderRadius: '4px',
            background: label.variant === 'badge' ? '#e53e3e' : '#fff3cd',
            color: label.variant === 'badge' ? '#ffffff' : '#b45309',
            border: label.variant === 'badge' ? 'none' : '1px solid #fcd34d',
            fontSize: compact ? '10px' : '11px',
            fontWeight: 700,
            lineHeight: 1.35,
            letterSpacing: label.variant === 'badge' ? '0.05em' : 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label.text}
        </span>
      ))}
    </div>
  );
}
