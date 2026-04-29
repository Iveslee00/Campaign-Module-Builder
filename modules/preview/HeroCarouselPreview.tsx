'use client';

import { useState, useEffect, useCallback } from 'react';
import { HeroCarouselData } from '@/types/modules';
import { useDevice } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PLACEHOLDER = 'https://placehold.co/1200x600/1a1a2e/6366f1?text=KV+Banner';

const heightMap = {
  small:  { desktop: '360px', mobile: '420px', mobileImg: '210px' },
  medium: { desktop: '500px', mobile: '520px', mobileImg: '260px' },
  large:  { desktop: '640px', mobile: '620px', mobileImg: '320px' },
};

export function HeroCarouselPreview({ data }: { data: HeroCarouselData }) {
  const { isMobile } = useDevice();
  const { buttonColor } = useGlobalSettings();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = data.slides;
  const total = slides.length;
  const h = heightMap[data.height ?? 'medium'];
  const slideH = isMobile ? h.mobile : h.desktop;

  const goTo = useCallback((idx: number) => setCurrent((idx + total) % total), [total]);
  const prev = () => { setPaused(true); goTo(current - 1); };
  const next = () => { setPaused(true); goTo(current + 1); };

  useEffect(() => {
    if (!data.autoPlay || paused || total <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % total), 4000);
    return () => clearInterval(id);
  }, [data.autoPlay, paused, total]);

  useEffect(() => {
    if (!paused) return;
    const id = setTimeout(() => setPaused(false), 6000);
    return () => clearTimeout(id);
  }, [paused, current]);

  if (!total) {
    return (
      <section style={{ background: data.backgroundColor || '#1a1a2e', height: slideH, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>尚未新增任何 slide</p>
      </section>
    );
  }

  const navBtn: React.CSSProperties = {
    position: 'absolute',
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)',
    border: '1px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 3, color: '#fff',
  };

  // Nav & dots live in the image area
  const imgCenterTop = isMobile ? `calc(${h.mobileImg} / 2)` : '50%';
  const imgRight = '14px';
  const imgLeft = isMobile ? '8px' : 'calc(55% - 50px)'; // near the boundary of image panel

  return (
    <section
      style={{ position: 'relative', overflow: 'hidden', background: data.backgroundColor || '#1a1a2e', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', pointerEvents: 'auto' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides strip */}
      <div style={{ display: 'flex', transform: `translateX(-${current * 100}%)`, transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)', height: slideH }}>
        {slides.map((s) => {
          const textBg = s.textBgColor || '#1a1a2e';
          const overlay = s.overlayOpacity ? `rgba(0,0,0,${s.overlayOpacity / 100})` : undefined;
          const align = s.alignment ?? 'left';
          const alignStyle: React.CSSProperties =
            align === 'center' ? { textAlign: 'center', alignItems: 'center' }
            : align === 'right' ? { textAlign: 'right', alignItems: 'flex-end' }
            : { textAlign: 'left', alignItems: 'flex-start' };

          const imageEl = (
            <img
              src={s.image || PLACEHOLDER}
              alt={s.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
            />
          );

          return (
            <div
              key={s.id}
              style={{
                flex: '0 0 100%',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                height: slideH,
              }}
            >
              {/* Mobile: image on top */}
              {isMobile && (
                <div style={{ height: h.mobileImg, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  {imageEl}
                  {overlay && <div style={{ position: 'absolute', inset: 0, background: overlay }} />}
                </div>
              )}

              {/* Text panel — left on desktop, bottom on mobile */}
              <div
                style={{
                  background: textBg,
                  flex: isMobile ? '1 0 0' : '0 0 45%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: isMobile ? '24px 20px' : '0 48px 0 56px',
                  overflow: 'hidden',
                  ...alignStyle,
                }}
              >
                {s.title && (
                  <h1 style={{ fontSize: isMobile ? '1.3rem' : '2rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.025em', color: s.titleColor || '#ffffff', marginBottom: '10px' }}>
                    {s.title}
                  </h1>
                )}
                {s.subtitle && (
                  <p style={{ fontSize: isMobile ? '0.85rem' : '0.95rem', lineHeight: 1.65, color: s.textColor || 'rgba(255,255,255,0.85)', marginBottom: '20px', maxWidth: '400px' }}>
                    {s.subtitle}
                  </p>
                )}
                {s.buttonText && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: isMobile ? '9px 20px' : '12px 26px', background: buttonColor, color: '#fff', borderRadius: '8px', fontWeight: 700, fontSize: isMobile ? '13px' : '14px', cursor: 'default' }}>
                    {s.buttonText}
                  </span>
                )}
              </div>

              {/* Desktop: image on the right */}
              {!isMobile && (
                <div style={{ flex: '0 0 55%', position: 'relative', overflow: 'hidden' }}>
                  {imageEl}
                  {overlay && <div style={{ position: 'absolute', inset: 0, background: overlay }} />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prev/Next — anchored in image area */}
      {total > 1 && (
        <>
          <button onClick={prev} style={{ ...navBtn, left: imgLeft, top: imgCenterTop, transform: 'translateY(-50%)' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={next} style={{ ...navBtn, right: imgRight, top: imgCenterTop, transform: 'translateY(-50%)' }}>
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Dots — anchored at bottom of image area */}
      {total > 1 && (
        <div style={{
          position: 'absolute',
          bottom: isMobile ? `calc(${slideH} - ${h.mobileImg} + 14px)` : '16px',
          left: isMobile ? '50%' : 'calc(45% + 27.5%)',
          transform: 'translateX(-50%)',
          display: 'flex', gap: '7px', zIndex: 3,
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPaused(true); goTo(i); }}
              style={{ width: i === current ? '22px' : '7px', height: '7px', borderRadius: '4px', background: i === current ? '#ffffff' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.3s, background 0.3s' }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
