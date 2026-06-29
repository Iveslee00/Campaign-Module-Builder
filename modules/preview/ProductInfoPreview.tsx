'use client';

import { ProductInfoData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { moduleSurface, premiumShadow, softBorder } from './visualStyles';

export function ProductInfoPreview({ data }: { data: ProductInfoData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  const isIngredients = data.style === 'ingredients';
  const isTechnology = data.style === 'technology';
  const isSpecs = data.style === 'specs';
  const isContents = data.style === 'contents';
  const gridColumns = isMobile ? '1fr' : isIngredients || isTechnology ? 'repeat(3, 1fr)' : '1fr';
  const tableBackground = isTechnology
    ? 'linear-gradient(135deg, #0f172a, #1e293b)'
    : isContents
      ? 'linear-gradient(180deg, #ffffff, #f8fafc)'
      : isIngredients
        ? 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(240,253,250,0.76))'
        : 'rgba(255,255,255,0.94)';
  const tableColor = isTechnology ? '#e2e8f0' : textColor;

  return (
    <section style={{ ...moduleSurface(data.backgroundColor || '#f8fafc'), padding: isMobile ? '36px 16px' : '56px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ maxWidth: 680, marginBottom: 28 }}>
          {data.eyebrow && <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: textColor, opacity: 0.72 }}>{data.eyebrow}</p>}
          <h2 style={{ margin: 0, fontSize: isMobile ? '1.75rem' : '2.35rem', lineHeight: 1.12, fontWeight: 900, color: titleColor }}>{data.title}</h2>
          {data.subtitle && <p style={{ margin: '12px 0 0', fontSize: '1rem', lineHeight: 1.7, color: textColor }}>{data.subtitle}</p>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: gridColumns, gap: isIngredients || isTechnology ? 16 : 0, overflow: 'hidden', borderRadius: isTechnology ? 30 : 24, border: isTechnology ? '1px solid rgba(125,211,252,0.18)' : softBorder, background: tableBackground, color: tableColor, boxShadow: isTechnology ? '0 24px 72px rgba(15,23,42,0.22)' : premiumShadow, backgroundImage: isTechnology ? 'linear-gradient(rgba(125,211,252,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.08) 1px, transparent 1px), linear-gradient(135deg, #0f172a, #1e293b)' : undefined, backgroundSize: isTechnology ? '28px 28px, 28px 28px, auto' : undefined, padding: isIngredients || isTechnology || isContents ? 14 : 0 }}>
          {data.items.map((item, index) => (
            <div key={item.id} style={{ position: 'relative', display: isSpecs ? 'grid' : 'block', gridTemplateColumns: isMobile ? '1fr' : '180px 1fr', gap: isSpecs ? 18 : 0, padding: isIngredients ? '22px 20px' : isTechnology ? '24px 22px' : isContents ? '18px 18px 18px 58px' : '18px 20px', borderBottom: isSpecs ? '1px solid rgba(15,23,42,0.08)' : undefined, borderRight: !isMobile && isIngredients ? '1px solid rgba(15,23,42,0.07)' : undefined, borderRadius: isIngredients || isTechnology || isContents ? 20 : undefined, background: isIngredients ? 'rgba(255,255,255,0.74)' : isTechnology ? 'rgba(15,23,42,0.55)' : isContents ? 'rgba(255,255,255,0.72)' : undefined, boxShadow: isIngredients ? 'inset 0 0 0 1px rgba(20,184,166,0.10)' : isTechnology ? 'inset 0 0 0 1px rgba(125,211,252,0.14)' : undefined }}>
              {isContents && <span style={{ position: 'absolute', left: 18, top: 18, width: 28, height: 28, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#eef2ff', color: '#4f46e5', fontSize: 12, fontWeight: 900 }}>{index + 1}</span>}
              <p style={{ margin: 0, display: isIngredients ? 'inline-flex' : undefined, width: isTechnology ? 'fit-content' : undefined, borderRadius: isIngredients || isTechnology ? 999 : undefined, padding: isIngredients ? '5px 10px' : isTechnology ? '4px 9px' : undefined, background: isIngredients ? 'rgba(20,184,166,0.10)' : isTechnology ? 'rgba(125,211,252,0.13)' : undefined, fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: isTechnology ? '#bae6fd' : textColor, opacity: isTechnology ? 1 : 0.68 }}>{item.label}</p>
              <div>
                <p style={{ margin: isSpecs ? 0 : '10px 0 0', fontSize: isTechnology ? '1.18rem' : '1.05rem', fontWeight: 850, color: isTechnology ? '#ffffff' : titleColor }}>{item.value}</p>
                {item.description && <p style={{ margin: '6px 0 0', fontSize: '0.9rem', lineHeight: 1.65, color: isTechnology ? 'rgba(226,232,240,0.78)' : textColor }}>{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
