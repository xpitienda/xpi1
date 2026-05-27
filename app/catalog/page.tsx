import { turso } from '@/lib/turso';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import Header from '@/components/Header';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Jean Clasico', price: 89900, category: 'Ropa', image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', description: 'Jean de alta calidad' },
  { id: 2, name: 'Camiseta Deportiva', price: 45000, category: 'Deportes', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', description: 'Camiseta comoda' },
  { id: 3, name: 'Audifonos Bluetooth', price: 125000, category: 'Tecnologia', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', description: 'Audio premium' },
  { id: 4, name: 'Zapatillas Running', price: 199000, category: 'Deportes', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', description: 'Maxima comodidad' },
  { id: 5, name: 'Reloj Smart', price: 350000, category: 'Tecnologia', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', description: 'Reloj inteligente' },
  { id: 6, name: 'Mochila Urbana', price: 75000, category: 'Accesorios', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', description: 'Mochila resistente' },
];

export default async function CatalogPage(props: { 
  searchParams: Promise<{ q?: string; category?: string }> 
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const category = searchParams?.category || '';

  let products = MOCK_PRODUCTS;

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

    sql += ' ORDER BY id DESC';

    const result = await turso.execute({ sql, args });
    if (result.rows.length > 0) {
      products = JSON.parse(JSON.stringify(result.rows));
    }
  } catch {
    // Use mock data - filter locally
    if (query) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (category && category !== 'Todas') {
      products = products.filter(p => p.category === category);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d1b4e] via-[#1a0a2e] to-[#2d1b4e]">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          <span className="text-white">Catalogo de </span>
          <span className="text-xpi-green">Productos</span>
        </h1>
        
        <div className="max-w-xl mx-auto mb-8">
          <SearchBar />
        </div>
        
        <CategoryFilter />

        {(query || (category && category !== 'Todas')) && (
          <div className="text-center mb-6">
            <p className="text-gray-400">
              {query && <span>Buscando: <strong className="text-white">{'"'}{query}{'"'}</strong></span>}
              {query && category && category !== 'Todas' && <span> | </span>}
              {category && category !== 'Todas' && <span>Categoria: <strong className="text-white">{category}</strong></span>}
              <span className="text-gray-500 ml-2">({products.length} productos)</span>
            </p>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-gray-400 mb-2">No se encontraron productos.</p>
            <p className="text-gray-500">Intenta con otros filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
