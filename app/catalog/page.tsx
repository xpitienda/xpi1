import { turso } from '@/lib/turso';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';

export default async function CatalogPage(props: { 
  searchParams: Promise<{ q?: string; category?: string }> 
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const category = searchParams?.category || '';

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
  const products = JSON.parse(JSON.stringify(result.rows));

  return (
    <div style={{ 
      maxWidth: '1280px', 
      margin: '0 auto', 
      padding: '32px 16px',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
    }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '32px',
        textAlign: 'center',
        color: '#6B2D8B',
      }}>
        🛍️ Catálogo de Productos
      </h1>
      
      <div style={{ maxWidth: '640px', margin: '0 auto 32px' }}>
        <SearchBar />
      </div>
      
      <CategoryFilter />

      {(query || (category && category !== 'Todas')) && (
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ color: '#4b5563' }}>
            {query && <span>Buscando: <strong>"{query}"</strong></span>}
            {query && category && category !== 'Todas' && <span> | </span>}
            {category && category !== 'Todas' && <span>Categoría: <strong>{category}</strong></span>}
            <span style={{ color: '#9ca3af', marginLeft: '8px' }}>
              ({products.length} productos)
            </span>
          </p>
        </div>
      )}

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 16px' }}>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '8px' }}>
            No se encontraron productos.
          </p>
          <p style={{ color: '#9ca3af' }}>Intenta con otros filtros.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
// Evita que Next.js intente generar estáticamente
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const revalidate = 0;