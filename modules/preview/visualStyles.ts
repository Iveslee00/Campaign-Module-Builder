import type React from 'react';

export const premiumShadow = '0 22px 60px rgba(15,23,42,0.10)';
export const softBorder = '1px solid rgba(15,23,42,0.08)';
export const visualAccent = 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(14,165,198,0.14))';

export const glassPanel: React.CSSProperties = {
  background: 'rgba(255,255,255,0.78)',
  border: softBorder,
  boxShadow: premiumShadow,
  backdropFilter: 'blur(14px)',
};

export const hoverLift: React.CSSProperties = {
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
};

export const moduleSurface = (background?: string): React.CSSProperties => ({
  background: background && background !== 'transparent'
    ? background
    : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
  position: 'relative',
  overflow: 'hidden',
});

export const productCardSurface: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.86))',
  border: softBorder,
  borderRadius: 18,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 14px 36px rgba(15,23,42,0.08)',
};
