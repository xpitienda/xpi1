import { turso } from '@/lib/turso';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import Header from '@/components/Header';

export default async function CatalogPage(props: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const category = searchParams?.category || '';

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

    sql += ' ORDER BY created_at DESC';

    const result = await turso.execute({ sql, args });
    products = JSON.parse(JSON.stringify(result.rows || []));
  } catch (error) {
    console.error('Error cargando productos:', error);
    products = [];
  }

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

        {(query || (category && category !== 'Todas')) && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: '#5D4037' }}>
              {query && <span>Buscando: <strong style={{ color: '#2E7D32' }}>"{query}"</strong></span>}
              {query && category && category !== 'Todas' && <span> | </span>}
              {category && category !== 'Todas' && <span>Categoría: <strong style={{ color: '#2E7D32' }}>{category}</strong></span>}
              <span style={{ color: '#8D6E63', marginLeft: '0.5rem' }}>({products.length} productos)</span>
            </p>
          </div>
        )}

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: '1rem', padding: '2rem', maxWidth: '28rem', margin: '0 auto', border: '1px solid rgba(224,122,95,0.3)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '1.125rem', color: '#5D4037', marginBottom: '0.5rem' }}>No se encontraron productos.</p>
              <p style={{ color: '#8D6E63' }}>Intenta con otros filtros.</p>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;