const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'admin', 'advanced-banners', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Agregar tipo correcto al parámetro e
content = content.replace(
  'const handleFileChange = async (e) => {',
  'const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Tipo TypeScript agregado correctamente.');
