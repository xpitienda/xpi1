import AdvancedBannersCarousel from '@/components/AdvancedBannersCarousel';
﻿import NavBar from '@/components/NavBar';
import { turso } from '@/lib/turso';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import Header from '@/components/Header';
import { Suspense } from 'react';
import ProductSkeleton from '@/components/ProductSkeleton';
import ProductGrid from '@/components/ProductGrid';

// Cargar categorías desde el servidor
async function getCategoriesTree() {
  try {
    const result = await turso.execute('SELECT * FROM categories ORDER BY parent_id, name');
    const allCategories = result.rows || [];

    // Construir árbol jerárquico
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    allCategories.forEach((cat: any) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    allCategories.forEach((cat: any) => {
      const categoryNode = categoryMap.get(cat.id);
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        const parent = categoryMap.get(cat.parent_id);
        parent.children.push(categoryNode);
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
    console.error('Error cargando banners:', error);
    return [];
  }
}


async function getAdvancedBanners() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await turso.execute({
      sql: `SELECT * FROM advanced_banners 
            WHERE is_active = 1 
            AND (start_date IS NULL OR start_date <= ?) 
            AND (end_date IS NULL OR end_date >= ?)
            ORDER BY display_order ASC, created_at DESC`,
      args: [today, today]
    });
    return JSON.parse(JSON.stringify(result.rows || []));
  } catch (error) {
    console.error('Error cargando banners avanzados:', error);
    return [];
  }
}

export default async function CatalogPage(props: {
  searchParams: Promise<{ q?: string; category?: string; filter?: string }>
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const category = searchParams?.category || '';
  const filter = searchParams?.filter || '';
  let products: any[] = [];

  // Cargar categorías y productos en paralelo
  const [categoriesTree] = await Promise.all([
    getCategoriesTree(),
    (async () => {
      try {
        let sql = 'SELECT * FROM catalog WHERE is_active = 1';
        let args: (string | number)[] = [];
        if (query) {
          sql += ' AND (name LIKE ? OR description LIKE ?)';
          args.push(`%${query}%`, `%${query}%`);
        }
        if (category && category !== 'Todas') {
          sql += ' AND category = ?';
          args.push(category);
        }
        if (filter === 'featured') {
          sql += ' AND is_featured = 1';
        } else if (filter === 'day') {
          sql += ' AND offer_type = ?';
          args.push('day');
        } else if (filter === 'week') {
          sql += ' AND offer_type = ?';
          args.push('week');
        }
        sql += ' ORDER BY created_at DESC';
        const result = await turso.execute({ sql, args });
        return JSON.parse(JSON.stringify(result.rows || []));
      } catch (error) {
        console.error('Error cargando productos:', error);
        return [];
      }
    })()
  ]);

  try {
    let sql = 'SELECT * FROM catalog WHERE is_active = 1';
    let args: (string | number)[] = [];
    if (query) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      args.push(`%${query}%`, `%${query}%`);
    }
    if (category && category !== 'Todas') {
      sql += ' AND category = ?';
      args.push(category);
    }
    if (filter === 'featured') {
      sql += ' AND is_featured = 1';
    } else if (filter === 'day') {
      sql += ' AND offer_type = ?';
      args.push('day');
    } else if (filter === 'week') {
      sql += ' AND offer_type = ?';
      args.push('week');
    }
    sql += ' ORDER BY created_at DESC';
    const result = await turso.execute({ sql, args });
    products = JSON.parse(JSON.stringify(result.rows || []));
  } catch (error) {
    console.error('Error cargando productos:', error);
    products = [];
  }

  const banners = await getBanners();
  const advancedBanners = await getAdvancedBanners();

  const filters = [
    { key: '', label: '🏪 Todos', color: '#5D4037' },
    { key: 'featured', label: '⭐ Destacados', color: '#F59E0B' },
    { key: 'day', label: '🔥 Oferta del Día', color: '#10B981' },
    { key: 'week', label: '📅 Oferta de la Semana', color: '#3B82F6' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #FDF6E3, #FFECD2, #FDF6E3)' }}>
      <Header />

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
          <style>{`
            @keyframes scroll-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }
            .marquee-content {
              animation: scroll-left 25s linear infinite;
            }
          `}</style>

      {/* CARRUSEL DE BANNERS VISUALES (IMÁGENES) */}
      <AdvancedBannersCarousel banners={advancedBanners} />
        </>
      )}
      <NavBar />
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem 0 1rem' }}>
        
        {/* Título y SearchBar en la misma línea */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: 0 }}>
            <span style={{ color: '#5D4037' }}>Catálogo de </span>
            <span style={{ color: '#2E7D32' }}>Productos</span>
          </h1>
          <div style={{ minWidth: '280px', maxWidth: '360px' }}>
            <SearchBar />
          </div>
        </div>

        {/* Pasar categorías precargadas al componente cliente */}
        <CategoryFilter initialCategories={categoriesTree} />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', margin: '2rem 0' }}>
          {filters.map((f) => {
            const isActive = filter === f.key;
            return (
              <a
                key={f.key}
                href={`/catalog?${new URLSearchParams({
                  ...(query ? { q: query } : {}),
                  ...(category ? { category } : {}),
                  ...(f.key ? { filter: f.key } : {}),
                })}`}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '2rem',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  background: isActive ? f.color : 'white',
                  color: isActive ? 'white' : f.color,
                  border: `2px solid ${f.color}`,
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {f.label}
              </a>
            );
          })}
        </div>

        {(query || (category && category !== 'Todas') || filter) && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: '#5D4037' }}>
              {query && <span>Buscando: <strong style={{ color: '#2E7D32' }}>"{query}"</strong></span>}
              {query && (category || filter) && <span> | </span>}
              {category && category !== 'Todas' && <span>Categoría: <strong style={{ color: '#2E7D32' }}>{category}</strong></span>}
              {(query || (category && category !== 'Todas')) && filter && <span> | </span>}
              {filter && (
                <span>
                  Filtro:{' '}
                  <strong style={{ color: filters.find(f => f.key === filter)?.color }}>
                    {filters.find(f => f.key === filter)?.label}
                  </strong>
                </span>
              )}
              <span style={{ color: '#8D6E63', marginLeft: '0.5rem' }}>({products.length} productos)</span>
            </p>
          </div>
        )}

        <Suspense fallback={
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            {[...Array(10)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        }>
          <ProductGrid products={products} />
        </Suspense>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
