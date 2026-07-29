const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'admin', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

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

  // Buscar el botón de banners de texto y agregar el nuevo justo después
  const searchStr = "router.push('/admin/banners')";
  if (content.includes(searchStr)) {
      const idx = content.indexOf(searchStr);
      const closeIdx = content.indexOf('</button>', idx);
      if (closeIdx !== -1) {
          const insertPos = closeIdx + '</button>'.length;
          content = content.slice(0, insertPos) + newButton + content.slice(insertPos);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log('✅ Botón de Banners Visuales agregado correctamente.');
      } else {
          console.log('No se encontró el cierre del botón anterior.');
      }
  } else {
      console.log('No se encontró el botón de banners de texto para usar de referencia.');
  }
} else {
  console.log('El botón ya existe en el archivo.');
}
