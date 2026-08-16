'use client';

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

interface ProductFullscreenProps {
  product: Product;
  onClose: () => void;
}

export default function ProductFullscreen({ product, onClose }: ProductFullscreenProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflow: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          animation: 'slideIn 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            fontSize: '1.5rem',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        <div style={{ position: 'relative', width: '100%', height: '400px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <div style={{ fontSize: '6rem', marginBottom: '0.5rem' }}>📦</div>
              <p style={{ fontSize: '1rem' }}>Sin imagen disponible</p>
            </div>
          )}
        </div>

        <div style={{ padding: '2rem' }}>
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            background: '#9333ea',
            color: 'white',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}>
            {product.category}
          </span>

          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '1rem',
            lineHeight: '1.3'
          }}>
            {product.name}
          </h2>

          <p style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            color: '#16a34a',
            marginBottom: '1.5rem'
          }}>
            ${product.price.toLocaleString('es-CO')}
          </p>

          <div style={{ 
            padding: '1rem', 
            background: '#f9fafb', 
            borderRadius: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ 
              fontSize: '1rem', 
              color: '#4b5563',
              lineHeight: '1.6'
            }}>
              {product.description}
            </p>
          </div>

          {product.stock > 0 ? (
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#16a34a',
              marginBottom: '2rem',
              fontWeight: '600'
            }}>
              ✅ Stock disponible: {product.stock} unidades
            </p>
          ) : (
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#dc2626',
              marginBottom: '2rem',
              fontWeight: '600'
            }}>
              ❌ Producto agotado
            </p>
          )}

          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '1rem',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1.1rem',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#16a34a'}
            >
               Agregar al Carrito
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}