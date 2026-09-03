"use client";

import { useState, useEffect } from 'react';

interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  display_order: number;
}

interface ProductImageCarouselProps {
  images: ProductImage[];
  productName: string;
  price: number;
  description?: string;
  onClose: () => void;
  showCloseButton?: boolean;
}

export default function ProductImageCarousel({
  images,
  productName,
  price,
  description,
  onClose,
  showCloseButton = true
}: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Imagen por defecto (logo XPI Tienda)
  const defaultImage = '/logo.png';

  // ✅ CORRECCIÓN: Si no hay imágenes, mostrar 5 logos. Si hay, mostrar hasta 5.
  const displayImages = images.length > 0 
    ? images.slice(0, 5) 
    : Array(5).fill({
        id: 0,
        product_id: 0,
        image_url: defaultImage,
        display_order: 0
      });

  // Auto-rotación del carrusel
  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoRotating, displayImages.length]);

  const handleMouseEnter = () => setIsAutoRotating(false);
  const handleMouseLeave = () => setIsAutoRotating(true);

  const currentImage = displayImages[currentIndex];

  return (
    <div style={{
      position: showCloseButton ? 'fixed' : 'relative',
      inset: showCloseButton ? '0' : 'auto',
      zIndex: showCloseButton ? 10000 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: showCloseButton ? '1rem' : '0',
      background: showCloseButton ? 'rgba(0,0,0,0.8)' : 'transparent'
    }}>
      {showCloseButton && (
        <div
          style={{ position: 'absolute', inset: '0' }}
          onClick={onClose}
        />
      )}

      <div
        style={{
          position: 'relative',
          background: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '1000px',
          width: '100%',
          overflow: 'hidden',
          zIndex: showCloseButton ? 10 : 1,
          transform: isZoomed ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '1rem', right: '1rem', zIndex: 20,
              width: '2.5rem', height: '2.5rem', background: 'rgba(255,255,255,0.9)',
              border: 'none', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            ✕
          </button>
        )}

        {/* Carrusel */}
        <div style={{
          position: 'relative', height: showCloseButton ? '500px' : '600px',
          background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div
            onClick={() => setIsZoomed(!isZoomed)}
            style={{
              position: 'relative', width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'zoom-in', perspective: '1000px', transformStyle: 'preserve-3d'
            }}
          >
            <img
              src={currentImage.image_url}
              alt={productName}
              style={{
                maxWidth: '90%', maxHeight: '90%', objectFit: 'contain',
                transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                transition: 'transform 0.4s ease',
                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.2))'
              }}
            />
          </div>

          {/* Indicadores */}
          <div style={{
            position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '0.5rem'
          }}>
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: index === currentIndex ? '2rem' : '0.75rem', height: '0.75rem',
                  borderRadius: '9999px', border: 'none',
                  background: index === currentIndex ? '#9333ea' : '#d1d5db',
                  cursor: 'pointer', transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          {/* Flechas */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
            style={{
              position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
              width: '3rem', height: '3rem', background: 'rgba(255,255,255,0.9)', border: 'none',
              borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % displayImages.length)}
            style={{
              position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
              width: '3rem', height: '3rem', background: 'rgba(255,255,255,0.9)', border: 'none',
              borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            ›
          </button>
        </div>

        {/* Info del producto */}
        <div style={{ padding: '2rem', background: 'white' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
            {productName}
          </h2>

          {description && (
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              {description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#16a34a' }}>
              ${price.toLocaleString('es-CO')}
            </div>

            <a
              href={`https://wa.me/573234475311?text=Hola,%20me%20interesa:%20${encodeURIComponent(productName)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #25D366, #128C7E)', color: 'white', textDecoration: 'none',
                borderRadius: '9999px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                transition: 'transform 0.2s ease'
              }}
            >
              💬 Consultar
            </a>
          </div>

          {/* Miniaturas */}
          {displayImages.length > 1 && (
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {displayImages.map((img, index) => (
                <button
                  key={img.id || index}
                  onClick={() => setCurrentIndex(index)}
                  style={{
                    flexShrink: 0, width: '5rem', height: '5rem', borderRadius: '0.75rem',
                    overflow: 'hidden', border: index === currentIndex ? '3px solid #9333ea' : '3px solid #e5e7eb',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  <img src={img.image_url} alt={`Vista ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCloseButton && (
        <div style={{
          position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', textAlign: 'center'
        }}>
          <p>Click en la imagen para hacer zoom • Usa las flechas o miniaturas para navegar</p>
        </div>
      )}
    </div>
  );
}
