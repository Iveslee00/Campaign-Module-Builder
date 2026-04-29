'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { HeroCarouselData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PLACEHOLDER = 'https://placehold.co/1200x600/1a1a2e/6366f1?text=KV+Banner';

const heightMap = {
  small:  { desktop: '340px', mobile: '220px' },
  medium: { desktop: '480px', mobile: '300px' },
  large:  { desktop: '620px', mobile: '400px' },
};

export function HeroCarouselPreview({ data }: { data: HeroCarouselData }) {
  const { isMobile } = useDevice();
  const { buttonColor } = useGlobalSettings();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = data.slides;
  const total = slides.length;
  const h = heightMap[data.height ?? 'medium'];
  const slideHeight = isMobile ? h.mobile : h.desktop;

  const goTo = useCallback((idx: number) => setCurrent((idx + total) % total), [total]);
  const prev = () => { setPaused(true); goTo(current - 1); };
  const next = () => { setPaused(true); goTo(current + 1); };

  useEffect(() => {
    if (!data.autoPlay || paused || total <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % total), 4000);
    return () => clearInterval(id);
  }, [data.autoPlay, paused, total]);

  // resume auto-play after manual nav
  useEffect(() => {
    if (!paused) return;
    const id = setTimeout(() => setPaused(false), 6000);
    return () => clearTimeout(id);
  }, [paused, current]);

  if (!total) {
    return (
      <section style={{ background: data.backgroundColor || '#1a1a2e', height: slideHeight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>尚未新增任何 slide</p>
      </section>
    );
  }

  const slide = slides[current];
  const align = slide.alignment ?? 'center';
  const alignStyle: React.CSSProperties = align === 'left'
    ? { alignItems: 'flex-start', textAlign: 'left' }
    : align === 'right'
    ? { alignItems: 'flex-end', textAlign: 'right' }
    : { alignItems: 'center', textAlign: 'center' };

  const overlay = `rgba(0,0,0,${(slide.overlayOpacity ?? 40) / 100})`;

  return (
    <section
      style={{ position: 'relative', overflow: 'hidden', background: data.backgroundColor || '#1a1a2e', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', pointerEvents: 'auto' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides strip */}
      <div style={{ display: 'flex', transform: `translateX(-${current * 100}%)`, transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)', height: slideHeight }}>
        {slides.map((s, i) => (
          <div key={s.id} style={{ flex: '0 0 100%', position: 'relative', height: slideHeight }}>
            {/* BG image */}
            <img
              src={s.image || PLACEHOLDER}
              alt={s.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
            />
            {/* Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: overlay }} />
            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? '32px 24px' : '0 64px', ...alignStyle, maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
              {s.title && (
                <h1 style={{ fontSize: isMobile ? '1.6rem' : '2.75rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.025em', color: s.titleColor || '#ffffff', marginBottom: '12px' }}>
                  {s.title}
                </h1>
              )}
              {s.subtitle && (
                <p style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', lineHeight: 1.65, color: s.textColor || 'rgba(255,255,255,0.85)', marginBottom: '24px', maxWidth: '540px' }}>
                  {s.subtitle}
                </p>
              )}
              {s.buttonText && (
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: isMobile ? '10px 22px' : '13px 30px', background: buttonColor, color: '#fff', borderRadius: '8px', fontWeight: 700, fontSize: isMobile ? '13px' : '15px', cursor: 'default', alignSelf: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}>
                  {s.buttonText}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prev/Next */}
      {total > 1 && (
        <>
          <button onClick={prev} style={{ position: 'absolute', left: isMobile ? '8px' : '20px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3, color: '#fff' }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} style={{ position: 'absolute', right: isMobile ? '8px' : '20px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3, color: '#fff' }}>
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div style={{ position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 3 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPaused(true); goTo(i); }}
              style={{ width: i === current ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === current ? '#ffffff' : 'rgba(255,255,255,0.45)', border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.3s, background 0.3s' }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
