import { turso, isTursoConfigured } from '@/lib/turso';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Jean Clasico Azul', price: 89900, image_url: '/images/jeans1.jpg', category: 'Ropa', description: 'Jean de alta calidad' },
  { id: 2, name: 'Camiseta Sport', price: 45000, image_url: '/images/shirt1.jpg', category: 'Deportes', description: 'Camiseta deportiva' },
  { id: 3, name: 'Laptop Pro 15', price: 2500000, image_url: '/images/laptop1.jpg', category: 'Tecnologia', description: 'Laptop de alto rendimiento' },
  { id: 4, name: 'Zapatillas Running', price: 180000, image_url: '/images/shoes1.jpg', category: 'Deportes', description: 'Zapatillas para correr' },
  { id: 5, name: 'Vestido Elegante', price: 120000, image_url: '/images/dress1.jpg', category: 'Ropa', description: 'Vestido para ocasiones especiales' },
  { id: 6, name: 'Audifonos Bluetooth', price: 95000, image_url: '/images/headphones1.jpg', category: 'Tecnologia', description: 'Audifonos inalambricos' },
];

export default async function CatalogPage(props: { 
  searchParams: Promise<{ q?: string; category?: string }> 
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const category = searchParams?.category || '';

  let products = MOCK_PRODUCTS;

  if (isTursoConfigured) {
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
    } catch (error) {
      console.error('Turso error, using mock data:', error);
    }
  } else {
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
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          <span className="text-white">Catalogo de </span>
          <span className="text-xpi-green">Productos</span>
        </h1>
        
        {/* Search */}
        <div className="max-w-xl mx-auto mb-6">
          <SearchBar />
        </div>
        
        {/* Category Filter */}
        <CategoryFilter />

        {/* Search Results Info */}
        {(query || (category && category !== 'Todas')) && (
          <div className="text-center mb-6">
            <p className="text-gray-400">
              {query && <span>Buscando: <strong className="text-xpi-green">&quot;{query}&quot;</strong></span>}
              {query && category && category !== 'Todas' && <span> | </span>}
              {category && category !== 'Todas' && <span>Categoria: <strong className="text-xpi-green">{category}</strong></span>}
              <span className="text-gray-500 ml-2">({products.length} productos)</span>
            </p>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-gray-400 mb-2">No se encontraron productos.</p>
            <p className="text-gray-500">Intenta con otros filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
