"use client";

import { useState, useEffect } from 'react';

interface WhatsAppButtonProps {
  visitorCount?: number;
}

export default function WhatsAppButton({ visitorCount = 0 }: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showVisitorTooltip, setShowVisitorTooltip] = useState(false);
  const [currentCount, setCurrentCount] = useState(visitorCount);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    // ✅ Incrementar contador en la base de datos
    const incrementVisit = async () => {
      try {
        const response = await fetch('/api/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.success) {
          setCurrentCount(data.count);
        }
      } catch (error) {
        console.error('Error incrementing visit:', error);
        // Fallback: usar el valor inicial + 1
        setCurrentCount(visitorCount + 1);
      }
    };

    incrementVisit();

    return () => clearTimeout(timer);
  }, [visitorCount]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        right: '20px',
        transform: 'translateY(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        alignItems: 'center',
      }}
    >
      {/* Tooltip WhatsApp */}
      <div
        style={{
          position: 'absolute',
          right: '70px',
          top: '-40px',
          background: 'white',
          color: '#374151',
          padding: '0.75rem 1rem',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          opacity: showTooltip ? 1 : 0,
          visibility: showTooltip ? 'visible' : 'hidden',
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
          border: '2px solid #25D366',
        }}
      >
        Contáctanos vía WhatsApp
        <div
          style={{
            position: 'absolute',
            right: '-8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '0',
            height: '0',
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: '8px solid #25D366',
          }}
        />
      </div>

      {/* Botón de WhatsApp */}
      <a
        href="https://wa.me/573234475311?text=Hola,%20he%20visitado%20XpiTienda%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20tus%20productos"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'transform 0.3s ease',
          animation: 'pulse 2s infinite',
          textDecoration: 'none'
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(true)}
        onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2000)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

      {/* CONTADOR DE VISITAS - CIRCULAR CON TOOLTIP */}
      <div
        style={{
          position: 'relative',
          width: '60px',
          height: '60px',
          animation: 'pulse 2s infinite',
        }}
        onMouseEnter={() => setShowVisitorTooltip(true)}
        onMouseLeave={() => setShowVisitorTooltip(false)}
      >
        {/* Tooltip del Contador */}
        <div
          style={{
            position: 'absolute',
            right: '70px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'white',
            color: '#374151',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            opacity: showVisitorTooltip ? 1 : 0,
            visibility: showVisitorTooltip ? 'visible' : 'hidden',
            transition: 'all 0.3s ease',
            pointerEvents: 'none',
            border: '2px solid #9333ea',
            textAlign: 'center',
            zIndex: 10000,
          }}
        >
          <div style={{ marginBottom: '0.25rem' }}>
            Eres el visitante nro
          </div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: '#9333ea',
            marginBottom: '0.25rem'
          }}>
            {currentCount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>
            ¡Gracias por elegirnos! 💚
          </div>
          {/* Flechita del tooltip */}
          <div
            style={{
              position: 'absolute',
              right: '-8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '0',
              height: '0',
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderLeft: '8px solid #9333ea',
            }}
          />
        </div>

        {/* Círculo del contador */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9333ea 0%, #16a34a 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', lineHeight: '1' }}>
              {currentCount}
            </div>
          </div>

          <svg width="60" height="60" style={{ position: 'absolute', inset: 0, animation: 'rotate 20s linear infinite' }}>
            <defs>
              <path id="circlePath" d="M 30, 30 m -25, 0 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0" />
            </defs>
            <text style={{ fill: 'white', fontSize: '6.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <textPath href="#circlePath">
                • ERES EL VISITANTE NRO • ERES EL VISITANTE NRO •
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}