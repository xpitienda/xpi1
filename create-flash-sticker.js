const fs = require('fs');
const path = require('path');

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
  // Generar puntos de la estrella
  const generateStarPoints = (numPoints: number, outerRadius: number, innerRadius: number) => {
    const points = [];
    const angle = Math.PI / numPoints;
    for (let i = 0; i < 2 * numPoints; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const x = 50 + r * Math.cos(i * angle - Math.PI / 2);
      const y = 50 + r * Math.sin(i * angle - Math.PI / 2);
      points.push(\`\${x},\${y}\`);
    }
    return points.join(' ');
  };

  const starPoints = generateStarPoints(points, 48, 22);

  return (
    <div className="flash-sticker-container">
      <svg viewBox="0 0 100 100" className="flash-sticker-svg">
        <defs>
          <linearGradient id="starGrad__DOLLAR__{message}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorStart} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
          <filter id="glow__DOLLAR__{message}">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <polygon 
          points={starPoints} 
          fill={\`url(#starGrad__DOLLAR__{message})\`}
          filter={\`url(#glow__DOLLAR__{message})\`}
          className="flash-sticker-shape"
        />
        <text 
          x="50" 
          y="50" 
          textAnchor="middle" 
          dominantBaseline="central" 
          fill={textColor}
          fontSize="14"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          className="flash-sticker-text"
        >
          {message}
        </text>
      </svg>
      <style>{\`
        .flash-sticker-container {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 90px;
          height: 90px;
          z-index: 10;
          animation: stickerPulse 2s ease-in-out infinite;
        }
        .flash-sticker-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }
        .flash-sticker-shape {
          animation: colorShift 3s ease-in-out infinite;
        }
        .flash-sticker-text {
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          animation: textGlow 1.5s ease-in-out infinite;
        }
        @keyframes stickerPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(2deg); }
        }
        @keyframes colorShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        @keyframes textGlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
      \`}</style>
    </div>
  );
}
`;

const finalContent = content.replaceAll('__DOLLAR__', '$');
const dir = path.join(process.cwd(), 'components');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'FlashSticker.tsx'), finalContent, 'utf8');
console.log('✅ FlashSticker.tsx creado correctamente.');
