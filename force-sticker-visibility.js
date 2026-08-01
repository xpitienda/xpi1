const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'components', 'FlashSticker.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Reemplazar los estilos con versiones más agresivas para garantizar visibilidad
content = content.replace(
  /position: 'absolute';\s*top: \d+px;\s*right: \d+px;\s*width: \d+px;\s*height: \d+px;\s*z-index: \d+;/,
  `position: 'absolute';
          top: '5px';
          right: '5px';
          width: '85px';
          height: '85px';
          z-index: 9999;
          pointerEvents: 'none';`
);

// También asegurar que el contenedor padre tenga position: relative
// (ya lo tiene, pero lo reforzamos)
content = content.replace(
  /@keyframes stickerPulse \{/,
  `.flash-sticker-container {
          position: absolute !important;
          top: 5px !important;
          right: 5px !important;
          width: 85px !important;
          height: 85px !important;
          z-index: 9999 !important;
          pointer-events: none !important;
        }
        @keyframes stickerPulse {`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ FlashSticker con estilos forzados para máxima visibilidad.');
