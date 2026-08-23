'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ProductImageCarousel from '@/components/ProductImageCarousel';

interface ProductCardProps {
  product: any;
  viewMode?: 'grid' | 'list' | 'carousel';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart, isInCart, setIsCartOpen } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const isList = viewMode === 'list';
  const isCarousel = viewMode === 'carousel';
  const inCart = isInCart ? isInCart(product.id) : false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '1rem',
    border: '2px solid #1B8A3B',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: isList ? 'row' : 'column',
    height: isList ? 'auto' : '100%',
    position: 'relative',
  };

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: isList ? '200px' : '100%',
    height: isList ? '200px' : '240px',
    flexShrink: 0,
    background: '#f9fafb',
    cursor: 'pointer',
  };

  const contentStyle: React.CSSProperties = {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  };

  return (
    <>
      <div
        style={cardStyle}
        onMouseEnter={(e) => {
          if (!isCarousel) {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(107, 45, 139, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isCarousel) {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          }
        }}
      >
        <div style={imageContainerStyle} onClick={handleImageClick}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '3rem' }}>
              📦
            </div>
          )}

          {product.on_sale && product.sale_price && (
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              background: '#ef4444',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              OFERTA
            </div>
          )}

          <div style={{
            position: 'absolute',
            bottom: '0.5rem',
            right: '0.5rem',
            background: 'rgba(107, 45, 139, 0.85)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.5rem',
            fontSize: '0.7rem',
            fontWeight: 'bold',
          }}>
            🔍 Ver
          </div>
        </div>

        <div style={contentStyle}>
          <div>
            <h3 style={{
              fontSize: isList ? '1.25rem' : '1.1rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 0.5rem 0',
              lineHeight: '1.3',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {product.name}
            </h3>

            {product.description && isList && (
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: '0 0 1rem 0',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {product.description}
              </p>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {product.on_sale && product.sale_price ? (
                <>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1B8A3B' }}>
                    ${Number(product.sale_price).toLocaleString('es-CO')}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                    ${Number(product.original_price || product.price).toLocaleString('es-CO')}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1B8A3B' }}>
                  ${Number(product.price).toLocaleString('es-CO')}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                background: added || inCart ? '#6B2D8B' : '#1B8A3B',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
            >
              {added ? '✅ Agregado' : inCart ? '🛒 En carrito' : '🛒 Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '1.5rem',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '3px solid #1B8A3B',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              background: '#6B2D8B',
              padding: '1rem 1.5rem',
              borderRadius: '1.25rem 1.25rem 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                {product.name}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ×
              </button>
            </div>

            {/* ✅ IMAGEN CLICKABLE PARA ABRIR CARRUSEL 3D */}
            <div 
              style={{ position: 'relative', width: '100%', height: '400px', background: '#f9fafb', cursor: 'pointer' }}
              onClick={() => {
                console.log(' Click en imagen - Abriendo carrusel');
                setIsCarouselOpen(true);
              }}
            >
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>
                  
                </div>
              )}
              
              {/* Indicador visual de zoom */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.5')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
              >
                <div style={{
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '50%',
                  padding: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  fontSize: '1.5rem'
                }}>
                  🔍
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {product.description && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#6B2D8B', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Descripción</h3>
                  <p style={{ color: '#4b5563', lineHeight: '1.6', margin: 0 }}>{product.description}</p>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: '#F3E8FF',
                borderRadius: '1rem',
                border: '2px solid #1B8A3B',
                marginBottom: '1rem'
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Precio</p>
                  {product.on_sale && product.sale_price ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1B8A3B' }}>
                        ${Number(product.sale_price).toLocaleString('es-CO')}
                      </span>
                      <span style={{ fontSize: '1rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                        ${Number(product.original_price || product.price).toLocaleString('es-CO')}
                      </span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1B8A3B' }}>
                      ${Number(product.price).toLocaleString('es-CO')}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleAddToCart}
                  style={{
                    background: added || inCart ? '#6B2D8B' : '#1B8A3B',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '1rem',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  {added ? '✅ Agregado' : inCart ? '🛒 En carrito' : '🛒 Agregar al carrito'}
                </button>
              </div>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: '100%',
                  background: '#f3f4f6',
                  color: '#374151',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  fontWeight: 'bold',
                  border: '2px solid #d1d5db',
                  cursor: 'pointer',
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ CARRUSEL 3D - Se abre al hacer clic en la imagen del modal */}
      {isCarouselOpen && (
        <ProductImageCarousel
          images={product.additionalImages || []}
          productName={product.name}
          price={product.price}
          description={product.description || ''}
          onClose={() => {
            console.log('🔕 Cerrando carrusel');
            setIsCarouselOpen(false);
          }}
          onAddToCart={(selectedImage) => {
            console.log('🛒 Agregando al carrito', selectedImage ? `con imagen ${selectedImage}` : '');
            
            // Crear producto con la imagen seleccionada si existe
            const productToAdd = {
              ...product,
              image: selectedImage || product.image_url
            };
            
            addToCart(productToAdd);
            setIsCartOpen(true);
            setIsCarouselOpen(false);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
        />
      )}
    </>
  );
}