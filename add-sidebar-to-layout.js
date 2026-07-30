const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'layout.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Agregar GlobalCartSidebar justo antes del cierre del CartProvider
content = content.replace(
  '</ImageModalProvider>\n            </ToastProvider>\n          </AdminAuthProvider>\n        </CartProvider>',
  '</ImageModalProvider>\n            </ToastProvider>\n          </AdminAuthProvider>\n          <GlobalCartSidebar />\n        </CartProvider>'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ GlobalCartSidebar agregado dentro del CartProvider correctamente.');
