'use client';

import {
  ProductBenefitsData,
  ProductComparisonData,
  ProductProofData,
  ProductPurchaseData,
  ProductStepsData,
} from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { PreviewImage } from './PreviewImage';
import { moduleSurface } from './visualStyles';

const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

function ProductHead({ eyebrow, title, subtitle, titleColor, textColor, centered = false }: {
  eyebrow: string; title: string; subtitle: string; titleColor: string; textColor: string; centered?: boolean;
}) {
  return (
    <div style={{ maxWidth: 720, margin: centered ? '0 auto 30px' : '0 0 30px', textAlign: centered ? 'center' : 'left' }}>
      {eyebrow && <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: textColor, opacity: 0.72 }}>{eyebrow}</p>}
      <h2 style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1.08, fontWeight: 900, color: titleColor }}>{title}</h2>
      {subtitle && <p style={{ margin: '14px 0 0', fontSize: '1rem', lineHeight: 1.7, color: textColor }}>{subtitle}</p>}
    </div>
  );
}

export function ProductBenefitsPreview({ data }: { data: ProductBenefitsData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  const columns = isMobile ? '1fr' : data.style === 'stacked' ? '1fr' : 'repeat(3, 1fr)';
  const isStacked = data.style === 'stacked';
  const isPainSolution = data.style === 'pain-solution';
  const cardBackground = isPainSolution
    ? 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(239,246,255,0.86))'
    : isStacked
      ? 'rgba(255,255,255,0.82)'
      : 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.72))';
  return (
    <section style={{ ...moduleSurface(data.backgroundColor || '#ffffff'), padding: isMobile ? '36px 16px' : '58px 24px', fontFamily }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <ProductHead {...data} titleColor={titleColor} textColor={textColor} />
        <div style={{ display: 'grid', gridTemplateColumns: columns, gap: 18 }}>
          {data.items.map((item) => (
            <article key={item.id} style={{ position: 'relative', display: isStacked && !isMobile ? 'grid' : 'block', gridTemplateColumns: isStacked && !isMobile ? '92px 1fr' : undefined, gap: isStacked ? 22 : undefined, borderRadius: isPainSolution ? 28 : 26, padding: isMobile ? 20 : isStacked ? 26 : 28, background: cardBackground, border: isPainSolution ? '1px solid rgba(79,70,229,0.14)' : '1px solid rgba(15,23,42,0.08)', boxShadow: isPainSolution ? '0 22px 58px rgba(79,70,229,0.10)' : '0 18px 48px rgba(15,23,42,0.08)', overflow: 'hidden', backdropFilter: isStacked ? 'blur(10px)' : undefined }}>
              {isPainSolution && <span style={{ position: 'absolute', right: -24, top: -24, width: 86, height: 86, borderRadius: 999, background: 'rgba(79,70,229,0.10)' }} />}
              <p style={{ display: 'inline-flex', width: isStacked ? 68 : undefined, height: isStacked ? 68 : undefined, alignItems: isStacked ? 'center' : undefined, justifyContent: isStacked ? 'center' : undefined, borderRadius: isStacked ? 24 : undefined, background: isStacked ? 'linear-gradient(135deg, rgba(248,250,252,0.96), rgba(255,255,255,0.74))' : undefined, margin: '0 0 18px', fontSize: data.style === 'metric-cards' ? '2rem' : '0.9rem', fontWeight: 900, color: titleColor, opacity: data.style === 'metric-cards' || isStacked ? 1 : 0.68 }}>{item.metric}</p>
              <div>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.12rem', fontWeight: 850, color: titleColor }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7, color: textColor }}>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductStepsPreview({ data }: { data: ProductStepsData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  const isTimeline = data.style === 'timeline';
  return (
    <section style={{ ...moduleSurface(data.backgroundColor || '#ffffff'), padding: isMobile ? '36px 16px' : '58px 24px', fontFamily }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <ProductHead {...data} titleColor={titleColor} textColor={textColor} />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTimeline ? '1fr' : `repeat(${Math.min(data.items.length, 3)}, 1fr)`, gap: 18 }}>
          {isTimeline && !isMobile && <span style={{ position: 'absolute', left: 49, top: 34, bottom: 34, width: 2, background: 'linear-gradient(180deg, rgba(15,23,42,0.06), rgba(99,102,241,0.24), rgba(15,23,42,0.06))' }} />}
          {data.items.map((item) => (
            <article key={item.id} style={{ position: 'relative', display: isTimeline && !isMobile ? 'grid' : 'block', gridTemplateColumns: '120px 1fr', gap: 18, borderRadius: 26, padding: 22, background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 16px 42px rgba(15,23,42,0.07)' }}>
              <div style={{ display: 'inline-flex', width: 54, height: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 18, background: 'linear-gradient(135deg, #e0f2fe, #eef2ff)', fontSize: '1.35rem', lineHeight: 1, fontWeight: 900, color: titleColor }}>{item.step}</div>
              <div>
                {data.style === 'image-cards' && (
                  <div style={{ position: 'relative', aspectRatio: isMobile ? '750 / 900' : '900 / 640', marginBottom: 16, overflow: 'hidden', borderRadius: 16 }}>
                    <PreviewImage src={isMobile ? (item.mobileImage || item.image) : item.image} alt="" label={isMobile ? '步驟圖 M' : '步驟圖 PC'} spec={isMobile ? IMAGE_SPECS.productSceneMobile : IMAGE_SPECS.productScene} variant="scene" />
                  </div>
                )}
                <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 850, color: titleColor }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: 1.7, color: textColor }}>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductComparisonPreview({ data }: { data: ProductComparisonData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  const isBeforeAfter = data.style === 'before-after';
  return (
    <section style={{ ...moduleSurface(data.backgroundColor || '#ffffff'), padding: isMobile ? '36px 16px' : '58px 24px', fontFamily }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <ProductHead {...data} titleColor={titleColor} textColor={textColor} centered={isBeforeAfter} />
        <div style={{ overflow: 'hidden', borderRadius: 26, border: '1px solid rgba(15,23,42,0.08)', background: '#ffffff', boxShadow: '0 20px 56px rgba(15,23,42,0.09)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', background: isBeforeAfter ? 'linear-gradient(135deg, #111827, #334155)' : 'linear-gradient(135deg, #f8fafc, #eef6ff)', color: isBeforeAfter ? '#ffffff' : titleColor, fontWeight: 850 }}>
            <div style={{ padding: '16px 18px' }}>項目</div>
            <div style={{ padding: '16px 18px' }}>{data.beforeTitle}</div>
            <div style={{ padding: '16px 18px' }}>{data.afterTitle}</div>
          </div>
          {data.items.map((item) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr 1fr', borderTop: '1px solid rgba(15,23,42,0.08)' }}>
              <strong style={{ padding: '16px 18px', color: titleColor }}>{item.label}</strong>
              <p style={{ margin: 0, padding: '16px 18px', color: textColor }}>{item.before}</p>
              <p style={{ margin: 0, padding: '16px 18px', color: isBeforeAfter ? titleColor : textColor, fontWeight: isBeforeAfter ? 760 : undefined, background: isBeforeAfter ? 'rgba(14,165,198,0.08)' : undefined }}>{item.after}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductProofPreview({ data }: { data: ProductProofData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#0f172a';
  const textColor = data.textColor || '#475569';
  const isGuarantee = data.style === 'guarantee';
  const isReviews = data.style === 'reviews';
  return (
    <section style={{ ...moduleSurface(data.backgroundColor || '#ffffff'), padding: isMobile ? '36px 16px' : '58px 24px', fontFamily }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <ProductHead {...data} titleColor={titleColor} textColor={textColor} centered />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 18 }}>
          {data.items.map((item) => (
            <article key={item.id} style={{ borderRadius: isGuarantee ? 999 : 26, padding: isGuarantee ? '26px 28px' : 26, background: isReviews ? 'linear-gradient(180deg, #ffffff, #f8fafc)' : '#ffffff', border: isGuarantee ? '1px solid rgba(245,158,11,0.26)' : '1px solid rgba(15,23,42,0.08)', textAlign: 'center', boxShadow: isGuarantee ? '0 18px 48px rgba(245,158,11,0.10)' : '0 18px 48px rgba(15,23,42,0.08)' }}>
              <div style={{ display: 'inline-flex', minWidth: isGuarantee ? 74 : 60, height: isGuarantee ? 48 : 60, alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: isGuarantee ? 'linear-gradient(135deg, #fef3c7, #ffffff)' : 'linear-gradient(135deg, #e0f2fe, #eef2ff)', padding: '0 14px', fontWeight: 900, color: titleColor, marginBottom: 16, boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.12)' }}>{item.badge}</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.08rem', fontWeight: 850, color: titleColor }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: 1.7, color: textColor }}>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductPurchasePreview({ data }: { data: ProductPurchaseData }) {
  const { isMobile } = useDevice();
  const titleColor = data.titleColor || '#ffffff';
  const textColor = data.textColor || 'rgba(255,255,255,0.78)';
  const isCta = data.style === 'cta';
  return (
    <section style={{ ...moduleSurface(data.backgroundColor || '#0f172a'), padding: isMobile ? '40px 16px' : '64px 24px', fontFamily }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', color: textColor }}>
        <ProductHead {...data} titleColor={titleColor} textColor={textColor} centered={isCta} />
        <div style={{ textAlign: isCta ? 'center' : 'left', marginBottom: 28 }}>
          <a href={data.buttonLink || '#'} style={{ display: 'inline-flex', minHeight: isCta ? 56 : 48, alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: '#ffffff', color: '#0f172a', padding: isCta ? '0 40px' : '0 32px', fontWeight: 850, textDecoration: 'none', boxShadow: isCta ? 'none' : '0 16px 36px rgba(0,0,0,0.18)' }}>{data.buttonText}</a>
        </div>
        {data.style !== 'cta' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(data.products.length, 3)}, 1fr)`, gap: 18 }}>
            {data.products.map((product) => (
              <article key={product.id} style={{ overflow: 'hidden', borderRadius: 22, background: '#ffffff', color: '#0f172a', boxShadow: '0 18px 48px rgba(0,0,0,0.18)' }}>
                <div style={{ position: 'relative', aspectRatio: '1 / 1', background: '#eef2ff' }}>
                  <PreviewImage src={product.image} alt="" label="商品圖" spec={IMAGE_SPECS.product} objectFit="contain" variant="product" />
                </div>
                <div style={{ padding: 16 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 750, color: '#64748b' }}>{product.brand}</p>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 850 }}>{product.name}</h3>
                  <p style={{ margin: 0, fontWeight: 900, color: '#ef4444' }}>{product.salePrice}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
