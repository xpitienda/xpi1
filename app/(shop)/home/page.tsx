'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, Star, ArrowRight, Zap, Eye, Flame, Calendar } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  category?: string;
  is_featured?: number;
  offer_type?: string | null;
  offer_price?: number | null;
}

export default function HomePage() {
  const router = useRouter();
  const [featuredByCategory, setFeaturedByCategory] = useState<Record<string, Product[]>>({});
  const [dayOffers, setDayOffers] = useState<Product[]>([]);
  const [weekOffers, setWeekOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 Cargando productos destacados...');
        const res = await fetch('/api/featured-products');
        const data = await res.json();
        
        console.log('📥 Datos recibidos:', data);
        
        // Guardar info de debug
        setDebugInfo(`Destacados: ${data.featured?.length || 0} | Día: ${data.dayOffers?.length || 0} | Semana: ${data.weekOffers?.length || 0}`);
        
        // Agrupar destacados por categoría
        const grouped: Record<string, Product[]> = {};
        const featuredList = data.featured || [];
        
        featuredList.forEach((product: Product) => {
          const cat = product.category || 'General';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(product);
        });
        
        console.log('📂 Productos agrupados por categoría:', grouped);
        
        setFeaturedByCategory(grouped);
        setDayOffers(data.dayOffers || []);
        setWeekOffers(data.weekOffers || []);
      } catch (error) {
        console.error('❌ Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const PLACEHOLDER_IMAGE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23e5e7eb" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="40">📦</text></svg>';

  const renderProductCard = (product: Product, index: number, showBadge = true) => {
    const imageUrl = product.image_url && product.image_url.trim() !== ''
      ? product.image_url
      : PLACEHOLDER_IMAGE;

    const isHovered = hoveredProduct === product.id;
    const hasOffer = product.offer_type && product.offer_price;
    const discount = hasOffer ? Math.round(((product.price - (product.offer_price || 0)) / product.price) * 100) : 0;

    return (
      <div
        key={product.id}
        onMouseEnter={() => setHoveredProduct(product.id)}
        onMouseLeave={() => setHoveredProduct(null)}
        style={{
          background: 'linear-gradient(135deg, rgba(45,27,78,0.95) 0%, rgba(26,11,46,0.95) 100%)',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          border: isHovered ? '3px solid #00FF41' : '3px solid #2E7D32',
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(0,255,65,0.4), 0 0 30px rgba(46,125,50,0.5)'
            : '0 10px 30px -5px rgba(46,125,50,0.3)',
          transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {showBadge && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#1a0b2e',
            padding: '0.5rem 1rem',
            borderRadius: '2rem',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            zIndex: 10,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            #{index + 1} Destacado
          </div>
        )}

        {hasOffer && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'linear-gradient(135deg, #10b981 0%, #dc2626 100%)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '2rem',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            zIndex: 10,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            animation: 'pulse 2s infinite'
          }}>
            🔥 -{discount}%
          </div>
        )}

        <div
          onClick={() => router.push(`/catalog?product=${product.id}`)}
          style={{
            position: 'relative',
            aspectRatio: '1/1',
            overflow: 'hidden',
            background: '#FDF6E3',
            cursor: 'pointer'
          }}
        >
          <img
            src={imageUrl}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.5s ease'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />
          {product.category && (
            <span style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              background: 'rgba(46,125,50,0.95)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              border: '2px solid #00FF41',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
              {product.category}
            </span>
          )}
        </div>

        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{
              fontWeight: 'bold',
              color: '#fff',
              fontSize: '1.25rem',
              marginBottom: '0.5rem',
              lineHeight: 1.4
            }}>
              {product.name}
            </h3>
            {product.description && (
              <p style={{
                color: '#a78bfa',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                lineHeight: 1.5
              }}>
                {product.description.substring(0, 80)}...
              </p>
            )}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '2px solid rgba(46,125,50,0.5)'
          }}>
            <div>
              {hasOffer ? (
                <>
                  <span style={{
                    fontSize: '1rem',
                    color: '#6b7280',
                    textDecoration: 'line-through',
                    marginRight: '0.5rem'
                  }}>
                    ${product.price.toLocaleString('es-CO')}
                  </span>
                  <span style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #00FF41 0%, #00BFFF 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    ${product.offer_price?.toLocaleString('es-CO')}
                  </span>
                </>
              ) : (
                <span style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #00FF41 0%, #00BFFF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  ${product.price.toLocaleString('es-CO')}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/catalog?product=${product.id}`);
              }}
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #2E7D32 0%, #16a34a 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #00FF41',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 6px rgba(0,255,65,0.3)'
              }}
              title="Ver detalles"
            >
              <Eye style={{ width: '1.5rem', height: '1.5rem' }} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const totalFeatured = Object.values(featuredByCategory).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header className="relative z-10 border-b-2 border-[#2E7D32]/50 backdrop-blur-md bg-[#1a0b2e]/80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00FF41] to-[#00BFFF] bg-clip-text text-transparent">
            ✨ Xpi Tienda
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/catalog')}
              className="px-6 py-2 bg-gradient-to-r from-[#2E7D32] to-[#16a34a] text-white font-semibold rounded-xl border-2 border-[#00FF41]/50 hover:border-[#00FF41] transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
            >
               Catálogo
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-16 h-16 border-4 border-[#2E7D32] border-t-[#00FF41] rounded-full animate-spin"></div>
              <p className="text-purple-200 mt-4 text-xl">Cargando productos...</p>
            </div>
          ) : (
            <>
              {/* Debug info - quitar después */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', color: '#00FF41', fontFamily: 'monospace' }}>
                📊 {debugInfo}
              </div>

              {/* Ofertas del Día */}
              {dayOffers.length > 0 && (
                <section className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <Flame className="w-10 h-10 text-[#FF6B00]" />
                    <h2 className="text-4xl font-bold text-white">Ofertas del Día</h2>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                  }}>
                    {dayOffers.map((product, index) => renderProductCard(product, index, false))}
                  </div>
                </section>
              )}

              {/* Ofertas de la Semana */}
              {weekOffers.length > 0 && (
                <section className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-10 h-10 text-[#3b82f6]" />
                    <h2 className="text-4xl font-bold text-white">Ofertas de la Semana</h2>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                  }}>
                    {weekOffers.map((product, index) => renderProductCard(product, index, false))}
                  </div>
                </section>
              )}

              {/* Destacados por Categoría */}
              {totalFeatured > 0 ? (
                Object.entries(featuredByCategory).map(([category, products]) => (
                  <section key={category} className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                      <Star className="w-10 h-10 text-[#FFD700]" />
                      <h2 className="text-4xl font-bold text-white">{category}</h2>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '2rem'
                    }}>
                      {products.map((product, index) => renderProductCard(product, index, true))}
                    </div>
                  </section>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="bg-[#2d1b4e]/80 rounded-3xl p-12 border-2 border-[#2E7D32] shadow-2xl shadow-green-500/20 max-w-2xl mx-auto">
                    <p className="text-2xl text-purple-200 mb-6">No hay productos destacados aún</p>
                    <button
                      onClick={() => router.push('/catalog')}
                      className="px-8 py-3 bg-gradient-to-r from-[#2E7D32] to-[#16a34a] text-white font-bold rounded-xl border-2 border-[#00FF41] hover:border-[#00FF41]/80 transition-all transform hover:scale-105"
                    >
                      Ver Catálogo Completo
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-6 mt-12">
                <button
                  onClick={() => router.push('/catalog')}
                  className="group px-10 py-5 bg-gradient-to-r from-[#2E7D32] via-[#16a34a] to-[#2E7D32] text-white font-bold text-xl rounded-2xl border-2 border-[#00FF41] hover:border-[#00FF41]/80 transition-all transform hover:scale-105 shadow-2xl shadow-green-500/40 flex items-center gap-3"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Ver Catálogo Completo
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}