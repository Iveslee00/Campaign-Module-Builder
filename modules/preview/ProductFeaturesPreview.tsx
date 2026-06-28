'use client';

import { ProductFeaturesData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';

export function ProductFeaturesPreview({ data }: { data: ProductFeaturesData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  const columns = isMobile ? '1fr' : data.style === 'grid-6' ? 'repeat(3, 1fr)' : data.style === 'icon-text' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';
  const cardBg = data.style === 'cards' ? '#ffffff' : 'linear-gradient(180deg, rgba(255,255,255,0.82), rgba(248,250,252,0.62))';

  return (
    <section style={{ background: data.backgroundColor || '#ffffff', padding: isMobile ? '36px 16px' : '56px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {data.eyebrow && <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: textColor, opacity: 0.7 }}>{data.eyebrow}</p>}
        <h2 style={{ margin: 0, maxWidth: '720px', fontSize: isMobile ? '1.75rem' : '2.5rem', lineHeight: 1.12, fontWeight: 850, color: titleColor }}>{data.title}</h2>
        {data.subtitle && <p style={{ margin: '14px 0 0', maxWidth: '680px', fontSize: '1rem', lineHeight: 1.7, color: textColor }}>{data.subtitle}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: columns, gap: isMobile ? '14px' : '18px', marginTop: isMobile ? '26px' : '34px' }}>
          {data.items.map((item) => (
            <div key={item.id} style={{ minHeight: data.style === 'icon-text' ? 112 : 164, borderRadius: 22, padding: '24px 22px', background: cardBg, border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 18px 46px rgba(15,23,42,0.08)' }}>
              <div style={{ width: 46, height: 46, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0f2fe, #eef2ff)', fontSize: 22, marginBottom: 16, boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.10)' }}>{item.icon}</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.05rem', lineHeight: 1.25, fontWeight: 800, color: titleColor }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: textColor }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
