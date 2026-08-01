const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'components', 'FlashSticker.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Cambiar la posición de top: -10px; right: -10px a top: 10px; right: 10px
content = content.replace(
  'top: -10px;\n          right: -10px;',
  'top: 10px;\n          right: 10px;'
);

// También ajustar el tamaño para que se vea mejor dentro de la tarjeta
content = content.replace(
  'width: 90px;\n          height: 90px;',
  'width: 80px;\n          height: 80px;'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ FlashSticker reposicionado dentro del área visible.');
