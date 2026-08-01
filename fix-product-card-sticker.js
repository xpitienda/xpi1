const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'components', 'ProductCard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Agregar Import
if (!content.includes("import FlashSticker from '@/components/FlashSticker'")) {
  content = content.replace(
    "import { useCart } from '@/context/CartContext';",
    "import { useCart } from '@/context/CartContext';\nimport FlashSticker from '@/components/FlashSticker';"
  );
}

// 2. Agregar Estado
if (!content.includes("activeSticker")) {
  content = content.replace(
    "const [isVisible, setIsVisible] = useState(false);",
    "const [isVisible, setIsVisible] = useState(false);\n  const [activeSticker, setActiveSticker] = useState<any>(null);"
  );
}

// 3. Agregar useEffect para buscar la pegatina
const fetchStickerEffect = `
  useEffect(() => {
    const fetchSticker = async () => {
      try {
        const res = await fetch('/api/stickers');
        if (res.ok) {
          const stickers = await res.json();
          const sticker = stickers.find((s: any) => s.product_id === product.id);
          setActiveSticker(sticker || null);
        }
      } catch (err) {
        console.error('Error cargando pegatina:', err);
      }
    };
    fetchSticker();
  }, [product.id]);
`;

if (!content.includes("fetch('/api/stickers')")) {
  content = content.replace(
    "useEffect(() => {\n    setIsVisible(true);\n  }, []);",
    "useEffect(() => {\n    setIsVisible(true);\n  }, []);" + fetchStickerEffect
  );
}

// 4. Agregar el JSX del componente dentro de la tarjeta
if (!content.includes("<FlashSticker")) {
  const cardDivMatch = content.match(/(<div\s+className=\{`product-card[^`]*`\}\s+style=\{\{)/);
  if (cardDivMatch) {
    const stickerJSX = `
          {activeSticker && (
            <FlashSticker 
              message={activeSticker.message}
              points={activeSticker.points}
              colorStart={activeSticker.color_start}
              colorEnd={activeSticker.color_end}
              textColor={activeSticker.text_color}
            />
          )}
`;
    content = content.replace(cardDivMatch[0], cardDivMatch[0] + stickerJSX);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ ProductCard.tsx actualizado exitosamente con FlashSticker.');
