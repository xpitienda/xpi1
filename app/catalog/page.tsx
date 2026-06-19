import { turso } from '@/lib/turso';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import Header from '@/components/Header';
import { Suspense } from 'react';
import ProductSkeleton from '@/components/ProductSkeleton';
import ProductGrid from '@/components/ProductGrid';

export default async function CatalogPage(props: {
  searchParams: Promise<{ q?: string; category?: string; filter?: string }>
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const category = searchParams?.category || '';
  const filter = searchParams?.filter || '';

  let products: any[] = [];

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

  const filters = [
    { key: '', label: '🏪 Todos', color: '#5D4037' },
    { key: 'featured', label: '⭐ Destacados', color: '#F59E0B' },
    { key: 'day', label: ' Oferta del Día', color: '#10B981' },
    { key: 'week', label: '📅 Oferta de la Semana', color: '#3B82F6' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #FDF6E3, #FFECD2, #FDF6E3)' }}>
      <Header />

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
          <span style={{ color: '#5D4037' }}>Catálogo de </span>
          <span style={{ color: '#2E7D32' }}>Productos</span>
        </h1>

        <div style={{ maxWidth: '36rem', margin: '0 auto 2rem' }}>
          <SearchBar />
        </div>

        <CategoryFilter />

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