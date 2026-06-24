'use client';

import { HeroData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { getKvImageSpecs } from '@/lib/assets/imageSpecs';
import { PreviewImage } from './PreviewImage';

const heightMap = {
  small: { desktopRatio: '1200 / 300', mobileFullRatio: '750 / 370', mobileImgRatio: '750 / 210' },
  medium: { desktopRatio: '1200 / 400', mobileFullRatio: '750 / 460', mobileImgRatio: '750 / 260' },
  large: { desktopRatio: '1200 / 520', mobileFullRatio: '750 / 500', mobileImgRatio: '750 / 310' },
};

export function HeroPreview({ data }: { data: HeroData }) {
  const { isMobile } = useDevice();
  const { buttonColor } = useGlobalSettings();
  const titleStyle: React.CSSProperties = data.titleColor ? { color: data.titleColor } : {};
  const textStyle: React.CSSProperties = data.textColor ? { color: data.textColor } : {};
  const h = heightMap[data.height ?? 'medium'];
  const showText = data.showText !== false;
  const imageSpecs = getKvImageSpecs(data.height, showText);
  const imageSrc = isMobile ? (data.mobileImage || data.image) : data.image;
  const imageSpec = isMobile ? imageSpecs.mobile : imageSpecs.desktop;
  const imageLabel = isMobile ? 'KV M' : showText ? 'KV PC 圖片區' : 'KV PC 純 Banner';
  const textBg = data.backgroundColor || '#1a1a2e';
  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    overflow: 'hidden',
    background: textBg,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    ...(isMobile
      ? showText ? {} : { aspectRatio: h.mobileFullRatio }
      : { aspectRatio: h.desktopRatio }),
  };
  const hasBannerLink = Boolean(data.buttonLink && data.buttonLink !== '#');
  const heroImage = (
    <PreviewImage src={imageSrc} alt="" label={imageLabel} spec={imageSpec} tone="dark" />
  );

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center',
    padding: '12px 28px', background: buttonColor, color: '#fff',
    borderRadius: '8px', fontWeight: 600, fontSize: '15px', lineHeight: 1, cursor: 'default',
  };

  return (
    <section style={sectionStyle}>
      {!showText ? (
        <div style={{ position: 'relative', flex: '1 1 auto', overflow: 'hidden' }}>
          {hasBannerLink ? (
            <a href={data.buttonLink} style={{ position: 'absolute', inset: 0, display: 'block', cursor: 'pointer' }}>
              {heroImage}
            </a>
          ) : heroImage}
        </div>
      ) : (
        <>
          {isMobile && (
            <div style={{ aspectRatio: h.mobileImgRatio, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
              {heroImage}
            </div>
          )}
          <div style={{ flex: isMobile ? '0 0 auto' : '0 0 35%', background: textBg, color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? '20px 18px' : '0 36px 0 44px', overflow: 'hidden' }}>
            {data.kicker && <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', opacity: 0.65, marginBottom: '14px', ...textStyle }}>{data.kicker}</span>}
            <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 800, lineHeight: 1.15, margin: '0 0 10px', color: '#ffffff', ...titleStyle }}>{data.title || 'KV 標題'}</h1>
            {data.subtitle && <p style={{ fontSize: isMobile ? '0.85rem' : '0.95rem', lineHeight: 1.6, opacity: 0.85, margin: '0 0 16px', ...textStyle }}>{data.subtitle}</p>}
            {data.buttonText && <span style={btnStyle}>{data.buttonText}</span>}
          </div>
          {!isMobile && (
            <div style={{ flex: '0 0 65%', position: 'relative', overflow: 'hidden' }}>
              {heroImage}
            </div>
          )}
        </>
      )}
    </section>
  );
}
