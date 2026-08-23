"use client";

import { useState } from 'react';
import { X, ShoppingCart, Check } from 'lucide-react';

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
  onAddToCart?: (selectedImage?: string) => void;
}

export default function ProductImageCarousel({
  images,
  productName,
  price,
  description,
  onClose,
  onAddToCart
}: ProductImageCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Logo por defecto desde public/logo.png
  const defaultImage = '/logo.png';
  
  // Si no hay imágenes, usar el logo (mostrarlo 5 veces para el efecto 3D)
  const displayImages = images.length > 0 ? images.slice(0, 5) : [
    { id: 0, product_id: 0, image_url: defaultImage, display_order: 0 },
    { id: 1, product_id: 0, image_url: defaultImage, display_order: 1 },
    { id: 2, product_id: 0, image_url: defaultImage, display_order: 2 },
    { id: 3, product_id: 0, image_url: defaultImage, display_order: 3 },
    { id: 4, product_id: 0, image_url: defaultImage, display_order: 4 }
  ];

  const totalImages = displayImages.length;
  const angleStep = 360 / totalImages;
  const radius = 180; // Radio reducido para juntar las imágenes

  const handleImageSelect = (index: number, imageUrl: string) => {
    setSelectedImageIndex(index);
    setIsPaused(true);
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
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }} 
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
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
          <X size={20} />
        </button>

        {/* Carrusel 3D con fondo gris claro con morado */}
        <div style={{
          height: '500px',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #e9d5ff 50%, #f3f4f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          perspective: '1000px'
        }}>
          
          {/* Contenedor rotatorio con animación CSS continua */}
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
              const angle = index * angleStep;
              const isSelected = selectedImageIndex === index;
              
              return (
                <div
                  key={image.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageSelect(index, image.image_url);
                  }}
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
                    transition: 'box-shadow 0.3s ease',
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
                  
                  {/* Badge de selección */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      background: '#9333ea',
                      color: 'white',
                      borderRadius: '50%',
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}>
                      <Check size={16} strokeWidth={3} />
                    </div>
                  )}
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

        {/* Info del producto y botón de agregar */}
        <div style={{padding: '2rem'}}>
          <h2 style={{fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem', color: '#3D2914'}}>{productName}</h2>
          {description && <p style={{color: '#6b7280', marginBottom: '1rem', lineHeight: '1.6'}}>{description}</p>}
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginTop: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Precio</p>
              <p style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#16a34a'}}>${price.toLocaleString('es-CO')}</p>
            </div>
            
            <button
              onClick={handleAddToCart}
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '1.25rem',
                background: selectedImageIndex !== null ? '#16a34a' : '#6B2D8B',
                color: 'white',
                border: 'none',
                borderRadius: '1rem',
                fontWeight: 'bold',
                fontSize: '1.1rem',
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
              <ShoppingCart size={24} />
              {selectedImageIndex !== null 
                ? '✅ Agregar Producto al Carrito' 
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
              ✅ Imagen {selectedImageIndex + 1} seleccionada
            </p>
          )}
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