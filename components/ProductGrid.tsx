'use client';

import ProductCard from '@/components/ProductCard';

interface ProductGridProps {
  products: any[];
  viewMode?: 'grid' | 'list' | 'carousel';
}

export default function ProductGrid({ products, viewMode = 'grid' }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6B2D8B', background: 'white', borderRadius: '1.5rem', border: '2px solid #1B8A3B', marginTop: '2rem' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>🔍 No se encontraron productos</p>
        <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>Intenta con otros términos de búsqueda o categorías.</p>
      </div>
    );
  }

  // Estilos del contenedor según el modo de vista
  const getContainerStyle = () => {
    switch (viewMode) {
      case 'list':
        return {
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        };
      case 'carousel':
        return {
          display: 'flex',
          overflowX: 'auto',
          gap: '1.5rem',
          padding: '1rem 0.5rem 2rem 0.5rem',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin',
          scrollbarColor: '#6B2D8B #F3E8FF',
          WebkitOverflowScrolling: 'touch', // Suavidad en iOS
        };
      case 'grid':
      default:
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem',
        };
    }
  };

  return (
    <div style={getContainerStyle()}>
      {products.map((product) => (
        <div 
          key={product.id} 
          style={{
            // En carrusel, las tarjetas tienen ancho fijo y no se encogen
            flex: viewMode === 'carousel' ? '0 0 280px' : '1',
            scrollSnapAlign: viewMode === 'carousel' ? 'start' : undefined,
            // En lista, ocupan todo el ancho disponible
            width: viewMode === 'list' ? '100%' : 'auto',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Pasamos viewMode al ProductCard para que se adapte internamente si lo necesita */}
          <ProductCard product={product} viewMode={viewMode} />
        </div>
      ))}
    </div>
  );
}