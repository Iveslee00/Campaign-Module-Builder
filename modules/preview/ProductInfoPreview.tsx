'use client';

import { ProductInfoData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { moduleSurface, premiumShadow, softBorder } from './visualStyles';

export function ProductInfoPreview({ data }: { data: ProductInfoData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  const isTable = data.style === 'specs' || data.style === 'contents';

  return (
    <section style={{ ...moduleSurface(data.backgroundColor || '#f8fafc'), padding: isMobile ? '36px 16px' : '56px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ maxWidth: 680, marginBottom: 28 }}>
          {data.eyebrow && <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: textColor, opacity: 0.72 }}>{data.eyebrow}</p>}
          <h2 style={{ margin: 0, fontSize: isMobile ? '1.75rem' : '2.35rem', lineHeight: 1.12, fontWeight: 900, color: titleColor }}>{data.title}</h2>
          {data.subtitle && <p style={{ margin: '12px 0 0', fontSize: '1rem', lineHeight: 1.7, color: textColor }}>{data.subtitle}</p>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTable ? '1fr' : 'repeat(3, 1fr)', gap: isTable ? 0 : 16, overflow: 'hidden', borderRadius: 24, border: softBorder, background: 'rgba(255,255,255,0.92)', boxShadow: premiumShadow }}>
          {data.items.map((item) => (
            <div key={item.id} style={{ display: isTable ? 'grid' : 'block', gridTemplateColumns: isMobile ? '1fr' : '180px 1fr', gap: isTable ? 18 : 0, padding: '18px 20px', borderBottom: isTable ? '1px solid rgba(15,23,42,0.08)' : undefined, borderRight: !isMobile && !isTable ? '1px solid rgba(15,23,42,0.08)' : undefined }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: textColor, opacity: 0.68 }}>{item.label}</p>
              <div>
                <p style={{ margin: isTable ? 0 : '8px 0 0', fontSize: '1.05rem', fontWeight: 850, color: titleColor }}>{item.value}</p>
                {item.description && <p style={{ margin: '6px 0 0', fontSize: '0.9rem', lineHeight: 1.65, color: textColor }}>{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
