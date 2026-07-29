const fs = require('fs');
const path = require('path');

const content = `'use client';

import { useState, useEffect } from 'react';

export default function AdvancedBannersCarousel({ banners }) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

        {/* Indicadores (puntos) */}
        {banners.length > 1 && (
          <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
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
      </div>
    </div>
  );
}
`;

const componentsDir = path.join(process.cwd(), 'components');
fs.mkdirSync(componentsDir, { recursive: true });
fs.writeFileSync(path.join(componentsDir, 'AdvancedBannersCarousel.tsx'), content, 'utf8');
console.log('✅ Componente AdvancedBannersCarousel creado en components/');
