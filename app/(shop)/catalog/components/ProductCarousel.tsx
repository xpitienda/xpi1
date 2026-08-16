'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

interface ProductCarouselProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductCarousel({ products, onProductClick }: ProductCarouselProps) {
  const { addToCart, isInCart, setIsCartOpen } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ FUNCIÓN AGREGAR AL CARRITO (igual que en modo lista)
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true); // Abrir carrito flotante automáticamente
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const cardWidth = 300;
        const index = Math.round(scrollLeft / cardWidth);
        setCurrentIndex(Math.min(index, products.length - 1));
      }
    };

    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, [products.length]);

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0', position: 'relative' }}>
      {currentIndex > 0 && (
        <button
          onClick={scrollLeft}
          style={{
            position: 'absolute',
            left: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(147, 51, 234, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '3rem',
            height: '3rem',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          }}
        >
          
        </button>
      )}

      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: '1.5rem',
          padding: '1rem 3rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth',
        }}
      >
        {products.map((product) => {
          // ✅ VERIFICAR SI YA ESTÁ EN EL CARRITO
          const inCart = isInCart(product.id);
          
          return (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              style={{
                flex: '0 0 280px',
                scrollSnapAlign: 'center',
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              {/* Imagen con fallback - CLICKABLE para abrir modal fullscreen */}
              <div style={{ position: 'relative', width: '100%', height: '280px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {product.image_url && product.image_url.trim() !== '' ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>📦</div>
                    <p style={{ fontSize: '0.875rem' }}>Sin imagen</p>
                  </div>
                )}
              </div>

              <div style={{ padding: '1rem' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.5rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {product.name}
                </h3>

                <p style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#16a34a',
                  marginBottom: '0.5rem'
                }}>
                  ${product.price.toLocaleString('es-CO')}
                </p>

                {product.stock > 0 ? (
                  <p style={{ fontSize: '0.75rem', color: '#16a34a', marginBottom: '0.5rem' }}>
                     Stock: {product.stock}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.75rem', color: '#dc2626', marginBottom: '0.5rem' }}>
                    Agotado
                  </p>
                )}

                {/* ✅ BOTÓN AGREGAR AL CARRITO - CAMBIA DE COLOR (igual que modo lista) */}
                {product.stock > 0 && (
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: inCart ? '#8B5CF6' : '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = inCart ? '#7C3AED' : '#15803d'}
                    onMouseLeave={(e) => e.currentTarget.style.background = inCart ? '#8B5CF6' : '#16a34a'}
                  >
                    <span>{inCart ? '✅' : '🛒'}</span>
                    <span>{inCart ? 'Agregado al Carrito' : 'Agregar al Carrito'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {currentIndex < products.length - 1 && (
        <button
          onClick={scrollRight}
          style={{
            position: 'absolute',
            right: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(147, 51, 234, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '3rem',
            height: '3rem',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          }}
        >
          ›
        </button>
      )}

      <div style={{
        textAlign: 'center',
        marginTop: '1.5rem',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        {currentIndex + 1} / {products.length} productos
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '1rem'
      }}>
        {products.slice(0, 10).map((_, index) => (
          <div
            key={index}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: index === currentIndex ? '#9333ea' : '#d1d5db',
              transition: 'background 0.3s ease',
              cursor: 'pointer',
            }}
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ left: index * 300, behavior: 'smooth' });
              }
            }}
          />
        ))}
      </div>

      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}