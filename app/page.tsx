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
      background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(\'/hero-bg.jpg\') center/cover',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efecto de confeti (simulado con partículas) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(120, 0, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 255, 100, 0.3) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Logo XPI TIENDA */}
      <div style={{ textAlign: 'center', zIndex: 10, marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: 'clamp(3rem, 10vw, 6rem)', 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #4B0082 0%, #2E7D32 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 40px rgba(75, 0, 130, 0.5)',
          marginBottom: '0.5rem'
        }}>
          XPI TIENDA
        </h1>
      </div>

      {/* Bienvenidos */}
      <h2 style={{ 
        fontSize: 'clamp(2rem, 8vw, 5rem)', 
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #00CED1 0%, #9370DB 50%, #FF69B4 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textAlign: 'center',
        marginBottom: '3rem',
        zIndex: 10,
        animation: 'fadeIn 2s ease-in'
      }}>
        Bienvenidos
      </h2>

      {/* Botones de navegación */}
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        zIndex: 10,
        marginBottom: '2rem'
      }}>
        {/* Botón Explorar Catálogo */}
        <Link 
          href="/catalog"
          style={{
            background: 'rgba(0, 255, 255, 0.2)',
            color: '#00FFFF',
            padding: '1.25rem 3rem',
            borderRadius: '1rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            border: '3px solid #00FFFF',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            textAlign: 'center'
          }}
        >
          Explorar Catálogo
        </Link>

        {/* Botón Vendedores (NUEVO) */}
        <Link 
          href="/login-seller"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            color: '#FFD700',
            padding: '1.25rem 3rem',
            borderRadius: '1rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            border: '3px solid #FFD700',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            textAlign: 'center'
          }}
        >
          Vendedores
        </Link>

        {/* Botón Administración */}
        <Link 
          href="/admin/login"
          style={{
            background: 'rgba(255, 165, 0, 0.2)',
            color: '#FFA500',
            padding: '1.25rem 3rem',
            borderRadius: '1rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            border: '3px solid #FFA500',
            boxShadow: '0 0 30px rgba(255, 165, 0, 0.6), inset 0 0 20px rgba(255, 165, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            textAlign: 'center'
          }}
        >
          Administración
        </Link>
      </div>

      {/* Slogan */}
      <div style={{ 
        textAlign: 'center', 
        zIndex: 10,
        marginTop: '2rem'
      }}>
        <p style={{ 
          fontSize: 'clamp(1.25rem, 4vw, 2rem)', 
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #00FF00 0%, #FF00FF 50%, #00FFFF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
        }}>
          Xpi Tienda Una Alternativa Inteligente
        </p>
      </div>

      {/* Animación CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}