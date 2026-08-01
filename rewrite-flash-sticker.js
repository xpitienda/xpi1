const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'components', 'FlashSticker.tsx');

const content = `'use client';

interface FlashStickerProps {
  message: string;
  points?: number;
  colorStart?: string;
  colorEnd?: string;
  textColor?: string;
}

export default function FlashSticker({ 
  message, 
  points = 6, 
  colorStart = '#FF006E', 
  colorEnd = '#FFBE0B', 
  textColor = '#FFFFFF' 
}: FlashStickerProps) {
  // Generar un ID único y seguro para el SVG (sin espacios ni caracteres especiales)
  const safeId = message.replace(/[^a-zA-Z0-9]/g, '') + Math.random().toString(36).substring(2, 6);

  // Generar puntos de la estrella
  const generateStarPoints = (numPoints: number, outerRadius: number, innerRadius: number) => {
    const pts = [];
    const angle = Math.PI / numPoints;
    for (let i = 0; i < 2 * numPoints; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const x = 50 + r * Math.cos(i * angle - Math.PI / 2);
      const y = 50 + r * Math.sin(i * angle - Math.PI / 2);
      pts.push(\`\${x},\${y}\`);
    }
    return pts.join(' ');
  };

  const starPoints = generateStarPoints(points, 48, 22);

  return (
    <div className="flash-sticker-container">
      <svg viewBox="0 0 100 100" className="flash-sticker-svg">
        <defs>
          <linearGradient id={\`starGrad-\${safeId}\`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorStart} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
          <filter id={\`glow-\${safeId}\`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <polygon 
          points={starPoints} 
          fill={\`url(#starGrad-\${safeId})\`}
          filter={\`url(#glow-\${safeId})\`}
          className="flash-sticker-shape"
        />
        <text 
          x="50" 
          y="52" 
          textAnchor="middle" 
          dominantBaseline="central" 
          fill={textColor}
          fontSize="13"
          fontWeight="900"
          fontFamily="Arial, sans-serif"
          className="flash-sticker-text"
          style={{ letterSpacing: '-0.5px' }}
        >
          {message}
        </text>
      </svg>
      <style>{\`
        .flash-sticker-container {
          position: absolute !important;
          top: 8px !important;
          right: 8px !important;
          width: 85px !important;
          height: 85px !important;
          z-index: 50 !important;
          pointer-events: none !important;
          animation: stickerPulse 2s ease-in-out infinite;
        }
        .flash-sticker-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));
        }
        .flash-sticker-shape {
          animation: colorShift 3s ease-in-out infinite;
        }
        .flash-sticker-text {
          text-shadow: 1px 1px 3px rgba(0,0,0,0.6);
          animation: textGlow 1.5s ease-in-out infinite;
        }
        @keyframes stickerPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.08) rotate(3deg); }
        }
        @keyframes colorShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        @keyframes textGlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }
      \`}</style>
    </div>
  );
}
`;

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ FlashSticker.tsx reescrito con IDs seguros y estilos optimizados.');
