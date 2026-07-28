const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'catalog', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Agregar la función getBanners después de getCategoriesTree
const getBannersFunc = `
async function getBanners() {
  try {
    const result = await turso.execute('SELECT * FROM banners WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC');
    return JSON.parse(JSON.stringify(result.rows || []));
  } catch (error) {
    console.error('Error cargando banners:', error);
    return [];
  }
}
`;

// Insertar justo antes de "export default async function CatalogPage"
content = content.replace(
  'export default async function CatalogPage',
  getBannersFunc + '\nexport default async function CatalogPage'
);

// 2. Cargar los banners antes del return
content = content.replace(
  '  const filters = [',
  '  const banners = await getBanners();\n\n  const filters = ['
);

// 3. Insertar el JSX de los banners justo después de <Header />
const bannerJSX = `
      {/* SECCIÓN DE BANNERS Y ANUNCIOS */}
      {banners.length > 0 && (
        <>
          {banners.filter((b: any) => b.type === 'static').map((b: any) => (
            <div key={b.id} style={{ background: b.background_color, color: b.text_color, padding: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {b.link_url ? <a href={b.link_url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{b.text}</a> : b.text}
            </div>
          ))}
          {banners.filter((b: any) => b.type === 'rolling').map((b: any) => (
            <div key={b.id} style={{ background: b.background_color, color: b.text_color, padding: '12px 0', overflow: 'hidden', whiteSpace: 'nowrap', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div className="marquee-content" style={{ display: 'inline-block', paddingLeft: '100%' }}>
                <span style={{ marginRight: '50px', fontWeight: 'bold', fontSize: '1.1rem' }}>{b.text}</span>
                <span style={{ marginRight: '50px', fontWeight: 'bold', fontSize: '1.1rem' }}>{b.text}</span>
              </div>
            </div>
          ))}
          <style>{\`
            @keyframes scroll-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }
            .marquee-content {
              animation: scroll-left 25s linear infinite;
            }
          \`}</style>
        </>
      )}
`;

content = content.replace(
  '      <Header />\n      <NavBar />',
  '      <Header />\n' + bannerJSX + '      <NavBar />'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Banners integrados en la página del catálogo correctamente.');
