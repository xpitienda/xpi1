const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'catalog', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Agregar import del componente carrusel al inicio
if (!content.includes('AdvancedBannersCarousel')) {
  content = "import AdvancedBannersCarousel from '@/components/AdvancedBannersCarousel';\n" + content;
}

// 2. Agregar función getAdvancedBanners (después de getBanners existente)
const getAdvancedBannersFunc = `
async function getAdvancedBanners() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await turso.execute({
      sql: \`SELECT * FROM advanced_banners 
            WHERE is_active = 1 
            AND (start_date IS NULL OR start_date <= ?) 
            AND (end_date IS NULL OR end_date >= ?)
            ORDER BY display_order ASC, created_at DESC\`,
      args: [today, today]
    });
    return JSON.parse(JSON.stringify(result.rows || []));
  } catch (error) {
    console.error('Error cargando banners avanzados:', error);
    return [];
  }
}
`;

if (!content.includes('getAdvancedBanners')) {
  content = content.replace(
    'export default async function CatalogPage',
    getAdvancedBannersFunc + '\nexport default async function CatalogPage'
  );
}

// 3. Cargar los banners avanzados junto con los otros
if (!content.includes('const advancedBanners = await getAdvancedBanners()')) {
  content = content.replace(
    '  const banners = await getBanners();',
    '  const banners = await getBanners();\n  const advancedBanners = await getAdvancedBanners();'
  );
}

// 4. Insertar el carrusel después de la sección de banners de texto
// Buscamos el cierre del style tag de los banners existentes y agregamos el carrusel después
const carouselInsertion = `
      {/* CARRUSEL DE BANNERS VISUALES (IMÁGENES) */}
      <AdvancedBannersCarousel banners={advancedBanners} />
`;

if (!content.includes('CARRUSEL DE BANNERS VISUALES')) {
  content = content.replace(
    /(\s*<\/style>\s*\n)/,
    '$1' + carouselInsertion
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Carrusel integrado en el catálogo (sin tocar los banners de texto existentes).');
