const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'context', 'CartContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Buscar la línea del Provider y agregar las propiedades faltantes
content = content.replace(
  'subtotal, total }}>',
  'subtotal, total, isCartOpen, setIsCartOpen }}>'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ CartContext.Provider actualizado con isCartOpen e setIsCartOpen.');
