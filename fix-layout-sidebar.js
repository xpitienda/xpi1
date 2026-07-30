const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'layout.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Eliminar el GlobalCartSidebar que está fuera
content = content.replace(/\s*<GlobalCartSidebar \/>\s*/, '');

// 2. Agregarlo dentro, justo después de {children}
content = content.replace(
  '{children}\n              </ImageModalProvider>',
  '{children}\n                <GlobalCartSidebar />\n              </ImageModalProvider>'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ GlobalCartSidebar movido dentro del CartProvider correctamente.');
