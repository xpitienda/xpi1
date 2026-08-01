'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useImageModal } from '@/context/ImageModalContext';
import { ShoppingCart, Check } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import FlashSticker from './FlashSticker';

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  category?: string;
  stock?: number;
  is_featured?: number;
  offer_type?: string | null;
  offer_price?: number | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, cart, setIsCartOpen } = useCart();
  const { showToast } = useToast();
  const { openModal } = useImageModal();
  
  const [isVisible, setIsVisible] = useState(false);
  const [activeSticker, setActiveSticker] = useState<any>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchSticker = async () => {
      try {
        const res = await fetch('/api/stickers');
        if (res.ok) {
          const stickers = await res.json();
          const sticker = stickers.find((s: any) => s.product_id === product.id);
          setActiveSticker(sticker || null);
        }
      } catch (err) {
        console.error('Error cargando pegatina:', err);
      }
    };
    fetchSticker();
  }, [product.id]);

  const currentPrice = product.offer_price && product.offer_price < product.price ? product.offer_price : product.price;
  const hasDiscount = product.offer_price && product.offer_price < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - product.offer_price!) / product.price) * 100) : 0;
  
  const inCart = cart.some((item: any) => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock === 0) {
      showToast('Producto agotado', 'error');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      image: product.image_url,
      quantity: 1,
    });
    showToast(`${product.name} agregado al carrito`, 'success');
    setIsCartOpen(true);
  };

  const getCategoryColor = (cat?: string) => {
    if (cat === 'Ropa') return 'bg-[#6B2D8B]';
    if (cat === 'Tecnología') return 'bg-[#1B8A3B]';
    if (cat === 'Hogar') return 'bg-[#8B45B3]';
    if (cat === 'Deportes') return 'bg-[#22A84A]';
    return 'bg-gray-600';
  };

  return (
    <div
      className={`product-card ${isVisible ? 'animate-fade-in-up' : ''}`}
      style={{
        background: 'white',
        borderRadius: '0.75rem',
        border: '2px solid rgba(107, 45, 139, 0.2)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(107, 45, 139, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Contenedor de imagen con pegatina y badges */}
      <div 
        style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
        onClick={() => {
          console.log('🖼️ Click en imagen:', product.name);
          openModal(product);
        }}
      >
        <img
          src={product.image_url || '/placeholder.jpg'}
          alt={product.name}
          style={{
            width: '100%',
            height: '250px',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLImageElement).style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLImageElement).style.transform = 'scale(1)';
          }}
        />

        {/* Pegatina Relámpago */}
        {activeSticker && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 20,
            pointerEvents: 'none',
          }}>
            <FlashSticker
              message={activeSticker.message}
              points={activeSticker.points}
              colorStart={activeSticker.color_start}
              colorEnd={activeSticker.color_end}
              textColor={activeSticker.text_color}
            />
          </div>
        )}

        {/* Etiqueta de categoría */}
        {product.category && (
          <span
            className={`${getCategoryColor(product.category)} text-white text-xs font-bold px-2 py-1 rounded`}
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 10,
            }}
          >
            {product.category}
          </span>
        )}

        {/* Badges de oferta/destacado */}
        <div style={{ 
          position: 'absolute', 
          top: product.category ? '40px' : '10px', 
          left: '10px', 
          zIndex: 10, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '4px' 
        }}>
          {product.is_featured === 1 && (
            <span className="bg-[#6B2D8B] text-white text-xs font-bold px-2 py-1 rounded shadow-md">
              ⭐ Destacado
            </span>
          )}
          {product.offer_type === 'day' && (
            <span className="bg-[#1B8A3B] text-white text-xs font-bold px-2 py-1 rounded shadow-md">
              🔥 Oferta del Día
            </span>
          )}
          {product.offer_type === 'week' && (
            <span className="bg-[#6B2D8B] text-white text-xs font-bold px-2 py-1 rounded shadow-md">
              📅 Oferta Semana
            </span>
          )}
        </div>

        {/* Etiqueta de descuento */}
        {hasDiscount && (
          <span
            className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md"
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              zIndex: 10,
            }}
          >
            -{discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 
          style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#3D2914', margin: '0 0 0.5rem 0', cursor: 'pointer' }}
          onClick={() => openModal(product)}
        >
          {product.name}
        </h3>

        {product.description && (
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 1rem 0', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.description}
          </p>
        )}

        {/* Precios */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {hasDiscount ? (
            <>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1B8A3B' }}>
                ${currentPrice.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.875rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                ${product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D2914' }}>
              ${currentPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Countdown para ofertas */}
        {(product.offer_type === 'day' || product.offer_type === 'week') && hasDiscount && (
          <div style={{ marginBottom: '0.75rem' }}>
            <CountdownTimer offerType={product.offer_type} />
          </div>
        )}

        {/* Stock */}
        <p style={{ fontSize: '0.75rem', color: product.stock === 0 ? '#EF4444' : '#6B7280', marginBottom: '0.75rem' }}>
          {product.stock === 0 ? '⚠️ Agotado' : `✅ Stock: ${product.stock}`}
        </p>

        {/* Botón agregar al carrito */}
        <button
          suppressHydrationWarning
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{
            width: '100%',
            background: product.stock === 0 ? '#D1D5DB' : (inCart ? '#2E7D32' : '#1B8A3B'),
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            fontWeight: 'bold',
            cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'background 0.2s ease',
            marginTop: 'auto',
          }}
          onMouseEnter={(e) => {
            if (product.stock !== 0) {
              (e.target as HTMLButtonElement).style.background = '#156d2e';
            }
          }}
          onMouseLeave={(e) => {
            if (product.stock !== 0) {
              (e.target as HTMLButtonElement).style.background = inCart ? '#2E7D32' : '#1B8A3B';
            }
          }}
        >
          {inCart ? <Check size={18} /> : <ShoppingCart size={18} />}
          {product.stock === 0 ? 'Agotado' : (inCart ? 'En el carrito' : 'Agregar al Carrito')}
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .product-card {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}