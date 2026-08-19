import AdvancedBannersCarousel from '@/components/AdvancedBannersCarousel';
import NavBar from '@/components/NavBar';
import { turso } from '@/lib/turso';
import Header from '@/components/Header';
import CatalogClient from './CatalogClient';

async function getCategoriesTree() {
  try {
    const result = await turso.execute('SELECT * FROM categories ORDER BY parent_id, name');
    const allCategories = result.rows || [];
    const categoryMap = new Map();
    const rootCategories: any[] = [];
    allCategories.forEach((cat: any) => categoryMap.set(cat.id, { ...cat, children: [] }));
    allCategories.forEach((cat: any) => {
      const categoryNode = categoryMap.get(cat.id);
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        categoryMap.get(cat.parent_id).children.push(categoryNode);
      } else {
        rootCategories.push(categoryNode);
      }
    });
    return rootCategories;
  } catch (error) {
    console.error('Error cargando categorías:', error);
    return [];
  }
}

async function getBanners() {
  try {
    const result = await turso.execute('SELECT * FROM banners WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC');
    return JSON.parse(JSON.stringify(result.rows || []));
  } catch (error) {
    return [];
  }
}

async function getAdvancedBanners() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await turso.execute({
      sql: `SELECT * FROM advanced_banners WHERE is_active = 1 AND (start_date IS NULL OR start_date <= ?) AND (end_date IS NULL OR end_date >= ?) ORDER BY display_order ASC, created_at DESC`,
      args: [today, today]
    });
    return JSON.parse(JSON.stringify(result.rows || []));
  } catch (error) {
    return [];
  }
}

// ✅ FUNCIÓN PARA OBTENER TEXTOS FLOTANTES
async function getCarouselOverlays() {
  try {
    const now = new Date().toISOString();
    const result = await turso.execute({
      sql: `SELECT * FROM carousel_overlays WHERE is_active = 1 AND starts_at <= ? AND ends_at >= ? ORDER BY created_at DESC`,
      args: [now, now]
    });
    return JSON.parse(JSON.stringify(result.rows || []));
  } catch (error) {
    return [];
  }
}

export default async function CatalogPage(props: { searchParams: Promise<{ q?: string; category?: string; filter?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const category = searchParams?.category || '';
  const filter = searchParams?.filter || '';

  // Obtenemos todos los datos en paralelo
  const [categoriesTree, products, advancedBanners, banners, overlays] = await Promise.all([
    getCategoriesTree(),
    (async () => {
      try {
        let sql = 'SELECT * FROM catalog WHERE is_active = 1';
        let args: (string | number)[] = [];
        if (query) { sql += ' AND (name LIKE ? OR description LIKE ?)'; args.push(`%${query}%`, `%${query}%`); }
        if (category && category !== 'Todas') { sql += ' AND category = ?'; args.push(category); }
        if (filter === 'featured') { sql += ' AND is_featured = 1'; }
        else if (filter === 'day') { sql += ' AND offer_type = ?'; args.push('day'); }
        else if (filter === 'week') { sql += ' AND offer_type = ?'; args.push('week'); }
        sql += ' ORDER BY created_at DESC';
        const result = await turso.execute({ sql, args });
        return JSON.parse(JSON.stringify(result.rows || []));
      } catch (error) {
        return [];
      }
    })(),
    getAdvancedBanners(),
    getBanners(),
    getCarouselOverlays() // ✅ Obtenemos los textos flotantes
  ]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #FDF6E3, #FFECD2, #FDF6E3)' }}>
      <Header />

      {/* SECCIÓN DE BANNERS Y ANUNCIOS ORIGINALES */}
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
          <style>{`
            @keyframes scroll-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }
            .marquee-content {
              animation: scroll-left 25s linear infinite;
            }
          `}</style>

          {/* CARRUSEL DE BANNERS VISUALES + TEXTOS FLOTANTES */}
          <AdvancedBannersCarousel banners={advancedBanners} overlays={overlays} />
        </>
      )}

      {/* Si no hay banners normales, mostrar solo el carrusel visual con textos flotantes */}
      {banners.length === 0 && (
        <AdvancedBannersCarousel banners={advancedBanners} overlays={overlays} />
      )}

      <NavBar />
      
      {/* ✅ AQUÍ ESTÁ LA CLAVE: Delegamos la renderización de productos y el selector de vistas a tu CatalogClient original */}
      <CatalogClient 
        initialCategories={categoriesTree}
        products={products}
        query={query}
        category={category}
        filter={filter}
      />
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;