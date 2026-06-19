'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function SplashPage() {
  const router = useRouter();
  const [showText, setShowText] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const logoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_XpiTienda_sin_Fondo-removebg-preview-yVgQmLAPvivdFeznsaVzvVQlE2Y1zE.png";

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#00FF41', '#BF00FF', '#00CC33', '#9900CC'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      setShowText(true);

      setTimeout(() => {
        setShowButtons(true);
      }, 800);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      {/* VIDEO DE FONDO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      >
        <source src="/video-splash.mp4" type="video/mp4" />
      </video>

      {/* CAPA OSCURA */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
        pointerEvents: 'none'
      }}></div>

      {/* CONTENIDO CENTRADO */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: '2rem'
      }}>
        
        {/* LOGO */}
        <div style={{ perspective: '1000px' }}>
          <Image
            src={logoUrl}
            alt="XPI Tienda"
            width={400}
            height={180}
            style={{
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.8))',
              animation: 'spin3d 8s linear infinite'
            }}
            priority
          />
        </div>

        {showText && (
          <div style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '1200px'
          }}>
            
            {/* BIENVENIDOS */}
            <h1 style={{
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              fontWeight: '900',
              letterSpacing: '0.05em',
              lineHeight: 1,
              margin: 0,
              background: 'linear-gradient(90deg, #9333EA, #10B981, #7C3AED, #059669, #9333EA)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientFlow 5s ease infinite',
              filter: 'drop-shadow(0 0 30px rgba(147,51,234,0.6)) drop-shadow(4px 4px 0 rgba(0,0,0,0.3)) drop-shadow(8px 8px 0 rgba(0,0,0,0.2)) drop-shadow(12px 12px 0 rgba(0,0,0,0.1))'
            }}>
              Bienvenidos
            </h1>

            {/* BOTONES */}
            {showButtons && (
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1.5rem',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: '0 1rem',
                marginTop: '0.5rem'
              }}>
                <button
                  onClick={() => router.push('/home')}
                  style={{
                    padding: '1.25rem 3rem',
                    background: 'transparent',
                    color: '#00BFFF',
                    fontWeight: 'bold',
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    borderRadius: '1rem',
                    border: '4px solid #00BFFF',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(15px)',
                    textShadow: '0 0 20px #00BFFF, 0 0 40px #00BFFF',
                    animation: 'neonPulseBlue 2s ease-in-out infinite'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = 'rgba(0,191,255,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Explorar
                </button>

                <button
                  onClick={() => router.push('/admin/login')}
                  style={{
                    padding: '1.25rem 3rem',
                    background: 'transparent',
                    color: '#FF6B00',
                    fontWeight: 'bold',
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    borderRadius: '1rem',
                    border: '4px solid #FF6B00',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(15px)',
                    textShadow: '0 0 20px #FF6B00, 0 0 40px #FF6B00',
                    animation: 'neonPulseOrange 2s ease-in-out infinite'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = 'rgba(255,107,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Administrador
                </button>
              </div>
            )}

            {/* ESLOGAN */}
            <div style={{
              fontSize: 'clamp(1.5rem, 3vw, 3rem)',
              fontWeight: '300',
              letterSpacing: '0.05em',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{
                color: '#00FF41',
                fontWeight: '600',
                textShadow: '0 0 20px rgba(0,255,65,0.8)'
              }}>
                Xpi Tienda
              </span>
              <span style={{
                background: 'linear-gradient(90deg, #00BFFF, #FF6B00, #00FFFF, #FF8C00, #00BFFF)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientFlow 5s ease infinite',
                fontWeight: '700'
              }}>
                Una Alternativa
              </span>
              <span style={{
                color: '#E879F9',
                fontWeight: '600',
                textShadow: '0 0 20px rgba(232,121,249,0.8)'
              }}>
                Inteligente
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ANIMACIONES CSS */}
      <style>{`
        @keyframes spin3d {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes neonPulseBlue {
          0% { box-shadow: 0 0 10px #00BFFF, 0 0 20px #00BFFF, 0 0 30px #00BFFF, 0 0 40px #00BFFF; }
          50% { box-shadow: 0 0 15px #00FFFF, 0 0 30px #00FFFF, 0 0 45px #00FFFF, 0 0 60px #00FFFF; }
          100% { box-shadow: 0 0 10px #00BFFF, 0 0 20px #00BFFF, 0 0 30px #00BFFF, 0 0 40px #00BFFF; }
        }
        @keyframes neonPulseOrange {
          0% { box-shadow: 0 0 10px #FF6B00, 0 0 20px #FF6B00, 0 0 30px #FF6B00, 0 0 40px #FF6B00; }
          50% { box-shadow: 0 0 15px #FF8C00, 0 0 30px #FF8C00, 0 0 45px #FF8C00, 0 0 60px #FF8C00; }
          100% { box-shadow: 0 0 10px #FF6B00, 0 0 20px #FF6B00, 0 0 30px #FF6B00, 0 0 40px #FF6B00; }
        }
      `}</style>
    </div>
  );
}