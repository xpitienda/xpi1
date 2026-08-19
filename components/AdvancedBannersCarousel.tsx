'use client';

import { useState, useEffect } from 'react';

interface Banner {
  id: string;
  image_url: string;
  link_url: string | null;
  title: string;
}

interface Overlay {
  id: number;
  text: string;
  font_size: number;
  font_color: string;
  font_weight: string;
  background_color: string;
  animation_speed: number;
  direction: string;
  pause_on_hover: number;
  position?: string; // ✅ AHORA ES OPCIONAL
  starts_at: string;
  ends_at: string;
  is_active: number;
}

interface AdvancedBannersCarouselProps {
  banners: Banner[];
  overlays?: Overlay[];
}

export default function AdvancedBannersCarousel({ banners, overlays = [] }: AdvancedBannersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <div style={{ width: '100%', marginBottom: '2rem', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <div style={{ position: 'relative', width: '100%', height: '300px', background: '#000' }}>
        
        {/* Imágenes del carrusel */}
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {banner.link_url ? (
              <a href={banner.link_url} target="_blank" rel="noopener noreferrer" style={{ width: '100%', height: '100%', display: 'block' }}>
                <img src={banner.image_url} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </a>
            ) : (
              <img src={banner.image_url} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
        ))}

        {/* Puntos de navegación */}
        {banners.length > 1 && (
          <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
            ))}
          </div>
        )}

        {/* ✅ CAPA DE TEXTOS FLOTANTES (ROLLING) */}
        {overlays.map((overlay) => {
          const isLeft = overlay.direction === 'left';
          const animationName = isLeft ? 'rollLeft' : 'rollRight';
          
          // Estilo por defecto (centrado) si no hay posición definida
          let positionStyle: React.CSSProperties = { 
            top: '50%', 
            transform: 'translateY(-50%)', 
            textAlign: 'center', 
            width: '100%' 
          };

          if (overlay.position === 'top') positionStyle = { top: '10%', textAlign: 'center', width: '100%' };
          if (overlay.position === 'bottom') positionStyle = { bottom: '10%', textAlign: 'center', width: '100%' };

          return (
            <div 
              key={overlay.id} 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                pointerEvents: 'none', 
                overflow: 'hidden', 
                zIndex: 20 
              }}
            >
              <style>{`
                @keyframes rollLeft {
                  0% { left: 100%; }
                  100% { left: -100%; }
                }
                @keyframes rollRight {
                  0% { left: -100%; }
                  100% { left: 100%; }
                }
                .rolling-text-overlay {
                  animation: ${animationName} ${overlay.animation_speed}s linear infinite;
                  position: absolute;
                  white-space: nowrap;
                  pointer-events: auto;
                }
                .rolling-text-overlay:hover {
                  animation-play-state: ${overlay.pause_on_hover === 1 ? 'paused' : 'running'} !important;
                }
              `}</style>
              
              <div className="rolling-text-overlay" style={positionStyle}>
                <span style={{
                  color: overlay.font_color,
                  fontSize: `${overlay.font_size}px`,
                  fontWeight: overlay.font_weight,
                  backgroundColor: overlay.background_color,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'inline-block',
                  boxShadow: overlay.background_color === 'transparent' ? '0 2px 8px rgba(0,0,0,0.5)' : 'none'
                }}>
                  {overlay.text}
                </span>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}