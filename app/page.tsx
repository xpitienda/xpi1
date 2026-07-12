'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  is_active: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.filter((p: Product) => p.is_active === 1));
      } catch (err) {
        console.error('Error cargando productos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Video de fondo - SIN overlay para ver colores 100% originales */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2
        }}
      >
        <source src="/video-splash.mp4" type="video/mp4" />
      </video>

      {/* Overlay mínimo solo para legibilidad */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.05)',
        zIndex: -1
      }} />

      {/* LLUVIA DE CONFETTI - Partículas moradas y verdes */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              background: i % 2 === 0 ? '#4B0082' : '#2E7D32',
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              animation: `confettiFall ${Math.random() * 3 + 4}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
              opacity: 0.8
            }}
          />
        ))}
      </div>

      {/* Logo grande giratorio sobre su eje */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        marginBottom: '1.5rem',
        animation: 'spin 6s linear infinite',
        transformStyle: 'preserve-3d'
      }}>
        <img 
          src="/logo1.png" 
          alt="XPI Tienda"
          style={{
            width: 'clamp(280px, 45vw, 550px)',
            height: 'auto',
            filter: 'drop-shadow(0 0 40px rgba(75, 0, 130, 1)) drop-shadow(0 0 60px rgba(46, 125, 50, 0.8))'
          }}
        />
      </div>

      {/* Bienvenidos - DOBLE TAMAÑO con colores nítidos cambiantes */}
      <h1 style={{ 
        fontSize: 'clamp(4.5rem, 14vw, 9rem)', 
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #00FF88, #00CED1, #9370DB, #FF69B4, #FF1493, #00FF88)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textAlign: 'center',
        marginBottom: '2.5rem',
        zIndex: 10,
        animation: 'gradientShift 3s ease infinite, fadeIn 2s ease-in',
        letterSpacing: '0.05em',
        filter: 'drop-shadow(0 0 20px rgba(147, 112, 219, 0.8))'
      }}>
        Bienvenidos
      </h1>

      {/* Botones de navegación con NEON más brillante */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        zIndex: 10,
        marginBottom: '2.5rem'
      }}>
        {/* Botón Explorar - NEON Cian Brillante */}
        <Link 
          href="/catalog"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#00FFFF',
            padding: '1.5rem 3.5rem',
            borderRadius: '1rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)',
            border: '3px solid #00FFFF',
            boxShadow: '0 0 40px rgba(0, 255, 255, 1), 0 0 80px rgba(0, 255, 255, 0.6), inset 0 0 30px rgba(0, 255, 255, 0.4)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            textAlign: 'center',
            textShadow: '0 0 20px rgba(0, 255, 255, 0.9)'
          }}
        >
          Explorar
        </Link>

        {/* Botón Vendedores - NEON Dorado Brillante */}
        <Link 
          href="/login-seller"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#FFD700',
            padding: '1.5rem 3.5rem',
            borderRadius: '1rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)',
            border: '3px solid #FFD700',
            boxShadow: '0 0 40px rgba(255, 215, 0, 1), 0 0 80px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            textAlign: 'center',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.9)'
          }}
        >
          Vendedores
        </Link>

        {/* Botón Administrador - NEON Naranja Brillante */}
        <Link 
          href="/admin/login"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#FFA500',
            padding: '1.5rem 3.5rem',
            borderRadius: '1rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)',
            border: '3px solid #FFA500',
            boxShadow: '0 0 40px rgba(255, 165, 0, 1), 0 0 80px rgba(255, 165, 0, 0.6), inset 0 0 30px rgba(255, 165, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            textAlign: 'center',
            textShadow: '0 0 20px rgba(255, 165, 0, 0.9)'
          }}
        >
          Administrador
        </Link>
      </div>

      {/* Slogan - DOBLE TAMAÑO con colores cambiantes nítidos */}
      <div style={{ 
        textAlign: 'center', 
        zIndex: 10,
        marginTop: '1rem'
      }}>
        <p style={{ 
          fontSize: 'clamp(2.5rem, 7vw, 4rem)', 
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #00FF00, #FFD700, #FF69B4, #00FFFF, #9370DB, #00FF00)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradientShift 4s ease infinite',
          letterSpacing: '0.02em',
          filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.7))'
        }}>
          Xpi Tienda Una Alternativa Inteligente
        </p>
      </div>

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}