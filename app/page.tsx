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

    const timer = setTimeout(() => setShowConfetti(false), 7000);
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
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
          {Array.from({ length: 80 }).map((_, i) => {
            const angle = (i / 80) * 360;
            const velocity = Math.random() * 300 + 200;
            const x = Math.cos((angle * Math.PI) / 180) * velocity;
            const y = Math.sin((angle * Math.PI) / 180) * velocity - 200;
            const color = i % 2 === 0 ? '#4B0082' : '#2E7D32';
            const size = Math.random() * 10 + 5;
            
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: `${size}px`,
                  height: `${size}px`,
                  background: color,
                  left: '50%',
                  top: '50%',
                  animation: `confettiExplode 7s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  opacity: 0.9,
                  transform: `translate(-50%, -50%)`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}

      <div style={{
        position: 'relative',
        zIndex: 10,
        marginBottom: '1.5rem',
        perspective: '1000px'
      }}>
        <div style={{
          animation: 'spinY 6s linear infinite',
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
        @keyframes spinY {
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

        @keyframes confettiExplode {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          20% {
            transform: translate(calc(-50% + var(--tx, 100px)), calc(-50% + var(--ty, -200px))) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx, 200px)), calc(-50% + var(--ty, 400px))) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}