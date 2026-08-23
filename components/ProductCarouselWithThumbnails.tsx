"use client";

import { useState, useRef } from 'react';

interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  display_order: number;
}

interface ProductCarouselWithThumbnailsProps {
  images: ProductImage[];
  productName: string;
  price: number;
  description?: string;
  onClose: () => void;
  onAddToCart?: (selectedImage?: string) => void;
}

export default function ProductCarouselWithThumbnails({
  images,
  productName,
  price,
  description,
  onClose,
  onAddToCart
}: ProductCarouselWithThumbnailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Logo por defecto
  const defaultImage = '/logo.png';
  
  const displayImages = images.length > 0 ? images.slice(0, 5) : [
    { id: 0, product_id: 0, image_url: defaultImage, display_order: 0 },
    { id: 1, product_id: 0, image_url: defaultImage, display_order: 1 },
    { id: 2, product_id: 0, image_url: defaultImage, display_order: 2 },
    { id: 3, product_id: 0, image_url: defaultImage, display_order: 3 },
    { id: 4, product_id: 0, image_url: defaultImage, display_order: 4 }
  ];

  const handleThumbnailClick = (index: number, imageUrl: string) => {
    setSelectedImageIndex(index);
    setIsPaused(true);
    
    if (thumbnailsRef.current) {
      const thumbnailElement = thumbnailsRef.current.children[index] as HTMLElement;
      if (thumbnailElement) {
        thumbnailElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleAddToCart = () => {
    let selectedImage: string | undefined;
    if (selectedImageIndex !== null && displayImages[selectedImageIndex]) {
      selectedImage = displayImages[selectedImageIndex].image_url;
    }
    onAddToCart?.(selectedImage);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: '0',
      zIndex: 100000,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }} onClick={onClose}>
      
      <div 
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          maxWidth: '1100px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          display: 'flex',
          gap: '1.5rem',
          padding: '2rem'
        }} 
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '2.5rem',
            height: '2.5rem',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: 10,
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>

        {/* MINIATURAS VERTICALES */}
        <div 
          ref={thumbnailsRef}
          style={{
            width: '120px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            overflowY: 'auto',
            maxHeight: '500px',
            paddingRight: '0.5rem'
          }}
        >
          {displayImages.map((image, index) => {
            const isSelected = selectedImageIndex === index;
            
            return (
              <div
                key={image.id}
                onClick={() => handleThumbnailClick(index, image.image_url)}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isSelected ? '3px solid #9333ea' : '2px solid transparent',
                  boxShadow: isSelected ? '0 4px 12px rgba(147, 51, 234, 0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  opacity: isSelected ? 1 : 0.7,
                  flexShrink: 0,
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.opacity = '0.9';
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.opacity = '0.7';
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                  }
                }}
              >
                <img
                  src={image.image_url}
                  alt={`Vista ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: '#9333ea',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}>
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CARRUSEL 3D ORIGINAL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            flex: 1,
            height: '500px',
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e9d5ff 50%, #f3f4f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            perspective: '1000px',
            borderRadius: '1rem'
          }}>
            
            <div 
              style={{
                position: 'relative',
                width: '200px',
                height: '200px',
                transformStyle: 'preserve-3d',
                animation: `spin3d 15s linear infinite`,
                animationPlayState: isPaused ? 'paused' : 'running'
              }}
            >
              {displayImages.map((image, index) => {
                const angle = index * (360 / displayImages.length);
                const radius = 180;
                const isSelected = selectedImageIndex === index;
                
                return (
                  <div
                    key={image.id}
                    style={{
                      position: 'absolute',
                      width: '200px',
                      height: '200px',
                      left: '0',
                      top: '0',
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                      backfaceVisibility: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'white',
                      borderRadius: '1rem',
                      boxShadow: isSelected
                        ? '0 10px 40px rgba(107, 45, 139, 0.6), 0 0 0 4px #9333ea'
                        : '0 10px 30px rgba(107, 45, 139, 0.3)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isSelected ? '3px solid #9333ea' : '2px solid transparent'
                    }}
                  >
                    <img
                      src={image.image_url}
                      alt={`${productName} - ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '1rem'
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Indicadores */}
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '0.75rem',
              zIndex: 10
            }}>
              {displayImages.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    borderRadius: '9999px',
                    background: index === selectedImageIndex ? '#9333ea' : '#d1d5db',
                    transition: 'background 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Info del producto y botón */}
          <div style={{ padding: '1.5rem 0 0 0', marginTop: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#3D2914' }}>{productName}</h2>
            {description && <p style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: '1.6' }}>{description}</p>}
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Precio</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#16a34a' }}>${price.toLocaleString('es-CO')}</p>
              </div>
              
              <button
                onClick={handleAddToCart}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  maxWidth: '350px',
                  padding: '0.9rem 1.5rem',
                  background: selectedImageIndex !== null ? '#16a34a' : '#6B2D8B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '1rem',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
              >
                {selectedImageIndex !== null 
                  ? '✅ Agregar producto al carrito' 
                  : '🛒 Agregar al carrito'}
              </button>
            </div>
            
            {selectedImageIndex !== null && (
              <p style={{
                textAlign: 'center',
                color: '#9333ea',
                fontSize: '0.875rem',
                marginTop: '1rem',
                fontWeight: '600'
              }}>
                ✅ Producto seleccionado
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin3d {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
}