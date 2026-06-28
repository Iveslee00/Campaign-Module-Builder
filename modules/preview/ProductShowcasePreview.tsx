'use client';

import { ProductShowcaseData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { PreviewImage } from './PreviewImage';

export function ProductShowcasePreview({ data }: { data: ProductShowcaseData }) {
  const { isMobile } = useDevice();
  const { buttonColor, buttonTextColor } = useGlobalSettings();
  const imageSrc = isMobile ? (data.mobileImage || data.image) : data.image;
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  const isFull = data.style === 'full-bleed';
  const isLuxury = data.style === 'luxury';
  const isSpacious = data.style === 'spacious';
  const isSplit = data.style === 'split' || data.style === 'luxury';
  const sectionBackground = data.backgroundColor || (isLuxury ? 'linear-gradient(135deg, #f8fbff 0%, #eaf7ff 48%, #fff7ed 100%)' : '#eefaff');

  const content = (
    <div style={{
      position: 'relative',
      zIndex: 1,
      maxWidth: isFull ? 540 : isSpacious ? 680 : 460,
      margin: isSpacious ? '0 auto' : undefined,
      textAlign: isSpacious ? 'center' : 'left',
      padding: isLuxury && !isMobile ? '36px 34px' : undefined,
      borderRadius: isLuxury && !isMobile ? 30 : undefined,
      background: isLuxury && !isMobile ? 'rgba(255,255,255,0.72)' : undefined,
      boxShadow: isLuxury && !isMobile ? '0 24px 70px rgba(15,23,42,0.10)' : undefined,
      backdropFilter: isLuxury && !isMobile ? 'blur(12px)' : undefined,
    }}>
      {data.eyebrow && <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: textColor, opacity: 0.72 }}>{data.eyebrow}</p>}
      <h2 style={{ margin: 0, fontSize: isMobile ? '2rem' : isFull ? '3.35rem' : '3rem', lineHeight: 1.05, fontWeight: 900, color: titleColor }}>{data.title}</h2>
      {data.subtitle && <p style={{ margin: '14px 0 0', fontSize: '1.05rem', lineHeight: 1.65, fontWeight: 650, color: textColor }}>{data.subtitle}</p>}
      {data.description && <p style={{ margin: '12px 0 0', fontSize: '0.96rem', lineHeight: 1.75, color: textColor, opacity: 0.86 }}>{data.description}</p>}
      {data.buttonText && <span style={{ display: 'inline-flex', marginTop: 24, padding: '12px 22px', borderRadius: 999, background: buttonColor, color: buttonTextColor, fontSize: 15, fontWeight: 800 }}>{data.buttonText}</span>}
    </div>
  );

  const media = (
    <div style={{
      position: 'relative',
      aspectRatio: isMobile ? '750 / 900' : isFull ? '1920 / 740' : '1 / 1',
      borderRadius: isFull ? 0 : isLuxury ? 36 : 28,
      overflow: 'hidden',
      minHeight: isMobile ? undefined : isFull ? 520 : undefined,
      background: isLuxury ? 'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.98), rgba(224,242,254,0.78) 52%, rgba(219,234,254,0.62))' : '#eef2ff',
      boxShadow: !isFull ? '0 24px 70px rgba(15,23,42,0.12)' : undefined,
    }}>
      {isLuxury && <div style={{ position: 'absolute', inset: '12%', borderRadius: '50%', background: 'rgba(125,211,252,0.24)', filter: 'blur(34px)' }} />}
      <PreviewImage src={imageSrc} alt="" label={isMobile ? '商品展示 M' : '商品展示 PC'} spec={isMobile ? IMAGE_SPECS.productShowcaseMobile : IMAGE_SPECS.productShowcase} objectFit={isLuxury ? 'contain' : 'cover'} />
    </div>
  );

  const layout = isMobile || !isSplit
    ? <>{media}<div style={{ padding: isFull ? '28px 0 0' : 0 }}>{content}</div></>
    : data.reverse ? <>{media}{content}</> : <>{content}{media}</>;

  return (
    <section style={{ background: sectionBackground, padding: isFull ? 0 : isMobile ? '36px 16px' : isLuxury ? '76px 24px' : '64px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: isFull ? 'none' : '1080px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isSplit ? (isLuxury ? '1fr 0.95fr' : '0.9fr 1.1fr') : '1fr', gap: isMobile ? 28 : isSpacious ? 42 : 56, alignItems: 'center', padding: isFull ? (isMobile ? '0 16px 38px' : '0 0 56px') : 0 }}>
        {layout}
      </div>
    </section>
  );
}
