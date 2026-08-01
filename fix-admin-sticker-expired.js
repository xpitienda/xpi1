const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'admin', 'stickers', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Reemplazar la lógica de isExpired para que compare solo fechas
content = content.replace(
  'const isExpired = new Date(sticker.end_date) < new Date();',
  `const isExpired = (() => {
              const today = new Date().toISOString().split('T')[0];
              return sticker.end_date < today;
            })();`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Lógica de "Caducada" corregida en el panel admin.');
