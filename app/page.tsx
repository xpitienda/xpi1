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
  const [showConfetti, setShowConfetti] = useState(true);

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

    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
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

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.05)',
        zIndex: -1
      }} />

      {showConfetti && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
          {Array.from({ length: 100 }).map((_, i) => {
            const colors = ['#9333ea', '#22c55e', '#a855f7', '#4ade80', '#c084fc', '#86efac'];
            const color = colors[i % colors.length];
            const left = Math.random() * 100;
            const delay = Math.random() * 3;
            const duration = 4 + Math.random() * 4;
            const size = 6 + Math.random() * 8;
            
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: `${size}px`,
                  height: `${size * 1.5}px`,
                  background: color,
                  left: `${left}%`,
                  top: '-20px',
                  animation: `confettiRain ${duration}s linear ${delay}s forwards`,
                  borderRadius: '2px',
                  opacity: 0.95,
                  boxShadow: `0 0 8px ${color}`
                }}
              />
            );
          })}
        </div>
      )}

      <div style={{
        position: 'relative',
        zIndex: 10,
        marginBottom: '1.5rem',
        animation: 'logoFloat 6s ease-in-out infinite'
      }}>
        <img 
          src="/logo1.png" 
          alt="XPI Tienda"
          style={{
            width: 'clamp(300px, 50vw, 600px)',
            height: 'auto',
            filter: 'drop-shadow(0 0 30px rgba(147, 51, 234, 0.8)) drop-shadow(0 0 50px rgba(34, 197, 94, 0.6))'
          }}
        />
      </div>

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

      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        zIndex: 10,
        marginBottom: '2.5rem'
      }}>
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

      <style>{`
        @keyframes logoFloat {
          0%, 100% { 
            transform: translateY(0) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-10px) rotate(2deg) scale(1.02);
          }
          50% { 
            transform: translateY(-5px) rotate(0deg) scale(1);
          }
          75% {
            transform: translateY(-10px) rotate(-2deg) scale(1.02);
          }
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

        @keyframes confettiRain {
          0% {
            transform: translateY(0) rotate(0deg) translateX(0);
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) rotate(180deg) translateX(30px);
          }
          50% {
            transform: translateY(50vh) rotate(360deg) translateX(-30px);
          }
          75% {
            transform: translateY(75vh) rotate(540deg) translateX(30px);
          }
          100% {
            transform: translateY(110vh) rotate(720deg) translateX(-30px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}