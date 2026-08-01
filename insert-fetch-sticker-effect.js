const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'components', 'ProductCard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// El código del useEffect que vamos a insertar
const fetchStickerEffect = `
  useEffect(() => {
    const fetchSticker = async () => {
      try {
        const res = await fetch('/api/stickers');
        if (res.ok) {
          const stickers = await res.json();
          console.log('Total stickers from API:', stickers.length);
          const sticker = stickers.find((s: any) => s.product_id === product.id);
          console.log('Product ID:', product.id, 'Found sticker:', sticker);
          setActiveSticker(sticker || null);
        }
      } catch (err) {
        console.error('Error cargando pegatina:', err);
      }
    };
    fetchSticker();
  }, [product.id]);
`;

// Buscar el primer useEffect existente (el de setIsVisible) e insertar después
const useEffectPattern = /useEffect\(\(\) => \{\s*setIsVisible\(true\);\s*\}, \[\]\);/;

if (useEffectPattern.test(content)) {
  content = content.replace(useEffectPattern, (match) => match + fetchStickerEffect);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ useEffect de pegatinas insertado correctamente.');
} else {
  console.log('❌ No se encontró el patrón del useEffect. Intentando otro enfoque...');
  
  // Enfoque alternativo: buscar cualquier useEffect y agregar después
  const altPattern = /useEffect\(\(\) => \{[^}]*setIsVisible[^}]*\}, \[\]\);/;
  if (altPattern.test(content)) {
    content = content.replace(altPattern, (match) => match + fetchStickerEffect);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ useEffect insertado con patrón alternativo.');
  } else {
    console.log('❌ No se pudo insertar automáticamente. Revisa el archivo manualmente.');
  }
}
