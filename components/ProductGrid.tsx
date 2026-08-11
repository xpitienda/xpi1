'use client';

import ProductCard from './ProductCard';
import { useViewMode } from '@/lib/view-mode-context';

export default function ProductGrid({ products }: { products: any[] }) {
  const { isDesktop, isMobile } = useViewMode();

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
      <div 
        className="product-grid"
        style={{
          // Si el usuario forzó modo PC → 3 columnas (equilibrio perfecto en celular)
          ...(isDesktop && !isMobile ? { gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' } : {}),
          // Si el usuario forzó modo móvil → 2 columnas
          ...(isMobile ? { gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' } : {}),
        }}
      >
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <style jsx>{`
        .product-grid {
          display: grid;
          margin-top: 2rem;
          /* Valores por defecto (modo Auto) */
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        
        /* Solo aplicar media queries si NO se forzó un modo */
        ${(!isDesktop && !isMobile) ? `
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
        ` : ''}
      `}</style>
    </>
  );
}