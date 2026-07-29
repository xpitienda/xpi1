const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'admin', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Agregar botón de Banners Visuales si no existe
if (!content.includes('advanced-banners')) {
  const newButton = `
        <button 
          onClick={() => router.push('/admin/advanced-banners')} 
          style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', padding: '1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          <span>🖼️</span>
          <span>Gestión de Banners Visuales (Imágenes)</span>
        </button>
`;

  // Insertar después del botón de Gestión de Banners (texto)
  if (content.includes("router.push('/admin/banners')")) {
    content = content.replace(
      /(router\.push\('\/admin\/banners'\)[^}]*<\/button>\s*\n)/,
      '$1' + newButton
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Botón de Banners Visuales agregado en el admin principal.');
  } else {
    console.log('️ No se encontró el patrón exacto. El botón se puede agregar manualmente.');
  }
} else {
  console.log('️ El botón ya existe.');
}
