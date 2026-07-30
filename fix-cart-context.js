const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'context', 'CartContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Agregar isCartOpen e setIsCartOpen a la interfaz CartContextType
if (!content.includes('isCartOpen: boolean;')) {
  content = content.replace(
    /total: number;\s*\};/,
    'total: number;\n  isCartOpen: boolean;\n  setIsCartOpen: (open: boolean) => void;\n};'
  );
}

// 2. Agregar el estado isCartOpen en el CartProvider
if (!content.includes('const [isCartOpen, setIsCartOpen] = useState(false);')) {
  content = content.replace(
    /const \[saveCustomerData, setSaveCustomerData\] = useState\(false\);/,
    'const [saveCustomerData, setSaveCustomerData] = useState(false);\n  const [isCartOpen, setIsCartOpen] = useState(false);'
  );
}

// 3. Agregar isCartOpen e setIsCartOpen al objeto que retorna el contexto
if (!content.includes('isCartOpen,')) {
  content = content.replace(
    /total,\s*\};/,
    'total,\n    isCartOpen,\n    setIsCartOpen,\n  };'
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ CartContext.tsx actualizado correctamente con isCartOpen.');
