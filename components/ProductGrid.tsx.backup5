'use client';

import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: any[] }) {
  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: '1rem', padding: '2rem', maxWidth: '28rem', margin: '0 auto', border: '1px solid rgba(224,122,95,0.3)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '1.125rem', color: '#5D4037', marginBottom: '0.5rem' }}>No se encontraron productos.</p>
          <p style={{ color: '#8D6E63' }}>Intenta con otros filtros.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="product-grid">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <style jsx>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-top: 2rem;
        }
        @media (min-width: 640px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
        }
        @media (min-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}