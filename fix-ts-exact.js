const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'admin', 'advanced-banners', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Reemplazo EXACTO de la línea que causa el error
content = content.replace(
  'const file = e.target.files[0];',
  'const file = e.target.files?.[0];'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Error de TypeScript corregido: Se agregó el operador opcional (?) a e.target.files');
