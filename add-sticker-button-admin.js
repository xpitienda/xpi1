const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'admin', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Buscar el botón de Ventas y agregar el de Pegatinas justo después
const searchStr = "<button onClick={() => router.push('/admin/sales')} style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #10b981', cursor: 'pointer' }}>📊 Ventas</button>";

const newButton = `
            <button onClick={() => router.push('/admin/stickers')} style={{ background: 'linear-gradient(135deg, #FF006E, #FFBE0B)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #FFBE0B', cursor: 'pointer' }}>⭐ Pegatinas</button>`;

if (!content.includes("/admin/stickers")) {
  content = content.replace(searchStr, searchStr + newButton);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Botón de Pegatinas agregado exitosamente al panel de administración.');
} else {
  console.log('ℹ️ El botón de Pegatinas ya existe en el archivo.');
}
