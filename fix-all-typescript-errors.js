const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'admin', 'advanced-banners', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Agregar tipos TypeScript a TODOS los parámetros 'e' que falten
content = content.replace(
  'const handleSubmit = async (e) => {',
  'const handleSubmit = async (e: React.FormEvent) => {'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Tipo TypeScript agregado a handleSubmit (React.FormEvent)');
