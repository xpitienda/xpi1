const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'admin', 'advanced-banners', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Corregir el nombre del campo de 'file' a 'image'
content = content.replace(
  "formDataUpload.append('file', file);",
  "formDataUpload.append('image', file);"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Campo corregido: Ahora envía la imagen como "image" (como espera la API).');
