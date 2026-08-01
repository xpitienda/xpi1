'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { X, ShoppingCart, Check } from 'lucide-react';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  category?: string;
  stock?: number;
};

type ImageModalContextType = {
  openModal: (product: Product) => void;
  closeModal: () => void;
};

const ImageModalContext = createContext<ImageModalContextType | null>(null);

export function useImageModal() {
  const context = useContext(ImageModalContext);
  if (!context) {
    throw new Error('useImageModal must be used within ImageModalProvider');
  }
  return context;
}

export function ImageModalProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart, cart } = useCart();
  const { showToast } = useToast();

  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  const openModal = (p: Product) => {
    setProduct(p);
  };
  
  const closeModal = () => {
    setProduct(null);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1,
    });
    showToast(`${product.name} agregado al carrito`, 'success');
    closeModal();
  };

  const inCart = product ? cart.some((item: any) => item.id === product.id) : false;

  const getCategoryColor = (cat?: string) => {
    if (cat === 'Ropa') return 'bg-[#6B2D8B]';
    if (cat === 'Tecnología') return 'bg-[#1B8A3B]';
    if (cat === 'Deportes') return 'bg-[#22A84A]';
    if (cat === 'Hogar') return 'bg-[#8B45B3]';
    if (cat === 'Accesorios') return 'bg-pink-500';
    return 'bg-gray-500';
  };

  return (
    <ImageModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      
      {/* Modal FLOTANTE - position: fixed para que cubra toda la pantalla */}
      {product && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={closeModal}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              animation: 'scaleIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)')}
            >
              <X size={20} />
            </button>
            
            {/* Contenido del modal en grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 0
            }}>
              {/* Imagen grande */}
              <div style={{
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                minHeight: '300px'
              }}>
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    borderRadius: '0.5rem'
                  }}
                />
              </div>
              
              {/* Información del producto */}
              <div style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #faf5ff 0%, #f0fdf4 100%)'
              }}>
                {product.category && (
                  <span className={`${getCategoryColor(product.category)} text-white px-3 py-1 rounded-lg text-sm font-medium mb-3`} style={{ width: 'fit-content' }}>
                    {product.category}
                  </span>
                )}
                
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                  {product.name}
                </h2>
                
                <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1B8A3B', marginBottom: '1rem' }}>
                  ${Number(product.price).toLocaleString('es-CO')}
                </div>
                
                {product.description && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Descripción:</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.625' }}>{product.description}</p>
                  </div>
                )}
                
                {product.stock !== undefined && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                      Stock: 
                      <span style={{ 
                        marginLeft: '0.5rem', 
                        color: product.stock === 0 ? '#ef4444' : '#1B8A3B',
                        fontWeight: 'bold'
                      }}>
                        {product.stock === 0 ? 'Agotado' : `${product.stock} disponibles`}
                      </span>
                    </p>
                  </div>
                )}
                
                <div style={{ marginTop: 'auto' }}>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.125rem',
                      border: 'none',
                      cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      backgroundColor: inCart ? '#2E7D32' : '#6B2D8B',
                      opacity: product.stock === 0 ? 0.5 : 1,
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (product.stock !== 0) e.currentTarget.style.backgroundColor = inCart ? '#1B5E20' : '#5a2575';
                    }}
                    onMouseLeave={(e) => {
                      if (product.stock !== 0) e.currentTarget.style.backgroundColor = inCart ? '#2E7D32' : '#6B2D8B';
                    }}
                  >
                    {inCart ? <Check size={24} /> : <ShoppingCart size={24} />}
                    {product.stock === 0 ? 'Agotado' : (inCart ? 'Ya está en el carrito' : 'Agregar al Carrito')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </ImageModalContext.Provider>
  );
}