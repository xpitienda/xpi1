'use client';

import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  category?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.name} agregado al carrito`, 'success');
  };

  const getCategoryColor = (cat?: string) => {
    if (cat === 'Ropa') return '#6B2D8B';
    if (cat === 'Tecnología') return '#1B8A3B';
    if (cat === 'Hogar') return '#8B45B3';
    if (cat === 'Deportes') return '#22A84A';
    return '#6B7280';
  };

  return (
    <div style={{
      border: '2px solid rgba(107, 45, 139, 0.2)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'all 0.3s',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
      (e.currentTarget as HTMLElement).style.borderColor = '#6B2D8B';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(107, 45, 139, 0.2)';
    }}
    >
      <div style={{
        position: 'relative',
        height: '160px',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        flexShrink: 0,
      }}>
        <img 
          src={product.image_url} 
          alt={product.name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {product.category && (
          <span style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: getCategoryColor(product.category),
            color: 'white',
            padding: '4px 8px',
            borderRadius: '9999px',
            fontSize: '10px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}>
            {product.category}
          </span>
        )}
      </div>

      <div style={{
        padding: '12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h3 style={{
          fontWeight: 'bold',
          fontSize: '14px',
          marginBottom: '4px',
          color: '#5A1D7B',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {product.name}
        </h3>
        
        <p style={{
          color: '#4b5563',
          fontSize: '11px',
          marginBottom: '8px',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {product.description}
        </p>
        
        <div style={{
          marginTop: 'auto',
          paddingTop: '8px',
          borderTop: '1px solid rgba(107, 45, 139, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1B8A3B',
          }}>
            ${Number(product.price).toLocaleString('es-CO')}
          </span>
          
          <button
            onClick={handleAddToCart}
            style={{
              backgroundColor: '#6B2D8B',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  );
}