'use client';

import { BannerProductsData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';

const PLACEHOLDER_PRODUCT = 'https://placehold.co/400x400/e0e0f0/9090c0?text=Product';
const PLACEHOLDER_BANNER = 'https://placehold.co/500x600/1a1a2e/6366f1?text=Banner';

export function BannerProductsPreview({ data }: { data: BannerProductsData }) {
  const { isMobile } = useDevice();
  const count = data.products.length;
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};

  const bgStyle: React.CSSProperties = data.backgroundColor
    ? { background: data.backgroundColor }
    : data.backgroundStyle === 'dark'
    ? { background: '#1a1a2e' }
    : data.backgroundStyle === 'gradient'
    ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
    : {};

  const gridCols = isMobile
    ? '1fr 1fr'
    : count >= 4
    ? '2fr 1fr 1fr 1fr 1fr'
    : count >= 3
    ? '2fr 1fr 1fr 1fr'
    : '2fr 1fr 1fr';

  return (
    <section style={{ ...bgStyle, padding: isMobile ? '32px 16px' : '48px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: isMobile ? '12px' : '20px', alignItems: 'stretch' }}>
          {/* Banner */}
          <div style={{ ...(isMobile ? { gridColumn: '1 / -1' } : {}), position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#1a1a2e', minHeight: isMobile ? '180px' : '280px', display: 'flex' }}>
            <img
              src={data.bannerImage || PLACEHOLDER_BANNER}
              alt={data.bannerTitle}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_BANNER; }}
            />
            <div style={{ position: 'relative', zIndex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}>
              {data.bannerTitle && (
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: data.bannerTitleColor || '#ffffff', lineHeight: 1.2, marginBottom: '6px', margin: 0 }}>
                  {data.bannerTitle}
                </p>
              )}
              {data.bannerSubtitle && (
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginTop: '6px', margin: 0 }}>
                  {data.bannerSubtitle}
                </p>
              )}
            </div>
          </div>

          {/* Product cards */}
          {data.products.map((product) => (
            <div key={product.id} style={{ background: '#ffffff', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#f0f0f8' }}>
                <img
                  src={product.image || PLACEHOLDER_PRODUCT}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_PRODUCT; }}
                />
                {product.showBadge && product.badgeText && (
                  <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#e53e3e', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>
                    {product.badgeText}
                  </span>
                )}
              </div>
              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '3px', ...textStyle }}>
                {product.brand && (
                  <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: data.textColor || '#9090b0', margin: 0 }}>
                    {product.brand}
                  </p>
                )}
                <p style={{ fontSize: '12px', fontWeight: 600, color: data.textColor || '#1a1a2e', margin: 0, lineHeight: 1.3 }}>
                  {product.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                  {product.originalPrice && (
                    <span style={{ fontSize: '10px', color: '#9090b0', textDecoration: 'line-through' }}>{product.originalPrice}</span>
                  )}
                  {product.salePrice && (
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#e53e3e' }}>{product.salePrice}</span>
                  )}
                </div>
                {product.showSpecialTag && product.specialTag && (
                  <span style={{ display: 'inline-block', marginTop: '3px', padding: '1px 6px', background: '#fff3cd', color: '#b45309', border: '1px solid #fcd34d', fontSize: '10px', fontWeight: 600, borderRadius: '3px', alignSelf: 'flex-start' }}>
                    {product.specialTag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
