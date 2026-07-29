const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'admin', 'advanced-banners', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Corregir la validación de null para e.target.files
content = content.replace(
  'const archivo = e.target.files[0];',
  'const archivo = e.target.files?.[0];'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Validación de null corregida con operador opcional.');
