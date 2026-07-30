const fs = require('fs');
const path = require('path');

const content = `'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function CartSidebar({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartSidebarProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    router.push('/cart');
  };

  if (!isVisible) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 300ms ease-in-out',
          zIndex: 50
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-400px',
          width: '400px',
          maxWidth: '100%',
          height: '100vh',
          background: 'white',
          boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.15)',
          transition: 'right 300ms ease-in-out',
          zIndex: 51,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #3D1A78, #7c3aed)'
        }}>
          <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
            Carrito de Compras
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.375rem'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}></p>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: '#f9fafb',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      background: '#e5e7eb',
                      borderRadius: '0.375rem',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#9ca3af'
                        }}>
                          
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        margin: '0 0 0.5rem 0', 
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}>
                        {item.name}
                      </h3>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem',
                        marginBottom: '0.5rem'
                      }}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            border: '1px solid #10B981',
                            background: 'white',
                            color: '#10B981',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '1.125rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          -
                        </button>
                        
                        <span style={{ 
                          fontWeight: '600',
                          color: '#1f2937',
                          minWidth: '24px',
                          textAlign: 'center'
                        }}>
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            border: '1px solid #10B981',
                            background: 'white',
                            color: '#10B981',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '1.125rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          +
                        </button>
                      </div>

                      <p style={{ 
                        margin: 0,
                        color: '#10B981',
                        fontWeight: '700',
                        fontSize: '1.125rem'
                      }}>
                        ${itemTotal.toLocaleString('es-CO')}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '1.25rem',
                        padding: '0.5rem'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ 
            padding: '1.5rem',
            borderTop: '1px solid #e5e7eb',
            background: '#f9fafb'
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
                Total:
              </span>
              <span style={{ 
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#10B981'
              }}>
                ${total.toLocaleString('es-CO')}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #3D1A78, #7c3aed)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(61, 26, 120, 0.3)'
              }}
            >
              Ir al Checkout
            </button>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '0.75rem'
              }}
            >
              Seguir Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
`;

const componentsDir = path.join(process.cwd(), 'components');
fs.mkdirSync(componentsDir, { recursive: true });
fs.writeFileSync(path.join(componentsDir, 'CartSidebar.tsx'), content, 'utf8');
console.log('✅ Componente CartSidebar creado con tipos TypeScript correctos.');
