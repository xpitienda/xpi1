'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useState } from 'react';

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();

  // Determinar índice inicial basado en la ruta
  const getInitialIndex = () => {
    if (pathname === '/catalog' || pathname?.startsWith('/catalog')) return 1;
    if (pathname === '/vender' || pathname?.startsWith('/vender')) return 2;
    if (pathname === '/cart') return 3;
    return 0;
  };

  const [localIndex, setLocalIndex] = useState(getInitialIndex());

  const cartItems = Array.isArray(cart) ? cart.length : (cart?.items?.length || 0);
  const cartIcon = cartItems > 0 ? '/car2.png' : '/car1.png';

  const tabs = [
    { name: 'Inicio', icon: '🏠', path: '/' },
    { name: 'Catálogo', icon: '', path: '/catalog' },
    { name: 'Vender', icon: '💰', path: '/vender' },
    { name: 'Carrito', icon: cartIcon, isImage: true, path: '/cart' },
  ];

  const handleTabClick = (index, path) => {
    // Mover la esfera PRIMERO
    setLocalIndex(index);
    // Luego navegar
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  return (
    <nav style={{ 
      position: 'fixed', 
      bottom: '1rem', 
      left: '50%', 
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '28rem',
      zIndex: 50 
    }}>
      {/* Barra Naranja con efecto 3D de Canal (Groove) */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(145deg, #ea580c, #f97316)',
        borderRadius: '1rem',
        boxShadow: `
          inset 3px 3px 6px rgba(0,0,0,0.4),
          inset -3px -3px 6px rgba(255,255,255,0.3),
          0 10px 20px rgba(0,0,0,0.3)
        `,
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '0.5rem 0',
      }}>
        <div style={{ 
          display: 'flex', 
          height: '3.5rem', 
          position: 'relative' 
        }}>
          
          {/* Contenedor de la Esfera */}
          <div style={{
            position: 'absolute',
            top: '-1.5rem',
            left: '0',
            width: '25%',
            height: '3rem',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: `translateX(${localIndex * 100}%)`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            pointerEvents: 'none',
          }}>
            {/* Sombra de la esfera */}
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              width: '2rem',
              height: '6px',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '50%',
              filter: 'blur(2px)',
            }}></div>
            
            {/* Esfera Metálica 3D */}
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              background: `
                radial-gradient(circle at 35% 35%, #ffffff 0%, #e5e7eb 20%, #9ca3af 60%, #4b5563 100%)
              `,
              boxShadow: `
                inset -4px -4px 8px rgba(0,0,0,0.5),
                inset 4px 4px 8px rgba(255,255,255,0.9),
                2px 4px 6px rgba(0,0,0,0.4)
              `,
              border: '1px solid rgba(255,255,255,0.4)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'spin 3s linear infinite',
            }}>
              {/* Texto "Compra Ya" */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                animation: 'spin-reverse 3s linear infinite',
              }}>
                <div style={{
                  fontSize: '0.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  lineHeight: '1',
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                }}>
                  Compra
                </div>
                <div style={{
                  fontSize: '0.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  lineHeight: '1',
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                }}>
                  Ya
                </div>
              </div>
              
              {/* Brillo superior */}
              <div style={{
                position: 'absolute',
                top: '4px',
                left: '6px',
                width: '8px',
                height: '5px',
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '50%',
                filter: 'blur(1px)',
                transform: 'rotate(-45deg)',
              }}></div>
            </div>
          </div>

          {/* Botones */}
          {tabs.map((tab, index) => {
            const isActive = index === localIndex;
            return (
              <button
                key={tab.path}
                onClick={() => handleTabClick(index, tab.path)}
                style={{
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  fontWeight: isActive ? 'bold' : 'normal',
                  zIndex: 5,
                  padding: 0,
                }}
              >
                {tab.isImage ? (
                  <div style={{ width: '1.5rem', height: '1.5rem', position: 'relative', marginBottom: '0.2rem' }}>
                    <Image 
                      src={tab.icon} 
                      alt={tab.name} 
                      fill 
                      className="object-contain" 
                      style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }} 
                    />
                  </div>
                ) : (
                  <span style={{ fontSize: '1.25rem', marginBottom: '0.2rem', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}>{tab.icon}</span>
                )}
                <span style={{ fontSize: '0.65rem', fontWeight: '600', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}>{tab.name}</span>
                
                {tab.name === 'Carrito' && cartItems > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '20%',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.6rem',
                    fontWeight: 'bold',
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #f97316',
                  }}>
                    {cartItems}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Animaciones CSS */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
      `}</style>
    </nav>
  );
}
