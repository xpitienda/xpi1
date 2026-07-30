const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'context', 'CartContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Agregar isCartOpen al tipo CartContextType
content = content.replace(
  '  subtotal: number;\n  total: number;\n};',
  '  subtotal: number;\n  total: number;\n  isCartOpen: boolean;\n  setIsCartOpen: (open: boolean) => void;\n};'
);

// 2. Agregar el estado isCartOpen en el CartProvider
content = content.replace(
  '  const [saveCustomerData, setSaveCustomerData] = useState(false);',
  '  const [saveCustomerData, setSaveCustomerData] = useState(false);\n  const [isCartOpen, setIsCartOpen] = useState(false);'
);

// 3. Agregar isCartOpen e setIsCartOpen al valor del contexto
content = content.replace(
  '    clearCustomerInfo,\n    subtotal,\n    total,\n  };',
  '    clearCustomerInfo,\n    subtotal,\n    total,\n    isCartOpen,\n    setIsCartOpen,\n  };'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ CartContext actualizado con isCartOpen.');
