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
      {/* Video de fondo - SIN overlay oscuro para ver colores originales */}
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

      {/* Overlay muy sutil solo para mejorar legibilidad sin opacar colores */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.15)',
        zIndex: -1
      }} />

      {/* Logo grande giratorio */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        marginBottom: '1.5rem',
        animation: 'spin 8s linear infinite'
      }}>
        <img 
          src="/logo1.png" 
          alt="XPI Tienda"
          style={{
            width: 'clamp(250px, 40vw, 500px)',
            height: 'auto',
            filter: 'drop-shadow(0 0 30px rgba(75, 0, 130, 0.9))'
          }}
        />
      </div>

      {/* Bienvenidos - DOBLE TAMAÑO con colores nítidos cambiantes */}
      <h1 style={{ 
        fontSize: 'clamp(4rem, 12vw, 8rem)', 
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #00FF88, #00CED1, #9370DB, #FF69B4, #FF1493, #00FF88)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textAlign: 'center',
        marginBottom: '2rem',
        zIndex: 10,
        animation: 'gradientShift 3s ease infinite, fadeIn 2s ease-in',
        textShadow: '0 0 60px rgba(147, 112, 219, 0.9)',
        letterSpacing: '0.05em'
      }}>
        Bienvenidos
      </h1>

      {/* Botones de navegación */}
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        zIndex: 10,
        marginBottom: '2rem'
      }}>
        {/* Botón Explorar */}
        <Link 
          href="/catalog"
          style={{
            background: 'rgba(0, 255, 255, 0.25)',
            color: '#00FFFF',
            padding: '1.25rem 3rem',
            borderRadius: '1rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            border: '3px solid #00FFFF',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.9), inset 0 0 20px rgba(0, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            textAlign: 'center'
          }}
        >
          Explorar
        </Link>

        {/* Botón Vendedores (NUEVO) */}
        <Link 
          href="/login-seller"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#FFD700',
            padding: '1.25rem 3rem',
            borderRadius: '1rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            border: '3px solid #FFD700',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            textAlign: 'center'
          }}
        >
          Vendedores
        </Link>

        {/* Botón Administrador */}
        <Link 
          href="/admin/login"
          style={{
            background: 'rgba(255, 165, 0, 0.25)',
            color: '#FFA500',
            padding: '1.25rem 3rem',
            borderRadius: '1rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            border: '3px solid #FFA500',
            boxShadow: '0 0 30px rgba(255, 165, 0, 0.9), inset 0 0 20px rgba(255, 165, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            textAlign: 'center'
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
          fontSize: 'clamp(2rem, 6vw, 3.5rem)', 
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #00FF00, #FFD700, #FF69B4, #00FFFF, #9370DB, #00FF00)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradientShift 4s ease infinite',
          textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
          letterSpacing: '0.02em'
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
      `}</style>
    </div>
  );
}