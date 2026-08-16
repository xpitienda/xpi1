'use client';

import { useState } from 'react';
import ProductCarousel from './components/ProductCarousel';
import ProductFullscreen from './components/ProductFullscreen';
import ViewToggle from './components/ViewToggle';
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

interface CatalogContentProps {
  products: Product[];
}

function SimpleProductGrid({ products, onProductClick }: { products: Product[]; onProductClick: (product: Product) => void }) {
  const { addToCart, isInCart, setIsCartOpen } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '2rem',
      marginTop: '2rem',
      padding: '0 1rem'
    }}>
      {products.map((product) => {
        const inCart = isInCart(product.id);
        return (
          <div
            key={product.id}
            style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
            onClick={() => handleProductClick(product)}
          >
            <div style={{ position: 'relative', width: '100%', height: '280px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {product.image_url && product.image_url.trim() !== '' ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>📦</div>
                  <p style={{ fontSize: '0.875rem' }}>Sin imagen</p>
                </div>
              )}
            </div>

            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 'bold', 
                marginBottom: '0.75rem',
                color: '#1f2937',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.4',
                minHeight: '3rem'
              }}>
                {product.name}
              </h3>
              
              <p style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#16a34a',
                marginBottom: '0.75rem'
              }}>
                ${product.price.toLocaleString('es-CO')}
              </p>

              {product.stock > 0 ? (
                <p style={{ fontSize: '0.8rem', color: '#16a34a', marginBottom: '1rem' }}>
                   Stock: {product.stock} unidades
                </p>
              ) : (
                <p style={{ fontSize: '0.8rem', color: '#dc2626', marginBottom: '1rem' }}>
                   Agotado
                </p>
              )}

              {product.stock > 0 && (
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    background: inCart ? '#8B5CF6' : '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
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
  );
}

export default function CatalogContent({ products }: CatalogContentProps) {
  const [view, setView] = useState<'carousel' | 'list'>('carousel');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <ViewToggle currentView={view} onViewChange={setView} />

      {view === 'carousel' ? (
        <ProductCarousel 
          products={products} 
          onProductClick={handleProductClick}
        />
      ) : (
        <SimpleProductGrid 
          products={products} 
          onProductClick={handleProductClick}
        />
      )}

      {selectedProduct && (
        <ProductFullscreen 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}