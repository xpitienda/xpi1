import { turso, isTursoConfigured } from '@/lib/turso';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import Header from '@/components/Header';
import { ShoppingBag } from 'lucide-react';

// Datos mock para preview
const MOCK_PRODUCTS = [
  { id: '1', name: 'Jean Slim Fit Premium', description: 'Jean de alta calidad con corte moderno', price: 89900, image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', category: 'Ropa' },
  { id: '2', name: 'Camiseta Algodon Organico', description: 'Camiseta suave y ecologica', price: 45000, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', category: 'Ropa' },
  { id: '3', name: 'Zapatillas Running Pro', description: 'Maximo rendimiento y comodidad', price: 180000, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'Deportes' },
  { id: '4', name: 'Smartwatch Fitness', description: 'Monitor de salud y notificaciones', price: 299000, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'Tecnologia' },
  { id: '5', name: 'Lampara LED Moderna', description: 'Iluminacion elegante para tu hogar', price: 75000, image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', category: 'Hogar' },
  { id: '6', name: 'Auriculares Bluetooth', description: 'Sonido premium inalambrico', price: 120000, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category: 'Tecnologia' },
  { id: '7', name: 'Mochila Urban', description: 'Resistente al agua, multiples compartimentos', price: 95000, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category: 'Deportes' },
  { id: '8', name: 'Set de Cocina Premium', description: 'Utensilios de acero inoxidable', price: 150000, image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', category: 'Hogar' },
];

export default async function CatalogPage(props: { 
  searchParams: Promise<{ q?: string; category?: string }> 
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const category = searchParams?.category || '';

  let products = MOCK_PRODUCTS;

  // Only try Turso if configured
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
    // Filter mock data locally
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
    <div className="min-h-screen bg-gradient-to-br from-xpi-purple-dark via-xpi-purple to-xpi-purple-light">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-xpi-purple-dark/50 to-xpi-purple-glow/30 text-white py-12 px-4 border-b border-xpi-purple-glow/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-xpi-green rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="text-white">Catalogo de </span>
              <span className="text-xpi-green">Productos</span>
            </h1>
          </div>
          
          <p className="text-gray-300 text-lg max-w-2xl">
            Explora nuestra seleccion de productos de calidad. Encuentra lo que necesitas al mejor precio.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-[73px] z-40 bg-xpi-purple-dark/95 backdrop-blur-md border-b border-xpi-purple-glow/30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-96">
              <SearchBar />
            </div>
            <div className="w-full md:flex-1 overflow-x-auto">
              <CategoryFilter />
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {(query || (category && category !== 'Todas')) && (
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <div className="bg-xpi-purple-light/30 rounded-lg px-4 py-3 flex flex-wrap items-center gap-2 border border-xpi-purple-glow/30">
            <span className="text-gray-300">Resultados para:</span>
            {query && (
              <span className="bg-xpi-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                &quot;{query}&quot;
              </span>
            )}
            {category && category !== 'Todas' && (
              <span className="bg-xpi-green text-white px-3 py-1 rounded-full text-sm font-medium">
                {category}
              </span>
            )}
            <span className="text-gray-400 ml-auto">
              {products.length} producto{products.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-xpi-purple-light/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-400 mb-6">
              Intenta con otros filtros o terminos de busqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
