'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ShoppingCart, X, Check } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

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

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23e5e7eb" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="40">📦</text></svg>';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, isInCart } = useCart();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const inCart = isInCart(product.id);
  // Verificar si hay oferta: debe tener offer_type Y offer_price válido
  const hasOffer = product.offer_type && product.offer_price && product.offer_price > 0 && product.offer_price < product.price;
  const isFeatured = product.is_featured === 1;
  const discount = hasOffer ? Math.round(((product.price - (product.offer_price || 0)) / product.price) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const priceToAdd = hasOffer ? product.offer_price! : product.price;
    addToCart({
      id: product.id,
      name: product.name,
      price: priceToAdd,
      image: product.image_url || PLACEHOLDER_IMAGE,
      quantity: 1,
    });
    showToast(`${product.name} agregado al carrito`, 'success');
  };

  const getCategoryColor = (cat?: string) => {
    if (cat === 'Ropa') return '#7B2D5B';
    if (cat === 'Tecnologia') return '#1976D2';
    if (cat === 'Deportes') return '#2E7D32';
    if (cat === 'Hogar') return '#E07A5F';
    if (cat === 'Accesorios') return '#C2185B';
    return '#8D6E63';
  };

  const imageUrl = product.image_url && product.image_url.trim() !== ''
    ? product.image_url
    : PLACEHOLDER_IMAGE;

  return (
    <>
      {/* Tarjeta del producto con animación y efecto hover 3D */}
      <div className={`product-card ${isVisible ? 'animate-fade-in-up' : ''}`} style={{
        background: 'white',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: isFeatured ? '2px solid #F59E0B' : '2px solid rgba(46,125,50,0.3)',
        boxShadow: isFeatured ? '0 4px 12px rgba(245,158,11,0.3)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Banner de oferta */}
        {hasOffer && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'linear-gradient(135deg, #10b981 0%, #dc2626 100%)',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            animation: 'pulse 2s infinite'
          }}>
            🔥 -{discount}%
          </div>
        )}

        {/* Badge de destacado */}
        {isFeatured && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            left: '0.5rem',
            background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            ⭐ Destacado
          </div>
        )}

        <div
          onClick={() => setShowModal(true)}
          style={{
            position: 'relative',
            aspectRatio: '1/1',
            overflow: 'hidden',
            background: '#FDF6E3',
            cursor: 'pointer'
          }}
        >
          <img
            src={imageUrl}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />
          {product.category && (
            <span style={{
              position: 'absolute',
              top: '0.5rem',
              left: isFeatured ? '6rem' : '0.5rem',
              background: getCategoryColor(product.category),
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {product.category}
            </span>
          )}
        </div>

        <div style={{ padding: '0.75rem' }}>
          <h3 style={{
            fontWeight: 'bold',
            color: '#3D2914',
            fontSize: '0.875rem',
            marginBottom: '0.25rem',
            height: '2.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.name}
          </h3>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.5rem'
          }}>
            <div>
              {hasOffer ? (
                <>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    textDecoration: 'line-through',
                    marginRight: '0.5rem'
                  }}>
                    ${product.price.toLocaleString('es-CO')}
                  </span>
                  <span style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: '#2E7D32'
                  }}>
                    ${product.offer_price?.toLocaleString('es-CO')}
                  </span>
                </>
              ) : (
                <span style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#2E7D32'
                }}>
                  ${product.price.toLocaleString('es-CO')}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              style={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '0.5rem',
                background: inCart ? '#2E7D32' : '#E07A5F',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              title={inCart ? 'Ya está en el carrito' : 'Agregar al carrito'}
            >
              {inCart ? <Check style={{ width: '1rem', height: '1rem' }} /> : <ShoppingCart style={{ width: '1rem', height: '1rem' }} />}
            </button>
          </div>

          {/* Contador regresivo para ofertas */}
          {hasOffer && product.offer_type && (
            <CountdownTimer offerType={product.offer_type as 'day' | 'week'} />
          )}

          {product.stock !== undefined && product.stock !== null && (
            <p style={{
              fontSize: '0.75rem',
              color: '#8D6E63',
              marginTop: '0.5rem'
            }}>
              Stock: {product.stock}
            </p>
          )}
        </div>
      </div>

      {/* Modal de producto */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 9999
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '1rem',
              maxWidth: '50rem',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'white',
                border: 'none',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#5D4037',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                zIndex: 10
              }}
            >
              ×
            </button>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              padding: '1.5rem'
            }}>
              <div style={{
                aspectRatio: '1/1',
                overflow: 'hidden',
                borderRadius: '0.75rem',
                background: '#FDF6E3'
              }}>
                <img
                  src={imageUrl}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.category && (
                    <span style={{
                      display: 'inline-block',
                      background: getCategoryColor(product.category),
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '2rem',
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}>
                      {product.category}
                    </span>
                  )}
                  {isFeatured && (
                    <span style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '2rem',
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}>
                      ⭐ Destacado
                    </span>
                  )}
                </div>

                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  color: '#3D2914',
                  margin: 0
                }}>
                  {product.name}
                </h2>

                <div>
                  {hasOffer ? (
                    <>
                      <span style={{
                        fontSize: '1.25rem',
                        color: '#6b7280',
                        textDecoration: 'line-through',
                        marginRight: '1rem'
                      }}>
                        ${product.price.toLocaleString('es-CO')}
                      </span>
                      <span style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#2E7D32'
                      }}>
                        ${product.offer_price?.toLocaleString('es-CO')}
                      </span>
                      <span style={{
                        display: 'inline-block',
                        marginLeft: '1rem',
                        background: '#dc2626',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                      }}>
                        -{discount}%
                      </span>
                    </>
                  ) : (
                    <p style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#2E7D32',
                      margin: 0
                    }}>
                      ${product.price.toLocaleString('es-CO')}
                    </p>
                  )}
                </div>

                {product.description && (
                  <div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#5D4037',
                      marginBottom: '0.5rem'
                    }}>
                      Descripción:
                    </h3>
                    <p style={{
                      color: '#8D6E63',
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      {product.description}
                    </p>
                  </div>
                )}

                {product.stock !== undefined && product.stock !== null && (
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: product.stock > 0 ? '#2E7D32' : '#dc2626',
                    margin: 0
                  }}>
                    Stock: {product.stock} {product.stock === 0 ? '(Agotado)' : 'disponibles'}
                  </p>
                )}

                <button
                  onClick={handleAddToCart}
                  style={{
                    marginTop: 'auto',
                    background: inCart ? '#2E7D32' : '#E07A5F',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.3s'
                  }}
                >
                  {inCart ? (
                    <>
                      <Check style={{ width: '1.25rem', height: '1.25rem' }} />
                      Agregar otra unidad
                    </>
                  ) : (
                    <>
                      <ShoppingCart style={{ width: '1.25rem', height: '1.25rem' }} />
                      Agregar al Carrito
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .product-card {
          opacity: 0;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .product-card:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.05) !important;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}