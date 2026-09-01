import { Metadata } from 'next';
import Link from 'next/link';
import AdvancedBannersCarousel from '@/components/AdvancedBannersCarousel';
import NavBar from '@/components/NavBar';
import { turso } from '@/lib/turso';
import Header from '@/components/Header';
import CatalogClient from './CatalogClient';

// ✅ Generación dinámica de metadata para SEO
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; filter?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params?.q || '';
  const category = params?.category || '';
  const filter = params?.filter || '';

  let title = 'Catálogo de Productos';
  let description = 'Explora nuestra amplia selección de productos con los mejores precios y envíos a todo el país.';

  if (query) {
    title = `Resultados para "${query}"`;
    description = `Encuentra los mejores productos relacionados con "${query}" en XPI Tienda. Compra segura y envíos rápidos.`;
  } else if (category && category !== 'Todas') {
    title = `Productos de ${category}`;
    description = `Compra los mejores productos de la categoría ${category} con envío seguro, garantía y los mejores precios.`;
  } else if (filter === 'featured') {
    title = 'Productos Destacados';
    description = 'Descubre nuestra selección especial de productos destacados y las mejores ofertas para ti.';
  } else if (filter === 'day' || filter === 'week') {
    const periodo = filter === 'day' ? 'del Día' : 'de la Semana';
    title = `Ofertas ${periodo}`;
    description = `Aprovecha nuestras increíbles ofertas ${periodo.toLowerCase()} con descuentos exclusivos por tiempo limitado.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

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

async function getVisitorCount() {
  try {
    await turso.execute('UPDATE page_views SET view_count = view_count + 1 WHERE id = 1');
    const result = await turso.execute('SELECT view_count FROM page_views WHERE id = 1');
    return result.rows[0]?.view_count || 0;
  } catch (error) {
    console.error('Error al obtener contador:', error);
    return 0;
  }
}

// ✅ FUNCIÓN MEJORADA: Búsqueda recursiva de TODA la jerarquía de categorías
async function getProductsWithImages(query: string, category: string, filter: string) {
  try {
    // 1. Obtener todas las categorías para mapear la jerarquía
    const catsResult = await turso.execute('SELECT id, name, parent_id FROM categories');
    const allCats = catsResult.rows || [];

    // 2. Función recursiva para obtener TODAS las subcategorías (hijos, nietos, bisnietos...)
    function getAllSubcategoryNames(categoryName: string): string[] {
      const catRecord = allCats.find((c: any) => c.name === categoryName);
      if (!catRecord) return [categoryName];
      
      const names: string[] = [categoryName];
      
      // Buscar hijos directos
      const directChildren = allCats.filter((c: any) => c.parent_id === catRecord.id);
      
      // Para cada hijo, obtener sus subcategorías recursivamente
      for (const child of directChildren) {
        names.push(...getAllSubcategoryNames(child.name));
      }
      
      return names;
    }

    let sql = 'SELECT * FROM catalog WHERE is_active = 1';
    let args: (string | number)[] = [];

    if (query) { 
      sql += ' AND (name LIKE ? OR description LIKE ?)'; 
      args.push(`%${query}%`, `%${query}%`); 
    }

    // ✅ Buscar TODA la jerarquía de categorías (padre + hijos + nietos)
    if (category && category !== 'Todas') {
      const allCategoryNames = getAllSubcategoryNames(category);
      
      if (allCategoryNames.length === 1) {
        sql += ' AND category = ?';
        args.push(allCategoryNames[0]);
      } else {
        sql += ` AND category IN (${allCategoryNames.map(() => '?').join(',')})`;
        args.push(...allCategoryNames);
      }
    }

    if (filter === 'featured') { sql += ' AND is_featured = 1'; }
    else if (filter === 'day') { sql += ' AND offer_type = ?'; args.push('day'); }
    else if (filter === 'week') { sql += ' AND offer_type = ?'; args.push('week'); }
    
    sql += ' ORDER BY created_at DESC';

    const productsResult = await turso.execute({ sql, args });
    const products = JSON.parse(JSON.stringify(productsResult.rows || []));

    // 3. Obtener todas las imágenes adicionales de todos los productos
    const productIds = products.map((p: any) => p.id);
    if (productIds.length === 0) return [];

    const imagesResult = await turso.execute({
      sql: 'SELECT product_id, id, image_url, display_order FROM product_images WHERE product_id IN (' + productIds.map(() => '?').join(',') + ') ORDER BY display_order ASC',
      args: productIds
    });

    // 4. Agrupar imágenes por product_id
    const imagesByProduct = new Map();
    (imagesResult.rows || []).forEach((img: any) => {
      if (!imagesByProduct.has(img.product_id)) {
        imagesByProduct.set(img.product_id, []);
      }
      imagesByProduct.get(img.product_id).push({
        id: Number(img.id),
        product_id: img.product_id,
        image_url: img.image_url,
        display_order: Number(img.display_order)
      });
    });

    // 5. Agregar additionalImages a cada producto
    return products.map((product: any) => ({
      ...product,
      additionalImages: imagesByProduct.get(product.id) || []
    }));

  } catch (error) {
    console.error('Error obteniendo productos con imágenes:', error);
    return [];
  }
}

export default async function CatalogPage(props: { searchParams: Promise<{ q?: string; category?: string; filter?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const category = searchParams?.category || '';
  const filter = searchParams?.filter || '';

  // Obtenemos todos los datos en paralelo
  const [categoriesTree, products, advancedBanners, banners, overlays, visitorCount] = await Promise.all([
    getCategoriesTree(),
    getProductsWithImages(query, category, filter),
    getAdvancedBanners(),
    getBanners(),
    getCarouselOverlays(),
    getVisitorCount()
  ]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #FDF6E3, #FFECD2, #FDF6E3)' }}>
      <Header />

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

          <AdvancedBannersCarousel banners={advancedBanners} overlays={overlays} />
        </>
      )}

      {banners.length === 0 && (
        <AdvancedBannersCarousel banners={advancedBanners} overlays={overlays} />
      )}

      <NavBar />

      <CatalogClient
        initialCategories={categoriesTree}
        products={products}
        query={query}
        category={category}
        filter={filter}
      />

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link
          href="/info"
          className="info-button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #9d00ff, #bf00ff)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            boxShadow: '0 4px 15px rgba(157, 0, 255, 0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
        >
          ℹ️ Centro de Información y Ayuda
        </Link>
      </div>

      <div style={{
        marginTop: '40px',
        padding: '16px 24px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
        border: '2px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#666',
        maxWidth: '450px',
        margin: '40px auto 40px auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1) inset',
        position: 'relative',
        overflow: 'hidden',
        transform: 'translateZ(0)',
        perspective: '1000px'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #00ff00, #39ff14, transparent)',
          boxShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #39ff14',
          animation: 'scanline-clockwise 3s linear infinite',
        }} />

        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #9d00ff, #bf00ff, transparent)',
          boxShadow: '0 0 10px #9d00ff, 0 0 20px #9d00ff, 0 0 30px #bf00ff',
          animation: 'scanline-counterclockwise 3s linear infinite',
        }} />

        <span style={{ position: 'relative', zIndex: '1' }}>
          Eres el visitante nro. <strong style={{ color: '#333', fontSize: '0.9rem' }}>{visitorCount.toLocaleString()}</strong> · Gracias por elegirnos 💚
        </span>

        <style>{`
          @keyframes scanline-clockwise {
            0% { transform: translateX(-100%) rotate(0deg); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(100%) rotate(360deg); opacity: 0; }
          }
          @keyframes scanline-counterclockwise {
            0% { transform: translateX(100%) rotate(0deg); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(-100%) rotate(-360deg); opacity: 0; }
          }
          .info-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(157, 0, 255, 0.5) !important;
          }
        `}</style>
      </div>

    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;