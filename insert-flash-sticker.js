const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'components', 'ProductCard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Buscar el cierre del style del div principal e insertar el FlashSticker justo después
const searchStr = "position: 'relative'\n      }}>\n        {/* Banner de oferta */}";

const replacement = `position: 'relative'
      }}>
        {/* Pegatina Relámpago */}
        {activeSticker && (
          <FlashSticker 
            message={activeSticker.message}
            points={activeSticker.points}
            colorStart={activeSticker.color_start}
            colorEnd={activeSticker.color_end}
            textColor={activeSticker.text_color}
          />
        )}

        {/* Banner de oferta */}`;

if (!content.includes("Pegatina Relámpago")) {
  content = content.replace(searchStr, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ FlashSticker insertado correctamente en ProductCard.tsx');
} else {
  console.log('ℹ️ El FlashSticker ya está insertado.');
}
