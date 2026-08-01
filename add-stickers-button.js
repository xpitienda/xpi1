const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'admin', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Buscar un lugar lógico para agregar el botón (por ejemplo, cerca de otros botones de gestión)
// Vamos a agregarlo como una nueva tarjeta o botón en la grilla del admin
const newButton = `
        <a href="/admin/stickers" style={{ background: 'linear-gradient(135deg, #FF006E, #FFBE0B)', color: 'white', padding: '1.5rem', borderRadius: '0.75rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <span style={{ fontSize: '2rem' }}>⭐</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Pegatinas Relámpago</span>
          <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Gestionar ofertas y promociones</span>
        </a>
`;

// Insertar antes del cierre del div principal o después de otro botón existente
// Buscamos el último </a> o </div> de la grilla de botones
if (!content.includes('/admin/stickers')) {
  content = content.replace(
    /(<\/div>\s*<\/div>\s*<\/div>\s*<\/main>)/, 
    newButton + `\n      $1`
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Botón de Pegatinas agregado al menú de administración.');
