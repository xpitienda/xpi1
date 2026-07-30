const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'components', 'ProductCard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Agregar setIsCartOpen al destructuring de useCart
content = content.replace(
  'const { addToCart, isInCart, cart } = useCart();',
  'const { addToCart, isInCart, cart, setIsCartOpen } = useCart();'
);

// 2. Agregar setIsCartOpen(true) después de addToCart en handleAddToCart
content = content.replace(
  "addToCart({\n      id: product.id,\n      name: product.name,\n      price: priceToAdd,\n      image: product.image_url || PLACEHOLDER_IMAGE,\n      quantity: 1, stock: product.stock, });\n    showToast(`${product.name} agregado al carrito`, 'success');",
  "addToCart({\n      id: product.id,\n      name: product.name,\n      price: priceToAdd,\n      image: product.image_url || PLACEHOLDER_IMAGE,\n      quantity: 1, stock: product.stock, });\n    setIsCartOpen(true);\n    showToast(`${product.name} agregado al carrito`, 'success');"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ ProductCard actualizado para abrir el carrito lateral.');
