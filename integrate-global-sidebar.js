const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'layout.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Agregar import del CartSidebar y useCart (si no existe)
if (!content.includes("import CartSidebar from '@/components/CartSidebar'")) {
  content = "import CartSidebar from '@/components/CartSidebar';\n" + content;
}
if (!content.includes("import { useCart } from '@/context/CartContext'")) {
  // Lo agregamos dentro del componente Client si es necesario, o mejor, creamos un wrapper
}

// Mejor enfoque: Crear un componente wrapper para el Sidebar que use el contexto
const wrapperCode = `'use client';

import { useCart } from '@/context/CartContext';
import CartSidebar from '@/components/CartSidebar';

export default function GlobalCartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();

  return (
    <CartSidebar 
      isOpen={isCartOpen} 
      onClose={() => setIsCartOpen(false)} 
      items={cart} 
      onUpdateQuantity={updateQuantity} 
      onRemoveItem={removeFromCart} 
    />
  );
}
`;

const wrapperPath = path.join(process.cwd(), 'components', 'GlobalCartSidebar.tsx');
fs.writeFileSync(wrapperPath, wrapperCode, 'utf8');

// 2. Agregar el wrapper al layout.tsx
if (!content.includes('GlobalCartSidebar')) {
  content = content.replace(
    "import './globals.css'",
    "import './globals.css';\nimport GlobalCartSidebar from '@/components/GlobalCartSidebar';"
  );
  
  // Insertar antes del cierre del body
  content = content.replace(
    '</body>',
    '      <GlobalCartSidebar />\n    </body>'
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ GlobalCartSidebar creado e integrado en layout.tsx.');
