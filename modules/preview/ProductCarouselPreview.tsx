'use client';

import { useState } from 'react';
import { ProductCarouselData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PLACEHOLDER = 'https://placehold.co/400x400/e0e0f0/9090c0?text=Product';

export function ProductCarouselPreview({ data }: { data: ProductCarouselData }) {
  const { isMobile } = useDevice();
  const [current, setCurrent] = useState(0);
  const visible = isMobile ? 2 : 4;
  const max = Math.max(0, data.products.length - visible);
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(max, c + 1));

  return (
    <section style={{ background: data.backgroundColor || '#f8f8fc', padding: isMobile ? '48px 16px' : '72px 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0' : '0 24px', position: 'relative' }}>
        {/* Prev button */}
        <button
          onClick={prev}
          disabled={current === 0}
          style={{
            position: 'absolute', left: isMobile ? '-4px' : '-16px', top: '50%', transform: 'translateY(-50%)',
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#ffffff', border: '1px solid #e8e8f4',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: current === 0 ? 'not-allowed' : 'pointer',
            opacity: current === 0 ? 0.3 : 1,
            zIndex: 2, transition: 'opacity 0.2s',
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Track */}
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: isMobile ? '12px' : '20px', transform: `translateX(calc(-${current} * (${100 / visible}% + ${isMobile ? '12px' : '20px'})))`, transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            {data.products.map((product) => (
              <div
                key={product.id}
                style={{ flex: `0 0 calc(${100 / visible}% - ${isMobile ? '9px' : '15px'})`, minWidth: 0 }}
              >
                <div style={{ background: '#ffffff', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#f0f0f8' }}>
                    <img
                      src={product.image || PLACEHOLDER}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                    />
                    {product.showBadge && product.badgeText && (
                      <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#e53e3e', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>
                        {product.badgeText}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: isMobile ? '10px 12px' : '14px 16px', display: 'flex', flexDirection: 'column', gap: '3px', ...textStyle }}>
                    {product.brand && (
                      <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: data.textColor || '#9090b0', margin: 0 }}>
                        {product.brand}
                      </p>
                    )}
                    <p style={{ fontSize: '13px', fontWeight: 600, color: data.textColor || '#1a1a2e', margin: 0, lineHeight: 1.35 }}>
                      {product.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {product.originalPrice && (
                        <span style={{ fontSize: '11px', color: '#9090b0', textDecoration: 'line-through' }}>{product.originalPrice}</span>
                      )}
                      {product.salePrice && (
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#e53e3e' }}>{product.salePrice}</span>
                      )}
                    </div>
                    {product.showSpecialTag && product.specialTag && (
                      <span style={{ display: 'inline-block', marginTop: '3px', padding: '2px 7px', background: '#fff3cd', color: '#b45309', border: '1px solid #fcd34d', fontSize: '10px', fontWeight: 600, borderRadius: '3px', alignSelf: 'flex-start' }}>
                        {product.specialTag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={next}
          disabled={current >= max}
          style={{
            position: 'absolute', right: isMobile ? '-4px' : '-16px', top: '50%', transform: 'translateY(-50%)',
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#ffffff', border: '1px solid #e8e8f4',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: current >= max ? 'not-allowed' : 'pointer',
            opacity: current >= max ? 0.3 : 1,
            zIndex: 2, transition: 'opacity 0.2s',
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
