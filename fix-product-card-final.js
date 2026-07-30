const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'components', 'ProductCard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Asegurar que setIsCartOpen esté en el destructuring de useCart
if (!content.includes('setIsCartOpen')) {
  content = content.replace(
    'const { addToCart, isInCart, cart } = useCart();',
    'const { addToCart, isInCart, cart, setIsCartOpen } = useCart();'
  );
}

// 2. Buscar el cierre de la llamada a addToCart y agregar setIsCartOpen(true) justo después
// Buscamos "stock: product.stock, });" que es el final único de esa llamada
if (!content.includes('setIsCartOpen(true);')) {
  content = content.replace(
    'quantity: 1, stock: product.stock, });',
    'quantity: 1, stock: product.stock, });\n    setIsCartOpen(true);'
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ ProductCard.tsx actualizado: Ahora abre el carrito lateral al agregar un producto.');
