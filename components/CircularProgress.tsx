'use client';

import { useEffect, useState } from 'react';

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export default function CircularProgress({ 
  progress, 
  size = 220, 
  strokeWidth = 14,
  label = 'Procesando...'
}: CircularProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 50);
    return () => clearTimeout(timer);
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayProgress / 100) * circumference;

  // Determinar colores neón basado en el progreso
  const isGreen = displayProgress >= 50;
  
  const primaryColor = isGreen ? '#00ff88' : '#b026ff';
  const secondaryColor = isGreen ? '#00ffaa' : '#d946ef';
  
  const glowFilter = `drop-shadow(0 0 8px ${primaryColor}) drop-shadow(0 0 16px ${primaryColor}) drop-shadow(0 0 24px ${secondaryColor})`;
  const textGlow = `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}, 0 0 30px ${secondaryColor}`;

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.98) 100%)',
      borderRadius: '1.5rem',
      border: `2px solid ${primaryColor}40`,
      boxShadow: `0 0 40px ${primaryColor}30, inset 0 0 40px ${primaryColor}10`,
      margin: '1.5rem 0'
    }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* SVG Circular */}
        <svg 
          width={size} 
          height={size} 
          style={{ transform: 'rotate(-90deg)', filter: glowFilter }}
        >
          {/* Círculo de fondo (track) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Círculo de progreso con gradiente */}
          <defs>
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#neonGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 0.4s ease-out, stroke 0.5s ease',
            }}
          />
        </svg>

        {/* Texto del porcentaje en el centro */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            color: 'white',
            textShadow: textGlow,
            lineHeight: 1,
            fontFamily: 'monospace',
            transition: 'text-shadow 0.5s ease'
          }}>
            {Math.round(displayProgress)}%
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: primaryColor,
            marginTop: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textShadow: `0 0 8px ${primaryColor}`,
            fontWeight: '600'
          }}>
            {label}
          </div>
        </div>
      </div>

      {/* Barra de estado inferior */}
      <div style={{
        marginTop: '1.5rem',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: primaryColor,
          boxShadow: `0 0 10px ${primaryColor}`,
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
        <span style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {displayProgress < 50 ? 'Fase 1: Optimizando...' : 'Fase 2: Finalizando...'}
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}